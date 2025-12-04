package vn.edu.hcmut.intellilearn.learningservice.core;


import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "quiz")
public class Quiz {
    @Id
    @Column(name = "test_id")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "test_id")
    private Test test;

    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "level_codename", nullable = false)
    private Level level;
}
