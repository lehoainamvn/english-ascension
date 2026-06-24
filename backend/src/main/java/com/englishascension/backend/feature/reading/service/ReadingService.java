package com.englishascension.backend.feature.reading.service;

import com.englishascension.backend.feature.study.entity.Question;
import com.englishascension.backend.feature.study.repository.QuestionRepository;
import com.englishascension.backend.feature.study.entity.StudyContent;
import com.englishascension.backend.feature.study.repository.StudyContentRepository;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.entity.UserProgress;
import com.englishascension.backend.feature.user.repository.UserProgressRepository;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.shared.exception.ResourceNotFoundException;
import com.englishascension.backend.shared.reward.RewardResult;
import com.englishascension.backend.shared.reward.RewardService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Business logic for reading study.
 */
@Service
public class ReadingService {

    private final UserRepository userRepository;
    private final StudyContentRepository articleRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository progressRepository;
    private final RewardService rewardService;

    public ReadingService(UserRepository userRepository,
                          StudyContentRepository articleRepository,
                          QuestionRepository questionRepository,
                          UserProgressRepository progressRepository,
                          RewardService rewardService) {
        this.userRepository    = userRepository;
        this.articleRepository = articleRepository;
        this.questionRepository = questionRepository;
        this.progressRepository = progressRepository;
        this.rewardService     = rewardService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    // ------------------------------------------------------------------
    // List articles
    // ------------------------------------------------------------------

    public List<Map<String, Object>> getArticles() {
        User user = getCurrentUser();

        List<StudyContent> articles         = articleRepository.findByType("READING");
        List<UserProgress> articleProgress  = progressRepository.findByUserIdAndResourceType(user.getId(), "READING_ARTICLE");

        Map<Long, Boolean> completedMap = new HashMap<>();
        for (UserProgress p : articleProgress) {
            completedMap.put(p.getResourceId(), p.isCompleted());
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (StudyContent art : articles) {
            Map<String, Object> item = new HashMap<>();
            item.put("id",             art.getId());
            item.put("title",          art.getTitle());
            item.put("category",       art.getCategory());
            item.put("level",          art.getDuration());
            item.put("questionsCount", art.getQuestionsCount());
            item.put("isCompleted",    completedMap.getOrDefault(art.getId(), false));
            response.add(item);
        }
        response.sort(Comparator.comparing(item -> (Long) item.get("id")));
        return response;
    }

    // ------------------------------------------------------------------
    // Get article detail
    // ------------------------------------------------------------------

    public Map<String, Object> getArticleDetails(Long articleId) {
        User user = getCurrentUser();

        StudyContent article = articleRepository.findById(articleId)
                .filter(a -> "READING".equals(a.getType()))
                .orElseThrow(() -> new ResourceNotFoundException("Reading article", articleId));

        List<Question> questions     = questionRepository.findBySourceTypeAndParentId("READING", articleId);
        List<UserProgress> qProgress = progressRepository.findByUserIdAndResourceType(user.getId(), "READING_QUESTION");
        Optional<UserProgress> artProgress = progressRepository.findByUserIdAndResourceTypeAndResourceId(
                user.getId(), "READING_ARTICLE", articleId);

        Map<Long, Boolean> questionStatusMap = new HashMap<>();
        for (UserProgress qp : qProgress) {
            if (qp.isCompleted()) questionStatusMap.put(qp.getResourceId(), true);
        }

        List<Map<String, Object>> questionsList = new ArrayList<>();
        for (Question q : questions) {
            Map<String, Object> qMap = new HashMap<>();
            qMap.put("id",             q.getId());
            qMap.put("questionNumber", q.getQuestionNumber());
            qMap.put("questionText",   q.getQuestionText());
            qMap.put("optionA",        q.getOptionA());
            qMap.put("optionB",        q.getOptionB());
            qMap.put("optionC",        q.getOptionC());
            qMap.put("optionD",        q.getOptionD());
            qMap.put("correctOption",  q.getCorrectOption());
            qMap.put("explanation",    q.getExplanation());
            qMap.put("isCorrect",      questionStatusMap.getOrDefault(q.getId(), false));
            questionsList.add(qMap);
        }
        questionsList.sort(Comparator.comparing(q -> (Integer) q.get("questionNumber")));

        Map<String, Object> response = new HashMap<>();
        response.put("id",              article.getId());
        response.put("title",           article.getTitle());
        response.put("category",        article.getCategory());
        response.put("content",         article.getBodyText());
        response.put("vietnameseContent",article.getDescription());
        response.put("level",           article.getDuration());
        response.put("questionsCount",  article.getQuestionsCount());
        response.put("vocabularyJson",  article.getMediaUrl());
        response.put("isCompleted",     artProgress.isPresent() && artProgress.get().isCompleted());
        response.put("questions",       questionsList);
        return response;
    }

    // ------------------------------------------------------------------
    // Submit answer
    // ------------------------------------------------------------------

    public Map<String, Object> submitAnswer(Long questionId, String selectedOption) {
        User user = getCurrentUser();

        Question question = questionRepository.findById(questionId)
                .filter(q -> "READING".equals(q.getSourceType()))
                .orElseThrow(() -> new ResourceNotFoundException("Reading question", questionId));

        boolean isCorrect = question.getCorrectOption() != null
                && question.getCorrectOption().equalsIgnoreCase(selectedOption.trim());

        RewardResult reward;
        if (isCorrect) {
            UserProgress progress = progressRepository
                    .findByUserIdAndResourceTypeAndResourceId(user.getId(), "READING_QUESTION", questionId)
                    .orElseGet(() -> UserProgress.builder()
                            .user(user).resourceType("READING_QUESTION").resourceId(questionId).completed(false).build());

            if (!progress.isCompleted()) {
                progress.setCompleted(true);
                progress.setCompletedAt(LocalDateTime.now());
                progressRepository.save(progress);
                reward = rewardService.addRewards(user, 10, 2);
            } else {
                reward = rewardService.noReward(user);
            }
        } else {
            reward = rewardService.noReward(user);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("xpGained",     reward.getXpGained());
        result.put("coinsGained",  reward.getCoinsGained());
        result.put("newXp",        reward.getNewXp());
        result.put("newLevel",     reward.getNewLevel());
        result.put("newCoins",     reward.getNewCoins());
        result.put("leveledUp",    reward.isLeveledUp());
        result.put("previousLevel",reward.getPreviousLevel());
        result.put("newTitle",     reward.getNewTitle());
        result.put("isCorrect",    isCorrect);
        result.put("correctOption",question.getCorrectOption());
        result.put("explanation",  question.getExplanation());
        return result;
    }

    // ------------------------------------------------------------------
    // Complete article
    // ------------------------------------------------------------------

    public RewardResult completeArticle(Long articleId) {
        User user = getCurrentUser();

        articleRepository.findById(articleId)
                .filter(a -> "READING".equals(a.getType()))
                .orElseThrow(() -> new ResourceNotFoundException("Reading article", articleId));

        UserProgress progress = progressRepository
                .findByUserIdAndResourceTypeAndResourceId(user.getId(), "READING_ARTICLE", articleId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user).resourceType("READING_ARTICLE").resourceId(articleId).completed(false).build());

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);
            return rewardService.addRewards(user, 50, 15);
        }
        return rewardService.noReward(user);
    }
}
