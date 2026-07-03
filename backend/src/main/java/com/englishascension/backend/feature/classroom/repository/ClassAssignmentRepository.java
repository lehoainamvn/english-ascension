package com.englishascension.backend.feature.classroom.repository;

import com.englishascension.backend.feature.classroom.entity.ClassAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClassAssignmentRepository extends JpaRepository<ClassAssignment, Long> {
    List<ClassAssignment> findByClassRoomId(Long classroomId);
    List<ClassAssignment> findByClassRoomIdAndActive(Long classroomId, boolean active);
}
