package com.englishascension.backend.feature.grammar;

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
@RequestMapping("/api/grammar")
public class GrammarStudyController {

    private static final Logger log = LoggerFactory.getLogger(GrammarStudyController.class);

    private final UserRepository userRepository;
    private final StudyContentRepository lessonRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository progressRepository;

    public GrammarStudyController(
            UserRepository userRepository,
            StudyContentRepository lessonRepository,
            QuestionRepository questionRepository,
            UserProgressRepository progressRepository) {
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.questionRepository = questionRepository;
        this.progressRepository = progressRepository;
    }

    @GetMapping("/lessons")
    public ResponseEntity<?> getLessons() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<StudyContent> lessons = lessonRepository.findByType("GRAMMAR");
        List<UserProgress> lessonProgressList = progressRepository.findByUserIdAndResourceType(user.getId(), "GRAMMAR_LESSON");
        List<UserProgress> practiceProgressList = progressRepository.findByUserIdAndResourceType(user.getId(), "GRAMMAR_PRACTICE");

        // Map progress for quick lookup
        Map<Long, Boolean> lessonCompletedMap = new HashMap<>();
        for (UserProgress p : lessonProgressList) {
            lessonCompletedMap.put(p.getResourceId(), p.isCompleted());
        }

        Map<Long, Boolean> practiceCompletedMap = new HashMap<>();
        Map<Long, Integer> scoreMap = new HashMap<>();
        for (UserProgress p : practiceProgressList) {
            practiceCompletedMap.put(p.getResourceId(), p.isCompleted());
            scoreMap.put(p.getResourceId(), p.getScore());
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (StudyContent lesson : lessons) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", lesson.getId());
            item.put("title", lesson.getTitle());
            item.put("vietnameseTitle", lesson.getCategory());
            item.put("questionsCount", lesson.getQuestionsCount());
            item.put("xpRewardLesson", 30);
            item.put("coinRewardLesson", 10);
            item.put("xpRewardPractice", 50);
            item.put("coinRewardPractice", 15);

            item.put("lessonCompleted", lessonCompletedMap.getOrDefault(lesson.getId(), false));
            item.put("practiceCompleted", practiceCompletedMap.getOrDefault(lesson.getId(), false));
            item.put("score", scoreMap.get(lesson.getId()));
            response.add(item);
        }

        // Sort response by ID for stability
        response.sort(Comparator.comparing(item -> (Long) item.get("id")));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/lessons/{lessonId}")
    public ResponseEntity<?> getLesson(@PathVariable Long lessonId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        StudyContent lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null || !"GRAMMAR".equals(lesson.getType())) {
            return ResponseEntity.notFound().build();
        }

        UserProgress lessonProgress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "GRAMMAR_LESSON", lessonId).orElse(null);
        UserProgress practiceProgress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "GRAMMAR_PRACTICE", lessonId).orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("id", lesson.getId());
        response.put("title", lesson.getTitle());
        response.put("vietnameseTitle", lesson.getCategory());
        response.put("theoryContent", lesson.getBodyText());
        response.put("xpRewardLesson", 30);
        response.put("coinRewardLesson", 10);
        response.put("xpRewardPractice", 50);
        response.put("coinRewardPractice", 15);
        response.put("lessonCompleted", lessonProgress != null && lessonProgress.isCompleted());
        response.put("practiceCompleted", practiceProgress != null && practiceProgress.isCompleted());
        response.put("score", practiceProgress != null ? practiceProgress.getScore() : null);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/lessons/{lessonId}/questions")
    public ResponseEntity<?> getQuestions(@PathVariable Long lessonId) {
        StudyContent lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null || !"GRAMMAR".equals(lesson.getType())) {
            return ResponseEntity.notFound().build();
        }

        List<Question> questions = questionRepository.findBySourceTypeAndParentId("GRAMMAR", lessonId);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/lessons/{lessonId}/complete-lesson")
    public ResponseEntity<?> completeLesson(@PathVariable Long lessonId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        StudyContent lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null || !"GRAMMAR".equals(lesson.getType())) {
            return ResponseEntity.notFound().build();
        }

        UserProgress progress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "GRAMMAR_LESSON", lessonId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user)
                        .resourceType("GRAMMAR_LESSON")
                        .resourceId(lessonId)
                        .completed(false)
                        .build());

        int xpGained = 0;
        int coinsGained = 0;

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);

            xpGained = 30;
            coinsGained = 10;
            
            // Add rewards
            addRewardsToUser(user, xpGained, coinsGained);
        }

        Map<String, Object> result = getRewardResponseMap(user, xpGained, coinsGained);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/lessons/{lessonId}/complete-practice")
    public ResponseEntity<?> completePractice(@PathVariable Long lessonId, @RequestBody Map<String, Object> request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        StudyContent lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null || !"GRAMMAR".equals(lesson.getType())) {
            return ResponseEntity.notFound().build();
        }

        Integer score = (Integer) request.get("score");
        if (score == null) {
            score = 100; // default
        }

        UserProgress progress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "GRAMMAR_PRACTICE", lessonId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user)
                        .resourceType("GRAMMAR_PRACTICE")
                        .resourceId(lessonId)
                        .completed(false)
                        .build());

        int xpGained = 0;
        int coinsGained = 0;

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setScore(score);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);

            xpGained = 50;
            coinsGained = 15;

            // Add rewards
            addRewardsToUser(user, xpGained, coinsGained);
        } else {
            // Update score if higher
            if (progress.getScore() == null || score > progress.getScore()) {
                progress.setScore(score);
                progressRepository.save(progress);
            }
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
