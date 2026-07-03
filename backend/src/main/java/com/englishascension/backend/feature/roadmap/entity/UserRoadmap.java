package com.englishascension.backend.feature.roadmap.entity;

import com.englishascension.backend.feature.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Đại diện cho một lộ trình mà người dùng đã đăng ký.
 * Quan hệ: Một user có thể đăng ký nhiều lộ trình khác nhau (1-N).
 * Ràng buộc: Mỗi cặp (user_id, roadmap_id) là duy nhất — không thể enroll cùng một lộ trình 2 lần.
 */
@Entity
@Table(name = "user_roadmaps",
       uniqueConstraints = @UniqueConstraint(
           name = "uq_user_roadmap",
           columnNames = {"user_id", "roadmap_id"}
       ))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserRoadmap {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Quan hệ N-1: nhiều enrollment → 1 user */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Lộ trình được đăng ký (có thể NULL nếu roadmap bị xóa) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_id", nullable = true)
    private LearningRoadmap roadmap;

    /**
     * Trạng thái học lộ trình: IN_PROGRESS | COMPLETED | PAUSED
     */
    @Builder.Default
    @Column(nullable = false, length = 50)
    private String status = "IN_PROGRESS";

    /** Điểm Placement Test dẫn đến enrollment này (nullable) */
    @Column(name = "placement_score")
    private Integer placementScore;

    /** Cấp độ được AI gợi ý dựa trên Placement Test */
    @Column(name = "recommended_level", length = 50)
    private String recommendedLevel;

    /** Thời điểm làm Placement Test */
    @Column(name = "tested_at")
    private LocalDateTime testedAt;

    /** JSON AI gợi ý thứ tự bài học ưu tiên trong roadmap này */
    @Column(name = "personalized_lessons_json", columnDefinition = "TEXT")
    private String personalizedLessonsJson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
