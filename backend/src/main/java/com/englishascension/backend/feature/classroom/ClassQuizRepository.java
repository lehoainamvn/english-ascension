package com.englishascension.backend.feature.classroom;

import com.englishascension.backend.feature.classroom.ClassQuiz;
import com.englishascension.backend.feature.classroom.ClassRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassQuizRepository extends JpaRepository<ClassQuiz, Long> {
    List<ClassQuiz> findByClassRoomOrderByCreatedAtDesc(ClassRoom classRoom);
}
