package vn.edu.hcmut.intellilearn.learningservice.core;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
public class SubmissionId implements Serializable {

    @Column(name = "student_id")
    private UUID studentId;

    @Column(name = "assignment_id")
    private UUID assignmentId;

    @Column(name = "file_name")
    private String fileName;

    public SubmissionId() {}

    public SubmissionId(UUID studentId, UUID assignmentId, String fileName) {
        this.studentId = studentId;
        this.assignmentId = assignmentId;
        this.fileName = fileName;
    }

    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public UUID getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(UUID assignmentId) {
        this.assignmentId = assignmentId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
