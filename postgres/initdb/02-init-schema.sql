\c its;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. COURSE STRUCTURE TABLES
-- ============================================================================

-- Table: LEVEL
-- Description: Difficulty levels for quizzes (e.g., beginner, intermediate, advanced)
CREATE TABLE IF NOT EXISTS "level" (
    codename VARCHAR(15) PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL
);

-- Table: COURSE
-- Description: Main course entity containing all learning materials and assessments
CREATE TABLE IF NOT EXISTS course (
    course_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    start_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_at TIMESTAMP NOT NULL,
    tutor_id UUID NOT NULL
);

-- Table: MODULE
-- Description: Course modules to organize content
CREATE TABLE IF NOT EXISTS module (
    module_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    course_id UUID NOT NULL
);

-- Table: ENROLLMENT
-- Description: Junction table for student-course many-to-many relationship
CREATE TABLE IF NOT EXISTS enrollment (
    student_id UUID NOT NULL,
    course_id UUID NOT NULL,
    "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id)
);

-- Table: MATERIAL
-- Description: Learning materials within a course (videos, documents, etc.)
CREATE TABLE IF NOT EXISTS material (
    material_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    course_id UUID NOT NULL
);

-- ============================================================================
-- 3. ASSIGNMENT AND SUBMISSION TABLES
-- ============================================================================

-- Table: ASSIGNMENT
-- Description: Course assignments that students must complete
CREATE TABLE IF NOT EXISTS assignment (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    instruction TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    start_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_at TIMESTAMP,
    grading_guidelines TEXT,
    course_id UUID NOT NULL
);

-- Table: SUBMISSION
-- Description: Student submissions for assignments
CREATE TABLE IF NOT EXISTS submission (
    content TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    score REAL NOT NULL DEFAULT 0.0,
    feedback TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    student_id UUID NOT NULL,
    assignment_id UUID NOT NULL,
    PRIMARY KEY (student_id, assignment_id, file_name)
);

-- ============================================================================
-- 4. ASSESSMENT TABLES (EXAM, TEST, QUIZ)
-- ============================================================================

-- Table: TEST
-- Description: Question bank/template containing questions and options
CREATE TABLE IF NOT EXISTS test (
    test_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    start_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_at TIMESTAMP,
    duration INTEGER NOT NULL DEFAULT 0 -- duration in minutes
);

-- Table: EXAM
-- Description: Formal exams linked to courses (can be entrance exams)
CREATE TABLE IF NOT EXISTS exam (
    test_id UUID PRIMARY KEY,
    entrance BOOLEAN NOT NULL DEFAULT FALSE,
    course_id UUID NOT NULL
);

-- Table: QUIZ
-- Description: Quick assessments within a course, tied to difficulty level
CREATE TABLE IF NOT EXISTS quiz (
    test_id UUID PRIMARY KEY,
    course_id UUID NOT NULL,
    level_codename VARCHAR(15) NOT NULL
);

-- ============================================================================
-- 5. QUESTION AND OPTION TABLES (Assessment Template)
-- ============================================================================

-- Table: QUESTION
-- Description: Individual questions belonging to a test
CREATE TABLE IF NOT EXISTS question (
    question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    test_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: OPTION
-- Description: Answer options for questions (template with correct answers)
CREATE TABLE IF NOT EXISTS option (
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    correct BOOLEAN NOT NULL DEFAULT FALSE,
    question_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (question_id, "order")
);

-- ============================================================================
-- 6. ATTEMPT, ANSWER, AND CHOICE TABLES (Student Responses)
-- ============================================================================

-- Table: ATTEMPT
-- Description: Student attempt at taking a quiz or test
CREATE TABLE IF NOT EXISTS attempt (
    attempt_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    score REAL NOT NULL DEFAULT 0.0,
    start_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_at TIMESTAMP,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    student_id UUID NOT NULL,
    test_id UUID NOT NULL
);

-- Table: ANSWER
-- Description: Student's answer to a specific question during an attempt
CREATE TABLE IF NOT EXISTS answer (
    answer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    attempt_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: CHOICE
-- Description: Snapshot of options at the time of student's attempt
CREATE TABLE IF NOT EXISTS choice (
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    correct BOOLEAN NOT NULL DEFAULT FALSE,
    selected BOOLEAN NOT NULL DEFAULT FALSE,
    answer_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (answer_id, "order")
);

-- ============================================================================
-- 7. FEEDBACK TABLE
-- ============================================================================

-- Table: FEEDBACK
-- Description: Communication between tutors and students about a course
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tutor_id UUID NOT NULL,
    student_id UUID NOT NULL,
    course_id UUID NOT NULL
);

-- ============================================================================
-- 8. ADD FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- Note: tutor_id and student_id reference Keycloak user IDs (UUID)
-- No foreign key constraints to Keycloak database

-- Enrollment foreign keys
ALTER TABLE enrollment
    ADD CONSTRAINT fk_enrollment_course
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE;

-- Material foreign keys
ALTER TABLE material
    ADD CONSTRAINT fk_material_course
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE;

-- Module foreign keys
ALTER TABLE module
    ADD CONSTRAINT fk_module_course
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE;

-- Assignment foreign keys
ALTER TABLE assignment
    ADD CONSTRAINT fk_assignment_course
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE;

-- Submission foreign keys
ALTER TABLE submission
    ADD CONSTRAINT fk_submission_assignment
    FOREIGN KEY (assignment_id) REFERENCES assignment(assignment_id) ON DELETE CASCADE;

-- Exam foreign keys
ALTER TABLE exam
    ADD CONSTRAINT fk_exam_course
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE;

-- Quiz foreign keys
ALTER TABLE quiz
    ADD CONSTRAINT fk_quiz_course
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE;

ALTER TABLE quiz
    ADD CONSTRAINT fk_quiz_level
    FOREIGN KEY (level_codename) REFERENCES level(codename) ON DELETE RESTRICT;

-- Question foreign keys
ALTER TABLE question
    ADD CONSTRAINT fk_question_test
    FOREIGN KEY (test_id) REFERENCES test(test_id) ON DELETE CASCADE;

-- Option foreign keys
ALTER TABLE "option"
    ADD CONSTRAINT fk_option_question
    FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE;

ALTER TABLE attempt
    ADD CONSTRAINT fk_attempt_test
    FOREIGN KEY (test_id) REFERENCES test(test_id) ON DELETE CASCADE;

-- Answer foreign keys
ALTER TABLE answer
    ADD CONSTRAINT fk_answer_attempt
    FOREIGN KEY (attempt_id) REFERENCES attempt(attempt_id) ON DELETE CASCADE;

-- Choice foreign keys
ALTER TABLE choice
    ADD CONSTRAINT fk_choice_answer
    FOREIGN KEY (answer_id) REFERENCES answer(answer_id) ON DELETE CASCADE;

-- Feedback foreign keys
ALTER TABLE feedback
    ADD CONSTRAINT fk_feedback_course
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE;

-- ============================================================================
-- 9. ADD CHECK CONSTRAINTS
-- ============================================================================

ALTER TABLE course
    ADD CONSTRAINT check_course_dates
    CHECK (end_at IS NULL OR start_at <= end_at);

ALTER TABLE assignment
    ADD CONSTRAINT check_assignment_dates
    CHECK (end_at IS NULL OR start_at <= end_at);

ALTER TABLE test
    ADD CONSTRAINT check_test_dates
    CHECK (end_at IS NULL OR start_at <= end_at);

ALTER TABLE attempt
    ADD CONSTRAINT check_attempt_dates
    CHECK (end_at IS NULL OR start_at <= end_at);

-- ============================================================================
-- 12. CREATE FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
CREATE TRIGGER update_material_updated_at
    BEFORE UPDATE ON material
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 13. ADD COMMENTS ON TABLES AND COLUMNS
-- ============================================================================
COMMENT ON TABLE level IS 'Difficulty levels for quizzes';
COMMENT ON TABLE course IS 'Main course entity containing learning materials and assessments';
COMMENT ON TABLE enrollment IS 'Junction table for student-course enrollment';
COMMENT ON TABLE material IS 'Learning materials within courses';
COMMENT ON TABLE module IS 'Course modules to organize content';
COMMENT ON TABLE assignment IS 'Course assignments for students';
COMMENT ON TABLE submission IS 'Student submissions for assignments';
COMMENT ON TABLE test IS 'Question bank template for assessments';
COMMENT ON TABLE exam IS 'Formal exams linked to courses';
COMMENT ON TABLE quiz IS 'Quick assessments within courses';
COMMENT ON TABLE question IS 'Individual questions in tests';
COMMENT ON TABLE option IS 'Answer options for questions (template with correct answers)';
COMMENT ON TABLE attempt IS 'Student attempt at taking a quiz or test';
COMMENT ON TABLE answer IS 'Student answer to a question during an attempt';
COMMENT ON TABLE choice IS 'Snapshot of options at the time of attempt';
COMMENT ON TABLE feedback IS 'Communication between tutors and students about courses';

-- ============================================================================
-- 14. GRANT PERMISSIONS
-- ============================================================================

-- Grant permissions (adjust based on your user setup)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

-- ============================================================================
-- END OF SCHEMA INITIALIZATION
-- ============================================================================