package com.englishascension.backend.repository;

import com.englishascension.backend.model.UserRoadmapEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoadmapEnrollmentRepository extends JpaRepository<UserRoadmapEnrollment, Long> {
    List<UserRoadmapEnrollment> findByUserIdOrderByLastAccessedAtDesc(Long userId);
    Optional<UserRoadmapEnrollment> findByUserIdAndRoadmapId(Long userId, Long roadmapId);
    boolean existsByUserIdAndRoadmapId(Long userId, Long roadmapId);
}
