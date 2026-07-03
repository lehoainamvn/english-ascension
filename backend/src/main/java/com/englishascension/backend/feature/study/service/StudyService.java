package com.englishascension.backend.feature.study.service;

import com.englishascension.backend.feature.ai.service.GroqService;
import com.englishascension.backend.feature.roadmap.entity.*;
import com.englishascension.backend.feature.roadmap.repository.LessonRepository;
import com.englishascension.backend.feature.roadmap.repository.UserRoadmapRepository;
import com.englishascension.backend.feature.study.entity.Question;
import com.englishascension.backend.feature.study.entity.QuestionOption;
import com.englishascension.backend.feature.study.repository.QuestionRepository;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.entity.UserGameStats;
import com.englishascension.backend.feature.user.entity.UserLessonState;
import com.englishascension.backend.feature.user.repository.UserLessonStateRepository;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.feature.vocabulary.entity.VocabularyWord;
import com.englishascension.backend.feature.vocabulary.repository.VocabularyWordRepository;
import com.englishascension.backend.shared.exception.ResourceNotFoundException;
import com.englishascension.backend.shared.reward.RewardResult;
import com.englishascension.backend.shared.reward.RewardService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudyService {

    private static final Logger log = LoggerFactory.getLogger(StudyService.class);

    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final VocabularyWordRepository vocabularyWordRepository;
    private final QuestionRepository questionRepository;
    private final UserRoadmapRepository userRoadmapRepository;
    private final UserLessonStateRepository userLessonStateRepository;
    private final GroqService groqService;
    private final RewardService rewardService;
    private final ObjectMapper objectMapper;

    public StudyService(UserRepository userRepository,
                        LessonRepository lessonRepository,
                        VocabularyWordRepository vocabularyWordRepository,
                        QuestionRepository questionRepository,
                        UserRoadmapRepository userRoadmapRepository,
                        UserLessonStateRepository userLessonStateRepository,
                        GroqService groqService,
                        RewardService rewardService) {
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.vocabularyWordRepository = vocabularyWordRepository;
        this.questionRepository = questionRepository;
        this.userRoadmapRepository = userRoadmapRepository;
        this.userLessonStateRepository = userLessonStateRepository;
        this.groqService = groqService;
        this.rewardService = rewardService;
        this.objectMapper = new ObjectMapper();
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    private Lesson findLesson(String lessonIdOrModuleId) {
        return findLesson(lessonIdOrModuleId, null);
    }

    private Lesson findLesson(String lessonIdOrModuleId, String category) {
        // 1. Try by Lesson ID (Long) - direct match always takes priority
        try {
            Long id = Long.parseLong(lessonIdOrModuleId);
            Optional<Lesson> lessonOpt = lessonRepository.findById(id);
            if (lessonOpt.isPresent()) return lessonOpt.get();
        } catch (NumberFormatException ignored) {}

        // 2. Try by Slug (String)
        Optional<Lesson> lessonOpt = lessonRepository.findBySlug(lessonIdOrModuleId);
        if (lessonOpt.isPresent()) return lessonOpt.get();

        // 3. Try by Module ID (Long), filtered by category if provided
        try {
            Long moduleId = Long.parseLong(lessonIdOrModuleId);
            List<Lesson> lessons = lessonRepository.findByModuleId(moduleId);
            if (!lessons.isEmpty()) {
                // Filter by lesson type if category is provided (e.g., "grammar", "vocabulary", "listening")
                if (category != null && !category.isBlank()) {
                    try {
                        LessonType targetType = LessonType.valueOf(category.toUpperCase());
                        return lessons.stream()
                                .filter(l -> l.getType() == targetType)
                                .findFirst()
                                .orElse(lessons.get(0));
                    } catch (IllegalArgumentException ignored2) {}
                }
                return lessons.get(0);
            }
        } catch (NumberFormatException ignored) {}

        return null;
    }

    public Map<String, Object> getModuleContent(String lessonIdOrModuleId, String category) {
        Lesson lesson = findLesson(lessonIdOrModuleId, category);
        if (lesson == null) {
            throw new ResourceNotFoundException("Lesson or Module", lessonIdOrModuleId);
        }

        String bodyText = null;
        String mediaUrl = null;
        List<Map<String, Object>> flashcards = new ArrayList<>();

        if (lesson.getType() == LessonType.VOCABULARY) {
            List<VocabularyWord> words = vocabularyWordRepository.findByLessonId(lesson.getId());
            for (VocabularyWord w : words) {
                Map<String, Object> fc = new HashMap<>();
                fc.put("id", w.getId());
                fc.put("word", w.getWord());
                fc.put("partOfSpeech", w.getPartOfSpeech());
                fc.put("phonetic", w.getPhonetic());
                fc.put("definition", w.getDefinition());
                fc.put("exampleSentence", w.getExampleSentence());
                fc.put("exampleTranslation", w.getExampleTranslation());
                flashcards.add(fc);
            }
        } else {
            LessonContent content = lesson.getLessonContent();
            if (content != null) {
                bodyText = content.getBodyText();
                mediaUrl = content.getMediaUrl();
            }
        }

        List<Question> contentQs = questionRepository.findByLessonId(lesson.getId());
        List<Map<String, Object>> questions = contentQs.stream()
                .map(q -> {
                    Map<String, Object> qDto = new HashMap<>();
                    qDto.put("id", q.getId());
                    qDto.put("questionText", q.getQuestionText());
                    qDto.put("type", "MULTIPLE_CHOICE");
                    qDto.put("optionA", "");
                    qDto.put("optionB", "");
                    qDto.put("optionC", "");
                    qDto.put("optionD", "");

                    String correct = "A";
                    for (QuestionOption opt : q.getOptions()) {
                        if ("A".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionA", opt.getOptionValue());
                        if ("B".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionB", opt.getOptionValue());
                        if ("C".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionC", opt.getOptionValue());
                        if ("D".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionD", opt.getOptionValue());
                        if (opt.isCorrect()) {
                            correct = opt.getOptionKey();
                        }
                    }
                    qDto.put("correctAnswer", correct);
                    qDto.put("explanation", q.getExplanation());
                    return qDto;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("moduleTitle", lesson.getTitle());
        response.put("moduleDescription", lesson.getTopic() != null ? lesson.getTopic() : "");
        response.put("lessonType", lesson.getType().name());
        response.put("bodyText", bodyText);
        response.put("mediaUrl", mediaUrl);
        response.put("flashcards", flashcards);
        response.put("quizQuestions", questions);
        return response;
    }

    public RewardResult completeStep(String lessonIdOrModuleId) {
        User user = getCurrentUser();
        Lesson lesson = findLesson(lessonIdOrModuleId);
        if (lesson == null) {
            throw new ResourceNotFoundException("Lesson", lessonIdOrModuleId);
        }

        UserLessonState state = userLessonStateRepository
                .findByUserIdAndLessonId(user.getId(), lesson.getId())
                .orElseGet(() -> UserLessonState.builder()
                        .user(user)
                        .lesson(lesson)
                        .status("UNLOCKED")
                        .build());
        state.setStatus("COMPLETED");
        state.setCompletedAt(LocalDateTime.now());
        userLessonStateRepository.save(state);

        return rewardService.addRewards(user, 30, 0);
    }

    public Map<String, Object> completeModule(String lessonIdOrModuleId, Map<String, Object> requestBody) {
        User user = getCurrentUser();
        Integer correctAnswers = requestBody.get("correctAnswers") instanceof Integer i ? i : 5;

        Lesson lesson = findLesson(lessonIdOrModuleId);
        if (lesson == null) {
            throw new ResourceNotFoundException("Lesson", lessonIdOrModuleId);
        }

        UserLessonState state = userLessonStateRepository
                .findByUserIdAndLessonId(user.getId(), lesson.getId())
                .orElseGet(() -> UserLessonState.builder()
                        .user(user)
                        .lesson(lesson)
                        .status("UNLOCKED")
                        .build());
        state.setStatus("COMPLETED");
        state.setScore(correctAnswers);
        state.setCompletedAt(LocalDateTime.now());
        userLessonStateRepository.save(state);

        RewardResult reward = rewardService.addRewards(user, correctAnswers * 10, 0);

        String nextModuleId = null;
        UserRoadmap userRoadmap = null;
        if (lesson.getModule() != null && lesson.getModule().getRoadmap() != null) {
            userRoadmap = userRoadmapRepository.findByUserIdAndRoadmapId(user.getId(), lesson.getModule().getRoadmap().getId())
                    .orElse(null);
        }
        if (userRoadmap == null) {
            userRoadmap = userRoadmapRepository.findByUserId(user.getId()).stream().findFirst().orElse(null);
        }
        if (userRoadmap != null && userRoadmap.getPersonalizedLessonsJson() != null) {
            try {
                List<Object> orderedIds = objectMapper.readValue(userRoadmap.getPersonalizedLessonsJson(), List.class);
                int currentIndex = orderedIds.indexOf(lesson.getId().toString());
                if (currentIndex < 0) {
                    currentIndex = orderedIds.indexOf(lesson.getSlug());
                }
                if (currentIndex >= 0 && currentIndex < orderedIds.size() - 1) {
                    nextModuleId = orderedIds.get(currentIndex + 1).toString();
                }
            } catch (Exception ignored) {}
        }

        Map<String, Object> result = new HashMap<>();
        result.put("xpGained", reward.getXpGained());
        result.put("coinsGained", 0);
        result.put("newXp", reward.getNewXp());
        result.put("newLevel", reward.getNewLevel());
        result.put("newCoins", 0);
        result.put("leveledUp", reward.isLeveledUp());
        result.put("previousLevel", reward.getPreviousLevel());
        result.put("newTitle", reward.getNewTitle());
        result.put("nextModuleId", nextModuleId);
        return result;
    }

    public List<Map<String, Object>> getBattleWords(String lessonIdOrModuleId) {
        User user = getCurrentUser();
        UserRoadmap userRoadmap = userRoadmapRepository.findByUserId(user.getId()).stream().findFirst().orElse(null);
        String cefrLevel = (userRoadmap != null && userRoadmap.getRoadmap() != null)
                ? userRoadmap.getRoadmap().getCefrLevel() : "A1";

        List<VocabularyWord> vocabs = vocabularyWordRepository.findAll();
        List<VocabularyWord> filtered = vocabs.stream()
                .filter(v -> v.getLesson() != null && v.getLesson().getLevel() != null && v.getLesson().getLevel().equalsIgnoreCase(cefrLevel))
                .collect(Collectors.toList());

        if (filtered.isEmpty()) {
            filtered = vocabs;
        }

        Collections.shuffle(filtered);
        List<VocabularyWord> battleWords = filtered.size() > 30 ? filtered.subList(0, 30) : filtered;

        List<Map<String, Object>> result = new ArrayList<>();
        for (VocabularyWord w : battleWords) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("id", w.getId());
            entry.put("word", w.getWord());
            entry.put("definition", w.getDefinition());
            entry.put("partOfSpeech", w.getPartOfSpeech());
            entry.put("phonetic", w.getPhonetic());
            entry.put("exampleSentence", w.getExampleSentence());
            entry.put("exampleTranslation", w.getExampleTranslation());
            result.add(entry);
        }
        return result;
    }

    public RewardResult completeBattle(String lessonIdOrModuleId) {
        User user = getCurrentUser();
        return rewardService.addRewards(user, 50, 0);
    }

    public String analyzePronunciation(String targetWord, String transcribedText) {
        if (targetWord == null || targetWord.trim().isEmpty()
                || transcribedText == null || transcribedText.trim().isEmpty()) {
            throw new IllegalArgumentException("Tham số targetWord và transcribedText không được để trống.");
        }

        String systemPrompt = """
                You are an AI Pronunciation Coach. Your task is to analyze the user's pronunciation \
                based on the target English word/phrase and the transcribed text captured by speech recognition.
                Analyze the phonetic difference and potential errors. Return ONLY a JSON object with:
                - 'score': integer 0-100
                - 'accuracy': short string in Vietnamese ('Xuất sắc', 'Tốt', 'Khá', 'Cần cải thiện')
                - 'errorAnalysis': descriptive sentence in Vietnamese
                """;

        String userPrompt = String.format("Target Word: '%s'\nTranscribed Text: '%s'", targetWord, transcribedText);
        try {
            return groqService.generateJsonResponse(systemPrompt, userPrompt);
        } catch (Exception e) {
            log.error("AI Pronunciation analysis failed", e);
            return "{\"score\": 70, \"accuracy\": \"Khá\", \"errorAnalysis\": \"Lỗi kết nối AI, vui lòng thử lại sau.\"}";
        }
    }

    public Map<String, Object> getUserProfile() {
        User user = getCurrentUser();
        UserGameStats stats = user.getUserGameStats();
        if (stats == null) {
            stats = UserGameStats.builder().user(user).streak(0).exp(0).level(1).build();
            user.setUserGameStats(stats);
            userRepository.save(user);
        }
        Map<String, Object> map = new HashMap<>();
        map.put("streak", stats.getStreak());
        map.put("coins", 0);
        map.put("level", stats.getLevel());
        map.put("exp", stats.getExp());
        return map;
    }
}
