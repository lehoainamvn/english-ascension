package com.englishascension.backend.controller;

import com.englishascension.backend.model.*;
import com.englishascension.backend.repository.*;
import com.englishascension.backend.service.GroqService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/study")
public class StudyController {

    private static final Logger log = LoggerFactory.getLogger(StudyController.class);

    private final UserRepository userRepository;
    private final LearningModuleRepository learningModuleRepository;
    private final FlashcardRepository flashcardRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository progressRepository;
    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    public StudyController(
            UserRepository userRepository,
            LearningModuleRepository learningModuleRepository,
            FlashcardRepository flashcardRepository,
            QuestionRepository questionRepository,
            UserProgressRepository progressRepository,
            GroqService groqService) {
        this.userRepository = userRepository;
        this.learningModuleRepository = learningModuleRepository;
        this.flashcardRepository = flashcardRepository;
        this.questionRepository = questionRepository;
        this.progressRepository = progressRepository;
        this.groqService = groqService;
        this.objectMapper = new ObjectMapper();
    }

    @GetMapping("/modules/{moduleId}/content")
    public ResponseEntity<?> getModuleContent(@PathVariable Long moduleId) {
        LearningModule module = learningModuleRepository.findById(moduleId).orElse(null);
        if (module == null) {
            return ResponseEntity.notFound().build();
        }

        // Fetch from DB if already exists
        List<Flashcard> flashcards = flashcardRepository.findByModuleId(moduleId);
        List<Question> quizQuestions = questionRepository.findBySourceTypeAndParentId("ROADMAP_QUIZ", moduleId);

        if (!flashcards.isEmpty() && !quizQuestions.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("moduleTitle", module.getTitle());
            response.put("moduleDescription", module.getDescription());
            response.put("flashcards", flashcards);
            response.put("quizQuestions", quizQuestions);
            return ResponseEntity.ok(response);
        }

        // Generate deterministically locally based on module order index
        List<Flashcard> savedFlashcards = new ArrayList<>();
        List<Question> savedQuizzes = new ArrayList<>();

        if (module.getOrderIndex() == 1) {
            // Module 1 items
            String[][] fcData = {
                {"Achievement", "noun", "/əˈtʃiːvmənt/", "thành tựu, thành tích", "Passing the exam was a great achievement.", "Vượt qua kỳ thi là một thành tựu tuyệt vời."},
                {"Consolidate", "verb", "/kənˈsɒlɪdeɪt/", "củng cố, hợp nhất", "We need to consolidate our basic grammar.", "Chúng ta cần củng cố ngữ pháp cơ bản của mình."},
                {"Preposition", "noun", "/ˌprepəˈzɪʃn/", "giới từ", "In, on, and at are common prepositions.", "In, on, và at là những giới từ phổ biến."},
                {"Vocabulary", "noun", "/vəˈkæbjələri/", "từ vựng", "Reading books helps expand your vocabulary.", "Đọc sách giúp mở rộng vốn từ vựng của bạn."},
                {"Fundamental", "adjective", "/ˌfʌndəˈmentl/", "cơ bản, chủ chốt", "Grammar is a fundamental part of learning English.", "Ngữ pháp là một phần cơ bản của việc học tiếng Anh."}
            };
            for (String[] row : fcData) {
                Flashcard fc = Flashcard.builder()
                        .module(module)
                        .word(row[0])
                        .partOfSpeech(row[1])
                        .phonetic(row[2])
                        .definition(row[3])
                        .exampleSentence(row[4])
                        .exampleTranslation(row[5])
                        .build();
                savedFlashcards.add(flashcardRepository.save(fc));
            }

            String[][] qData = {
                {"Which of the following is a synonym of \"Achievement\"?", "MULTIPLE_CHOICE", "Failure", "Success", "Attempt", "Action", "B", "Success (thành công) đồng nghĩa với Achievement (thành tựu)."},
                {"What is the phonetic transcription of the word \"fundamental\"?", "MULTIPLE_CHOICE", "/fʌndəˈmentl/", "/fʌndəˈment/", "/fʌnˈdæmentl/", "/fʊndəˈmentl/", "A", "/fʌndəˈmentl/ là phát âm chuẩn của từ fundamental (cơ bản)."},
                {"Complete the sentence: \"We must study hard to ______ our English vocabulary.\"", "FILL_IN_BLANK", "consolidate", "lazy", "make", "test", "A", "Consolidate (củng cố) điền vào chỗ trống hợp nghĩa nhất."},
                {"What type of word is \"Vocabulary\"?", "MULTIPLE_CHOICE", "Verb", "Adjective", "Noun", "Adverb", "C", "Vocabulary là danh từ (Noun) chỉ từ vựng."},
                {"Match the vocabulary words with their correct Vietnamese definitions:", "WORD_MATCHING", "Achievement|Consolidate|Preposition|Vocabulary|Fundamental", "thành tựu|củng cố|giới từ|từ vựng|cơ bản", "", "", "Achievement:thành tựu|Consolidate:củng cố|Preposition:giới từ|Vocabulary:từ vựng|Fundamental:cơ bản", "Ghép các từ vựng với nghĩa tiếng Việt tương ứng."}
            };
            int qNum = 1;
            for (String[] row : qData) {
                Question qq = Question.builder()
                        .sourceType("ROADMAP_QUIZ")
                        .parentId(module.getId())
                        .questionNumber(qNum++)
                        .type(row[1])
                        .questionText(row[0])
                        .optionA(row[2])
                        .optionB(row[3])
                        .optionC(row[4])
                        .optionD(row[5])
                        .correctOption(row[6])
                        .correctAnswer(row[6])
                        .explanation(row[7])
                        .build();
                savedQuizzes.add(questionRepository.save(qq));
            }
        } else if (module.getOrderIndex() == 2) {
            // Module 2 items
            String[][] fcData = {
                {"Collaborate", "verb", "/kəˈlæbəreɪt/", "hợp tác, cộng tác", "We should collaborate on this project.", "Chúng ta nên hợp tác trong dự án này."},
                {"Negotiation", "noun", "/nɪˌɡəʊʃiˈeɪʃn/", "sự thương lượng, đàm phán", "The contract is under negotiation.", "Hợp đồng đang được đàm phán."},
                {"Colleague", "noun", "/ˈkɒliːɡ/", "đồng nghiệp", "My colleague helped me write the report.", "Đồng nghiệp của tôi đã giúp tôi viết báo cáo."},
                {"Presentation", "noun", "/ˌpreznˈteɪʃn/", "bài thuyết trình", "He gave an excellent presentation.", "Anh ấy đã có một bài thuyết trình tuyệt vời."},
                {"Schedule", "noun", "/ˈʃedjuːl/", "lịch trình, thời khóa biểu", "I have a busy schedule today.", "Tôi có một lịch trình bận rộn hôm nay."}
            };
            for (String[] row : fcData) {
                Flashcard fc = Flashcard.builder()
                        .module(module)
                        .word(row[0])
                        .partOfSpeech(row[1])
                        .phonetic(row[2])
                        .definition(row[3])
                        .exampleSentence(row[4])
                        .exampleTranslation(row[5])
                        .build();
                savedFlashcards.add(flashcardRepository.save(fc));
            }

            String[][] qData = {
                {"What does \"collaborate\" mean?", "MULTIPLE_CHOICE", "To work alone", "To work together", "To study grammar", "To give a speech", "B", "Collaborate nghĩa là cộng tác, làm việc chung (work together)."},
                {"Which word refers to a person you work with?", "MULTIPLE_CHOICE", "Friend", "Colleague", "Boss", "Client", "B", "Colleague nghĩa là đồng nghiệp (người làm việc cùng)."},
                {"Complete the sentence: \"The negotiation ended ______ a successful agreement.\"", "FILL_IN_BLANK", "in", "with", "by", "on", "B", "Cụm từ \"end with\" nghĩa là kết thúc bằng điều gì đó."},
                {"Choose the correct spelling:", "MULTIPLE_CHOICE", "Presentation", "Presentasion", "Prezentation", "Presentatione", "A", "Presentation (bài thuyết trình) viết đúng chính tả nhất."},
                {"Match the business English words with their correct Vietnamese definitions:", "WORD_MATCHING", "Collaborate|Negotiation|Colleague|Presentation|Schedule", "hợp tác|đàm phán|đồng nghiệp|thuyết trình|lịch trình", "", "", "Collaborate:hợp tác|Negotiation:đàm phán|Colleague:đồng nghiệp|Presentation:thuyết trình|Schedule:lịch trình", "Ghép các từ tiếng Anh công sở với nghĩa tiếng Việt tương ứng."}
            };
            int qNum = 1;
            for (String[] row : qData) {
                Question qq = Question.builder()
                        .sourceType("ROADMAP_QUIZ")
                        .parentId(module.getId())
                        .questionNumber(qNum++)
                        .type(row[1])
                        .questionText(row[0])
                        .optionA(row[2])
                        .optionB(row[3])
                        .optionC(row[4])
                        .optionD(row[5])
                        .correctOption(row[6])
                        .correctAnswer(row[6])
                        .explanation(row[7])
                        .build();
                savedQuizzes.add(questionRepository.save(qq));
            }
        } else {
            // Module 3 or default items
            String[][] fcData = {
                {"Comprehension", "noun", "/ˌkɒmprɪˈhenʃn/", "sự hiểu, sự lĩnh hội", "Listening comprehension takes practice.", "Nghe hiểu cần phải luyện tập."},
                {"Academic", "adjective", "/ˌækəˈdemɪk/", "thuộc học thuật, viện hàn lâm", "He reads academic articles daily.", "Anh ấy đọc các bài viết học thuật hàng ngày."},
                {"Analysis", "noun", "/əˈnæləsɪs/", "sự phân tích", "The data analysis was very helpful.", "Việc phân tích dữ liệu rất hữu ích."},
                {"Perspective", "noun", "/pəˈspektɪv/", "góc nhìn, quan điểm", "Try to see it from my perspective.", "Hãy thử nhìn nhận nó từ góc độ của tôi."},
                {"Terminology", "noun", "/ˌtɜːmɪˈnɒlədʒi/", "thuật ngữ", "Medical terminology is hard to learn.", "Thuật ngữ y khoa rất khó học."}
            };
            for (String[] row : fcData) {
                Flashcard fc = Flashcard.builder()
                        .module(module)
                        .word(row[0])
                        .partOfSpeech(row[1])
                        .phonetic(row[2])
                        .definition(row[3])
                        .exampleSentence(row[4])
                        .exampleTranslation(row[5])
                        .build();
                savedFlashcards.add(flashcardRepository.save(fc));
            }

            String[][] qData = {
                {"What is the plural form of \"analysis\"?", "MULTIPLE_CHOICE", "analyses", "analysises", "analysiss", "analyzation", "A", "Analyses là dạng số nhiều đặc biệt của danh từ analysis."},
                {"Academic reading requires understanding specialized ______.", "FILL_IN_BLANK", "terminology", "letters", "grammar", "sounds", "A", "Terminology (thuật ngữ chuyên ngành) điền vào chỗ trống hợp nghĩa nhất."},
                {"Complete the sentence: \"His perspective ______ the problem is unique.\"", "FILL_IN_BLANK", "on", "in", "at", "for", "A", "Chúng ta dùng cụm từ \"perspective on something\" (quan điểm về điều gì)."},
                {"What does \"comprehension\" mean?", "MULTIPLE_CHOICE", "The action of writing", "The ability to understand", "The speed of reading", "The act of speaking", "B", "Comprehension nghĩa là khả năng hiểu, sự lĩnh hội (ability to understand)."},
                {"Match the academic vocabulary words with their correct Vietnamese definitions:", "WORD_MATCHING", "Comprehension|Academic|Analysis|Perspective|Terminology", "sự hiểu|học thuật|phân tích|quan điểm|thuật ngữ", "", "", "Comprehension:sự hiểu|Academic:học thuật|Analysis:phân tích|Perspective:quan điểm|Terminology:thuật ngữ", "Ghép các từ tiếng Anh học thuật với nghĩa tiếng Việt tương ứng."}
            };
            int qNum = 1;
            for (String[] row : qData) {
                Question qq = Question.builder()
                        .sourceType("ROADMAP_QUIZ")
                        .parentId(module.getId())
                        .questionNumber(qNum++)
                        .type(row[1])
                        .questionText(row[0])
                        .optionA(row[2])
                        .optionB(row[3])
                        .optionC(row[4])
                        .optionD(row[5])
                        .correctOption(row[6])
                        .correctAnswer(row[6])
                        .explanation(row[7])
                        .build();
                savedQuizzes.add(questionRepository.save(qq));
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("moduleTitle", module.getTitle());
        response.put("moduleDescription", module.getDescription());
        response.put("flashcards", savedFlashcards);
        response.put("quizQuestions", savedQuizzes);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/modules/{moduleId}/complete-step")
    public ResponseEntity<?> completeStep(@PathVariable Long moduleId, @RequestBody Map<String, String> request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Mỗi bước học nhỏ lẻ (Ngữ pháp, Từ vựng, Nghe, Phát âm) đều được +30 EXP và +10 Xu
        int xpGained = 30;
        int coinsGained = 10;

        // Process level up logic
        int currentExp = user.getExp();
        int currentLevel = user.getLevel();
        int currentCoins = user.getCoins();

        currentExp += xpGained;
        currentCoins += coinsGained;

        boolean leveledUp = false;
        int previousLevel = user.getLevel();

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

        String newTitle = user.getCharacterTitle() != null ? user.getCharacterTitle() : "Novice";
        if (leveledUp) {
            newTitle = calculateTitle(currentLevel);
            user.setCharacterTitle(newTitle);
        }

        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("xpGained", xpGained);
        result.put("coinsGained", coinsGained);
        result.put("newXp", currentExp);
        result.put("newLevel", currentLevel);
        result.put("newCoins", currentCoins);
        result.put("leveledUp", leveledUp);
        result.put("previousLevel", previousLevel);
        result.put("newTitle", newTitle);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/modules/{moduleId}/complete")
    public ResponseEntity<?> completeModule(@PathVariable Long moduleId, @RequestBody Map<String, Object> requestBody) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        LearningModule module = learningModuleRepository.findById(moduleId).orElse(null);
        if (module == null) {
            return ResponseEntity.notFound().build();
        }

        // Extract score from body if available
        Integer correctAnswers = (Integer) requestBody.get("correctAnswers");
        if (correctAnswers == null) {
            correctAnswers = 5; // default
        }

        // Enforce passing score of >= 70% (>= 7.0 points)
        List<Question> quizQuestions = questionRepository.findBySourceTypeAndParentId("ROADMAP_QUIZ", moduleId);
        int totalQuestions = quizQuestions.isEmpty() ? 5 : quizQuestions.size();
        double pct = (double) correctAnswers / totalQuestions;
        if (pct < 0.70) {
            return ResponseEntity.badRequest().body(Map.of("message", "Chưa đạt yêu cầu! Bạn cần đạt tối thiểu 7 điểm (trả lời đúng 70% số câu hỏi) để qua màn."));
        }

        // Calculate XP and Coin gains (chỉ thưởng điểm test, vì lý thuyết/từ vựng đã thưởng riêng qua complete-step)
        int quizXp = correctAnswers * 10;
        int quizCoins = correctAnswers * 2;

        int totalXpGained = quizXp;
        int totalCoinsGained = quizCoins;

        // Process level up logic
        int currentExp = user.getExp();
        int currentLevel = user.getLevel();
        int currentCoins = user.getCoins();

        currentExp += totalXpGained;
        currentCoins += totalCoinsGained;

        boolean leveledUp = false;
        int previousLevel = user.getLevel();
        
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

        String newTitle = user.getCharacterTitle() != null ? user.getCharacterTitle() : "Novice";
        if (leveledUp) {
            newTitle = calculateTitle(currentLevel);
            user.setCharacterTitle(newTitle);
        }

        userRepository.save(user);

        // Update learning modules progression status
        module.setStatus("COMPLETED");
        learningModuleRepository.save(module);

        // Unlock next module in chronological order
        LearningRoadmap roadmap = module.getRoadmap();
        List<LearningModule> roadmapModules = roadmap.getModules();
        LearningModule nextModule = null;
        for (LearningModule m : roadmapModules) {
            if (m.getOrderIndex() == module.getOrderIndex() + 1) {
                nextModule = m;
                break;
            }
        }
        if (nextModule != null && "LOCKED".equals(nextModule.getStatus())) {
            nextModule.setStatus("IN_PROGRESS");
            learningModuleRepository.save(nextModule);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("xpGained", totalXpGained);
        result.put("coinsGained", totalCoinsGained);
        result.put("newXp", currentExp);
        result.put("newLevel", currentLevel);
        result.put("newCoins", currentCoins);
        result.put("leveledUp", leveledUp);
        result.put("previousLevel", previousLevel);
        result.put("newTitle", newTitle);
        result.put("nextModuleId", nextModule != null ? nextModule.getId() : null);

        return ResponseEntity.ok(result);
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

    @PostMapping("/modules/{moduleId}/battle-complete")
    public ResponseEntity<?> completeWordBattle(@PathVariable Long moduleId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        LearningModule module = learningModuleRepository.findById(moduleId).orElse(null);
        if (module == null) {
            return ResponseEntity.notFound().build();
        }

        // Word Battle rewards
        int totalXpGained = 50;
        int totalCoinsGained = 15;

        // Process level up logic
        int currentExp = user.getExp();
        int currentLevel = user.getLevel();
        int currentCoins = user.getCoins();

        currentExp += totalXpGained;
        currentCoins += totalCoinsGained;

        boolean leveledUp = false;
        int previousLevel = user.getLevel();
        
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

        String newTitle = user.getCharacterTitle() != null ? user.getCharacterTitle() : "Novice";
        if (leveledUp) {
            newTitle = calculateTitle(currentLevel);
            user.setCharacterTitle(newTitle);
        }

        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("xpGained", totalXpGained);
        result.put("coinsGained", totalCoinsGained);
        result.put("newXp", currentExp);
        result.put("newLevel", currentLevel);
        result.put("newCoins", currentCoins);
        result.put("leveledUp", leveledUp);
        result.put("previousLevel", previousLevel);
        result.put("newTitle", newTitle);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Map<String, Object> profile = new HashMap<>();
        profile.put("email", user.getEmail());
        profile.put("streak", user.getStreak());
        profile.put("coins", user.getCoins());
        profile.put("exp", user.getExp());
        profile.put("level", user.getLevel());
        
        return ResponseEntity.ok(profile);
    }
}
