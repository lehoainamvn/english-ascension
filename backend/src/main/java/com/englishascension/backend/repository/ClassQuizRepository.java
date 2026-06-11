package com.englishascension.backend.repository;

import com.englishascension.backend.model.ClassQuiz;
import com.englishascension.backend.model.ClassRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassQuizRepository extends JpaRepository<ClassQuiz, Long> {
    List<ClassQuiz> findByClassRoomOrderByCreatedAtDesc(ClassRoom classRoom);
}
