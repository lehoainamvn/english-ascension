# 🏆 English Ascension - Nền tảng học tiếng Anh RPG & AI-Powered

> **Learn • Level Up • Evolve**
>
> English Ascension là một nền tảng học tiếng Anh độc đáo ứng dụng trí tuệ nhân tạo (AI), hệ thống biểu đồ tri thức (Knowledge Graph) kết hợp với các cơ chế của thể loại game nhập vai (RPG) và Gamification. Thay vì chỉ học từ vựng một cách khô khan, người dùng sẽ tạo nhân vật riêng, nâng cấp, tiến hóa, tham gia các trận chiến từ vựng và chinh phục các mốc CEFR/TOEIC thông qua quá trình học tập cá nhân hóa.

---

## 🗺️ Bản đồ Tính năng (Key Features)

### 1. Đăng ký & Tùy chỉnh nhân vật (Character Customization)
* **Giao diện Glassmorphism hiện đại:** Màn hình đăng nhập/đăng ký đẹp mắt với cơ chế bảo mật JWT.
* **Tạo hình nhân vật:** Tự do tùy chỉnh giới tính, kiểu tóc, màu tóc, khuôn mặt, trang phục và phụ kiện.
* **Tiến hóa nhân vật (Evolution System):** Nhân vật sẽ tự động thay đổi ngoại hình, danh hiệu và hiệu ứng khi đạt các mốc cấp độ:
  * *Lv 1 - 19:* **Novice** (Tập sự)
  * *Lv 20 - 39:* **Student** (Học viên)
  * *Lv 40 - 59:* **Scholar** (Học giả)
  * *Lv 60 - 79:* **Master** (Bậc thầy)
  * *Lv 80 - 99:* **Grand Sage** (Đại hiền triết)
  * *Lv 100:* **Language Legend** (Huyền thoại ngôn ngữ)

### 2. Đánh giá Đầu vào & Lộ trình Cá nhân hóa (Placement Test & AI Roadmap)
* **Placement Test:** Bộ câu hỏi kiểm tra nhanh gồm 4 kỹ năng (Vocabulary, Grammar, Listening, Reading).
* **AI Analysis:** Đánh giá cấp độ CEFR hiện tại (A1 - C2), ước lượng điểm TOEIC và tìm ra điểm mạnh/yếu của người dùng.
* **Lộ trình học cá nhân hóa:** AI tự động sinh lộ trình học (Roadmap) chia thành các Module phù hợp với năng lực và mục tiêu của học viên.

### 3. Hệ thống học tập Core (Core Learning Modules)
* **Flashcard:** Học từ vựng kèm hình ảnh, phiên âm, định nghĩa, ví dụ thực tế và phát âm chuẩn.
* **Spaced Repetition (Lặp lại ngắt quãng):** Thuật toán tối ưu hóa thời gian ôn tập từ vựng giúp ghi nhớ dài hạn.
* **Grammar & Reading Study:** Các chuyên đề ngữ pháp hệ thống hóa và các bài đọc hiểu phân cấp độ kèm giải thích chi tiết từ AI.
* **Listening Practice:** Luyện nghe qua các đoạn hội thoại thực tế, điền từ và chọn đáp án đúng.
* **TOEIC Mock Exam:** Các đề thi thử TOEIC chuẩn hóa để đánh giá sự tiến bộ của người học.

### 4. Cơ chế Game & Gamification (RPG Mechanics)
* **World Map:** Bản đồ phiêu lưu qua 6 vùng đất (Beginner Village $\rightarrow$ Vocabulary Forest $\rightarrow$ Grammar Castle $\rightarrow$ Listening Mountain $\rightarrow$ Business City $\rightarrow$ TOEIC Kingdom).
* **Word Battle:** Chiến đấu với quái vật bằng cách trả lời nhanh các câu hỏi tiếng Anh. Mỗi câu trả lời đúng sẽ gây sát thương lên quái vật; trả lời sai sẽ bị trừ máu (HP).
* **Daily Quests & Streak:** Nhiệm vụ hàng ngày phong phú giúp duy trì thói quen học tập, tặng EXP, Coins và Items.

### 5. Tự học qua Tài liệu tải lên (AI Document Learning)
* Người dùng có thể upload các file tài liệu định dạng **PDF, DOCX, TXT**.
* Hệ thống sử dụng Apache PDFBox và Apache POI để trích xuất nội dung, sau đó AI sẽ tự động phân tích và sinh ra các bộ **Flashcards** và **Quizzes** tương ứng.

### 6. AI Mentor & Cộng đồng (AI Mentor & Community)
* **AI Mentor:** Trợ lý học tập thông minh trò chuyện trực tiếp để giải đáp các câu hỏi ngữ pháp, dịch thuật và đưa ra lời khuyên học tập.
* **Social News Feed:** Nơi chia sẻ các cột mốc thành tựu, chuỗi Streak, cấp độ và tương tác (Like, Comment, Share) giữa các người học.
* **Leaderboard:** Bảng xếp hạng vinh danh theo EXP, Level, TOEIC và Streak.

---

## 💻 Công nghệ Sử dụng (Tech Stack)

| Thành phần | Công nghệ | Chi tiết |
| :--- | :--- | :--- |
| **Frontend** | Angular 21, TailwindCSS 4, PhaserJS | Giao diện hiện đại, tối ưu hiệu năng và hỗ trợ minigame mượt mà |
| **Backend** | Spring Boot 3.5.14, Spring Security | Framework mạnh mẽ, xử lý logic nghiệp vụ và phân quyền |
| **Database (Relational)** | PostgreSQL | Quản lý thông tin người dùng, nhân vật, lịch sử học tập, câu hỏi |
| **Database (Graph)** | Neo4j | Xây dựng bản đồ tri thức (Knowledge Graph), quản lý điều kiện tiên quyết và lộ trình bài học tối ưu |
| **Security** | JWT (JSON Web Token) | Xác thực không trạng thái (Stateless Authentication) an toàn |
| **AI Integration** | Groq API (Llama 3.3 70B Versatile) | Xử lý ngôn ngữ tự nhiên, phân tích tài liệu và trò chuyện với người học |
| **Document Processing** | Apache PDFBox, Apache POI | Đọc và xử lý file PDF, Word tải lên từ người dùng |

---

## 🗂️ Cấu trúc Thư mục (Directory Structure)

```text
english-ascension/
├── backend/                  # Mã nguồn Spring Boot (Java 17)
│   ├── src/main/java/...     # Controllers, Services, Repositories, Security, Models
│   ├── src/main/resources/   # Cấu hình application.properties
│   └── pom.xml               # Quản lý thư viện Maven
├── frontend/                 # Mã nguồn Angular (v21) & Tailwind v4
│   ├── src/app/components/   # Các Component giao diện (Dashboard, Word Battle, Customization,...)
│   ├── src/app/services/     # Dịch vụ gọi API Backend
│   ├── src/app/app.routes.ts # Cấu hình định tuyến (Routing) của ứng dụng
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

*(Tùy chọn)* Nạp dữ liệu đồ thị vào **Neo4j**: Sao chép các file `.csv` trong thư mục [data/](file:///d:/ThucTap_VNPT/english-ascension/data) vào thư mục `import/` của Neo4j và thực thi các câu lệnh Cypher trong [import_to_neo4j.txt](file:///d:/ThucTap_VNPT/english-ascension/data/import_to_neo4j.txt).

---

### Bước 2: Cấu hình và Chạy Backend (Spring Boot)
1. Truy cập vào thư mục `backend/`.
2. Kiểm tra và chỉnh sửa cấu hình kết nối database & khóa API trong file [application.properties](file:///d:/ThucTap_VNPT/english-ascension/backend/src/main/resources/application.properties):
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:postgresql://localhost:5432/english_ascension
   spring.datasource.username=postgres
   spring.datasource.password=YOUR_DATABASE_PASSWORD

   # Groq API Configuration (Dành cho AI Mentor và AI Document Learning)
   groq.api.key=YOUR_GROQ_API_KEY
   groq.api.url=https://api.groq.com/openai/v1
   groq.api.model=llama-3.3-70b-versatile
   ```
3. Chạy ứng dụng bằng Maven:
   ```bash
   mvn spring-boot:run
   ```
   *Mặc định backend sẽ chạy tại: `http://localhost:8080`*

---

### Bước 3: Cài đặt và Chạy Frontend (Angular)
1. Truy cập vào thư mục `frontend/`.
2. Tiến hành cài đặt các gói phụ thuộc:
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
* **Giai đoạn 1:** Thiết lập nền tảng, cơ chế Xác thực (Auth) & Tạo nhân vật (Đã hoàn thành).
* **Giai đoạn 2:** Placement Test & sinh lộ trình học cá nhân hóa bằng AI.
* **Giai đoạn 3:** Xây dựng hệ thống học cốt lõi (Flashcard, Quiz) & minigame Word Battle.
* **Giai đoạn 4:** Triển khai tính năng AI Document Learning & Chatbot AI Mentor.
* **Giai đoạn 5:** Phát triển mạng xã hội cộng đồng học tập, Leaderboard & Tối ưu hóa UI/UX.