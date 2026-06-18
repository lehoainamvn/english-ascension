package com.englishascension.backend.feature.roadmap;

import com.englishascension.backend.feature.roadmap.ModuleRequest;
import com.englishascension.backend.feature.roadmap.RoadmapRequest;
import com.englishascension.backend.feature.study.Flashcard;
import com.englishascension.backend.feature.roadmap.LearningModule;
import com.englishascension.backend.feature.roadmap.LearningRoadmap;
import com.englishascension.backend.feature.study.Question;
import com.englishascension.backend.feature.user.UserProgress;
import com.englishascension.backend.feature.study.FlashcardRepository;
import com.englishascension.backend.feature.roadmap.LearningModuleRepository;
import com.englishascension.backend.feature.roadmap.LearningRoadmapRepository;
import com.englishascension.backend.feature.study.QuestionRepository;
import com.englishascension.backend.feature.user.UserProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminRoadmapService {

    private final LearningRoadmapRepository roadmapRepository;
    private final LearningModuleRepository moduleRepository;
    private final FlashcardRepository flashcardRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository progressRepository;

    public AdminRoadmapService(
            LearningRoadmapRepository roadmapRepository,
            LearningModuleRepository moduleRepository,
            FlashcardRepository flashcardRepository,
            QuestionRepository questionRepository,
            UserProgressRepository progressRepository) {
        this.roadmapRepository = roadmapRepository;
        this.moduleRepository = moduleRepository;
        this.flashcardRepository = flashcardRepository;
        this.questionRepository = questionRepository;
        this.progressRepository = progressRepository;
    }

    public List<LearningRoadmap> getAllPresetRoadmaps() {
        return roadmapRepository.findByIsPresetTrueOrderByIdAsc();
    }

    public LearningRoadmap getPresetRoadmapById(Long id) {
        return roadmapRepository.findById(id)
                .filter(LearningRoadmap::isPreset)
                .orElse(null);
    }

    @Transactional
    public LearningRoadmap createPresetRoadmap(RoadmapRequest request) {
        LearningRoadmap roadmap = LearningRoadmap.builder()
                .cefrLevel(request.getCefrLevel())
                .toeicEquivalent(request.getToeicEquivalent())
                .overallEvaluation(request.getOverallEvaluation())
                .thumbnailEmoji(request.getThumbnailEmoji())
                .difficultyLabel(request.getDifficultyLabel())
                .isPreset(true)
                .build();

        List<LearningModule> modules = new ArrayList<>();
        if (request.getModules() != null) {
            for (int i = 0; i < request.getModules().size(); i++) {
                ModuleRequest mReq = request.getModules().get(i);
                LearningModule module = LearningModule.builder()
                        .roadmap(roadmap)
                        .title(mReq.getTitle())
                        .description(mReq.getDescription())
                        .category(mReq.getCategory())
                        .orderIndex(mReq.getOrderIndex() != null ? mReq.getOrderIndex() : (i + 1))
                        .status(i == 0 ? "IN_PROGRESS" : "LOCKED")
                        .build();
                modules.add(module);
            }
        }
        roadmap.setModules(modules);
        roadmap.setModulesCount(modules.size());
        return roadmapRepository.save(roadmap);
    }

    @Transactional
    public LearningRoadmap updatePresetRoadmap(Long id, RoadmapRequest request) {
        LearningRoadmap roadmap = roadmapRepository.findById(id)
                .filter(LearningRoadmap::isPreset)
                .orElse(null);
        if (roadmap == null) {
            return null;
        }

        roadmap.setCefrLevel(request.getCefrLevel());
        roadmap.setToeicEquivalent(request.getToeicEquivalent());
        roadmap.setOverallEvaluation(request.getOverallEvaluation());
        roadmap.setThumbnailEmoji(request.getThumbnailEmoji());
        roadmap.setDifficultyLabel(request.getDifficultyLabel());

        List<LearningModule> existingModules = roadmap.getModules();
        Map<Long, LearningModule> existingMap = new HashMap<>();
        for (LearningModule m : existingModules) {
            existingMap.put(m.getId(), m);
        }

        List<LearningModule> updatedModules = new ArrayList<>();
        List<Long> retainedIds = new ArrayList<>();

        if (request.getModules() != null) {
            for (int i = 0; i < request.getModules().size(); i++) {
                ModuleRequest mReq = request.getModules().get(i);
                if (mReq.getId() != null && existingMap.containsKey(mReq.getId())) {
                    LearningModule m = existingMap.get(mReq.getId());
                    m.setTitle(mReq.getTitle());
                    m.setDescription(mReq.getDescription());
                    m.setCategory(mReq.getCategory());
                    m.setOrderIndex(mReq.getOrderIndex() != null ? mReq.getOrderIndex() : (i + 1));
                    updatedModules.add(m);
                    retainedIds.add(m.getId());
                } else {
                    LearningModule m = LearningModule.builder()
                            .roadmap(roadmap)
                            .title(mReq.getTitle())
                            .description(mReq.getDescription())
                            .category(mReq.getCategory())
                            .orderIndex(mReq.getOrderIndex() != null ? mReq.getOrderIndex() : (i + 1))
                            .status(i == 0 ? "IN_PROGRESS" : "LOCKED")
                            .build();
                    updatedModules.add(m);
                }
            }
        }

        // Clean up removed modules' associated flashcards, questions, progress
        for (LearningModule m : existingModules) {
            if (!retainedIds.contains(m.getId())) {
                List<Flashcard> fcs = flashcardRepository.findByModuleId(m.getId());
                flashcardRepository.deleteAll(fcs);

                List<Question> qs = questionRepository.findBySourceTypeAndParentId("ROADMAP_QUIZ", m.getId());
                questionRepository.deleteAll(qs);

                List<UserProgress> prog = progressRepository.findByResourceTypeAndResourceId("MODULE", m.getId());
                progressRepository.deleteAll(prog);
            }
        }

        // Trigger Jpa orphan removal on cleared elements
        roadmap.getModules().clear();
        roadmap.getModules().addAll(updatedModules);
        roadmap.setModulesCount(updatedModules.size());

        return roadmapRepository.save(roadmap);
    }

    @Transactional
    public boolean deletePresetRoadmap(Long id) {
        LearningRoadmap roadmap = roadmapRepository.findById(id)
                .filter(LearningRoadmap::isPreset)
                .orElse(null);
        if (roadmap == null) {
            return false;
        }

        List<LearningModule> modules = roadmap.getModules();
        List<Long> moduleIds = new ArrayList<>();
        for (LearningModule m : modules) {
            moduleIds.add(m.getId());
        }

        if (!moduleIds.isEmpty()) {
            // Delete user progress of the modules
            List<UserProgress> moduleProgress = progressRepository.findByResourceTypeAndResourceIdIn("MODULE", moduleIds);
            progressRepository.deleteAll(moduleProgress);

            // Delete flashcards and questions for all modules
            for (Long moduleId : moduleIds) {
                List<Flashcard> fcs = flashcardRepository.findByModuleId(moduleId);
                flashcardRepository.deleteAll(fcs);

                List<Question> qs = questionRepository.findBySourceTypeAndParentId("ROADMAP_QUIZ", moduleId);
                questionRepository.deleteAll(qs);
            }
        }

        // Delete user progress of the roadmap itself
        List<UserProgress> roadmapProgress = progressRepository.findByResourceTypeAndResourceId("ROADMAP", id);
        progressRepository.deleteAll(roadmapProgress);

        // Delete the roadmap itself (cascades to modules)
        roadmapRepository.delete(roadmap);
        return true;
    }
}
