package com.englishascension.backend.feature.reading.controller;

import com.englishascension.backend.feature.reading.service.ReadingService;
import com.englishascension.backend.shared.reward.RewardResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Reading study REST controller – HTTP layer only.
 * All business logic is delegated to {@link ReadingService}.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reading")
public class ReadingStudyController {

    private final ReadingService readingService;

    public ReadingStudyController(ReadingService readingService) {
        this.readingService = readingService;
    }

    @GetMapping("/articles")
    public ResponseEntity<List<Map<String, Object>>> getArticles() {
        return ResponseEntity.ok(readingService.getArticles());
    }

    @GetMapping("/articles/{articleId}")
    public ResponseEntity<Map<String, Object>> getArticleDetails(@PathVariable Long articleId) {
        return ResponseEntity.ok(readingService.getArticleDetails(articleId));
    }

    @PostMapping("/questions/{questionId}/submit")
    public ResponseEntity<Map<String, Object>> submitAnswer(
            @PathVariable Long questionId,
            @RequestParam String selectedOption) {
        return ResponseEntity.ok(readingService.submitAnswer(questionId, selectedOption));
    }

    @PostMapping("/articles/{articleId}/complete")
    public ResponseEntity<RewardResult> completeArticle(@PathVariable Long articleId) {
        return ResponseEntity.ok(readingService.completeArticle(articleId));
    }
}
