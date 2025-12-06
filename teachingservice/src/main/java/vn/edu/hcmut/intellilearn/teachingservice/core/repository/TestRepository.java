package vn.edu.hcmut.intellilearn.teachingservice.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Test;

import java.util.List;
import java.util.UUID;

public interface TestRepository extends JpaRepository<Test, UUID> {
    @Query(value = """
select t.*
from test t
join quiz q
on t.test_id = q.test_id
where q.course_id = :courseId
union
select t.*
from test t
join exam e
on t.test_id = e.test_id
where e.course_id = :courseId
""", nativeQuery = true)
    List<Test> findAllByCourseId(UUID courseId);
}