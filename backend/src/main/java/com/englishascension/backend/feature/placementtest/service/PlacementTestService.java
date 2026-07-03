package com.englishascension.backend.feature.placementtest.service;

import com.englishascension.backend.feature.ai.service.GroqService;
import com.englishascension.backend.feature.placementtest.dto.PlacementTestRequest;
import com.englishascension.backend.feature.study.entity.Question;
import com.englishascension.backend.feature.study.repository.QuestionRepository;
import com.englishascension.backend.feature.roadmap.entity.*;
import com.englishascension.backend.feature.roadmap.repository.*;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.entity.UserGameStats;
import com.englishascension.backend.feature.user.entity.UserLessonState;
import com.englishascension.backend.feature.user.repository.UserLessonStateRepository;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class PlacementTestService {

    private static final Logger log = LoggerFactory.getLogger(PlacementTestService.class);

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final LearningRoadmapRepository roadmapRepository;
    private final UserRoadmapRepository userRoadmapRepository;
    private final UserLessonStateRepository userLessonStateRepository;
    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    public PlacementTestService(
            UserRepository userRepository,
            QuestionRepository questionRepository,
            LearningRoadmapRepository roadmapRepository,
            UserRoadmapRepository userRoadmapRepository,
            UserLessonStateRepository userLessonStateRepository,
            GroqService groqService) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.roadmapRepository = roadmapRepository;
        this.userRoadmapRepository = userRoadmapRepository;
        this.userLessonStateRepository = userLessonStateRepository;
        this.groqService = groqService;
        this.objectMapper = new ObjectMapper();
    }

    public List<Question> getPlacementTestQuestions() {
        List<Question> allQuestions = questionRepository.findBySourceType("PLACEMENT_TEST");
        Collections.shuffle(allQuestions);
        
        List<Question> testQuestions = allQuestions.stream().limit(12).collect(Collectors.toList());
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
            if (answer == null || answer.getQuestionId() == null) continue;
            Question q = questionRepository.findById(answer.getQuestionId()).orElse(null);
            if (q == null) continue;

            String selectedOpt = answer.getSelectedOption();
            if (selectedOpt == null) continue;

            boolean isCorrect = q.getOptions().stream()
                    .anyMatch(opt -> opt.getOptionKey() != null && opt.getOptionKey().equalsIgnoreCase(selectedOpt.trim()) && opt.isCorrect());

            if (isCorrect) {
                correctCount++;
                String qText = q.getQuestionText() != null ? q.getQuestionText().toLowerCase() : "";
                if (qText.contains("[audio question]") || qText.contains("listen to the audio")) {
                    listeningCorrect++;
                } else if (qText.contains("read the passage")) {
                    readingCorrect++;
                } else if (qText.contains("synonym") || qText.contains("meaning of")) {
                    vocabCorrect++;
                } else {
                    if (q.getLesson() != null) {
                        if (q.getLesson().getType() == LessonType.LISTENING) {
                            listeningCorrect++;
                        } else if (q.getLesson().getType() == LessonType.READING) {
                            readingCorrect++;
                        } else if (q.getLesson().getType() == LessonType.VOCABULARY) {
                            vocabCorrect++;
                        } else {
                            grammarCorrect++;
                        }
                    } else {
                        grammarCorrect++;
                    }
                }
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

        // Save UserRoadmap
        UserRoadmap userRoadmap = userRoadmapRepository.findByUserIdAndRoadmapId(user.getId(), presetId)
                .orElse(UserRoadmap.builder().user(user).roadmap(preset).build());
        userRoadmap.setRoadmap(preset);
        userRoadmap.setPlacementScore(correctCount);
        userRoadmap.setRecommendedLevel(level);
        userRoadmap.setTestedAt(LocalDateTime.now());

        // AI Personalization - Reordering
        List<Lesson> presetLessons = new ArrayList<>();
        for (LearningModule module : preset.getModules()) {
            presetLessons.addAll(module.getLessons());
        }
        List<Long> orderedIds = null;

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
                    m.put("difficultyScore", l.getDifficultyScore() != null ? l.getDifficultyScore() : 1.0);
                    m.put("topic", l.getTopic() != null ? l.getTopic() : "");
                    return m;
            }).collect(Collectors.toList());
            inputPromptMap.put("lessons", lessonsInfo);

            List<Map<String, Object>> prerequisiteGraph = new ArrayList<>();
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
                    orderedIds.add(n.asLong());
                }
            }
        } catch (Exception e) {
            log.warn("Failed to generate personalized path via AI, falling back to programmatic topological sort. Error: {}", e.getMessage());
        }

        // Programmatic Fallback Topological Sort
        List<Lesson> orderedLessons;
        if (orderedIds != null && validateLessonIds(orderedIds, presetLessons)) {
            Map<Long, Lesson> lessonMap = presetLessons.stream().collect(Collectors.toMap(Lesson::getId, l -> l));
            orderedLessons = orderedIds.stream().map(lessonMap::get).collect(Collectors.toList());
            log.info("AI reordering applied successfully.");
        } else {
            orderedLessons = programmaticReorder(presetLessons, scores);
            log.info("Programmatic fallback reordering applied.");
        }

        // Serialize ordered IDs to save in UserRoadmap
        List<Long> finalOrderedIds = orderedLessons.stream().map(Lesson::getId).collect(Collectors.toList());
        try {
            userRoadmap.setPersonalizedLessonsJson(objectMapper.writeValueAsString(finalOrderedIds));
        } catch (Exception ignored) {}

        userRoadmapRepository.save(userRoadmap);

        // Grant RPG rewards
        UserGameStats stats = user.getUserGameStats();
        if (stats == null) {
            stats = UserGameStats.builder()
                    .user(user)
                    .userId(user.getId())
                    .streak(0)
                    .exp(0)
                    .level(1)
                    .build();
            user.setUserGameStats(stats);
        }

        int currentExp = stats.getExp() + 100;
        int currentLevel = stats.getLevel();

        while (true) {
            int expNeeded = currentLevel * 100;
            if (currentExp >= expNeeded) {
                currentExp -= expNeeded;
                currentLevel++;
            } else {
                break;
            }
        }

        stats.setExp(currentExp);
        stats.setLevel(currentLevel);
        userRepository.save(user);

        return buildRoadmapResponse(userRoadmap);
    }

    public Map<String, Object> getUserRoadmap(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<UserRoadmap> roadmaps = userRoadmapRepository.findByUserId(user.getId());
        if (roadmaps.isEmpty()) return null;

        UserRoadmap roadmap = roadmaps.stream()
                .filter(ur -> ur.getRoadmap() != null)
                .findFirst()
                .orElse(null);

        if (roadmap == null) return null;
        return buildRoadmapResponse(roadmap);
    }

    private boolean validateLessonIds(List<Long> ids, List<Lesson> presetLessons) {
        if (ids.size() != presetLessons.size()) return false;
        Set<Long> presetIds = presetLessons.stream().map(Lesson::getId).collect(Collectors.toSet());
        return new HashSet<>(ids).equals(presetIds);
    }

    private List<Lesson> programmaticReorder(List<Lesson> presetLessons, Map<LessonType, Integer> scores) {
        Map<Long, Lesson> lessonMap = presetLessons.stream().collect(Collectors.toMap(Lesson::getId, l -> l));
        Map<Long, Set<Long>> adj = new HashMap<>();
        Map<Long, Integer> inDegree = new HashMap<>();
        
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
            
            for (Long neighborId : adj.get(selected.getId())) {
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

    @SuppressWarnings("unchecked")
    private Map<String, Object> buildRoadmapResponse(UserRoadmap path) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", path.getId());
        response.put("cefrLevel", path.getRoadmap().getCefrLevel());
        response.put("toeicEquivalent", path.getRoadmap().getToeicEquivalent());
        response.put("overallEvaluation", path.getRoadmap().getOverallEvaluation());
        
        // Parse personalized order
        List<Object> orderedIds = new ArrayList<>();
        if (path.getPersonalizedLessonsJson() != null) {
            try {
                orderedIds = objectMapper.readValue(path.getPersonalizedLessonsJson(), List.class);
            } catch (Exception ignored) {}
        }

        List<Lesson> presetLessons = new ArrayList<>();
        for (LearningModule module : path.getRoadmap().getModules()) {
            presetLessons.addAll(module.getLessons());
        }
        Map<Long, Lesson> lessonMap = new HashMap<>();
        for (Lesson l : presetLessons) {
            lessonMap.put(l.getId(), l);
        }

        List<Lesson> sortedLessons = new ArrayList<>();
        for (Object objId : orderedIds) {
            Long id = null;
            if (objId instanceof Number n) {
                id = n.longValue();
            } else if (objId instanceof String s) {
                try {
                    id = Long.parseLong(s);
                } catch (NumberFormatException ignored) {}
            }
            if (id != null && lessonMap.containsKey(id)) {
                sortedLessons.add(lessonMap.get(id));
            }
        }
        if (sortedLessons.isEmpty()) {
            sortedLessons.addAll(presetLessons);
        }

        // Fetch user progress states
        List<UserLessonState> states = userLessonStateRepository.findByUserId(path.getUser().getId());
        Set<Long> completedLessonIds = new HashSet<>();
        for (UserLessonState state : states) {
            if ("COMPLETED".equals(state.getStatus())) {
                completedLessonIds.add(state.getLesson().getId());
            }
        }

        List<Map<String, Object>> modulesList = new ArrayList<>();
        boolean foundInProgress = false;
        for (int i = 0; i < sortedLessons.size(); i++) {
            Lesson l = sortedLessons.get(i);
            Map<String, Object> mod = new HashMap<>();
            mod.put("id", l.getId());
            mod.put("title", l.getTitle());
            mod.put("description", l.getTopic() != null ? l.getTopic() : "");
            
            String status = "LOCKED";
            if (completedLessonIds.contains(l.getId())) {
                status = "COMPLETED";
            } else if (!foundInProgress) {
                status = "IN_PROGRESS";
                foundInProgress = true;
            }
            
            mod.put("status", status);
            mod.put("orderIndex", i + 1);
            mod.put("category", l.getType().name());
            modulesList.add(mod);
        }
        response.put("modules", modulesList);
        return response;
    }
}
