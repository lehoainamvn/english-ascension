package com.englishascension.backend.feature.roadmap.repository;

import com.englishascension.backend.feature.roadmap.entity.UserLearningPathLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserLearningPathLessonRepository extends JpaRepository<UserLearningPathLesson, Long> {
    List<UserLearningPathLesson> findByLearningPathIdOrderByOrderIndexAsc(Long learningPathId);
}
