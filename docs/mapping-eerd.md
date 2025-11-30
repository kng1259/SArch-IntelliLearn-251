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
    * Timestamp
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
    * Score
    * Feedback
    * CreatedAt
    * *StudentID* (FK tham chiếu đến STUDENT.StudentID)
    * *AssignmentID* (FK tham chiếu đến ASSIGNMENT.AssignmentID)

10. **EXAM**
    * **ExamID** (PK)
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
    * *TestID* (FK tham chiếu đến TEST.TestID, có thể NULL)

15. **OPTION**
    * **OptionID** (PK - *Giả định vì EERD thiếu PK cho thực thể này*)
    * Value
    * Order
    * Correct
    * *QuestionID* (FK tham chiếu đến QUESTION.QuestionID)

16. **ATTEMPT**
    * **AttemptID** (PK)
    * Score
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
    * *AttemptID* (FK tham chiếu đến ATTEMPT.AttemptID)

18. **CHOICE**
    * **ChoiceID** (PK - *Giả định vì EERD thiếu PK*)
    * Value
    * Order
    * Correct
    * Selected
    * *AnswerID* (FK tham chiếu đến ANSWER.AnswerID)

19. **ANSWER\_CHOICE** (Bảng liên kết cho quan hệ N:N "INCLUDES")
    * ***AnswerID*** (PK, FK tham chiếu đến ANSWER.AnswerID)
    * ***ChoiceID*** (PK, FK tham chiếu đến CHOICE.ChoiceID)

---

Tất nhiên, đây là phần mô tả được viết lại, dựa trên những phân tích và thay đổi chính xác mà bạn đã thực hiện trong bảng ánh xạ mới:

---

## Mô tả Hệ thống (Description)

Sơ đồ này mô tả một hệ thống Quản lý Học tập (Learning Management System - LMS) với một luồng nghiệp vụ chi tiết, đặc biệt là trong việc xử lý các bài kiểm tra và câu trả lời.

### 1. Các thực thể chính và vai trò
* Hệ thống có ba vai trò người dùng rõ rệt: **ADMIN** (quản trị hệ thống), **TUTOR** (giảng viên), và **STUDENT** (học viên).
* Giảng viên (`TUTOR`) là người tạo ra các khóa học (`COURSE`).
* Học viên (`STUDENT`) có thể đăng ký (`ENROLLS`) vào nhiều khóa học.

### 2. Cấu trúc Khóa học (Course Structure)
* Thực thể trung tâm là **COURSE**, chứa các thành phần học liệu cơ bản.
* Một `COURSE` bao gồm:
    * **MATERIAL**: Các tài liệu học tập (video, pdf, v.v.).
    * **ASSIGNMENT**: Các bài tập lớn hoặc dự án.
    * **EXAM**: Các bài thi chính thức, được liên kết trực tiếp với khóa học.
    * **QUIZ**: Các bài kiểm tra nhanh, được liên kết với cả khóa học và một cấp độ (`LEVEL`).

### 3. Tương tác của Học viên (Student Interaction)
* **Học tập**: Học viên đăng ký (`ENROLLMENT`) để truy cập nội dung khóa học.
* **Nộp bài**: Học viên nộp bài (`SUBMISSION`) cho các `ASSIGNMENT`. Trong thiết kế này, `SUBMISSION` là nơi lưu trữ `Score` (điểm số) và `Feedback` (phản hồi) cho bài nộp đó.
* **Làm bài**: Học viên thực hiện các lượt làm bài (`ATTEMPT`). Một `ATTEMPT` có thể thuộc về một `QUIZ` hoặc một `TEST`.
* **Phản hồi**: Giảng viên và học viên có thể trao đổi `FEEDBACK` (phản hồi chung) trong một `COURSE`.

### 4. Cấu trúc Bài kiểm tra (Assessment Structure)
* **Ngân hàng Câu hỏi**: Thực thể **TEST** hoạt động như một "ngân hàng" hoặc "bộ đề", chứa tên, mô tả và thời lượng.
* **Câu hỏi & Lựa chọn (Template)**:
    * Mỗi `TEST` bao gồm nhiều **QUESTION** (câu hỏi).
    * Mỗi `QUESTION` có nhiều **OPTION** (lựa chọn).
    * **Rất quan trọng**: Thuộc tính **`Correct`** (đúng/sai) được đặt trong thực thể **`OPTION`**. Điều này định nghĩa đáp án chính xác cho câu hỏi ngay tại thiết kế mẫu.

### 5. Cấu trúc Trả lời (Answer Structure)
Phần này mô tả cách hệ thống lưu lại câu trả lời của sinh viên, như theo kiểu "snapshot" (sao chụp lại dữ liệu tại thời điểm làm bài):

* Khi sinh viên thực hiện một **ATTEMPT** (lượt làm bài), hệ thống sẽ tạo ra các **ANSWER** (có thể tương ứng với mỗi câu hỏi được trả lời).
* Phần này vẫn giữ lại cấu trúc phức tạp từ EERD:
    * **OPTION** là các lựa chọn *mẫu* (template) đi kèm với `QUESTION`.
    * **CHOICE** có vẻ là một "bản sao" (snapshot) của các lựa chọn tại thời điểm sinh viên làm bài.
    * Thông qua bảng `ANSWER_CHOICE` (mục 19), một `ANSWER` có thể liên kết với nhiều `CHOICE`.
    * `CHOICE` lưu trữ cả trạng thái **`Correct`** (được sao chép từ `OPTION`) và **`Selected`** (đánh dấu việc sinh viên đã chọn lựa chọn này).