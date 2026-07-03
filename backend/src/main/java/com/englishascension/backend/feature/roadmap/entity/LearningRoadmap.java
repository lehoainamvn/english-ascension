package com.englishascension.backend.feature.roadmap.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roadmaps")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class LearningRoadmap {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cefr_level", nullable = false, length = 50)
    private String cefrLevel;

    @Column(name = "toeic_equivalent", length = 100)
    private String toeicEquivalent;

    @Column(name = "overall_evaluation", columnDefinition = "TEXT")
    private String overallEvaluation;

    @JsonProperty("isPreset")
    @Column(name = "is_preset", nullable = false)
    @Builder.Default
    private boolean isPreset = true;

    @Column(name = "thumbnail_emoji", length = 50) 
    private String thumbnailEmoji;

    @Column(name = "difficulty_label", length = 50) 
    private String difficultyLabel;

    @OneToMany(mappedBy = "roadmap", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default @OrderBy("orderIndex ASC")
    private List<LearningModule> modules = new ArrayList<>();
}
