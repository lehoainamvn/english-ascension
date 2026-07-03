package com.englishascension.backend.feature.roadmap.repository;

import com.englishascension.backend.feature.roadmap.entity.LessonContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LessonContentRepository extends JpaRepository<LessonContent, Long> {
    Optional<LessonContent> findByLessonId(Long lessonId);
    Optional<LessonContent> findByLessonSlug(String slug);
}
