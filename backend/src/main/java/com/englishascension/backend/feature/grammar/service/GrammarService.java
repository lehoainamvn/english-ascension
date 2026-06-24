package com.englishascension.backend.feature.grammar.service;

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
 * Business logic for grammar study.
 */
@Service
public class GrammarService {

    private final UserRepository userRepository;
    private final StudyContentRepository lessonRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository progressRepository;
    private final RewardService rewardService;

    public GrammarService(UserRepository userRepository,
                          StudyContentRepository lessonRepository,
                          QuestionRepository questionRepository,
                          UserProgressRepository progressRepository,
                          RewardService rewardService) {
        this.userRepository   = userRepository;
        this.lessonRepository = lessonRepository;
        this.questionRepository = questionRepository;
        this.progressRepository = progressRepository;
        this.rewardService    = rewardService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    // ------------------------------------------------------------------
    // List lessons
    // ------------------------------------------------------------------

    public List<Map<String, Object>> getLessons() {
        User user = getCurrentUser();

        List<StudyContent> lessons             = lessonRepository.findByType("GRAMMAR");
        List<UserProgress> lessonProgressList  = progressRepository.findByUserIdAndResourceType(user.getId(), "GRAMMAR_LESSON");
        List<UserProgress> practiceProgressList= progressRepository.findByUserIdAndResourceType(user.getId(), "GRAMMAR_PRACTICE");

        Map<Long, Boolean> lessonCompletedMap   = new HashMap<>();
        Map<Long, Boolean> practiceCompletedMap = new HashMap<>();
        Map<Long, Integer> scoreMap             = new HashMap<>();

        for (UserProgress p : lessonProgressList) {
            lessonCompletedMap.put(p.getResourceId(), p.isCompleted());
        }
        for (UserProgress p : practiceProgressList) {
            practiceCompletedMap.put(p.getResourceId(), p.isCompleted());
            scoreMap.put(p.getResourceId(), p.getScore());
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (StudyContent lesson : lessons) {
            Map<String, Object> item = new HashMap<>();
            item.put("id",               lesson.getId());
            item.put("title",            lesson.getTitle());
            item.put("vietnameseTitle",  lesson.getCategory());
            item.put("questionsCount",   lesson.getQuestionsCount());
            item.put("xpRewardLesson",   30);
            item.put("coinRewardLesson", 10);
            item.put("xpRewardPractice",   50);
            item.put("coinRewardPractice", 15);
            item.put("lessonCompleted",  lessonCompletedMap.getOrDefault(lesson.getId(), false));
            item.put("practiceCompleted",practiceCompletedMap.getOrDefault(lesson.getId(), false));
            item.put("score",            scoreMap.get(lesson.getId()));
            response.add(item);
        }
        response.sort(Comparator.comparing(item -> (Long) item.get("id")));
        return response;
    }

    // ------------------------------------------------------------------
    // Get single lesson
    // ------------------------------------------------------------------

    public Map<String, Object> getLesson(Long lessonId) {
        User user = getCurrentUser();

        StudyContent lesson = lessonRepository.findById(lessonId)
                .filter(l -> "GRAMMAR".equals(l.getType()))
                .orElseThrow(() -> new ResourceNotFoundException("Grammar lesson", lessonId));

        UserProgress lessonProgress   = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "GRAMMAR_LESSON",   lessonId).orElse(null);
        UserProgress practiceProgress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "GRAMMAR_PRACTICE", lessonId).orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("id",               lesson.getId());
        response.put("title",            lesson.getTitle());
        response.put("vietnameseTitle",  lesson.getCategory());
        response.put("theoryContent",    lesson.getBodyText());
        response.put("xpRewardLesson",   30);
        response.put("coinRewardLesson", 10);
        response.put("xpRewardPractice",   50);
        response.put("coinRewardPractice", 15);
        response.put("lessonCompleted",  lessonProgress   != null && lessonProgress.isCompleted());
        response.put("practiceCompleted",practiceProgress != null && practiceProgress.isCompleted());
        response.put("score",            practiceProgress != null ? practiceProgress.getScore() : null);
        return response;
    }

    // ------------------------------------------------------------------
    // Get questions
    // ------------------------------------------------------------------

    public List<Question> getQuestions(Long lessonId) {
        lessonRepository.findById(lessonId)
                .filter(l -> "GRAMMAR".equals(l.getType()))
                .orElseThrow(() -> new ResourceNotFoundException("Grammar lesson", lessonId));
        return questionRepository.findBySourceTypeAndParentId("GRAMMAR", lessonId);
    }

    // ------------------------------------------------------------------
    // Complete lesson theory
    // ------------------------------------------------------------------

    public RewardResult completeLesson(Long lessonId) {
        User user = getCurrentUser();

        lessonRepository.findById(lessonId)
                .filter(l -> "GRAMMAR".equals(l.getType()))
                .orElseThrow(() -> new ResourceNotFoundException("Grammar lesson", lessonId));

        UserProgress progress = progressRepository
                .findByUserIdAndResourceTypeAndResourceId(user.getId(), "GRAMMAR_LESSON", lessonId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user).resourceType("GRAMMAR_LESSON").resourceId(lessonId).completed(false).build());

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);
            return rewardService.addRewards(user, 30, 10);
        }
        return rewardService.noReward(user);
    }

    // ------------------------------------------------------------------
    // Complete practice quiz
    // ------------------------------------------------------------------

    public RewardResult completePractice(Long lessonId, Map<String, Object> requestBody) {
        User user = getCurrentUser();

        lessonRepository.findById(lessonId)
                .filter(l -> "GRAMMAR".equals(l.getType()))
                .orElseThrow(() -> new ResourceNotFoundException("Grammar lesson", lessonId));

        Integer score = requestBody.get("score") instanceof Integer i ? i : 100;

        UserProgress progress = progressRepository
                .findByUserIdAndResourceTypeAndResourceId(user.getId(), "GRAMMAR_PRACTICE", lessonId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user).resourceType("GRAMMAR_PRACTICE").resourceId(lessonId).completed(false).build());

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setScore(score);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);
            return rewardService.addRewards(user, 50, 15);
        }

        // Update score if higher
        if (progress.getScore() == null || score > progress.getScore()) {
            progress.setScore(score);
            progressRepository.save(progress);
        }
        return rewardService.noReward(user);
    }
}
