package com.englishascension.backend.controller;

import com.englishascension.backend.dto.CharacterRequest;
import com.englishascension.backend.dto.MessageResponse;
import com.englishascension.backend.model.PlayerCharacter;
import com.englishascension.backend.model.User;
import com.englishascension.backend.repository.PlayerCharacterRepository;
import com.englishascension.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/characters")
public class PlayerCharacterController {

    private final UserRepository userRepository;
    private final PlayerCharacterRepository characterRepository;

    public PlayerCharacterController(UserRepository userRepository, PlayerCharacterRepository characterRepository) {
        this.userRepository = userRepository;
        this.characterRepository = characterRepository;
    }

    @PostMapping
    public ResponseEntity<?> saveCharacter(@Valid @RequestBody CharacterRequest characterRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        PlayerCharacter character = user.getPlayerCharacter();
        if (character == null) {
            character = PlayerCharacter.builder()
                    .user(user)
                    .name(characterRequest.getName())
                    .gender(characterRequest.getGender())
                    .hairStyle(characterRequest.getHairStyle())
                    .hairColor(characterRequest.getHairColor())
                    .faceStyle(characterRequest.getFaceStyle())
                    .outfitStyle(characterRequest.getOutfitStyle())
                    .build();
            user.setPlayerCharacter(character);
        } else {
            character.setName(characterRequest.getName());
            character.setGender(characterRequest.getGender());
            character.setHairStyle(characterRequest.getHairStyle());
            character.setHairColor(characterRequest.getHairColor());
            character.setFaceStyle(characterRequest.getFaceStyle());
            character.setOutfitStyle(characterRequest.getOutfitStyle());
        }

        characterRepository.save(character);
        return ResponseEntity.ok(new MessageResponse("Character saved successfully!"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyCharacter() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        PlayerCharacter character = user.getPlayerCharacter();
        if (character == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(character);
    }
}
