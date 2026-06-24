package com.englishascension.backend.feature.listening.service;

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
 * Business logic for listening study.
 */
@Service
public class ListeningService {

    private final UserRepository userRepository;
    private final StudyContentRepository topicRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository progressRepository;
    private final RewardService rewardService;

    public ListeningService(UserRepository userRepository,
                            StudyContentRepository topicRepository,
                            QuestionRepository questionRepository,
                            UserProgressRepository progressRepository,
                            RewardService rewardService) {
        this.userRepository    = userRepository;
        this.topicRepository   = topicRepository;
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
    // List topics
    // ------------------------------------------------------------------

    public List<Map<String, Object>> getTopics() {
        User user = getCurrentUser();

        List<StudyContent> topics          = topicRepository.findByType("LISTENING");
        List<UserProgress> questionProgress= progressRepository.findByUserIdAndResourceType(user.getId(), "LISTENING_QUESTION");
        List<Question>     allQuestions    = questionRepository.findAll();

        Map<Long, Long> questionToTopicMap = new HashMap<>();
        for (Question q : allQuestions) {
            if ("LISTENING".equals(q.getSourceType())) {
                questionToTopicMap.put(q.getId(), q.getParentId());
            }
        }

        Map<Long, Integer> completedQuestionsCountMap = new HashMap<>();
        for (UserProgress p : questionProgress) {
            if (p.isCompleted()) {
                Long topicId = questionToTopicMap.get(p.getResourceId());
                if (topicId != null) {
                    completedQuestionsCountMap.put(topicId, completedQuestionsCountMap.getOrDefault(topicId, 0) + 1);
                }
            }
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (StudyContent topic : topics) {
            long sectionsCount = allQuestions.stream()
                    .filter(q -> "LISTENING".equals(q.getSourceType()) && q.getParentId().equals(topic.getId()))
                    .map(Question::getDifficulty)
                    .distinct().count();

            long questionsCount = allQuestions.stream()
                    .filter(q -> "LISTENING".equals(q.getSourceType()) && q.getParentId().equals(topic.getId()))
                    .count();

            Map<String, Object> item = new HashMap<>();
            item.put("id",             topic.getId());
            item.put("title",          topic.getTitle());
            item.put("category",       topic.getCategory());
            item.put("description",    topic.getDescription());
            item.put("sectionsCount",  (int) sectionsCount);
            item.put("questionsCount", (int) questionsCount);
            item.put("completedCount", completedQuestionsCountMap.getOrDefault(topic.getId(), 0));
            response.add(item);
        }
        response.sort(Comparator.comparing(item -> (Long) item.get("id")));
        return response;
    }

    // ------------------------------------------------------------------
    // Get topic sections
    // ------------------------------------------------------------------

    public List<Map<String, Object>> getTopicSections(Long topicId) {
        User user = getCurrentUser();

        topicRepository.findById(topicId)
                .filter(t -> "LISTENING".equals(t.getType()))
                .orElseThrow(() -> new ResourceNotFoundException("Listening topic", topicId));

        List<Question>     questions        = questionRepository.findBySourceTypeAndParentId("LISTENING", topicId);
        List<UserProgress> qProgressList    = progressRepository.findByUserIdAndResourceType(user.getId(), "LISTENING_QUESTION");
        List<UserProgress> sectionProgress  = progressRepository.findByUserIdAndResourceType(user.getId(), "LISTENING_SECTION");

        Map<Long, Boolean> completedSectionsMap  = new HashMap<>();
        Map<Long, Boolean> completedQuestionsMap = new HashMap<>();
        for (UserProgress sp : sectionProgress)  completedSectionsMap.put(sp.getResourceId(),  sp.isCompleted());
        for (UserProgress qp : qProgressList)    completedQuestionsMap.put(qp.getResourceId(), qp.isCompleted());

        Map<String, List<Question>> grouped = new TreeMap<>();
        for (Question q : questions) {
            grouped.computeIfAbsent(q.getDifficulty(), k -> new ArrayList<>()).add(q);
        }

        List<Map<String, Object>> responseSections = new ArrayList<>();
        int sectionIndex = 1;
        for (Map.Entry<String, List<Question>> entry : grouped.entrySet()) {
            List<Question> secQuestions   = entry.getValue();
            long virtualSectionId         = (topicId * 100) + sectionIndex;

            List<Map<String, Object>> qMaps = new ArrayList<>();
            for (Question q : secQuestions) {
                Map<String, Object> qMap = new HashMap<>();
                qMap.put("id",             q.getId());
                qMap.put("questionNumber", q.getQuestionNumber());
                qMap.put("text",           q.getQuestionText());
                qMap.put("translation",    q.getExplanation());
                qMap.put("audioUrl",       q.getAudioUrl());
                qMap.put("isCompleted",    completedQuestionsMap.getOrDefault(q.getId(), false));
                qMaps.add(qMap);
            }
            qMaps.sort(Comparator.comparing(q -> (Integer) q.get("questionNumber")));

            Map<String, Object> secMap = new HashMap<>();
            secMap.put("id",            virtualSectionId);
            secMap.put("title",         entry.getKey());
            secMap.put("orderIndex",    sectionIndex);
            secMap.put("questionsCount",secQuestions.size());
            secMap.put("isCompleted",   completedSectionsMap.getOrDefault(virtualSectionId, false));
            secMap.put("questions",     qMaps);
            responseSections.add(secMap);
            sectionIndex++;
        }
        return responseSections;
    }

    // ------------------------------------------------------------------
    // Complete question
    // ------------------------------------------------------------------

    public RewardResult completeQuestion(Long questionId) {
        User user = getCurrentUser();

        questionRepository.findById(questionId)
                .filter(q -> "LISTENING".equals(q.getSourceType()))
                .orElseThrow(() -> new ResourceNotFoundException("Listening question", questionId));

        UserProgress progress = progressRepository
                .findByUserIdAndResourceTypeAndResourceId(user.getId(), "LISTENING_QUESTION", questionId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user).resourceType("LISTENING_QUESTION").resourceId(questionId).completed(false).build());

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);
            return rewardService.addRewards(user, 10, 2);
        }
        return rewardService.noReward(user);
    }

    // ------------------------------------------------------------------
    // Complete section
    // ------------------------------------------------------------------

    public RewardResult completeSection(Long sectionId) {
        User user = getCurrentUser();

        long topicId = sectionId / 100;
        topicRepository.findById(topicId)
                .filter(t -> "LISTENING".equals(t.getType()))
                .orElseThrow(() -> new ResourceNotFoundException("Listening topic", topicId));

        UserProgress progress = progressRepository
                .findByUserIdAndResourceTypeAndResourceId(user.getId(), "LISTENING_SECTION", sectionId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user).resourceType("LISTENING_SECTION").resourceId(sectionId).completed(false).build());

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);
            return rewardService.addRewards(user, 50, 15);
        }
        return rewardService.noReward(user);
    }
}
