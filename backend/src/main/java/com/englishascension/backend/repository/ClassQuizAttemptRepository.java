package com.englishascension.backend.repository;

import com.englishascension.backend.model.ClassQuizAttempt;
import com.englishascension.backend.model.ClassQuiz;
import com.englishascension.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassQuizAttemptRepository extends JpaRepository<ClassQuizAttempt, Long> {
    List<ClassQuizAttempt> findByClassQuizOrderByScoreDescCompletedAtAsc(ClassQuiz classQuiz);
    Optional<ClassQuizAttempt> findByClassQuizAndUser(ClassQuiz classQuiz, User user);
}
