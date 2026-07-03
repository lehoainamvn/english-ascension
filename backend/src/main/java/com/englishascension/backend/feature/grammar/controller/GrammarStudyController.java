package com.englishascension.backend.feature.grammar.controller;

import com.englishascension.backend.feature.grammar.dto.GrammarLessonResponse;
import com.englishascension.backend.feature.study.entity.Question;
import com.englishascension.backend.feature.grammar.service.GrammarService;
import com.englishascension.backend.shared.reward.RewardResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/grammar")
public class GrammarStudyController {

    private final GrammarService grammarService;

    public GrammarStudyController(GrammarService grammarService) {
        this.grammarService = grammarService;
    }

    @GetMapping("/lessons")
    public ResponseEntity<List<GrammarLessonResponse>> getLessons() {
        return ResponseEntity.ok(grammarService.getLessons());
    }

    @GetMapping("/lessons/{lessonId}")
    public ResponseEntity<GrammarLessonResponse> getLesson(@PathVariable Long lessonId) {
        return ResponseEntity.ok(grammarService.getLesson(lessonId));
    }

    @GetMapping("/lessons/{lessonId}/questions")
    public ResponseEntity<List<Question>> getQuestions(@PathVariable Long lessonId) {
        return ResponseEntity.ok(grammarService.getQuestions(lessonId));
    }

    @PostMapping("/lessons/{lessonId}/complete-lesson")
    public ResponseEntity<RewardResult> completeLesson(@PathVariable Long lessonId) {
        return ResponseEntity.ok(grammarService.completeLesson(lessonId));
    }

    @PostMapping("/lessons/{lessonId}/complete-practice")
    public ResponseEntity<RewardResult> completePractice(
            @PathVariable Long lessonId,
            @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(grammarService.completePractice(lessonId, request));
    }
}
