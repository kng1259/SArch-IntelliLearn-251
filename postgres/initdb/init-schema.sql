-- ============================================================================
-- IntelliLearn Database Schema Initialization
-- ============================================================================
-- Database: its
-- DBMS: PostgreSQL 17
-- Description: Complete schema for the IntelliLearn Learning Management System
-- Based on: docs/mapping-eerd.md
-- ============================================================================

-- Connect to the its database
\c its;

-- ============================================================================
-- 1. USER MANAGEMENT TABLES
-- ============================================================================

-- Table: ADMIN
-- Description: System administrators with full access privileges
CREATE TABLE IF NOT EXISTS admin (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: TUTOR
-- Description: Instructors who create and manage courses
CREATE TABLE IF NOT EXISTS tutor (
    tutor_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: STUDENT
-- Description: Learners who enroll in courses and complete assessments
CREATE TABLE IF NOT EXISTS student (
    student_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. COURSE STRUCTURE TABLES
-- ============================================================================

-- Table: LEVEL
-- Description: Difficulty levels for quizzes (e.g., beginner, intermediate, advanced)
CREATE TABLE IF NOT EXISTS level (
    codename VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: COURSE
-- Description: Main course entity containing all learning materials and assessments
CREATE TABLE IF NOT EXISTS course (
    course_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    start_at TIMESTAMP,
    end_at TIMESTAMP,
    tutor_id INTEGER NOT NULL
);

-- Table: ENROLLMENT
-- Description: Junction table for student-course many-to-many relationship
CREATE TABLE IF NOT EXISTS enrollment (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    PRIMARY KEY (student_id, course_id)
);

-- Table: MATERIAL
-- Description: Learning materials within a course (videos, documents, etc.)
CREATE TABLE IF NOT EXISTS material (
    material_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content TEXT,
    content_type VARCHAR(100),
    file_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    course_id INTEGER NOT NULL
);

-- ============================================================================
-- 3. ASSIGNMENT AND SUBMISSION TABLES
-- ============================================================================

-- Table: ASSIGNMENT
-- Description: Course assignments that students must complete
CREATE TABLE IF NOT EXISTS assignment (
    assignment_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    instruction TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    start_at TIMESTAMP,
    end_at TIMESTAMP,
    grading_guidelines TEXT,
    max_score DECIMAL(5,2),
    course_id INTEGER NOT NULL
);

-- Table: SUBMISSION
-- Description: Student submissions for assignments
CREATE TABLE IF NOT EXISTS submission (
    submission_id SERIAL PRIMARY KEY,
    content TEXT,
    file_name VARCHAR(255),
    file_url TEXT,
    score DECIMAL(5,2),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    student_id INTEGER NOT NULL,
    assignment_id INTEGER NOT NULL
);

-- ============================================================================
-- 4. ASSESSMENT TABLES (EXAM, TEST, QUIZ)
-- ============================================================================

-- Table: TEST
-- Description: Question bank/template containing questions and options
CREATE TABLE IF NOT EXISTS test (
    test_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    start_at TIMESTAMP,
    end_at TIMESTAMP,
    duration INTEGER
);

-- Table: EXAM
-- Description: Formal exams linked to courses (can be entrance exams)
CREATE TABLE IF NOT EXISTS exam (
    exam_id SERIAL PRIMARY KEY,
    entrance BOOLEAN DEFAULT FALSE,
    course_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: QUIZ
-- Description: Quick assessments within a course, tied to difficulty level
CREATE TABLE IF NOT EXISTS quiz (
    quiz_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    duration INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    course_id INTEGER NOT NULL,
    level_codename VARCHAR(50) NOT NULL
);

-- ============================================================================
-- 5. QUESTION AND OPTION TABLES (Assessment Template)
-- ============================================================================

-- Table: QUESTION
-- Description: Individual questions belonging to a test
CREATE TABLE IF NOT EXISTS question (
    question_id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'multiple_choice',
    points DECIMAL(5,2) DEFAULT 1.0,
    test_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: OPTION
-- Description: Answer options for questions (template with correct answers)
CREATE TABLE IF NOT EXISTS option (
    option_id SERIAL PRIMARY KEY,
    value TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    correct BOOLEAN DEFAULT FALSE,
    question_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. ATTEMPT, ANSWER, AND CHOICE TABLES (Student Responses)
-- ============================================================================

-- Table: ATTEMPT
-- Description: Student attempt at taking a quiz or test
CREATE TABLE IF NOT EXISTS attempt (
    attempt_id SERIAL PRIMARY KEY,
    score DECIMAL(5,2),
    start_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_at TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    student_id INTEGER NOT NULL,
    quiz_id INTEGER,
    test_id INTEGER
);

-- Table: ANSWER
-- Description: Student's answer to a specific question during an attempt
CREATE TABLE IF NOT EXISTS answer (
    answer_id SERIAL PRIMARY KEY,
    content TEXT,
    "order" INTEGER,
    attempt_id INTEGER NOT NULL,
    question_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: CHOICE
-- Description: Snapshot of options at the time of student's attempt
CREATE TABLE IF NOT EXISTS choice (
    choice_id SERIAL PRIMARY KEY,
    value TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    correct BOOLEAN DEFAULT FALSE,
    selected BOOLEAN DEFAULT FALSE,
    answer_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: ANSWER_CHOICE
-- Description: Junction table for answer-choice many-to-many relationship
CREATE TABLE IF NOT EXISTS answer_choice (
    answer_id INTEGER NOT NULL,
    choice_id INTEGER NOT NULL,
    PRIMARY KEY (answer_id, choice_id)
);

-- ============================================================================
-- 7. FEEDBACK TABLE
-- ============================================================================

-- Table: FEEDBACK
-- Description: Communication between tutors and students about a course
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tutor_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL
);

-- ============================================================================
-- 8. ADD UNIQUE CONSTRAINTS
-- ============================================================================

ALTER TABLE admin ADD CONSTRAINT uk_admin_username UNIQUE (username);
ALTER TABLE tutor ADD CONSTRAINT uk_tutor_username UNIQUE (username);
ALTER TABLE student ADD CONSTRAINT uk_student_username UNIQUE (username);

-- ============================================================================
-- 9. ADD FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- Course foreign keys
ALTER TABLE course
    ADD CONSTRAINT fk_course_tutor
    FOREIGN KEY (tutor_id) REFERENCES tutor(tutor_id) ON DELETE CASCADE;

-- Enrollment foreign keys
ALTER TABLE enrollment
    ADD CONSTRAINT fk_enrollment_student
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE;

ALTER TABLE enrollment
    ADD CONSTRAINT fk_enrollment_course
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE;

-- Material foreign keys
ALTER TABLE material
    ADD CONSTRAINT fk_material_course
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE;

-- Assignment foreign keys
ALTER TABLE assignment
    ADD CONSTRAINT fk_assignment_course
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE;

-- Submission foreign keys
ALTER TABLE submission
    ADD CONSTRAINT fk_submission_student
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE;

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
ALTER TABLE option
    ADD CONSTRAINT fk_option_question
    FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE;

-- Attempt foreign keys
ALTER TABLE attempt
    ADD CONSTRAINT fk_attempt_student
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE;

ALTER TABLE attempt
    ADD CONSTRAINT fk_attempt_quiz
    FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id) ON DELETE CASCADE;

ALTER TABLE attempt
    ADD CONSTRAINT fk_attempt_test
    FOREIGN KEY (test_id) REFERENCES test(test_id) ON DELETE CASCADE;

-- Answer foreign keys
ALTER TABLE answer
    ADD CONSTRAINT fk_answer_attempt
    FOREIGN KEY (attempt_id) REFERENCES attempt(attempt_id) ON DELETE CASCADE;

ALTER TABLE answer
    ADD CONSTRAINT fk_answer_question
    FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE SET NULL;

-- Choice foreign keys
ALTER TABLE choice
    ADD CONSTRAINT fk_choice_answer
    FOREIGN KEY (answer_id) REFERENCES answer(answer_id) ON DELETE CASCADE;

-- Answer_Choice foreign keys
ALTER TABLE answer_choice
    ADD CONSTRAINT fk_answer_choice_answer
    FOREIGN KEY (answer_id) REFERENCES answer(answer_id) ON DELETE CASCADE;

ALTER TABLE answer_choice
    ADD CONSTRAINT fk_answer_choice_choice
    FOREIGN KEY (choice_id) REFERENCES choice(choice_id) ON DELETE CASCADE;

-- Feedback foreign keys
ALTER TABLE feedback
    ADD CONSTRAINT fk_feedback_tutor
    FOREIGN KEY (tutor_id) REFERENCES tutor(tutor_id) ON DELETE CASCADE;

ALTER TABLE feedback
    ADD CONSTRAINT fk_feedback_student
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE;

ALTER TABLE feedback
    ADD CONSTRAINT fk_feedback_course
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE;

-- ============================================================================
-- 10. ADD CHECK CONSTRAINTS
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
    ADD CONSTRAINT check_attempt_type
    CHECK (
        (quiz_id IS NOT NULL AND test_id IS NULL) OR
        (quiz_id IS NULL AND test_id IS NOT NULL)
    );

ALTER TABLE attempt
    ADD CONSTRAINT check_attempt_dates
    CHECK (end_at IS NULL OR start_at <= end_at);

-- ============================================================================
-- 11. CREATE INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- User table indexes
CREATE INDEX idx_admin_username ON admin(username);
CREATE INDEX idx_tutor_username ON tutor(username);
CREATE INDEX idx_student_username ON student(username);

-- Course-related indexes
CREATE INDEX idx_course_tutor ON course(tutor_id);
CREATE INDEX idx_course_dates ON course(start_at, end_at);
CREATE INDEX idx_enrollment_student ON enrollment(student_id);
CREATE INDEX idx_enrollment_course ON enrollment(course_id);

-- Material and Assignment indexes
CREATE INDEX idx_material_course ON material(course_id);
CREATE INDEX idx_assignment_course ON assignment(course_id);
CREATE INDEX idx_submission_student ON submission(student_id);
CREATE INDEX idx_submission_assignment ON submission(assignment_id);

-- Assessment indexes
CREATE INDEX idx_exam_course ON exam(course_id);
CREATE INDEX idx_quiz_course ON quiz(course_id);
CREATE INDEX idx_quiz_level ON quiz(level_codename);
CREATE INDEX idx_question_test ON question(test_id);
CREATE INDEX idx_option_question ON option(question_id);

-- Attempt and Answer indexes
CREATE INDEX idx_attempt_student ON attempt(student_id);
CREATE INDEX idx_attempt_quiz ON attempt(quiz_id);
CREATE INDEX idx_attempt_test ON attempt(test_id);
CREATE INDEX idx_answer_attempt ON answer(attempt_id);
CREATE INDEX idx_choice_answer ON choice(answer_id);

-- Feedback indexes
CREATE INDEX idx_feedback_tutor ON feedback(tutor_id);
CREATE INDEX idx_feedback_student ON feedback(student_id);
CREATE INDEX idx_feedback_course ON feedback(course_id);

-- ============================================================================
-- 12. INSERT SAMPLE DATA (Optional - for development/testing)
-- ============================================================================

-- Insert sample levels
INSERT INTO level (codename, name, description) VALUES
    ('BEGINNER', 'Beginner', 'Entry-level difficulty'),
    ('INTERMEDIATE', 'Intermediate', 'Medium difficulty'),
    ('ADVANCED', 'Advanced', 'High difficulty'),
    ('EXPERT', 'Expert', 'Expert-level difficulty')
ON CONFLICT (codename) DO NOTHING;

-- ============================================================================
-- 13. CREATE FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers using ALTER TABLE equivalent approach
CREATE TRIGGER update_admin_updated_at
    BEFORE UPDATE ON admin
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutor_updated_at
    BEFORE UPDATE ON tutor
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_updated_at
    BEFORE UPDATE ON student
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_material_updated_at
    BEFORE UPDATE ON material
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submission_updated_at
    BEFORE UPDATE ON submission
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 14. ADD COMMENTS ON TABLES AND COLUMNS
-- ============================================================================

COMMENT ON TABLE admin IS 'System administrators with full access privileges';
COMMENT ON TABLE tutor IS 'Instructors who create and manage courses';
COMMENT ON TABLE student IS 'Learners who enroll in courses and complete assessments';
COMMENT ON TABLE level IS 'Difficulty levels for quizzes';
COMMENT ON TABLE course IS 'Main course entity containing learning materials and assessments';
COMMENT ON TABLE enrollment IS 'Junction table for student-course enrollment';
COMMENT ON TABLE material IS 'Learning materials within courses';
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
COMMENT ON TABLE answer_choice IS 'Junction table for answer-choice relationship';
COMMENT ON TABLE feedback IS 'Communication between tutors and students about courses';

-- ============================================================================
-- 15. GRANT PERMISSIONS
-- ============================================================================

-- Grant permissions (adjust based on your user setup)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

-- ============================================================================
-- END OF SCHEMA INITIALIZATION
-- ============================================================================

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE 'IntelliLearn database schema initialized successfully!';
    RAISE NOTICE 'Total tables created: 19';
    RAISE NOTICE 'Foreign keys: 20';
    RAISE NOTICE 'Check constraints: 5';
    RAISE NOTICE 'Triggers: 5';
END $$;
