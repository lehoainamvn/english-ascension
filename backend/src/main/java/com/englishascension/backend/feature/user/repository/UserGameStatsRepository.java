package com.englishascension.backend.feature.user.repository;

import com.englishascension.backend.feature.user.entity.UserGameStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserGameStatsRepository extends JpaRepository<UserGameStats, Long> {
}
