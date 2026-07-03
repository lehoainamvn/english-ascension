package com.englishascension.backend.feature.roadmap.repository;

import com.englishascension.backend.feature.roadmap.entity.Lesson;
import com.englishascension.backend.feature.roadmap.entity.LessonType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    Optional<Lesson> findBySlug(String slug);
    List<Lesson> findByLevel(String level);
    List<Lesson> findByType(LessonType type);
    List<Lesson> findByLevelAndType(String level, LessonType type);
    List<Lesson> findByModuleId(Long moduleId);
}
