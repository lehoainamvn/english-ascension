package com.englishascension.backend.feature.study.entity;

import com.englishascension.backend.feature.roadmap.entity.LearningModule;
import com.englishascension.backend.feature.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flashcards")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Flashcard {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = true)
    @JsonIgnore
    private LearningModule module;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_content_id", nullable = true)
    @JsonIgnore
    private StudyContent studyContent;

    @Column(nullable = false)        private String word;
    @Column(name = "part_of_speech", length = 50) private String partOfSpeech;
    @Column(length = 100)            private String phonetic;
    @Column(nullable = false, columnDefinition = "TEXT") private String definition;
    @Column(name = "example_sentence",    columnDefinition = "TEXT") private String exampleSentence;
    @Column(name = "example_translation", columnDefinition = "TEXT") private String exampleTranslation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    @JsonIgnore
    private User user;

    @Column(columnDefinition = "TEXT")  private String notes;
    @Column(name = "saved_date", length = 50) private String savedDate;

    @Builder.Default @Column(name = "e_factor")          private Double efactor   = 2.5;
    @Builder.Default @Column(name = "repetition_interval") private Integer interval  = 1;
    @Builder.Default @Column(name = "repetitions")        private Integer repetitions = 0;
}
