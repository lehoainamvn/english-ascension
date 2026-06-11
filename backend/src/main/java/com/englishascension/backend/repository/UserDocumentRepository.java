package com.englishascension.backend.repository;

import com.englishascension.backend.model.User;
import com.englishascension.backend.model.UserDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDocumentRepository extends JpaRepository<UserDocument, Long> {
    List<UserDocument> findByUserOrderByCreatedAtDesc(User user);
}
