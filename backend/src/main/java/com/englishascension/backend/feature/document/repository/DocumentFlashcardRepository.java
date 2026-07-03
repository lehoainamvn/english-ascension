package com.englishascension.backend.feature.document.repository;

import com.englishascension.backend.feature.document.entity.DocumentFlashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentFlashcardRepository extends JpaRepository<DocumentFlashcard, Long> {
    List<DocumentFlashcard> findByDocumentId(Long documentId);
}
