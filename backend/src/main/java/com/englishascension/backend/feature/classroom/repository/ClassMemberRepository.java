package com.englishascension.backend.feature.classroom.repository;

import com.englishascension.backend.feature.classroom.entity.ClassMember;
import com.englishascension.backend.feature.classroom.entity.ClassRoom;
import com.englishascension.backend.feature.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassMemberRepository extends JpaRepository<ClassMember, Long> {
    List<ClassMember> findByClassRoomId(Long classRoomId);
    Optional<ClassMember> findByClassRoomIdAndUserId(Long classRoomId, Long userId);
    List<ClassMember> findByUserId(Long userId);

    boolean existsByClassRoomAndUser(ClassRoom classRoom, User user);
    Optional<ClassMember> findByClassRoomAndUser(ClassRoom classRoom, User user);
    List<ClassMember> findByClassRoomOrderByJoinedAtAsc(ClassRoom classRoom);
}
