package com.englishascension.backend.feature.study.repository;

import com.englishascension.backend.feature.study.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByType(String type);
    List<Question> findByDifficulty(String difficulty);
    List<Question> findByTypeAndDifficulty(String type, String difficulty);

    @Query(value = "SELECT * FROM questions ORDER BY RANDOM()", nativeQuery = true)
    List<Question> findAllRandom();

    List<Question> findBySourceTypeAndParentId(String sourceType, Long parentId);
    List<Question> findBySourceTypeAndParentIdOrderByQuestionNumberAsc(String sourceType, Long parentId);
}
