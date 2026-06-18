package com.englishascension.backend.feature.classroom;

import com.englishascension.backend.feature.classroom.ClassMember;
import com.englishascension.backend.feature.classroom.ClassRoom;
import com.englishascension.backend.feature.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassMemberRepository extends JpaRepository<ClassMember, Long> {
    Optional<ClassMember> findByClassRoomAndUser(ClassRoom classRoom, User user);
    List<ClassMember> findByClassRoomOrderByJoinedAtAsc(ClassRoom classRoom);
    boolean existsByClassRoomAndUser(ClassRoom classRoom, User user);
}
