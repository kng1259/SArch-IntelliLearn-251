ALTER TABLE quiz
    ADD CONSTRAINT fk_quiz_test
        FOREIGN KEY (test_id)
            REFERENCES test (test_id);