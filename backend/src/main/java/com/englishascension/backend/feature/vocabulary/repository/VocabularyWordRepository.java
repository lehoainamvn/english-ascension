package com.englishascension.backend.feature.vocabulary.repository;

import com.englishascension.backend.feature.vocabulary.entity.VocabularyWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VocabularyWordRepository extends JpaRepository<VocabularyWord, Long> {
    List<VocabularyWord> findByLessonId(Long lessonId);
    List<VocabularyWord> findByLessonSlug(String slug);
}
