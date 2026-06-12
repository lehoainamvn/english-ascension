package com.englishascension.backend.repository;

import com.englishascension.backend.model.UserProgress;
import com.englishascension.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    List<UserProgress> findByUserId(Long userId);
    List<UserProgress> findByUserIdAndResourceType(Long userId, String resourceType);
    Optional<UserProgress> findByUserIdAndResourceTypeAndResourceId(Long userId, String resourceType, Long resourceId);
    List<UserProgress> findByUserIdAndResourceTypeAndResourceIdIn(Long userId, String resourceType, List<Long> resourceIds);
    List<UserProgress> findByResourceTypeAndResourceIdOrderByScoreDescCompletedAtAsc(String resourceType, Long resourceId);
    Optional<UserProgress> findByResourceTypeAndResourceIdAndUser(String resourceType, Long resourceId, User user);
}
