package com.englishascension.backend.feature.reading.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReadingArticleResponse {
    private Long id;
    private String title;
    private String category;
    private String bodyText;
    private Integer questionsCount;
    private boolean articleCompleted;
    private boolean practiceCompleted;
    private Integer score;
    private String level;
    private boolean isCompleted;
}
