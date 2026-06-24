package com.englishascension.backend.feature.roadmap.service;

import com.englishascension.backend.feature.roadmap.entity.LearningRoadmap;
import com.englishascension.backend.feature.roadmap.repository.LearningRoadmapRepository;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.entity.UserProgress;
import com.englishascension.backend.feature.user.repository.UserProgressRepository;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.shared.exception.ResourceNotFoundException;
import com.englishascension.backend.shared.reward.RewardResult;
import com.englishascension.backend.shared.reward.RewardService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Business logic for preset roadmap enrollment and progress.
 */
@Service
public class RoadmapService {

    private final LearningRoadmapRepository roadmapRepository;
    private final UserProgressRepository    progressRepository;
    private final UserRepository            userRepository;
    private final RewardService             rewardService;

    public RoadmapService(LearningRoadmapRepository roadmapRepository,
                          UserProgressRepository progressRepository,
                          UserRepository userRepository,
                          RewardService rewardService) {
        this.roadmapRepository  = roadmapRepository;
        this.progressRepository = progressRepository;
        this.userRepository     = userRepository;
        this.rewardService      = rewardService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    // ------------------------------------------------------------------
    // Get all preset roadmaps
    // ------------------------------------------------------------------

    public List<LearningRoadmap> getAllPresetRoadmaps() {
        return roadmapRepository.findByIsPresetTrueOrderByIdAsc();
    }

    // ------------------------------------------------------------------
    // Get single roadmap with enrollment status
    // ------------------------------------------------------------------

    public Map<String, Object> getPresetRoadmapById(Long id) {
        LearningRoadmap roadmap = roadmapRepository.findById(id)
                .filter(LearningRoadmap::isPreset)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap", id));

        boolean enrolled = false;
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                enrolled = progressRepository
                        .findByUserIdAndResourceTypeAndResourceId(user.getId(), "ROADMAP", id)
                        .isPresent();
            }
        } catch (Exception ignored) {}

        Map<String, Object> result = new HashMap<>();
        result.put("roadmap",  roadmap);
        result.put("enrolled", enrolled);
        return result;
    }

    // ------------------------------------------------------------------
    // Enroll
    // ------------------------------------------------------------------

    public Map<String, Object> enroll(Long id) {
        User user = getCurrentUser();

        LearningRoadmap roadmap = roadmapRepository.findById(id)
                .filter(LearningRoadmap::isPreset)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap", id));

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

        // Enrollment itself grants no XP/coins
        RewardResult reward = rewardService.noReward(user);

        Map<String, Object> enrollmentDto = new HashMap<>();
        enrollmentDto.put("id",             enrollment.getId());
        enrollmentDto.put("userId",         user.getId());
        enrollmentDto.put("roadmap",        roadmap);
        enrollmentDto.put("status",         enrollment.isCompleted() ? "COMPLETED" : "IN_PROGRESS");
        enrollmentDto.put("enrolledAt",     enrollment.getCompletedAt() != null
                                            ? enrollment.getCompletedAt().toString()
                                            : LocalDateTime.now().toString());
        enrollmentDto.put("lastAccessedAt", enrollmentDto.get("enrolledAt"));

        Map<String, Object> res = new HashMap<>();
        res.put("message",      "Enrolled successfully");
        res.put("enrollment",   enrollmentDto);
        res.put("xpGained",     reward.getXpGained());
        res.put("coinsGained",  reward.getCoinsGained());
        res.put("newXp",        reward.getNewXp());
        res.put("newLevel",     reward.getNewLevel());
        res.put("newCoins",     reward.getNewCoins());
        res.put("leveledUp",    reward.isLeveledUp());
        res.put("newTitle",     reward.getNewTitle());
        return res;
    }

    // ------------------------------------------------------------------
    // Get my enrollments
    // ------------------------------------------------------------------

    public List<Map<String, Object>> getMyEnrollments() {
        User user = getCurrentUser();

        List<UserProgress> progresses =
                progressRepository.findByUserIdAndResourceType(user.getId(), "ROADMAP");

        return progresses.stream().map(p -> {
            LearningRoadmap rm = roadmapRepository.findById(p.getResourceId()).orElse(null);
            Map<String, Object> map = new HashMap<>();
            map.put("id",             p.getId());
            map.put("userId",         user.getId());
            map.put("roadmap",        rm);
            map.put("status",         p.isCompleted() ? "COMPLETED" : "IN_PROGRESS");
            map.put("enrolledAt",     p.getCompletedAt() != null
                                      ? p.getCompletedAt().toString()
                                      : LocalDateTime.now().toString());
            map.put("lastAccessedAt", map.get("enrolledAt"));
            return map;
        }).collect(Collectors.toList());
    }

    // ------------------------------------------------------------------
    // Unenroll
    // ------------------------------------------------------------------

    public void unenroll(Long id) {
        User user = getCurrentUser();

        UserProgress enrollment = progressRepository
                .findByUserIdAndResourceTypeAndResourceId(user.getId(), "ROADMAP", id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment for roadmap", id));

        progressRepository.delete(enrollment);
    }
}
