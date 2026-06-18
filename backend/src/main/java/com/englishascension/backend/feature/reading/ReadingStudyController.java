package com.englishascension.backend.feature.reading;

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
@RequestMapping("/api/reading")
public class ReadingStudyController {

    private static final Logger log = LoggerFactory.getLogger(ReadingStudyController.class);

    private final UserRepository userRepository;
    private final StudyContentRepository articleRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository progressRepository;

    public ReadingStudyController(
            UserRepository userRepository,
            StudyContentRepository articleRepository,
            QuestionRepository questionRepository,
            UserProgressRepository progressRepository) {
        this.userRepository = userRepository;
        this.articleRepository = articleRepository;
        this.questionRepository = questionRepository;
        this.progressRepository = progressRepository;
    }

    @GetMapping("/articles")
    public ResponseEntity<?> getArticles() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<StudyContent> articles = articleRepository.findByType("READING");
        List<UserProgress> articleProgressList = progressRepository.findByUserIdAndResourceType(user.getId(), "READING_ARTICLE");

        Map<Long, Boolean> completedArticlesMap = new HashMap<>();
        for (UserProgress p : articleProgressList) {
            completedArticlesMap.put(p.getResourceId(), p.isCompleted());
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (StudyContent art : articles) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", art.getId());
            item.put("title", art.getTitle());
            item.put("level", art.getDuration()); // Level mapped to duration
            item.put("questionsCount", art.getQuestionsCount());
            
            boolean isCompleted = completedArticlesMap.getOrDefault(art.getId(), false);
            item.put("isCompleted", isCompleted);
            
            response.add(item);
        }

        response.sort(Comparator.comparing(item -> (Long) item.get("id")));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/articles/{articleId}")
    public ResponseEntity<?> getArticleDetails(@PathVariable Long articleId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        StudyContent article = articleRepository.findById(articleId).orElse(null);
        if (article == null || !"READING".equals(article.getType())) {
            return ResponseEntity.notFound().build();
        }

        List<Question> questions = questionRepository.findBySourceTypeAndParentId("READING", articleId);
        List<UserProgress> userQProgress = progressRepository.findByUserIdAndResourceType(user.getId(), "READING_QUESTION");
        
        Optional<UserProgress> userArtProgress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "READING_ARTICLE", articleId);

        Map<Long, Boolean> questionStatusMap = new HashMap<>();
        for (UserProgress qp : userQProgress) {
            if (qp.isCompleted()) {
                questionStatusMap.put(qp.getResourceId(), true);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", article.getId());
        response.put("title", article.getTitle());
        response.put("content", article.getBodyText());
        response.put("vietnameseContent", article.getDescription());
        response.put("level", article.getDuration()); // Level mapped to duration
        response.put("questionsCount", article.getQuestionsCount());
        response.put("vocabularyJson", article.getMediaUrl()); // Vocab JSON mapped to mediaUrl
        response.put("isCompleted", userArtProgress.isPresent() && userArtProgress.get().isCompleted());

        List<Map<String, Object>> questionsList = new ArrayList<>();
        for (Question q : questions) {
            Map<String, Object> qMap = new HashMap<>();
            qMap.put("id", q.getId());
            qMap.put("questionNumber", q.getQuestionNumber());
            qMap.put("questionText", q.getQuestionText());
            qMap.put("optionA", q.getOptionA());
            qMap.put("optionB", q.getOptionB());
            qMap.put("optionC", q.getOptionC());
            qMap.put("optionD", q.getOptionD());
            qMap.put("correctOption", q.getCorrectOption());
            qMap.put("explanation", q.getExplanation());
            qMap.put("isCorrect", questionStatusMap.getOrDefault(q.getId(), false));
            questionsList.add(qMap);
        }
        questionsList.sort(Comparator.comparing(q -> (Integer) q.get("questionNumber")));
        response.put("questions", questionsList);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/questions/{questionId}/submit")
    public ResponseEntity<?> submitAnswer(@PathVariable Long questionId, @RequestParam String selectedOption) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Question question = questionRepository.findById(questionId).orElse(null);
        if (question == null || !"READING".equals(question.getSourceType())) {
            return ResponseEntity.notFound().build();
        }

        boolean isCorrect = question.getCorrectOption() != null && question.getCorrectOption().equalsIgnoreCase(selectedOption.trim());
        int xpGained = 0;
        int coinsGained = 0;

        if (isCorrect) {
            UserProgress progress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "READING_QUESTION", questionId)
                    .orElseGet(() -> UserProgress.builder()
                            .user(user)
                            .resourceType("READING_QUESTION")
                            .resourceId(questionId)
                            .completed(false)
                            .build());

            if (!progress.isCompleted()) {
                progress.setCompleted(true);
                progress.setCompletedAt(LocalDateTime.now());
                progressRepository.save(progress);

                // Correct answer reward: +10 EXP, +2 Coins
                xpGained = 10;
                coinsGained = 2;
                addRewardsToUser(user, xpGained, coinsGained);
            }
        }

        Map<String, Object> result = getRewardResponseMap(user, xpGained, coinsGained);
        result.put("isCorrect", isCorrect);
        result.put("correctOption", question.getCorrectOption());
        result.put("explanation", question.getExplanation());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/articles/{articleId}/complete")
    public ResponseEntity<?> completeArticle(@PathVariable Long articleId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        StudyContent article = articleRepository.findById(articleId).orElse(null);
        if (article == null || !"READING".equals(article.getType())) {
            return ResponseEntity.notFound().build();
        }

        UserProgress progress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "READING_ARTICLE", articleId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user)
                        .resourceType("READING_ARTICLE")
                        .resourceId(articleId)
                        .completed(false)
                        .build());

        int xpGained = 0;
        int coinsGained = 0;

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);

            // Article completion reward: +50 EXP, +15 Coins
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
