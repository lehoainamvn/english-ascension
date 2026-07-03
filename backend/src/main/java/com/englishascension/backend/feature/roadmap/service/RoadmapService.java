package com.englishascension.backend.feature.roadmap.service;

import com.englishascension.backend.feature.roadmap.entity.LearningRoadmap;
import com.englishascension.backend.feature.roadmap.entity.UserRoadmap;
import com.englishascension.backend.feature.roadmap.repository.LearningRoadmapRepository;
import com.englishascension.backend.feature.roadmap.repository.UserRoadmapRepository;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.shared.exception.ResourceNotFoundException;
import com.englishascension.backend.shared.reward.RewardResult;
import com.englishascension.backend.shared.reward.RewardService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

import com.englishascension.backend.feature.user.repository.UserLessonStateRepository;
import com.englishascension.backend.feature.user.entity.UserLessonState;
import com.englishascension.backend.feature.roadmap.entity.LearningModule;
import com.englishascension.backend.feature.roadmap.entity.Lesson;
import java.util.stream.Collectors;

/**
 * Nghiệp vụ Lộ trình (Roadmap):
 * - Một User có thể đăng ký nhiều lộ trình khác nhau (1-N).
 * - Mỗi cặp (user_id, roadmap_id) là duy nhất — không enroll lại cùng lộ trình.
 * - Unenroll = xóa bản ghi UserRoadmap (không xóa placement score vì score lưu ở bảng khác).
 */
@Service
@Transactional
public class RoadmapService {

    private final LearningRoadmapRepository roadmapRepository;
    private final UserRoadmapRepository     userRoadmapRepository;
    private final UserRepository            userRepository;
    private final UserLessonStateRepository userLessonStateRepository;
    private final RewardService             rewardService;

    public RoadmapService(LearningRoadmapRepository roadmapRepository,
                          UserRoadmapRepository userRoadmapRepository,
                          UserRepository userRepository,
                          UserLessonStateRepository userLessonStateRepository,
                          RewardService rewardService) {
        this.roadmapRepository     = roadmapRepository;
        this.userRoadmapRepository = userRoadmapRepository;
        this.userRepository        = userRepository;
        this.userLessonStateRepository = userLessonStateRepository;
        this.rewardService         = rewardService;
    }

    // -----------------------------------------------------------------------
    // Helper
    // -----------------------------------------------------------------------
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    private Map<String, Object> toEnrollmentDto(UserRoadmap ur) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id",             ur.getId());
        dto.put("userId",         ur.getUser().getId());
        dto.put("roadmap",        buildDynamicRoadmapDto(ur.getRoadmap(), ur.getUser()));
        dto.put("status",         ur.getStatus());
        dto.put("enrolledAt",     ur.getCreatedAt() != null ? ur.getCreatedAt().toString() : LocalDateTime.now().toString());
        dto.put("lastAccessedAt", LocalDateTime.now().toString());
        return dto;
    }

    private Map<String, Object> buildDynamicRoadmapDto(LearningRoadmap roadmap, User user) {
        Map<String, Object> roadmapDto = new HashMap<>();
        if (roadmap == null) return roadmapDto;
        roadmapDto.put("id", roadmap.getId());
        roadmapDto.put("cefrLevel", roadmap.getCefrLevel());
        roadmapDto.put("toeicEquivalent", roadmap.getToeicEquivalent());
        roadmapDto.put("overallEvaluation", roadmap.getOverallEvaluation());
        roadmapDto.put("isPreset", roadmap.isPreset());
        roadmapDto.put("thumbnailEmoji", roadmap.getThumbnailEmoji());
        roadmapDto.put("difficultyLabel", roadmap.getDifficultyLabel());

        List<Map<String, Object>> modulesDtoList = new ArrayList<>();
        Set<Long> completedLessonIds = new HashSet<>();
        if (user != null) {
            List<UserLessonState> states = userLessonStateRepository.findByUserId(user.getId());
            for (UserLessonState state : states) {
                if ("COMPLETED".equals(state.getStatus())) {
                    completedLessonIds.add(state.getLesson().getId());
                }
            }
        }

        List<LearningModule> modules = new ArrayList<>(roadmap.getModules());
        modules.sort(Comparator.comparing(LearningModule::getOrderIndex));

        boolean foundInProgress = false;
        for (int i = 0; i < modules.size(); i++) {
            LearningModule m = modules.get(i);
            Map<String, Object> modDto = new HashMap<>();
            modDto.put("id", m.getId());
            modDto.put("title", m.getTitle());
            modDto.put("description", m.getDescription());
            modDto.put("orderIndex", m.getOrderIndex());
            modDto.put("category", m.getCategory());

            String status = "LOCKED";
            List<Lesson> lessons = m.getLessons();
            if (lessons.isEmpty()) {
                if (i == 0) {
                    status = "IN_PROGRESS";
                }
            } else {
                boolean allCompleted = true;
                for (Lesson l : lessons) {
                    if (!completedLessonIds.contains(l.getId())) {
                        allCompleted = false;
                        break;
                    }
                }
                if (allCompleted) {
                    status = "COMPLETED";
                } else if (!foundInProgress) {
                    status = "IN_PROGRESS";
                    foundInProgress = true;
                }
            }
            modDto.put("status", status);
            modulesDtoList.add(modDto);
        }
        roadmapDto.put("modules", modulesDtoList);
        return roadmapDto;
    }

    // -----------------------------------------------------------------------
    // Queries (User-facing)
    // -----------------------------------------------------------------------

    /** Lấy tất cả lộ trình Preset trong kho (public) */
    public List<LearningRoadmap> getAllPresetRoadmaps() {
        return roadmapRepository.findByIsPresetTrueOrderByIdAsc();
    }

    /**
     * Chi tiết 1 lộ trình + cờ enrolled của user hiện tại.
     * Trả về thông tin động về trạng thái hoàn thành (status) từng module dựa trên tiến trình của user.
     */
    public Map<String, Object> getPresetRoadmapById(Long id) {
        LearningRoadmap roadmap = roadmapRepository.findById(id)
                .filter(LearningRoadmap::isPreset)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap", id));

        boolean enrolled = false;
        User user = null;
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                enrolled = userRoadmapRepository.existsByUserIdAndRoadmapId(user.getId(), id);
            }
        } catch (Exception ignored) {}

        Map<String, Object> result = new HashMap<>();
        result.put("roadmap",  buildDynamicRoadmapDto(roadmap, user));
        result.put("enrolled", enrolled);
        return result;
    }

    /** Danh sách tất cả lộ trình user đang học (có thể nhiều) */
    public List<Map<String, Object>> getMyEnrollments() {
        User user = getCurrentUser();
        List<UserRoadmap> enrollments = userRoadmapRepository.findByUserId(user.getId());

        List<Map<String, Object>> list = new ArrayList<>();
        for (UserRoadmap ur : enrollments) {
            if (ur.getRoadmap() != null) {
                list.add(toEnrollmentDto(ur));
            }
        }
        return list;
    }

    // -----------------------------------------------------------------------
    // Commands (User-facing)
    // -----------------------------------------------------------------------

    /**
     * Đăng ký học một lộ trình.
     * Quy tắc:
     *   - Nếu chưa enroll lộ trình này → tạo mới UserRoadmap.
     *   - Nếu đã enroll → ném lỗi (không enroll lại).
     *   - Một user có thể enroll nhiều lộ trình khác nhau.
     */
    public Map<String, Object> enroll(Long roadmapId) {
        User user = getCurrentUser();

        LearningRoadmap roadmap = roadmapRepository.findById(roadmapId)
                .filter(LearningRoadmap::isPreset)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap", roadmapId));

        // Chặn enroll lại cùng lộ trình
        if (userRoadmapRepository.existsByUserIdAndRoadmapId(user.getId(), roadmapId)) {
            throw new IllegalStateException("Bạn đã đăng ký lộ trình này rồi.");
        }

        UserRoadmap userRoadmap = UserRoadmap.builder()
                .user(user)
                .roadmap(roadmap)
                .status("IN_PROGRESS")
                .build();
        userRoadmapRepository.save(userRoadmap);

        RewardResult reward = rewardService.noReward(user);

        Map<String, Object> res = new HashMap<>();
        res.put("message",     "Đăng ký lộ trình thành công!");
        res.put("enrollment",  toEnrollmentDto(userRoadmap));
        res.put("xpGained",    reward.getXpGained());
        res.put("coinsGained", reward.getCoinsGained());
        res.put("newXp",       reward.getNewXp());
        res.put("newLevel",    reward.getNewLevel());
        res.put("newCoins",    reward.getNewCoins());
        res.put("leveledUp",   reward.isLeveledUp());
        res.put("newTitle",    reward.getNewTitle());
        return res;
    }

    /**
     * Hủy đăng ký một lộ trình cụ thể.
     * Xóa bản ghi UserRoadmap theo roadmap_id của user hiện tại.
     */
    public void unenroll(Long roadmapId) {
        User user = getCurrentUser();
        UserRoadmap userRoadmap = userRoadmapRepository
                .findByUserIdAndRoadmapId(user.getId(), roadmapId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found for roadmap", roadmapId));

        userRoadmapRepository.delete(userRoadmap);
    }
}
