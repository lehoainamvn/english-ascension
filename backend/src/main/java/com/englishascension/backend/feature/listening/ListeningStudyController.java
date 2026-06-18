package com.englishascension.backend.feature.listening;

import com.englishascension.backend.feature.study.Question;
import com.englishascension.backend.feature.study.QuestionRepository;
import com.englishascension.backend.feature.study.StudyContent;
import com.englishascension.backend.feature.study.StudyContentRepository;
import com.englishascension.backend.feature.user.User;
import com.englishascension.backend.feature.user.UserProgress;
import com.englishascension.backend.feature.user.UserProgressRepository;
import com.englishascension.backend.feature.user.UserRepository;


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
@RequestMapping("/api/listening")
public class ListeningStudyController {

    private static final Logger log = LoggerFactory.getLogger(ListeningStudyController.class);

    private final UserRepository userRepository;
    private final StudyContentRepository topicRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository progressRepository;

    public ListeningStudyController(
            UserRepository userRepository,
            StudyContentRepository topicRepository,
            QuestionRepository questionRepository,
            UserProgressRepository progressRepository) {
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
        this.questionRepository = questionRepository;
        this.progressRepository = progressRepository;
    }

    @GetMapping("/topics")
    public ResponseEntity<?> getTopics() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<StudyContent> topics = topicRepository.findByType("LISTENING");
        List<UserProgress> questionProgressList = progressRepository.findByUserIdAndResourceType(user.getId(), "LISTENING_QUESTION");

        // Map how many questions are completed per topic
        Map<Long, Integer> completedQuestionsCountMap = new HashMap<>();
        
        // Load all listening questions to map question ID to topic ID
        List<Question> allQuestions = questionRepository.findAll(); // Simple mapping for seeded items
        Map<Long, Long> questionToTopicMap = new HashMap<>();
        for (Question q : allQuestions) {
            if ("LISTENING".equals(q.getSourceType())) {
                questionToTopicMap.put(q.getId(), q.getParentId());
            }
        }

        for (UserProgress p : questionProgressList) {
            if (p.isCompleted()) {
                Long topicId = questionToTopicMap.get(p.getResourceId());
                if (topicId != null) {
                    completedQuestionsCountMap.put(topicId, completedQuestionsCountMap.getOrDefault(topicId, 0) + 1);
                }
            }
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (StudyContent topic : topics) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", topic.getId());
            item.put("title", topic.getTitle());
            item.put("category", topic.getCategory());
            item.put("description", topic.getDescription());
            
            // Extract sections count (we will calculate sections count based on unique difficulty groups)
            long sectionsCount = allQuestions.stream()
                    .filter(q -> "LISTENING".equals(q.getSourceType()) && q.getParentId().equals(topic.getId()))
                    .map(Question::getDifficulty)
                    .distinct()
                    .count();
            item.put("sectionsCount", (int) sectionsCount);

            long questionsCount = allQuestions.stream()
                    .filter(q -> "LISTENING".equals(q.getSourceType()) && q.getParentId().equals(topic.getId()))
                    .count();
            item.put("questionsCount", (int) questionsCount);
            
            int completedCount = completedQuestionsCountMap.getOrDefault(topic.getId(), 0);
            item.put("completedCount", completedCount);
            
            response.add(item);
        }

        response.sort(Comparator.comparing(item -> (Long) item.get("id")));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/topics/{topicId}/sections")
    public ResponseEntity<?> getTopicSections(@PathVariable Long topicId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        StudyContent topic = topicRepository.findById(topicId).orElse(null);
        if (topic == null || !"LISTENING".equals(topic.getType())) {
            return ResponseEntity.notFound().build();
        }

        List<Question> questions = questionRepository.findBySourceTypeAndParentId("LISTENING", topicId);
        List<UserProgress> userQuestionProgress = progressRepository.findByUserIdAndResourceType(user.getId(), "LISTENING_QUESTION");
        List<UserProgress> userSectionProgress = progressRepository.findByUserIdAndResourceType(user.getId(), "LISTENING_SECTION");

        // Map section progress
        Map<Long, Boolean> completedSectionsMap = new HashMap<>();
        for (UserProgress sp : userSectionProgress) {
            completedSectionsMap.put(sp.getResourceId(), sp.isCompleted());
        }

        // Map question progress
        Map<Long, Boolean> completedQuestionsMap = new HashMap<>();
        for (UserProgress qp : userQuestionProgress) {
            completedQuestionsMap.put(qp.getResourceId(), qp.isCompleted());
        }

        // Group questions by section name (stored in difficulty field)
        Map<String, List<Question>> grouped = new TreeMap<>();
        for (Question q : questions) {
            grouped.computeIfAbsent(q.getDifficulty(), k -> new ArrayList<>()).add(q);
        }

        List<Map<String, Object>> responseSections = new ArrayList<>();
        int sectionIndex = 1;
        for (Map.Entry<String, List<Question>> entry : grouped.entrySet()) {
            String sectionTitle = entry.getKey();
            List<Question> secQuestionsList = entry.getValue();

            // Virtual section ID to keep API compatibility
            long virtualSectionId = (topicId * 100) + sectionIndex;

            Map<String, Object> secMap = new HashMap<>();
            secMap.put("id", virtualSectionId);
            secMap.put("title", sectionTitle);
            secMap.put("orderIndex", sectionIndex);
            secMap.put("questionsCount", secQuestionsList.size());
            secMap.put("isCompleted", completedSectionsMap.getOrDefault(virtualSectionId, false));

            List<Map<String, Object>> qMaps = new ArrayList<>();
            for (Question q : secQuestionsList) {
                Map<String, Object> qMap = new HashMap<>();
                qMap.put("id", q.getId());
                qMap.put("questionNumber", q.getQuestionNumber());
                qMap.put("text", q.getQuestionText());
                qMap.put("translation", q.getExplanation());
                qMap.put("audioUrl", q.getAudioUrl());
                qMap.put("isCompleted", completedQuestionsMap.getOrDefault(q.getId(), false));
                qMaps.add(qMap);
            }
            qMaps.sort(Comparator.comparing(q -> (Integer) q.get("questionNumber")));
            secMap.put("questions", qMaps);

            responseSections.add(secMap);
            sectionIndex++;
        }

        return ResponseEntity.ok(responseSections);
    }

    @PostMapping("/questions/{questionId}/complete")
    public ResponseEntity<?> completeQuestion(@PathVariable Long questionId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Question question = questionRepository.findById(questionId).orElse(null);
        if (question == null || !"LISTENING".equals(question.getSourceType())) {
            return ResponseEntity.notFound().build();
        }

        UserProgress progress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "LISTENING_QUESTION", questionId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user)
                        .resourceType("LISTENING_QUESTION")
                        .resourceId(questionId)
                        .completed(false)
                        .build());

        int xpGained = 0;
        int coinsGained = 0;

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);

            // Reward per completed question: +10 EXP, +2 Coins
            xpGained = 10;
            coinsGained = 2;
            addRewardsToUser(user, xpGained, coinsGained);
        }

        Map<String, Object> result = getRewardResponseMap(user, xpGained, coinsGained);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/sections/{sectionId}/complete")
    public ResponseEntity<?> completeSection(@PathVariable Long sectionId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Verify topic exists
        long topicId = sectionId / 100;
        StudyContent topic = topicRepository.findById(topicId).orElse(null);
        if (topic == null || !"LISTENING".equals(topic.getType())) {
            return ResponseEntity.notFound().build();
        }

        UserProgress progress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "LISTENING_SECTION", sectionId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user)
                        .resourceType("LISTENING_SECTION")
                        .resourceId(sectionId)
                        .completed(false)
                        .build());

        int xpGained = 0;
        int coinsGained = 0;

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);

            // Reward for completing an entire section/exercise: +50 EXP, +15 Coins
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
