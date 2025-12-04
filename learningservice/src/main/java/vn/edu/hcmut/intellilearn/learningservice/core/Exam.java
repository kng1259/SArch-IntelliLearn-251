package vn.edu.hcmut.intellilearn.learningservice.core;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "exam")
public class Exam {
    @Id
    @Column(name = "test_id")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "test_id")
    private Test test;

    @Column(name = "entrance", nullable = false)
    private boolean entrance = false;

    @Column(name = "course_id", nullable = false)
    private UUID courseId;
}
