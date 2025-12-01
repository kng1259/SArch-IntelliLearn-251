ALTER TABLE exam
    ADD CONSTRAINT fk_exam_test
        FOREIGN KEY (test_id)
            REFERENCES test (test_id);