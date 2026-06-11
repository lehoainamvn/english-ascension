package com.englishascension.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_contents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class StudyContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String type; // GRAMMAR, LISTENING, READING, EXAM

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 100)
    private String category; // e.g. "600 TỪ VỰNG TOEIC", "ETS 2024", "Danh từ"

    @Column(name = "body_text", columnDefinition = "TEXT")
    private String bodyText; // Stores grammar theory, reading passages, etc.

    @Column(name = "media_url", columnDefinition = "TEXT")
    private String mediaUrl; // Stores audio files, image URLs, or JSON data

    @Column(name = "description", columnDefinition = "TEXT")
    private String description; // Short overview description or translation

    @Column(name = "duration")
    private Integer duration; // For exams (minutes)

    @Column(name = "order_index")
    private Integer orderIndex; // Sorting key

    @Column(name = "questions_count")
    private Integer questionsCount; // Helper field for summary stats

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
