package com.englishascension.backend.feature.roadmap.repository;

import com.englishascension.backend.feature.roadmap.entity.Lesson;
import com.englishascension.backend.feature.roadmap.entity.LessonType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, String> {
    List<Lesson> findByLevel(String level);
    List<Lesson> findByType(LessonType type);
    List<Lesson> findByLevelAndType(String level, LessonType type);
}
