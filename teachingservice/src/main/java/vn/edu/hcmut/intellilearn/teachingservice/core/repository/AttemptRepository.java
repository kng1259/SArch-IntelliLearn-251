package vn.edu.hcmut.intellilearn.teachingservice.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Attempt;

import java.util.List;
import java.util.UUID;

public interface AttemptRepository extends JpaRepository<Attempt, UUID> {
    @Query(value = """
    select distinct on (a.test_id) a.*
    from attempt a
    join exam e on a.test_id = e.test_id
    where e.course_id = :courseId

    union

    select distinct on (a.test_id) a.*
    from attempt a
    join quiz q on a.test_id = q.test_id
    where q.course_id = :courseId
    """,
            nativeQuery = true)
    List<Attempt> selectAllByCourseId(UUID courseId);
}