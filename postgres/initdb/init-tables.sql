/* * SQL Script cho Hệ thống Quản lý Học tập (LMS)
 * Cú pháp: PostgreSQL
 * Kiểu khóa chính: uuid (native)
 */

-- ==== CẤP 0: BẢNG KHÔNG CÓ PHỤ THUỘC (KHÓA NGOẠI) ====

DROP TABLE IF EXISTS "admin" CASCADE;
CREATE TABLE "admin" (
    "admin_id" uuid PRIMARY KEY DEFAULT gen_random_uuid()
);

DROP TABLE IF EXISTS "tutor" CASCADE;
CREATE TABLE "tutor" (
    "tutor_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(255)
);

DROP TABLE IF EXISTS "student" CASCADE;
CREATE TABLE "student" (
    "student_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(255),
    "timestamp" TIMESTAMPTZ DEFAULT NOW()
);

DROP TABLE IF EXISTS "level" CASCADE;
CREATE TABLE "level" (
    "codename" VARCHAR(50) PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS "test" CASCADE;
CREATE TABLE "test" (
    "test_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "start_at" TIMESTAMPTZ,
    "end_at" TIMESTAMPTZ,
    "duration" INT -- Thời lượng (tính bằng phút)
);

DROP TABLE IF EXISTS "choice" CASCADE;
CREATE TABLE "choice" (
    "choice_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "value" VARCHAR(255),
    "order_index" INT,
    "correct" BOOLEAN DEFAULT FALSE,
    "selected" BOOLEAN DEFAULT FALSE
);

-- ==== CẤP 1: BẢNG PHỤ THUỘC CẤP 1 ====

DROP TABLE IF EXISTS "course" CASCADE;
CREATE TABLE "course" (
    "course_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "start_at" TIMESTAMPTZ,
    "end_at" TIMESTAMPTZ,
    "tutor_id" uuid NOT NULL,
    FOREIGN KEY ("tutor_id") REFERENCES "tutor"("tutor_id") ON DELETE RESTRICT
);

DROP TABLE IF EXISTS "question" CASCADE;
CREATE TABLE "question" (
    "question_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "test_id" uuid,
    FOREIGN KEY ("test_id") REFERENCES "test"("test_id") ON DELETE CASCADE
);

-- ==== CẤP 2: BẢNG PHỤ THUỘC CẤP 2 ====

DROP TABLE IF EXISTS "enrollment" CASCADE;
CREATE TABLE "enrollment" (
    "student_id" uuid NOT NULL,
    "course_id" uuid NOT NULL,
    "timestamp" TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY ("student_id", "course_id"),
    FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE CASCADE,
    FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE
);

DROP TABLE IF EXISTS "material" CASCADE;
CREATE TABLE "material" (
    "material_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ,
    "course_id" uuid NOT NULL,
    FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE
);

DROP TABLE IF EXISTS "assignment" CASCADE;
CREATE TABLE "assignment" (
    "assignment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "instruction" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "start_at" TIMESTAMPTZ,
    "end_at" TIMESTAMPTZ,
    "grading_guidelines" TEXT,
    "course_id" uuid NOT NULL,
    FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE
);

DROP TABLE IF EXISTS "exam" CASCADE;
CREATE TABLE "exam" (
    "exam_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "entrance" BOOLEAN DEFAULT FALSE,
    "course_id" uuid NOT NULL,
    FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE
);

DROP TABLE IF EXISTS "quiz" CASCADE;
CREATE TABLE "quiz" (
    "quiz_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "course_id" uuid NOT NULL,
    "level_codename" VARCHAR(50) NOT NULL,
    FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE,
    FOREIGN KEY ("level_codename") REFERENCES "level"("codename") ON DELETE RESTRICT
);

DROP TABLE IF EXISTS "feedback" CASCADE;
CREATE TABLE "feedback" (
    "feedback_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "content" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "tutor_id" uuid NOT NULL,
    "student_id" uuid NOT NULL,
    "course_id" uuid NOT NULL,
    FOREIGN KEY ("tutor_id") REFERENCES "tutor"("tutor_id") ON DELETE RESTRICT,
    FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE CASCADE,
    FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE
);

DROP TABLE IF EXISTS "option" CASCADE;
CREATE TABLE "option" (
    "option_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "value" VARCHAR(255), -- Giá trị hiển thị, vd: A, B, C
    "order_index" INT,
    "correct" BOOLEAN DEFAULT FALSE,
    "question_id" uuid NOT NULL,
    FOREIGN KEY ("question_id") REFERENCES "question"("question_id") ON DELETE CASCADE
);

-- ==== CẤP 3: BẢNG PHỤ THUỘC CẤP 3 ====

DROP TABLE IF EXISTS "submission" CASCADE;
CREATE TABLE "submission" (
    "submission_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "content" TEXT,
    "file_name" VARCHAR(255),
    "score" NUMERIC(5, 2),
    "feedback" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "student_id" uuid NOT NULL,
    "assignment_id" uuid NOT NULL,
    FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE CASCADE,
    FOREIGN KEY ("assignment_id") REFERENCES "assignment"("assignment_id") ON DELETE CASCADE
);

DROP TABLE IF EXISTS "attempt" CASCADE;
CREATE TABLE "attempt" (
    "attempt_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "score" NUMERIC(5, 2),
    "start_at" TIMESTAMPTZ DEFAULT NOW(),
    "end_at" TIMESTAMPTZ,
    "completed" BOOLEAN DEFAULT FALSE,
    "student_id" uuid NOT NULL,
    "quiz_id" uuid,
    "test_id" uuid,
    FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE CASCADE,
    FOREIGN KEY ("quiz_id") REFERENCES "quiz"("quiz_id") ON DELETE SET NULL,
    FOREIGN KEY ("test_id") REFERENCES "test"("test_id") ON DELETE SET NULL
);

-- ==== CẤP 4: BẢNG PHỤ THUỘC CẤP 4 ====

DROP TABLE IF EXISTS "answer" CASCADE;
CREATE TABLE "answer" (
    "answer_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "content" TEXT, -- Dùng cho câu hỏi tự luận
    "order_index" INT,
    "attempt_id" uuid NOT NULL,
    FOREIGN KEY ("attempt_id") REFERENCES "attempt"("attempt_id") ON DELETE CASCADE
);

-- ==== CẤP 5: BẢNG LIÊN KẾT (JOIN TABLES) ====

DROP TABLE IF EXISTS "answer_choice" CASCADE;
CREATE TABLE "answer_choice" (
    "answer_id" uuid NOT NULL,
    "choice_id" uuid NOT NULL,
    PRIMARY KEY ("answer_id", "choice_id"),
    FOREIGN KEY ("answer_id") REFERENCES "answer"("answer_id") ON DELETE CASCADE,
    FOREIGN KEY ("choice_id") REFERENCES "choice"("choice_id") ON DELETE CASCADE
);