package com.englishascension.backend.feature.character;

import com.englishascension.backend.feature.character.CharacterRequest;
import com.englishascension.backend.feature.auth.MessageResponse;
import com.englishascension.backend.feature.user.User;
import com.englishascension.backend.feature.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/characters")
public class PlayerCharacterController {

    private final UserRepository userRepository;

    public PlayerCharacterController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> saveCharacter(@Valid @RequestBody CharacterRequest characterRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        user.setCharacterName(characterRequest.getName());
        user.setCharacterGender(characterRequest.getGender());
        user.setCharacterHairStyle(characterRequest.getHairStyle());
        user.setCharacterHairColor(characterRequest.getHairColor());
        user.setCharacterFaceStyle(characterRequest.getFaceStyle());
        user.setCharacterOutfitStyle(characterRequest.getOutfitStyle());
        if (user.getCharacterTitle() == null) {
            user.setCharacterTitle("Novice");
        }

        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Character saved successfully!"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyCharacter() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (user.getCharacterName() == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> character = new HashMap<>();
        character.put("id", user.getId());
        character.put("name", user.getCharacterName());
        character.put("gender", user.getCharacterGender());
        character.put("hairStyle", user.getCharacterHairStyle());
        character.put("hairColor", user.getCharacterHairColor());
        character.put("faceStyle", user.getCharacterFaceStyle());
        character.put("outfitStyle", user.getCharacterOutfitStyle());
        character.put("title", user.getCharacterTitle());
        character.put("level", user.getLevel());

        return ResponseEntity.ok(character);
    }
}
