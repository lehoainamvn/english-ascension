package com.englishascension.backend.feature.roadmap;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapRequest {
    private String cefrLevel;
    private String toeicEquivalent;
    private String overallEvaluation;
    private String thumbnailEmoji;
    private String difficultyLabel;
    private List<ModuleRequest> modules;
}
