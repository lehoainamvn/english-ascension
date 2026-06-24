package com.englishascension.backend.feature.listening.controller;

import com.englishascension.backend.feature.study.entity.Question;
import com.englishascension.backend.feature.study.repository.QuestionRepository;
import com.englishascension.backend.feature.study.entity.StudyContent;
import com.englishascension.backend.feature.study.repository.StudyContentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/listening")
@PreAuthorize("hasRole('ADMIN')")
public class AdminListeningController {

    private final StudyContentRepository topicRepository;
    private final QuestionRepository questionRepository;

    public AdminListeningController(StudyContentRepository topicRepository, QuestionRepository questionRepository) {
        this.topicRepository = topicRepository;
        this.questionRepository = questionRepository;
    }

    /** GET /api/admin/listening/topics - Danh sách các bài nghe */
    @GetMapping("/topics")
    public ResponseEntity<List<StudyContent>> getTopics() {
        List<StudyContent> topics = topicRepository.findByType("LISTENING");
        return ResponseEntity.ok(topics);
    }

    /** POST /api/admin/listening/topics - Tạo bài luyện nghe mới */
    @PostMapping("/topics")
    public ResponseEntity<StudyContent> createTopic(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String category = request.get("category"); // ví dụ: "Listening Test 1"
        String description = request.get("description");

        StudyContent topic = StudyContent.builder()
                .title(title)
                .category(category != null ? category : "LISTENING")
                .description(description != null ? description : "")
                .type("LISTENING")
                .questionsCount(0)
                .build();

        StudyContent saved = topicRepository.save(topic);
        return ResponseEntity.ok(saved);
    }

    /** PUT /api/admin/listening/topics/{id} - Cập nhật bài luyện nghe */
    @PutMapping("/topics/{id}")
    public ResponseEntity<StudyContent> updateTopic(@PathVariable Long id, @RequestBody Map<String, String> request) {
        StudyContent topic = topicRepository.findById(id).orElse(null);
        if (topic == null || !"LISTENING".equals(topic.getType())) {
            return ResponseEntity.notFound().build();
        }

        if (request.containsKey("title")) topic.setTitle(request.get("title"));
        if (request.containsKey("category")) topic.setCategory(request.get("category"));
        if (request.containsKey("description")) topic.setDescription(request.get("description"));

        StudyContent updated = topicRepository.save(topic);
        return ResponseEntity.ok(updated);
    }

    /** DELETE /api/admin/listening/topics/{id} - Xóa bài luyện nghe và câu hỏi đi kèm */
    @DeleteMapping("/topics/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable Long id) {
        StudyContent topic = topicRepository.findById(id).orElse(null);
        if (topic == null || !"LISTENING".equals(topic.getType())) {
            return ResponseEntity.notFound().build();
        }

        // Xóa câu hỏi nghe liên quan
        List<Question> questions = questionRepository.findBySourceTypeAndParentId("LISTENING", id);
        questionRepository.deleteAll(questions);

        topicRepository.delete(topic);
        return ResponseEntity.ok(Map.of("message", "Deleted listening topic and questions successfully"));
    }

    /** GET /api/admin/listening/topics/{topicId}/questions - Lấy danh sách câu hỏi nghe của bài học */
    @GetMapping("/topics/{topicId}/questions")
    public ResponseEntity<List<Question>> getTopicQuestions(@PathVariable Long topicId) {
        List<Question> questions = questionRepository.findBySourceTypeAndParentId("LISTENING", topicId);
        return ResponseEntity.ok(questions);
    }

    /** POST /api/admin/listening/topics/{topicId}/questions - Thêm câu hỏi nghe mới */
    @PostMapping("/topics/{topicId}/questions")
    public ResponseEntity<Question> createQuestion(@PathVariable Long topicId, @RequestBody Map<String, Object> request) {
        StudyContent topic = topicRepository.findById(topicId).orElse(null);
        if (topic == null) {
            return ResponseEntity.notFound().build();
        }

        @SuppressWarnings("unchecked")
        List<String> options = (List<String>) request.get("options");
        String optA = (options != null && options.size() > 0) ? options.get(0) : "";
        String optB = (options != null && options.size() > 1) ? options.get(1) : "";
        String optC = (options != null && options.size() > 2) ? options.get(2) : "";
        String optD = (options != null && options.size() > 3) ? options.get(3) : "";

        Question question = Question.builder()
                .parentId(topicId)
                .sourceType("LISTENING")
                .questionNumber(request.get("questionNumber") != null ? (Integer) request.get("questionNumber") : 1)
                .questionText((String) request.get("questionText"))
                .optionA(optA)
                .optionB(optB)
                .optionC(optC)
                .optionD(optD)
                .correctOption((String) request.get("correctOption"))
                .correctAnswer((String) request.get("correctAnswer"))
                .explanation((String) request.get("explanation")) // Có thể chứa dịch nghĩa/kịch bản hội thoại
                .audioUrl((String) request.get("audioUrl")) // Đường dẫn file âm thanh/audio
                .difficulty((String) request.get("difficulty")) // Dùng difficulty để lưu tên Section/Part (ví dụ: "Part 1: Photo Description")
                .build();

        Question saved = questionRepository.save(question);

        // Cập nhật số câu hỏi trong bài
        topic.setQuestionsCount(questionRepository.findBySourceTypeAndParentId("LISTENING", topicId).size());
        topicRepository.save(topic);

        return ResponseEntity.ok(saved);
    }

    /** PUT /api/admin/listening/questions/{questionId} - Sửa câu hỏi nghe */
    @PutMapping("/questions/{questionId}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long questionId, @RequestBody Map<String, Object> request) {
        Question question = questionRepository.findById(questionId).orElse(null);
        if (question == null || !"LISTENING".equals(question.getSourceType())) {
            return ResponseEntity.notFound().build();
        }

        if (request.containsKey("questionText")) question.setQuestionText((String) request.get("questionText"));
        if (request.containsKey("correctOption")) question.setCorrectOption((String) request.get("correctOption"));
        if (request.containsKey("correctAnswer")) question.setCorrectAnswer((String) request.get("correctAnswer"));
        if (request.containsKey("explanation")) question.setExplanation((String) request.get("explanation"));
        if (request.containsKey("audioUrl")) question.setAudioUrl((String) request.get("audioUrl"));
        if (request.containsKey("difficulty")) question.setDifficulty((String) request.get("difficulty"));
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

    /** DELETE /api/admin/listening/questions/{questionId} - Xóa câu hỏi nghe */
    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long questionId) {
        Question question = questionRepository.findById(questionId).orElse(null);
        if (question == null) {
            return ResponseEntity.notFound().build();
        }

        Long topicId = question.getParentId();
        questionRepository.delete(question);

        // Cập nhật số câu hỏi
        StudyContent topic = topicRepository.findById(topicId).orElse(null);
        if (topic != null) {
            topic.setQuestionsCount(questionRepository.findBySourceTypeAndParentId("LISTENING", topicId).size());
            topicRepository.save(topic);
        }

        return ResponseEntity.ok(Map.of("message", "Question deleted successfully"));
    }
}
