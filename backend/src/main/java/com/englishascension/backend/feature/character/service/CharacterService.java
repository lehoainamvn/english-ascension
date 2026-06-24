package com.englishascension.backend.feature.character.service;

import com.englishascension.backend.feature.character.dto.CharacterRequest;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class CharacterService {

    private final UserRepository userRepository;

    public CharacterService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void saveCharacter(CharacterRequest characterRequest, String email) {
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
    }

    public Map<String, Object> getMyCharacter(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (user.getCharacterName() == null) {
            return null;
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

        return character;
    }
}
