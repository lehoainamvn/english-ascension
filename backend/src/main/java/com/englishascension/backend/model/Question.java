package com.englishascension.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;

    @NotBlank
    @Column(nullable = false)
    private String difficulty; // e.g. A1, A2, B1, B2, C1, C2

    @NotBlank
    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(name = "audio_url", length = 555)
    private String audioUrl;

    @Column(name = "image_url", length = 555)
    private String imageUrl;

    @NotBlank
    @Column(name = "option_a", nullable = false)
    private String optionA;

    @NotBlank
    @Column(name = "option_b", nullable = false)
    private String optionB;

    @NotBlank
    @Column(name = "option_c", nullable = false)
    private String optionC;

    @NotBlank
    @Column(name = "option_d", nullable = false)
    private String optionD;

    @NotBlank
    @Column(name = "correct_option", length = 10, nullable = false)
    private String correctOption; // A, B, C, D

    @Column(columnDefinition = "TEXT")
    private String explanation;
}
