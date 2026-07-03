-- ====================================================================
-- ENGLISH ASCENSION - DDD & SOLID OPTIMIZED INITIALIZATION SCHEMA
-- ====================================================================

-- Hủy các bảng cũ nếu tồn tại
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS class_assignments CASCADE;
DROP TABLE IF EXISTS class_members CASCADE;
DROP TABLE IF EXISTS classrooms CASCADE;
DROP TABLE IF EXISTS review_history CASCADE;
DROP TABLE IF EXISTS user_vocabulary_states CASCADE;
DROP TABLE IF EXISTS user_lesson_states CASCADE;
DROP TABLE IF EXISTS document_question_options CASCADE;
DROP TABLE IF EXISTS document_questions CASCADE;
DROP TABLE IF EXISTS document_flashcards CASCADE;
DROP TABLE IF EXISTS user_documents CASCADE;
DROP TABLE IF EXISTS question_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS personal_words CASCADE;
DROP TABLE IF EXISTS vocabulary_words CASCADE;
DROP TABLE IF EXISTS lesson_contents CASCADE;
DROP TABLE IF EXISTS lesson_prerequisites CASCADE;
DROP TABLE IF EXISTS roadmap_lessons CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS user_roadmaps CASCADE;
DROP TABLE IF EXISTS roadmaps CASCADE;
DROP TABLE IF EXISTS user_game_stats CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. IAM Bounded Context
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    avatar VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expiry_date TIMESTAMP NOT NULL
);

-- 2. Gamification Context
CREATE TABLE user_game_stats (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    streak INT NOT NULL DEFAULT 0,
    exp INT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1
);

-- 3. Learning Roadmap Context
CREATE TABLE roadmaps (
    id BIGSERIAL PRIMARY KEY,
    cefr_level VARCHAR(50) NOT NULL,
    toeic_equivalent VARCHAR(100),
    overall_evaluation TEXT,
    thumbnail_emoji VARCHAR(50),
    difficulty_label VARCHAR(50),
    is_preset BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE user_roadmaps (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    roadmap_id BIGINT REFERENCES roadmaps(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',  -- IN_PROGRESS, COMPLETED, PAUSED
    placement_score INT,
    recommended_level VARCHAR(50),
    tested_at TIMESTAMP,
    personalized_lessons_json TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_roadmap UNIQUE (user_id, roadmap_id)   -- 1 user chỉ enroll 1 lần / 1 roadmap
);

CREATE TABLE modules (
    id BIGSERIAL PRIMARY KEY,
    roadmap_id BIGINT REFERENCES roadmaps(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    category VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'LOCKED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lessons (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL, -- Định danh duy nhất để code dễ tham chiếu
    module_id BIGINT REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_index INT NOT NULL,
    lesson_type VARCHAR(50) NOT NULL, -- VOCABULARY, GRAMMAR, LISTENING, READING
    level VARCHAR(50),
    difficulty_score DOUBLE PRECISION,
    topic VARCHAR(255)
);

CREATE TABLE roadmap_lessons (
    roadmap_id BIGINT REFERENCES roadmaps(id) ON DELETE CASCADE,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
    PRIMARY KEY (roadmap_id, lesson_id)
);

CREATE TABLE lesson_prerequisites (
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
    prerequisite_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
    PRIMARY KEY (lesson_id, prerequisite_id)
);

-- 4. Lesson Content Context (Chi tiết nội dung học tập - Quan hệ 1-1 với Lesson)
CREATE TABLE lesson_contents (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT UNIQUE NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    body_text TEXT,                   -- Bài đọc hoặc nội dung lý thuyết ngữ pháp / transcript nghe
    media_url TEXT,                   -- Link file âm thanh (Listening) hoặc hình ảnh lý thuyết (Nếu có, không bắt buộc)
    duration_seconds INT              -- Thời lượng bài nghe/học dự kiến
);

-- 5. Vocabulary Context
-- 5.1 Từ vựng hệ thống thuộc về bài học VOCABULARY chuẩn
CREATE TABLE vocabulary_words (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    word VARCHAR(255) NOT NULL,
    part_of_speech VARCHAR(50),
    phonetic VARCHAR(100),
    definition TEXT NOT NULL,
    example_sentence TEXT,
    example_translation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5.2 Sổ tay Từ vựng cá nhân của User
CREATE TABLE personal_words (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word VARCHAR(255) NOT NULL,
    part_of_speech VARCHAR(50),
    phonetic VARCHAR(100),
    definition TEXT NOT NULL,
    example_sentence TEXT,
    example_translation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Assessment / Quiz Context (Luyện tập chuẩn theo lộ trình học)
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE, -- Trỏ thẳng đến bài học (nullable cho Placement Test)
    source_type VARCHAR(50),                                               -- PLACEMENT_TEST, ROADMAP_QUIZ, v.v.
    question_text TEXT NOT NULL,
    image_url VARCHAR(555), -- Giữ trường ảnh nếu cần hiển thị câu hỏi bằng hình ảnh
    explanation TEXT,
    difficulty VARCHAR(50)
);

CREATE TABLE question_options (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_key VARCHAR(50) NOT NULL, -- A, B, C, D...
    option_value TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

-- 7. AI Assistance & User Document Context (Tách biệt hoàn toàn)
CREATE TABLE user_documents (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Từ vựng sinh ra bằng AI từ tài liệu người dùng
CREATE TABLE document_flashcards (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES user_documents(id) ON DELETE CASCADE,
    word VARCHAR(255) NOT NULL,
    part_of_speech VARCHAR(50),
    phonetic VARCHAR(100),
    definition TEXT NOT NULL,
    example_sentence TEXT,
    example_translation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Câu hỏi sinh ra bằng AI từ tài liệu người dùng
CREATE TABLE document_questions (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES user_documents(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    explanation TEXT
);

-- Tùy chọn câu hỏi tự sinh bằng AI
CREATE TABLE document_question_options (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES document_questions(id) ON DELETE CASCADE,
    option_key VARCHAR(50) NOT NULL,
    option_value TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

-- 8. Learning Progress Context
-- 8.1 Tiến độ bài học
CREATE TABLE user_lesson_states (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'UNLOCKED', -- LOCKED, UNLOCKED, IN_PROGRESS, THEORY_COMPLETED, COMPLETED
    score INT,
    answers_json TEXT,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_lesson UNIQUE (user_id, lesson_id)
);

-- 8.2 Từ vựng hệ thống đã thuộc
CREATE TABLE user_vocabulary_states (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id BIGINT NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_word UNIQUE (user_id, word_id)
);

-- 9. Spaced Repetition Context (Ôn tập từ vựng sổ tay cá nhân)
CREATE TABLE review_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    personal_word_id BIGINT NOT NULL REFERENCES personal_words(id) ON DELETE CASCADE,
    e_factor DOUBLE PRECISION DEFAULT 2.5,
    repetition_interval INT DEFAULT 1,
    repetitions INT DEFAULT 0,
    next_review_date TIMESTAMP NOT NULL,
    last_reviewed_at TIMESTAMP,
    CONSTRAINT uq_user_personal_word UNIQUE (user_id, personal_word_id)
);

-- 10. Classroom & Social Context
CREATE TABLE classrooms (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    invite_code VARCHAR(10) UNIQUE NOT NULL,
    created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE class_members (
    id BIGSERIAL PRIMARY KEY,
    classroom_id BIGINT NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER', -- MEMBER, OWNER
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_classroom_user UNIQUE (classroom_id, user_id)
);

CREATE TABLE class_assignments (
    id BIGSERIAL PRIMARY KEY,
    classroom_id BIGINT NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,          -- Giao bài tập hệ thống
    document_id BIGINT REFERENCES user_documents(id) ON DELETE CASCADE,       -- Hoặc giao tài liệu AI
    created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    classroom_id BIGINT REFERENCES classrooms(id) ON DELETE CASCADE,
    content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
