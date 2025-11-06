Chào bạn, đây là bảng ánh xạ (mapping) từ Sơ đồ Quan hệ Thực thể Mở rộng (EERD) bạn cung cấp sang mô hình quan hệ (bảng CSDL) và phần mô tả chi tiết.

## Bảng Ánh xạ (Relational Schema Mapping)

Dưới đây là danh sách các bảng (quan hệ) được suy ra từ EERD.
**PK** = Khóa Chính (Primary Key)
*FK* = Khóa Ngoại (Foreign Key)

1.  **ADMIN**
    * **AdminID** (PK)
    * Username
    * Password

2.  **TUTOR**
    * **TutorID** (PK)
    * Username
    * FullName
    * Password

3.  **STUDENT**
    * **StudentID** (PK)
    * Username
    * FullName
    * Password
    * Timestamp

4.  **LEVEL**
    * **Codename** (PK)
    * Name

5.  **COURSE**
    * **CourseID** (PK)
    * Name
    * Description
    * CreatedAt
    * StartAt
    * EndAt
    * *TutorID* (FK tham chiếu đến TUTOR.TutorID)

6.  **ENROLLMENT** (Bảng liên kết cho quan hệ N:N "ENROLLS")
    * ***StudentID*** (PK, FK tham chiếu đến STUDENT.StudentID)
    * ***CourseID*** (PK, FK tham chiếu đến COURSE.CourseID)

7.  **MATERIAL**
    * **MaterialID** (PK)
    * Name
    * Content
    * CreatedAt
    * UpdatedAt
    * *CourseID* (FK tham chiếu đến COURSE.CourseID)

8.  **ASSIGNMENT**
    * **AssignmentID** (PK)
    * Name
    * Description
    * Instruction
    * CreatedAt
    * StartAt
    * EndAt
    * GradingGuidelines
    * *CourseID* (FK tham chiếu đến COURSE.CourseID)

9.  **SUBMISSION** (Thực thể yếu/liên kết từ "SUBMITS")
    * **SubmissionID** (PK)
    * Content
    * FileName
    * CreatedAt
    * *StudentID* (FK tham chiếu đến STUDENT.StudentID)
    * *AssignmentID* (FK tham chiếu đến ASSIGNMENT.AssignmentID)

10. **EXAM**
    * **ExamID** (PK)
    * Name
    * Description
    * CreatedAt
    * Entrance
    * *CourseID* (FK tham chiếu đến COURSE.CourseID)

11. **TEST**
    * **TestID** (PK)
    * Name
    * Description
    * CreatedAt
    * StartAt
    * EndAt
    * Duration

12. **QUIZ**
    * **QuizID** (PK)
    * Value
    * StartAt
    * *CourseID* (FK tham chiếu đến COURSE.CourseID)
    * *LevelCodename* (FK tham chiếu đến LEVEL.Codename)

13. **FEEDBACK**
    * **FeedbackID** (PK)
    * Content
    * CreatedAt
    * *TutorID* (FK tham chiếu đến TUTOR.TutorID)
    * *StudentID* (FK tham chiếu đến STUDENT.StudentID)
    * *CourseID* (FK tham chiếu đến COURSE.CourseID)

14. **QUESTION**
    * **QuestionID** (PK)
    * Content
    * Correct
    * *QuizID* (FK tham chiếu đến QUIZ.QuizID, có thể NULL)
    * *TestID* (FK tham chiếu đến TEST.TestID, có thể NULL)

15. **OPTION**
    * **OptionID** (PK - *Giả định vì EERD thiếu PK cho thực thể này*)
    * Value
    * Order
    * Content
    * *QuestionID* (FK tham chiếu đến QUESTION.QuestionID)

16. **ATTEMPT**
    * **AttemptID** (PK)
    * Score
    * Content
    * StartAt
    * EndAt
    * Completed
    * *StudentID* (FK tham chiếu đến STUDENT.StudentID)
    * *QuizID* (FK tham chiếu đến QUIZ.QuizID, có thể NULL)
    * *TestID* (FK tham chiếu đến TEST.TestID, có thể NULL)

17. **ANSWER**
    * **AnswerID** (PK)
    * Content
    * Order
    * Correct
    * Selected
    * *AttemptID* (FK tham chiếu đến ATTEMPT.AttemptID)
    * *QuestionID* (FK tham chiếu đến QUESTION.QuestionID)

18. **CHOICE**
    * **ChoiceID** (PK - *Giả định vì EERD thiếu PK*)
    * Value
    * Order
    * Correct
    * Selected

19. **ANSWER\_CHOICE** (Bảng liên kết cho quan hệ N:N "INCLUDES")
    * ***AnswerID*** (PK, FK tham chiếu đến ANSWER.AnswerID)
    * ***ChoiceID*** (PK, FK tham chiếu đến CHOICE.ChoiceID)

---

## Mô tả (Description)

Sơ đồ này mô tả một hệ thống Quản lý Học tập (Learning Management System - LMS) khá chi tiết.

### Các thực thể chính và vai trò

1.  **Người dùng (Users):**
    * **STUDENT**: Học viên tham gia các khóa học.
    * **TUTOR**: Giảng viên, người tạo và quản lý khóa học.
    * **ADMIN**: Quản trị viên hệ thống (dường như là một thực thể độc lập trong sơ đồ này).

2.  **Nội dung khóa học (Course Content):**
    * **COURSE** là thực thể trung tâm. Mỗi `COURSE` được tạo bởi một `TUTOR`.
    * Một `COURSE` bao gồm nhiều `MATERIAL` (tài liệu), `ASSIGNMENT` (bài tập lớn), `QUIZ` (bài kiểm tra nhanh), `TEST` (bài kiểm tra), và `EXAM` (bài thi).
    * `QUIZ` được liên kết với một `LEVEL` (cấp độ).

3.  **Tương tác của Học viên (Student Interaction):**
    * **ENROLLS**: Học viên (`STUDENT`) có thể đăng ký (`ENROLLS`) nhiều khóa học (`COURSE`), và một khóa học có nhiều học viên. Đây là quan hệ N:N, được ánh xạ thành bảng `ENROLLMENT`.
    * **SUBMITS**: Học viên nộp bài (`SUBMISSION`) cho một `ASSIGNMENT`. `SUBMISSION` là một thực thể yếu/liên kết, phụ thuộc vào `STUDENT` và `ASSIGNMENT`.
    * **ATTEMPT**: Học viên có các lượt làm bài (`ATTEMPT`) cho `QUIZ` hoặc `TEST`. Sơ đồ chỉ ra một `ATTEMPT` chỉ thuộc về 1 `QUIZ` *hoặc* 1 `TEST`.
    * **FEEDBACK**: Giảng viên (`TUTOR`) đưa ra phản hồi (`FEEDBACK`) cho học viên (`STUDENT`) về một khóa học (`COURSE`).

### Cấu trúc Bài kiểm tra (Quiz/Test Structure)

Đây là phần phức tạp nhất của sơ đồ:

* Một `QUIZ` hoặc `TEST` bao gồm nhiều `QUESTION` (câu hỏi).
* Mỗi `QUESTION` có nhiều `OPTION` (các lựa chọn có thể có, ví dụ: A, B, C, D).
* Khi một `STUDENT` thực hiện một `ATTEMPT` (lần làm bài):
    * Hệ thống sẽ tạo ra nhiều `ANSWER` (câu trả lời của học viên) cho lần làm bài đó.
    * Mỗi `ANSWER` liên kết với một `ATTEMPT` và một `QUESTION` cụ thể.

### Lưu ý về sự mơ hồ trong Sơ đồ

Phần `ANSWER` và `CHOICE` trong EERD được mô hình hóa khá rắc rối và có vẻ dư thừa.

* Sơ đồ có cả `OPTION` (lựa chọn cho câu hỏi) và `CHOICE` (lựa chọn cho câu trả lời).
* `ANSWER` lại có quan hệ N:N với `CHOICE`.
* Cả `ANSWER` và `CHOICE` đều có các thuộc tính `Correct` và `Selected`.

**Phân tích hợp lý hơn:**
Trong một thiết kế chuẩn, bảng `ANSWER` (câu trả lời của sinh viên) chỉ cần lưu trữ nội dung (nếu là câu tự luận) hoặc một khóa ngoại tham chiếu đến `OPTION` (nếu là câu trắc nghiệm) để chỉ ra lựa chọn mà sinh viên đã chọn. Việc tồn tại cả `CHOICE` và `OPTION` với các thuộc tính trùng lặp là không tối ưu và gây nhầm lẫn.

Tuy nhiên, bảng ánh xạ ở trên được thực hiện **chính xác theo những gì EERD đã vẽ**, bao gồm cả bảng `CHOICE` và bảng liên kết `ANSWER_CHOICE`.