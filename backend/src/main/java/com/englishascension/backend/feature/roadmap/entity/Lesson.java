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
    private String id; // e.g. "grammar_to_be", "vocab_basic", etc.

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private LessonType type; // VOCABULARY, GRAMMAR, LISTENING, READING

    @Column(nullable = false, length = 50)
    private String level; // A1, A2, B1, B2, C1

    @Column(name = "difficulty_score")
    private Double difficultyScore;

    private String topic;

    @Column(name = "content_id")
    private Long contentId; // references study_contents.id or learning_modules.id

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
