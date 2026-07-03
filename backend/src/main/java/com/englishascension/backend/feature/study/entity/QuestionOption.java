package com.englishascension.backend.feature.study.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "question_options")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QuestionOption {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnore
    private Question question;

    @Column(name = "option_key", nullable = false, length = 50)
    private String optionKey; // e.g. A, B, C, D

    @Column(name = "option_value", nullable = false, columnDefinition = "TEXT")
    private String optionValue; // option content

    @Column(name = "is_correct", nullable = false)
    @Builder.Default
    private boolean correct = false;
}
