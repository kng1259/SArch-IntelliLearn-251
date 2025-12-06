package vn.edu.hcmut.intellilearn.teachingservice.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Submission;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.SubmissionId;

import java.util.List;
import java.util.UUID;

public interface SubmissionRepository extends JpaRepository<Submission, SubmissionId> {
    @Query(value = """
    select distinct on (s.assignment_id, s.student_id) s.*
    from submission s
    join assignment a on s.assignment_id = a.assignment_id
    where a.course_id = :courseId
    """,
            nativeQuery = true)
    List<Submission> selectAllByCourseId(UUID courseId);

}