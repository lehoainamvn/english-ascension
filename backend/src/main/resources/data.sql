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

INSERT INTO users (email, password, role, active, streak, coins, exp, level, created_at, updated_at)
VALUES (
    'admin@gmail.com', 
    '$2a$10$wPxq/hC9KzXb4sVqJb6d2eC0bL/XlJ0.w8wOqJgC4yZ.OpxP6.Wc.', -- Mật khẩu: 123456
    'ROLE_ADMIN', 
    TRUE, 
    10, 
    500, 
    5000, 
    10,
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
-- ====================================================================
-- 3. Clear Existing Preset Roadmaps & Modules (For clean re-seed)
-- ====================================================================
DELETE FROM user_progress WHERE resource_type = 'ROADMAP' AND (resource_id IN (100, 101, 102, 103, 104) OR resource_id IN (SELECT id FROM learning_roadmaps WHERE is_preset = TRUE));
DELETE FROM user_progress WHERE resource_type = 'MODULE' AND resource_id IN (SELECT id FROM learning_modules WHERE roadmap_id IN (100, 101, 102, 103, 104) OR roadmap_id IN (SELECT id FROM learning_roadmaps WHERE is_preset = TRUE));
DELETE FROM flashcards WHERE module_id IN (SELECT id FROM learning_modules WHERE roadmap_id IN (100, 101, 102, 103, 104) OR roadmap_id IN (SELECT id FROM learning_roadmaps WHERE is_preset = TRUE));
DELETE FROM learning_modules WHERE roadmap_id IN (100, 101, 102, 103, 104) OR roadmap_id IN (SELECT id FROM learning_roadmaps WHERE is_preset = TRUE);
UPDATE user_learning_paths SET roadmap_id = NULL WHERE roadmap_id IN (100, 101, 102, 103, 104) OR roadmap_id IN (SELECT id FROM learning_roadmaps WHERE is_preset = TRUE);
DELETE FROM roadmap_lessons WHERE roadmap_id IN (100, 101, 102, 103, 104) OR roadmap_id IN (SELECT id FROM learning_roadmaps WHERE is_preset = TRUE);
DELETE FROM learning_roadmaps WHERE id IN (100, 101, 102, 103, 104) OR is_preset = TRUE;

-- ====================================================================
-- 4. Seed Preset Roadmaps (Lộ trình chung - Bắt đầu từ ID 100)
-- ====================================================================
INSERT INTO learning_roadmaps (id, cefr_level, toeic_equivalent, overall_evaluation, is_preset, thumbnail_emoji, difficulty_label, modules_count, created_at, updated_at)
VALUES 
(
    100, 
    'A1', 
    '100-150', 
    'Lộ trình cơ bản A1 giúp nắm bắt từ vựng, ngữ pháp đơn giản, và làm quen với các chủ đề hội thoại đời sống hàng ngày.', 
    TRUE, 
    'star', 
    'Co ban', 
    4, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
),
(
    101, 
    'A2', 
    '150-350', 
    'Lộ trình A2 giúp mở rộng từ vựng, củng cố các cấu trúc ngữ pháp thông dụng và nâng cao khả năng nghe đọc cơ bản.', 
    TRUE, 
    'sparkles', 
    'Co ban', 
    4, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
),
(
    102, 
    'B1', 
    '350-550', 
    'Lộ trình B1 giúp bạn bước vào giai đoạn trung cấp, tự tin viết các đoạn văn dài, nắm vững câu điều kiện, bị động và cải thiện kỹ năng đàm thoại.', 
    TRUE, 
    'diamond', 
    'Trung cap', 
    4, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
),
(
    103, 
    'B2', 
    '550-700', 
    'Lộ trình B2 giúp bạn hoàn thiện ngữ pháp phức tạp, nâng cao từ vựng chuyên ngành xã hội, tài chính, công nghệ và phân tích các bài đọc chuyên sâu.', 
    TRUE, 
    'trophy', 
    'Trung cap', 
    4, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
),
(
    104, 
    'C1', 
    '700-990', 
    'Lộ trình C1 chuyên sâu tập trung vào các văn bản học thuật phức tạp, đàm phán chính trị, kinh tế vĩ mô và cách diễn đạt tinh tế ở trình độ cao cấp.', 
    TRUE, 
    'crown', 
    'Cao cap', 
    4, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
);

-- ====================================================================
-- 5. Seed Learning Modules for Preset Roadmaps (Auto-increment IDs)
-- ====================================================================
INSERT INTO learning_modules (roadmap_id, title, description, order_index, category, status, created_at)
VALUES 
-- Modules for Roadmap 100 (A1)
(100, 'Từ vựng A1', 'Học các chủ đề từ vựng A1 căn bản như: Chào hỏi, gia đình, trường học, đồ ăn...', 1, 'VOCABULARY', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(100, 'Ngữ pháp A1', 'Làm quen với các thì đơn giản, động từ To Be, danh từ số nhiều và câu hỏi WH-', 2, 'GRAMMAR', 'LOCKED', CURRENT_TIMESTAMP),
(100, 'Đọc hiểu A1', 'Đọc các văn bản ngắn như email giới thiệu, thông báo đơn giản hoặc nhật ký hàng ngày', 3, 'READING', 'LOCKED', CURRENT_TIMESTAMP),
(100, 'Nghe hiểu A1', 'Nghe các cuộc hội thoại ngắn về chỉ đường, mua sắm hoặc giới thiệu bản thân', 4, 'LISTENING', 'LOCKED', CURRENT_TIMESTAMP),

-- Modules for Roadmap 101 (A2)
(101, 'Từ vựng A2', 'Mở rộng từ vựng về mua sắm, du lịch, sức khỏe, công việc và miêu tả người', 1, 'VOCABULARY', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(101, 'Ngữ pháp A2', 'Học thì Hiện tại tiếp diễn, Quá khứ đơn, Tương lai đơn và So sánh hơn/nhất', 2, 'GRAMMAR', 'LOCKED', CURRENT_TIMESTAMP),
(101, 'Đọc hiểu A2', 'Đọc hiểu các thông báo công ty, cẩm nang du lịch và thư từ công sở đơn giản', 3, 'READING', 'LOCKED', CURRENT_TIMESTAMP),
(101, 'Nghe hiểu A2', 'Nghe hiểu các thông báo nhà ga, thảo luận kế hoạch đi chơi hoặc phỏng vấn xin việc cơ bản', 4, 'LISTENING', 'LOCKED', CURRENT_TIMESTAMP),

-- Modules for Roadmap 102 (B1)
(102, 'Từ vựng B1', 'Nâng cao từ vựng chủ đề môi trường, văn hóa, khoa học đổi mới và phát triển cá nhân', 1, 'VOCABULARY', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(102, 'Ngữ pháp B1', 'Nắm vững thì Hiện tại hoàn thành, câu bị động, câu điều kiện loại 1 & 2 và mệnh đề quan hệ', 2, 'GRAMMAR', 'LOCKED', CURRENT_TIMESTAMP),
(102, 'Đọc hiểu B1', 'Đọc hiểu các báo cáo tóm tắt, thư tín đàm phán hợp đồng và bài viết năng suất công việc', 3, 'READING', 'LOCKED', CURRENT_TIMESTAMP),
(102, 'Nghe hiểu B1', 'Nghe hiểu các cuộc họp phòng ban, trao đổi với nhà cung cấp hoặc hướng dẫn đào tạo nhân viên', 4, 'LISTENING', 'LOCKED', CURRENT_TIMESTAMP),

-- Modules for Roadmap 103 (B2)
(103, 'Từ vựng B2', 'Từ vựng chuyên sâu về tài chính, quản trị, luật pháp, y học và trí tuệ nhân tạo', 1, 'VOCABULARY', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(103, 'Ngữ pháp B2', 'Học câu gián tiếp nâng cao, đảo ngữ, câu giả định, câu cleft và các thì tương lai hoàn thành', 2, 'GRAMMAR', 'LOCKED', CURRENT_TIMESTAMP),
(103, 'Đọc hiểu B2', 'Đọc hiểu báo cáo tài chính quý, thông báo sáp nhập, phân tích rủi ro và điều khoản sử dụng AI', 3, 'READING', 'LOCKED', CURRENT_TIMESTAMP),
(103, 'Nghe hiểu B2', 'Nghe hiểu tranh luận tài chính thường niên, hội thảo an ninh mạng và thảo luận hợp đồng liên doanh', 4, 'LISTENING', 'LOCKED', CURRENT_TIMESTAMP),

-- Modules for Roadmap 104 (C1)
(104, 'Từ vựng C1', 'Từ vựng học thuật cao cấp về quan hệ quốc tế, triết học, đạo đức nghề nghiệp và khoa học vũ trụ', 1, 'VOCABULARY', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(104, 'Ngữ pháp C1', 'Sử dụng cấu trúc đảo ngữ phức tạp, phân từ độc lập, câu cleft nhấn mạnh và liên từ liên kết ý tưởng nâng cao', 2, 'GRAMMAR', 'LOCKED', CURRENT_TIMESTAMP),
(104, 'Đọc hiểu C1', 'Đọc các tóm tắt nghiên cứu khoa học, tài liệu ngoại giao, essay triết học và phán quyết pháp lý', 3, 'READING', 'LOCKED', CURRENT_TIMESTAMP),
(104, 'Nghe hiểu C1', 'Nghe các bài giảng vật lý thiên văn, tranh luận chính trị, phỏng vấn giải Nobel và đàm phán M&A', 4, 'LISTENING', 'LOCKED', CURRENT_TIMESTAMP);

-- ====================================================================
-- 5B. Seed Self-Study CEFR Vocabulary Topics (roadmap_id = NULL)
-- ====================================================================
INSERT INTO learning_modules (roadmap_id, title, description, order_index, category, status, created_at)
VALUES
(NULL, 'A1 - Chào hỏi & Bản thân', 'Học từ vựng về Chào hỏi & Bản thân cơ bản', 1, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A1 - Gia đình & Bạn bè', 'Học từ vựng về Gia đình & Bạn bè cơ bản', 2, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A1 - Trường học & Học tập', 'Học từ vựng về Trường học & Học tập cơ bản', 3, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A1 - Đồ ăn & Đồ uống', 'Học từ vựng về Đồ ăn & Đồ uống cơ bản', 4, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A1 - Thời tiết & Quần áo', 'Học từ vựng về Thời tiết & Quần áo cơ bản', 5, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A1 - Nhà cửa & Đồ đạc', 'Học từ vựng về Nhà cửa & Đồ đạc cơ bản', 6, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A1 - Động vật & Thiên nhiên', 'Học từ vựng về Động vật & Thiên nhiên cơ bản', 7, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A1 - Hoạt động hàng ngày', 'Học từ vựng về Hoạt động hàng ngày cơ bản', 8, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A1 - Màu sắc & Số đếm', 'Học từ vựng về Màu sắc & Số đếm cơ bản', 9, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A1 - Phương tiện giao thông', 'Học từ vựng về Phương tiện giao thông cơ bản', 10, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),

(NULL, 'A2 - Mua sắm & Giá cả', 'Học từ vựng về Mua sắm & Giá cả sơ cấp', 1, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A2 - Du lịch & Khách sạn', 'Học từ vựng về Du lịch & Khách sạn sơ cấp', 2, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A2 - Sức khỏe & Cơ thể', 'Học từ vựng về Sức khỏe & Cơ thể sơ cấp', 3, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A2 - Giải trí & Thể thao', 'Học từ vựng về Giải trí & Thể thao sơ cấp', 4, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A2 - Nghề nghiệp & Công việc', 'Học từ vựng về Nghề nghiệp & Công việc sơ cấp', 5, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A2 - Công nghệ cơ bản', 'Học từ vựng về Công nghệ cơ bản sơ cấp', 6, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A2 - Địa điểm trong thành phố', 'Học từ vựng về Địa điểm trong thành phố sơ cấp', 7, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A2 - Thời gian rảnh rỗi', 'Học từ vựng về Thời gian rảnh rỗi sơ cấp', 8, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A2 - Lễ hội & Sự kiện', 'Học từ vựng về Lễ hội & Sự kiện sơ cấp', 9, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'A2 - Mô tả người & vật', 'Học từ vựng về Mô tả người & vật sơ cấp', 10, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),

(NULL, 'B1 - Môi trường & Biến đổi khí hậu', 'Học từ vựng về Môi trường & Biến đổi khí hậu trung cấp', 1, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B1 - Giáo dục & Học thuật', 'Học từ vựng về Giáo dục & Học thuật trung cấp', 2, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B1 - Văn hóa & Nghệ thuật', 'Học từ vựng về Văn hóa & Nghệ thuật trung cấp', 3, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B1 - Kinh doanh & Khởi nghiệp', 'Học từ vựng về Kinh doanh & Khởi nghiệp trung cấp', 4, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B1 - Phương tiện truyền thông', 'Học từ vựng về Phương tiện truyền thông trung cấp', 5, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B1 - Các mối quan hệ xã hội', 'Học từ vựng về Các mối quan hệ xã hội trung cấp', 6, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B1 - Phát triển cá nhân', 'Học từ vựng về Phát triển cá nhân trung cấp', 7, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B1 - Khoa học & Đổi mới', 'Học từ vựng về Khoa học & Đổi mới trung cấp', 8, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B1 - Giao thông công cộng', 'Học từ vựng về Giao thông công cộng trung cấp', 9, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B1 - Du lịch khám phá', 'Học từ vựng về Du lịch khám phá trung cấp', 10, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),

(NULL, 'B2 - Tài chính & Đầu tư', 'Học từ vựng về Tài chính & Đầu tư trung cao cấp', 1, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B2 - Quản trị doanh nghiệp', 'Học từ vựng về Quản trị doanh nghiệp trung cao cấp', 2, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B2 - Luật pháp & Xã hội', 'Học từ vựng về Luật pháp & Xã hội trung cao cấp', 3, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B2 - Y học & Công nghệ sinh học', 'Học từ vựng về Y học & Công nghệ sinh học trung cao cấp', 4, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B2 - Toàn cầu hóa', 'Học từ vựng về Toàn cầu hóa trung cao cấp', 5, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B2 - Tâm lý học hành vi', 'Học từ vựng về Tâm lý học hành vi trung cao cấp', 6, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B2 - Thị trường lao động', 'Học từ vựng về Thị trường lao động trung cao cấp', 7, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B2 - Trí tuệ nhân tạo', 'Học từ vựng về Trí tuệ nhân tạo trung cao cấp', 8, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B2 - Thương mại quốc tế', 'Học từ vựng về Thương mại quốc tế trung cao cấp', 9, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'B2 - Truyền thông đại chúng', 'Học từ vựng về Truyền thông đại chúng trung cao cấp', 10, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),

(NULL, 'C1 - Ngoại giao & Quan hệ quốc tế', 'Học từ vựng về Ngoại giao & Quan hệ quốc tế cao cấp', 1, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'C1 - Nghiên cứu & Học thuật chuyên sâu', 'Học từ vựng về Nghiên cứu & Học thuật chuyên sâu cao cấp', 2, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'C1 - Văn học & Ngôn ngữ học', 'Học từ vựng về Văn học & Ngôn ngữ học cao cấp', 3, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'C1 - Triết học & Tư tưởng', 'Học từ vựng về Triết học & Tư tưởng cao cấp', 4, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'C1 - Chính sách công & Quản lý nhà nước', 'Học từ vựng về Chính sách công & Quản lý nhà nước cao cấp', 5, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'C1 - Đạo đức nghề nghiệp', 'Học từ vựng về Đạo đức nghề nghiệp cao cấp', 6, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'C1 - Phát triển bền vững toàn cầu', 'Học từ vựng về Phát triển bền vững toàn cầu cao cấp', 7, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'C1 - Khoa học không gian & Thiên văn học', 'Học từ vựng về Khoa học không gian & Thiên văn học cao cấp', 8, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'C1 - Kinh tế học vĩ mô', 'Học từ vựng về Kinh tế học vĩ mô cao cấp', 9, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP),
(NULL, 'C1 - Xu hướng văn hóa đương đại', 'Học từ vựng về Xu hướng văn hóa đương đại cao cấp', 10, 'TỪ VỰNG CEFR', 'IN_PROGRESS', CURRENT_TIMESTAMP);;

-- ====================================================================
-- 6. Cập nhật serial sequence cho PostgreSQL để tránh lỗi trùng lặp ID
-- ====================================================================
SELECT setval(pg_get_serial_sequence('learning_roadmaps', 'id'), COALESCE(max(id), 1)) FROM learning_roadmaps;
SELECT setval(pg_get_serial_sequence('learning_modules', 'id'), COALESCE(max(id), 1)) FROM learning_modules;
SELECT setval(pg_get_serial_sequence('questions', 'id'), COALESCE(max(id), 1)) FROM questions;

