package com.englishascension.backend.feature.document.repository;

import com.englishascension.backend.feature.document.entity.UserDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserDocumentRepository extends JpaRepository<UserDocument, Long> {
    List<UserDocument> findByUserId(Long userId);
}
