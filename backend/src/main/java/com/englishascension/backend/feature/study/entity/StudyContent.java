package com.englishascension.backend.feature.study.entity;

import com.englishascension.backend.feature.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "study_contents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class StudyContent {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)  private String type;
    @Column(nullable = false)               private String title;
    @Column(nullable = false, length = 100) private String category;
    @Column(name = "body_text",   columnDefinition = "TEXT") private String bodyText;
    @Column(name = "media_url",   columnDefinition = "TEXT") private String mediaUrl;
    @Column(name = "description", columnDefinition = "TEXT") private String description;
    @Column(name = "duration")   private Integer duration;
    @Column(name = "order_index") private Integer orderIndex;
    @Column(name = "questions_count") private Integer questionsCount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "studyContent", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Flashcard> flashcards = new ArrayList<>();

    @Transient @Builder.Default
    private List<Question> quizQuestions = new ArrayList<>();

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
}
