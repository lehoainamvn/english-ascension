# Kế hoạch: Nâng cấp Quiz & Tạo trang Class

## Mô tả

Nâng cấp trang **Document Learning** với các tính năng mới:
1. **Quiz tùy chỉnh**: Người dùng chọn loại câu hỏi (Trắc nghiệm / Điền vào chỗ trống) và số lượng câu
2. **Trang Class**: Tạo lớp học, mời thành viên, tổ chức thi thử thách có bảng xếp hạng

---

## Thay đổi đề xuất

### 1. Backend – Nâng cấp Quiz tùy chỉnh

#### [MODIFY] [UserDocumentController.java](file:///d:/ThucTap_VNPT/english-ascension/backend/src/main/java/com/englishascension/backend/controller/UserDocumentController.java)
- Thêm endpoint `POST /api/documents/{docId}/regenerate-quiz` nhận tham số:
  - `questionCount` (số câu, default 5)
  - `questionType` (MULTIPLE_CHOICE | FILL_IN_BLANK | MIXED, default MIXED)

#### [MODIFY] [UserDocumentService.java](file:///d:/ThucTap_VNPT/english-ascension/backend/src/main/java/com/englishascension/backend/service/UserDocumentService.java)
- Thêm method `regenerateQuiz(docId, userId, count, type)` gọi lại AI với prompt tùy chỉnh

---

### 2. Backend – Tính năng Class

#### [NEW] ClassRoom.java — Model lớp học
```
- id, name, description, code (unique 6 chữ số để mời), createdBy (User)
- createdAt, updatedAt
```

#### [NEW] ClassMember.java — Thành viên trong lớp
```
- id, classRoom (ManyToOne), user (ManyToOne)
- role (OWNER | MEMBER), joinedAt
```

#### [NEW] ClassQuiz.java — Bộ câu hỏi của class
```
- id, classRoom (ManyToOne), title, description
- questions (List<Question> hoặc JSON)
- createdBy (User), isActive, createdAt
```

#### [NEW] ClassQuizAttempt.java — Kết quả thi của thành viên
```
- id, classQuiz (ManyToOne), user (ManyToOne)
- score, totalQuestions, completedAt
- answers (JSON text)
```

#### [NEW] ClassRoomController.java
- `POST /api/classes` — Tạo class mới
- `GET /api/classes` — Danh sách class của tôi
- `GET /api/classes/{id}` — Chi tiết class
- `POST /api/classes/join` — Tham gia class bằng code
- `DELETE /api/classes/{id}` — Xóa class (owner only)
- `DELETE /api/classes/{id}/members/{userId}` — Xóa thành viên
- `POST /api/classes/{classId}/quizzes` — Tạo quiz cho class
- `PUT /api/classes/{classId}/quizzes/{quizId}` — Sửa quiz
- `DELETE /api/classes/{classId}/quizzes/{quizId}` — Xóa quiz
- `POST /api/classes/{classId}/quizzes/{quizId}/submit` — Nộp bài thi
- `GET /api/classes/{classId}/quizzes/{quizId}/leaderboard` — Bảng xếp hạng

#### [NEW] ClassRoomService.java
#### [NEW] ClassRoomRepository.java
#### [NEW] ClassMemberRepository.java
#### [NEW] ClassQuizRepository.java
#### [NEW] ClassQuizAttemptRepository.java

---

### 3. Frontend – Nâng cấp Quiz tùy chỉnh

#### [MODIFY] [ai-document-learning.ts](file:///d:/ThucTap_VNPT/english-ascension/frontend/src/app/components/ai-document-learning/ai-document-learning.ts)
- Thêm UI tùy chỉnh quiz ngay trước nút nộp bài:
  - Dropdown chọn loại: Trắc nghiệm / Điền vào chỗ trống / Hỗn hợp
  - Slider hoặc input chọn số câu: 5, 10, 15, 20
  - Nút "Tạo lại quiz" → gọi API regenerate

#### [MODIFY] [study-ai.service.ts](file:///d:/ThucTap_VNPT/english-ascension/frontend/src/app/services/study-ai.service.ts)
- Thêm method `regenerateQuiz(docId, count, type)`

---

### 4. Frontend – Trang Class

#### [NEW] `/frontend/src/app/components/classroom/classroom.ts`
Trang chính quản lý class, gồm 2 phần:
- **Panel trái**: Danh sách class tôi tham gia/tạo, nút tạo class, nhập code mời
- **Panel phải**: Chi tiết class được chọn với các tab:
  - **Thành viên**: Danh sách thành viên, nút xóa (owner), hiển thị code mời
  - **Bộ đề thi**: Danh sách quiz, tạo/sửa/xóa (owner), tham gia thi (member)
  - **Bảng xếp hạng**: Top điểm của tất cả thành viên theo từng quiz

#### [NEW] `/frontend/src/app/services/classroom.service.ts`
- Các method gọi API class

#### [MODIFY] [app.routes.ts](file:///d:/ThucTap_VNPT/english-ascension/frontend/src/app/app.routes.ts)
- Thêm route `classroom` → `ClassroomComponent`

#### [MODIFY] Sidebar/Navbar
- Thêm link điều hướng đến `/classroom`

---

## Kế hoạch xác minh

### Build
- Chạy `mvn compile` để kiểm tra backend
- Angular tự rebuild khi lưu file

### Manual
- Test tạo class, lấy code mời, join bằng code khác
- Test tạo quiz, nộp bài, xem bảng xếp hạng
- Test quiz tùy chỉnh (chọn loại + số câu)

---

## Câu hỏi mở

> [!IMPORTANT]
> **Quiz của Class**: Quiz trong Class được tạo thủ công (owner nhập câu hỏi tay) hay dùng AI sinh từ văn bản? 
> → Đề xuất: **Hỗn hợp** – Owner có thể nhập tay HOẶC import quiz từ tài liệu đã phân tích AI

> [!NOTE]
> **Số câu quiz tùy chỉnh**: Hiện tại backend dùng Groq AI để sinh câu hỏi. Việc sinh lại quiz tốn thêm token AI. Đây là giải pháp chấp nhận được không?

