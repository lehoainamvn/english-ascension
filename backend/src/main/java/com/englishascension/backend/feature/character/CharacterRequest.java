package com.englishascension.backend.feature.character;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CharacterRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String gender; // MALE, FEMALE, etc.

    private String hairStyle;
    private String hairColor;
    private String faceStyle;
    private String outfitStyle;
}
