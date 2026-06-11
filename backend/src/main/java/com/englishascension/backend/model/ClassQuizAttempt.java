package com.englishascension.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "class_quiz_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassQuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_quiz_id", nullable = false)
    private ClassQuiz classQuiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private int score;

    @Column(name = "total_questions", nullable = false)
    private int totalQuestions;

    // JSON text storing user's submitted answers
    @Column(name = "answers_json", columnDefinition = "TEXT")
    private String answersJson;

    @Column(name = "completed_at", nullable = false, updatable = false)
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        completedAt = LocalDateTime.now();
    }
}
