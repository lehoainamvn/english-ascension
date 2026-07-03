package com.englishascension.backend.feature.document.repository;

import com.englishascension.backend.feature.document.entity.DocumentQuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentQuestionOptionRepository extends JpaRepository<DocumentQuestionOption, Long> {
    List<DocumentQuestionOption> findByQuestionId(Long questionId);
}
