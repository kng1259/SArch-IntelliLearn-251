package vn.edu.hcmut.intellilearn.learningservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.hcmut.intellilearn.learningservice.core.Choice;
import vn.edu.hcmut.intellilearn.learningservice.core.ChoiceId;

@Repository
public interface ChoiceRepository extends JpaRepository<Choice, ChoiceId> { }
