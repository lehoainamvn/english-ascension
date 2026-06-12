package com.englishascension.backend.controller;

import com.englishascension.backend.model.*;
import com.englishascension.backend.repository.*;
import lombok.Getter;
import lombok.Setter;
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
@RequestMapping("/api/vocabulary")
public class VocabularyStudyController {

    private static final Logger log = LoggerFactory.getLogger(VocabularyStudyController.class);

    private final UserRepository userRepository;
    private final LearningModuleRepository topicRepository;
    private final FlashcardRepository wordRepository;
    private final UserProgressRepository progressRepository;

    public VocabularyStudyController(
            UserRepository userRepository,
            LearningModuleRepository topicRepository,
            FlashcardRepository wordRepository,
            UserProgressRepository progressRepository) {
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
        this.wordRepository = wordRepository;
        this.progressRepository = progressRepository;
    }

    @Getter
    @Setter
    public static class MarkLearnedRequest {
        // Empty class for safety
    }

    @GetMapping("/topics")
    public ResponseEntity<?> getTopics() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (topicRepository.findByCategoryIsNotNull().isEmpty()) {
            seedVocabularyData();
        }

        List<LearningModule> topics = topicRepository.findByCategoryIsNotNull();
        List<UserProgress> topicProgressList = progressRepository.findByUserIdAndResourceType(user.getId(), "MODULE");
        List<UserProgress> wordProgressList = progressRepository.findByUserIdAndResourceType(user.getId(), "FLASHCARD");

        // Map topic progress
        Map<Long, Boolean> completedTopicsMap = new HashMap<>();
        for (UserProgress p : topicProgressList) {
            completedTopicsMap.put(p.getResourceId(), p.isCompleted());
        }

        // Map word progress per topic
        List<Flashcard> allWords = wordRepository.findAll();
        Map<Long, Long> wordToTopicMap = new HashMap<>();
        for (Flashcard w : allWords) {
            if (w.getModule() != null) {
                wordToTopicMap.put(w.getId(), w.getModule().getId());
            }
        }

        Map<Long, Integer> learnedWordsCountMap = new HashMap<>();
        for (UserProgress wp : wordProgressList) {
            if (wp.isCompleted()) {
                Long topicId = wordToTopicMap.get(wp.getResourceId());
                if (topicId != null) {
                    learnedWordsCountMap.put(topicId, learnedWordsCountMap.getOrDefault(topicId, 0) + 1);
                }
            }
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (LearningModule topic : topics) {
            int wordsCount = (int) allWords.stream().filter(w -> w.getModule() != null && w.getModule().getId().equals(topic.getId())).count();
            
            Map<String, Object> item = new HashMap<>();
            item.put("id", topic.getId());
            item.put("title", topic.getTitle());
            item.put("category", topic.getCategory());
            item.put("wordsCount", wordsCount);
            
            int learnedCount = learnedWordsCountMap.getOrDefault(topic.getId(), 0);
            item.put("learnedCount", learnedCount);
            
            boolean isCompleted = completedTopicsMap.getOrDefault(topic.getId(), false);
            item.put("isCompleted", isCompleted || (wordsCount > 0 && learnedCount >= wordsCount));
            
            response.add(item);
        }

        // Stability sort
        response.sort(Comparator.comparing(item -> (Long) item.get("id")));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/topics/{topicId}/words")
    public ResponseEntity<?> getTopicWords(@PathVariable Long topicId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        LearningModule topic = topicRepository.findById(topicId).orElse(null);
        if (topic == null) {
            return ResponseEntity.notFound().build();
        }

        List<Flashcard> words = wordRepository.findByModuleId(topicId);
        List<UserProgress> userProgress = progressRepository.findByUserIdAndResourceType(user.getId(), "FLASHCARD");

        Map<Long, Boolean> learnedMap = new HashMap<>();
        for (UserProgress p : userProgress) {
            if (p.isCompleted()) {
                learnedMap.put(p.getResourceId(), true);
            }
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (Flashcard w : words) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", w.getId());
            item.put("word", w.getWord());
            item.put("partOfSpeech", w.getPartOfSpeech());
            item.put("phonetic", w.getPhonetic());
            item.put("definition", w.getDefinition());
            item.put("exampleSentence", w.getExampleSentence());
            item.put("exampleTranslation", w.getExampleTranslation());
            item.put("isLearned", learnedMap.getOrDefault(w.getId(), false));
            response.add(item);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/words/{wordId}/mark-learned")
    public ResponseEntity<?> markWordLearned(@PathVariable Long wordId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Flashcard word = wordRepository.findById(wordId).orElse(null);
        if (word == null) {
            return ResponseEntity.notFound().build();
        }

        UserProgress progress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "FLASHCARD", wordId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user)
                        .resourceType("FLASHCARD")
                        .resourceId(wordId)
                        .completed(false)
                        .build());

        int xpGained = 0;
        int coinsGained = 0;

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);

            // Reward per word learned: +10 EXP, +2 Coins
            xpGained = 10;
            coinsGained = 2;
            addRewardsToUser(user, xpGained, coinsGained);
        }

        Map<String, Object> result = getRewardResponseMap(user, xpGained, coinsGained);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/topics/{topicId}/complete")
    public ResponseEntity<?> completeTopic(@PathVariable Long topicId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        LearningModule topic = topicRepository.findById(topicId).orElse(null);
        if (topic == null) {
            return ResponseEntity.notFound().build();
        }

        UserProgress progress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "MODULE", topicId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user)
                        .resourceType("MODULE")
                        .resourceId(topicId)
                        .completed(false)
                        .build());

        int xpGained = 0;
        int coinsGained = 0;

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);

            // Topic completion: +50 EXP, +15 Coins
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

    private void seedVocabularyData() {
        log.info("Seeding Vocabulary Topics and Words...");

        // 600 TỪ VỰNG TOEIC
        LearningModule t1 = LearningModule.builder().title("Contracts").category("600 TỪ VỰNG TOEIC").orderIndex(1).status("IN_PROGRESS").build();
        LearningModule t2 = LearningModule.builder().title("Marketing").category("600 TỪ VỰNG TOEIC").orderIndex(2).status("IN_PROGRESS").build();
        LearningModule t3 = LearningModule.builder().title("Warranties").category("600 TỪ VỰNG TOEIC").orderIndex(3).status("IN_PROGRESS").build();
        
        // ETS 2023
        LearningModule t4 = LearningModule.builder().title("Business Planning").category("ETS 2023").orderIndex(4).status("IN_PROGRESS").build();
        
        // ETS 2024
        LearningModule t5 = LearningModule.builder().title("Conferences").category("ETS 2024").orderIndex(5).status("IN_PROGRESS").build();

        // ETS 2026
        LearningModule t6 = LearningModule.builder().title("Computers").category("ETS 2026").orderIndex(6).status("IN_PROGRESS").build();

        // TOEIC MASTER
        LearningModule t7 = LearningModule.builder().title("Office Procedures").category("TOEIC MASTER").orderIndex(7).status("IN_PROGRESS").build();

        // TỪ VỰNG CEFR
        LearningModule t8 = LearningModule.builder().title("Family & Home (A1)").category("TỪ VỰNG CEFR").orderIndex(8).status("IN_PROGRESS").build();
        LearningModule t9 = LearningModule.builder().title("Travel & Transport (A2)").category("TỪ VỰNG CEFR").orderIndex(9).status("IN_PROGRESS").build();
        LearningModule t10 = LearningModule.builder().title("Hobbies & Leisure (B1)").category("TỪ VỰNG CEFR").orderIndex(10).status("IN_PROGRESS").build();
        LearningModule t11 = LearningModule.builder().title("Environment & Science (B2)").category("TỪ VỰNG CEFR").orderIndex(11).status("IN_PROGRESS").build();

        t1 = topicRepository.save(t1);
        t2 = topicRepository.save(t2);
        t3 = topicRepository.save(t3);
        t4 = topicRepository.save(t4);
        t5 = topicRepository.save(t5);
        t6 = topicRepository.save(t6);
        t7 = topicRepository.save(t7);
        t8 = topicRepository.save(t8);
        t9 = topicRepository.save(t9);
        t10 = topicRepository.save(t10);
        t11 = topicRepository.save(t11);

        // Seed words for Contracts
        String[][] wContracts = {
            {"attract", "verb", "/əˈtrækt/", "thu hút, lôi cuốn, hấp dẫn", "The colorful ad aims to attract more customers.", "Quảng cáo đầy màu sắc nhằm mục đích thu hút thêm khách hàng."},
            {"compare", "verb", "/kəmˈpeə(r)/", "so sánh, đối chiếu", "We should compare prices before signing the contract.", "Chúng ta nên so sánh giá cả trước khi ký hợp đồng."},
            {"compete", "verb", "/kəmˈpiːt/", "cạnh tranh, tranh đua", "Local businesses struggle to compete with global chains.", "Các doanh nghiệp địa phương đấu tranh để cạnh tranh với các chuỗi toàn cầu."},
            {"consume", "verb", "/kənˈsjuːm/", "tiêu thụ, tiêu dùng", "This machine does not consume a lot of electricity.", "Chiếc máy này không tiêu thụ nhiều điện năng."},
            {"convince", "verb", "/kənˈvɪns/", "thuyết phục", "She managed to convince the client to sign the deal.", "Cô ấy đã thuyết phục được khách hàng ký hợp đồng."},
            {"current", "adjective", "/ˈkʌrənt/", "hiện tại, hiện hành", "Our current agreement expires next month.", "Thỏa thuận hiện tại của chúng tôi sẽ hết hạn vào tháng tới."},
            {"establish", "verb", "/ɪˈstæblɪʃ/", "thành lập, thiết lập", "The contract will establish a new joint venture.", "Hợp đồng sẽ thiết lập một liên doanh mới."},
            {"fad", "noun", "/fæd/", "mốt nhất thời, xu hướng ngắn hạn", "Some people think cryptocurrency is just a passing fad.", "Một số người nghĩ tiền điện tử chỉ là một mốt nhất thời."},
            {"inspire", "verb", "/ɪnˈspaɪə(r)/", "truyền cảm hứng", "The leadership style of our boss inspires everyone.", "Phong cách lãnh đạo của sếp truyền cảm hứng cho mọi người."},
            {"market", "verb", "/ˈmɑːkɪt/", "quảng cáo, tiếp thị", "We need to market this product online effectively.", "Chúng ta cần tiếp thị sản phẩm này trực tuyến một cách hiệu quả."},
            {"productive", "adjective", "/prəˈdʌktɪv/", "năng suất, hiệu quả", "Regular breaks keep employees happy and productive.", "Nghỉ ngơi đều đặn giúp nhân viên hạnh phúc và làm việc năng suất."},
            {"satisfy", "verb", "/ˈsætɪsfaɪ/", "làm hài lòng, thỏa mãn", "The legal terms did not satisfy the legal department.", "Các điều khoản pháp lý đã không làm hài lòng phòng pháp chế."}
        };
        saveWordsForTopic(t1, wContracts);

        // Seed words for Marketing
        String[][] wMarketing = {
            {"resolve", "verb", "/rɪˈzɒlv/", "giải quyết", "We need to resolve this design feedback immediately.", "Chúng ta cần giải quyết phản hồi thiết kế này ngay lập tức."},
            {"specific", "adjective", "/spəˈsɪfɪk/", "cụ thể, đặc trưng", "The contract contains specific clauses about payment terms.", "Hợp đồng chứa các điều khoản cụ thể về điều khoản thanh toán."},
            {"attract", "verb", "/əˈtrækt/", "thu hút", "Good marketing strategies attract more target audience.", "Chiến lược tiếp thị tốt sẽ thu hút nhiều đối tượng mục tiêu hơn."},
            {"demand", "noun", "/dɪˈmɑːnd/", "nhu cầu, yêu cầu", "There is a high demand for personalized AI tutors.", "Có nhu cầu cao đối với gia sư AI cá nhân hóa."},
            {"focus", "verb", "/ˈfəʊkəs/", "tập trung", "Our marketing team should focus on digital channels.", "Đội tiếp thị của chúng tôi nên tập trung vào các kênh kỹ thuật số."},
            {"gather", "verb", "/ˈɡæðə(r)/", "thu thập, tập hợp", "We must gather data from customer surveys.", "Chúng ta phải thu thập dữ liệu từ các khảo sát khách hàng."},
            {"offer", "noun", "/ˈɒfə(r)/", "cung cấp, đề nghị", "This special offer is available only this week.", "Ưu đãi đặc biệt này chỉ áp dụng trong tuần này."},
            {"product", "noun", "/ˈprɒdʌkt/", "sản phẩm", "This is the most innovative product of the year.", "Đây là sản phẩm sáng tạo nhất trong năm."},
            {"promote", "verb", "/prəˈməʊt/", "quảng bá, thăng tiến", "Social media is a great tool to promote new services.", "Mạng xã hội là một công cụ tuyệt vời để quảng bá dịch vụ mới."},
            {"strategy", "noun", "/ˈstrætədʒi/", "chiến lược", "Our brand strategy is focused on long-term growth.", "Chiến lược thương hiệu của chúng tôi tập trung vào tăng trưởng dài hạn."},
            {"survey", "noun", "/ˈsɜːveɪ/", "khảo sát", "We are conducting a customer satisfaction survey.", "Chúng tôi đang tiến hành khảo sát sự hài lòng của khách hàng."},
            {"target", "noun", "/ˈtɑːɡɪt/", "mục tiêu", "Our target market consists of college students.", "Thị trường mục tiêu của chúng tôi bao gồm sinh viên đại học."}
        };
        saveWordsForTopic(t2, wMarketing);

        // Seed words for Warranties
        String[][] wWarranties = {
            {"guarantee", "verb", "/ˌɡærənˈtiː/", "bảo hành, bảo đảm", "The store guarantees that the device is original.", "Cửa hàng bảo đảm rằng thiết bị là hàng chính hãng."},
            {"promise", "verb", "/ˈprɒmɪs/", "hứa, cam kết", "We promise to deliver high-quality code templates.", "Chúng tôi cam kết cung cấp các mẫu mã nguồn chất lượng cao."},
            {"protect", "verb", "/prəˈtekt/", "bảo vệ", "This lock will protect your user account.", "Khóa này sẽ bảo vệ tài khoản người dùng của bạn."},
            {"refund", "noun", "/ˈriːfʌnd/", "hoàn tiền", "You can ask for a full refund within 30 days.", "Bạn có thể yêu cầu hoàn tiền đầy đủ trong vòng 30 ngày."},
            {"replace", "verb", "/rɪˈpleɪs/", "thay thế", "We will replace the item if it has defects.", "Chúng tôi sẽ thay thế sản phẩm nếu có lỗi kỹ thuật."},
            {"service", "noun", "/ˈsɜːvɪs/", "dịch vụ, bảo trì", "The customer service is available 24/7.", "Dịch vụ khách hàng sẵn sàng phục vụ 24/7."},
            {"warranty", "noun", "/ˈwɒrənti/", "giấy bảo hành, sự bảo hành", "This laptop comes with a two-year warranty.", "Chiếc máy tính xách tay này đi kèm chế độ bảo hành 2 năm."},
            {"claim", "noun", "/kleɪm/", "yêu cầu đòi hỏi quyền lợi", "The customer filed a warranty claim yesterday.", "Khách hàng đã nộp yêu cầu bảo hành vào ngày hôm qua."},
            {"duration", "noun", "/djuˈreɪʃn/", "khoảng thời gian, thời lượng", "The duration of the warranty is twelve months.", "Thời hạn của bảo hành là mười hai tháng."},
            {"expire", "verb", "/ɪkˈspaɪə(r)/", "hết hạn", "The free trial will expire tomorrow.", "Thời gian dùng thử miễn phí sẽ hết hạn vào ngày mai."},
            {"policy", "noun", "/ˈpɒləsi/", "chính sách", "It is our policy to satisfy all customer complaints.", "Chính sách của chúng tôi là làm hài lòng mọi khiếu nại của khách hàng."},
            {"satisfy", "verb", "/ˈsætɪsfaɪ/", "thỏa mãn, làm vừa lòng", "We try hard to satisfy our buyers.", "Chúng tôi cố gắng hết sức để làm vừa lòng người mua."}
        };
        saveWordsForTopic(t3, wWarranties);

        // Dummy seed data for other topics so they are never empty
        saveWordsForTopic(t4, wContracts);
        saveWordsForTopic(t5, wMarketing);
        saveWordsForTopic(t6, wWarranties);
        saveWordsForTopic(t7, wContracts);
        saveWordsForTopic(t8, wContracts);
        saveWordsForTopic(t9, wMarketing);
        saveWordsForTopic(t10, wWarranties);
        saveWordsForTopic(t11, wContracts);
    }

    private void saveWordsForTopic(LearningModule topic, String[][] data) {
        List<Flashcard> words = new ArrayList<>();
        for (String[] row : data) {
            Flashcard w = Flashcard.builder()
                    .module(topic)
                    .word(row[0])
                    .partOfSpeech(row[1])
                    .phonetic(row[2])
                    .definition(row[3])
                    .exampleSentence(row[4])
                    .exampleTranslation(row[5])
                    .build();
            words.add(w);
        }
        wordRepository.saveAll(words);
    }
}
