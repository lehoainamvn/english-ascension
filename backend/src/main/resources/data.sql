-- ====================================================================
-- ENGLISH ASCENSION - SEED DATA SCRIPT (9-TABLE SCHEMA)
-- ====================================================================

-- 1. Seed người dùng (Mật khẩu mặc định bên dưới là "123456" đã mã hóa BCrypt)
-- Sử dụng INSERT INTO ON CONFLICT hoặc chỉ đơn giản là INSERT INTO (nếu chạy trên DB sạch)
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
) ON CONFLICT (email) DO NOTHING;

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

-- ====================================================================
-- 3. Clear Existing Preset Roadmaps & Modules (For clean re-seed)
-- ====================================================================
DELETE FROM user_progress WHERE resource_type = 'ROADMAP' AND (resource_id IN (100, 101, 102, 103) OR resource_id IN (SELECT id FROM learning_roadmaps WHERE is_preset = TRUE));
DELETE FROM learning_modules WHERE roadmap_id IN (100, 101, 102, 103) OR roadmap_id IN (SELECT id FROM learning_roadmaps WHERE is_preset = TRUE);
DELETE FROM learning_roadmaps WHERE id IN (100, 101, 102, 103) OR is_preset = TRUE;

-- ====================================================================
-- 4. Seed Preset Roadmaps (Lộ trình chung - Bắt đầu từ ID 100)
-- ====================================================================
INSERT INTO learning_roadmaps (id, cefr_level, toeic_equivalent, overall_evaluation, is_preset, thumbnail_emoji, difficulty_label, modules_count, created_at, updated_at)
VALUES 
(
    100, 
    'A1-A2', 
    '150-300', 
    'Lộ trình học tiếng Anh căn bản từ con số 0 giúp bạn làm quen với ngữ pháp cơ bản, từ vựng thông dụng và rèn luyện kỹ năng nghe nói cơ bản.', 
    TRUE, 
    'star', 
    'Co ban', 
    3, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
),
(
    101, 
    'B1-B2', 
    '450-650', 
    'Lộ trình trung cấp giúp nâng cao vốn từ vựng học thuật, nắm vững các cấu trúc ngữ pháp phức tạp và cải thiện kỹ năng giao tiếp phản xạ tự nhiên.', 
    TRUE, 
    'diamond', 
    'Trung cap', 
    3, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
),
(
    102, 
    'TOEIC 600+', 
    '600-750', 
    'Lộ trình chuyên sâu tập trung vào kỹ năng nghe và đọc theo định dạng đề thi TOEIC mới nhất, cung cấp các mẹo làm bài và từ vựng phòng thi cốt lõi.', 
    TRUE, 
    'trophy', 
    'TOEIC', 
    3, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
),
(
    103, 
    'Business English', 
    '500-700', 
    'Lộ trình tiếng Anh công sở thực tế giúp bạn tự tin viết email, thuyết trình dự án, đàm phán hợp đồng và giao tiếp chuyên nghiệp với đồng nghiệp.', 
    TRUE, 
    'briefcase', 
    'Business', 
    3, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
);

-- ====================================================================
-- 5. Seed Learning Modules for Preset Roadmaps (Auto-increment IDs)
-- ====================================================================
INSERT INTO learning_modules (roadmap_id, title, description, order_index, category, status, created_at)
VALUES 
-- Modules for Roadmap 100 (A1-A2)
(
    100, 
    'Từ vựng A1 cơ bản', 
    'Học các từ vựng căn bản nhất về đời sống hàng ngày: Chào hỏi, gia đình, sở thích, màu sắc...', 
    1, 
    'VOCABULARY', 
    'IN_PROGRESS', 
    CURRENT_TIMESTAMP
),
(
    100, 
    'Ngữ pháp A1-A2 thông dụng', 
    'Luyện tập các thì đơn giản (Hiện tại đơn, Quá khứ đơn, Tương lai đơn) và các cấu trúc câu phổ biến.', 
    2, 
    'GRAMMAR', 
    'LOCKED', 
    CURRENT_TIMESTAMP
),
(
    100, 
    'Luyện nghe giao tiếp cơ bản', 
    'Luyện nghe các hội thoại ngắn về mua sắm, hỏi đường, đặt bàn nhà hàng.', 
    3, 
    'LISTENING', 
    'LOCKED', 
    CURRENT_TIMESTAMP
),

-- Modules for Roadmap 101 (B1-B2)
(
    101, 
    'Từ vựng B1 Academic', 
    'Mở rộng vốn từ vựng học thuật thuộc các chủ đề khoa học, giáo dục, và môi trường.', 
    1, 
    'VOCABULARY', 
    'IN_PROGRESS', 
    CURRENT_TIMESTAMP
),
(
    101, 
    'Cấu trúc Ngữ pháp Trung cấp', 
    'Nắm vững các câu điều kiện, câu bị động, và mệnh đề quan hệ để viết câu phức tốt hơn.', 
    2, 
    'GRAMMAR', 
    'LOCKED', 
    CURRENT_TIMESTAMP
),
(
    101, 
    'Nghe hiểu hội thoại dài', 
    'Luyện nghe các bài thuyết trình ngắn và các cuộc thảo luận nhóm phức tạp hơn.', 
    3, 
    'LISTENING', 
    'LOCKED', 
    CURRENT_TIMESTAMP
),

-- Modules for Roadmap 102 (TOEIC 600+)
(
    102, 
    'Từ vựng TOEIC thông dụng', 
    '500 từ vựng cốt lõi thường xuất hiện trong đề thi TOEIC: Nhân sự, tài chính, văn phòng...', 
    1, 
    'VOCABULARY', 
    'IN_PROGRESS', 
    CURRENT_TIMESTAMP
),
(
    102, 
    'Chiến thuật TOEIC Reading Part 5 & 6', 
    'Các dạng câu hỏi ngữ pháp và từ vựng thường gặp cùng phương pháp tối ưu hóa thời gian.', 
    2, 
    'GRAMMAR', 
    'LOCKED', 
    CURRENT_TIMESTAMP
),
(
    102, 
    'Luyện nghe TOEIC Listening Part 3', 
    'Phân tích hội thoại 2-3 người nói, nhận diện bẫy thông tin và từ đồng nghĩa.', 
    3, 
    'LISTENING', 
    'LOCKED', 
    CURRENT_TIMESTAMP
),

-- Modules for Roadmap 103 (Business English)
(
    103, 
    'Tiếng Anh giao tiếp công sở', 
    'Chào hỏi đồng nghiệp, giới thiệu bản thân trong công việc và sử dụng ngôn từ lịch thiệp.', 
    1, 
    'VOCABULARY', 
    'IN_PROGRESS', 
    CURRENT_TIMESTAMP
),
(
    103, 
    'Kỹ năng Viết Email chuyên nghiệp', 
    'Cách mở đầu và kết thúc email lịch sự, viết yêu cầu, báo cáo tiến độ và hẹn gặp đối tác.', 
    2, 
    'GRAMMAR', 
    'LOCKED', 
    CURRENT_TIMESTAMP
),
(
    103, 
    'Thuyết trình dự án bằng Tiếng Anh', 
    'Cấu trúc bài thuyết trình, các cụm từ chuyển ý mượt mà và cách giải thích biểu đồ.', 
    3, 
    'LISTENING', 
    'LOCKED', 
    CURRENT_TIMESTAMP
);

-- ====================================================================
-- 6. Cập nhật serial sequence cho PostgreSQL để tránh lỗi trùng lặp ID
-- ====================================================================
SELECT setval(pg_get_serial_sequence('learning_roadmaps', 'id'), COALESCE(max(id), 1)) FROM learning_roadmaps;
SELECT setval(pg_get_serial_sequence('learning_modules', 'id'), COALESCE(max(id), 1)) FROM learning_modules;
SELECT setval(pg_get_serial_sequence('questions', 'id'), COALESCE(max(id), 1)) FROM questions;

