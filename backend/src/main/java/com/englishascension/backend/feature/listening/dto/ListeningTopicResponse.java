package com.englishascension.backend.feature.listening.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ListeningTopicResponse {
    private Long id;
    private String title;
    private String category;
    private String description;
    private Integer sectionsCount;
    private Integer questionsCount;
    private Integer completedCount;
    private String mediaUrl;
}
