package vn.edu.hcmut.intellilearn.teachingservice.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Submission;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.SubmissionId;

import java.util.List;
import java.util.UUID;

public interface SubmissionRepository extends JpaRepository<Submission, SubmissionId> {
    @Query(value = """
    select s.*
    from submission s
    join assignment a on s.assignment_id = a.assignment_id
    where a.course_id = :courseId
    """,
            nativeQuery = true)
    List<Submission> selectAllByCourseId(UUID courseId);

    @Query(value = """
    select s.*
    from submission s
    join assignment a on s.assignment_id = a.assignment_id
    join course c on a.course_id = c.course_id
    where c.tutor_id = :tutorId
    and (s.score = 0 or s.score is null)
    and s.feedback is null
    order by s.created_at desc
    """,
            nativeQuery = true)
    List<Submission> selectPendingSubmissionsByTutorId(UUID tutorId);

    @Query(value = """
    select s.*
    from submission s
    where s.assignment_id = :assignmentId
    order by s.created_at desc
    """,
            nativeQuery = true)
    List<Submission> selectAllByAssignmentId(UUID assignmentId);

}