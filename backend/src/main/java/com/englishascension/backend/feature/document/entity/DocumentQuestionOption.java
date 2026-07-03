package com.englishascension.backend.feature.document.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "document_question_options")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DocumentQuestionOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnore
    private DocumentQuestion question;

    @Column(name = "option_key", nullable = false, length = 50)
    private String optionKey;

    @Column(name = "option_value", nullable = false, columnDefinition = "TEXT")
    private String optionValue;

    @Column(name = "is_correct", nullable = false)
    @Builder.Default
    private boolean correct = false;
}
