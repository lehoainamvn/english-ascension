package com.englishascension.backend.feature.placementtest.controller;

import com.englishascension.backend.feature.placementtest.dto.PlacementTestRequest;
import com.englishascension.backend.feature.placementtest.service.PlacementTestService;
import com.englishascension.backend.feature.study.entity.Question;
import com.englishascension.backend.feature.study.entity.QuestionOption;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/placement-test")
public class PlacementTestController {

    private final PlacementTestService placementTestService;

    public PlacementTestController(PlacementTestService placementTestService) {
        this.placementTestService = placementTestService;
    }

    private String detectQuestionType(Question q) {
        if (q.getLesson() != null) {
            return q.getLesson().getType().name();
        }
        String qText = q.getQuestionText() != null ? q.getQuestionText().toLowerCase() : "";
        if (qText.contains("[audio question]") || qText.contains("listen to the audio")) {
            return "LISTENING";
        } else if (qText.contains("read the passage")) {
            return "READING";
        } else if (qText.contains("synonym") || qText.contains("meaning of")) {
            return "VOCABULARY";
        } else {
            return "GRAMMAR";
        }
    }

    @GetMapping("/questions")
    public ResponseEntity<?> getPlacementTestQuestions() {
        List<Question> questions = placementTestService.getPlacementTestQuestions();
        List<Map<String, Object>> response = questions.stream().map(q -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", q.getId());
            map.put("questionText", q.getQuestionText());
            
            String detectedType = detectQuestionType(q);
            map.put("type", detectedType);
            map.put("difficulty", q.getDifficulty() != null ? q.getDifficulty() : "A2");
            map.put("explanation", q.getExplanation());
            
            if ("LISTENING".equals(detectedType)) {
                map.put("audioUrl", "tts");
            }

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

    @PostMapping("/submit")
    public ResponseEntity<?> submitPlacementTest(@RequestBody PlacementTestRequest submitRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            Map<String, Object> roadmap = placementTestService.submitPlacementTest(submitRequest, email);
            return ResponseEntity.ok(roadmap);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving roadmap: " + e.getMessage());
        }
    }

    @GetMapping("/roadmap")
    public ResponseEntity<?> getUserRoadmap() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Map<String, Object> roadmap = placementTestService.getUserRoadmap(email);
        if (roadmap == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(roadmap);
    }
}
