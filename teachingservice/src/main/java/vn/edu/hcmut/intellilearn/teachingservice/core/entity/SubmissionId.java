package vn.edu.hcmut.intellilearn.teachingservice.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Getter
@Setter
@Embeddable
public class SubmissionId implements Serializable {
    private static final long serialVersionUID = 5054270310181002238L;

    @NotNull
    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @NotNull
    @Column(name = "file_name", nullable = false)
    private String fileUrl;

    @NotNull
    @Column(name = "assignment_id", nullable = false)
    private UUID assignmentId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        SubmissionId entity = (SubmissionId) o;
        return Objects.equals(this.studentId, entity.studentId) &&
                Objects.equals(this.assignmentId, entity.assignmentId)&&
                Objects.equals(this.fileUrl, entity.fileUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentId, fileUrl, assignmentId);
    }
}