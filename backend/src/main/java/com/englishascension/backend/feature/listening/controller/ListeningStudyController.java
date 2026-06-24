package com.englishascension.backend.feature.listening.controller;

import com.englishascension.backend.feature.listening.service.ListeningService;
import com.englishascension.backend.shared.reward.RewardResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Listening study REST controller – HTTP layer only.
 * All business logic is delegated to {@link ListeningService}.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/listening")
public class ListeningStudyController {

    private final ListeningService listeningService;

    public ListeningStudyController(ListeningService listeningService) {
        this.listeningService = listeningService;
    }

    @GetMapping("/topics")
    public ResponseEntity<List<Map<String, Object>>> getTopics() {
        return ResponseEntity.ok(listeningService.getTopics());
    }

    @GetMapping("/topics/{topicId}/sections")
    public ResponseEntity<List<Map<String, Object>>> getTopicSections(@PathVariable Long topicId) {
        return ResponseEntity.ok(listeningService.getTopicSections(topicId));
    }

    @PostMapping("/questions/{questionId}/complete")
    public ResponseEntity<RewardResult> completeQuestion(@PathVariable Long questionId) {
        return ResponseEntity.ok(listeningService.completeQuestion(questionId));
    }

    @PostMapping("/sections/{sectionId}/complete")
    public ResponseEntity<RewardResult> completeSection(@PathVariable Long sectionId) {
        return ResponseEntity.ok(listeningService.completeSection(sectionId));
    }
}
