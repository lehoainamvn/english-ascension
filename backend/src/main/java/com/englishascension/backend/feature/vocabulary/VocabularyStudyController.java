package com.englishascension.backend.feature.vocabulary;

import com.englishascension.backend.feature.roadmap.LearningModule;
import com.englishascension.backend.feature.roadmap.LearningModuleRepository;
import com.englishascension.backend.feature.study.Flashcard;
import com.englishascension.backend.feature.study.FlashcardRepository;
import com.englishascension.backend.feature.user.User;
import com.englishascension.backend.feature.user.UserProgress;
import com.englishascension.backend.feature.user.UserProgressRepository;
import com.englishascension.backend.feature.user.UserRepository;


import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/vocabulary")
public class VocabularyStudyController {

    private static final Logger log = LoggerFactory.getLogger(VocabularyStudyController.class);

    private final UserRepository userRepository;
    private final LearningModuleRepository topicRepository;
    private final FlashcardRepository wordRepository;
    private final UserProgressRepository progressRepository;

    public VocabularyStudyController(
            UserRepository userRepository,
            LearningModuleRepository topicRepository,
            FlashcardRepository wordRepository,
            UserProgressRepository progressRepository) {
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
        this.wordRepository = wordRepository;
        this.progressRepository = progressRepository;
    }

    @Getter
    @Setter
    public static class MarkLearnedRequest {
        // Empty class for safety
    }

    @GetMapping("/topics")
    public ResponseEntity<?> getTopics() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<LearningModule> topics = topicRepository.findByCategoryIsNotNull();
        List<UserProgress> topicProgressList = progressRepository.findByUserIdAndResourceType(user.getId(), "MODULE");
        List<UserProgress> wordProgressList = progressRepository.findByUserIdAndResourceType(user.getId(), "FLASHCARD");

        // Map topic progress
        Map<Long, Boolean> completedTopicsMap = new HashMap<>();
        for (UserProgress p : topicProgressList) {
            completedTopicsMap.put(p.getResourceId(), p.isCompleted());
        }

        // Map word progress per topic
        List<Flashcard> allWords = wordRepository.findAll();
        Map<Long, Long> wordToTopicMap = new HashMap<>();
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
            int wordsCount = (int) allWords.stream().filter(w -> w.getModule() != null && w.getModule().getId().equals(topic.getId())).count();
            
            Map<String, Object> item = new HashMap<>();
            item.put("id", topic.getId());
            item.put("title", topic.getTitle());
            item.put("category", topic.getCategory());
            item.put("wordsCount", wordsCount);
            
            int learnedCount = learnedWordsCountMap.getOrDefault(topic.getId(), 0);
            item.put("learnedCount", learnedCount);
            
            boolean isCompleted = completedTopicsMap.getOrDefault(topic.getId(), false);
            item.put("isCompleted", isCompleted || (wordsCount > 0 && learnedCount >= wordsCount));
            
            response.add(item);
        }

        // Stability sort
        response.sort(Comparator.comparing(item -> (Long) item.get("id")));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/topics/{topicId}/words")
    public ResponseEntity<?> getTopicWords(@PathVariable Long topicId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        LearningModule topic = topicRepository.findById(topicId).orElse(null);
        if (topic == null) {
            return ResponseEntity.notFound().build();
        }

        List<Flashcard> words = wordRepository.findByModuleId(topicId);
        List<UserProgress> userProgress = progressRepository.findByUserIdAndResourceType(user.getId(), "FLASHCARD");

        Map<Long, Boolean> learnedMap = new HashMap<>();
        for (UserProgress p : userProgress) {
            if (p.isCompleted()) {
                learnedMap.put(p.getResourceId(), true);
            }
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (Flashcard w : words) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", w.getId());
            item.put("word", w.getWord());
            item.put("partOfSpeech", w.getPartOfSpeech());
            item.put("phonetic", w.getPhonetic());
            item.put("definition", w.getDefinition());
            item.put("exampleSentence", w.getExampleSentence());
            item.put("exampleTranslation", w.getExampleTranslation());
            item.put("isLearned", learnedMap.getOrDefault(w.getId(), false));
            response.add(item);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/words/{wordId}/mark-learned")
    public ResponseEntity<?> markWordLearned(@PathVariable Long wordId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Flashcard word = wordRepository.findById(wordId).orElse(null);
        if (word == null) {
            return ResponseEntity.notFound().build();
        }

        UserProgress progress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "FLASHCARD", wordId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user)
                        .resourceType("FLASHCARD")
                        .resourceId(wordId)
                        .completed(false)
                        .build());

        int xpGained = 0;
        int coinsGained = 0;

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);

            // Reward per word learned: +10 EXP, +2 Coins
            xpGained = 10;
            coinsGained = 2;
            addRewardsToUser(user, xpGained, coinsGained);
        }

        Map<String, Object> result = getRewardResponseMap(user, xpGained, coinsGained);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/topics/{topicId}/complete")
    public ResponseEntity<?> completeTopic(@PathVariable Long topicId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        LearningModule topic = topicRepository.findById(topicId).orElse(null);
        if (topic == null) {
            return ResponseEntity.notFound().build();
        }

        UserProgress progress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "MODULE", topicId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user)
                        .resourceType("MODULE")
                        .resourceId(topicId)
                        .completed(false)
                        .build());

        int xpGained = 0;
        int coinsGained = 0;

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);

            // Topic completion: +50 EXP, +15 Coins
            xpGained = 50;
            coinsGained = 15;
            addRewardsToUser(user, xpGained, coinsGained);
        }

        Map<String, Object> result = getRewardResponseMap(user, xpGained, coinsGained);
        return ResponseEntity.ok(result);
    }

    private void addRewardsToUser(User user, int xp, int coins) {
        int currentExp = user.getExp();
        int currentLevel = user.getLevel();
        int currentCoins = user.getCoins();

        currentExp += xp;
        currentCoins += coins;

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
            String newTitle = calculateTitle(currentLevel);
            user.setCharacterTitle(newTitle);
        }

        userRepository.save(user);
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

    private Map<String, Object> getRewardResponseMap(User user, int xpGained, int coinsGained) {
        Map<String, Object> result = new HashMap<>();
        result.put("xpGained", xpGained);
        result.put("coinsGained", coinsGained);
        result.put("newXp", user.getExp());
        result.put("newLevel", user.getLevel());
        result.put("newCoins", user.getCoins());
        result.put("leveledUp", xpGained > 0 && user.getExp() < xpGained);
        result.put("previousLevel", user.getLevel());
        result.put("newTitle", user.getCharacterTitle() != null ? user.getCharacterTitle() : "Novice");
        return result;
    }
}
