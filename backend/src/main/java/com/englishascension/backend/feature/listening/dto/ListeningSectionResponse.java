package com.englishascension.backend.feature.listening.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ListeningSectionResponse {
    private Long id;
    private String title;
    private Integer orderIndex;
    private Integer questionsCount;
    private boolean isCompleted;
    private List<ListeningQuestionResponse> questions;
}
