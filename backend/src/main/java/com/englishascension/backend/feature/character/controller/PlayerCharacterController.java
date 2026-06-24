package com.englishascension.backend.feature.character.controller;

import com.englishascension.backend.feature.character.dto.CharacterRequest;
import com.englishascension.backend.feature.character.service.CharacterService;
import com.englishascension.backend.feature.auth.dto.MessageResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/characters")
public class PlayerCharacterController {

    private final CharacterService characterService;

    public PlayerCharacterController(CharacterService characterService) {
        this.characterService = characterService;
    }

    @PostMapping
    public ResponseEntity<?> saveCharacter(@Valid @RequestBody CharacterRequest characterRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        characterService.saveCharacter(characterRequest, email);
        return ResponseEntity.ok(new MessageResponse("Character saved successfully!"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyCharacter() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Map<String, Object> character = characterService.getMyCharacter(email);

        if (character == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(character);
    }
}
