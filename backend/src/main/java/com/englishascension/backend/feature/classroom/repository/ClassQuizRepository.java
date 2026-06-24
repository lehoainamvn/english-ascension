package com.englishascension.backend.feature.classroom.repository;

import com.englishascension.backend.feature.classroom.entity.ClassQuiz;
import com.englishascension.backend.feature.classroom.entity.ClassRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassQuizRepository extends JpaRepository<ClassQuiz, Long> {
    List<ClassQuiz> findByClassRoomId(Long classRoomId);
    List<ClassQuiz> findByClassRoomOrderByCreatedAtDesc(ClassRoom classRoom);
}
