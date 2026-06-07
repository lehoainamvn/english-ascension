package com.englishascension.backend.repository;

import com.englishascension.backend.model.Question;
import com.englishascension.backend.model.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByType(QuestionType type);
    List<Question> findByDifficulty(String difficulty);
    List<Question> findByTypeAndDifficulty(QuestionType type, String difficulty);

    @Query(value = "SELECT * FROM questions ORDER BY RANDOM()", nativeQuery = true)
    List<Question> findAllRandom();
}
