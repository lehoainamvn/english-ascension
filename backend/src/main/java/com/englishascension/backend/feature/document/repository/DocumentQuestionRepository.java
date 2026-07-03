package com.englishascension.backend.feature.document.repository;

import com.englishascension.backend.feature.document.entity.DocumentQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentQuestionRepository extends JpaRepository<DocumentQuestion, Long> {
    List<DocumentQuestion> findByDocumentId(Long documentId);
}
