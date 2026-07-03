package com.englishascension.backend.feature.study.entity;

import com.englishascension.backend.feature.roadmap.entity.Lesson;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Question {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonIgnore
    private Lesson lesson;

    @Column(name = "source_type", length = 50)
    private String sourceType; // e.g. PLACEMENT_TEST, ROADMAP_QUIZ, etc.

    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(name = "image_url", length = 555)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(length = 50)
    private String difficulty;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<QuestionOption> options = new ArrayList<>();
}
