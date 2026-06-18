package com.englishascension.backend.feature.shop;

import com.englishascension.backend.feature.auth.MessageResponse;
import com.englishascension.backend.feature.user.User;
import com.englishascension.backend.feature.user.UserRepository;
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

    public ShopController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> purchaseItem(@RequestBody PurchaseRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (user.getCoins() < request.getCost()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Không đủ xu để mua vật phẩm này!"));
        }

        boolean hasCharacter = user.getCharacterName() != null;
        if (!hasCharacter && !"STREAK_FREEZE".equalsIgnoreCase(request.getItemType())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Vui lòng tạo nhân vật trước khi mua sắm!"));
        }

        // Deduct coins
        user.setCoins(user.getCoins() - request.getCost());

        String type = request.getItemType().toUpperCase();
        if (hasCharacter) {
            switch (type) {
                case "OUTFIT":
                    user.setCharacterOutfitStyle(request.getItemValue());
                    break;
                case "HAIR_STYLE":
                    user.setCharacterHairStyle(request.getItemValue());
                    break;
                case "HAIR_COLOR":
                    user.setCharacterHairColor(request.getItemValue());
                    break;
                case "TITLE":
                    user.setCharacterTitle(request.getItemValue());
                    break;
                case "STREAK_FREEZE":
                    user.setStreak(user.getStreak() + 1);
                    break;
                default:
                    return ResponseEntity.badRequest().body(new MessageResponse("Loại vật phẩm không hợp lệ!"));
            }
        } else if ("STREAK_FREEZE".equalsIgnoreCase(type)) {
            user.setStreak(user.getStreak() + 1);
        }

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Mua hàng thành công!");
        response.put("newCoins", user.getCoins());
        response.put("streak", user.getStreak());
        if (hasCharacter) {
            response.put("outfitStyle", user.getCharacterOutfitStyle());
            response.put("hairStyle", user.getCharacterHairStyle());
            response.put("hairColor", user.getCharacterHairColor());
            response.put("title", user.getCharacterTitle());
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
