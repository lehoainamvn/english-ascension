package com.englishascension.backend.feature.reading.service;

import com.englishascension.backend.feature.reading.dto.ReadingArticleResponse;
import com.englishascension.backend.feature.roadmap.entity.Lesson;
import com.englishascension.backend.feature.roadmap.entity.LessonContent;
import com.englishascension.backend.feature.roadmap.entity.LessonType;
import com.englishascension.backend.feature.roadmap.repository.LessonRepository;
import com.englishascension.backend.feature.study.entity.Question;
import com.englishascension.backend.feature.study.entity.QuestionOption;
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
public class ReadingService {

    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final QuestionRepository questionRepository;
    private final UserLessonStateRepository userLessonStateRepository;
    private final RewardService rewardService;

    public ReadingService(UserRepository userRepository,
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

    public List<ReadingArticleResponse> getArticles() {
        User user = getCurrentUser();

        List<Lesson> articles = lessonRepository.findByType(LessonType.READING);
        List<UserLessonState> progressList = userLessonStateRepository.findByUserIdAndLessonType(user.getId(), LessonType.READING);

        Map<Long, UserLessonState> progressMap = progressList.stream()
                .collect(Collectors.toMap(p -> p.getLesson().getId(), p -> p));

        List<ReadingArticleResponse> response = new ArrayList<>();
        for (Lesson art : articles) {
            UserLessonState progress = progressMap.get(art.getId());

            boolean articleCompleted = progress != null &&
                    ("THEORY_COMPLETED".equals(progress.getStatus()) || "COMPLETED".equals(progress.getStatus()));
            boolean practiceCompleted = progress != null && "COMPLETED".equals(progress.getStatus());

            int questionsCount = questionRepository.findByLessonId(art.getId()).size();

            ReadingArticleResponse item = ReadingArticleResponse.builder()
                    .id(art.getId())
                    .title(art.getTitle())
                    .category(art.getTopic()) // Map topic to category
                    .articleCompleted(articleCompleted)
                    .practiceCompleted(practiceCompleted)
                    .score(progress != null ? progress.getScore() : null)
                    .questionsCount(questionsCount)
                    .level(art.getLevel())
                    .isCompleted(articleCompleted)
                    .build();
            response.add(item);
        }
        response.sort(Comparator.comparing(ReadingArticleResponse::getId));
        return response;
    }

    public Map<String, Object> getArticleDetails(Long articleId) {
        User user = getCurrentUser();

        Lesson article = lessonRepository.findById(articleId)
                .filter(l -> l.getType() == LessonType.READING)
                .orElseThrow(() -> new ResourceNotFoundException("Reading article", articleId));

        List<Question> questions = questionRepository.findByLessonId(articleId);
        UserLessonState artProgress = userLessonStateRepository
                .findByUserIdAndLessonId(user.getId(), articleId).orElse(null);

        List<Map<String, Object>> questionsList = new ArrayList<>();
        int index = 1;
        for (Question q : questions) {
            Map<String, Object> qMap = new HashMap<>();
            qMap.put("id", q.getId());
            qMap.put("questionNumber", index++);
            qMap.put("questionText", q.getQuestionText());

            qMap.put("optionA", "");
            qMap.put("optionB", "");
            qMap.put("optionC", "");
            qMap.put("optionD", "");
            String correctOptKey = "A";

            for (QuestionOption opt : q.getOptions()) {
                if ("A".equalsIgnoreCase(opt.getOptionKey())) qMap.put("optionA", opt.getOptionValue());
                if ("B".equalsIgnoreCase(opt.getOptionKey())) qMap.put("optionB", opt.getOptionValue());
                if ("C".equalsIgnoreCase(opt.getOptionKey())) qMap.put("optionC", opt.getOptionValue());
                if ("D".equalsIgnoreCase(opt.getOptionKey())) qMap.put("optionD", opt.getOptionValue());
                if (opt.isCorrect()) {
                    correctOptKey = opt.getOptionKey();
                }
            }

            qMap.put("correctOption", correctOptKey);
            qMap.put("explanation", q.getExplanation());
            qMap.put("isCorrect", artProgress != null && "COMPLETED".equals(artProgress.getStatus()));
            questionsList.add(qMap);
        }

        LessonContent content = article.getLessonContent();
        String bodyText = content != null ? content.getBodyText() : "";

        Map<String, Object> response = new HashMap<>();
        response.put("id", article.getId());
        response.put("title", article.getTitle());
        response.put("category", article.getTopic());
        response.put("content", bodyText);
        response.put("vietnameseContent", content != null ? content.getMediaUrl() : "");
        response.put("level", article.getLevel());
        response.put("isCompleted", artProgress != null &&
                ("THEORY_COMPLETED".equals(artProgress.getStatus()) || "COMPLETED".equals(artProgress.getStatus())));
        response.put("questions", questionsList);
        return response;
    }

    public Map<String, Object> submitAnswer(Long questionId, String selectedOption) {
        User user = getCurrentUser();

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Reading question", questionId));

        Lesson article = question.getLesson();
        if (article == null) {
            throw new ResourceNotFoundException("Article not found for question", questionId);
        }

        boolean isCorrect = question.getOptions().stream()
                .anyMatch(opt -> opt.getOptionKey().equalsIgnoreCase(selectedOption.trim()) && opt.isCorrect());

        String correctOption = question.getOptions().stream()
                .filter(QuestionOption::isCorrect)
                .map(QuestionOption::getOptionKey)
                .findFirst()
                .orElse("A");

        RewardResult reward;
        if (isCorrect) {
            UserLessonState progress = userLessonStateRepository
                    .findByUserIdAndLessonId(user.getId(), article.getId())
                    .orElseGet(() -> UserLessonState.builder()
                            .user(user)
                            .lesson(article)
                            .status("UNLOCKED")
                            .build());

            boolean practiceCompleted = "COMPLETED".equals(progress.getStatus());

            if (!practiceCompleted) {
                progress.setStatus("COMPLETED");
                progress.setCompletedAt(LocalDateTime.now());
                userLessonStateRepository.save(progress);
                reward = rewardService.addRewards(user, 10, 0);
            } else {
                reward = rewardService.noReward(user);
            }
        } else {
            reward = rewardService.noReward(user);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("xpGained", reward.getXpGained());
        result.put("coinsGained", reward.getCoinsGained());
        result.put("newXp", reward.getNewXp());
        result.put("newLevel", reward.getNewLevel());
        result.put("newCoins", reward.getNewCoins());
        result.put("leveledUp", reward.isLeveledUp());
        result.put("previousLevel", reward.getPreviousLevel());
        result.put("newTitle", reward.getNewTitle());
        result.put("isCorrect", isCorrect);
        result.put("correctOption", correctOption);
        result.put("explanation", question.getExplanation());
        return result;
    }

    public RewardResult completeArticle(Long articleId) {
        User user = getCurrentUser();

        Lesson article = lessonRepository.findById(articleId)
                .filter(l -> l.getType() == LessonType.READING)
                .orElseThrow(() -> new ResourceNotFoundException("Reading article", articleId));

        UserLessonState progress = userLessonStateRepository
                .findByUserIdAndLessonId(user.getId(), articleId)
                .orElseGet(() -> UserLessonState.builder()
                        .user(user)
                        .lesson(article)
                        .status("UNLOCKED")
                        .build());

        boolean articleCompleted = "THEORY_COMPLETED".equals(progress.getStatus()) || "COMPLETED".equals(progress.getStatus());

        if (!articleCompleted) {
            if ("COMPLETED".equals(progress.getStatus())) {
                // already completed
            } else {
                progress.setStatus("THEORY_COMPLETED");
                progress.setCompletedAt(LocalDateTime.now());
                userLessonStateRepository.save(progress);
                return rewardService.addRewards(user, 50, 0);
            }
        }
        return rewardService.noReward(user);
    }
}
