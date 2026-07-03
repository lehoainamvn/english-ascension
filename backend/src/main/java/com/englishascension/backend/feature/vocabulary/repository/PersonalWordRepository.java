package com.englishascension.backend.feature.vocabulary.repository;

import com.englishascension.backend.feature.vocabulary.entity.PersonalWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PersonalWordRepository extends JpaRepository<PersonalWord, Long> {
    List<PersonalWord> findByUserId(Long userId);
    Optional<PersonalWord> findByUserIdAndWordIgnoreCase(Long userId, String word);
}
