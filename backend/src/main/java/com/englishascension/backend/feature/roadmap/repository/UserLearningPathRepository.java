package com.englishascension.backend.feature.roadmap.repository;

import com.englishascension.backend.feature.roadmap.entity.UserLearningPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserLearningPathRepository extends JpaRepository<UserLearningPath, Long> {
    Optional<UserLearningPath> findByUserId(Long userId);
}
