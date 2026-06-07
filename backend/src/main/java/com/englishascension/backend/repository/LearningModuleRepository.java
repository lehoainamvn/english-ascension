package com.englishascension.backend.repository;

import com.englishascension.backend.model.LearningModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningModuleRepository extends JpaRepository<LearningModule, Long> {
    List<LearningModule> findByRoadmapIdOrderByOrderIndexAsc(Long roadmapId);
}
