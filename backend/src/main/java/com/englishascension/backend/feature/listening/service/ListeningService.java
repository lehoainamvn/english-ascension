package com.englishascension.backend.feature.listening.service;

import com.englishascension.backend.feature.listening.dto.ListeningTopicResponse;
import com.englishascension.backend.feature.listening.dto.ListeningSectionResponse;
import com.englishascension.backend.feature.listening.dto.ListeningQuestionResponse;
import com.englishascension.backend.feature.roadmap.entity.Lesson;
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
public class ListeningService {

    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final QuestionRepository questionRepository;
    private final UserLessonStateRepository userLessonStateRepository;
    private final RewardService rewardService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ListeningService(UserRepository userRepository,
                            LessonRepository lessonRepository,
                            QuestionRepository questionRepository,
                            UserLessonStateRepository userLessonStateRepository,
                            RewardService rewardService) {
        this.userRepository    = userRepository;
        this.lessonRepository  = lessonRepository;
        this.questionRepository = questionRepository;
        this.userLessonStateRepository = userLessonStateRepository;
        this.rewardService     = rewardService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @SuppressWarnings("unchecked")
    private Set<String> getCompletedIds(UserLessonState state) {
        if (state == null || state.getAnswersJson() == null || state.getAnswersJson().isEmpty()) {
            return new HashSet<>();
        }
        try {
            List<String> list = objectMapper.readValue(state.getAnswersJson(), List.class);
            return new HashSet<>(list);
        } catch (Exception e) {
            return new HashSet<>();
        }
    }

    private void saveCompletedIds(UserLessonState state, Set<String> ids) {
        try {
            state.setAnswersJson(objectMapper.writeValueAsString(new ArrayList<>(ids)));
        } catch (Exception ignored) {}
    }

    public List<ListeningTopicResponse> getTopics() {
        User user = getCurrentUser();

        List<Lesson> topics = lessonRepository.findByType(LessonType.LISTENING);
        List<UserLessonState> progressList = userLessonStateRepository.findByUserIdAndLessonType(user.getId(), LessonType.LISTENING);

        Map<Long, UserLessonState> progressMap = progressList.stream()
                .collect(Collectors.toMap(p -> p.getLesson().getId(), p -> p));

        List<ListeningTopicResponse> response = new ArrayList<>();
        for (Lesson topic : topics) {
            List<Question> questions = questionRepository.findByLessonId(topic.getId());

            long sectionsCount = questions.stream()
                    .map(q -> q.getDifficulty() != null ? q.getDifficulty() : "Section 1")
                    .distinct()
                    .count();

            long questionsCount = questions.size();

            UserLessonState progress = progressMap.get(topic.getId());
            Set<String> completedIds = getCompletedIds(progress);
            long completedCount = completedIds.size();

            String desc = topic.getLessonContent() != null ? topic.getLessonContent().getBodyText() : "";
            String mediaUrl = topic.getLessonContent() != null ? topic.getLessonContent().getMediaUrl() : "";

            ListeningTopicResponse item = ListeningTopicResponse.builder()
                    .id(topic.getId())
                    .title(topic.getTitle())
                    .category(topic.getLevel()) // Category maps to level (A1, A2, B1, etc.)
                    .description(desc)
                    .mediaUrl(mediaUrl)
                    .sectionsCount((int) sectionsCount)
                    .questionsCount((int) questionsCount)
                    .completedCount((int) completedCount)
                    .build();
            response.add(item);
        }
        response.sort(Comparator.comparing(ListeningTopicResponse::getId));
        return response;
    }

    public List<ListeningSectionResponse> getTopicSections(Long topicId) {
        User user = getCurrentUser();

        Lesson topic = lessonRepository.findById(topicId)
                .filter(l -> l.getType() == LessonType.LISTENING)
                .orElseThrow(() -> new ResourceNotFoundException("Listening topic", topicId));

        List<Question> questions = questionRepository.findByLessonId(topicId);

        UserLessonState progress = userLessonStateRepository
                .findByUserIdAndLessonId(user.getId(), topicId).orElse(null);
        Set<String> completedIds = getCompletedIds(progress);

        Map<String, List<Question>> grouped = new TreeMap<>();
        for (Question q : questions) {
            String diff = q.getDifficulty() != null ? q.getDifficulty() : "Section 1";
            grouped.computeIfAbsent(diff, k -> new ArrayList<>()).add(q);
        }

        List<ListeningSectionResponse> responseSections = new ArrayList<>();
        int sectionIndex = 1;
        for (Map.Entry<String, List<Question>> entry : grouped.entrySet()) {
            List<Question> secQuestions = entry.getValue();
            long virtualSectionId = (topicId * 100) + sectionIndex;

            List<ListeningQuestionResponse> qResponses = new ArrayList<>();
            int qNum = 1;
            for (Question q : secQuestions) {
                String correctOpt = "";
                List<ListeningQuestionResponse.OptionResponse> optResponses = new ArrayList<>();
                if (q.getOptions() != null) {
                    List<com.englishascension.backend.feature.study.entity.QuestionOption> sortedOpts = new ArrayList<>(q.getOptions());
                    sortedOpts.sort(Comparator.comparing(com.englishascension.backend.feature.study.entity.QuestionOption::getOptionKey, Comparator.nullsLast(String::compareTo)));
                    for (com.englishascension.backend.feature.study.entity.QuestionOption opt : sortedOpts) {
                        optResponses.add(ListeningQuestionResponse.OptionResponse.builder()
                                .key(opt.getOptionKey())
                                .value(opt.getOptionValue())
                                .build());
                        if (opt.isCorrect()) {
                            correctOpt = opt.getOptionKey();
                        }
                    }
                }

                ListeningQuestionResponse qResponse = ListeningQuestionResponse.builder()
                        .id(q.getId())
                        .questionNumber(qNum++)
                        .text(q.getQuestionText())
                        .translation(q.getExplanation())
                        .audioUrl("") 
                        .options(optResponses)
                        .correctOption(correctOpt)
                        .isCompleted(completedIds.contains("q_" + q.getId()))
                        .build();
                qResponses.add(qResponse);
            }

            ListeningSectionResponse secMap = ListeningSectionResponse.builder()
                    .id(virtualSectionId)
                    .title(entry.getKey())
                    .orderIndex(sectionIndex)
                    .questionsCount(secQuestions.size())
                    .isCompleted(completedIds.contains("sec_" + virtualSectionId))
                    .questions(qResponses)
                    .build();
            responseSections.add(secMap);
            sectionIndex++;
        }
        return responseSections;
    }

    public RewardResult completeQuestion(Long questionId) {
        User user = getCurrentUser();

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Listening question", questionId));

        Lesson topic = question.getLesson();
        if (topic == null) {
            return rewardService.noReward(user);
        }

        UserLessonState progress = userLessonStateRepository
                .findByUserIdAndLessonId(user.getId(), topic.getId())
                .orElseGet(() -> UserLessonState.builder()
                        .user(user)
                        .lesson(topic)
                        .status("UNLOCKED")
                        .build());

        Set<String> completedIds = getCompletedIds(progress);
        String key = "q_" + questionId;

        if (!completedIds.contains(key)) {
            completedIds.add(key);
            saveCompletedIds(progress, completedIds);
            progress.setCompletedAt(LocalDateTime.now());
            userLessonStateRepository.save(progress);
            return rewardService.addRewards(user, 10, 0);
        }
        return rewardService.noReward(user);
    }

    public RewardResult completeSection(Long sectionId) {
        User user = getCurrentUser();

        long topicId = sectionId / 100;
        Lesson topic = lessonRepository.findById(topicId)
                .filter(l -> l.getType() == LessonType.LISTENING)
                .orElseThrow(() -> new ResourceNotFoundException("Listening topic", topicId));

        UserLessonState progress = userLessonStateRepository
                .findByUserIdAndLessonId(user.getId(), topicId)
                .orElseGet(() -> UserLessonState.builder()
                        .user(user)
                        .lesson(topic)
                        .status("UNLOCKED")
                        .build());

        Set<String> completedIds = getCompletedIds(progress);
        String key = "sec_" + sectionId;

        if (!completedIds.contains(key)) {
            completedIds.add(key);
            saveCompletedIds(progress, completedIds);
            progress.setCompletedAt(LocalDateTime.now());
            userLessonStateRepository.save(progress);
            return rewardService.addRewards(user, 50, 0);
        }
        return rewardService.noReward(user);
    }
}
