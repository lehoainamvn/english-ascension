package com.englishascension.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "player_characters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerCharacter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String gender; // MALE, FEMALE, etc.

    @Column(name = "hair_style")
    private String hairStyle;

    @Column(name = "hair_color")
    private String hairColor;

    @Column(name = "face_style")
    private String faceStyle;

    @Column(name = "outfit_style")
    private String outfitStyle;

    @Builder.Default
    @Column(nullable = false)
    private String title = "Novice"; // Mặc định là Novice
}
