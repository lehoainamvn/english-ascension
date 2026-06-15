-- ====================================================================
-- ENGLISH ASCENSION - DATABASE INITIALIZATION SCRIPT (12-TABLE SCHEMA)
-- ====================================================================
-- Hướng dẫn chạy trên pgAdmin:
-- 1. Mở pgAdmin và tạo một Database tên là: english_ascension
-- 2. Chuột phải vào Database "english_ascension" -> Chọn "Query Tool"
-- 3. Copy toàn bộ nội dung file này vào Query Tool và nhấn nút "Execute" (F5)
-- ====================================================================

-- 1. Xóa các bảng cũ nếu tồn tại (theo thứ tự phụ thuộc ngoại khóa)
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS class_quizzes CASCADE;
DROP TABLE IF EXISTS class_members CASCADE;
DROP TABLE IF EXISTS classrooms CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS flashcards CASCADE;
DROP TABLE IF EXISTS study_contents CASCADE;
DROP TABLE IF EXISTS learning_modules CASCADE;
DROP TABLE IF EXISTS learning_roadmaps CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Tạo bảng người dùng (users) - Tích hợp thuộc tính nhân vật trực tiếp
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    streak INT NOT NULL DEFAULT 0,
    coins INT NOT NULL DEFAULT 0,
    exp INT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1,
    character_name VARCHAR(255),
    character_gender VARCHAR(50),
    character_hair_style VARCHAR(100),
    character_hair_color VARCHAR(100),
    character_face_style VARCHAR(100),
    character_outfit_style VARCHAR(100),
    character_title VARCHAR(100) DEFAULT 'Novice',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tạo bảng lộ trình học (learning_roadmaps)
CREATE TABLE learning_roadmaps (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE,
    cefr_level VARCHAR(50) NOT NULL,
    toeic_equivalent VARCHAR(100),
    overall_evaluation TEXT,
    is_preset BOOLEAN NOT NULL DEFAULT FALSE,
    thumbnail_emoji VARCHAR(50),
    difficulty_label VARCHAR(50),
    modules_count INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_roadmap FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Tạo bảng module học tập (learning_modules)
CREATE TABLE learning_modules (
    id BIGSERIAL PRIMARY KEY,
    roadmap_id BIGINT, -- Nullable to allow self-study vocab topics
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    category VARCHAR(100), -- For vocab topics (e.g. '600 TỪ VỰNG TOEIC')
    status VARCHAR(50) NOT NULL DEFAULT 'LOCKED', -- LOCKED, IN_PROGRESS, COMPLETED
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_roadmap_module FOREIGN KEY (roadmap_id) REFERENCES learning_roadmaps(id) ON DELETE CASCADE
);

-- 5. Tạo bảng nội dung học tập/tài liệu tự học (study_contents)
CREATE TABLE study_contents (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- GRAMMAR, LISTENING, READING, EXAM, DOCUMENT
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    body_text TEXT,
    media_url TEXT,
    description TEXT,
    duration INT,
    order_index INT,
    questions_count INT,
    user_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_study_content_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 6. Tạo bảng câu hỏi (questions)
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    source_type VARCHAR(50) NOT NULL, -- PLACEMENT_TEST, ROADMAP_QUIZ, DOCUMENT_QUIZ, GRAMMAR, LISTENING, READING, TOEIC_EXAM
    parent_id BIGINT, -- Links to learning_modules.id or study_contents.id
    question_number INT,
    type VARCHAR(50), -- MULTIPLE_CHOICE, FILL_IN_BLANK, WORD_MATCHING, VOCABULARY, GRAMMAR, etc.
    difficulty VARCHAR(50), -- A1, A2, B1, B2, C1, C2
    question_text TEXT NOT NULL,
    audio_url VARCHAR(555),
    image_url VARCHAR(555),
    option_a VARCHAR(255),
    option_b VARCHAR(255),
    option_c VARCHAR(255),
    option_d VARCHAR(255),
    correct_option VARCHAR(255), -- A, B, C, D
    correct_answer VARCHAR(255), -- fallback
    explanation TEXT
);

-- 7. Tạo bảng từ vựng / flashcards (flashcards)
CREATE TABLE flashcards (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT,
    study_content_id BIGINT,
    user_id BIGINT,
    word VARCHAR(255) NOT NULL,
    part_of_speech VARCHAR(50),
    phonetic VARCHAR(100),
    definition TEXT NOT NULL,
    example_sentence TEXT,
    example_translation TEXT,
    notes TEXT,
    saved_date VARCHAR(50),
    e_factor DOUBLE PRECISION DEFAULT 2.5,
    repetition_interval INT DEFAULT 1,
    repetitions INT DEFAULT 0,
    CONSTRAINT fk_module_flashcard FOREIGN KEY (module_id) REFERENCES learning_modules(id) ON DELETE CASCADE,
    CONSTRAINT fk_study_content_flashcard FOREIGN KEY (study_content_id) REFERENCES study_contents(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_flashcard FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Tạo bảng lịch sử / tiến trình học tập (user_progress)
CREATE TABLE user_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- MODULE, STUDY_CONTENT, QUESTION
    resource_id BIGINT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP,
    score INT,
    total_questions INT,
    answers_json TEXT,
    CONSTRAINT fk_user_progress FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. Tạo bảng lớp học (classrooms)
CREATE TABLE classrooms (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    invite_code VARCHAR(10) UNIQUE NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_classroom_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Tạo bảng thành viên lớp học (class_members)
CREATE TABLE class_members (
    id BIGSERIAL PRIMARY KEY,
    classroom_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER', -- OWNER, MEMBER
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_member_classroom FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_member_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_classroom_user UNIQUE (classroom_id, user_id)
);

-- 11. Tạo bảng bài tập lớp học (class_quizzes)
CREATE TABLE class_quizzes (
    id BIGSERIAL PRIMARY KEY,
    classroom_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    created_by BIGINT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quiz_classroom FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 12. Tạo bảng tin nhắn trao đổi (chat_messages)
CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ====================================================================
-- DỮ LIỆU MẪU ĐỂ TEST
-- ====================================================================

-- 1. Seed người dùng (Mật khẩu mặc định bên dưới là "123456" đã mã hóa BCrypt)
INSERT INTO users (email, password, role, active, streak, coins, exp, level, created_at, updated_at)
VALUES (
    'test@gmail.com', 
    '$2a$10$wPxq/hC9KzXb4sVqJb6d2eC0bL/XlJ0.w8wOqJgC4yZ.OpxP6.Wc.', -- Mật khẩu: 123456
    'ROLE_USER', 
    TRUE, 
    5, 
    150, 
    1200, 
    5,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 2. Seed 12 câu hỏi Placement Test (3 câu cho mỗi kỹ năng)
-- VOCABULARY
INSERT INTO questions (source_type, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation)
VALUES (
    'PLACEMENT_TEST',
    'VOCABULARY',
    'A2',
    'Choose the synonym of the word "generous":',
    'Kind and willing to share/give',
    'Selfish and greedy',
    'Lazy and inactive',
    'Active and noisy',
    'A',
    'A',
    'Generous means showing readiness to give more of something, especially money, than is strictly necessary or expected.'
);

INSERT INTO questions (source_type, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation)
VALUES (
    'PLACEMENT_TEST',
    'VOCABULARY',
    'B1',
    'Which word describes a person who is very determined to do something and refuses to change their mind?',
    'Stubborn',
    'Flexible',
    'Optimistic',
    'Reliable',
    'A',
    'A',
    'A stubborn person is determined not to change their opinion or attitude.'
);

INSERT INTO questions (source_type, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation)
VALUES (
    'PLACEMENT_TEST',
    'VOCABULARY',
    'B2',
    'What is the meaning of the idiom "a piece of cake"?',
    'A delicious dessert served at a party',
    'Something that is very easy to do',
    'A difficult problem that needs solving',
    'A special birthday celebration',
    'B',
    'B',
    'The idiom "a piece of cake" means a task or activity that is very easy.'
);

-- GRAMMAR
INSERT INTO questions (source_type, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation)
VALUES (
    'PLACEMENT_TEST',
    'GRAMMAR',
    'A2',
    'Neither the teacher nor the students ______ present at the meeting yesterday.',
    'was',
    'were',
    'are',
    'is',
    'B',
    'B',
    'With "neither... nor...", the verb agrees with the closer subject, which is "students" (plural), and the tense is past ("yesterday"), so we use "were".'
);

INSERT INTO questions (source_type, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation)
VALUES (
    'PLACEMENT_TEST',
    'GRAMMAR',
    'B1',
    'By the time we arrived at the cinema yesterday, the movie ______.',
    'already started',
    'has already started',
    'had already started',
    'was starting',
    'C',
    'C',
    'We use Past Perfect (had + V3) to express an action that happened before another past action (arrived).'
);

INSERT INTO questions (source_type, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation)
VALUES (
    'PLACEMENT_TEST',
    'GRAMMAR',
    'B2',
    'If she ______ harder last semester, she would have passed the exam.',
    'studied',
    'had studied',
    'has studied',
    'studies',
    'B',
    'B',
    'This is a Conditional Type 3 sentence expressing a regret/hypothetical situation in the past. Structure: If + S + had + V3, S + would + have + V3.'
);

-- LISTENING
INSERT INTO questions (source_type, type, difficulty, question_text, audio_url, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation)
VALUES (
    'PLACEMENT_TEST',
    'LISTENING',
    'A2',
    '[Audio Question] Listen to the audio. What is the speaker''s main occupation?',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'Teacher',
    'Chef',
    'Doctor',
    'Photographer',
    'B',
    'B',
    'The audio mentions preparing delicious recipes and working in a busy restaurant kitchen.'
);

INSERT INTO questions (source_type, type, difficulty, question_text, audio_url, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation)
VALUES (
    'PLACEMENT_TEST',
    'LISTENING',
    'B1',
    '[Audio Question] Listen to the audio. Why did the man cancel the morning meeting?',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'He was feeling ill',
    'He had a flight delay',
    'He forgot the time',
    'He had a family emergency',
    'B',
    'B',
    'The speaker explains he was stuck at the airport due to a delayed flight.'
);

INSERT INTO questions (source_type, type, difficulty, question_text, audio_url, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation)
VALUES (
    'PLACEMENT_TEST',
    'LISTENING',
    'B2',
    '[Audio Question] Listen to the audio. What will the weather be like tomorrow according to the forecast?',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'Heavy rain and thunderstorm',
    'Sunny and warm weather',
    'Snow and strong wind',
    'Cloudy skies with no precipitation',
    'A',
    'A',
    'The weather forecast predicts a major storm with heavy rain and thunderstorms starting tomorrow morning.'
);

-- READING
INSERT INTO questions (source_type, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation)
VALUES (
    'PLACEMENT_TEST',
    'READING',
    'A2',
    'Read the passage:\n"Technology is changing the way we work. More people are working from home, which reduces commuting time and increases flexibility. However, it also makes it harder to separate work from personal life."\n\nWhat is the main drawback of remote work mentioned in the text?',
    'Commuting cost is higher',
    'Difficulty in separating work and personal life',
    'Lack of technology tools',
    'Lower productivity',
    'B',
    'B',
    'The passage states that remote work "makes it harder to separate work from personal life."'
);

INSERT INTO questions (source_type, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation)
VALUES (
    'PLACEMENT_TEST',
    'READING',
    'B1',
    'Read the passage:\n"Organic farming avoids the use of synthetic chemical fertilizers. Instead, it relies on crop rotation and compost to maintain soil productivity. Proponents argue it is more sustainable in the long run."\n\nWhat does organic farming use instead of synthetic chemicals?',
    'Heavy agricultural machinery',
    'Crop rotation and compost',
    'Genetically modified seeds',
    'Imported soil from other regions',
    'B',
    'B',
    'The text mentions that organic farming "relies on crop rotation and compost to maintain soil productivity" instead of synthetic chemical fertilizers.'
);

INSERT INTO questions (source_type, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation)
VALUES (
    'PLACEMENT_TEST',
    'READING',
    'B2',
    'Read the passage:\n"The Great Barrier Reef is the world''s largest coral reef system, composed of over 2,900 individual reefs. However, global warming poses a severe threat to its biodiversity due to rising water temperatures causing coral bleaching."\n\nWhat is threatening the biodiversity of the Great Barrier Reef?',
    'Overfishing by commercial boats',
    'Global warming and rising temperatures',
    'Excessive tourism activities',
    'Industrial water pollution',
    'B',
    'B',
    'The passage explicitly mentions that "global warming poses a severe threat to its biodiversity due to rising water temperatures causing coral bleaching."'
);
