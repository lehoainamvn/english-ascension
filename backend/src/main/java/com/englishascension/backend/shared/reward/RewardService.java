package com.englishascension.backend.shared.reward;

import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.entity.UserGameStats;
import com.englishascension.backend.feature.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RewardService {

    private final UserRepository userRepository;

    public RewardService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public RewardResult addRewards(User user, int xpGained, int coinsGained) {
        UserGameStats stats = user.getUserGameStats();
        if (stats == null) {
            stats = UserGameStats.builder()
                    .user(user)
                    .streak(0)
                    .exp(0)
                    .level(1)
                    .build();
            user.setUserGameStats(stats);
        }

        int previousLevel = stats.getLevel();
        int currentExp   = stats.getExp() + xpGained;
        int currentLevel = stats.getLevel();

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

        stats.setExp(currentExp);
        stats.setLevel(currentLevel);
        userRepository.save(user);

        return RewardResult.builder()
                .xpGained(xpGained)
                .coinsGained(0)
                .newXp(currentExp)
                .newLevel(currentLevel)
                .newCoins(0)
                .leveledUp(leveledUp)
                .previousLevel(previousLevel)
                .newTitle(null)
                .build();
    }

    public RewardResult noReward(User user) {
        UserGameStats stats = user.getUserGameStats();
        int xp = stats != null ? stats.getExp() : 0;
        int lvl = stats != null ? stats.getLevel() : 1;

        return RewardResult.builder()
                .xpGained(0)
                .coinsGained(0)
                .newXp(xp)
                .newLevel(lvl)
                .newCoins(0)
                .leveledUp(false)
                .previousLevel(lvl)
                .newTitle(null)
                .build();
    }
}
