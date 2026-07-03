package com.englishascension.backend.feature.user.entity;

import com.englishascension.backend.feature.roadmap.entity.Lesson;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_lesson_states")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserLessonState {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "UNLOCKED"; // LOCKED, UNLOCKED, IN_PROGRESS, THEORY_COMPLETED, COMPLETED

    private Integer score;

    @Column(name = "answers_json", columnDefinition = "TEXT")
    private String answersJson;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
