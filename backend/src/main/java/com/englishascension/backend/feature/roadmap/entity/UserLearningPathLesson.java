package com.englishascension.backend.feature.roadmap.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_learning_path_lessons")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserLearningPathLesson {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_learning_path_id", nullable = false)
    @JsonIgnore
    private UserLearningPath learningPath;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(nullable = false, length = 50)
    private String status; // LOCKED, IN_PROGRESS, COMPLETED
}
