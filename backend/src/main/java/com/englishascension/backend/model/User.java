package com.englishascension.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @Builder.Default
    @Column(nullable = false)
    private int streak = 0;

    @Builder.Default
    @Column(nullable = false)
    private int coins = 0;

    @Builder.Default
    @Column(nullable = false)
    private int exp = 0;

    @Builder.Default
    @Column(nullable = false)
    private int level = 1;

    @Column(name = "character_name")
    private String characterName;

    @Column(name = "character_gender")
    private String characterGender;

    @Column(name = "character_hair_style")
    private String characterHairStyle;

    @Column(name = "character_hair_color")
    private String characterHairColor;

    @Column(name = "character_face_style")
    private String characterFaceStyle;

    @Column(name = "character_outfit_style")
    private String characterOutfitStyle;

    @Builder.Default
    @Column(name = "character_title")
    private String characterTitle = "Novice";

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private LearningRoadmap learningRoadmap;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (role == null) {
            role = Role.ROLE_USER;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
