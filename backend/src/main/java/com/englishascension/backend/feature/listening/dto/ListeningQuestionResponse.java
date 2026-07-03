package com.englishascension.backend.feature.listening.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ListeningQuestionResponse {
    private Long id;
    private Integer questionNumber;
    private String text;
    private String translation;
    private String audioUrl;
    private boolean isCompleted;
    private List<OptionResponse> options;
    private String correctOption;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OptionResponse {
        private String key;
        private String value;
    }
}
