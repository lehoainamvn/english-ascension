package com.englishascension.backend.feature.placementtest.service;

import com.englishascension.backend.feature.ai.service.GroqService;
import com.englishascension.backend.feature.placementtest.dto.PlacementTestRequest;
import com.englishascension.backend.feature.roadmap.entity.*;
import com.englishascension.backend.feature.roadmap.repository.*;
import com.englishascension.backend.feature.study.entity.Question;
import com.englishascension.backend.feature.study.repository.QuestionRepository;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class PlacementTestService {

    private static final Logger log = LoggerFactory.getLogger(PlacementTestService.class);

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final LearningRoadmapRepository roadmapRepository;
    private final LessonRepository lessonRepository;
    private final UserLearningPathRepository userLearningPathRepository;
    private final UserLearningPathLessonRepository userLearningPathLessonRepository;
    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    public PlacementTestService(
            UserRepository userRepository,
            QuestionRepository questionRepository,
            LearningRoadmapRepository roadmapRepository,
            LessonRepository lessonRepository,
            UserLearningPathRepository userLearningPathRepository,
            UserLearningPathLessonRepository userLearningPathLessonRepository,
            GroqService groqService) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.roadmapRepository = roadmapRepository;
        this.lessonRepository = lessonRepository;
        this.userLearningPathRepository = userLearningPathRepository;
        this.userLearningPathLessonRepository = userLearningPathLessonRepository;
        this.groqService = groqService;
        this.objectMapper = new ObjectMapper();
    }

    public List<Question> getPlacementTestQuestions() {
        List<Question> allQuestions = questionRepository.findAllRandom();
        
        List<Question> vocab = allQuestions.stream().filter(q -> "VOCABULARY".equals(q.getType())).limit(3).toList();
        List<Question> grammar = allQuestions.stream().filter(q -> "GRAMMAR".equals(q.getType())).limit(3).toList();
        List<Question> listening = allQuestions.stream().filter(q -> "LISTENING".equals(q.getType())).limit(3).toList();
        List<Question> reading = allQuestions.stream().filter(q -> "READING".equals(q.getType())).limit(3).toList();
        
        List<Question> testQuestions = new ArrayList<>();
        testQuestions.addAll(vocab);
        testQuestions.addAll(grammar);
        testQuestions.addAll(listening);
        testQuestions.addAll(reading);
        
        Collections.shuffle(testQuestions);
        return testQuestions;
    }

    public Map<String, Object> submitPlacementTest(PlacementTestRequest submitRequest, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<PlacementTestRequest.AnswerRequest> userAnswers = submitRequest.getAnswers();
        if (userAnswers == null || userAnswers.isEmpty()) {
            throw new IllegalArgumentException("No answers provided");
        }

        // Calculate scores per skill
        int correctCount = 0;
        int vocabCorrect = 0;
        int grammarCorrect = 0;
        int listeningCorrect = 0;
        int readingCorrect = 0;

        for (PlacementTestRequest.AnswerRequest answer : userAnswers) {
            Question q = questionRepository.findById(answer.getQuestionId()).orElse(null);
            if (q == null) continue;

            boolean isCorrect = q.getCorrectOption().trim().equalsIgnoreCase(answer.getSelectedOption().trim());
            if (isCorrect) {
                correctCount++;
                String qType = q.getType().toUpperCase();
                if ("VOCABULARY".equals(qType)) vocabCorrect++;
                else if ("GRAMMAR".equals(qType)) grammarCorrect++;
                else if ("LISTENING".equals(qType)) listeningCorrect++;
                else if ("READING".equals(qType)) readingCorrect++;
            }
        }

        Map<LessonType, Integer> scores = new HashMap<>();
        scores.put(LessonType.VOCABULARY, vocabCorrect);
        scores.put(LessonType.GRAMMAR, grammarCorrect);
        scores.put(LessonType.LISTENING, listeningCorrect);
        scores.put(LessonType.READING, readingCorrect);

        // Determine Level and Preset Roadmap ID
        String level = "A1";
        long presetId = 100;
        if (correctCount <= 3) {
            level = "A1"; presetId = 100;
        } else if (correctCount <= 6) {
            level = "A2"; presetId = 101;
        } else if (correctCount <= 8) {
            level = "B1"; presetId = 102;
        } else if (correctCount <= 10) {
            level = "B2"; presetId = 103;
        } else {
            level = "C1"; presetId = 104;
        }

        LearningRoadmap preset = roadmapRepository.findById(presetId).orElse(null);
        if (preset == null) {
            throw new RuntimeException("Preset Roadmap " + presetId + " not found!");
        }

        // AI Personalization - Reordering
        List<Lesson> presetLessons = preset.getLessons();
        List<String> orderedIds = null;

        try {
            String systemPrompt = "You are an AI Education Expert. Your task is to analyze the student's test results, " +
                    "determine their CEFR level, select a preset roadmap, and personalize/reorder the lessons based on " +
                    "strengths/weaknesses, strictly respecting the prerequisite graph. Return ONLY a raw JSON object and nothing else.";

            Map<String, Object> inputPromptMap = new HashMap<>();
            inputPromptMap.put("placementTestBreakdown", Map.of(
                    "vocabulary", vocabCorrect + "/3",
                    "grammar", grammarCorrect + "/3",
                    "listening", listeningCorrect + "/3",
                    "reading", readingCorrect + "/3"
            ));
            inputPromptMap.put("targetGoal", submitRequest.getTargetGoal() != null ? submitRequest.getTargetGoal() : "TOEIC 550");
            inputPromptMap.put("cefrLevel", level);
            inputPromptMap.put("roadmapName", preset.getCefrLevel() + "_CORE");

            List<Map<String, Object>> lessonsInfo = presetLessons.stream().map(l -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", l.getId());
                    m.put("title", l.getTitle());
                    m.put("type", l.getType().name());
                    m.put("difficultyScore", l.getDifficultyScore());
                    m.put("topic", l.getTopic() != null ? l.getTopic() : "");
                    return m;
            }).collect(Collectors.toList());
            inputPromptMap.put("lessons", lessonsInfo);

            List<Map<String, String>> prerequisiteGraph = new ArrayList<>();
            for (Lesson l : presetLessons) {
                for (Lesson prereq : l.getPrerequisites()) {
                    prerequisiteGraph.add(Map.of(
                            "lessonId", l.getId(),
                            "prerequisiteId", prereq.getId()
                    ));
                }
            }
            inputPromptMap.put("prerequisites", prerequisiteGraph);

            String userPrompt = objectMapper.writeValueAsString(inputPromptMap);
            log.info("Requesting personalized AI reordering for user: {}", user.getEmail());
            String response = groqService.generateJsonResponse(systemPrompt, userPrompt);

            JsonNode root = objectMapper.readTree(response);
            JsonNode idsNode = root.get("orderedLessonIds");
            if (idsNode != null && idsNode.isArray()) {
                orderedIds = new ArrayList<>();
                for (JsonNode n : idsNode) {
                    orderedIds.add(n.asText());
                }
            }
        } catch (Exception e) {
            log.warn("Failed to generate personalized path via AI, falling back to programmatic topological sort. Error: {}", e.getMessage());
        }

        // Programmatic Fallback Topological Sort
        List<Lesson> orderedLessons;
        if (orderedIds != null && validateLessonIds(orderedIds, presetLessons)) {
            Map<String, Lesson> lessonMap = presetLessons.stream().collect(Collectors.toMap(Lesson::getId, l -> l));
            orderedLessons = orderedIds.stream().map(lessonMap::get).collect(Collectors.toList());
            log.info("AI reordering applied successfully.");
        } else {
            orderedLessons = programmaticReorder(presetLessons, scores);
            log.info("Programmatic fallback reordering applied.");
        }

        // Delete existing path
        userLearningPathRepository.findByUserId(user.getId()).ifPresent(path -> {
            userLearningPathRepository.delete(path);
            userLearningPathRepository.flush();
        });

        // Save new UserLearningPath
        UserLearningPath userPath = UserLearningPath.builder()
                .user(user)
                .roadmap(preset)
                .build();
        userPath = userLearningPathRepository.save(userPath);

        List<UserLearningPathLesson> pathLessons = new ArrayList<>();
        for (int i = 0; i < orderedLessons.size(); i++) {
            UserLearningPathLesson pathLesson = UserLearningPathLesson.builder()
                    .learningPath(userPath)
                    .lesson(orderedLessons.get(i))
                    .orderIndex(i + 1)
                    .status(i == 0 ? "IN_PROGRESS" : "LOCKED")
                    .build();
            pathLessons.add(userLearningPathLessonRepository.save(pathLesson));
        }
        userPath.setLessons(pathLessons);
        userLearningPathRepository.save(userPath);

        // Grant RPG rewards
        int currentExp = user.getExp();
        int currentLevel = user.getLevel();
        int currentCoins = user.getCoins();

        currentExp += 100;
        currentCoins += 50;

        boolean leveledUp = false;
        while (true) {
            int expNeeded = currentLevel * 100;
            if (currentExp >= expNeeded) {
                currentExp -= expNeeded;
                currentLevel++;
                leveledUp = true;
            } else {
                break;
            }
        }

        user.setExp(currentExp);
        user.setLevel(currentLevel);
        user.setCoins(currentCoins);

        if (leveledUp) {
            user.setCharacterTitle(calculateTitle(currentLevel));
        }
        userRepository.save(user);

        return buildRoadmapResponse(userPath);
    }

    public Map<String, Object> getUserRoadmap(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        UserLearningPath path = userLearningPathRepository.findByUserId(user.getId()).orElse(null);
        if (path == null) return null;
        return buildRoadmapResponse(path);
    }

    private boolean validateLessonIds(List<String> ids, List<Lesson> presetLessons) {
        if (ids.size() != presetLessons.size()) return false;
        Set<String> presetIds = presetLessons.stream().map(Lesson::getId).collect(Collectors.toSet());
        return new HashSet<>(ids).equals(presetIds);
    }

    private List<Lesson> programmaticReorder(List<Lesson> presetLessons, Map<LessonType, Integer> scores) {
        Map<String, Lesson> lessonMap = presetLessons.stream().collect(Collectors.toMap(Lesson::getId, l -> l));
        Map<String, Set<String>> adj = new HashMap<>();
        Map<String, Integer> inDegree = new HashMap<>();
        
        for (Lesson lesson : presetLessons) {
            adj.putIfAbsent(lesson.getId(), new HashSet<>());
            inDegree.putIfAbsent(lesson.getId(), 0);
        }
        
        for (Lesson lesson : presetLessons) {
            for (Lesson prereq : lesson.getPrerequisites()) {
                if (lessonMap.containsKey(prereq.getId())) {
                    adj.get(prereq.getId()).add(lesson.getId());
                    inDegree.put(lesson.getId(), inDegree.get(lesson.getId()) + 1);
                }
            }
        }
        
        List<Lesson> result = new ArrayList<>();
        List<Lesson> candidates = new ArrayList<>();
        for (Lesson lesson : presetLessons) {
            if (inDegree.get(lesson.getId()) == 0) {
                candidates.add(lesson);
            }
        }
        
        while (!candidates.isEmpty()) {
            // Sort by weaknesses first (lower scores prioritized)
            candidates.sort((a, b) -> {
                int scoreA = scores.getOrDefault(a.getType(), 3);
                int scoreB = scores.getOrDefault(b.getType(), 3);
                if (scoreA != scoreB) {
                    return Integer.compare(scoreA, scoreB);
                }
                return a.getId().compareTo(b.getId());
            });
            
            Lesson selected = candidates.remove(0);
            result.add(selected);
            
            for (String neighborId : adj.get(selected.getId())) {
                inDegree.put(neighborId, inDegree.get(neighborId) - 1);
                if (inDegree.get(neighborId) == 0) {
                    candidates.add(lessonMap.get(neighborId));
                }
            }
        }
        
        if (result.size() < presetLessons.size()) {
            for (Lesson l : presetLessons) {
                if (!result.contains(l)) {
                    result.add(l);
                }
            }
        }
        return result;
    }

    private Map<String, Object> buildRoadmapResponse(UserLearningPath path) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", path.getId());
        response.put("cefrLevel", path.getRoadmap().getCefrLevel());
        response.put("toeicEquivalent", path.getRoadmap().getToeicEquivalent());
        response.put("overallEvaluation", path.getRoadmap().getOverallEvaluation());
        
        List<Map<String, Object>> modulesList = new ArrayList<>();
        for (UserLearningPathLesson pl : path.getLessons()) {
            Map<String, Object> mod = new HashMap<>();
            mod.put("id", pl.getId());
            mod.put("title", pl.getLesson().getTitle());
            mod.put("description", pl.getLesson().getTopic() != null ? pl.getLesson().getTopic() : "");
            mod.put("status", pl.getStatus());
            mod.put("orderIndex", pl.getOrderIndex());
            mod.put("category", pl.getLesson().getType().name());
            modulesList.add(mod);
        }
        response.put("modules", modulesList);
        return response;
    }

    private String calculateTitle(int level) {
        if (level >= 100) return "Language Legend";
        if (level >= 80) return "Grand Sage";
        if (level >= 60) return "Master";
        if (level >= 40) return "Knight";
        if (level >= 20) return "Scholar";
        if (level >= 10) return "Student";
        if (level >= 5) return "Adventurer";
        return "Novice";
    }
}
