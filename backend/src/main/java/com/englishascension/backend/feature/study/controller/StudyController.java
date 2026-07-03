package com.englishascension.backend.feature.study.controller;

import com.englishascension.backend.feature.study.service.StudyService;
import com.englishascension.backend.shared.reward.RewardResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Study REST controller – HTTP layer only.
 * All business logic is delegated to {@link StudyService}.
 * Previously 997 lines, now ~70.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/study")
public class StudyController {

    private final StudyService studyService;

    public StudyController(StudyService studyService) {
        this.studyService = studyService;
    }

    @GetMapping("/modules/{moduleId}/content")
    public ResponseEntity<Map<String, Object>> getModuleContent(
            @PathVariable String moduleId,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(studyService.getModuleContent(moduleId, category));
    }

    @PostMapping("/modules/{moduleId}/complete-step")
    public ResponseEntity<RewardResult> completeStep(
            @PathVariable String moduleId,
            @RequestBody(required = false) Map<String, String> request) {
        return ResponseEntity.ok(studyService.completeStep(moduleId));
    }

    @PostMapping("/modules/{moduleId}/complete")
    public ResponseEntity<Map<String, Object>> completeModule(
            @PathVariable String moduleId,
            @RequestBody Map<String, Object> requestBody) {
        return ResponseEntity.ok(studyService.completeModule(moduleId, requestBody));
    }

    @GetMapping("/modules/{moduleId}/battle-words")
    public ResponseEntity<List<Map<String, Object>>> getBattleWords(@PathVariable String moduleId) {
        return ResponseEntity.ok(studyService.getBattleWords(moduleId));
    }

    @PostMapping("/modules/{moduleId}/battle-complete")
    public ResponseEntity<RewardResult> completeWordBattle(@PathVariable String moduleId) {
        return ResponseEntity.ok(studyService.completeBattle(moduleId));
    }

    @PostMapping("/pronunciation/analyze")
    public ResponseEntity<String> analyzePronunciation(@RequestBody Map<String, String> request) {
        String result = studyService.analyzePronunciation(
                request.get("targetWord"), request.get("transcribedText"));
        return ResponseEntity.ok()
                .header("Content-Type", "application/json; charset=UTF-8")
                .body(result);
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile() {
        return ResponseEntity.ok(studyService.getUserProfile());
    }
}
