package vn.edu.hcmut.intellilearn.teachingservice.core.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "attempt")
public class Attempt {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "attempt_id", nullable = false)
    private UUID id;

    @NotNull
    @ColumnDefault("0.0")
    @Column(name = "score", nullable = false)
    private Float score;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "start_at", nullable = false)
    private Instant startAt;

    @Column(name = "end_at")
    private Instant endAt;

    @NotNull
    @ColumnDefault("false")
    @Column(name = "completed", nullable = false)
    private Boolean completed = false;

    @NotNull
    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

}