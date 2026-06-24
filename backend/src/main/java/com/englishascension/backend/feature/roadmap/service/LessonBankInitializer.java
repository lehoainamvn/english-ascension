package com.englishascension.backend.feature.roadmap.service;

import com.englishascension.backend.feature.roadmap.entity.*;
import com.englishascension.backend.feature.roadmap.repository.*;
import com.englishascension.backend.feature.study.entity.StudyContent;
import com.englishascension.backend.feature.study.repository.StudyContentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class LessonBankInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(LessonBankInitializer.class);

    private final LessonRepository lessonRepository;
    private final StudyContentRepository studyContentRepository;
    private final LearningModuleRepository learningModuleRepository;
    private final LearningRoadmapRepository learningRoadmapRepository;

    public LessonBankInitializer(
            LessonRepository lessonRepository,
            StudyContentRepository studyContentRepository,
            LearningModuleRepository learningModuleRepository,
            LearningRoadmapRepository learningRoadmapRepository) {
        this.lessonRepository = lessonRepository;
        this.studyContentRepository = studyContentRepository;
        this.learningModuleRepository = learningModuleRepository;
        this.learningRoadmapRepository = learningRoadmapRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (lessonRepository.count() > 0) {
            log.info("Lesson Bank already initialized. Verifying Preset Roadmaps mapping...");
            List<Lesson> allLessons = lessonRepository.findAll();
            mapLessonsToPresets(allLessons);
            return;
        }

        log.info("Initializing Lesson Bank...");

        // 1. Scan StudyContent (GRAMMAR, LISTENING, READING)
        List<StudyContent> studyContents = studyContentRepository.findAll();
        Map<String, Lesson> lessonMap = new HashMap<>();

        for (StudyContent content : studyContents) {
            String typeStr = content.getType().toUpperCase();
            LessonType type;
            try {
                type = LessonType.valueOf(typeStr);
            } catch (IllegalArgumentException e) {
                continue; // Skip EXAM, DOCUMENT, etc.
            }

            String level = content.getCategory().toUpperCase().trim();
            if (!level.matches("^[ABC][12]$")) {
                level = "A1"; // Fallback
            }

            double difficultyScore = getDifficultyScore(level);
            String id = typeStr.toLowerCase() + "_" + content.getId();

            Lesson lesson = Lesson.builder()
                    .id(id)
                    .title(content.getTitle())
                    .type(type)
                    .level(level)
                    .difficultyScore(difficultyScore)
                    .topic(content.getTitle())
                    .contentId(content.getId())
                    .build();

            lessonRepository.save(lesson);
            lessonMap.put(id, lesson);
        }

        // 2. Scan Vocabulary Topics (LearningModule where category = "TỪ VỰNG CEFR")
        List<LearningModule> vocabModules = learningModuleRepository.findByCategory("TỪ VỰNG CEFR");
        for (LearningModule module : vocabModules) {
            String title = module.getTitle();
            String level = "A1";
            if (title.toUpperCase().startsWith("A1")) level = "A1";
            else if (title.toUpperCase().startsWith("A2")) level = "A2";
            else if (title.toUpperCase().startsWith("B1")) level = "B1";
            else if (title.toUpperCase().startsWith("B2")) level = "B2";
            else if (title.toUpperCase().startsWith("C1")) level = "C1";

            double difficultyScore = getDifficultyScore(level);
            String id = "vocab_" + module.getId();

            Lesson lesson = Lesson.builder()
                    .id(id)
                    .title(module.getTitle())
                    .type(LessonType.VOCABULARY)
                    .level(level)
                    .difficultyScore(difficultyScore)
                    .topic(module.getTitle())
                    .contentId(module.getId())
                    .build();

            lessonRepository.save(lesson);
            lessonMap.put(id, lesson);
        }

        // Flush lessons to ensure they exist before building prerequisites
        lessonRepository.flush();

        // 3. Build Prerequisite Graph
        log.info("Seeding prerequisite graph relationships...");
        List<Lesson> allLessons = lessonRepository.findAll();

        // Group lessons by level
        Map<String, List<Lesson>> lessonsByLevel = allLessons.stream()
                .collect(Collectors.groupingBy(Lesson::getLevel));

        for (Map.Entry<String, List<Lesson>> entry : lessonsByLevel.entrySet()) {
            String level = entry.getKey();
            List<Lesson> levelLessons = entry.getValue();

            // Sequential progression per skill
            Map<LessonType, List<Lesson>> lessonsByType = levelLessons.stream()
                    .collect(Collectors.groupingBy(Lesson::getType));

            for (Map.Entry<LessonType, List<Lesson>> typeEntry : lessonsByType.entrySet()) {
                List<Lesson> sortedSkillLessons = typeEntry.getValue().stream()
                        .sorted(Comparator.comparing(Lesson::getId))
                        .toList();

                for (int i = 1; i < sortedSkillLessons.size(); i++) {
                    Lesson current = sortedSkillLessons.get(i);
                    Lesson prev = sortedSkillLessons.get(i - 1);
                    current.getPrerequisites().add(prev);
                }
            }

            // Cross-skill prerequisites:
            // Grammar depends on at least one Vocabulary lesson of the same level
            List<Lesson> levelVocab = lessonsByType.getOrDefault(LessonType.VOCABULARY, Collections.emptyList())
                    .stream().sorted(Comparator.comparing(Lesson::getId)).toList();
            List<Lesson> levelGrammar = lessonsByType.getOrDefault(LessonType.GRAMMAR, Collections.emptyList())
                    .stream().sorted(Comparator.comparing(Lesson::getId)).toList();
            List<Lesson> levelListening = lessonsByType.getOrDefault(LessonType.LISTENING, Collections.emptyList())
                    .stream().sorted(Comparator.comparing(Lesson::getId)).toList();
            List<Lesson> levelReading = lessonsByType.getOrDefault(LessonType.READING, Collections.emptyList())
                    .stream().sorted(Comparator.comparing(Lesson::getId)).toList();

            if (!levelVocab.isEmpty()) {
                Lesson firstVocab = levelVocab.get(0);
                for (Lesson grammar : levelGrammar) {
                    grammar.getPrerequisites().add(firstVocab);
                }
            }

            if (!levelGrammar.isEmpty()) {
                Lesson firstGrammar = levelGrammar.get(0);
                for (Lesson listening : levelListening) {
                    listening.getPrerequisites().add(firstGrammar);
                }
                for (Lesson reading : levelReading) {
                    reading.getPrerequisites().add(firstGrammar);
                }
            }

            // Concrete requested examples:
            // grammar_to_be (if exists) -> grammar_present_simple
            // vocab_basic -> listening_basic
            seedSpecificPrerequisites(levelGrammar, levelVocab, levelListening);
        }

        // Sequential inter-level progression:
        // First lesson of Level L depends on the last lesson of Level L-1
        String[] levels = {"A1", "A2", "B1", "B2", "C1"};
        for (int i = 1; i < levels.length; i++) {
            List<Lesson> prevLevelLessons = lessonsByLevel.getOrDefault(levels[i - 1], Collections.emptyList());
            List<Lesson> currLevelLessons = lessonsByLevel.getOrDefault(levels[i], Collections.emptyList());

            if (!prevLevelLessons.isEmpty() && !currLevelLessons.isEmpty()) {
                // Find a terminal lesson of level L-1
                Lesson lastPrevLesson = prevLevelLessons.get(prevLevelLessons.size() - 1);
                // Make all starting lessons of level L depend on it
                for (Lesson curr : currLevelLessons) {
                    if (curr.getPrerequisites().isEmpty()) {
                        curr.getPrerequisites().add(lastPrevLesson);
                    }
                }
            }
        }

        // Save prerequisite relations
        lessonRepository.saveAll(allLessons);
        lessonRepository.flush();

        // 4. Map Preset Roadmaps to CEFR level templates
        mapLessonsToPresets(allLessons);

        log.info("Lesson Bank initialization completed successfully! Total lessons seeded: {}", allLessons.size());
    }

    private void mapLessonsToPresets(List<Lesson> allLessons) {
        log.info("Mapping lessons to Preset Roadmaps...");
        List<LearningRoadmap> presets = learningRoadmapRepository.findByIsPresetTrueOrderByIdAsc();
        for (LearningRoadmap roadmap : presets) {
            String cefr = roadmap.getCefrLevel().toUpperCase().trim();
            List<Lesson> roadmapLessons = allLessons.stream()
                    .filter(l -> l.getLevel().equalsIgnoreCase(cefr))
                    .sorted(Comparator.comparing(Lesson::getId))
                    .collect(Collectors.toList());

            roadmap.setLessons(roadmapLessons);
            learningRoadmapRepository.save(roadmap);
            log.info("Mapped {} lessons to Preset Roadmap {}", roadmapLessons.size(), cefr);
        }
    }

    private double getDifficultyScore(String level) {
        return switch (level) {
            case "A1" -> 1.0;
            case "A2" -> 2.0;
            case "B1" -> 3.0;
            case "B2" -> 4.0;
            case "C1" -> 5.0;
            default   -> 1.0;
        };
    }

    private void seedSpecificPrerequisites(List<Lesson> grammarLessons, List<Lesson> vocabLessons, List<Lesson> listeningLessons) {
        Lesson toBe = grammarLessons.stream()
                .filter(l -> l.getTitle().toLowerCase().contains("to be"))
                .findFirst().orElse(null);
        Lesson presentSimple = grammarLessons.stream()
                .filter(l -> l.getTitle().toLowerCase().contains("present simple"))
                .findFirst().orElse(null);

        if (toBe != null && presentSimple != null) {
            presentSimple.getPrerequisites().add(toBe);
        }

        Lesson vocabBasic = vocabLessons.stream()
                .filter(l -> l.getTitle().toLowerCase().contains("chào hỏi"))
                .findFirst().orElse(null);
        Lesson listeningBasic = listeningLessons.stream()
                .filter(l -> l.getTitle().toLowerCase().contains("nghe") || l.getTitle().toLowerCase().contains("dialogue"))
                .findFirst().orElse(null);

        if (vocabBasic != null && listeningBasic != null) {
            listeningBasic.getPrerequisites().add(vocabBasic);
        }
    }
}
