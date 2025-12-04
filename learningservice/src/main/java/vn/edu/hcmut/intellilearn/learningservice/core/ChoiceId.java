package vn.edu.hcmut.intellilearn.learningservice.core;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
public class ChoiceId implements Serializable {

    @Column(name = "answer_id")
    private UUID answerId;

    @Column(name = "\"order\"")
    private Integer order;

    public ChoiceId() {}

    public ChoiceId(UUID answerId, Integer order) {
        this.answerId = answerId;
        this.order = order;
    }

    public UUID getAnswerId() {
        return answerId;
    }

    public void setAnswerId(UUID answerId) {
        this.answerId = answerId;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }
}
