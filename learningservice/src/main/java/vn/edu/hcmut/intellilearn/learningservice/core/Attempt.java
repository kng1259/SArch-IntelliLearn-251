package vn.edu.hcmut.intellilearn.learningservice.core;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "attempt")
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "attempt_id")
    private UUID id;

    @Column(name = "score", nullable = false)
    private Float score = 0.0f;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;

    @Column(name = "completed", nullable = false)
    private boolean completed = false;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "test_id", nullable = false)
    private UUID testId;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers = new ArrayList<>();

    @PrePersist
    public void onCreate() {
        if (startAt == null) {
            startAt = LocalDateTime.now();
        }
    }

    public void addAnswer(Answer answer) {
        answers.add(answer);
        answer.setAttempt(this);
    }

    // getters/setters
}