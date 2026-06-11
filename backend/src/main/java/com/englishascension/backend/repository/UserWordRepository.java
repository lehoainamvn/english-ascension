package com.englishascension.backend.repository;

import com.englishascension.backend.model.UserWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserWordRepository extends JpaRepository<UserWord, Long> {
    List<UserWord> findByUserId(Long userId);
    Optional<UserWord> findByUserIdAndWord(Long userId, String word);
    Boolean existsByUserIdAndWord(Long userId, String word);
}
