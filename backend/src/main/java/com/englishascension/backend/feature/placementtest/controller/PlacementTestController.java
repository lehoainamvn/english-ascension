package com.englishascension.backend.feature.placementtest.controller;

import com.englishascension.backend.feature.placementtest.dto.PlacementTestRequest;
import com.englishascension.backend.feature.placementtest.service.PlacementTestService;
import com.englishascension.backend.feature.roadmap.entity.LearningRoadmap;
import com.englishascension.backend.feature.study.entity.Question;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getPlacementTestQuestions() {
        List<Question> questions = placementTestService.getPlacementTestQuestions();
        return ResponseEntity.ok(questions);
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
