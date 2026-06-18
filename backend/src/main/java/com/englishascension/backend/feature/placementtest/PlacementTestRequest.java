package com.englishascension.backend.feature.placementtest;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class PlacementTestRequest {
    private List<AnswerRequest> answers;
    private String targetGoal;

    @Getter
    @Setter
    public static class AnswerRequest {
        private Long questionId;
        private String selectedOption; // A, B, C, D
    }
}
