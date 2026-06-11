package com.englishascension.backend.controller;

import com.englishascension.backend.dto.MessageResponse;
import com.englishascension.backend.model.PlayerCharacter;
import com.englishascension.backend.model.User;
import com.englishascension.backend.repository.PlayerCharacterRepository;
import com.englishascension.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/shop")
public class ShopController {

    private final UserRepository userRepository;
    private final PlayerCharacterRepository characterRepository;

    public ShopController(UserRepository userRepository, PlayerCharacterRepository characterRepository) {
        this.userRepository = userRepository;
        this.characterRepository = characterRepository;
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> purchaseItem(@RequestBody PurchaseRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (user.getCoins() < request.getCost()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Không đủ xu để mua vật phẩm này!"));
        }

        PlayerCharacter character = user.getPlayerCharacter();
        if (character == null && !"STREAK_FREEZE".equalsIgnoreCase(request.getItemType())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Vui lòng tạo nhân vật trước khi mua sắm!"));
        }

        // Deduct coins
        user.setCoins(user.getCoins() - request.getCost());
        userRepository.save(user);

        String type = request.getItemType().toUpperCase();
        if (character != null) {
            switch (type) {
                case "OUTFIT":
                    character.setOutfitStyle(request.getItemValue());
                    characterRepository.save(character);
                    break;
                case "HAIR_STYLE":
                    character.setHairStyle(request.getItemValue());
                    characterRepository.save(character);
                    break;
                case "HAIR_COLOR":
                    character.setHairColor(request.getItemValue());
                    characterRepository.save(character);
                    break;
                case "TITLE":
                    character.setTitle(request.getItemValue());
                    characterRepository.save(character);
                    break;
                case "STREAK_FREEZE":
                    // Buying a streak freeze adds +1 to streak to simulate freeze activation
                    user.setStreak(user.getStreak() + 1);
                    userRepository.save(user);
                    break;
                default:
                    return ResponseEntity.badRequest().body(new MessageResponse("Loại vật phẩm không hợp lệ!"));
            }
        } else if ("STREAK_FREEZE".equalsIgnoreCase(type)) {
            user.setStreak(user.getStreak() + 1);
            userRepository.save(user);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Mua hàng thành công!");
        response.put("newCoins", user.getCoins());
        response.put("streak", user.getStreak());
        if (character != null) {
            response.put("outfitStyle", character.getOutfitStyle());
            response.put("hairStyle", character.getHairStyle());
            response.put("hairColor", character.getHairColor());
            response.put("title", character.getTitle());
        }

        return ResponseEntity.ok(response);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PurchaseRequest {
        private String itemType; // OUTFIT, HAIR_STYLE, HAIR_COLOR, TITLE, STREAK_FREEZE
        private String itemId;
        private String itemValue;
        private int cost;
    }
}
