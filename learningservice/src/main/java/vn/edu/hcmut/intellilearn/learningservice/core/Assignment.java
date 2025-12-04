package vn.edu.hcmut.intellilearn.learningservice.core;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "assignment")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "assignment_id")
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;


    @Column(name = "description")
    private String description;


    @Column(name = "instruction")
    private String instruction;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;


    @Column(name = "grading_guidelines")
    private String gradingGuidelines;

    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @PrePersist
    public void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (startAt == null) startAt = LocalDateTime.now();
    }

    // getters/setters
}
