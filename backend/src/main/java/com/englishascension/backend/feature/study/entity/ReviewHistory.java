package com.englishascension.backend.feature.study.entity;

import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.vocabulary.entity.PersonalWord;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReviewHistory {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_word_id", nullable = false)
    private PersonalWord personalWord;

    @Builder.Default
    @Column(name = "e_factor", nullable = false)
    private Double efactor = 2.5;

    @Builder.Default
    @Column(name = "repetition_interval", nullable = false)
    private Integer interval = 1;

    @Builder.Default
    @Column(nullable = false)
    private Integer repetitions = 0;

    @Column(name = "next_review_date", nullable = false)
    private LocalDateTime nextReviewDate;

    @Column(name = "last_reviewed_at")
    private LocalDateTime lastReviewedAt;
}
