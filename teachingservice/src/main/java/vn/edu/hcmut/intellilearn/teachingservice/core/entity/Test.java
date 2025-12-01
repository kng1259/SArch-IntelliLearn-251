package vn.edu.hcmut.intellilearn.teachingservice.core.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "test")
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "test_id", nullable = false)
    private UUID id;

    @Size(max = 255)
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "duration", nullable = false)
    private Integer duration;

    @OneToMany(mappedBy = "test", orphanRemoval = true, cascade = CascadeType.ALL)
    private Set<Question> questions = new LinkedHashSet<>();

    @OneToOne(mappedBy = "test", orphanRemoval = true, cascade = CascadeType.ALL)
    private Exam exam;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}