package com.englishascension.backend.feature.user.entity;

import com.englishascension.backend.feature.vocabulary.entity.VocabularyWord;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_vocabulary_states")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserVocabularyState {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id", nullable = false)
    private VocabularyWord vocabularyWord;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "COMPLETED";

    @Column(name = "completed_at", nullable = false)
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        completedAt = LocalDateTime.now();
    }
}
