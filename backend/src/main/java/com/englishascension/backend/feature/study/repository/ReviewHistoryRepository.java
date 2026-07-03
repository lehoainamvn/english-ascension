package com.englishascension.backend.feature.study.repository;

import com.englishascension.backend.feature.study.entity.ReviewHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewHistoryRepository extends JpaRepository<ReviewHistory, Long> {
    List<ReviewHistory> findByUserId(Long userId);
    Optional<ReviewHistory> findByUserIdAndPersonalWordId(Long userId, Long personalWordId);

    @Query("SELECT r FROM ReviewHistory r WHERE r.user.id = :userId AND r.nextReviewDate <= :now")
    List<ReviewHistory> findDueReviews(@Param("userId") Long userId, @Param("now") LocalDateTime now);
}
