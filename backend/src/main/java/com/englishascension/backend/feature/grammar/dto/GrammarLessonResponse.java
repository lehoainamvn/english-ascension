package com.englishascension.backend.feature.grammar.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GrammarLessonResponse {
    private Long id;
    private String title;
    private String vietnameseTitle;
    private String theoryContent;
    private Integer questionsCount;
    private Integer xpRewardLesson;
    private Integer coinRewardLesson;
    private Integer xpRewardPractice;
    private Integer coinRewardPractice;
    private boolean lessonCompleted;
    private boolean practiceCompleted;
    private Integer score;
    private String level;
}
