package com.englishascension.backend.controller;

import com.englishascension.backend.model.*;
import com.englishascension.backend.repository.*;
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

        if (topicRepository.findByType("LISTENING").isEmpty()) {
            seedListeningData();
        }

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

    private void seedListeningData() {
        log.info("Seeding Listening Topics, Sections, and Questions...");

        // Seeding Topic 1
        StudyContent t1 = StudyContent.builder()
                .title("TEST 1 2026")
                .type("LISTENING")
                .category("TOEIC LISTENING")
                .description("25 bài • 100 câu")
                .questionsCount(20)
                .orderIndex(1)
                .build();
        t1 = topicRepository.save(t1);

        // Seeding Topic 2
        StudyContent t2 = StudyContent.builder()
                .title("TEST 2 2026")
                .type("LISTENING")
                .category("ETS 2024")
                .description("10 bài • 40 câu")
                .questionsCount(8)
                .orderIndex(2)
                .build();
        t2 = topicRepository.save(t2);

        // Seeding Questions for TEST 1 2026 - Sec 1
        String[][] t1s1q = {
            {"Where is the conference being held?", "Hội nghị được tổ chức ở đâu?"},
            {"It will take place in the grand ballroom on the second floor.", "Nó sẽ diễn ra tại phòng khiêu vũ lớn ở tầng hai."},
            {"Do you need a map to find the ballroom?", "Bạn có cần bản đồ để tìm phòng khiêu vũ không?"},
            {"No, thank you, I have already been there before.", "Không, cảm ơn, tôi đã từng đến đó trước đây rồi."}
        };
        saveQuestionsForSection(t1, "Bài 1", t1s1q);

        // Seeding Questions for TEST 1 2026 - Sec 2
        String[][] t1s2q = {
            {"How often do you update the training manuals?", "Bao lâu thì bạn cập nhật sách hướng dẫn đào tạo một lần?"},
            {"We usually review and update them every six months.", "Chúng tôi thường xem xét và cập nhật chúng sáu tháng một lần."},
            {"Who is responsible for the updates this time?", "Ai là người chịu trách nhiệm cập nhật lần này?"},
            {"Sarah from the human resources department is handling it.", "Sarah từ phòng nhân sự đang xử lý việc đó."}
        };
        saveQuestionsForSection(t1, "Bài 2", t1s2q);

        // Seeding Questions for TEST 1 2026 - Sec 3
        String[][] t1s3q = {
            {"Why was the morning flight to Chicago delayed?", "Tại sao chuyến bay sáng đến Chicago bị hoãn?"},
            {"It was delayed because of the heavy snow and poor visibility.", "Nó bị hoãn do tuyết rơi dày đặc và tầm nhìn kém."},
            {"Will the airline provide vouchers for food and drinks?", "Hãng hàng không có cung cấp phiếu ăn uống không?"},
            {"Yes, you can collect them at the customer service desk.", "Có, bạn có thể nhận chúng tại quầy dịch vụ khách hàng."}
        };
        saveQuestionsForSection(t1, "Bài 3", t1s3q);

        // Seeding Questions for TEST 1 2026 - Sec 4
        String[][] t1s4q = {
            {"Should we order lunch for the clients now?", "Chúng ta có nên đặt bữa trưa cho khách hàng bây giờ không?"},
            {"Yes, let's order sandwiches and fresh salads.", "Đồng ý, hãy đặt bánh mì sandwich và salad tươi."},
            {"Are there any vegetarian clients attending the meeting?", "Có khách hàng nào ăn chay tham dự cuộc họp không?"},
            {"Only one person requested a vegetarian option.", "Chỉ có một người yêu cầu tùy chọn món chay."}
        };
        saveQuestionsForSection(t1, "Bài 4", t1s4q);

        // Seeding Questions for TEST 1 2026 - Sec 5
        String[][] t1s5q = {
            {"When can I expect the delivery of the new office chairs?", "Khi nào tôi có thể nhận được hàng ghế văn phòng mới?"},
            {"They should arrive by Wednesday afternoon at the latest.", "Chúng sẽ đến muộn nhất là vào chiều thứ Tư."},
            {"Do you need someone to help assemble them?", "Bạn có cần ai giúp lắp ráp chúng không?"},
            {"Yes, that would be very helpful, thank you.", "Có, điều đó sẽ rất hữu ích, cảm ơn bạn."}
        };
        saveQuestionsForSection(t1, "Bài 5", t1s5q);

        // Seeding Questions for TEST 2 2026 - Sec 1
        String[][] t2s1q = {
            {"When will the new software system be deployed?", "Khi nào hệ thống phần mềm mới sẽ được triển khai?"},
            {"The IT department scheduled the deployment for Friday night.", "Phòng CNTT đã lên lịch triển khai vào đêm thứ Sáu."},
            {"Will there be any system downtime during the update?", "Hệ thống có bị gián đoạn hoạt động trong thời gian cập nhật không?"},
            {"Yes, the servers will be offline for about three hours.", "Có, các máy chủ sẽ ngoại tuyến trong khoảng ba giờ."}
        };
        saveQuestionsForSection(t2, "Bài 1", t2s1q);

        // Seeding Questions for TEST 2 2026 - Sec 2
        String[][] t2s2q = {
            {"Who designed the marketing brochure for the new project?", "Ai đã thiết kế cuốn tài liệu quảng cáo tiếp thị cho dự án mới?"},
            {"A local design agency created the layout for us.", "Một công ty thiết kế địa phương đã tạo bố cục cho chúng tôi."},
            {"Do you think we need to print more copies?", "Bạn có nghĩ chúng ta cần in thêm bản sao không?"},
            {"Let's print five hundred more copies just in case.", "Hãy in thêm năm trăm bản nữa để phòng hờ."}
        };
        saveQuestionsForSection(t2, "Bài 2", t2s2q);
    }

    private void saveQuestionsForSection(StudyContent topic, String sectionTitle, String[][] qData) {
        List<Question> list = new ArrayList<>();
        int index = 1;
        for (String[] row : qData) {
            Question q = Question.builder()
                    .sourceType("LISTENING")
                    .parentId(topic.getId())
                    .difficulty(sectionTitle)
                    .questionNumber(index++)
                    .questionText(row[0])
                    .explanation(row[1]) // store translation in explanation
                    .build();
            list.add(q);
        }
        questionRepository.saveAll(list);
    }
}
