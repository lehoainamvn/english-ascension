package com.englishascension.backend.feature.shop.service;

import com.englishascension.backend.feature.shop.dto.PurchaseRequest;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class ShopService {

    private final UserRepository userRepository;

    public ShopService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, Object> purchaseItem(PurchaseRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (user.getCoins() < request.getCost()) {
            throw new IllegalArgumentException("Không đủ xu để mua vật phẩm này!");
        }

        boolean hasCharacter = user.getCharacterName() != null;
        if (!hasCharacter && !"STREAK_FREEZE".equalsIgnoreCase(request.getItemType())) {
            throw new IllegalArgumentException("Vui lòng tạo nhân vật trước khi mua sắm!");
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
                    throw new IllegalArgumentException("Loại vật phẩm không hợp lệ!");
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

        return response;
    }
}
