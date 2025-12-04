package vn.edu.hcmut.intellilearn.learningservice.core;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "option")
public class Option {

    @EmbeddedId
    private OptionId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("questionId")
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;


    @Column(name = "\"value\"", nullable = false)
    private String value;

    @Column(name = "correct", nullable = false)
    private boolean correct = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // helper cho order
    public Integer getOrder() {
        return id != null ? id.getOrder() : null;
    }

    public void setOrder(Integer order) {
        if (id == null) {
            id = new OptionId();
        }
        id.setOrder(order);
    }

    // getters/setters khác
}
