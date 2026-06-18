package com.englishascension.backend.feature.placementtest;

import com.englishascension.backend.feature.placementtest.PlacementTestRequest;
import com.englishascension.backend.feature.roadmap.LearningModule;
import com.englishascension.backend.feature.roadmap.LearningRoadmap;
import com.englishascension.backend.feature.study.Question;
import com.englishascension.backend.feature.user.User;
import com.englishascension.backend.feature.roadmap.LearningRoadmapRepository;
import com.englishascension.backend.feature.study.QuestionRepository;
import com.englishascension.backend.feature.user.UserRepository;
import com.englishascension.backend.feature.ai.GroqService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/placement-test")
public class PlacementTestController {

    private static final Logger log = LoggerFactory.getLogger(PlacementTestController.class);

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final LearningRoadmapRepository roadmapRepository;
    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    public PlacementTestController(
            UserRepository userRepository,
            QuestionRepository questionRepository,
            LearningRoadmapRepository roadmapRepository,
            GroqService groqService) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.roadmapRepository = roadmapRepository;
        this.groqService = groqService;
        this.objectMapper = new ObjectMapper();
    }

    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getPlacementTestQuestions() {
        List<Question> allQuestions = questionRepository.findAllRandom();
        
        List<Question> vocab = allQuestions.stream().filter(q -> "VOCABULARY".equals(q.getType())).limit(3).toList();
        List<Question> grammar = allQuestions.stream().filter(q -> "GRAMMAR".equals(q.getType())).limit(3).toList();
        List<Question> listening = allQuestions.stream().filter(q -> "LISTENING".equals(q.getType())).limit(3).toList();
        List<Question> reading = allQuestions.stream().filter(q -> "READING".equals(q.getType())).limit(3).toList();
        
        List<Question> testQuestions = new ArrayList<>();
        testQuestions.addAll(vocab);
        testQuestions.addAll(grammar);
        testQuestions.addAll(listening);
        testQuestions.addAll(reading);
        
        Collections.shuffle(testQuestions);
        
        return ResponseEntity.ok(testQuestions);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitPlacementTest(@RequestBody PlacementTestRequest submitRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<PlacementTestRequest.AnswerRequest> userAnswers = submitRequest.getAnswers();
        if (userAnswers == null || userAnswers.isEmpty()) {
            return ResponseEntity.badRequest().body("No answers provided");
        }

        int correctCount = 0;
        int vocabTotal = 0, vocabCorrect = 0;
        int grammarTotal = 0, grammarCorrect = 0;
        int listeningTotal = 0, listeningCorrect = 0;
        int readingTotal = 0, readingCorrect = 0;

        StringBuilder questionDetails = new StringBuilder();

        for (PlacementTestRequest.AnswerRequest answer : userAnswers) {
            Question q = questionRepository.findById(answer.getQuestionId()).orElse(null);
            if (q == null) continue;

            boolean isCorrect = q.getCorrectOption().trim().equalsIgnoreCase(answer.getSelectedOption().trim());
            if (isCorrect) {
                correctCount++;
            }

            if (q.getType() != null) {
                switch (q.getType()) {
                    case "VOCABULARY" -> {
                        vocabTotal++;
                        if (isCorrect) vocabCorrect++;
                    }
                    case "GRAMMAR" -> {
                        grammarTotal++;
                        if (isCorrect) grammarCorrect++;
                    }
                    case "LISTENING" -> {
                        listeningTotal++;
                        if (isCorrect) listeningCorrect++;
                    }
                    case "READING" -> {
                        readingTotal++;
                        if (isCorrect) readingCorrect++;
                    }
                }
            }

            questionDetails.append(String.format(
                "- Skill: %s, Level: %s, Question: \"%s\", Correct Answer: %s, User Selected: %s, Result: %s\n",
                q.getType(),
                q.getDifficulty(),
                q.getQuestionText().replace("\n", " "),
                q.getCorrectOption(),
                answer.getSelectedOption(),
                isCorrect ? "CORRECT" : "INCORRECT"
            ));
        }

        String cefrLevel = "A1";
        String toeicEquivalent = "100 - 300";
        String overallEvaluation = "";
        List<String[]> moduleTemplates = new ArrayList<>();

        boolean aiGenerated = false;
        String targetGoal = submitRequest.getTargetGoal();
        if (targetGoal != null && !targetGoal.trim().isEmpty()) {
            try {
                String systemPrompt = "You are an expert English teacher AI specializing in TOEIC preparation. Your task is to analyze the user's placement test performance (correct answers count and skill details) and their target TOEIC score goal (e.g. TOEIC 550, TOEIC 750, etc.) to generate a personalized learning roadmap consisting of EXACTLY 10 custom learning modules.\n\n" +
                        "For each module, you MUST estimate the gradual progress of the user's TOEIC score after completing that module, moving from their current level up to their target goal. Include this estimated TOEIC score range in the module's title (e.g. 'Chinh phục 400+ TOEIC: [Tên chủ đề]' or 'Đạt 550+ TOEIC: [Tên chủ đề]').\n\n" +
                        "You MUST output raw JSON matching this format:\n" +
                        "{\n" +
                        "  \"cefrLevel\": \"B1\",\n" +
                        "  \"toeicEquivalent\": \"500 - 650\",\n" +
                        "  \"overallEvaluation\": \"Đánh giá chi tiết bằng tiếng Việt về thế mạnh, điểm yếu và cách lộ trình này giúp bạn đạt mục tiêu.\",\n" +
                        "  \"modules\": [\n" +
                        "    {\n" +
                        "      \"title\": \"Tên Module 1 (kèm TOEIC ước lượng, ví dụ: Chinh phục 400+ TOEIC: Từ vựng nền tảng)\",\n" +
                        "      \"description\": \"Mô tả chi tiết bằng tiếng Việt về nội dung sẽ học trong Module 1.\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"title\": \"Tên Module 2 (kèm TOEIC ước lượng, ví dụ: Chinh phục 450+ TOEIC: ...)\",\n" +
                        "      \"description\": \"Mô tả chi tiết bằng tiếng Việt về nội dung sẽ học trong Module 2.\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"title\": \"Tên Module 3 (kèm TOEIC ước lượng)\",\n" +
                        "      \"description\": \"Mô tả chi tiết bằng tiếng Việt về nội dung sẽ học trong Module 3.\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"title\": \"Tên Module 4 (kèm TOEIC ước lượng)\",\n" +
                        "      \"description\": \"Mô tả chi tiết bằng tiếng Việt về nội dung sẽ học trong Module 4.\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"title\": \"Tên Module 5 (kèm TOEIC ước lượng)\",\n" +
                        "      \"description\": \"Mô tả chi tiết bằng tiếng Việt về nội dung sẽ học trong Module 5.\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"title\": \"Tên Module 6 (kèm TOEIC ước lượng)\",\n" +
                        "      \"description\": \"Mô tả chi tiết bằng tiếng Việt về nội dung sẽ học trong Module 6.\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"title\": \"Tên Module 7 (kèm TOEIC ước lượng)\",\n" +
                        "      \"description\": \"Mô tả chi tiết bằng tiếng Việt về nội dung sẽ học trong Module 7.\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"title\": \"Tên Module 8 (kèm TOEIC ước lượng)\",\n" +
                        "      \"description\": \"Mô tả chi tiết bằng tiếng Việt về nội dung sẽ học trong Module 8.\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"title\": \"Tên Module 9 (kèm TOEIC ước lượng)\",\n" +
                        "      \"description\": \"Mô tả chi tiết bằng tiếng Việt về nội dung sẽ học trong Module 9.\"\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"title\": \"Tên Module 10 (kèm TOEIC ước lượng)\",\n" +
                        "      \"description\": \"Mô tả chi tiết bằng tiếng Việt về nội dung sẽ học trong Module 10.\"\n" +
                        "    }\n" +
                        "  ]\n" +
                        "}\n" +
                        "Always write overallEvaluation, title, and description in Vietnamese. Keep the output clean, without any extra text or markdown formatting outside the JSON.";

                String userPrompt = String.format(
                        "User's placement test performance:\n" +
                        "- Total score: %d/12 correct\n" +
                        "- Vocab: %d/%d correct\n" +
                        "- Grammar: %d/%d correct\n" +
                        "- Listening: %d/%d correct\n" +
                        "- Reading: %d/%d correct\n" +
                        "\n" +
                        "User's target TOEIC score goal: \"%s\"\n" +
                        "\n" +
                        "Here are the question-by-question details of the user's test:\n" +
                        "%s",
                        correctCount,
                        vocabCorrect, vocabTotal,
                        grammarCorrect, grammarTotal,
                        listeningCorrect, listeningTotal,
                        readingCorrect, readingTotal,
                        targetGoal,
                        questionDetails.toString()
                );

                log.info("Requesting personalized AI roadmap from Groq for goal: {}", targetGoal);
                String jsonResponse = groqService.generateJsonResponse(systemPrompt, userPrompt);
                log.info("Received dynamic roadmap response: {}", jsonResponse);
                
                JsonNode root = objectMapper.readTree(jsonResponse);
                cefrLevel = root.path("cefrLevel").asText("A2");
                toeicEquivalent = root.path("toeicEquivalent").asText("350 - 500");
                overallEvaluation = root.path("overallEvaluation").asText("");
                
                JsonNode modulesNode = root.path("modules");
                if (modulesNode.isArray() && modulesNode.size() >= 10) {
                    for (int i = 0; i < 10; i++) {
                        JsonNode mNode = modulesNode.get(i);
                        moduleTemplates.add(new String[]{
                            mNode.path("title").asText("Module " + (i + 1)),
                            mNode.path("description").asText("")
                        });
                    }
                    aiGenerated = true;
                }
            } catch (Exception e) {
                log.error("AI Roadmap generation failed, falling back to local heuristic rules", e);
            }
        }

        if (!aiGenerated) {
            if (correctCount >= 10) {
                cefrLevel = "B2";
                toeicEquivalent = "700 - 850";
                overallEvaluation = "Chúc mừng! Bạn có vốn từ vựng phong phú, nắm vững cấu trúc ngữ pháp trung cấp và có khả năng nghe/đọc hiểu tốt. Lộ trình của bạn sẽ tập trung vào các mệnh đề nâng cao, viết báo cáo công sở và đọc tài liệu chuyên ngành.";
                moduleTemplates = List.of(
                    new String[]{"Chinh phục 700+ TOEIC: Mệnh đề & Phân từ rút gọn", "Làm chủ mệnh đề quan hệ rút gọn, câu phức nâng cao thường gặp."},
                    new String[]{"Chinh phục 715+ TOEIC: Từ vựng chuyên ngành Tài chính", "Học thuật ngữ tài chính, ngân hàng và kế toán doanh nghiệp."},
                    new String[]{"Chinh phục 730+ TOEIC: Phản xạ nghe hiểu Part 4", "Luyện nghe hiểu bài nói ngắn, tin nhắn thoại tốc độ cao."},
                    new String[]{"Chinh phục 745+ TOEIC: Câu giả định & Đảo ngữ", "Nâng cấp ngữ pháp chuyên nghiệp và cấu trúc câu đặc biệt."},
                    new String[]{"Chinh phục 760+ TOEIC: Đọc hiểu văn bản kép Part 7", "Kỹ năng liên kết thông tin giữa nhiều văn bản và thư từ."},
                    new String[]{"Chinh phục 775+ TOEIC: Bẫy Part 5 & 6 thường gặp", "Nhận diện các bẫy ngữ pháp thường gặp và tối ưu hóa thời gian làm bài."},
                    new String[]{"Chinh phục 790+ TOEIC: Nghe hiểu Part 3 nâng cao", "Luyện nghe các hội thoại có 3 người nói, ngữ điệu địa phương khó."},
                    new String[]{"Chinh phục 805+ TOEIC: Đọc hiểu văn bản ba Part 7", "Chiến thuật làm bài đọc hiểu chứa 3 đoạn văn bản liên kết."},
                    new String[]{"Chinh phục 820+ TOEIC: Phân từ hoàn thành & Câu điều kiện hỗn hợp", "Làm chủ ngữ pháp cực khó trong giao tiếp và văn viết."},
                    new String[]{"Chinh phục 850+ TOEIC: Đề thi thực tế & Tổng ôn", "Luyện đề thi trọn vẹn và củng cố toàn diện kỹ năng phòng thi."}
                );
            } else if (correctCount >= 7) {
                cefrLevel = "B1";
                toeicEquivalent = "550 - 680";
                overallEvaluation = "Kết quả rất khả quan! Bạn có nền tảng giao tiếp căn bản nhưng còn gặp khó khăn ở các thì hoàn thành phức tạp hoặc từ vựng mở rộng. Hãy củng cố vững chắc cấu trúc câu phức và giao tiếp tự nhiên.";
                moduleTemplates = List.of(
                    new String[]{"Chinh phục 550+ TOEIC: Thì Hoàn thành & Liên từ", "Hệ thống lại các thì hoàn thành tiếp diễn và các liên từ phức."},
                    new String[]{"Chinh phục 560+ TOEIC: Cụm động từ văn phòng", "Từ vựng, phrasal verbs thông dụng tại nơi làm việc."},
                    new String[]{"Chinh phục 575+ TOEIC: Nghe hiểu hội thoại Part 3", "Luyện kỹ năng nghe bắt từ khóa và ngữ cảnh hội thoại 2-3 người."},
                    new String[]{"Chinh phục 590+ TOEIC: So sánh hơn & So sánh nhất", "Cách so sánh số liệu, lựa chọn sản phẩm và đối tác kinh doanh."},
                    new String[]{"Chinh phục 605+ TOEIC: Đọc hiểu email & thông báo Part 7", "Rèn luyện kỹ năng đọc lướt và quét thông tin nhanh."},
                    new String[]{"Chinh phục 620+ TOEIC: Đề thi thực tế Part 5 & 6", "Luyện tập điền từ và hoàn thành câu với tốc độ tối ưu."},
                    new String[]{"Chinh phục 635+ TOEIC: Câu bị động nâng cao", "Cấu trúc bị động đặc biệt, bị động với động từ tường thuật."},
                    new String[]{"Chinh phục 650+ TOEIC: Từ vựng Marketing & Bán hàng", "Bổ sung thuật ngữ quảng cáo, xúc tiến thương mại và nghiên cứu thị trường."},
                    new String[]{"Chinh phục 665+ TOEIC: Nghe hiểu độc thoại Part 4", "Kỹ năng nghe hiểu bài thông báo, quảng cáo, giới thiệu sản phẩm."},
                    new String[]{"Chinh phục 680+ TOEIC: Kỹ năng đọc hiểu bài báo Part 7", "Cách phân tích và tìm từ đồng nghĩa trong các bài đọc thực tế."}
                );
            } else if (correctCount >= 4) {
                cefrLevel = "A2";
                toeicEquivalent = "350 - 500";
                overallEvaluation = "Khá tốt! Bạn đã biết những từ vựng và thì cơ bản nhưng phản xạ chưa nhanh và dễ nhầm lẫn khi chia động từ. Bạn cần thực hành hệ thống lại ngữ pháp nền tảng và bổ sung từ vựng thông dụng.";
                moduleTemplates = List.of(
                    new String[]{"Chinh phục 350+ TOEIC: Mô tả tranh vẽ Part 1", "Từ vựng về hoạt động, đồ vật và chiến thuật làm bài Part 1."},
                    new String[]{"Chinh phục 365+ TOEIC: Thì Quá khứ đơn & Tiếp diễn", "Diễn tả sự kiện đã qua và sự việc đang diễn ra trong quá khứ."},
                    new String[]{"Chinh phục 380+ TOEIC: Nghe hiểu Hỏi & Đáp Part 2", "Phản xạ nhanh với câu hỏi Wh-questions và Yes/No."},
                    new String[]{"Chinh phục 395+ TOEIC: Giới từ & Trạng từ chỉ thời gian", "Sử dụng giới từ in, on, at và trạng từ liên kết chính xác."},
                    new String[]{"Chinh phục 410+ TOEIC: Đọc hiểu mẩu tin nhắn ngắn", "Đọc hiểu thông tin cốt lõi trong ghi chú nội bộ công sở."},
                    new String[]{"Chinh phục 425+ TOEIC: Từ vựng mua sắm & Dịch vụ", "Bổ sung các chủ đề từ vựng thương mại cơ bản thường ngày."},
                    new String[]{"Chinh phục 440+ TOEIC: Câu điều kiện loại 1 & 2", "Học cách diễn tả giả định có thực và không có thực ở hiện tại."},
                    new String[]{"Chinh phục 455+ TOEIC: Nghe hiểu hội thoại ngắn Part 3", "Làm quen với hội thoại 2 người nói và cách bắt từ khóa dễ."},
                    new String[]{"Chinh phục 470+ TOEIC: Danh động từ & Động từ nguyên mẫu", "Quy tắc sử dụng Gerund và Infinitive sau động từ chính."},
                    new String[]{"Chinh phục 500+ TOEIC: Đọc hiểu quảng cáo & Thông tin sản phẩm", "Rèn luyện khả năng đọc hiểu các bảng biểu và thông báo khuyến mãi."}
                );
            } else {
                cefrLevel = "A1";
                toeicEquivalent = "100 - 300";
                overallEvaluation = "Chào mừng bạn! Hiện tại bạn cần bắt đầu từ những bài học vỡ lòng như danh từ, tính từ và các câu chào hỏi giao tiếp cơ bản nhất. Đừng lo lắng, luyện tập đều đặn hằng ngày sẽ giúp bạn xây dựng nền tảng vững vàng.";
                moduleTemplates = List.of(
                    new String[]{"Chinh phục 100+ TOEIC: Phát âm & Số đếm cơ bản", "Luyện nghe âm đơn, nhận diện bảng chữ cái và số đếm thông dụng."},
                    new String[]{"Chinh phục 120+ TOEIC: Danh từ chỉ người & vật", "Cách nhận biết danh từ số ít/số nhiều và đại từ nhân xưng."},
                    new String[]{"Chinh phục 140+ TOEIC: Tính từ miêu tả đơn giản", "Sắp xếp vị trí tính từ bổ nghĩa và các câu miêu tả cơ bản."},
                    new String[]{"Chinh phục 160+ TOEIC: Thì Hiện tại đơn & Động từ Be", "Cách chia động từ trong câu đơn và tự giới thiệu bản thân."},
                    new String[]{"Chinh phục 180+ TOEIC: Giờ giấc & Lịch làm việc cơ bản", "Nhận diện các hội thoại ngắn về cuộc hẹn và giờ giấc sinh hoạt."},
                    new String[]{"Chinh phục 200+ TOEIC: Biển báo nơi công cộng", "Đọc hiểu biển cấm, chỉ dẫn đơn giản tại nhà ga, sân bay."},
                    new String[]{"Chinh phục 220+ TOEIC: Động từ tình thái cơ bản", "Cách sử dụng can, could, must, should trong câu giao tiếp ngắn."},
                    new String[]{"Chinh phục 240+ TOEIC: Giới từ chỉ vị trí cơ bản", "Sử dụng chính xác in, on, at, under, next to, behind."},
                    new String[]{"Chinh phục 260+ TOEIC: Nghe hiểu câu hỏi Part 2 cơ bản", "Luyện nghe và phản xạ trả lời câu hỏi Who, Where, When cực dễ."},
                    new String[]{"Chinh phục 300+ TOEIC: Đọc hiểu thư điện tử ngắn", "Làm quen với cấu trúc email công việc đơn giản nhất."}
                );
            }
        }

        try {
            LearningRoadmap existingRoadmap = roadmapRepository.findByUserId(user.getId()).orElse(null);
            if (existingRoadmap != null) {
                user.setLearningRoadmap(null);
                userRepository.saveAndFlush(user);
                roadmapRepository.delete(existingRoadmap);
                roadmapRepository.flush();
            }

            LearningRoadmap newRoadmap = LearningRoadmap.builder()
                    .user(user)
                    .cefrLevel(cefrLevel)
                    .toeicEquivalent(toeicEquivalent)
                    .overallEvaluation(overallEvaluation)
                    .build();

            List<LearningModule> modules = new ArrayList<>();
            for (int i = 0; i < moduleTemplates.size(); i++) {
                String[] template = moduleTemplates.get(i);
                LearningModule module = LearningModule.builder()
                        .roadmap(newRoadmap)
                        .title(template[0])
                        .description(template[1])
                        .orderIndex(i + 1)
                        .status(i == 0 ? "IN_PROGRESS" : "LOCKED")
                        .build();
                modules.add(module);
            }

            newRoadmap.setModules(modules);
            LearningRoadmap savedRoadmap = roadmapRepository.save(newRoadmap);
            user.setLearningRoadmap(savedRoadmap);

            int currentExp = user.getExp();
            int currentLevel = user.getLevel();
            int currentCoins = user.getCoins();

            currentExp += 100;
            currentCoins += 50;

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

            return ResponseEntity.ok(savedRoadmap);
        } catch (Exception e) {
            log.error("Failed to save roadmap", e);
            return ResponseEntity.internalServerError().body("Error saving roadmap: " + e.getMessage());
        }
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

    @GetMapping("/roadmap")
    public ResponseEntity<?> getUserRoadmap() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        LearningRoadmap roadmap = roadmapRepository.findByUserId(user.getId()).orElse(null);
        if (roadmap == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(roadmap);
    }
}
