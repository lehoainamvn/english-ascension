package com.englishascension.backend.feature.vocabulary.controller;

import com.englishascension.backend.feature.vocabulary.service.VocabularyService;
import com.englishascension.backend.shared.reward.RewardResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Vocabulary study REST controller – HTTP layer only.
 * All business logic is delegated to {@link VocabularyService}.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/vocabulary")
public class VocabularyStudyController {

    private final VocabularyService vocabularyService;

    public VocabularyStudyController(VocabularyService vocabularyService) {
        this.vocabularyService = vocabularyService;
    }

    @GetMapping("/topics")
    public ResponseEntity<List<Map<String, Object>>> getTopics() {
        return ResponseEntity.ok(vocabularyService.getTopics());
    }

    @GetMapping("/topics/{topicId}/words")
    public ResponseEntity<List<Map<String, Object>>> getTopicWords(@PathVariable Long topicId) {
        return ResponseEntity.ok(vocabularyService.getTopicWords(topicId));
    }

    @PostMapping("/words/{wordId}/mark-learned")
    public ResponseEntity<RewardResult> markWordLearned(@PathVariable Long wordId) {
        return ResponseEntity.ok(vocabularyService.markWordLearned(wordId));
    }

    @PostMapping("/topics/{topicId}/complete")
    public ResponseEntity<RewardResult> completeTopic(@PathVariable Long topicId) {
        return ResponseEntity.ok(vocabularyService.completeTopic(topicId));
    }
}
