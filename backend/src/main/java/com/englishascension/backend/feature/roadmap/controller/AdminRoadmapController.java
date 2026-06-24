package com.englishascension.backend.feature.roadmap.controller;

import com.englishascension.backend.feature.roadmap.dto.RoadmapRequest;
import com.englishascension.backend.feature.roadmap.entity.LearningRoadmap;
import com.englishascension.backend.feature.roadmap.service.AdminRoadmapService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/roadmaps")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRoadmapController {

    private final AdminRoadmapService adminRoadmapService;

    public AdminRoadmapController(AdminRoadmapService adminRoadmapService) {
        this.adminRoadmapService = adminRoadmapService;
    }

    @GetMapping
    public ResponseEntity<List<LearningRoadmap>> getAllRoadmaps() {
        List<LearningRoadmap> roadmaps = adminRoadmapService.getAllPresetRoadmaps();
        return ResponseEntity.ok(roadmaps);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningRoadmap> getRoadmapById(@PathVariable Long id) {
        LearningRoadmap roadmap = adminRoadmapService.getPresetRoadmapById(id);
        if (roadmap == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(roadmap);
    }

    @PostMapping
    public ResponseEntity<LearningRoadmap> createRoadmap(@RequestBody RoadmapRequest request) {
        LearningRoadmap created = adminRoadmapService.createPresetRoadmap(request);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningRoadmap> updateRoadmap(
            @PathVariable Long id,
            @RequestBody RoadmapRequest request) {
        LearningRoadmap updated = adminRoadmapService.updatePresetRoadmap(id, request);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoadmap(@PathVariable Long id) {
        boolean success = adminRoadmapService.deletePresetRoadmap(id);
        if (!success) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("message", "Deleted preset roadmap successfully."));
    }
}
