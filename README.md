# 🏆 English Ascension - Nền tảng học tiếng Anh RPG & AI-Powered

> **Learn • Level Up • Evolve**
>
> English Ascension là một nền tảng học tiếng Anh độc đáo ứng dụng trí tuệ nhân tạo (AI), hệ thống biểu đồ tri thức (Knowledge Graph) kết hợp với các cơ chế của thể loại game nhập vai (RPG) và Gamification. Thay vì chỉ học từ vựng một cách khô khan, người dùng sẽ tạo nhân vật riêng, nâng cấp, tiến hóa, tham gia các trận chiến từ vựng và chinh phục các mốc CEFR/TOEIC thông qua lộ trình học tập cá nhân hóa.

---

## 🗺️ Bản đồ Tính năng (Key Features)

### 1. Đăng ký & Tùy chỉnh nhân vật (Character Customization)
* **Giao diện Glassmorphism hiện đại:** Màn hình đăng nhập/đăng ký đẹp mắt, trực quan và tối ưu hóa trải nghiệm trên mọi thiết bị.
* **Đăng nhập nhanh bằng Google (Google Sign-In):** Tích hợp Google Identity Services, cho phép đăng ký và đăng nhập nhanh chóng thông qua tài khoản Google một cách an toàn và bảo mật.
* **Quên mật khẩu & Khôi phục bằng OTP Email:** Cho phép người dùng yêu cầu đặt lại mật khẩu bằng cách gửi mã xác nhận OTP gồm 6 chữ số qua Email (sử dụng JavaMailSender với dịch vụ SMTP của Gmail). Mã OTP có thời hạn hiệu lực 15 phút.
* **Tạo hình nhân vật:** Tự do tùy chỉnh giới tính, kiểu tóc, màu tóc, khuôn mặt, trang phục và phụ kiện.
* **Tiến hóa nhân vật (Evolution System):** Nhân vật sẽ tự động thay đổi ngoại hình, danh hiệu và hiệu ứng khi đạt các mốc cấp độ học tập:
  * *Lv 1 - 19:* **Novice** (Tập sự)
  * *Lv 20 - 39:* **Student** (Học viên)
  * *Lv 40 - 59:* **Scholar** (Học giả)
  * *Lv 60 - 79:* **Master** (Bậc thầy)
  * *Lv 80 - 99:* **Grand Sage** (Đại hiền triết)
  * *Lv 100:* **Language Legend** (Huyền thoại ngôn ngữ)

### 2. Đánh giá Đầu vào & Lộ trình Cá nhân hóa (Placement Test & AI Roadmap)
* **Placement Test:** Bộ câu hỏi kiểm tra nhanh gồm 4 kỹ năng (Vocabulary, Grammar, Listening, Reading).
* **AI Analysis:** Đánh giá cấp độ CEFR hiện tại (A1 - C2), ước lượng điểm TOEIC tương đương và phân tích điểm mạnh/yếu của người dùng.
* **Lộ trình học cá nhân hóa:** AI tự động sinh lộ trình học (Roadmap) chia thành các Module bài học phù hợp với năng lực và mục tiêu của học viên.

### 3. Hệ thống học tập Core (Core Learning Modules)
* **Flashcard:** Học từ vựng kèm hình ảnh, phiên âm, định nghĩa, ví dụ thực tế và phát âm chuẩn.
* **Spaced Repetition (Lặp lại ngắt quãng):** Thuật toán tối ưu hóa thời gian ôn tập từ vựng dựa trên lịch sử nhớ của người dùng giúp ghi nhớ lâu dài.
* **Grammar & Reading Study:** Các chuyên đề ngữ pháp hệ thống hóa và các bài đọc hiểu phân cấp độ kèm giải thích đáp án chi tiết từ AI.
* **Listening Practice:** Luyện nghe qua các đoạn hội thoại thực tế, điền từ vào chỗ trống và chọn đáp án đúng.
* **TOEIC Mock Exam:** Các đề thi thử TOEIC chuẩn hóa cấu trúc để đánh giá độ tiến bộ của học viên.

### 4. Cơ chế Game & Gamification (RPG Mechanics)
* **World Map:** Bản đồ phiêu lưu qua 6 vùng đất học thuật (Beginner Village $\rightarrow$ Vocabulary Forest $\rightarrow$ Grammar Castle $\rightarrow$ Listening Mountain $\rightarrow$ Business City $\rightarrow$ TOEIC Kingdom).
* **Word Battle:** Minigame chiến đấu với quái vật bằng cách trả lời nhanh các câu hỏi tiếng Anh. Trả lời đúng sẽ tấn công quái vật; trả lời sai sẽ bị quái vật phản công (trừ HP).
* **Daily Quests & Streak:** Nhiệm vụ hàng ngày giúp duy trì thói quen vào học mỗi ngày, tặng thưởng EXP, Coins và Items nâng cấp nhân vật.

### 5. Tự học qua Tài liệu tải lên (AI Document Learning)
* Hỗ trợ người dùng tải lên tài liệu định dạng **PDF, DOCX, TXT**.
* Hệ thống tự động trích xuất nội dung văn bản (sử dụng thư viện Apache PDFBox và Apache POI ở backend), gửi dữ liệu đến AI để phân tích và tạo ra bộ **Flashcards** cùng **Quizzes** tương ứng.

### 6. AI Mentor & Cộng đồng (AI Mentor & Community)
* **AI Mentor:** Trợ lý học tập thông minh trò chuyện trực tiếp để giải thích ngữ pháp, dịch thuật và hỗ trợ phương pháp học tập.
* **Social News Feed:** Nơi chia sẻ các cột mốc thành tựu, chuỗi Streak, cấp độ tiến hóa và tương tác (Like, Comment, Share) giữa các thành viên.
* **Leaderboard:** Bảng xếp hạng vinh danh người dùng xuất sắc nhất theo EXP, Level, TOEIC và Streak.

---

## 💻 Công nghệ Sử dụng (Tech Stack)

| Thành phần | Công nghệ | Chi tiết |
| :--- | :--- | :--- |
| **Frontend** | Angular 21, TailwindCSS 4, PhaserJS | Giao diện Glassmorphism hiện đại, responsive và minigame Phaser mượt mà |
| **Backend** | Spring Boot 3.5.14, Spring Security | Framework Java xử lý API, phân quyền bảo mật |
| **Database (Relational)** | PostgreSQL | Quản lý thông tin người dùng, tiến trình học tập, lịch sử thi cử |
| **Database (Graph)** | Neo4j | Quản lý điều kiện tiên quyết và xây dựng lộ trình học bằng sơ đồ tri thức (Knowledge Graph) |
| **Security & Auth** | JWT (JSON Web Token), Google GSI | Xác thực không trạng thái (Stateless), Google Sign-In client-side & server-side token validation |
| **Email Service** | JavaMailSender | Tự động gửi email thông báo, mã OTP khôi phục mật khẩu thông qua SMTP Gmail |
| **AI Integration** | Groq API (Llama 3.3 70B Versatile) | Xử lý ngôn ngữ tự nhiên, phân tích tài liệu và Chatbot AI Mentor |
| **Document Processing** | Apache PDFBox, Apache POI | Đọc và phân tách cấu trúc tệp tài liệu văn bản |

---

## 🗂️ Cấu trúc Thư mục (Directory Structure)

```text
english-ascension/
├── backend/                  # Mã nguồn Spring Boot (Java 17)
│   ├── src/main/java/...     # Controllers, Services, Repositories, Security, Models, DTOs
│   ├── src/main/resources/   # Cấu hình application.properties và dữ liệu ban đầu
│   └── pom.xml               # Quản lý thư viện Maven (chứa spring-boot-starter-mail, v.v.)
├── frontend/                 # Mã nguồn Angular (v21) & Tailwind v4
│   ├── src/app/components/   # Các Component giao diện (Login, Register, Dashboard, Word Battle, Customization,...)
│   ├── src/app/services/     # Dịch vụ giao tiếp API Backend (Auth, Study,...)
│   ├── src/app/app.routes.ts # Định tuyến (Routing) chính của ứng dụng
│   └── package.json          # Quản lý thư viện Node.js
├── data/                     # Dữ liệu phục vụ Knowledge Graph (CSV & Neo4j scripts)
│   ├── *.csv                 # Dữ liệu từ vựng, ngữ pháp, độ khó, điều kiện tiên quyết
│   └── import_to_neo4j.txt   # Kịch bản tải dữ liệu vào cơ sở dữ liệu đồ thị Neo4j
└── schema.sql                # File khởi tạo cơ sở dữ liệu PostgreSQL
```

---

## 🛠️ Hướng dẫn Cài đặt & Chạy Dự án (Installation & Quick Start)

### 📋 Yêu cầu hệ thống
* **Java Development Kit (JDK) 17** hoặc mới hơn
* **Node.js** (Khuyên dùng v20+) & **npm**
* **PostgreSQL Database Server**
* **Neo4j Graph Database** (Tùy chọn - Phục vụ tính năng Knowledge Graph nâng cao)

---

### Bước 1: Khởi tạo Cơ sở dữ liệu PostgreSQL
1. Mở công cụ quản lý PostgreSQL (như **pgAdmin 4** hoặc terminal `psql`).
2. Tạo một cơ sở dữ liệu mới với tên: `english_ascension`.
3. Mở công cụ Query Tool của database mới tạo, sao chép toàn bộ nội dung trong file [schema.sql](file:///d:/ThucTap_VNPT/english-ascension/schema.sql) và nhấn **Execute (F5)** để tạo bảng và nạp dữ liệu mẫu ban đầu.

---

### Bước 2: Thiết lập cấu hình biến môi trường
Tạo file `.env` ở thư mục gốc của dự án hoặc chỉnh sửa cấu hình trực tiếp từ file [.env](file:///d:/ThucTap_VNPT/english-ascension/.env) chứa các thông số:
```env
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/english_ascension
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=YOUR_DB_PASSWORD

# JWT secret key
JWT_SECRET=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437

# Groq API Configuration
GROQ_API_KEY=YOUR_GROQ_API_KEY

# Google Client ID (Cho đăng nhập Google)
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID

# Email SMTP Config (Dành cho chức năng gửi mã OTP quên mật khẩu)
EMAIL_USER=naml75803@gmail.com
EMAIL_PASS=smasnfucxseugksy
```

*Lưu ý: Biến cấu hình email ở trên sử dụng Gmail App Password để cho phép hệ thống gửi mail bảo mật.*

---

### Bước 3: Khởi chạy Backend (Spring Boot)
1. Truy cập vào thư mục `backend/`.
2. Chạy ứng dụng bằng Maven:
   ```bash
   mvn spring-boot:run
   ```
   *Mặc định backend sẽ chạy tại: `http://localhost:8080`*

---

### Bước 4: Cài đặt và Chạy Frontend (Angular)
1. Truy cập vào thư mục `frontend/`.
2. Tiến hành cài đặt các thư viện Node.js:
   ```bash
   npm install
   ```
3. Khởi chạy server phát triển Angular:
   ```bash
   ng serve
   ```
4. Truy cập giao diện ứng dụng thông qua trình duyệt tại địa chỉ: **`http://localhost:4200`**

*Tài khoản thử nghiệm mặc định:*
* **Email:** `test@gmail.com`
* **Mật khẩu:** `123456`

---

## 🏆 Kế hoạch Triển khai (Roadmap)

Chi tiết lộ trình phát triển được theo dõi cụ thể trong file [implementation_plan.md](file:///d:/ThucTap_VNPT/english-ascension/implementation_plan.md), bao gồm các giai đoạn:
* **Giai đoạn 1:** Thiết lập nền tảng, cơ chế Xác thực (Auth), Google Sign-In, Quên mật khẩu & Tạo nhân vật (Đã hoàn thành).
* **Giai đoạn 2:** Placement Test & sinh lộ trình học cá nhân hóa bằng AI.
* **Giai đoạn 3:** Xây dựng hệ thống học cốt lõi (Flashcard, Quiz) & minigame Word Battle.
* **Giai đoạn 4:** Triển khai tính năng AI Document Learning & Chatbot AI Mentor.
* **Giai đoạn 5:** Phát triển mạng xã hội cộng đồng học tập, Leaderboard & Tối ưu hóa UI/UX.