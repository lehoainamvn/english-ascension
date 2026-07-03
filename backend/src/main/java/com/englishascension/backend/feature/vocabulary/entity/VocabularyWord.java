package com.englishascension.backend.feature.vocabulary.entity;

import com.englishascension.backend.feature.roadmap.entity.Lesson;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vocabulary_words")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VocabularyWord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false)
    private String word;

    @Column(name = "part_of_speech", length = 50)
    private String partOfSpeech;

    @Column(length = 100)
    private String phonetic;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String definition;

    @Column(name = "example_sentence", columnDefinition = "TEXT")
    private String exampleSentence;

    @Column(name = "example_translation", columnDefinition = "TEXT")
    private String exampleTranslation;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
