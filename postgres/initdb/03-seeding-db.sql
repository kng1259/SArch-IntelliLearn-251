START TRANSACTION;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure levels exist
INSERT INTO "level" (codename, "name") VALUES
  ('HARD', 'Hard'),
  ('NORMAL', 'Normal'),
  ('EASY', 'Easy')
ON CONFLICT (codename) DO NOTHING;

-- Provided concrete UUIDs
-- Tutor/Admin: 6aa5ed35-91b9-4cd6-80d3-9f4dff25846d
-- Student:    49616e7e-ad5d-4312-83ad-294facc849b2

-- Course 1: Intro to SQL
INSERT INTO course (course_id, name, description, created_at, start_at, end_at, tutor_id) VALUES
  ('2f8b3c9e-3a27-4d3b-9f2a-1a2b3c4d5e6f', 'Intro to SQL', 'A beginner course about SQL and relational databases.', NOW(), NOW(), NOW() + INTERVAL '30 days', '6aa5ed35-91b9-4cd6-80d3-9f4dff25846d')
ON CONFLICT (course_id) DO NOTHING;

-- Material for Course 1: content is a URL (file location)
INSERT INTO material (material_id, "name", content, created_at, updated_at, course_id) VALUES
  ('3e9c4d2b-4b38-4c3d-a1b2-2b3c4d5e6f70', 'Lecture 1: Basics', 'https://example.com/materials/intro-to-sql/lecture1.mp4', NOW(), NOW(), '2f8b3c9e-3a27-4d3b-9f2a-1a2b3c4d5e6f')
ON CONFLICT (material_id) DO NOTHING;

-- Assignment for Course 1: instruction and grading_guidelines are URLs
INSERT INTO assignment (assignment_id, "name", "description", instruction, created_at, start_at, end_at, grading_guidelines, course_id) VALUES
  ('4f1d2e3c-5a46-4b2e-b2c3-3c4d5e6f7a80', 'Homework 1', 'Basic SQL queries', 'https://example.com/assignments/intro-sql/homework1/instruction.md', NOW(), NOW(), NOW() + INTERVAL '7 days', 'https://example.com/assignments/intro-sql/homework1/grading.md', '2f8b3c9e-3a27-4d3b-9f2a-1a2b3c4d5e6f')
ON CONFLICT (assignment_id) DO NOTHING;

-- Submission (student submission for Homework 1)
INSERT INTO submission (content, file_name, score, feedback, created_at, student_id, assignment_id) VALUES
  ('SELECT * FROM students;', 'homework1.sql', 85.0, 'Good job; minor issues with WHERE clauses.', NOW(), '49616e7e-ad5d-4312-83ad-294facc849b2', '4f1d2e3c-5a46-4b2e-b2c3-3c4d5e6f7a80')
ON CONFLICT (student_id, assignment_id, file_name) DO NOTHING;

-- Enrollment for Course 1
INSERT INTO enrollment (student_id, course_id, "timestamp") VALUES
  ('49616e7e-ad5d-4312-83ad-294facc849b2', '2f8b3c9e-3a27-4d3b-9f2a-1a2b3c4d5e6f', NOW())
ON CONFLICT (student_id, course_id) DO NOTHING;

-- Test/Quiz for Course 1
INSERT INTO test (test_id, "name", "description", created_at, start_at, end_at, duration) VALUES
  ('5a2b3c4d-6c57-4a3f-c3d4-4d5e6f7a8b90', 'Quiz 1 - Basics', 'Short quiz covering lecture 1 content.', NOW(), NOW(), NOW() + INTERVAL '1 day', 15)
ON CONFLICT (test_id) DO NOTHING;

INSERT INTO exam (test_id, entrance, course_id) VALUES
  ('5a2b3c4d-6c57-4a3f-c3d4-4d5e6f7a8b90', FALSE, '2f8b3c9e-3a27-4d3b-9f2a-1a2b3c4d5e6f')
ON CONFLICT (test_id) DO NOTHING;

INSERT INTO quiz (test_id, course_id, level_codename) VALUES
  ('5a2b3c4d-6c57-4a3f-c3d4-4d5e6f7a8b90', '2f8b3c9e-3a27-4d3b-9f2a-1a2b3c4d5e6f', 'EASY')
ON CONFLICT (test_id) DO NOTHING;

INSERT INTO question (question_id, content, test_id, created_at) VALUES
  ('6b3c4d5e-7d68-4b4e-d4e5-5e6f7a8b9c01', 'What does SQL stand for?', '5a2b3c4d-6c57-4a3f-c3d4-4d5e6f7a8b90', NOW())
ON CONFLICT (question_id) DO NOTHING;

INSERT INTO "option" ("value", "order", correct, question_id, created_at) VALUES
  ('Structured Query Language', 1, TRUE, '6b3c4d5e-7d68-4b4e-d4e5-5e6f7a8b9c01', NOW()),
  ('Simple Query Language', 2, FALSE, '6b3c4d5e-7d68-4b4e-d4e5-5e6f7a8b9c01', NOW()),
  ('Sequential Query Language', 3, FALSE, '6b3c4d5e-7d68-4b4e-d4e5-5e6f7a8b9c01', NOW()),
  ('Structured Question Language', 4, FALSE, '6b3c4d5e-7d68-4b4e-d4e5-5e6f7a8b9c01', NOW())
ON CONFLICT (question_id, "order") DO NOTHING;

-- Attempt/Answer/Choice for Course 1
INSERT INTO attempt (attempt_id, score, start_at, end_at, completed, student_id, test_id) VALUES
  ('7c4d5e6f-8e79-4c5f-e5f6-6f7a8b9c0d12', 1.0, NOW(), NOW() + INTERVAL '5 minutes', TRUE, '49616e7e-ad5d-4312-83ad-294facc849b2', '5a2b3c4d-6c57-4a3f-c3d4-4d5e6f7a8b90')
ON CONFLICT (attempt_id) DO NOTHING;

INSERT INTO answer (answer_id, content, "order", attempt_id, created_at) VALUES
  ('8d5e6f70-9f8a-4d6f-f607-7a8b9c0d1e23', 'Structured Query Language', 1, '7c4d5e6f-8e79-4c5f-e5f6-6f7a8b9c0d12', NOW())
ON CONFLICT (answer_id) DO NOTHING;

INSERT INTO choice ("value", "order", correct, selected, answer_id, created_at) VALUES
  ('Structured Query Language', 1, TRUE, TRUE, '8d5e6f70-9f8a-4d6f-f607-7a8b9c0d1e23', NOW()),
  ('Simple Query Language', 2, FALSE, FALSE, '8d5e6f70-9f8a-4d6f-f607-7a8b9c0d1e23', NOW()),
  ('Sequential Query Language', 3, FALSE, FALSE, '8d5e6f70-9f8a-4d6f-f607-7a8b9c0d1e23', NOW()),
  ('Structured Question Language', 4, FALSE, FALSE, '8d5e6f70-9f8a-4d6f-f607-7a8b9c0d1e23', NOW())
ON CONFLICT (answer_id, "order") DO NOTHING;

-- Feedback for Course 1
INSERT INTO feedback (feedback_id, content, created_at, tutor_id, student_id, course_id) VALUES
  ('9e6f7081-0a9b-4e7f-0a18-8b9c0d1e2f34', 'Nice attempt on the quiz — keep practicing JOINs and WHERE filters.', NOW(), '6aa5ed35-91b9-4cd6-80d3-9f4dff25846d', '49616e7e-ad5d-4312-83ad-294facc849b2', '2f8b3c9e-3a27-4d3b-9f2a-1a2b3c4d5e6f')
ON CONFLICT (feedback_id) DO NOTHING;

-- -------------------------
-- Course 2: Advanced SQL
-- -------------------------

INSERT INTO course (course_id, name, description, created_at, start_at, end_at, tutor_id) VALUES
  ('b3f9c1d2-4e5f-46a7-88b9-1c2d3e4f5a60', 'Advanced SQL', 'Advanced techniques: window functions, CTEs, performance tuning, and indexing.', NOW(), NOW() + INTERVAL '1 day', NOW() + INTERVAL '90 days', '6aa5ed35-91b9-4cd6-80d3-9f4dff25846d')
ON CONFLICT (course_id) DO NOTHING;

-- Materials for Course 2 (URLs)
INSERT INTO material (material_id, "name", content, created_at, updated_at, course_id) VALUES
  ('c4d5e6f7-1a2b-4c3d-9e0f-2a3b4c5d6e70', 'Lecture 1: Window Functions', 'https://example.com/materials/advanced-sql/lecture1-window-functions.mp4', NOW(), NOW(), 'b3f9c1d2-4e5f-46a7-88b9-1c2d3e4f5a60')
ON CONFLICT (material_id) DO NOTHING;

INSERT INTO material (material_id, "name", content, created_at, updated_at, course_id) VALUES
  ('d5e6f7a8-2b3c-4d5e-9f01-3b4c5d6e7f81', 'Slides: Indexing & Performance', 'https://example.com/materials/advanced-sql/slides-indexing.pdf', NOW(), NOW(), 'b3f9c1d2-4e5f-46a7-88b9-1c2d3e4f5a60')
ON CONFLICT (material_id) DO NOTHING;

-- Assignment for Course 2 (URLs for instruction & grading)
INSERT INTO assignment (assignment_id, "name", "description", instruction, created_at, start_at, end_at, grading_guidelines, course_id) VALUES
  ('e6f7a8b9-3c4d-4e5f-a901-4c5d6e7f8a92', 'Homework 1 - Window Functions', 'Use window functions to produce running totals and ranks.', 'https://example.com/assignments/advanced-sql/hw1/instruction.md', NOW(), NOW() + INTERVAL '2 days', NOW() + INTERVAL '14 days', 'https://example.com/assignments/advanced-sql/hw1/grading.md', 'b3f9c1d2-4e5f-46a7-88b9-1c2d3e4f5a60')
ON CONFLICT (assignment_id) DO NOTHING;

-- Enrollment of same student to Course 2
INSERT INTO enrollment (student_id, course_id, "timestamp") VALUES
  ('49616e7e-ad5d-4312-83ad-294facc849b2', 'b3f9c1d2-4e5f-46a7-88b9-1c2d3e4f5a60', NOW())
ON CONFLICT (student_id, course_id) DO NOTHING;

-- Test/Quiz for Course 2
INSERT INTO test (test_id, "name", "description", created_at, start_at, end_at, duration) VALUES
  ('f7a8b9c0-4d5e-4f6a-b7c8-5d6e7f8a9b03', 'Quiz 1 - Window Functions', 'Quiz on window functions and ranking.', NOW(), NOW() + INTERVAL '7 days', NOW() + INTERVAL '8 days', 30)
ON CONFLICT (test_id) DO NOTHING;

INSERT INTO exam (test_id, entrance, course_id) VALUES
  ('f7a8b9c0-4d5e-4f6a-b7c8-5d6e7f8a9b03', FALSE, 'b3f9c1d2-4e5f-46a7-88b9-1c2d3e4f5a60')
ON CONFLICT (test_id) DO NOTHING;

INSERT INTO quiz (test_id, course_id, level_codename) VALUES
  ('f7a8b9c0-4d5e-4f6a-b7c8-5d6e7f8a9b03', 'b3f9c1d2-4e5f-46a7-88b9-1c2d3e4f5a60', 'NORMAL')
ON CONFLICT (test_id) DO NOTHING;

INSERT INTO question (question_id, content, test_id, created_at) VALUES
  ('0a1b2c3d-5e6f-47a8-b9c0-6d7e8f9a0b12', 'Which SQL window function would you use to compute a running total?', 'f7a8b9c0-4d5e-4f6a-b7c8-5d6e7f8a9b03', NOW())
ON CONFLICT (question_id) DO NOTHING;

INSERT INTO "option" ("value", "order", correct, question_id, created_at) VALUES
  ('SUM(...) OVER (ORDER BY ...)', 1, TRUE, '0a1b2c3d-5e6f-47a8-b9c0-6d7e8f9a0b12', NOW()),
  ('COUNT(...) OVER ()', 2, FALSE, '0a1b2c3d-5e6f-47a8-b9c0-6d7e8f9a0b12', NOW()),
  ('ROW_NUMBER() OVER (PARTITION BY ...)', 3, FALSE, '0a1b2c3d-5e6f-47a8-b9c0-6d7e8f9a0b12', NOW()),
  ('RANK() OVER ()', 4, FALSE, '0a1b2c3d-5e6f-47a8-b9c0-6d7e8f9a0b12', NOW())
ON CONFLICT (question_id, "order") DO NOTHING;

-- Student attempts Quiz 1 for Course 2
INSERT INTO attempt (attempt_id, score, start_at, end_at, completed, student_id, test_id) VALUES
  ('1b2c3d4e-6f70-48a9-b0c1-7d8e9f0a1b23', 0.75, NOW(), NOW() + INTERVAL '20 minutes', TRUE, '49616e7e-ad5d-4312-83ad-294facc849b2', 'f7a8b9c0-4d5e-4f6a-b7c8-5d6e7f8a9b03')
ON CONFLICT (attempt_id) DO NOTHING;

INSERT INTO answer (answer_id, content, "order", attempt_id, created_at) VALUES
  ('2c3d4e5f-6071-49b0-c1d2-8e9f0a1b2c34', 'SUM(...) OVER (ORDER BY ...)', 1, '1b2c3d4e-6f70-48a9-b0c1-7d8e9f0a1b23', NOW())
ON CONFLICT (answer_id) DO NOTHING;

INSERT INTO choice ("value", "order", correct, selected, answer_id, created_at) VALUES
  ('SUM(...) OVER (ORDER BY ...)', 1, TRUE, TRUE, '2c3d4e5f-6071-49b0-c1d2-8e9f0a1b2c34', NOW()),
  ('COUNT(...) OVER ()', 2, FALSE, FALSE, '2c3d4e5f-6071-49b0-c1d2-8e9f0a1b2c34', NOW()),
  ('ROW_NUMBER() OVER (PARTITION BY ...)', 3, FALSE, FALSE, '2c3d4e5f-6071-49b0-c1d2-8e9f0a1b2c34', NOW()),
  ('RANK() OVER ()', 4, FALSE, FALSE, '2c3d4e5f-6071-49b0-c1d2-8e9f0a1b2c34', NOW())
ON CONFLICT (answer_id, "order") DO NOTHING;

-- Feedback for Course 2
INSERT INTO feedback (feedback_id, content, created_at, tutor_id, student_id, course_id) VALUES
  ('3d4e5f60-7a81-4b90-c1d2-9e0f1a2b3c45', 'Strong understanding of window functions; review partitioning examples for edge cases.', NOW(), '6aa5ed35-91b9-4cd6-80d3-9f4dff25846d', '49616e7e-ad5d-4312-83ad-294facc849b2', 'b3f9c1d2-4e5f-46a7-88b9-1c2d3e4f5a60')
ON CONFLICT (feedback_id) DO NOTHING;

COMMIT;