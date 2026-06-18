package com.englishascension.backend.feature.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long userId;
    private String email;
    private String role;
    private boolean hasCharacter;

    public AuthResponse(String token, Long userId, String email, String role, boolean hasCharacter) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.hasCharacter = hasCharacter;
    }
}
