package vn.edu.hcmut.intellilearn.learningservice.core;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "submission")
public class Submission {

    @EmbeddedId
    private SubmissionId id;


    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "score", nullable = false)
    private Float score = 0.0f;


    @Column(name = "feedback")
    private String feedback;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // getters/setters
}
