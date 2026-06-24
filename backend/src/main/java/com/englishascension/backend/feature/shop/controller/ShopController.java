package com.englishascension.backend.feature.shop.controller;

import com.englishascension.backend.feature.auth.dto.MessageResponse;
import com.englishascension.backend.feature.shop.dto.PurchaseRequest;
import com.englishascension.backend.feature.shop.service.ShopService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/shop")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> purchaseItem(@RequestBody PurchaseRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            Map<String, Object> response = shopService.purchaseItem(request, email);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
