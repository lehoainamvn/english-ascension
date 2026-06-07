package com.englishascension.backend.controller;

import com.englishascension.backend.dto.PlacementTestRequest;
import com.englishascension.backend.model.LearningModule;
import com.englishascension.backend.model.LearningRoadmap;
import com.englishascension.backend.model.Question;
import com.englishascension.backend.model.User;
import com.englishascension.backend.repository.LearningRoadmapRepository;
import com.englishascension.backend.repository.QuestionRepository;
import com.englishascension.backend.repository.UserRepository;
import com.englishascension.backend.service.GroqService;
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
        // Fetch all questions and randomize them
        List<Question> allQuestions = questionRepository.findAllRandom();
        
        // Group by type to ensure equal distribution: 3 of each type
        List<Question> vocab = allQuestions.stream().filter(q -> q.getType().name().equals("VOCABULARY")).limit(3).toList();
        List<Question> grammar = allQuestions.stream().filter(q -> q.getType().name().equals("GRAMMAR")).limit(3).toList();
        List<Question> listening = allQuestions.stream().filter(q -> q.getType().name().equals("LISTENING")).limit(3).toList();
        List<Question> reading = allQuestions.stream().filter(q -> q.getType().name().equals("READING")).limit(3).toList();
        
        List<Question> testQuestions = new ArrayList<>();
        testQuestions.addAll(vocab);
        testQuestions.addAll(grammar);
        testQuestions.addAll(listening);
        testQuestions.addAll(reading);
        
        // Shuffle the selected test questions for randomness in delivery
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

            switch (q.getType()) {
                case VOCABULARY -> {
                    vocabTotal++;
                    if (isCorrect) vocabCorrect++;
                }
                case GRAMMAR -> {
                    grammarTotal++;
                    if (isCorrect) grammarCorrect++;
                }
                case LISTENING -> {
                    listeningTotal++;
                    if (isCorrect) listeningCorrect++;
                }
                case READING -> {
                    readingTotal++;
                    if (isCorrect) readingCorrect++;
                }
            }

            questionDetails.append(String.format(
                "- Skill: %s, Level: %s, Question: \"%s\", Correct Answer: %s, User Selected: %s, Result: %s\n",
                q.getType().name(),
                q.getDifficulty(),
                q.getQuestionText().replace("\n", " "),
                q.getCorrectOption(),
                answer.getSelectedOption(),
                isCorrect ? "CORRECT" : "INCORRECT"
            ));
        }

        // Local evaluation (no AI connection needed for basic diagnostic roadmap and module creation)
        String cefrLevel;
        String toeicEquivalent;
        String overallEvaluation;
        List<String[]> moduleTemplates;

        if (correctCount >= 10) {
            cefrLevel = "B2";
            toeicEquivalent = "700 - 850";
            overallEvaluation = "Chúc mừng! Bạn có vốn từ vựng phong phú, nắm vững cấu trúc ngữ pháp trung cấp và có khả năng nghe/đọc hiểu tốt. Lộ trình của bạn sẽ tập trung vào các mệnh đề nâng cao, viết báo cáo công sở và đọc tài liệu chuyên ngành.";
            moduleTemplates = List.of(
                new String[]{"Module 1: Advanced Sentence Clauses & Collocations", "Làm chủ mệnh đề quan hệ rút gọn, câu phức và cụm từ kết hợp tự nhiên."},
                new String[]{"Module 2: Business English & Workplace Communication", "Học từ vựng công sở chuyên nghiệp, viết email thương mại và đàm phán."},
                new String[]{"Module 3: Academic Reading & Listening Analysis", "Luyện đọc báo cáo học thuật, nghe hiểu tin tức thực tế và hội thảo."}
            );
        } else if (correctCount >= 7) {
            cefrLevel = "B1";
            toeicEquivalent = "550 - 680";
            overallEvaluation = "Kết quả rất khả quan! Bạn có nền tảng giao tiếp căn bản nhưng còn gặp khó khăn ở các thì hoàn thành phức tạp hoặc từ vựng mở rộng. Hãy củng cố vững chắc cấu trúc câu phức và giao tiếp tự nhiên.";
            moduleTemplates = List.of(
                new String[]{"Module 1: Perfecting Complex Tenses & Conjunctions", "Nắm chắc các thì hoàn thành tiếp diễn, câu giả định và liên từ phức."},
                new String[]{"Module 2: Conversation & Discussion Vocabulary", "Từ vựng diễn tả ý kiến cá nhân, mô tả số liệu và đối thoại trôi chảy."},
                new String[]{"Module 3: Practical Reading & Audio Comprehension", "Đọc các thông báo dài, email công việc và nghe báo cáo ngắn."}
            );
        } else if (correctCount >= 4) {
            cefrLevel = "A2";
            toeicEquivalent = "350 - 500";
            overallEvaluation = "Khá tốt! Bạn đã biết những từ vựng và thì cơ bản nhưng phản xạ chưa nhanh và dễ nhầm lẫn khi chia động từ. Bạn cần thực hành hệ thống lại ngữ pháp nền tảng và bổ sung từ vựng thông dụng.";
            moduleTemplates = List.of(
                new String[]{"Module 1: Core Grammars & Tenses", "Học và làm chủ cách phối hợp các thì đơn, thì tiếp diễn và động từ bất quy tắc."},
                new String[]{"Module 2: Daily Expressions & Sentence Building", "Từ vựng thông dụng về gia đình, công việc, mua sắm và cách liên kết câu."},
                new String[]{"Module 3: Short Listening & Reading Exercises", "Đọc hiểu email đơn giản, đoạn văn ngắn và nghe hội thoại thường ngày."}
            );
        } else {
            cefrLevel = "A1";
            toeicEquivalent = "100 - 300";
            overallEvaluation = "Chào mừng bạn! Hiện tại bạn cần bắt đầu từ những bài học vỡ lòng như danh từ, tính từ và các câu chào hỏi giao tiếp cơ bản nhất. Đừng lo lắng, luyện tập đều đặn hằng ngày sẽ giúp bạn xây dựng nền tảng vững vàng.";
            moduleTemplates = List.of(
                new String[]{"Module 1: English Fundamentals: Part of Speech", "Nhận biết các thành phần trong câu: danh từ, động từ, tính từ và đại từ."},
                new String[]{"Module 2: Daily Greetings & Basic Vocabulary", "Cách chào hỏi, số đếm, chỉ ngày tháng, giới thiệu bản thân cơ bản."},
                new String[]{"Module 3: Simple Dialogues & Audio Recognition", "Luyện nghe từ đơn, nhận biết âm thanh và đọc hiểu biển báo thông dụng."}
            );
        }

        try {
            // Overwrite existing roadmap
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

            return ResponseEntity.ok(savedRoadmap);
        } catch (Exception e) {
            log.error("Failed to save roadmap", e);
            return ResponseEntity.internalServerError().body("Error saving roadmap: " + e.getMessage());
        }
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
