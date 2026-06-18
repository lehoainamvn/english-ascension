package com.englishascension.backend.feature.roadmap;

import com.englishascension.backend.feature.roadmap.LearningModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningModuleRepository extends JpaRepository<LearningModule, Long> {
    List<LearningModule> findByRoadmapIdOrderByOrderIndexAsc(Long roadmapId);
    List<LearningModule> findByCategoryIsNotNull();
    List<LearningModule> findByCategory(String category);
}
