package vn.edu.hcmut.intellilearn.learningservice.core;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "choice")
public class Choice {

    @EmbeddedId
    private ChoiceId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("answerId")
    @JoinColumn(name = "answer_id", nullable = false)
    private Answer answer;


    @Column(name = "\"value\"", nullable = false)
    private String value;

    @Column(name = "correct", nullable = false)
    private boolean correct = false;

    @Column(name = "selected", nullable = false)
    private boolean selected = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Integer getOrder() {
        return id != null ? id.getOrder() : null;
    }

    public void setOrder(Integer order) {
        if (id == null) {
            id = new ChoiceId();
        }
        id.setOrder(order);
    }

    // getters/setters
}