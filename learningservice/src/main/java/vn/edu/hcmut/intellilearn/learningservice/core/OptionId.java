package vn.edu.hcmut.intellilearn.learningservice.core;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
public class OptionId implements Serializable {

    @Column(name = "question_id")
    private UUID questionId;

    @Column(name = "\"order\"")
    private Integer order;

    public OptionId() {}

    public OptionId(UUID questionId, Integer order) {
        this.questionId = questionId;
        this.order = order;
    }

    public UUID getQuestionId() {
        return questionId;
    }

    public void setQuestionId(UUID questionId) {
        this.questionId = questionId;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }
}