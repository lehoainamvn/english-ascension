package com.englishascension.backend.feature.vocabulary;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vocabulary_words")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VocabularyWord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cefr_level", nullable = false, length = 50)
    private String cefrLevel;

    @Column(name = "module_index", nullable = false)
    private Integer moduleIndex;

    @Column(nullable = false, length = 100)
    private String word;

    @Column(name = "part_of_speech", length = 50)
    private String partOfSpeech;

    @Column(length = 100)
    private String phonetic;

    @Column(columnDefinition = "TEXT")
    private String definition;

    @Column(name = "example_sentence", columnDefinition = "TEXT")
    private String exampleSentence;

    @Column(name = "example_translation", columnDefinition = "TEXT")
    private String exampleTranslation;
}
