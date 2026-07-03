package com.englishascension.backend.feature.roadmap.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "modules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class LearningModule {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_id", nullable = true)
    @JsonIgnore
    private LearningRoadmap roadmap;

    @Column(nullable = false)         private String title;
    @Column(columnDefinition = "TEXT") private String description;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(length = 100)
    private String category;

    @Builder.Default
    @Column(nullable = false, length = 50)
    private String status = "LOCKED";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default @OrderBy("orderIndex ASC")
    private List<Lesson> lessons = new ArrayList<>();

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
}
