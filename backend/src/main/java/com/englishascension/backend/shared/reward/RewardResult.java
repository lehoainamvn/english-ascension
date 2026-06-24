package com.englishascension.backend.shared.reward;

import lombok.Builder;
import lombok.Getter;

/**
 * Unified reward result DTO returned after any learning activity
 * that grants XP/coins to the user.
 */
@Getter
@Builder
public class RewardResult {

    private final int xpGained;
    private final int coinsGained;
    private final int newXp;
    private final int newLevel;
    private final int newCoins;
    private final boolean leveledUp;
    private final int previousLevel;
    private final String newTitle;
}
