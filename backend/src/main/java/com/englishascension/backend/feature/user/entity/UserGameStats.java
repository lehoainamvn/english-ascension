package com.englishascension.backend.feature.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_game_stats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserGameStats {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Builder.Default
    @Column(nullable = false)
    private int streak = 0;

    @Builder.Default
    @Column(nullable = false)
    private int exp = 0;

    @Builder.Default
    @Column(nullable = false)
    private int level = 1;
}
