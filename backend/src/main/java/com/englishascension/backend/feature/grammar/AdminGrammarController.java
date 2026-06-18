package com.englishascension.backend.feature.grammar;

import com.englishascension.backend.feature.study.Question;
import com.englishascension.backend.feature.study.QuestionRepository;
import com.englishascension.backend.feature.study.StudyContent;
import com.englishascension.backend.feature.study.StudyContentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/grammar")
@PreAuthorize("hasRole('ADMIN')")
public class AdminGrammarController {

    private final StudyContentRepository lessonRepository;
    private final QuestionRepository questionRepository;

    public AdminGrammarController(StudyContentRepository lessonRepository, QuestionRepository questionRepository) {
        this.lessonRepository = lessonRepository;
        this.questionRepository = questionRepository;
    }

    /** GET /api/admin/grammar/lessons - Lấy danh sách các bài học ngữ pháp */
    @GetMapping("/lessons")
    public ResponseEntity<List<StudyContent>> getLessons() {
        List<StudyContent> lessons = lessonRepository.findByType("GRAMMAR");
        return ResponseEntity.ok(lessons);
    }

    /** POST /api/admin/grammar/lessons - Tạo bài học ngữ pháp mới */
    @PostMapping("/lessons")
    public ResponseEntity<StudyContent> createLesson(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String category = request.get("category"); // Category trong GRAMMAR dùng để lưu tên tiếng Việt
        String bodyText = request.get("bodyText"); // Nội dung lý thuyết ngữ pháp

        StudyContent lesson = StudyContent.builder()
                .title(title)
                .category(category != null ? category : "")
                .bodyText(bodyText != null ? bodyText : "")
                .type("GRAMMAR")
                .questionsCount(0)
                .build();

        StudyContent saved = lessonRepository.save(lesson);
        return ResponseEntity.ok(saved);
    }

    /** PUT /api/admin/grammar/lessons/{id} - Cập nhật bài học ngữ pháp */
    @PutMapping("/lessons/{id}")
    public ResponseEntity<StudyContent> updateLesson(@PathVariable Long id, @RequestBody Map<String, String> request) {
        StudyContent lesson = lessonRepository.findById(id).orElse(null);
        if (lesson == null || !"GRAMMAR".equals(lesson.getType())) {
            return ResponseEntity.notFound().build();
        }

        if (request.containsKey("title")) lesson.setTitle(request.get("title"));
        if (request.containsKey("category")) lesson.setCategory(request.get("category"));
        if (request.containsKey("bodyText")) lesson.setBodyText(request.get("bodyText"));

        StudyContent updated = lessonRepository.save(lesson);
        return ResponseEntity.ok(updated);
    }

    /** DELETE /api/admin/grammar/lessons/{id} - Xóa bài học ngữ pháp và câu hỏi liên quan */
    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        StudyContent lesson = lessonRepository.findById(id).orElse(null);
        if (lesson == null || !"GRAMMAR".equals(lesson.getType())) {
            return ResponseEntity.notFound().build();
        }

        // Xóa các câu hỏi của bài học
        List<Question> questions = questionRepository.findBySourceTypeAndParentId("GRAMMAR", id);
        questionRepository.deleteAll(questions);

        lessonRepository.delete(lesson);
        return ResponseEntity.ok(Map.of("message", "Deleted lesson and its questions successfully"));
    }

    /** GET /api/admin/grammar/lessons/{lessonId}/questions - Lấy danh sách câu hỏi của bài học */
    @GetMapping("/lessons/{lessonId}/questions")
    public ResponseEntity<List<Question>> getLessonQuestions(@PathVariable Long lessonId) {
        List<Question> questions = questionRepository.findBySourceTypeAndParentId("GRAMMAR", lessonId);
        return ResponseEntity.ok(questions);
    }

    /** POST /api/admin/grammar/lessons/{lessonId}/questions - Thêm câu hỏi vào bài học */
    @PostMapping("/lessons/{lessonId}/questions")
    public ResponseEntity<Question> createQuestion(@PathVariable Long lessonId, @RequestBody Map<String, Object> request) {
        StudyContent lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null) {
            return ResponseEntity.notFound().build();
        }

        // Đọc các trường option
        @SuppressWarnings("unchecked")
        List<String> options = (List<String>) request.get("options");
        String optA = (options != null && options.size() > 0) ? options.get(0) : "";
        String optB = (options != null && options.size() > 1) ? options.get(1) : "";
        String optC = (options != null && options.size() > 2) ? options.get(2) : "";
        String optD = (options != null && options.size() > 3) ? options.get(3) : "";

        Question question = Question.builder()
                .parentId(lessonId)
                .sourceType("GRAMMAR")
                .questionNumber(request.get("questionNumber") != null ? (Integer) request.get("questionNumber") : 1)
                .questionText((String) request.get("questionText"))
                .optionA(optA)
                .optionB(optB)
                .optionC(optC)
                .optionD(optD)
                .correctOption((String) request.get("correctOption"))
                .correctAnswer((String) request.get("correctAnswer"))
                .explanation((String) request.get("explanation"))
                .difficulty("MEDIUM")
                .build();

        Question saved = questionRepository.save(question);

        // Cập nhật số câu hỏi trong bài học
        lesson.setQuestionsCount(questionRepository.findBySourceTypeAndParentId("GRAMMAR", lessonId).size());
        lessonRepository.save(lesson);

        return ResponseEntity.ok(saved);
    }

    /** PUT /api/admin/grammar/questions/{questionId} - Cập nhật câu hỏi */
    @PutMapping("/questions/{questionId}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long questionId, @RequestBody Map<String, Object> request) {
        Question question = questionRepository.findById(questionId).orElse(null);
        if (question == null || !"GRAMMAR".equals(question.getSourceType())) {
            return ResponseEntity.notFound().build();
        }

        if (request.containsKey("questionText")) question.setQuestionText((String) request.get("questionText"));
        if (request.containsKey("correctOption")) question.setCorrectOption((String) request.get("correctOption"));
        if (request.containsKey("correctAnswer")) question.setCorrectAnswer((String) request.get("correctAnswer"));
        if (request.containsKey("explanation")) question.setExplanation((String) request.get("explanation"));
        if (request.containsKey("questionNumber")) question.setQuestionNumber((Integer) request.get("questionNumber"));
        
        if (request.containsKey("options")) {
            @SuppressWarnings("unchecked")
            List<String> options = (List<String>) request.get("options");
            if (options != null) {
                if (options.size() > 0) question.setOptionA(options.get(0));
                if (options.size() > 1) question.setOptionB(options.get(1));
                if (options.size() > 2) question.setOptionC(options.get(2));
                if (options.size() > 3) question.setOptionD(options.get(3));
            }
        }

        Question updated = questionRepository.save(question);
        return ResponseEntity.ok(updated);
    }

    /** DELETE /api/admin/grammar/questions/{questionId} - Xóa câu hỏi */
    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long questionId) {
        Question question = questionRepository.findById(questionId).orElse(null);
        if (question == null) {
            return ResponseEntity.notFound().build();
        }

        Long lessonId = question.getParentId();
        questionRepository.delete(question);

        // Cập nhật số câu hỏi trong bài học
        StudyContent lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson != null) {
            lesson.setQuestionsCount(questionRepository.findBySourceTypeAndParentId("GRAMMAR", lessonId).size());
            lessonRepository.save(lesson);
        }

        return ResponseEntity.ok(Map.of("message", "Question deleted successfully"));
    }
}
