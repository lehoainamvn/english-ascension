package com.englishascension.backend.feature.vocabulary.service;

import com.englishascension.backend.feature.roadmap.entity.LearningModule;
import com.englishascension.backend.feature.roadmap.repository.LearningModuleRepository;
import com.englishascension.backend.feature.study.entity.Flashcard;
import com.englishascension.backend.feature.study.repository.FlashcardRepository;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.entity.UserProgress;
import com.englishascension.backend.feature.user.repository.UserProgressRepository;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.feature.vocabulary.entity.VocabularyWord;
import com.englishascension.backend.feature.vocabulary.repository.VocabularyWordRepository;
import com.englishascension.backend.shared.exception.ResourceNotFoundException;
import com.englishascension.backend.shared.reward.RewardResult;
import com.englishascension.backend.shared.reward.RewardService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Business logic for vocabulary study.
 */
@Service
public class VocabularyService {

    private final UserRepository userRepository;
    private final LearningModuleRepository topicRepository;
    private final FlashcardRepository wordRepository;
    private final UserProgressRepository progressRepository;
    private final VocabularyWordRepository vocabularyWordRepository;
    private final RewardService rewardService;

    public VocabularyService(UserRepository userRepository,
                             LearningModuleRepository topicRepository,
                             FlashcardRepository wordRepository,
                             UserProgressRepository progressRepository,
                             VocabularyWordRepository vocabularyWordRepository,
                             RewardService rewardService) {
        this.userRepository          = userRepository;
        this.topicRepository         = topicRepository;
        this.wordRepository          = wordRepository;
        this.progressRepository      = progressRepository;
        this.vocabularyWordRepository = vocabularyWordRepository;
        this.rewardService           = rewardService;
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    // ------------------------------------------------------------------
    // Get topics
    // ------------------------------------------------------------------

    public List<Map<String, Object>> getTopics() {
        User user = getCurrentUser();

        List<LearningModule> topics            = topicRepository.findByCategoryIsNotNull();
        List<UserProgress>   topicProgressList = progressRepository.findByUserIdAndResourceType(user.getId(), "MODULE");
        List<UserProgress>   wordProgressList  = progressRepository.findByUserIdAndResourceType(user.getId(), "FLASHCARD");

        Map<Long, Boolean> completedTopicsMap = new HashMap<>();
        for (UserProgress p : topicProgressList) {
            completedTopicsMap.put(p.getResourceId(), p.isCompleted());
        }

        List<Flashcard>    allWords       = wordRepository.findAll();
        Map<Long, Long>    wordToTopicMap = new HashMap<>();
        for (Flashcard w : allWords) {
            if (w.getModule() != null) {
                wordToTopicMap.put(w.getId(), w.getModule().getId());
            }
        }

        Map<Long, Integer> learnedWordsCountMap = new HashMap<>();
        for (UserProgress wp : wordProgressList) {
            if (wp.isCompleted()) {
                Long topicId = wordToTopicMap.get(wp.getResourceId());
                if (topicId != null) {
                    learnedWordsCountMap.put(topicId, learnedWordsCountMap.getOrDefault(topicId, 0) + 1);
                }
            }
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (LearningModule topic : topics) {
            int wordsCount = (int) allWords.stream()
                    .filter(w -> w.getModule() != null && w.getModule().getId().equals(topic.getId()))
                    .count();

            int learnedCount = learnedWordsCountMap.getOrDefault(topic.getId(), 0);
            boolean isCompleted = completedTopicsMap.getOrDefault(topic.getId(), false)
                    || (wordsCount > 0 && learnedCount >= wordsCount);

            Map<String, Object> item = new HashMap<>();
            item.put("id",          topic.getId());
            item.put("title",       topic.getTitle());
            item.put("category",    topic.getCategory());
            item.put("wordsCount",  wordsCount);
            item.put("learnedCount", learnedCount);
            item.put("isCompleted", isCompleted);
            response.add(item);
        }

        response.sort(Comparator.comparing(item -> (Long) item.get("id")));
        return response;
    }

    // ------------------------------------------------------------------
    // Get words in a topic
    // ------------------------------------------------------------------

    public List<Map<String, Object>> getTopicWords(Long topicId) {
        User user = getCurrentUser();

        LearningModule topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", topicId));

        List<Flashcard> words = wordRepository.findByModuleId(topicId);
        if (words.isEmpty()) {
            words = autoGenerateFlashcards(topic);
        }

        List<UserProgress>   userProgress = progressRepository.findByUserIdAndResourceType(user.getId(), "FLASHCARD");
        Map<Long, Boolean>   learnedMap   = new HashMap<>();
        for (UserProgress p : userProgress) {
            if (p.isCompleted()) learnedMap.put(p.getResourceId(), true);
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (Flashcard w : words) {
            Map<String, Object> item = new HashMap<>();
            item.put("id",               w.getId());
            item.put("word",             w.getWord());
            item.put("partOfSpeech",     w.getPartOfSpeech());
            item.put("phonetic",         w.getPhonetic());
            item.put("definition",       w.getDefinition());
            item.put("exampleSentence",  w.getExampleSentence());
            item.put("exampleTranslation", w.getExampleTranslation());
            item.put("isLearned",        learnedMap.getOrDefault(w.getId(), false));
            response.add(item);
        }
        return response;
    }

    private List<Flashcard> autoGenerateFlashcards(LearningModule topic) {
        String title = topic.getTitle();
        String level = "A1";
        int moduleIndex = topic.getOrderIndex() != null ? topic.getOrderIndex() : 1;

        if      (title.toUpperCase().startsWith("A1")) { level = "A1"; }
        else if (title.toUpperCase().startsWith("A2")) { level = "A2"; }
        else if (title.toUpperCase().startsWith("B1")) { level = "B1"; }
        else if (title.toUpperCase().startsWith("B2")) { level = "B2"; }
        else if (title.toUpperCase().startsWith("C1")) { level = "C1"; }
        else if (title.toLowerCase().contains("toeic"))    { level = "B1"; }
        else if (title.toLowerCase().contains("business")) { level = "B2"; }

        List<VocabularyWord> wordList =
                vocabularyWordRepository.findByCefrLevelIgnoreCaseAndModuleIndex(level, moduleIndex);
        if (wordList == null || wordList.isEmpty()) return Collections.emptyList();

        List<Flashcard> saved = new ArrayList<>();
        for (VocabularyWord vw : wordList) {
            Flashcard fc = Flashcard.builder()
                    .module(topic)
                    .word(vw.getWord())
                    .partOfSpeech(vw.getPartOfSpeech())
                    .phonetic(vw.getPhonetic())
                    .definition(vw.getDefinition())
                    .exampleSentence(vw.getExampleSentence())
                    .exampleTranslation(vw.getExampleTranslation())
                    .build();
            saved.add(wordRepository.save(fc));
        }
        return saved;
    }

    // ------------------------------------------------------------------
    // Mark word learned
    // ------------------------------------------------------------------

    public RewardResult markWordLearned(Long wordId) {
        User user = getCurrentUser();

        wordRepository.findById(wordId)
                .orElseThrow(() -> new ResourceNotFoundException("Word", wordId));

        UserProgress progress = progressRepository
                .findByUserIdAndResourceTypeAndResourceId(user.getId(), "FLASHCARD", wordId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user).resourceType("FLASHCARD").resourceId(wordId).completed(false).build());

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);
            return rewardService.addRewards(user, 10, 2); // +10 EXP, +2 Coins
        }
        return rewardService.noReward(user);
    }

    // ------------------------------------------------------------------
    // Complete topic
    // ------------------------------------------------------------------

    public RewardResult completeTopic(Long topicId) {
        User user = getCurrentUser();

        topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", topicId));

        UserProgress progress = progressRepository
                .findByUserIdAndResourceTypeAndResourceId(user.getId(), "MODULE", topicId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user).resourceType("MODULE").resourceId(topicId).completed(false).build());

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);
            return rewardService.addRewards(user, 50, 15); // +50 EXP, +15 Coins
        }
        return rewardService.noReward(user);
    }
}
