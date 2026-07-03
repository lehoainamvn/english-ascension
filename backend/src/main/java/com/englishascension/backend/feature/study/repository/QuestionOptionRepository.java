package com.englishascension.backend.feature.study.repository;

import com.englishascension.backend.feature.study.entity.QuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Long> {
    List<QuestionOption> findByQuestionId(Long questionId);
}
