package com.englishascension.backend.feature.user.controller;

import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.entity.UserGameStats;
import com.englishascension.backend.feature.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/characters")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyCharacter() {
        User user = getCurrentUser();
        String name = user.getEmail().split("@")[0];
        
        Map<String, String> preset = getPreset(user.getAvatar());
        
        int level = user.getUserGameStats() != null ? user.getUserGameStats().getLevel() : 1;
        String title = calculateTitle(level);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", name);
        response.put("gender", preset.get("gender"));
        response.put("hairStyle", preset.get("hairStyle"));
        response.put("hairColor", preset.get("hairColor"));
        response.put("faceStyle", preset.get("faceStyle"));
        response.put("outfitStyle", preset.get("outfitStyle"));
        response.put("title", title);
        response.put("level", level);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> saveCharacter(@RequestBody Map<String, Object> body) {
        User user = getCurrentUser();
        
        String gender = String.valueOf(body.getOrDefault("gender", "MALE"));
        String outfit = String.valueOf(body.getOrDefault("outfitStyle", "WARRIOR"));
        
        String avatar = "warrior_male";
        if ("FEMALE".equalsIgnoreCase(gender) && "MAGE".equalsIgnoreCase(outfit)) {
            avatar = "mage_female";
        } else if ("MALE".equalsIgnoreCase(gender) && "ROGUE".equalsIgnoreCase(outfit)) {
            avatar = "rogue_male";
        } else if ("FEMALE".equalsIgnoreCase(gender) && "CASUAL".equalsIgnoreCase(outfit)) {
            avatar = "casual_female";
        }
        
        user.setAvatar(avatar);
        userRepository.save(user);
        
        return getMyCharacter();
    }

    private Map<String, String> getPreset(String avatar) {
        if ("mage_female".equalsIgnoreCase(avatar)) {
            return Map.of("gender", "FEMALE", "hairStyle", "LONG", "hairColor", "BLONDE", "faceStyle", "SMILEY", "outfitStyle", "MAGE");
        } else if ("rogue_male".equalsIgnoreCase(avatar)) {
            return Map.of("gender", "MALE", "hairStyle", "SHORT", "hairColor", "BLACK", "faceStyle", "SERIOUS", "outfitStyle", "ROGUE");
        } else if ("casual_female".equalsIgnoreCase(avatar)) {
            return Map.of("gender", "FEMALE", "hairStyle", "CURLY", "hairColor", "RED", "faceStyle", "EXCITED", "outfitStyle", "CASUAL");
        } else {
            return Map.of("gender", "MALE", "hairStyle", "SPIKY", "hairColor", "BROWN", "faceStyle", "COOL", "outfitStyle", "WARRIOR");
        }
    }

    private String calculateTitle(int level) {
        if (level >= 100) return "Language Legend";
        if (level >= 80) return "Grand Sage";
        if (level >= 60) return "Master";
        if (level >= 40) return "Knight";
        if (level >= 20) return "Scholar";
        if (level >= 10) return "Student";
        if (level >= 5) return "Adventurer";
        return "Novice";
    }
}
