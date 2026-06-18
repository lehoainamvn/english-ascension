package com.englishascension.backend.feature.roadmap;

import com.englishascension.backend.feature.roadmap.LearningRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningRoadmapRepository extends JpaRepository<LearningRoadmap, Long> {
    Optional<LearningRoadmap> findByUserId(Long userId);
    List<LearningRoadmap> findByIsPresetTrueOrderByIdAsc();
}
