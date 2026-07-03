package com.englishascension.backend.feature.roadmap.repository;

import com.englishascension.backend.feature.roadmap.entity.UserRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoadmapRepository extends JpaRepository<UserRoadmap, Long> {

    /** Tất cả lộ trình một user đã đăng ký */
    List<UserRoadmap> findByUserId(Long userId);

    /** Tìm enrollment cụ thể theo user + roadmap (để kiểm tra đã đăng ký chưa) */
    Optional<UserRoadmap> findByUserIdAndRoadmapId(Long userId, Long roadmapId);

    /** Kiểm tra đã đăng ký chưa */
    boolean existsByUserIdAndRoadmapId(Long userId, Long roadmapId);

    /** Tìm theo email (dùng nội bộ) */
    List<UserRoadmap> findByUserEmail(String email);
}
