package com.englishascension.backend.feature.roadmap;

import com.englishascension.backend.feature.roadmap.LearningRoadmap;
import com.englishascension.backend.feature.user.User;
import com.englishascension.backend.feature.user.UserProgress;
import com.englishascension.backend.feature.roadmap.LearningRoadmapRepository;
import com.englishascension.backend.feature.user.UserRepository;
import com.englishascension.backend.feature.user.UserProgressRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/preset-roadmaps")
public class PresetRoadmapController {

    private final LearningRoadmapRepository roadmapRepository;
    private final UserProgressRepository progressRepository;
    private final UserRepository userRepository;

    public PresetRoadmapController(
            LearningRoadmapRepository roadmapRepository,
            UserProgressRepository progressRepository,
            UserRepository userRepository) {
        this.roadmapRepository = roadmapRepository;
        this.progressRepository = progressRepository;
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

        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                boolean enrolled = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "ROADMAP", id).isPresent();
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

        Optional<UserProgress> existing =
                progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "ROADMAP", id);

        UserProgress enrollment;
        if (existing.isPresent()) {
            enrollment = existing.get();
            enrollment.setCompletedAt(LocalDateTime.now());
            progressRepository.save(enrollment);
        } else {
            enrollment = UserProgress.builder()
                    .user(user)
                    .resourceType("ROADMAP")
                    .resourceId(roadmap.getId())
                    .completed(false)
                    .completedAt(LocalDateTime.now())
                    .build();
            progressRepository.save(enrollment);
        }

        int xpGained = 0;
        int coinsGained = 0;

        int currentExp = user.getExp();
        int currentLevel = user.getLevel();
        int currentCoins = user.getCoins();

        currentExp += xpGained;
        currentCoins += coinsGained;

        boolean leveledUp = false;
        while (true) {
            int expNeeded = currentLevel * 100;
            if (currentExp >= expNeeded) {
                currentExp -= expNeeded;
                currentLevel++;
                leveledUp = true;
            } else {
                break;
            }
        }

        user.setExp(currentExp);
        user.setLevel(currentLevel);
        user.setCoins(currentCoins);

        if (leveledUp) {
            String newTitle = calculateTitle(currentLevel);
            user.setCharacterTitle(newTitle);
        }
        userRepository.save(user);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Enrolled successfully");
        
        Map<String, Object> enrollmentDto = new HashMap<>();
        enrollmentDto.put("id", enrollment.getId());
        enrollmentDto.put("userId", user.getId());
        enrollmentDto.put("roadmap", roadmap);
        enrollmentDto.put("status", enrollment.isCompleted() ? "COMPLETED" : "IN_PROGRESS");
        enrollmentDto.put("enrolledAt", enrollment.getCompletedAt() != null ? enrollment.getCompletedAt().toString() : LocalDateTime.now().toString());
        enrollmentDto.put("lastAccessedAt", enrollment.getCompletedAt() != null ? enrollment.getCompletedAt().toString() : LocalDateTime.now().toString());
        
        res.put("enrollment", enrollmentDto);
        res.put("xpGained", xpGained);
        res.put("coinsGained", coinsGained);
        res.put("newXp", currentExp);
        res.put("newLevel", currentLevel);
        res.put("newCoins", currentCoins);
        res.put("leveledUp", leveledUp);
        res.put("newTitle", user.getCharacterTitle() != null ? user.getCharacterTitle() : "Novice");
        return ResponseEntity.ok(res);
    }

    private String calculateTitle(int level) {
        if (level >= 100) return "Language Legend";
        if (level >= 80) return "Grand Sage";
        if (level >= 60) return "Master";
        if (level >= 40) return "Knight";
        if (level >= 20) return "Scholar";
        if (level >= 10) return "Student";
        if (level >= 5) return "Adventurer";
        return "Novice";
    }

    /** GET /api/preset-roadmaps/my-enrollments - Lộ trình đang học của user */
    @GetMapping("/my-enrollments")
    public ResponseEntity<?> getMyEnrollments() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<UserProgress> progresses =
                progressRepository.findByUserIdAndResourceType(user.getId(), "ROADMAP");

        List<Map<String, Object>> enrollmentDtos = progresses.stream().map(p -> {
            LearningRoadmap rm = roadmapRepository.findById(p.getResourceId()).orElse(null);
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("userId", user.getId());
            map.put("roadmap", rm);
            map.put("status", p.isCompleted() ? "COMPLETED" : "IN_PROGRESS");
            map.put("enrolledAt", p.getCompletedAt() != null ? p.getCompletedAt().toString() : LocalDateTime.now().toString());
            map.put("lastAccessedAt", p.getCompletedAt() != null ? p.getCompletedAt().toString() : LocalDateTime.now().toString());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(enrollmentDtos);
    }

    /** DELETE /api/preset-roadmaps/{id}/unenroll - Hủy đăng ký học */
    @DeleteMapping("/{id}/unenroll")
    public ResponseEntity<?> unenrollRoadmap(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Optional<UserProgress> enrollment =
                progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "ROADMAP", id);

        if (enrollment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        progressRepository.delete(enrollment.get());
        return ResponseEntity.ok(Map.of("message", "Unenrolled successfully"));
    }
}
