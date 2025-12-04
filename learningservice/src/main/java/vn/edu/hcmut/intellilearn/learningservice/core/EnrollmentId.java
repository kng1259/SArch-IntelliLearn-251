package vn.edu.hcmut.intellilearn.learningservice.core;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

//@Getter
//@Setter
@Data
@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentId implements Serializable {
    private static final long serialVersionUID = 1001703343958923476L;
    @NotNull
    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @NotNull
    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        EnrollmentId entity = (EnrollmentId) o;
        return Objects.equals(this.studentId, entity.studentId) &&
                Objects.equals(this.courseId, entity.courseId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentId, courseId);
    }

}