package com.englishascension.backend.feature.grammar.service;

import com.englishascension.backend.feature.grammar.dto.GrammarLessonResponse;
import com.englishascension.backend.feature.roadmap.entity.Lesson;
import com.englishascension.backend.feature.roadmap.entity.LessonContent;
import com.englishascension.backend.feature.roadmap.entity.LessonType;
import com.englishascension.backend.feature.roadmap.repository.LessonRepository;
import com.englishascension.backend.feature.study.entity.Question;
import com.englishascension.backend.feature.study.repository.QuestionRepository;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.entity.UserLessonState;
import com.englishascension.backend.feature.user.repository.UserLessonStateRepository;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.shared.exception.ResourceNotFoundException;
import com.englishascension.backend.shared.reward.RewardResult;
import com.englishascension.backend.shared.reward.RewardService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class GrammarService {

    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final QuestionRepository questionRepository;
    private final UserLessonStateRepository userLessonStateRepository;
    private final RewardService rewardService;

    public GrammarService(UserRepository userRepository,
                          LessonRepository lessonRepository,
                          QuestionRepository questionRepository,
                          UserLessonStateRepository userLessonStateRepository,
                          RewardService rewardService) {
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.questionRepository = questionRepository;
        this.userLessonStateRepository = userLessonStateRepository;
        this.rewardService = rewardService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public List<GrammarLessonResponse> getLessons() {
        User user = getCurrentUser();

        List<Lesson> lessons = lessonRepository.findByType(LessonType.GRAMMAR);
        List<UserLessonState> progressList = userLessonStateRepository.findByUserIdAndLessonType(user.getId(), LessonType.GRAMMAR);

        Map<Long, UserLessonState> progressMap = progressList.stream()
                .collect(Collectors.toMap(p -> p.getLesson().getId(), p -> p));

        List<GrammarLessonResponse> response = new ArrayList<>();
        for (Lesson lesson : lessons) {
            UserLessonState progress = progressMap.get(lesson.getId());

            boolean theoryCompleted = progress != null &&
                    ("THEORY_COMPLETED".equals(progress.getStatus()) || "COMPLETED".equals(progress.getStatus()));
            boolean practiceCompleted = progress != null && "COMPLETED".equals(progress.getStatus());

            int questionsCount = questionRepository.findByLessonId(lesson.getId()).size();

            GrammarLessonResponse item = GrammarLessonResponse.builder()
                    .id(lesson.getId())
                    .title(lesson.getTitle())
                    .vietnameseTitle(lesson.getTopic()) // Map topic to category/vietnamese title
                    .questionsCount(questionsCount)
                    .xpRewardLesson(30)
                    .coinRewardLesson(0)
                    .xpRewardPractice(50)
                    .coinRewardPractice(0)
                    .lessonCompleted(theoryCompleted)
                    .practiceCompleted(practiceCompleted)
                    .score(progress != null ? progress.getScore() : null)
                    .level(lesson.getLevel())
                    .build();
            response.add(item);
        }
        response.sort(Comparator.comparing(GrammarLessonResponse::getId));
        return response;
    }

    public GrammarLessonResponse getLesson(Long lessonId) {
        User user = getCurrentUser();

        Lesson lesson = lessonRepository.findById(lessonId)
                .filter(l -> l.getType() == LessonType.GRAMMAR)
                .orElseThrow(() -> new ResourceNotFoundException("Grammar lesson", lessonId));

        UserLessonState progress = userLessonStateRepository
                .findByUserIdAndLessonId(user.getId(), lessonId).orElse(null);

        boolean theoryCompleted = progress != null &&
                ("THEORY_COMPLETED".equals(progress.getStatus()) || "COMPLETED".equals(progress.getStatus()));
        boolean practiceCompleted = progress != null && "COMPLETED".equals(progress.getStatus());

        LessonContent content = lesson.getLessonContent();
        String theoryText = content != null ? content.getBodyText() : "";

        int questionsCount = questionRepository.findByLessonId(lesson.getId()).size();

        return GrammarLessonResponse.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .vietnameseTitle(lesson.getTopic())
                .theoryContent(theoryText)
                .questionsCount(questionsCount)
                .xpRewardLesson(30)
                .coinRewardLesson(0)
                .xpRewardPractice(50)
                .coinRewardPractice(0)
                .lessonCompleted(theoryCompleted)
                .practiceCompleted(practiceCompleted)
                .score(progress != null ? progress.getScore() : null)
                .level(lesson.getLevel())
                .build();
    }

    public List<Question> getQuestions(Long lessonId) {
        lessonRepository.findById(lessonId)
                .filter(l -> l.getType() == LessonType.GRAMMAR)
                .orElseThrow(() -> new ResourceNotFoundException("Grammar lesson", lessonId));
        return questionRepository.findByLessonId(lessonId);
    }

    public RewardResult completeLesson(Long lessonId) {
        User user = getCurrentUser();

        Lesson lesson = lessonRepository.findById(lessonId)
                .filter(l -> l.getType() == LessonType.GRAMMAR)
                .orElseThrow(() -> new ResourceNotFoundException("Grammar lesson", lessonId));

        UserLessonState progress = userLessonStateRepository
                .findByUserIdAndLessonId(user.getId(), lessonId)
                .orElseGet(() -> UserLessonState.builder()
                        .user(user)
                        .lesson(lesson)
                        .status("UNLOCKED")
                        .build());

        boolean theoryCompleted = "THEORY_COMPLETED".equals(progress.getStatus()) || "COMPLETED".equals(progress.getStatus());

        if (!theoryCompleted) {
            if ("COMPLETED".equals(progress.getStatus())) {
                // already fully completed
            } else {
                progress.setStatus("THEORY_COMPLETED");
                progress.setCompletedAt(LocalDateTime.now());
                userLessonStateRepository.save(progress);
                return rewardService.addRewards(user, 30, 0);
            }
        }
        return rewardService.noReward(user);
    }

    public RewardResult completePractice(Long lessonId, Map<String, Object> requestBody) {
        User user = getCurrentUser();

        Lesson lesson = lessonRepository.findById(lessonId)
                .filter(l -> l.getType() == LessonType.GRAMMAR)
                .orElseThrow(() -> new ResourceNotFoundException("Grammar lesson", lessonId));

        Integer score = requestBody.get("score") instanceof Integer i ? i : 100;

        UserLessonState progress = userLessonStateRepository
                .findByUserIdAndLessonId(user.getId(), lessonId)
                .orElseGet(() -> UserLessonState.builder()
                        .user(user)
                        .lesson(lesson)
                        .status("UNLOCKED")
                        .build());

        boolean practiceCompleted = "COMPLETED".equals(progress.getStatus());

        if (!practiceCompleted) {
            progress.setStatus("COMPLETED");
            progress.setScore(score);
            progress.setCompletedAt(LocalDateTime.now());
            userLessonStateRepository.save(progress);
            return rewardService.addRewards(user, 50, 0);
        }

        if (progress.getScore() == null || score > progress.getScore()) {
            progress.setScore(score);
            userLessonStateRepository.save(progress);
        }
        return rewardService.noReward(user);
    }
}
