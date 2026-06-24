package com.englishascension.backend.feature.roadmap.controller;

import com.englishascension.backend.feature.roadmap.entity.LearningRoadmap;
import com.englishascension.backend.feature.roadmap.service.RoadmapService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Preset roadmap REST controller – HTTP layer only.
 * All business logic is delegated to {@link RoadmapService}.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/preset-roadmaps")
public class PresetRoadmapController {

    private final RoadmapService roadmapService;

    public PresetRoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    /** GET /api/preset-roadmaps – Lấy tất cả lộ trình chung */
    @GetMapping
    public ResponseEntity<List<LearningRoadmap>> getAllPresetRoadmaps() {
        return ResponseEntity.ok(roadmapService.getAllPresetRoadmaps());
    }

    /** GET /api/preset-roadmaps/{id} – Chi tiết 1 lộ trình */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPresetRoadmapById(@PathVariable Long id) {
        return ResponseEntity.ok(roadmapService.getPresetRoadmapById(id));
    }

    /** POST /api/preset-roadmaps/{id}/enroll – Đăng ký học lộ trình */
    @PostMapping("/{id}/enroll")
    public ResponseEntity<Map<String, Object>> enrollRoadmap(@PathVariable Long id) {
        return ResponseEntity.ok(roadmapService.enroll(id));
    }

    /** GET /api/preset-roadmaps/my-enrollments – Lộ trình đang học của user */
    @GetMapping("/my-enrollments")
    public ResponseEntity<List<Map<String, Object>>> getMyEnrollments() {
        return ResponseEntity.ok(roadmapService.getMyEnrollments());
    }

    /** DELETE /api/preset-roadmaps/{id}/unenroll – Hủy đăng ký học */
    @DeleteMapping("/{id}/unenroll")
    public ResponseEntity<Map<String, String>> unenrollRoadmap(@PathVariable Long id) {
        roadmapService.unenroll(id);
        return ResponseEntity.ok(Map.of("message", "Unenrolled successfully"));
    }
}
