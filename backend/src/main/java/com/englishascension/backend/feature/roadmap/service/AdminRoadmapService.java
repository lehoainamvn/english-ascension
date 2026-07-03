package com.englishascension.backend.feature.roadmap.service;

import com.englishascension.backend.feature.roadmap.dto.ModuleRequest;
import com.englishascension.backend.feature.roadmap.dto.RoadmapRequest;
import com.englishascension.backend.feature.roadmap.entity.LearningModule;
import com.englishascension.backend.feature.roadmap.entity.LearningRoadmap;
import com.englishascension.backend.feature.roadmap.entity.Lesson;
import com.englishascension.backend.feature.roadmap.repository.LearningModuleRepository;
import com.englishascension.backend.feature.roadmap.repository.LearningRoadmapRepository;
import com.englishascension.backend.feature.roadmap.repository.LessonRepository;
import com.englishascension.backend.feature.roadmap.repository.UserRoadmapRepository;
import com.englishascension.backend.feature.roadmap.entity.UserRoadmap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class AdminRoadmapService {

    private final LearningRoadmapRepository roadmapRepository;
    private final LearningModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final UserRoadmapRepository userRoadmapRepository;

    public AdminRoadmapService(
            LearningRoadmapRepository roadmapRepository,
            LearningModuleRepository moduleRepository,
            LessonRepository lessonRepository,
            UserRoadmapRepository userRoadmapRepository) {
        this.roadmapRepository = roadmapRepository;
        this.moduleRepository = moduleRepository;
        this.lessonRepository = lessonRepository;
        this.userRoadmapRepository = userRoadmapRepository;
    }

    public List<LearningRoadmap> getAllPresetRoadmaps() {
        return roadmapRepository.findByIsPresetTrueOrderByIdAsc();
    }

    public LearningRoadmap getPresetRoadmapById(Long id) {
        return roadmapRepository.findById(id)
                .filter(LearningRoadmap::isPreset)
                .orElse(null);
    }

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
        return roadmapRepository.save(roadmap);
    }

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

        // Clean up removed modules and their lessons
        for (LearningModule m : existingModules) {
            if (!retainedIds.contains(m.getId())) {
                List<Lesson> lessons = lessonRepository.findByModuleId(m.getId());
                for (Lesson lesson : lessons) {
                    lessonRepository.delete(lesson);
                }
            }
        }

        roadmap.getModules().clear();
        roadmap.getModules().addAll(updatedModules);

        return roadmapRepository.save(roadmap);
    }

    public boolean deletePresetRoadmap(Long id) {
        LearningRoadmap roadmap = roadmapRepository.findById(id)
                .filter(LearningRoadmap::isPreset)
                .orElse(null);
        if (roadmap == null) {
            return false;
        }

        // Xóa cascade: modules → lessons
        List<LearningModule> modules = roadmap.getModules();
        for (LearningModule m : modules) {
            List<Lesson> lessons = lessonRepository.findByModuleId(m.getId());
            for (Lesson lesson : lessons) {
                lessonRepository.delete(lesson);
            }
        }

        // Xóa tất cả enrollment của user với roadmap này
        List<UserRoadmap> enrollments = userRoadmapRepository.findAll()
                .stream()
                .filter(ur -> ur.getRoadmap() != null && ur.getRoadmap().getId().equals(id))
                .toList();
        userRoadmapRepository.deleteAll(enrollments);

        roadmapRepository.delete(roadmap);
        return true;
    }
}
