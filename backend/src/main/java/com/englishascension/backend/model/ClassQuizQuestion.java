package com.englishascension.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "class_quiz_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassQuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_quiz_id", nullable = false)
    private ClassQuiz classQuiz;

    @Column(name = "question_number")
    private Integer questionNumber;

    // MULTIPLE_CHOICE or FILL_IN_BLANK
    @Column(nullable = false, length = 50)
    private String type;

    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(name = "option_a")
    private String optionA;

    @Column(name = "option_b")
    private String optionB;

    @Column(name = "option_c")
    private String optionC;

    @Column(name = "option_d")
    private String optionD;

    // For MULTIPLE_CHOICE: "A", "B", "C", "D"
    // For FILL_IN_BLANK: the correct word/phrase
    @Column(name = "correct_answer", length = 255)
    private String correctAnswer;

    @Column(columnDefinition = "TEXT")
    private String explanation;
}
