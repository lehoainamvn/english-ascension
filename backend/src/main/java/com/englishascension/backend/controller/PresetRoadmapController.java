package com.englishascension.backend.controller;

import com.englishascension.backend.model.LearningRoadmap;
import com.englishascension.backend.model.User;
import com.englishascension.backend.model.UserRoadmapEnrollment;
import com.englishascension.backend.repository.LearningRoadmapRepository;
import com.englishascension.backend.repository.UserRepository;
import com.englishascension.backend.repository.UserRoadmapEnrollmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/preset-roadmaps")
public class PresetRoadmapController {

    private final LearningRoadmapRepository roadmapRepository;
    private final UserRoadmapEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    public PresetRoadmapController(
            LearningRoadmapRepository roadmapRepository,
            UserRoadmapEnrollmentRepository enrollmentRepository,
            UserRepository userRepository) {
        this.roadmapRepository = roadmapRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
    }

    /** GET /api/preset-roadmaps - Lấy tất cả lộ trình chung */
    @GetMapping
    public ResponseEntity<List<LearningRoadmap>> getAllPresetRoadmaps() {
        List<LearningRoadmap> presets = roadmapRepository.findByIsPresetTrueOrderByIdAsc();
        return ResponseEntity.ok(presets);
    }

    /** GET /api/preset-roadmaps/{id} - Chi tiết 1 lộ trình (bao gồm modules) */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPresetRoadmapById(@PathVariable Long id) {
        Optional<LearningRoadmap> roadmap = roadmapRepository.findById(id);
        if (roadmap.isEmpty() || !roadmap.get().isPreset()) {
            return ResponseEntity.notFound().build();
        }

        // Kiểm tra xem user đã enroll chưa (nếu đã đăng nhập)
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                boolean enrolled = enrollmentRepository.existsByUserIdAndRoadmapId(user.getId(), id);
                Map<String, Object> result = new HashMap<>();
                result.put("roadmap", roadmap.get());
                result.put("enrolled", enrolled);
                return ResponseEntity.ok(result);
            }
        } catch (Exception ignored) {}

        Map<String, Object> result = new HashMap<>();
        result.put("roadmap", roadmap.get());
        result.put("enrolled", false);
        return ResponseEntity.ok(result);
    }

    /** POST /api/preset-roadmaps/{id}/enroll - Đăng ký học lộ trình */
    @PostMapping("/{id}/enroll")
    public ResponseEntity<?> enrollRoadmap(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        LearningRoadmap roadmap = roadmapRepository.findById(id).orElse(null);
        if (roadmap == null || !roadmap.isPreset()) {
            return ResponseEntity.notFound().build();
        }

        // Nếu đã enroll rồi thì update last_accessed_at
        Optional<UserRoadmapEnrollment> existing =
                enrollmentRepository.findByUserIdAndRoadmapId(user.getId(), id);

        if (existing.isPresent()) {
            UserRoadmapEnrollment enrollment = existing.get();
            enrollment.setLastAccessedAt(LocalDateTime.now());
            enrollmentRepository.save(enrollment);
            return ResponseEntity.ok(Map.of("message", "Already enrolled", "enrollment", enrollment));
        }

        UserRoadmapEnrollment enrollment = UserRoadmapEnrollment.builder()
                .userId(user.getId())
                .roadmap(roadmap)
                .status("IN_PROGRESS")
                .build();
        enrollmentRepository.save(enrollment);

        return ResponseEntity.ok(Map.of("message", "Enrolled successfully", "enrollment", enrollment));
    }

    /** GET /api/preset-roadmaps/my-enrollments - Lộ trình đang học của user */
    @GetMapping("/my-enrollments")
    public ResponseEntity<?> getMyEnrollments() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<UserRoadmapEnrollment> enrollments =
                enrollmentRepository.findByUserIdOrderByLastAccessedAtDesc(user.getId());

        return ResponseEntity.ok(enrollments);
    }

    /** DELETE /api/preset-roadmaps/{id}/unenroll - Hủy đăng ký học */
    @DeleteMapping("/{id}/unenroll")
    public ResponseEntity<?> unenrollRoadmap(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Optional<UserRoadmapEnrollment> enrollment =
                enrollmentRepository.findByUserIdAndRoadmapId(user.getId(), id);

        if (enrollment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        enrollmentRepository.delete(enrollment.get());
        return ResponseEntity.ok(Map.of("message", "Unenrolled successfully"));
    }
}
