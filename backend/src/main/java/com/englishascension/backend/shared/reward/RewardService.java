package com.englishascension.backend.shared.reward;

import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.repository.UserRepository;
import org.springframework.stereotype.Service;

/**
 * Centralized service for handling XP/coin rewards and level-up logic.
 * <p>
 * Previously, every study controller had a copy of addRewardsToUser() and
 * calculateTitle(). This service eliminates that duplication.
 * </p>
 */
@Service
public class RewardService {

    private final UserRepository userRepository;

    public RewardService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Adds XP and coins to the user, handles level-up logic, persists the
     * updated user, and returns a {@link RewardResult} describing the outcome.
     *
     * @param user       the user receiving the reward (will be mutated and saved)
     * @param xpGained   XP to add
     * @param coinsGained coins to add
     * @return immutable {@link RewardResult}
     */
    public RewardResult addRewards(User user, int xpGained, int coinsGained) {
        int previousLevel = user.getLevel();

        int currentExp   = user.getExp()   + xpGained;
        int currentLevel = user.getLevel();
        int currentCoins = user.getCoins() + coinsGained;

        boolean leveledUp = false;
        while (true) {
            int expNeeded = currentLevel * 100;
            if (currentExp >= expNeeded) {
                currentExp -= expNeeded;
                currentLevel++;
                leveledUp = true;
            } else {
                break;
            }
        }

        user.setExp(currentExp);
        user.setLevel(currentLevel);
        user.setCoins(currentCoins);

        String newTitle = user.getCharacterTitle() != null ? user.getCharacterTitle() : "Novice";
        if (leveledUp) {
            newTitle = calculateTitle(currentLevel);
            user.setCharacterTitle(newTitle);
        }

        userRepository.save(user);

        return RewardResult.builder()
                .xpGained(xpGained)
                .coinsGained(coinsGained)
                .newXp(currentExp)
                .newLevel(currentLevel)
                .newCoins(currentCoins)
                .leveledUp(leveledUp)
                .previousLevel(previousLevel)
                .newTitle(newTitle)
                .build();
    }

    /**
     * Builds a {@link RewardResult} for scenarios where the user already
     * completed the activity (xpGained = 0, coinsGained = 0) without
     * saving to the database.
     */
    public RewardResult noReward(User user) {
        return RewardResult.builder()
                .xpGained(0)
                .coinsGained(0)
                .newXp(user.getExp())
                .newLevel(user.getLevel())
                .newCoins(user.getCoins())
                .leveledUp(false)
                .previousLevel(user.getLevel())
                .newTitle(user.getCharacterTitle() != null ? user.getCharacterTitle() : "Novice")
                .build();
    }

    // -------------------------------------------------------------------------
    // Title calculation (single source of truth)
    // -------------------------------------------------------------------------

    public String calculateTitle(int level) {
        if (level >= 100) return "Language Legend";
        if (level >= 80)  return "Grand Sage";
        if (level >= 60)  return "Master";
        if (level >= 40)  return "Knight";
        if (level >= 20)  return "Scholar";
        if (level >= 10)  return "Student";
        if (level >= 5)   return "Adventurer";
        return "Novice";
    }
}
