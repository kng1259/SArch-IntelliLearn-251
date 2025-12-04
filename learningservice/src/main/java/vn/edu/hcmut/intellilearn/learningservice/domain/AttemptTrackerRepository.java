package vn.edu.hcmut.intellilearn.learningservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.hcmut.intellilearn.learningservice.core.Attempt;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttemptTrackerRepository extends JpaRepository<Attempt, UUID> {
    default Attempt insertAttempt(Attempt attempt) {
        return save(attempt);
    }

    Optional<Attempt> findByIdAndStudentId(UUID id, UUID studentId);
}
