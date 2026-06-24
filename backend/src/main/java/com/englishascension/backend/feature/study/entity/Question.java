package com.englishascension.backend.feature.study.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Question {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_type", length = 50) private String sourceType;
    @Column(name = "parent_id")   private Long parentId;
    @Column(name = "question_number") private Integer questionNumber;
    @Column(name = "type", nullable = true, length = 50) private String type;
    @Column(nullable = true) private String difficulty;
    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false) private String questionText;
    @Column(name = "audio_url", length = 555) private String audioUrl;
    @Column(name = "image_url", length = 555) private String imageUrl;
    @Column(name = "option_a") private String optionA;
    @Column(name = "option_b") private String optionB;
    @Column(name = "option_c") private String optionC;
    @Column(name = "option_d") private String optionD;
    @Column(name = "correct_option", length = 50) private String correctOption;
    @Column(name = "correct_answer")  private String correctAnswer;
    @Column(columnDefinition = "TEXT") private String explanation;
}
