package com.englishascension.backend.feature.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseRequest {
    private String itemType; // OUTFIT, HAIR_STYLE, HAIR_COLOR, TITLE, STREAK_FREEZE
    private String itemId;
    private String itemValue;
    private int cost;
}
