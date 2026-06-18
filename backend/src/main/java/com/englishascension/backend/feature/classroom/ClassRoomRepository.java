package com.englishascension.backend.feature.classroom;

import com.englishascension.backend.feature.classroom.ClassRoom;
import com.englishascension.backend.feature.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {
    Optional<ClassRoom> findByInviteCode(String inviteCode);

    @Query("SELECT DISTINCT cr FROM ClassRoom cr LEFT JOIN cr.members m WHERE cr.createdBy = :user OR m.user = :user ORDER BY cr.createdAt DESC")
    List<ClassRoom> findAllByUserInvolved(@Param("user") User user);
}
