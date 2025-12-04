package vn.edu.hcmut.intellilearn.learningservice.core;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Level {
    @Id
    @Column(name = "codename", length = 15)
    private String codename;

    @Column(name = "name", nullable = false, length = 100)
    private String name;
}
