package com.englishascension.backend.feature.roadmap.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "lessons")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug; // e.g. "grammar-to-be", "vocab-basic", etc.

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "lesson_type", nullable = false, length = 50)
    private LessonType type; // VOCABULARY, GRAMMAR, LISTENING, READING

    @Column(nullable = false, length = 50)
    private String level; // A1, A2, B1, B2, C1

    @Column(name = "difficulty_score")
    private Double difficultyScore;

    private String topic;

    @Column(name = "order_index", nullable = false)
    @Builder.Default
    private Integer orderIndex = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id")
    @JsonIgnore
    private LearningModule module;

    @OneToOne(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private LessonContent lessonContent;

    @ManyToMany
    @JoinTable(
        name = "lesson_prerequisites",
        joinColumns = @JoinColumn(name = "lesson_id"),
        inverseJoinColumns = @JoinColumn(name = "prerequisite_id")
    )
    @Builder.Default
    @JsonIgnore
    private Set<Lesson> prerequisites = new HashSet<>();
}
