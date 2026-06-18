package com.englishascension.backend.feature.study;

import com.englishascension.backend.feature.study.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByModuleId(Long moduleId);
    List<Flashcard> findByUserId(Long userId);
    Optional<Flashcard> findByUserIdAndWord(Long userId, String word);
}
