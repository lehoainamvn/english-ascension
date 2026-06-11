package com.englishascension.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_roadmap_enrollments",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "roadmap_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserRoadmapEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private LearningRoadmap roadmap;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "IN_PROGRESS";

    @Column(name = "enrolled_at", nullable = false, updatable = false)
    private LocalDateTime enrolledAt;

    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;

    @PrePersist
    protected void onCreate() {
        enrolledAt = LocalDateTime.now();
        lastAccessedAt = LocalDateTime.now();
    }
}
