package com.englishascension.backend.feature.grammar.controller;

import com.englishascension.backend.feature.roadmap.entity.LearningModule;
import com.englishascension.backend.feature.roadmap.entity.Lesson;
import com.englishascension.backend.feature.roadmap.entity.LessonContent;
import com.englishascension.backend.feature.roadmap.entity.LessonType;
import com.englishascension.backend.feature.roadmap.repository.LearningModuleRepository;
import com.englishascension.backend.feature.roadmap.repository.LessonRepository;
import com.englishascension.backend.feature.study.entity.Question;
import com.englishascension.backend.feature.study.entity.QuestionOption;
import com.englishascension.backend.feature.study.repository.QuestionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/grammar")
@PreAuthorize("hasRole('ADMIN')")
public class AdminGrammarController {

    private final LessonRepository lessonRepository;
    private final LearningModuleRepository moduleRepository;
    private final QuestionRepository questionRepository;

    public AdminGrammarController(LessonRepository lessonRepository, 
                                  LearningModuleRepository moduleRepository,
                                  QuestionRepository questionRepository) {
        this.lessonRepository = lessonRepository;
        this.moduleRepository = moduleRepository;
        this.questionRepository = questionRepository;
    }

    private LearningModule getOrCreateModuleForLevel(String level) {
        String lvl = level != null ? level.toUpperCase().trim() : "A1";
        Long modId;
        switch (lvl) {
            case "A2" -> modId = 1006L;
            case "B1" -> modId = 1010L;
            case "B2" -> modId = 1014L;
            case "C1" -> modId = 1018L;
            default -> modId = 1002L;
        }
        return moduleRepository.findById(modId).orElse(null);
    }

    @GetMapping("/lessons")
    public ResponseEntity<List<Lesson>> getLessons() {
        List<Lesson> lessons = lessonRepository.findByType(LessonType.GRAMMAR);
        return ResponseEntity.ok(lessons);
    }

    @PostMapping("/lessons")
    public ResponseEntity<Lesson> createLesson(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String category = request.get("category"); // Level: A1, A2...
        String bodyText = request.get("bodyText");

        LearningModule module = getOrCreateModuleForLevel(category);
        String slug = "grammar-" + (category != null ? category.toLowerCase() : "a1") + "-" + title.toLowerCase().replace(" ", "-");

        Lesson lesson = Lesson.builder()
                .title(title)
                .slug(slug)
                .module(module)
                .type(LessonType.GRAMMAR)
                .level(category != null ? category : "A1")
                .orderIndex(1)
                .difficultyScore(1.0)
                .topic(title)
                .build();

        lesson = lessonRepository.save(lesson);

        LessonContent content = LessonContent.builder()
                .lesson(lesson)
                .bodyText(bodyText != null ? bodyText : "")
                .durationSeconds(900)
                .build();
        lesson.setLessonContent(content);
        lessonRepository.save(lesson);

        return ResponseEntity.ok(lesson);
    }

    @PutMapping("/lessons/{id}")
    public ResponseEntity<Lesson> updateLesson(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Lesson lesson = lessonRepository.findById(id).orElse(null);
        if (lesson == null) {
            return ResponseEntity.notFound().build();
        }

        if (request.containsKey("title")) {
            lesson.setTitle(request.get("title"));
            lesson.setTopic(request.get("title"));
        }
        if (request.containsKey("category")) {
            lesson.setLevel(request.get("category"));
            lesson.setModule(getOrCreateModuleForLevel(request.get("category")));
        }
        if (request.containsKey("bodyText")) {
            LessonContent content = lesson.getLessonContent();
            if (content == null) {
                content = LessonContent.builder().lesson(lesson).build();
            }
            content.setBodyText(request.get("bodyText"));
            lesson.setLessonContent(content);
        }

        Lesson updated = lessonRepository.save(lesson);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        Lesson lesson = lessonRepository.findById(id).orElse(null);
        if (lesson == null) {
            return ResponseEntity.notFound().build();
        }

        lessonRepository.delete(lesson);
        return ResponseEntity.ok(Map.of("message", "Deleted lesson successfully"));
    }

    @GetMapping("/lessons/{lessonId}/questions")
    public ResponseEntity<?> getLessonQuestions(@PathVariable Long lessonId) {
        List<Question> questions = questionRepository.findByLessonId(lessonId);
        List<Map<String, Object>> response = questions.stream().map(q -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", q.getId());
            map.put("questionText", q.getQuestionText());
            map.put("explanation", q.getExplanation());
            
            map.put("optionA", "");
            map.put("optionB", "");
            map.put("optionC", "");
            map.put("optionD", "");
            String correct = "A";
            for (QuestionOption opt : q.getOptions()) {
                if ("A".equalsIgnoreCase(opt.getOptionKey())) map.put("optionA", opt.getOptionValue());
                if ("B".equalsIgnoreCase(opt.getOptionKey())) map.put("optionB", opt.getOptionValue());
                if ("C".equalsIgnoreCase(opt.getOptionKey())) map.put("optionC", opt.getOptionValue());
                if ("D".equalsIgnoreCase(opt.getOptionKey())) map.put("optionD", opt.getOptionValue());
                if (opt.isCorrect()) {
                    correct = opt.getOptionKey();
                }
            }
            map.put("correctAnswer", correct);
            return map;
        }).toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/lessons/{lessonId}/questions")
    public ResponseEntity<?> createQuestion(@PathVariable Long lessonId, @RequestBody Map<String, Object> request) {
        Lesson lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null) {
            return ResponseEntity.notFound().build();
        }

        Question question = Question.builder()
                .lesson(lesson)
                .sourceType("ROADMAP_QUIZ")
                .questionText((String) request.get("questionText"))
                .explanation((String) request.get("explanation"))
                .difficulty(lesson.getLevel())
                .build();

        @SuppressWarnings("unchecked")
        List<String> optionsList = (List<String>) request.get("options");
        String correct = (String) request.get("correctAnswer");
        if (correct == null) correct = "A";

        List<QuestionOption> options = new ArrayList<>();
        if (optionsList != null) {
            if (optionsList.size() > 0) options.add(QuestionOption.builder().question(question).optionKey("A").optionValue(optionsList.get(0)).correct("A".equalsIgnoreCase(correct)).build());
            if (optionsList.size() > 1) options.add(QuestionOption.builder().question(question).optionKey("B").optionValue(optionsList.get(1)).correct("B".equalsIgnoreCase(correct)).build());
            if (optionsList.size() > 2) options.add(QuestionOption.builder().question(question).optionKey("C").optionValue(optionsList.get(2)).correct("C".equalsIgnoreCase(correct)).build());
            if (optionsList.size() > 3) options.add(QuestionOption.builder().question(question).optionKey("D").optionValue(optionsList.get(3)).correct("D".equalsIgnoreCase(correct)).build());
        }
        question.setOptions(options);
        questionRepository.save(question);

        return ResponseEntity.ok(Map.of("message", "Question created successfully"));
    }

    @PutMapping("/questions/{questionId}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long questionId, @RequestBody Map<String, Object> request) {
        Question question = questionRepository.findById(questionId).orElse(null);
        if (question == null) {
            return ResponseEntity.notFound().build();
        }

        if (request.containsKey("questionText")) question.setQuestionText((String) request.get("questionText"));
        if (request.containsKey("explanation")) question.setExplanation((String) request.get("explanation"));

        questionRepository.save(question);
        return ResponseEntity.ok(Map.of("message", "Question updated successfully"));
    }

    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long questionId) {
        Question question = questionRepository.findById(questionId).orElse(null);
        if (question == null) {
            return ResponseEntity.notFound().build();
        }

        questionRepository.delete(question);
        return ResponseEntity.ok(Map.of("message", "Question deleted successfully"));
    }
}
