package com.englishascension.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "resource_type", nullable = false, length = 50)
    private String resourceType; // MODULE, STUDY_CONTENT, QUESTION

    @Column(name = "resource_id", nullable = false)
    private Long resourceId; // Point to module id, study content id, or question id

    @Column(name = "is_completed", nullable = false)
    private boolean completed;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "score")
    private Integer score; // Optional score (for quizzes, exams, etc.)
}
