package com.englishascension.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_words")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserWord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String word;

    @Column(name = "part_of_speech", length = 50)
    private String partOfSpeech;

    @Column(length = 100)
    private String phonetic;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String definition;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "saved_date", length = 50)
    private String savedDate;

    // Spaced repetition metrics
    @Builder.Default
    @Column(name = "e_factor")
    private Double efactor = 2.5;

    @Builder.Default
    @Column(name = "repetition_interval")
    private Integer interval = 1;

    @Builder.Default
    @Column(name = "repetitions")
    private Integer repetitions = 0;
}
