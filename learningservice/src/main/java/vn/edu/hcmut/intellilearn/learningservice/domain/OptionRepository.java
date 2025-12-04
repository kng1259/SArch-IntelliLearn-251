package vn.edu.hcmut.intellilearn.learningservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.hcmut.intellilearn.learningservice.core.Option;
import vn.edu.hcmut.intellilearn.learningservice.core.OptionId;

@Repository
public interface OptionRepository extends JpaRepository<Option, OptionId> { }

