-- ====================================================================
-- ENGLISH ASCENSION - SEED DATA SCRIPT (NEW 16-TABLE SCHEMA)
-- ====================================================================

-- 1. Seed người dùng (Mật khẩu: "123456" đã mã hóa BCrypt)
INSERT INTO users (id, email, password, role, active, avatar, created_at, updated_at)
VALUES (
    1,
    'test@gmail.com', 
    '$2a$10$wPxq/hC9KzXb4sVqJb6d2eC0bL/XlJ0.w8wOqJgC4yZ.OpxP6.Wc.', 
    'ROLE_USER', 
    TRUE, 
    'assets/images/avatars/default.png',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, password, role, active, avatar, created_at, updated_at)
VALUES (
    2,
    'admin@gmail.com', 
    '$2a$10$wPxq/hC9KzXb4sVqJb6d2eC0bL/XlJ0.w8wOqJgC4yZ.OpxP6.Wc.', 
    'ROLE_ADMIN', 
    TRUE, 
    'assets/images/avatars/admin.png',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- 2. Seed Chỉ số Game người dùng (user_game_stats)
INSERT INTO user_game_stats (user_id, streak, exp, level)
VALUES (1, 5, 1200, 5)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO user_game_stats (user_id, streak, exp, level)
VALUES (2, 10, 5000, 10)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Seed Lộ trình mẫu (roadmaps)
INSERT INTO roadmaps (id, cefr_level, toeic_equivalent, overall_evaluation, is_preset, thumbnail_emoji, difficulty_label)
VALUES 
(
    100, 
    'A1', 
    '100-150', 
    'Lộ trình cơ bản A1 giúp nắm bắt từ vựng, ngữ pháp đơn giản, và làm quen với các chủ đề hội thoại đời sống hàng ngày.', 
    TRUE, 
    'star', 
    'Co ban'
),
(
    101, 
    'A2', 
    '150-350', 
    'Lộ trình A2 giúp mở rộng từ vựng, củng cố các cấu trúc ngữ pháp thông dụng và nâng cao khả năng nghe đọc cơ bản.', 
    TRUE, 
    'sparkles', 
    'Co ban'
),
(
    102, 
    'B1', 
    '350-550', 
    'Lộ trình B1 giúp bạn bước vào giai đoạn trung cấp, tự tin viết các đoạn văn dài, nắm vững câu điều kiện, bị động và cải thiện kỹ năng đàm thoại.', 
    TRUE, 
    'diamond', 
    'Trung cap'
),
(
    103, 
    'B2', 
    '550-700', 
    'Lộ trình B2 giúp bạn hoàn thiện ngữ pháp phức tạp, nâng cao từ vựng chuyên ngành xã hội, tài chính, công nghệ và phân tích các bài đọc chuyên sâu.', 
    TRUE, 
    'trophy', 
    'Trung cap'
),
(
    104, 
    'C1', 
    '700-990', 
    'Lộ trình C1 chuyên sâu tập trung vào các văn bản học thuật phức tạp, đàm phán chính trị, kinh tế vĩ mô và cách diễn đạt tinh tế ở trình độ cao cấp.', 
    TRUE, 
    'crown', 
    'Cao cap'
) ON CONFLICT (id) DO NOTHING;

-- 4. Seed Module học tập (modules)
INSERT INTO modules (id, roadmap_id, title, description, order_index, category, status)
VALUES 
-- Modules cho Lộ trình 100 (A1)
(1001, 100, 'Từ vựng A1', 'Học các chủ đề từ vựng A1 căn bản như: Chào hỏi, gia đình, trường học, đồ ăn...', 1, 'VOCABULARY', 'IN_PROGRESS'),
(1002, 100, 'Ngữ pháp A1', 'Làm quen với các thì đơn giản, động từ To Be, danh từ số nhiều và câu hỏi WH-', 2, 'GRAMMAR', 'LOCKED'),
(1003, 100, 'Đọc hiểu A1', 'Đọc các văn bản ngắn như email giới thiệu, thông báo đơn giản hoặc nhật ký hàng ngày', 3, 'READING', 'LOCKED'),
(1004, 100, 'Nghe hiểu A1', 'Nghe các cuộc hội thoại ngắn về chỉ đường, mua sắm hoặc giới thiệu bản thân', 4, 'LISTENING', 'LOCKED'),

-- Modules cho Lộ trình 101 (A2)
(1005, 101, 'Từ vựng A2', 'Mở rộng từ vựng về mua sắm, du lịch, sức khỏe, công việc và miêu tả người', 1, 'VOCABULARY', 'IN_PROGRESS'),
(1006, 101, 'Ngữ pháp A2', 'Học thì Hiện tại tiếp diễn, Quá khứ đơn, Tương lai đơn và So sánh hơn/nhất', 2, 'GRAMMAR', 'LOCKED'),
(1007, 101, 'Đọc hiểu A2', 'Đọc hiểu các thông báo công ty, cẩm nang du lịch và thư từ công sở đơn giản', 3, 'READING', 'LOCKED'),
(1008, 101, 'Nghe hiểu A2', 'Nghe hiểu các thông báo nhà ga, thảo luận kế hoạch đi chơi hoặc phỏng vấn xin việc cơ bản', 4, 'LISTENING', 'LOCKED'),

-- Modules cho Lộ trình 102 (B1)
(1009, 102, 'Từ vựng B1', 'Nâng cao từ vựng chủ đề môi trường, văn hóa, khoa học đổi mới và phát triển cá nhân', 1, 'VOCABULARY', 'IN_PROGRESS'),
(1010, 102, 'Ngữ pháp B1', 'Nắm vững thì Hiện tại hoàn thành, câu bị động, câu điều kiện loại 1 & 2 và mệnh đề quan hệ', 2, 'GRAMMAR', 'LOCKED'),
(1011, 102, 'Đọc hiểu B1', 'Đọc hiểu các báo cáo tóm tắt, thư tín đàm phán hợp đồng và bài viết năng suất công việc', 3, 'READING', 'LOCKED'),
(1012, 102, 'Nghe hiểu B1', 'Nghe hiểu các cuộc họp phòng ban, trao đổi với nhà cung cấp hoặc hướng dẫn đào tạo nhân viên', 4, 'LISTENING', 'LOCKED'),

-- Modules cho Lộ trình 103 (B2)
(1013, 103, 'Từ vựng B2', 'Từ vựng chuyên sâu về tài chính, quản trị, luật pháp, y học và trí tuệ nhân tạo', 1, 'VOCABULARY', 'IN_PROGRESS'),
(1014, 103, 'Ngữ pháp B2', 'Học câu gián tiếp nâng cao, đảo ngữ, câu giả định, câu cleft và các thì tương lai hoàn thành', 2, 'GRAMMAR', 'LOCKED'),
(1015, 103, 'Đọc hiểu B2', 'Đọc hiểu báo cáo tài chính quý, thông báo sáp nhập, phân tích rủi ro và điều khoản sử dụng AI', 3, 'READING', 'LOCKED'),
(1016, 103, 'Nghe hiểu B2', 'Nghe hiểu tranh luận tài chính thường niên, hội thảo an ninh mạng và thảo luận hợp đồng liên doanh', 4, 'LISTENING', 'LOCKED'),

-- Modules cho Lộ trình 104 (C1)
(1017, 104, 'Từ vựng C1', 'Từ vựng học thuật cao cấp về quan hệ quốc tế, triết học, đạo đức nghề nghiệp và khoa học vũ trụ', 1, 'VOCABULARY', 'IN_PROGRESS'),
(1018, 104, 'Ngữ pháp C1', 'Sử dụng cấu trúc đảo ngữ phức tạp, phân từ độc lập, câu cleft nhấn mạnh và liên từ liên kết ý tưởng nâng cao', 2, 'GRAMMAR', 'LOCKED'),
(1019, 104, 'Đọc hiểu C1', 'Đọc các tóm tắt nghiên cứu khoa học, tài liệu ngoại giao, essay triết học và phán quyết pháp lý', 3, 'READING', 'LOCKED'),
(1020, 104, 'Nghe hiểu C1', 'Nghe các bài giảng vật lý thiên văn, tranh luận chính trị, phỏng vấn giải Nobel và đàm phán M&A', 4, 'LISTENING', 'LOCKED')
ON CONFLICT (id) DO NOTHING;

-- Modules tự học từ vựng CEFR (roadmap_id = NULL)
INSERT INTO modules (id, roadmap_id, title, description, order_index, category, status)
VALUES
(2001, NULL, 'A1 - Chào hỏi & Bản thân', 'Học từ vựng về Chào hỏi & Bản thân cơ bản', 1, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2002, NULL, 'A1 - Gia đình & Bạn bè', 'Học từ vựng về Gia đình & Bạn bè cơ bản', 2, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2003, NULL, 'A1 - Trường học & Học tập', 'Học từ vựng về Trường học & Học tập cơ bản', 3, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2004, NULL, 'A1 - Đồ ăn & Đồ uống', 'Học từ vựng về Đồ ăn & Đồ uống cơ bản', 4, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2005, NULL, 'A1 - Thời tiết & Quần áo', 'Học từ vựng về Thời tiết & Quần áo cơ bản', 5, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2006, NULL, 'A1 - Nhà cửa & Đồ đạc', 'Học từ vựng về Nhà cửa & Đồ đạc cơ bản', 6, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2007, NULL, 'A1 - Động vật & Thiên nhiên', 'Học từ vựng về Động vật & Thiên nhiên cơ bản', 7, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2008, NULL, 'A1 - Hoạt động hàng ngày', 'Học từ vựng về Hoạt động hàng ngày cơ bản', 8, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2009, NULL, 'A1 - Màu sắc & Số đếm', 'Học từ vựng về Màu sắc & Số đếm cơ bản', 9, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2010, NULL, 'A1 - Phương tiện giao thông', 'Học từ vựng về Phương tiện giao thông cơ bản', 10, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),

(2011, NULL, 'A2 - Mua sắm & Giá cả', 'Học từ vựng về Mua sắm & Giá cả sơ cấp', 1, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2012, NULL, 'A2 - Du lịch & Khách sạn', 'Học từ vựng về Du lịch & Khách sạn sơ cấp', 2, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2013, NULL, 'A2 - Sức khỏe & Cơ thể', 'Học từ vựng về Sức khỏe & Cơ thể sơ cấp', 3, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2014, NULL, 'A2 - Giải trí & Thể thao', 'Học từ vựng về Giải trí & Thể thao sơ cấp', 4, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2015, NULL, 'A2 - Nghề nghiệp & Công việc', 'Học từ vựng về Nghề nghiệp & Công việc sơ cấp', 5, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2016, NULL, 'A2 - Công nghệ cơ bản', 'Học từ vựng về Công nghệ cơ bản sơ cấp', 6, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2017, NULL, 'A2 - Địa điểm trong thành phố', 'Học từ vựng về Địa điểm trong thành phố sơ cấp', 7, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2018, NULL, 'A2 - Thời gian rảnh rỗi', 'Học từ vựng về Thời gian rảnh rỗi sơ cấp', 8, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2019, NULL, 'A2 - Lễ hội & Sự kiện', 'Học từ vựng về Lễ hội & Sự kiện sơ cấp', 9, 'TỪ VỰNG CEFR', 'IN_PROGRESS'),
(2020, NULL, 'A2 - Mô tả người & vật', 'Học từ vựng về Mô tả người & vật sơ cấp', 10, 'TỪ VỰNG CEFR', 'IN_PROGRESS')
ON CONFLICT (id) DO NOTHING;

-- 5. Seed 12 câu hỏi Placement Test (không gán lesson_id vì thuộc kiểm tra đầu vào)
-- Câu hỏi 1 (VOCABULARY)
INSERT INTO questions (id, lesson_id, source_type, question_text, explanation, difficulty)
VALUES (1, NULL, 'PLACEMENT_TEST', 'Choose the synonym of the word "generous":', 'Generous means showing readiness to give more of something, especially money, than is strictly necessary or expected.', 'A2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (question_id, option_key, option_value, is_correct) VALUES
(1, 'A', 'Kind and willing to share/give', TRUE),
(1, 'B', 'Selfish and greedy', FALSE),
(1, 'C', 'Lazy and inactive', FALSE),
(1, 'D', 'Active and noisy', FALSE);

-- Câu hỏi 2 (VOCABULARY)
INSERT INTO questions (id, lesson_id, source_type, question_text, explanation, difficulty)
VALUES (2, NULL, 'PLACEMENT_TEST', 'Which word describes a person who is very determined to do something and refuses to change their mind?', 'A stubborn person is determined not to change their opinion or attitude.', 'B1')
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (question_id, option_key, option_value, is_correct) VALUES
(2, 'A', 'Stubborn', TRUE),
(2, 'B', 'Flexible', FALSE),
(2, 'C', 'Optimistic', FALSE),
(2, 'D', 'Reliable', FALSE);

-- Câu hỏi 3 (VOCABULARY)
INSERT INTO questions (id, lesson_id, source_type, question_text, explanation, difficulty)
VALUES (3, NULL, 'PLACEMENT_TEST', 'What is the meaning of the idiom "a piece of cake"?', 'The idiom "a piece of cake" means a task or activity that is very easy.', 'B2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (question_id, option_key, option_value, is_correct) VALUES
(3, 'A', 'A delicious dessert served at a party', FALSE),
(3, 'B', 'Something that is very easy to do', TRUE),
(3, 'C', 'A difficult problem that needs solving', FALSE),
(3, 'D', 'A special birthday celebration', FALSE);

-- Câu hỏi 4 (GRAMMAR)
INSERT INTO questions (id, lesson_id, source_type, question_text, explanation, difficulty)
VALUES (4, NULL, 'PLACEMENT_TEST', 'Neither the teacher nor the students ______ present at the meeting yesterday.', 'With "neither... nor...", the verb agrees with the closer subject, which is "students" (plural), and the tense is past ("yesterday"), so we use "were".', 'A2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (question_id, option_key, option_value, is_correct) VALUES
(4, 'A', 'was', FALSE),
(4, 'B', 'were', TRUE),
(4, 'C', 'are', FALSE),
(4, 'D', 'is', FALSE);

-- Câu hỏi 5 (GRAMMAR)
INSERT INTO questions (id, lesson_id, source_type, question_text, explanation, difficulty)
VALUES (5, NULL, 'PLACEMENT_TEST', 'By the time we arrived at the cinema yesterday, the movie ______.', 'We use Past Perfect (had + V3) to express an action that happened before another past action (arrived).', 'B1')
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (question_id, option_key, option_value, is_correct) VALUES
(5, 'A', 'already started', FALSE),
(5, 'B', 'has already started', FALSE),
(5, 'C', 'had already started', TRUE),
(5, 'D', 'was starting', FALSE);

-- Câu hỏi 6 (GRAMMAR)
INSERT INTO questions (id, lesson_id, source_type, question_text, explanation, difficulty)
VALUES (6, NULL, 'PLACEMENT_TEST', 'If she ______ harder last semester, she would have passed the exam.', 'This is a Conditional Type 3 sentence expressing a regret/hypothetical situation in the past. Structure: If + S + had + V3, S + would + have + V3.', 'B2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (question_id, option_key, option_value, is_correct) VALUES
(6, 'A', 'studied', FALSE),
(6, 'B', 'had studied', TRUE),
(6, 'C', 'has studied', FALSE),
(6, 'D', 'studies', FALSE);

-- Câu hỏi 7 (LISTENING)
INSERT INTO questions (id, lesson_id, source_type, question_text, explanation, difficulty)
VALUES (7, NULL, 'PLACEMENT_TEST', '[Audio Question] Listen to the audio. What is the speaker''s main occupation?', 'The audio mentions preparing delicious recipes and working in a busy restaurant kitchen.', 'A2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (question_id, option_key, option_value, is_correct) VALUES
(7, 'A', 'Teacher', FALSE),
(7, 'B', 'Chef', TRUE),
(7, 'C', 'Doctor', FALSE),
(7, 'D', 'Photographer', FALSE);

-- Câu hỏi 8 (LISTENING)
INSERT INTO questions (id, lesson_id, source_type, question_text, explanation, difficulty)
VALUES (8, NULL, 'PLACEMENT_TEST', '[Audio Question] Listen to the audio. Why did the man cancel the morning meeting?', 'The speaker explains he was stuck at the airport due to a delayed flight.', 'B1')
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (question_id, option_key, option_value, is_correct) VALUES
(8, 'A', 'He was feeling ill', FALSE),
(8, 'B', 'He had a flight delay', TRUE),
(8, 'C', 'He forgot the time', FALSE),
(8, 'D', 'He had a family emergency', FALSE);

-- Câu hỏi 9 (LISTENING)
INSERT INTO questions (id, lesson_id, source_type, question_text, explanation, difficulty)
VALUES (9, NULL, 'PLACEMENT_TEST', '[Audio Question] Listen to the audio. What will the weather be like tomorrow according to the forecast?', 'The weather forecast predicts a major storm with heavy rain and thunderstorms starting tomorrow morning.', 'B2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (question_id, option_key, option_value, is_correct) VALUES
(9, 'A', 'Heavy rain and thunderstorm', TRUE),
(9, 'B', 'Sunny and warm weather', FALSE),
(9, 'C', 'Snow and strong wind', FALSE),
(9, 'D', 'Cloudy skies with no precipitation', FALSE);

-- Câu hỏi 10 (READING)
INSERT INTO questions (id, lesson_id, source_type, question_text, explanation, difficulty)
VALUES (10, NULL, 'PLACEMENT_TEST', 'Read the passage:\n"Technology is changing the way we work. More people are working from home, which reduces commuting time and increases flexibility. However, it also makes it harder to separate work from personal life."\n\nWhat is the main drawback of remote work mentioned in the text?', 'The passage states that remote work "makes it harder to separate work from personal life."', 'A2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (question_id, option_key, option_value, is_correct) VALUES
(10, 'A', 'Commuting cost is higher', FALSE),
(10, 'B', 'Difficulty in separating work and personal life', TRUE),
(10, 'C', 'Lack of technology tools', FALSE),
(10, 'D', 'Lower productivity', FALSE);

-- Câu hỏi 11 (READING)
INSERT INTO questions (id, lesson_id, source_type, question_text, explanation, difficulty)
VALUES (11, NULL, 'PLACEMENT_TEST', 'Read the passage:\n"Organic farming avoids the use of synthetic chemical fertilizers. Instead, it relies on crop rotation and compost to maintain soil productivity. Proponents argue it is more sustainable in the long run."\n\nWhat does organic farming use instead of synthetic chemicals?', 'The text mentions that organic farming "relies on crop rotation and compost to maintain soil productivity" instead of synthetic chemical fertilizers.', 'B1')
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (question_id, option_key, option_value, is_correct) VALUES
(11, 'A', 'Heavy agricultural machinery', FALSE),
(11, 'B', 'Crop rotation and compost', TRUE),
(11, 'C', 'Genetically modified seeds', FALSE),
(11, 'D', 'Imported soil from other regions', FALSE);

-- Câu hỏi 12 (READING)
INSERT INTO questions (id, lesson_id, source_type, question_text, explanation, difficulty)
VALUES (12, NULL, 'PLACEMENT_TEST', 'Read the passage:\n"The Great Barrier Reef is the world''s largest coral reef system, composed of over 2,900 individual reefs. However, global warming poses a severe threat to its biodiversity due to rising water temperatures causing coral bleaching."\n\nWhat is threatening the biodiversity of the Great Barrier Reef?', 'The passage explicitly mentions that "global warming poses a severe threat to its biodiversity due to rising water temperatures causing coral bleaching."', 'B2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (question_id, option_key, option_value, is_correct) VALUES
(12, 'A', 'Overfishing by commercial boats', FALSE),
(12, 'B', 'Global warming and rising temperatures', TRUE),
(12, 'C', 'Excessive tourism activities', FALSE),
(12, 'D', 'Industrial water pollution', FALSE);

-- 6. Cập nhật serial sequence cho PostgreSQL để tránh lỗi trùng lặp ID khi tự động sinh
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(max(id), 1)) FROM users;
SELECT setval(pg_get_serial_sequence('roadmaps', 'id'), COALESCE(max(id), 1)) FROM roadmaps;
SELECT setval(pg_get_serial_sequence('modules', 'id'), COALESCE(max(id), 1)) FROM modules;
SELECT setval(pg_get_serial_sequence('questions', 'id'), COALESCE(max(id), 1)) FROM questions;
SELECT setval(pg_get_serial_sequence('question_options', 'id'), COALESCE(max(id), 1)) FROM question_options;
