package com.englishascension.backend.model;

import jakarta.persistence.*;
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

    // For unified mapping
    @Column(name = "source_type", length = 50)
    private String sourceType; // PLACEMENT_TEST, ROADMAP_QUIZ, GRAMMAR, LISTENING, READING, TOEIC_EXAM

    @Column(name = "parent_id")
    private Long parentId; // Links to learning_modules.id or study_contents.id

    @Column(name = "question_number")
    private Integer questionNumber; // Sequencing order index

    @Column(name = "type", nullable = true, length = 50)
    private String type; // VOCABULARY, GRAMMAR, LISTENING, READING, or MULTIPLE_CHOICE, FILL_IN_BLANK, WORD_MATCHING

    @Column(nullable = true)
    private String difficulty; // e.g. A1, A2, B1, B2, C1, C2

    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(name = "audio_url", length = 555)
    private String audioUrl;

    @Column(name = "image_url", length = 555)
    private String imageUrl;

    @Column(name = "option_a")
    private String optionA;

    @Column(name = "option_b")
    private String optionB;

    @Column(name = "option_c")
    private String optionC;

    @Column(name = "option_d")
    private String optionD;

    @Column(name = "correct_option", length = 50)
    private String correctOption; // A, B, C, D

    @Column(name = "correct_answer")
    private String correctAnswer; // For non-multiple-choice or matching questions

    @Column(columnDefinition = "TEXT")
    private String explanation;
}
