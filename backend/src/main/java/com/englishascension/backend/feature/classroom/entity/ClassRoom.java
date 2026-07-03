package com.englishascension.backend.feature.classroom.entity;

import com.englishascension.backend.feature.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "classrooms")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClassRoom {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150) private String name;
    @Column(columnDefinition = "TEXT")      private String description;
    @Column(name = "invite_code", unique = true, nullable = false, length = 10) private String inviteCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "classRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default private List<ClassMember> members = new ArrayList<>();

    @OneToMany(mappedBy = "classRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default private List<ClassAssignment> assignments = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;

    @PrePersist  protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate   protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
