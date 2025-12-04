package vn.edu.hcmut.intellilearn.learningservice.domain;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.hcmut.intellilearn.learningservice.core.Question;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {
    List<Question> findByTest_Id(UUID testId);
}
