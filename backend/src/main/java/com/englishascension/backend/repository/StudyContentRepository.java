package com.englishascension.backend.repository;

import com.englishascension.backend.model.StudyContent;
import com.englishascension.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyContentRepository extends JpaRepository<StudyContent, Long> {
    List<StudyContent> findByType(String type);
    List<StudyContent> findByTypeOrderByOrderIndexAsc(String type);
    List<StudyContent> findByTypeAndCategory(String type, String category);
    List<StudyContent> findByTypeAndCategoryOrderByOrderIndexAsc(String type, String category);
    Optional<StudyContent> findByTypeAndId(String type, Long id);
    List<StudyContent> findByUserOrderByCreatedAtDesc(User user);
}
