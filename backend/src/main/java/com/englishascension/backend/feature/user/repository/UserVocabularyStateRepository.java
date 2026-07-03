package com.englishascension.backend.feature.user.repository;

import com.englishascension.backend.feature.user.entity.UserVocabularyState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserVocabularyStateRepository extends JpaRepository<UserVocabularyState, Long> {
    List<UserVocabularyState> findByUserId(Long userId);
    Optional<UserVocabularyState> findByUserIdAndVocabularyWordId(Long userId, Long wordId);
    List<UserVocabularyState> findByUserIdAndVocabularyWordLessonId(Long userId, Long lessonId);
}
