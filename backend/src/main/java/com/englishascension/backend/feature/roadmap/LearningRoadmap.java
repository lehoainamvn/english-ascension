package com.englishascension.backend.feature.roadmap;

import com.englishascension.backend.feature.user.User;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "learning_roadmaps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class LearningRoadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    @JsonIgnore
    private User user;

    @Column(name = "cefr_level", nullable = false, length = 50)
    private String cefrLevel;

    @Column(name = "toeic_equivalent", length = 100)
    private String toeicEquivalent;

    @Column(name = "overall_evaluation", columnDefinition = "TEXT")
    private String overallEvaluation;

    @JsonProperty("isPreset")
    @Column(name = "is_preset", nullable = false)
    @Builder.Default
    private boolean isPreset = false;

    @Column(name = "thumbnail_emoji", length = 50)
    private String thumbnailEmoji;

    @Column(name = "difficulty_label", length = 50)
    private String difficultyLabel;

    @Column(name = "modules_count")
    private Integer modulesCount;

    @OneToMany(mappedBy = "roadmap", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    @OrderBy("orderIndex ASC")
    private List<LearningModule> modules = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
