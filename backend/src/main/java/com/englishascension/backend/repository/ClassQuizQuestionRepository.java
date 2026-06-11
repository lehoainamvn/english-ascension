package com.englishascension.backend.repository;

import com.englishascension.backend.model.ClassQuizQuestion;
import com.englishascension.backend.model.ClassQuiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassQuizQuestionRepository extends JpaRepository<ClassQuizQuestion, Long> {
    List<ClassQuizQuestion> findByClassQuizOrderByQuestionNumber(ClassQuiz classQuiz);
    void deleteByClassQuiz(ClassQuiz classQuiz);
}
