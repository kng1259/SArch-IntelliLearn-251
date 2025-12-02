package vn.edu.hcmut.intellilearn.teachingservice.core.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "submission")
public class Submission {
    @EmbeddedId
    private SubmissionId id;

    @MapsId("assignmentId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @NotNull
    @Column(name = "content", nullable = false, length = Integer.MAX_VALUE)
    private String content;

    @NotNull
    @ColumnDefault("0.0")
    @Column(name = "score", nullable = false)
    private Float score;

    @Column(name = "feedback", length = Integer.MAX_VALUE)
    private String feedback;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;


}