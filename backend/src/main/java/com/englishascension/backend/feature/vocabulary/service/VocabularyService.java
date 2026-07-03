package com.englishascension.backend.feature.vocabulary.service;

import com.englishascension.backend.feature.roadmap.entity.LearningModule;
import com.englishascension.backend.feature.roadmap.entity.Lesson;
import com.englishascension.backend.feature.roadmap.repository.LearningModuleRepository;
import com.englishascension.backend.feature.roadmap.repository.LessonRepository;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.entity.UserLessonState;
import com.englishascension.backend.feature.user.entity.UserVocabularyState;
import com.englishascension.backend.feature.user.repository.UserLessonStateRepository;
import com.englishascension.backend.feature.user.repository.UserVocabularyStateRepository;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.feature.vocabulary.entity.VocabularyWord;
import com.englishascension.backend.feature.vocabulary.repository.VocabularyWordRepository;
import com.englishascension.backend.shared.exception.ResourceNotFoundException;
import com.englishascension.backend.shared.reward.RewardResult;
import com.englishascension.backend.shared.reward.RewardService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class VocabularyService {

    private final UserRepository userRepository;
    private final LearningModuleRepository topicRepository;
    private final LessonRepository lessonRepository;
    private final VocabularyWordRepository vocabularyWordRepository;
    private final UserVocabularyStateRepository userVocabularyStateRepository;
    private final UserLessonStateRepository userLessonStateRepository;
    private final RewardService rewardService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public VocabularyService(UserRepository userRepository,
                             LearningModuleRepository topicRepository,
                             LessonRepository lessonRepository,
                             VocabularyWordRepository vocabularyWordRepository,
                             UserVocabularyStateRepository userVocabularyStateRepository,
                             UserLessonStateRepository userLessonStateRepository,
                             RewardService rewardService) {
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
        this.lessonRepository = lessonRepository;
        this.vocabularyWordRepository = vocabularyWordRepository;
        this.userVocabularyStateRepository = userVocabularyStateRepository;
        this.userLessonStateRepository = userLessonStateRepository;
        this.rewardService = rewardService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseAnswersJson(String json) {
        if (json == null || json.isEmpty()) {
            return new HashMap<>();
        }
        try {
            return objectMapper.readValue(json, Map.class);
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    private String serializeAnswersJson(Map<String, Object> map) {
        try {
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            return "{}";
        }
    }

    public List<Map<String, Object>> getTopics() {
        User user = getCurrentUser();
        List<LearningModule> topics = topicRepository.findByCategory("TỪ VỰNG CEFR");

        List<UserVocabularyState> progressList = userVocabularyStateRepository.findByUserId(user.getId());
        Set<Long> learnedWordIds = progressList.stream()
                .filter(p -> "COMPLETED".equals(p.getStatus()))
                .map(p -> p.getVocabularyWord().getId())
                .collect(Collectors.toSet());

        List<Map<String, Object>> response = new ArrayList<>();
        for (LearningModule topic : topics) {
            List<Lesson> lessons = lessonRepository.findByModuleId(topic.getId());
            List<VocabularyWord> words = new ArrayList<>();
            for (Lesson l : lessons) {
                words.addAll(vocabularyWordRepository.findByLessonId(l.getId()));
            }

            int wordsCount = words.size();
            long learnedCount = words.stream()
                    .filter(w -> learnedWordIds.contains(w.getId()))
                    .count();

            boolean topicCompleted = false;
            if (!lessons.isEmpty()) {
                UserLessonState lessonState = userLessonStateRepository
                        .findByUserIdAndLessonId(user.getId(), lessons.get(0).getId()).orElse(null);
                if (lessonState != null) {
                    Map<String, Object> meta = parseAnswersJson(lessonState.getAnswersJson());
                    if (Boolean.TRUE.equals(meta.get("topicCompleted"))) {
                        topicCompleted = true;
                    }
                }
            }

            boolean isCompleted = topicCompleted || (wordsCount > 0 && learnedCount >= wordsCount);

            Map<String, Object> item = new HashMap<>();
            item.put("id", topic.getId());
            item.put("title", topic.getTitle());
            item.put("category", topic.getCategory());
            item.put("wordsCount", wordsCount);
            item.put("learnedCount", (int) learnedCount);
            item.put("isCompleted", isCompleted);
            response.add(item);
        }

        response.sort(Comparator.comparing(item -> (Long) item.get("id")));
        return response;
    }

    public List<Map<String, Object>> getTopicWords(Long topicId) {
        User user = getCurrentUser();
        topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", topicId));

        List<Lesson> lessons = lessonRepository.findByModuleId(topicId);
        List<VocabularyWord> words = new ArrayList<>();
        for (Lesson l : lessons) {
            words.addAll(vocabularyWordRepository.findByLessonId(l.getId()));
        }

        List<UserVocabularyState> progressList = userVocabularyStateRepository.findByUserId(user.getId());
        Set<Long> learnedWordIds = progressList.stream()
                .filter(p -> "COMPLETED".equals(p.getStatus()))
                .map(p -> p.getVocabularyWord().getId())
                .collect(Collectors.toSet());

        List<Map<String, Object>> response = new ArrayList<>();
        for (VocabularyWord w : words) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", w.getId());
            item.put("word", w.getWord());
            item.put("partOfSpeech", w.getPartOfSpeech());
            item.put("phonetic", w.getPhonetic());
            item.put("definition", w.getDefinition());
            item.put("exampleSentence", w.getExampleSentence());
            item.put("exampleTranslation", w.getExampleTranslation());
            item.put("isLearned", learnedWordIds.contains(w.getId()));
            response.add(item);
        }
        return response;
    }

    public RewardResult markWordLearned(Long wordId) {
        User user = getCurrentUser();
        VocabularyWord word = vocabularyWordRepository.findById(wordId)
                .orElseThrow(() -> new ResourceNotFoundException("Word", wordId));

        UserVocabularyState progress = userVocabularyStateRepository
                .findByUserIdAndVocabularyWordId(user.getId(), wordId)
                .orElseGet(() -> UserVocabularyState.builder()
                        .user(user)
                        .vocabularyWord(word)
                        .status("UNLOCKED")
                        .build());

        if (!"COMPLETED".equals(progress.getStatus())) {
            progress.setStatus("COMPLETED");
            progress.setCompletedAt(LocalDateTime.now());
            userVocabularyStateRepository.save(progress);
            return rewardService.addRewards(user, 10, 0); // +10 EXP
        }
        return rewardService.noReward(user);
    }

    public RewardResult completeTopic(Long topicId) {
        User user = getCurrentUser();
        topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", topicId));

        List<Lesson> lessons = lessonRepository.findByModuleId(topicId);
        if (lessons.isEmpty()) {
            return rewardService.noReward(user);
        }

        Lesson firstLesson = lessons.get(0);
        UserLessonState progress = userLessonStateRepository
                .findByUserIdAndLessonId(user.getId(), firstLesson.getId())
                .orElseGet(() -> UserLessonState.builder()
                        .user(user)
                        .lesson(firstLesson)
                        .status("UNLOCKED")
                        .build());

        Map<String, Object> meta = parseAnswersJson(progress.getAnswersJson());
        if (!Boolean.TRUE.equals(meta.get("topicCompleted"))) {
            meta.put("topicCompleted", true);
            progress.setAnswersJson(serializeAnswersJson(meta));
            progress.setCompletedAt(LocalDateTime.now());
            userLessonStateRepository.save(progress);
            return rewardService.addRewards(user, 50, 0); // +50 EXP
        }
        return rewardService.noReward(user);
    }
}
