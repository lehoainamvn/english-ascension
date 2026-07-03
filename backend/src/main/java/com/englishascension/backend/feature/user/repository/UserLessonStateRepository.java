package com.englishascension.backend.feature.user.repository;

import com.englishascension.backend.feature.user.entity.UserLessonState;
import com.englishascension.backend.feature.roadmap.entity.LessonType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserLessonStateRepository extends JpaRepository<UserLessonState, Long> {
    List<UserLessonState> findByUserId(Long userId);
    Optional<UserLessonState> findByUserIdAndLessonId(Long userId, Long lessonId);
    Optional<UserLessonState> findByUserIdAndLessonSlug(Long userId, String slug);
    List<UserLessonState> findByUserIdAndLessonType(Long userId, LessonType type);
}
