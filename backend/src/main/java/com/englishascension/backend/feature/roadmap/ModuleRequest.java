package com.englishascension.backend.feature.roadmap;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModuleRequest {
    private Long id;
    private String title;
    private String description;
    private String category;
    private Integer orderIndex;
}
