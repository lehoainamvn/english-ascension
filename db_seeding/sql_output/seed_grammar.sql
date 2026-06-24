INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Verb To Be', 'A1', '# Verb To Be
## Cấu trúc/Công thức
- Công thức của Verb To Be trong hiện tại đơn:
  * Tôi là: I am
  * Bạn là: You are
  * Anh/Cô/Chị/Em là: He/She/It is
  * Chúng tôi là: We are
  * Các bạn là: You are
  * Họ là: They are
- Công thức của Verb To Be trong quá khứ đơn:
  * Tôi là: I was
  * Bạn là: You were
  * Anh/Cô/Chị/Em là: He/She/It was
  * Chúng tôi là: We were
  * Các bạn là: You were
  * Họ là: They were
## Cách dùng
- Verb To Be được sử dụng để mô tả trạng thái, tính cách, nghề nghiệp, quốc tịch,...
- Verb To Be cũng được sử dụng trong câu hỏi và câu trả lời.
## Ví dụ minh họa
- Tôi là sinh viên. (I am a student.)
- Bạn là ai? (Who are you?)
- Anh ấy là giáo viên. (He is a teacher.)
## Mẹo học
- Hãy học thuộc công thức của Verb To Be trong hiện tại đơn và quá khứ đơn.
- Hãy thực hành sử dụng Verb To Be trong câu hỏi và câu trả lời.
## Các lỗi thường gặp
- Sử dụng sai công thức của Verb To Be.
- Sử dụng Verb To Be không đúng ngữ cảnh.
## Tóm tắt
- Verb To Be là một động từ quan trọng trong tiếng Anh.
- Verb To Be được sử dụng để mô tả trạng thái, tính cách, nghề nghiệp, quốc tịch,...
- Hãy học thuộc công thức của Verb To Be và thực hành sử dụng nó trong câu hỏi và câu trả lời.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Verb To Be' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A1', 'What is the correct form of Verb To Be for ''Tôi'' in the present simple?', 'I was', 'I am', 'I is', 'I are', 'B', 'B', 'Động từ ''to be'' trong hiện tại đơn cho chủ ngữ ''Tôi'' là ''I am''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Verb To Be' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A1', 'What is the correct form of Verb To Be for ''Anh ấy'' in the present simple?', 'He am', 'He is', 'He are', 'He was', 'B', 'B', 'Động từ ''to be'' trong hiện tại đơn cho chủ ngữ ''Anh ấy'' là ''He is''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Verb To Be' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A1', 'What is the correct form of Verb To Be for ''Chúng tôi'' in the present simple?', 'We is', 'We are', 'We am', 'We was', 'B', 'B', 'Động từ ''to be'' trong hiện tại đơn cho chủ ngữ ''Chúng tôi'' là ''We are''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Verb To Be' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A1', 'What is the correct form of Verb To Be for ''Họ'' in the present simple?', 'They is', 'They are', 'They am', 'They was', 'B', 'B', 'Động từ ''to be'' trong hiện tại đơn cho chủ ngữ ''Họ'' là ''They are''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Verb To Be' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A1', 'What is the correct form of Verb To Be for ''Tôi'' in the past simple?', 'I am', 'I is', 'I are', 'I was', 'D', 'D', 'Động từ ''to be'' trong quá khứ đơn cho chủ ngữ ''Tôi'' là ''I was''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Verb To Be' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A1', 'What is the correct form of Verb To Be for ''Anh ấy'' in the past simple?', 'He am', 'He is', 'He are', 'He was', 'D', 'D', 'Động từ ''to be'' trong quá khứ đơn cho chủ ngữ ''Anh ấy'' là ''He was''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Verb To Be' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A1', 'What is the correct form of Verb To Be for ''Chúng tôi'' in the past simple?', 'We is', 'We are', 'We am', 'We were', 'D', 'D', 'Động từ ''to be'' trong quá khứ đơn cho chủ ngữ ''Chúng tôi'' là ''We were''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Verb To Be' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A1', 'What is the correct form of Verb To Be for ''Họ'' in the past simple?', 'They is', 'They are', 'They am', 'They were', 'D', 'D', 'Động từ ''to be'' trong quá khứ đơn cho chủ ngữ ''Họ'' là ''They were''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Verb To Be' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A1', 'Which of the following sentences is grammatically correct?', 'I is a student.', 'I am a student.', 'I are a student.', 'I was a student.', 'B', 'B', 'Câu ''I am a student'' là câu đúng ngữ pháp vì sử dụng đúng công thức của Verb To Be trong hiện tại đơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Verb To Be' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A1', 'Which of the following sentences is grammatically correct?', 'He are a teacher.', 'He is a teacher.', 'He am a teacher.', 'He was a teacher.', 'B', 'B', 'Câu ''He is a teacher'' là câu đúng ngữ pháp vì sử dụng đúng công thức của Verb To Be trong hiện tại đơn.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Present Simple', 'A1', '
# Cấu trúc/Công thức
Cấu trúc của thì hiện tại đơn (Present Simple) như sau:
- Đối với động từ thường: 
  * Chủ ngữ + động từ (động từ to be là *am/is/are*)
  * Ví dụ: I **am** a student.
- Đối với động từ có quy tắc (cộng -s, -es vào động từ):
  * Chủ ngữ + động từ (cộng -s, -es vào động từ)
  * Ví dụ: He **eats** breakfast every morning.

# Cách dùng
Thì hiện tại đơn được sử dụng để mô tả:
- Thói quen hàng ngày
- Sự thật hiển nhiên
- Lập thời gian biểu

# Ví dụ minh họa
- Tôi **đi** học vào lúc 7 giờ sáng. (I **go** to school at 7 am.)
- Cô **là** giáo viên tiếng Anh. (She **is** an English teacher.)

# Mẹo học
- Hãy học thuộc các động từ thường dùng trong thì hiện tại đơn.
- Sử dụng thì hiện tại đơn để mô tả thói quen hàng ngày.

# Các lỗi thường gặp
- Sử dụng sai động từ (thường/ bất quy tắc).
- Sử dụng sai thì (hiện tại đơn/ hiện tại tiếp diễn).

# Tóm tắt
Thì hiện tại đơn là một trong những thì cơ bản của tiếng Anh, được sử dụng để mô tả thói quen hàng ngày, sự thật hiển nhiên và lập thời gian biểu. Hãy học thuộc cấu trúc, cách dùng và ví dụ minh họa để sử dụng thì hiện tại đơn một cách hiệu quả.
', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Simple' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A1', 'What is the correct form of the verb ''go'' in the present simple for the subject ''he''?', 'go', 'goes', 'going', 'went', 'B', 'B', 'Động từ ''go'' cần được cộng -es khi sử dụng với chủ ngữ ''he'' trong thì hiện tại đơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Simple' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A1', 'Which of the following sentences is in the present simple tense?', 'I am going to the store.', 'I go to the store every day.', 'I went to the store yesterday.', 'I will go to the store tomorrow.', 'B', 'B', 'Câu ''I go to the store every day.'' mô tả thói quen hàng ngày và được sử dụng trong thì hiện tại đơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Simple' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A1', 'What is the correct form of the verb ''be'' in the present simple for the subject ''I''?', 'am', 'is', 'are', 'be', 'A', 'A', 'Động từ ''be'' cần được sử dụng dưới dạng ''am'' khi chủ ngữ là ''I'' trong thì hiện tại đơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Simple' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A1', 'Which of the following sentences is NOT in the present simple tense?', 'I eat breakfast every morning.', 'I am eating breakfast now.', 'I go to school every day.', 'I will eat breakfast tomorrow.', 'B', 'B', 'Câu ''I am eating breakfast now.'' được sử dụng trong thì hiện tại tiếp diễn, không phải thì hiện tại đơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Simple' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A1', 'What is the correct form of the verb ''have'' in the present simple for the subject ''they''?', 'have', 'has', 'having', 'had', 'A', 'A', 'Động từ ''have'' cần được sử dụng dưới dạng ''have'' khi chủ ngữ là ''they'' trong thì hiện tại đơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Simple' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A1', 'Which of the following sentences is in the present simple tense?', 'I am studying English.', 'I study English every day.', 'I studied English yesterday.', 'I will study English tomorrow.', 'B', 'B', 'Câu ''I study English every day.'' mô tả thói quen hàng ngày và được sử dụng trong thì hiện tại đơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Simple' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A1', 'What is the correct form of the verb ''do'' in the present simple for the subject ''it''?', 'do', 'does', 'doing', 'did', 'B', 'B', 'Động từ ''do'' cần được cộng -es khi sử dụng với chủ ngữ ''it'' trong thì hiện tại đơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Simple' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A1', 'Which of the following sentences is NOT in the present simple tense?', 'I live in Hanoi.', 'I am living in Hanoi.', 'I go to school every day.', 'I will live in Hanoi tomorrow.', 'B', 'B', 'Câu ''I am living in Hanoi.'' được sử dụng trong thì hiện tại tiếp diễn, không phải thì hiện tại đơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Simple' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A1', 'What is the correct form of the verb ''be'' in the present simple for the subject ''you''?', 'am', 'is', 'are', 'be', 'C', 'C', 'Động từ ''be'' cần được sử dụng dưới dạng ''are'' khi chủ ngữ là ''you'' trong thì hiện tại đơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Simple' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A1', 'Which of the following sentences is in the present simple tense?', 'I will go to the movies tonight.', 'I go to the movies every weekend.', 'I went to the movies last night.', 'I am going to the movies now.', 'B', 'B', 'Câu ''I go to the movies every weekend.'' mô tả thói quen hàng ngày và được sử dụng trong thì hiện tại đơn.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Articles (A/An/The)', 'A1', '# Bài học về mạo từ (A/An/The) 
## Cấu trúc/Công thức 
- Mạo từ không xác định (A/An): dùng trước danh từ chung đếm được, chỉ một sự vật, một người nào đó không cụ thể. 
- Mạo từ xác định (The): dùng trước danh từ chung và riêng, đếm được và không đếm được, chỉ một sự vật, một người cụ thể. 
## Cách dùng 
- Mạo từ không xác định (A/An): 
  + Dùng trước danh từ bắt đầu bằng nguyên âm (A, E, I, O, U): an apple, an elephant. 
  + Dùng trước danh từ bắt đầu bằng consonant (các chữ cái còn lại): a book, a car. 
- Mạo từ xác định (The): 
  + Dùng trước danh từ chỉ một sự vật, một người cụ thể: the book, the car. 
  + Dùng trước danh từ chỉ một địa điểm, một tổ chức cụ thể: the school, the hospital. 
## Ví dụ minh họa 
- Tôi mua một quả táo (I buy an apple). 
- Tôi đi đến trường học (I go to the school). 
## Mẹo học 
- Hãy nhớ rằng mạo từ không xác định (A/An) chỉ dùng trước danh từ chung đếm được. 
- Hãy nhớ rằng mạo từ xác định (The) dùng trước danh từ chung và riêng, đếm được và không đếm được. 
## Các lỗi thường gặp 
- Sử dụng mạo từ không xác định (A/An) trước danh từ không đếm được. 
- Sử dụng mạo từ xác định (The) trước danh từ chung không cụ thể. 
## Tóm tắt 
- Mạo từ không xác định (A/An) dùng trước danh từ chung đếm được, chỉ một sự vật, một người nào đó không cụ thể. 
- Mạo từ xác định (The) dùng trước danh từ chung và riêng, đếm được và không đếm được, chỉ một sự vật, một người cụ thể.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Articles (A/An/The)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A1', 'Which article is used before a noun starting with a vowel sound?', 'A', 'An', 'The', 'No article', 'B', 'B', 'Mạo từ không xác định (An) được dùng trước danh từ bắt đầu bằng nguyên âm (A, E, I, O, U). Ví dụ: an apple, an elephant.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Articles (A/An/The)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A1', 'Which article is used before a specific noun?', 'A', 'An', 'The', 'No article', 'C', 'C', 'Mạo từ xác định (The) được dùng trước danh từ chỉ một sự vật, một người cụ thể. Ví dụ: the book, the car.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Articles (A/An/The)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A1', 'Which article is used before a plural noun?', 'A', 'An', 'The', 'No article', 'D', 'D', 'Trước danh từ số nhiều, không sử dụng mạo từ. Ví dụ: cats, dogs.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Articles (A/An/The)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A1', 'Which article is used before an uncountable noun?', 'A', 'An', 'The', 'No article', 'D', 'D', 'Trước danh từ không đếm được, không sử dụng mạo từ. Ví dụ: water, air.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Articles (A/An/The)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A1', 'Which article is used before a noun starting with a consonant sound?', 'A', 'An', 'The', 'No article', 'A', 'A', 'Mạo từ không xác định (A) được dùng trước danh từ bắt đầu bằng consonant (các chữ cái còn lại). Ví dụ: a book, a car.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Articles (A/An/The)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A1', 'Which of the following sentences is correct?', 'I buy a apple.', 'I buy an apple.', 'I buy the apple.', 'I buy apple.', 'B', 'B', 'Câu đúng là: I buy an apple. Vì ''apple'' bắt đầu bằng nguyên âm ''a'' nên sử dụng mạo từ ''an''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Articles (A/An/The)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A1', 'Which of the following sentences is correct?', 'I go to school.', 'I go to a school.', 'I go to the school.', 'I go school.', 'C', 'C', 'Câu đúng là: I go to the school. Vì ''school'' là một địa điểm cụ thể nên sử dụng mạo từ ''the''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Articles (A/An/The)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A1', 'Which article is used before a noun that has already been mentioned?', 'A', 'An', 'The', 'No article', 'C', 'C', 'Mạo từ xác định (The) được dùng trước danh từ đã được nhắc đến trước đó. Ví dụ: I have a book. The book is interesting.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Articles (A/An/The)' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A1', 'Which of the following sentences is correct?', 'I eat a breakfast.', 'I eat an breakfast.', 'I eat the breakfast.', 'I eat breakfast.', 'D', 'D', 'Câu đúng là: I eat breakfast. Vì ''breakfast'' là một bữa ăn không đếm được nên không sử dụng mạo từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Articles (A/An/The)' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A1', 'Which article is used before a noun that is unique?', 'A', 'An', 'The', 'No article', 'C', 'C', 'Mạo từ xác định (The) được dùng trước danh từ chỉ một sự vật, một người duy nhất. Ví dụ: the sun, the moon.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Plural Nouns & Pronouns', 'A1', '# Cấu trúc/Công thức 
 Để tạo dạng số nhiều của danh từ, chúng ta thường thêm ''-s'' vào cuối danh từ. 
 Ví dụ: cat -> cats, dog -> dogs. 
 # Cách dùng 
 Dạng số nhiều được sử dụng khi đề cập đến nhiều hơn một danh từ. 
 Ví dụ: I have two cats. 
 # Ví dụ minh họa 
 - Một số danh từ có dạng số nhiều đặc biệt: tooth -> teeth, foot -> feet. 
 - Một số danh từ không thay đổi khi ở dạng số nhiều: fish, sheep. 
 # Mẹo học 
 Hãy học các dạng số nhiều đặc biệt và không thay đổi để sử dụng chính xác. 
 # Các lỗi thường gặp 
 Thêm ''-s'' vào danh từ đã ở dạng số nhiều hoặc quên thêm ''-s'' khi cần. 
 # Tóm tắt 
 Dạng số nhiều của danh từ được tạo bằng cách thêm ''-s'' vào cuối danh từ, nhưng có một số trường hợp đặc biệt cần lưu ý.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Plural Nouns & Pronouns' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A1', 'What is the plural form of ''tooth''?', 'toothes', 'teeth', 'tooths', 'tooth', 'B', 'B', 'Dạng số nhiều của ''tooth'' là ''teeth'', đây là một trường hợp đặc biệt.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Plural Nouns & Pronouns' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A1', 'How do you form the plural of most nouns?', 'Add ''-ing'' to the end', 'Add ''-s'' to the end', 'Add ''-ed'' to the end', 'Do not add anything', 'B', 'B', 'Để tạo dạng số nhiều của hầu hết danh từ, chúng ta thêm ''-s'' vào cuối danh từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Plural Nouns & Pronouns' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A1', 'What is the plural form of ''fish''?', 'fishes', 'fish', 'fishing', 'fishs', 'B', 'B', 'Dạng số nhiều của ''fish'' vẫn là ''fish'', đây là một trường hợp không thay đổi.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Plural Nouns & Pronouns' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A1', 'Why is it important to learn the plural forms of nouns?', 'So you can speak faster', 'So you can write more', 'So you can communicate accurately', 'So you can read more', 'C', 'C', 'Học dạng số nhiều của danh từ giúp bạn giao tiếp chính xác hơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Plural Nouns & Pronouns' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A1', 'What is the plural form of ''cat''?', 'cat', 'cats', 'cates', 'cate', 'B', 'B', 'Dạng số nhiều của ''cat'' là ''cats'', tạo bằng cách thêm ''-s'' vào cuối danh từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Plural Nouns & Pronouns' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A1', 'How do you form the plural of nouns that end in ''-y''?', 'Add ''-s'' to the end', 'Change ''-y'' to ''-ies'' and add ''-s''', 'Do not add anything', 'Add ''-ing'' to the end', 'B', 'B', 'Để tạo dạng số nhiều của danh từ kết thúc bằng ''-y'', chúng ta thay ''-y'' bằng ''-ies'' và thêm ''-s''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Plural Nouns & Pronouns' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A1', 'What is the plural form of ''foot''?', 'foots', 'foot', 'feet', 'footing', 'C', 'C', 'Dạng số nhiều của ''foot'' là ''feet'', đây là một trường hợp đặc biệt.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Plural Nouns & Pronouns' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A1', 'Why do some nouns have the same form in both singular and plural?', 'Because they are not important', 'Because they are exceptions to the rule', 'Because they are always singular', 'Because they are always plural', 'B', 'B', 'Một số danh từ có dạng số nhiều giống với dạng số ít vì chúng là ngoại lệ của quy tắc.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Plural Nouns & Pronouns' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A1', 'What is the plural form of ''sheep''?', 'sheeps', 'sheep', 'sheepe', 'sheeping', 'B', 'B', 'Dạng số nhiều của ''sheep'' vẫn là ''sheep'', đây là một trường hợp không thay đổi.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Plural Nouns & Pronouns' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A1', 'How can you practice forming the plural of nouns?', 'By reading books', 'By writing sentences', 'By speaking with friends', 'All of the above', 'D', 'D', 'Bạn có thể luyện tập tạo dạng số nhiều của danh từ bằng cách đọc sách, viết câu, và giao tiếp với bạn bè.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'There Is / There Are', 'A1', '
# Cấu trúc/Công thức
Để biểu thị sự tồn tại của một thứ gì đó, chúng ta sử dụng cấu trúc `There is` (đối với danh từ số ít) và `There are` (đối với danh từ số nhiều).

## Cách dùng
- `There is` được sử dụng khi chủ ngữ là một danh từ số ít.
- `There are` được sử dụng khi chủ ngữ là một danh từ số nhiều.

## Ví dụ minh họa
- There is a book on the table. (Có một cuốn sách trên bàn)
- There are many books on the shelf. (Có nhiều cuốn sách trên kệ)

## Mẹo học
Học cách phân biệt `There is` và `There are` bằng cách nhớ rằng `is` đi với số ít và `are` đi với số nhiều.

## Các lỗi thường gặp
Một lỗi thường gặp là sử dụng `There is` với danh từ số nhiều và ngược lại.

## Tóm tắt
- Sử dụng `There is` với danh từ số ít.
- Sử dụng `There are` với danh từ số nhiều.
', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'There Is / There Are' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A1', 'What do we use to indicate the existence of one thing?', 'There are', 'There is', 'Is there', 'Are there', 'B', 'B', 'Chúng ta sử dụng ''There is'' để chỉ sự tồn tại của một thứ gì đó, vì nó là cấu trúc dành cho danh từ số ít.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'There Is / There Are' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A1', 'Which sentence is grammatically correct?', 'There are a book on the table', 'There is a book on the table', 'There are books on the table', 'There is books on the table', 'B', 'B', 'Câu ''There is a book on the table'' là câu đúng ngữ pháp vì sử dụng ''There is'' với danh từ số ít ''a book''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'There Is / There Are' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A1', 'What is the correct form to use when talking about many things?', 'There is', 'There are', 'Is there', 'Are there', 'B', 'B', 'Khi nói về nhiều thứ, chúng ta sử dụng ''There are'' vì nó là cấu trúc dành cho danh từ số nhiều.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'There Is / There Are' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A1', 'Which of the following sentences is correct?', 'There is many students in the class', 'There are many students in the class', 'There is a student in the class', 'There are a student in the class', 'B', 'B', 'Câu ''There are many students in the class'' là câu đúng vì sử dụng ''There are'' với danh từ số nhiều ''many students''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'There Is / There Are' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A1', 'What do we use to ask about the existence of something?', 'There is', 'There are', 'Is there', 'Are there', 'C', 'C', 'Chúng ta sử dụng ''Is there'' để hỏi về sự tồn tại của một thứ gì đó, thường đi với danh từ số ít.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'There Is / There Are' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A1', 'Which of the following is a correct question?', 'Are there a book on the table?', 'Is there a book on the table?', 'There is a book on the table?', 'There are a book on the table?', 'B', 'B', 'Câu hỏi ''Is there a book on the table?'' là câu hỏi đúng vì sử dụng ''Is there'' để hỏi về sự tồn tại của một thứ gì đó (một cuốn sách).');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'There Is / There Are' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A1', 'What is the function of ''There is'' and ''There are'' in a sentence?', 'To indicate possession', 'To indicate existence', 'To indicate location', 'To indicate time', 'B', 'B', 'Chức năng của ''There is'' và ''There are'' là để chỉ sự tồn tại của một thứ gì đó trong một không gian hoặc tình huống cụ thể.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'There Is / There Are' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A1', 'Which sentence is grammatically incorrect?', 'There is a dog in the park', 'There are dogs in the park', 'There are a dog in the park', 'There is dogs in the park', 'D', 'D', 'Câu ''There is dogs in the park'' là câu không đúng ngữ pháp vì sử dụng ''There is'' với danh từ số nhiều ''dogs''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'There Is / There Are' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A1', 'What is the correct way to express that there are no things?', 'There is no things', 'There are no things', 'There is not things', 'There are not things', 'B', 'B', 'Cách đúng để biểu thị rằng không có thứ gì là sử dụng ''There are no things'', vì ''no'' đi với ''are'' khi nói về số nhiều.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'There Is / There Are' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A1', 'Which of the following sentences is correct?', 'There is many pencils on the desk', 'There are many pencils on the desk', 'There is a pencil on the desk', 'There are a pencil on the desk', 'B', 'B', 'Câu ''There are many pencils on the desk'' là câu đúng vì sử dụng ''There are'' với danh từ số nhiều ''many pencils''.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Possessive Adjectives & Suffixes', 'A1', '# Cấu trúc/Công thức 
 Possessive adjectives được sử dụng để chỉ sở hữu, bao gồm: my, your, his, her, its, our, their. 
 Để tạo thành possessive adjectives, chúng ta thêm ''s vào danh từ chỉ người hoặc vật sở hữu. 
 # Cách dùng 
 Possessive adjectives được sử dụng trước danh từ để chỉ sở hữu. 
 Ví dụ: This is my book. 
 # Ví dụ minh họa 
 - My: Đây là sách của tôi. (This is my book.) 
 - Your: Đây là sách của bạn. (This is your book.) 
 - His: Đây là sách của anh ấy. (This is his book.) 
 - Her: Đây là sách của cô ấy. (This is her book.) 
 - Its: Đây là thức ăn của con mèo. (This is its food.) 
 - Our: Đây là nhà của chúng tôi. (This is our house.) 
 - Their: Đây là xe của họ. (This is their car.) 
 # Mẹo học 
 Để nhớ possessive adjectives, hãy học theo nhóm: 
 - My, your, his, her, its (đối với một người hoặc vật) 
 - Our, their (đối với nhiều người hoặc vật) 
 # Các lỗi thường gặp 
 - Sử dụng sai possessive adjectives: Ví dụ, sử dụng ''his'' thay cho ''her''. 
 - Quên thêm ''s vào danh từ sở hữu. 
 # Tóm tắt 
 Possessive adjectives được sử dụng để chỉ sở hữu và được đặt trước danh từ. Hãy học và nhớ các possessive adjectives để sử dụng chúng một cách chính xác.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Possessive Adjectives & Suffixes' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A1', 'What is the possessive adjective for ''I''?', 'My', 'Your', 'His', 'Her', 'A', 'A', 'Possessive adjective ''my'' được sử dụng để chỉ sở hữu của người nói, tức là ''I''. Ví dụ: This is my book.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Possessive Adjectives & Suffixes' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A1', 'Which possessive adjective is used for ''he''?', 'My', 'Your', 'His', 'Her', 'C', 'C', 'Possessive adjective ''his'' được sử dụng để chỉ sở hữu của người đàn ông, tức là ''he''. Ví dụ: This is his book.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Possessive Adjectives & Suffixes' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A1', 'What is the possessive adjective for ''they''?', 'My', 'Your', 'Our', 'Their', 'D', 'D', 'Possessive adjective ''their'' được sử dụng để chỉ sở hữu của nhiều người, tức là ''they''. Ví dụ: This is their book.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Possessive Adjectives & Suffixes' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A1', 'Which possessive adjective is used for ''it''?', 'My', 'Your', 'His', 'Its', 'D', 'D', 'Possessive adjective ''its'' được sử dụng để chỉ sở hữu của con vật hoặc sự vật, tức là ''it''. Ví dụ: The cat chases its tail.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Possessive Adjectives & Suffixes' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A1', 'What is the possessive adjective for ''we''?', 'My', 'Your', 'Our', 'Their', 'C', 'C', 'Possessive adjective ''our'' được sử dụng để chỉ sở hữu của nhiều người, tức là ''we''. Ví dụ: This is our book.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Possessive Adjectives & Suffixes' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A1', 'Which possessive adjective is used for ''she''?', 'My', 'Your', 'His', 'Her', 'D', 'D', 'Possessive adjective ''her'' được sử dụng để chỉ sở hữu của người phụ nữ, tức là ''she''. Ví dụ: This is her book.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Possessive Adjectives & Suffixes' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A1', 'What is the possessive adjective for ''you'' (singular)?', 'My', 'Your', 'His', 'Her', 'B', 'B', 'Possessive adjective ''your'' được sử dụng để chỉ sở hữu của người được nói với, tức là ''you''. Ví dụ: This is your book.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Possessive Adjectives & Suffixes' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A1', 'Which possessive adjective is used for a cat?', 'My', 'Your', 'His', 'Its', 'D', 'D', 'Possessive adjective ''its'' được sử dụng để chỉ sở hữu của con vật, tức là ''cat''. Ví dụ: The cat chases its tail.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Possessive Adjectives & Suffixes' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A1', 'What is the possessive adjective for a group of friends?', 'My', 'Your', 'Our', 'Their', 'D', 'D', 'Possessive adjective ''their'' được sử dụng để chỉ sở hữu của nhiều người, tức là ''a group of friends''. Ví dụ: This is their book.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Possessive Adjectives & Suffixes' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A1', 'Which possessive adjective is used for a family?', 'My', 'Your', 'Our', 'Their', 'C', 'C', 'Possessive adjective ''our'' được sử dụng để chỉ sở hữu của gia đình, tức là ''a family''. Ví dụ: This is our house.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Adjectives & Word Order', 'A1', '# Cấu trúc/Công thức 
 Adjectives thường được đặt trước noun trong câu. Công thức chung: `Adjective + Noun`. 
 # Cách dùng 
 Adjectives dùng để mô tả tính chất, đặc điểm của sự vật, sự việc. 
 # Ví dụ minh họa 
 - The big house. 
 - She is a happy person. 
 # Mẹo học 
 Hãy học các nhóm từ vựng theo chủ đề, bao gồm cả adjectives. 
 # Các lỗi thường gặp 
 Đặt adjectives sau noun, hoặc sử dụng sai dạng so sánh. 
 # Tóm tắt 
 Adjectives là từ mô tả, đặt trước noun, giúp câu văn thêm丰富 và sinh động.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adjectives & Word Order' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A1', 'Where are adjectives usually placed in a sentence?', 'After the noun', 'Before the noun', 'At the end of the sentence', 'At the beginning of the sentence', 'B', 'B', 'Adjectives thường được đặt trước noun trong câu để mô tả tính chất, đặc điểm của sự vật, sự việc.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adjectives & Word Order' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A1', 'What is the function of adjectives in a sentence?', 'To show action', 'To describe a person, place, or thing', 'To indicate time', 'To show location', 'B', 'B', 'Adjectives dùng để mô tả tính chất, đặc điểm của sự vật, sự việc, giúp câu văn thêm丰富 và sinh động.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adjectives & Word Order' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A1', 'Which of the following is an example of a correctly placed adjective?', 'House big the', 'The big house', 'Big the house', 'House the big', 'B', 'B', 'Adjectives thường được đặt trước noun, vì vậy ''The big house'' là ví dụ đúng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adjectives & Word Order' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A1', 'What is a common mistake when using adjectives?', 'Placing them before the noun', 'Using them to describe verbs', 'Placing them after the noun', 'Not using them at all', 'C', 'C', 'Một lỗi thường gặp khi sử dụng adjectives là đặt chúng sau noun, thay vì trước noun.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adjectives & Word Order' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A1', 'How can you improve your use of adjectives?', 'By learning new nouns', 'By learning new verbs', 'By learning new adjectives and practicing their placement', 'By not using adjectives at all', 'C', 'C', 'Học các nhóm từ vựng theo chủ đề, bao gồm cả adjectives, và luyện tập đặt chúng đúng vị trí sẽ giúp cải thiện việc sử dụng adjectives.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adjectives & Word Order' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A1', 'What is the correct order of words in the sentence ''The house is big'' in terms of adjective placement?', 'Adjective, Article, Noun', 'Article, Adjective, Noun', 'Noun, Article, Adjective', 'Article, Noun, Adjective', 'B', 'B', 'Trong câu ''The big house'', từ ''big'' là adjective, ''The'' là article, và ''house'' là noun. Vậy công thức đúng là Article, Adjective, Noun.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adjectives & Word Order' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A1', 'Which sentence is grammatically correct?', 'The house big is mine', 'The big house is mine', 'Big house the is mine', 'House the big is mine', 'B', 'B', 'Câu ''The big house is mine'' là câu đúng về mặt ngữ pháp, với adjective ''big'' được đặt trước noun ''house''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adjectives & Word Order' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A1', 'What is the purpose of learning adjectives in groups by theme?', 'To learn new nouns', 'To learn new verbs', 'To improve vocabulary and understand how adjectives are used in context', 'To ignore adjectives', 'C', 'C', 'Học adjectives theo nhóm từ vựng theo chủ đề giúp cải thiện vốn từ vựng và hiểu rõ cách sử dụng adjectives trong ngữ cảnh cụ thể.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adjectives & Word Order' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A1', 'Which of the following adjectives is used to describe a person?', 'Happy', 'Big', 'Old', 'All of the above', 'D', 'D', 'Tất cả các adjectives ''Happy'', ''Big'', ''Old'' đều có thể được sử dụng để mô tả một người.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adjectives & Word Order' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A1', 'Why is it important to learn the correct placement of adjectives?', 'So that you can speak faster', 'So that you can write more', 'So that you can communicate more clearly and effectively', 'So that you can ignore grammar rules', 'C', 'C', 'Học cách đặt adjectives đúng vị trí giúp bạn giao tiếp rõ ràng và hiệu quả hơn, vì nó làm cho câu văn của bạn có ý nghĩa và dễ hiểu hơn.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Can / Cannot', 'A1', '# Cấu trúc/Công thức 
- Để biểu thị khả năng của chủ ngữ, chúng ta sử dụng cấu trúc: **Subject + can + Verb** 
- Để biểu thị sự không thể, chúng ta sử dụng cấu trúc: **Subject + cannot + Verb** 
 # Cách dùng 
- **Can** được sử dụng để nói về khả năng của chủ ngữ trong hiện tại. 
- **Cannot** (không thể) được sử dụng để nói về việc chủ ngữ không có khả năng thực hiện hành động. 
 # Ví dụ minh họa 
- Tôi **có thể** nói tiếng Anh. (I **can** speak English.) 
- Cô ấy **không thể** đi bộ quá nhanh. (She **cannot** walk too fast.) 
 # Mẹo học 
- Hãy nhớ rằng **can** và **cannot** luôn đi cùng với động từ chính. 
- Sử dụng **can** khi bạn muốn nói về khả năng của mình hoặc của người khác. 
 # Các lỗi thường gặp 
- Sử dụng **can** và **cannot** không đúng ngữ cảnh. 
- Quên thêm **not** sau **can** khi muốn biểu thị sự không thể. 
 # Tóm tắt 
- **Can** và **cannot** là những từ quan trọng trong tiếng Anh để biểu thị khả năng và sự không thể.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Can / Cannot' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A1', 'What does ''can'' mean in English?', 'Ability to do something', 'Not able to do something', 'Want to do something', 'Need to do something', 'A', 'A', 'Từ ''can'' trong tiếng Anh được sử dụng để biểu thị khả năng của chủ ngữ trong việc thực hiện một hành động nào đó.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Can / Cannot' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A1', 'Which sentence is correct?', 'I can to speak English.', 'I can speak English.', 'I can speaking English.', 'I can speaks English.', 'B', 'B', 'Câu đúng ngữ pháp là ''I can speak English'' vì ''can'' luôn đi cùng với động từ chính trong câu.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Can / Cannot' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A1', 'What is the opposite of ''can''?', 'Cannot', 'Can', 'May', 'Must', 'A', 'A', 'Đối lập với ''can'' là ''cannot'', dùng để biểu thị sự không thể thực hiện một hành động.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Can / Cannot' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A1', 'Which of the following sentences is correct?', 'She can to run very fast.', 'She can runs very fast.', 'She can running very fast.', 'She can run very fast.', 'D', 'D', 'Câu đúng ngữ pháp là ''She can run very fast'' vì ''can'' đi cùng với động từ chính ''run''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Can / Cannot' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A1', 'What does ''cannot'' mean?', 'Able to do something', 'Not able to do something', 'Want to do something', 'Need to do something', 'B', 'B', 'Từ ''cannot'' được sử dụng để biểu thị sự không thể của chủ ngữ trong việc thực hiện một hành động nào đó.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Can / Cannot' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A1', 'Choose the correct sentence.', 'He cannot to play football.', 'He cannot play football.', 'He cannot playing football.', 'He cannot plays football.', 'B', 'B', 'Câu đúng ngữ pháp là ''He cannot play football'' vì ''cannot'' đi cùng với động từ chính ''play''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Can / Cannot' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A1', 'Which sentence is grammatically correct?', 'I can speaking English fluently.', 'I can to speak English fluently.', 'I can speak English fluently.', 'I can speaks English fluently.', 'C', 'C', 'Câu đúng ngữ pháp là ''I can speak English fluently'' vì ''can'' luôn đi cùng với động từ chính trong câu.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Can / Cannot' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A1', 'What is the function of ''can'' in a sentence?', 'To show ability', 'To show inability', 'To show necessity', 'To show permission', 'A', 'A', 'Chức năng của ''can'' trong câu là để biểu thị khả năng của chủ ngữ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Can / Cannot' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A1', 'Choose the correct form of ''can'' to complete the sentence: ''She _______ play the piano.''', 'can to', 'can', 'cans', 'caning', 'B', 'B', 'Đáp án đúng là ''can'' vì ''can'' luôn đi cùng với động từ chính trong câu.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Can / Cannot' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A1', 'Which of the following is a correct usage of ''cannot''?', 'I cannot to go to the party.', 'I cannot go to the party.', 'I cannot going to the party.', 'I cannot goes to the party.', 'B', 'B', 'Câu đúng ngữ pháp là ''I cannot go to the party'' vì ''cannot'' đi cùng với động từ chính ''go''.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Imperatives & Prepositions of Place', 'A1', '# Imperatives & Prepositions of Place
## Cấu trúc/Công thức
Để tạo ra câu lệnh (imperative), chúng ta thường sử dụng động từ ở dạng cơ bản, không có chủ ngữ và thường được sử dụng để ra lệnh hoặc yêu cầu ai đó làm điều gì đó.

Ví dụ: *Open the door!* (Mở cửa!).

Các giới từ chỉ nơi chốn (prepositions of place) như *in*, *on*, *at*, *by*, *under*, *above* được sử dụng để chỉ vị trí của sự vật hoặc người.

Ví dụ: *The book is on the table.* (Quyển sách ở trên bàn).
## Cách dùng
Câu lệnh được sử dụng để yêu cầu hoặc lệnh cho ai đó thực hiện một hành động nào đó.

Ví dụ: *Close the window!* (Đóng cửa sổ!).

Các giới từ chỉ nơi chốn được sử dụng để mô tả vị trí của sự vật hoặc người trong không gian.

Ví dụ: *She is standing by the door.* (Cô ấy đang đứng gần cửa).
## Ví dụ minh họa
- *Put the book on the table!* (Đặt quyển sách lên bàn!)
- *The map is under the bed.* (Bản đồ ở dưới giường)
- *They are sitting at the back of the classroom.* (Họ đang ngồi ở cuối lớp học)
## Mẹo học
Học các giới từ chỉ nơi chốn và cách sử dụng chúng trong câu.

Luyện tập tạo câu lệnh với các động từ khác nhau.
## Các lỗi thường gặp
Sử dụng sai giới từ chỉ nơi chốn.

Ví dụ: *The book is in the table* (thay vì *on the table*).
## Tóm tắt
Imperatives và prepositions of place là những phần quan trọng trong tiếng Anh, giúp chúng ta thể hiện yêu cầu, lệnh và mô tả vị trí của sự vật hoặc người.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Imperatives & Prepositions of Place' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A1', 'What is the function of the imperative in English?', 'To ask questions', 'To make statements', 'To give orders or requests', 'To describe feelings', 'C', 'C', 'Câu lệnh (imperative) được sử dụng để ra lệnh hoặc yêu cầu ai đó làm điều gì đó.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Imperatives & Prepositions of Place' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A1', 'Which preposition of place indicates something is located on a surface?', 'in', 'on', 'at', 'by', 'B', 'B', 'Giới từ *on* chỉ rằng một vật ở trên bề mặt của một vật khác.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Imperatives & Prepositions of Place' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A1', 'Complete the sentence: ''Put the book _______ the table.''', 'in', 'on', 'at', 'by', 'B', 'B', 'Đặt quyển sách *trên* bàn, vì vậy giới từ đúng là *on*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Imperatives & Prepositions of Place' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A1', 'What does the preposition ''under'' indicate?', 'Something is above another thing', 'Something is below another thing', 'Something is next to another thing', 'Something is inside another thing', 'B', 'B', 'Giới từ *under* chỉ rằng một vật ở dưới một vật khác.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Imperatives & Prepositions of Place' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A1', 'Choose the correct sentence: ''The map is _______ the bed.''', 'in', 'on', 'at', 'under', 'D', 'D', 'Bản đồ ở *dưới* giường, vì vậy giới từ đúng là *under*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Imperatives & Prepositions of Place' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A1', 'Which of the following is an example of an imperative sentence?', 'I am going to the store.', 'You should go to the store.', 'Go to the store!', 'The store is open.', 'C', 'C', 'Câu lệnh (imperative) là câu yêu cầu hoặc lệnh cho ai đó làm điều gì đó, ví dụ: *Go to the store!*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Imperatives & Prepositions of Place' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A1', 'What is the meaning of the preposition ''by'' in the sentence ''She is standing by the door.''?', 'She is standing inside the door', 'She is standing near the door', 'She is standing on the door', 'She is standing under the door', 'B', 'B', 'Giới từ *by* trong câu này chỉ rằng cô ấy đang đứng *gần* cửa.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Imperatives & Prepositions of Place' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A1', 'Complete the sentence: ''The students are sitting _______ the classroom.''', 'in', 'on', 'at', 'at the back of the', 'D', 'D', 'Học sinh đang ngồi ở *cuối* lớp học, vì vậy câu đúng là *at the back of the classroom*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Imperatives & Prepositions of Place' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A1', 'What is the function of the preposition ''at'' in the sentence ''They are meeting at the park.''?', 'To indicate the meeting is inside the park', 'To indicate the meeting is near the park', 'To indicate the meeting is at a specific location, the park', 'To indicate the meeting is on the park', 'C', 'C', 'Giới từ *at* trong câu này chỉ rằng cuộc họp diễn ra tại một vị trí cụ thể, đó là công viên.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Imperatives & Prepositions of Place' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A1', 'Choose the correct preposition to complete the sentence: ''The picture is _______ the wall.''', 'in', 'on', 'at', 'by', 'B', 'B', 'Hình ảnh ở *trên* tường, vì vậy giới từ đúng là *on*.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Wh- Questions', 'A1', '# Câu hỏi Wh- 
## Cấu trúc/Công thức 
Câu hỏi Wh- được sử dụng để hỏi về thông tin chi tiết. Công thức chung của câu hỏi Wh- là: Wh- + động từ giúp đỡ (auxiliary verb) + chủ ngữ + động từ chính. 
## Cách dùng 
Câu hỏi Wh- được sử dụng để hỏi về người, nơi, thời gian, lý do, cách thức,... 
## Ví dụ minh họa 
* What là gì? (Cái gì) 
* Where ở đâu? (Ở đâu) 
* When nào? (Khi nào) 
* Why tại sao? (Tại sao) 
* How thế nào? (Thế nào) 
## Mẹo học 
Học từ vựng Wh- và sử dụng chúng trong câu hỏi. 
## Các lỗi thường gặp 
Sử dụng sai từ Wh- hoặc động từ giúp đỡ. 
## Tóm tắt 
Câu hỏi Wh- là một phần quan trọng của tiếng Anh, giúp bạn hỏi về thông tin chi tiết.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wh- Questions' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A1', 'What is your name?', 'My name is', 'I am', 'My name', 'Name is', 'A', 'A', 'Câu hỏi What là gì? được sử dụng để hỏi về tên của người khác.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wh- Questions' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A1', 'Where are you from?', 'I am from', 'From', 'I from', 'Am from', 'A', 'A', 'Câu hỏi Where ở đâu? được sử dụng để hỏi về nơi xuất xứ của người khác.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wh- Questions' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A1', 'When is your birthday?', 'My birthday is', 'I am', 'Birthday is', 'Is birthday', 'A', 'A', 'Câu hỏi When nào? được sử dụng để hỏi về thời gian của một sự kiện.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wh- Questions' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A1', 'Why are you here?', 'I am here', 'Here I am', 'I here', 'Am here', 'A', 'A', 'Câu hỏi Why tại sao? được sử dụng để hỏi về lý do của một hành động.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wh- Questions' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A1', 'How are you?', 'I am fine', 'Fine I am', 'I fine', 'Am fine', 'A', 'A', 'Câu hỏi How thế nào? được sử dụng để hỏi về tình trạng của người khác.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wh- Questions' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A1', 'What do you like to eat?', 'I like to eat', 'Like to eat', 'I to eat', 'To eat', 'A', 'A', 'Câu hỏi What là gì? được sử dụng để hỏi về sở thích của người khác.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wh- Questions' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A1', 'Where do you live?', 'I live in', 'Live in', 'I in', 'In', 'A', 'A', 'Câu hỏi Where ở đâu? được sử dụng để hỏi về nơi ở của người khác.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wh- Questions' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A1', 'When will you finish your work?', 'I will finish', 'Will finish', 'I finish', 'Finish', 'A', 'A', 'Câu hỏi When nào? được sử dụng để hỏi về thời gian hoàn thành một công việc.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wh- Questions' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A1', 'Why do you like that book?', 'I like that book', 'Like that book', 'I that book', 'That book', 'A', 'A', 'Câu hỏi Why tại sao? được sử dụng để hỏi về lý do của một hành động.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wh- Questions' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A1', 'How do you get to school?', 'I get to school', 'Get to school', 'I to school', 'To school', 'A', 'A', 'Câu hỏi How thế nào? được sử dụng để hỏi về cách thức thực hiện một hành động.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Bài Dạy Hiện Tại Tiếp Diễn', 'A2', '### Cấu trúc/Công thức
   Hiện tại tiếp diễn được sử dụng để mô tả một hành động đang diễn ra trong thời điểm hiện tại.

   - S + am/is/are + V-ing

   ### Cách dùng
   Hiện tại tiếp diễn thường được sử dụng để mô tả các hành động đang diễn ra trong thời điểm hiện tại, bao gồm cả các hành động lặp đi lặp lại.

   ### Ví dụ minh họa
   - I am studying English. (Tôi đang học tiếng Anh.)
   - She is watching TV. (Cô ấy đang xem TV.)

   ### Mẹo học
   - Sử dụng hiện tại tiếp diễn để mô tả các hành động đang diễn ra trong thời điểm hiện tại.
   - Sử dụng các động từ phù hợp để mô tả các hành động đang diễn ra.

   ### Các lỗi thường gặp
   - Sử dụng hiện tại hoàn thành thay vì hiện tại tiếp diễn.
   - Sử dụng các động từ không phù hợp để mô tả các hành động đang diễn ra.

   ### Tóm tắt
   Hiện tại tiếp diễn được sử dụng để mô tả các hành động đang diễn ra trong thời điểm hiện tại. Sử dụng cấu trúc S + am/is/are + V-ing và các động từ phù hợp để mô tả các hành động đang diễn ra.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Bài Dạy Hiện Tại Tiếp Diễn' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A2', 'Cấu trúc của hiện tại tiếp diễn là gì?', 'S + was/were + V-ing', 'S + am/is/are + V-ing', 'S + will + V-ing', 'S + would + V-ing', 'B', 'B', 'Cấu trúc của hiện tại tiếp diễn là S + am/is/are + V-ing.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Bài Dạy Hiện Tại Tiếp Diễn' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A2', 'Hành động nào được mô tả bằng hiện tại tiếp diễn?', 'Hành động đã xảy ra', 'Hành động đang diễn ra', 'Hành động sẽ xảy ra', 'Hành động đã kết thúc', 'B', 'B', 'Hành động đang diễn ra được mô tả bằng hiện tại tiếp diễn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Bài Dạy Hiện Tại Tiếp Diễn' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A2', 'Ví dụ về hiện tại tiếp diễn là gì?', 'I am studying English.', 'I studied English.', 'I will study English.', 'I studied English yesterday.', 'A', 'A', 'Ví dụ về hiện tại tiếp diễn là ''I am studying English.''');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Bài Dạy Hiện Tại Tiếp Diễn' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A2', 'Sử dụng hiện tại tiếp diễn để mô tả hành động nào?', 'Hành động đã xảy ra', 'Hành động đang diễn ra', 'Hành động sẽ xảy ra', 'Hành động đã kết thúc', 'B', 'B', 'Sử dụng hiện tại tiếp diễn để mô tả hành động đang diễn ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Bài Dạy Hiện Tại Tiếp Diễn' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A2', 'Câu nào sau đây sử dụng hiện tại tiếp diễn?', 'I studied English yesterday.', 'I am studying English.', 'I will study English.', 'I studied English.', 'B', 'B', 'Câu ''I am studying English.'' sử dụng hiện tại tiếp diễn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Bài Dạy Hiện Tại Tiếp Diễn' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A2', 'Sử dụng hiện tại tiếp diễn để mô tả hành động lặp đi lặp lại là gì?', 'S + was/were + V-ing', 'S + am/is/are + V-ing', 'S + will + V-ing', 'S + would + V-ing', 'B', 'B', 'Sử dụng hiện tại tiếp diễn để mô tả hành động lặp đi lặp lại là S + am/is/are + V-ing.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Bài Dạy Hiện Tại Tiếp Diễn' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A2', 'Câu nào sau đây sử dụng hiện tại tiếp diễn để mô tả hành động lặp đi lặp lại?', 'I studied English yesterday.', 'I am studying English.', 'I will study English.', 'I studied English.', 'B', 'B', 'Câu ''I am studying English.'' sử dụng hiện tại tiếp diễn để mô tả hành động lặp đi lặp lại.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Bài Dạy Hiện Tại Tiếp Diễn' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A2', 'Hành động nào không được mô tả bằng hiện tại tiếp diễn?', 'Hành động đang diễn ra', 'Hành động đã xảy ra', 'Hành động sẽ xảy ra', 'Hành động đã kết thúc', 'B', 'B', 'Hành động đã xảy ra không được mô tả bằng hiện tại tiếp diễn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Bài Dạy Hiện Tại Tiếp Diễn' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A2', 'Sử dụng hiện tại tiếp diễn để mô tả hành động nào không đúng?', 'Hành động đang diễn ra', 'Hành động đã xảy ra', 'Hành động sẽ xảy ra', 'Hành động đã kết thúc', 'B', 'B', 'Sử dụng hiện tại tiếp diễn để mô tả hành động đã xảy ra không đúng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Bài Dạy Hiện Tại Tiếp Diễn' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A2', 'Câu nào sau đây sử dụng hiện tại tiếp diễn không đúng?', 'I am studying English.', 'I studied English.', 'I will study English.', 'I studied English yesterday.', 'B', 'B', 'Câu ''I studied English.'' sử dụng hiện tại hoàn thành không đúng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Bài Dạy Hiện Tại Tiếp Diễn' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'A2', 'Sử dụng hiện tại tiếp diễn để mô tả hành động lặp đi lặp lại không đúng là gì?', 'S + was/were + V-ing', 'S + am/is/are + V-ing', 'S + will + V-ing', 'S + would + V-ing', 'A', 'A', 'Sử dụng hiện tại tiếp diễn để mô tả hành động lặp đi lặp lại không đúng là S + was/were + V-ing.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Past Simple (Regular & Irregular)', 'A2', '### Past Simple (Regular & Irregular)
#### Cấu trúc/Công thức (Formula)
Past Simple được sử dụng để mô tả hành động đã xảy ra trong quá khứ, thường được sử dụng với các động từ không có tính cách.

#### Cách dùng (Usage)
- Sử dụng để mô tả hành động đã xảy ra trong quá khứ.
- Không sử dụng để mô tả hành động đang diễn ra hoặc sẽ diễn ra trong tương lai.

#### Ví dụ minh họa (Examples)
- Tôi đi học (I went to school)
- Cô ấy đọc sách (She read a book)

#### Mẹo học (Tips)
- Hãy nhớ rằng Past Simple thường được sử dụng với các động từ không có tính cách.
- Hãy sử dụng các từ ngữ phù hợp để mô tả hành động đã xảy ra trong quá khứ.

#### Các lỗi thường gặp (Common Mistakes)
- Sử dụng Past Simple để mô tả hành động đang diễn ra hoặc sẽ diễn ra trong tương lai.
- Quên sử dụng các từ ngữ phù hợp để mô tả hành động đã xảy ra trong quá khứ.

#### Tóm tắt (Summary)
Past Simple là một trong những dạng động từ quan trọng trong tiếng Anh, được sử dụng để mô tả hành động đã xảy ra trong quá khứ. Hãy nhớ sử dụng các động từ không có tính cách và các từ ngữ phù hợp để mô tả hành động đã xảy ra trong quá khứ.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Simple (Regular & Irregular)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng Past Simple đúng cách?', 'Tôi đang đi học', 'Tôi đi học', 'Tôi sẽ đi học', 'Tôi đã đi học', 'B', 'B', 'Câu "Tôi đi học" sử dụng Past Simple đúng cách để mô tả hành động đã xảy ra trong quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Simple (Regular & Irregular)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng Past Simple sai cách?', 'Tôi đi học', 'Tôi đang đi học', 'Tôi sẽ đi học', 'Tôi đã đi học', 'B', 'B', 'Câu "Tôi đang đi học" sử dụng Past Simple sai cách để mô tả hành động đang diễn ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Simple (Regular & Irregular)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng động từ có tính cách?', 'Cô ấy là một giáo viên', 'Cô ấy đi học', 'Cô ấy sẽ đi học', 'Cô ấy đã đi học', 'A', 'A', 'Câu "Cô ấy là một giáo viên" sử dụng động từ có tính cách "là".');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Simple (Regular & Irregular)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng Past Simple đúng cách?', 'Tôi sẽ đi học', 'Tôi đi học', 'Tôi đang đi học', 'Tôi đã đi học', 'B', 'B', 'Câu "Tôi đi học" sử dụng Past Simple đúng cách để mô tả hành động đã xảy ra trong quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Simple (Regular & Irregular)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng Past Simple sai cách?', 'Tôi đi học', 'Tôi đã đi học', 'Tôi sẽ đi học', 'Tôi đang đi học', 'C', 'C', 'Câu "Tôi sẽ đi học" sử dụng Past Simple sai cách để mô tả hành động sẽ diễn ra trong tương lai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Simple (Regular & Irregular)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng động từ không có tính cách?', 'Cô ấy là một giáo viên', 'Cô ấy đi học', 'Cô ấy sẽ đi học', 'Cô ấy đã đi học', 'B', 'B', 'Câu "Cô ấy đi học" sử dụng động từ không có tính cách "đi".');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Simple (Regular & Irregular)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng Past Simple đúng cách?', 'Tôi đang đi học', 'Tôi đi học', 'Tôi sẽ đi học', 'Tôi đã đi học', 'B', 'B', 'Câu "Tôi đi học" sử dụng Past Simple đúng cách để mô tả hành động đã xảy ra trong quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Simple (Regular & Irregular)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng Past Simple sai cách?', 'Tôi đi học', 'Tôi đã đi học', 'Tôi sẽ đi học', 'Tôi đang đi học', 'D', 'D', 'Câu "Tôi đang đi học" sử dụng Past Simple sai cách để mô tả hành động đang diễn ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Simple (Regular & Irregular)' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng động từ có tính cách?', 'Cô ấy là một giáo viên', 'Cô ấy đi học', 'Cô ấy sẽ đi học', 'Cô ấy đã đi học', 'A', 'A', 'Câu "Cô ấy là một giáo viên" sử dụng động từ có tính cách "là".');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Simple (Regular & Irregular)' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng Past Simple đúng cách?', 'Tôi sẽ đi học', 'Tôi đi học', 'Tôi đang đi học', 'Tôi đã đi học', 'B', 'B', 'Câu "Tôi đi học" sử dụng Past Simple đúng cách để mô tả hành động đã xảy ra trong quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Simple (Regular & Irregular)' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng Past Simple sai cách?', 'Tôi đi học', 'Tôi đã đi học', 'Tôi sẽ đi học', 'Tôi đang đi học', 'C', 'C', 'Câu "Tôi sẽ đi học" sử dụng Past Simple sai cách để mô tả hành động sẽ diễn ra trong tương lai.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Future Simple (Will / Be going to)', 'A2', '### Future Simple (Will / Be going to)
#### Cấu trúc/Công thức (Formula)
Future Simple thường được sử dụng để mô tả các hành động sẽ xảy ra trong tương lai. Có hai cách sử dụng phổ biến: *will* và *be going to*.

*   *Will*: được sử dụng để mô tả các hành động sẽ xảy ra trong tương lai, bao gồm cả những hành động có thể xảy ra hoặc không xảy ra.
*   *Be going to*: được sử dụng để mô tả các hành động sẽ xảy ra trong tương lai, đặc biệt là những hành động đã được lên kế hoạch hoặc dự định.

#### Cách dùng (Usage)
*   *Will*: được sử dụng để mô tả các hành động sẽ xảy ra trong tương lai, bao gồm cả những hành động có thể xảy ra hoặc không xảy ra.
*   *Be going to*: được sử dụng để mô tả các hành động sẽ xảy ra trong tương lai, đặc biệt là những hành động đã được lên kế hoạch hoặc dự định.

#### Ví dụ minh họa (Examples)
*   *Will*:
    *   Tôi sẽ đi học vào sáng mai.
    *   Anh ấy sẽ trở thành một kỹ sư trong tương lai.
*   *Be going to*:
    *   Tôi sẽ đi du lịch vào tháng tới.
    *   Họ sẽ tổ chức một sự kiện vào cuối tuần này.

#### Mẹo học (Tips)
*   Hãy sử dụng *will* để mô tả các hành động sẽ xảy ra trong tương lai, bao gồm cả những hành động có thể xảy ra hoặc không xảy ra.
*   Hãy sử dụng *be going to* để mô tả các hành động sẽ xảy ra trong tương lai, đặc biệt là những hành động đã được lên kế hoạch hoặc dự định.

#### Các lỗi thường gặp (Common Mistakes)
*   Không sử dụng *will* hoặc *be going to* đúng cách.
*   Sử dụng *will* hoặc *be going to* để mô tả các hành động đã xảy ra trong quá khứ.

#### Tóm tắt (Summary)
Future Simple (Will / Be going to) là một trong những cấu trúc quan trọng trong tiếng Anh. Nó được sử dụng để mô tả các hành động sẽ xảy ra trong tương lai. Hãy sử dụng *will* để mô tả các hành động có thể xảy ra hoặc không xảy ra, và *be going to* để mô tả các hành động đã được lên kế hoạch hoặc dự định.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Simple (Will / Be going to)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A2', 'Cấu trúc của Future Simple (Will / Be going to) là gì?', 'S + sẽ + V', 'S + sẽ + được + V', 'S + sẽ + V + được', 'S + sẽ + được + V', 'A', 'A', 'Cấu trúc của Future Simple (Will / Be going to) là S + sẽ + V.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Simple (Will / Be going to)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A2', 'Khi nào nên sử dụng *will*?', 'Khi mô tả các hành động đã xảy ra trong quá khứ', 'Khi mô tả các hành động sẽ xảy ra trong tương lai', 'Khi mô tả các hành động có thể xảy ra hoặc không xảy ra', 'Khi mô tả các hành động đã được lên kế hoạch hoặc dự định', 'C', 'C', 'Khi mô tả các hành động có thể xảy ra hoặc không xảy ra, nên sử dụng *will*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Simple (Will / Be going to)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A2', 'Khi nào nên sử dụng *be going to*?', 'Khi mô tả các hành động đã xảy ra trong quá khứ', 'Khi mô tả các hành động sẽ xảy ra trong tương lai', 'Khi mô tả các hành động có thể xảy ra hoặc không xảy ra', 'Khi mô tả các hành động đã được lên kế hoạch hoặc dự định', 'D', 'D', 'Khi mô tả các hành động đã được lên kế hoạch hoặc dự định, nên sử dụng *be going to*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Simple (Will / Be going to)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A2', 'Câu sau là đúng hay sai?', 'Tôi sẽ đi học vào sáng mai.', 'Tôi đã đi học vào sáng mai.', 'Tôi sẽ đi học vào tối nay.', 'Tôi sẽ đi học vào tối mai.', 'A', 'A', 'Câu "Tôi sẽ đi học vào sáng mai." là đúng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Simple (Will / Be going to)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A2', 'Câu sau là đúng hay sai?', 'Tôi sẽ đi du lịch vào tháng tới.', 'Tôi đã đi du lịch vào tháng trước.', 'Tôi sẽ đi du lịch vào tháng này.', 'Tôi sẽ đi du lịch vào tháng sau.', 'A', 'A', 'Câu "Tôi sẽ đi du lịch vào tháng tới." là đúng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Simple (Will / Be going to)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A2', 'Cấu trúc của Future Simple (Will / Be going to) bao gồm các phần nào?', 'S + sẽ + V', 'S + sẽ + được + V', 'S + sẽ + V + được', 'S + sẽ + được + V', 'A', 'A', 'Cấu trúc của Future Simple (Will / Be going to) bao gồm S + sẽ + V.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Simple (Will / Be going to)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A2', 'Khi nào nên sử dụng *will* để mô tả các hành động?', 'Khi mô tả các hành động đã xảy ra trong quá khứ', 'Khi mô tả các hành động sẽ xảy ra trong tương lai', 'Khi mô tả các hành động có thể xảy ra hoặc không xảy ra', 'Khi mô tả các hành động đã được lên kế hoạch hoặc dự định', 'C', 'C', 'Khi mô tả các hành động có thể xảy ra hoặc không xảy ra, nên sử dụng *will*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Simple (Will / Be going to)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A2', 'Khi nào nên sử dụng *be going to* để mô tả các hành động?', 'Khi mô tả các hành động đã xảy ra trong quá khứ', 'Khi mô tả các hành động sẽ xảy ra trong tương lai', 'Khi mô tả các hành động có thể xảy ra hoặc không xảy ra', 'Khi mô tả các hành động đã được lên kế hoạch hoặc dự định', 'D', 'D', 'Khi mô tả các hành động đã được lên kế hoạch hoặc dự định, nên sử dụng *be going to*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Simple (Will / Be going to)' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A2', 'Câu sau là đúng hay sai?', 'Tôi sẽ đi học vào sáng mai.', 'Tôi đã đi học vào sáng mai.', 'Tôi sẽ đi học vào tối nay.', 'Tôi sẽ đi học vào tối mai.', 'A', 'A', 'Câu "Tôi sẽ đi học vào sáng mai." là đúng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Simple (Will / Be going to)' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A2', 'Câu sau là đúng hay sai?', 'Tôi sẽ đi du lịch vào tháng tới.', 'Tôi đã đi du lịch vào tháng trước.', 'Tôi sẽ đi du lịch vào tháng này.', 'Tôi sẽ đi du lịch vào tháng sau.', 'A', 'A', 'Câu "Tôi sẽ đi du lịch vào tháng tới." là đúng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Simple (Will / Be going to)' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'A2', 'Cấu trúc của Future Simple (Will / Be going to) bao gồm các phần nào?', 'S + sẽ + V', 'S + sẽ + được + V', 'S + sẽ + V + được', 'S + sẽ + được + V', 'A', 'A', 'Cấu trúc của Future Simple (Will / Be going to) bao gồm S + sẽ + V.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'So sánh bằng so sánh', 'A2', '### So sánh bằng so sánh
#### Cấu trúc/Công thức
- Để so sánh hai từ có cùng gốc bằng so sánh, ta thêm -er vào gốc từ.
- Để so sánh hai từ có cùng gốc bằng so sánh, ta thêm -est vào gốc từ.
- Để so sánh hai từ có cùng gốc bằng so sánh, ta thêm hơn vào gốc từ.

#### Cách dùng
- So sánh bằng so sánh thường được sử dụng để so sánh hai đối tượng có cùng tính chất.
- So sánh bằng so sánh thường được sử dụng để so sánh hai đối tượng có cùng mức độ.

#### Ví dụ minh họa
- Cô gái này cao hơn em gái kia. (Cô gái này cao hơn em gái kia bằng so sánh.)
- Anh chàng này mạnh hơn em trai kia. (Anh chàng này mạnh hơn em trai kia bằng so sánh.)
- Cô bé này xinh đẹp hơn em gái kia. (Cô bé này xinh đẹp hơn em gái kia bằng so sánh.)

#### Mẹo học
- Hãy nhớ thêm -er vào gốc từ để so sánh hai từ có cùng gốc bằng so sánh.
- Hãy nhớ thêm -est vào gốc từ để so sánh hai từ có cùng gốc bằng so sánh.
- Hãy nhớ thêm hơn vào gốc từ để so sánh hai từ có cùng gốc bằng so sánh.

#### Các lỗi thường gặp
- Lỗi thường gặp là sử dụng so sánh bằng so sánh sai cấu trúc.
- Lỗi thường gặp là sử dụng so sánh bằng so sánh sai cách dùng.

#### Tóm tắt
- So sánh bằng so sánh là một trong những cách so sánh thường được sử dụng.
- So sánh bằng so sánh thường được sử dụng để so sánh hai đối tượng có cùng tính chất.
- So sánh bằng so sánh thường được sử dụng để so sánh hai đối tượng có cùng mức độ.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'So sánh bằng so sánh' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng so sánh bằng so sánh?', 'Cô gái này cao hơn em gái kia.', 'Cô gái này cao hơn em gái.', 'Cô gái này cao hơn em gái kia hơn.', 'Cô gái này cao hơn em gái kia cao hơn.', 'A', 'A', 'Câu ''Cô gái này cao hơn em gái kia'' sử dụng so sánh bằng so sánh vì nó so sánh hai từ có cùng gốc ''cao'' bằng cách thêm -er vào gốc từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'So sánh bằng so sánh' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng so sánh bằng so sánh?', 'Anh chàng này mạnh hơn em trai.', 'Anh chàng này mạnh hơn em trai kia.', 'Anh chàng này mạnh hơn em trai kia hơn.', 'Anh chàng này mạnh hơn em trai kia mạnh hơn.', 'B', 'B', 'Câu ''Anh chàng này mạnh hơn em trai kia'' sử dụng so sánh bằng so sánh vì nó so sánh hai từ có cùng gốc ''mạnh'' bằng cách thêm -er vào gốc từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'So sánh bằng so sánh' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng so sánh bằng so sánh?', 'Cô bé này xinh đẹp hơn em gái.', 'Cô bé này xinh đẹp hơn em gái kia.', 'Cô bé này xinh đẹp hơn em gái kia hơn.', 'Cô bé này xinh đẹp hơn em gái kia xinh đẹp hơn.', 'B', 'B', 'Câu ''Cô bé này xinh đẹp hơn em gái kia'' sử dụng so sánh bằng so sánh vì nó so sánh hai từ có cùng gốc ''xinh đẹp'' bằng cách thêm -er vào gốc từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'So sánh bằng so sánh' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng so sánh bằng so sánh sai cấu trúc?', 'Cô gái này cao hơn em gái.', 'Cô gái này cao hơn em gái kia.', 'Cô gái này cao hơn em gái kia hơn.', 'Cô gái này cao hơn em gái kia cao hơn.', 'A', 'A', 'Câu ''Cô gái này cao hơn em gái'' sử dụng so sánh bằng so sánh sai cấu trúc vì nó không thêm -er vào gốc từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'So sánh bằng so sánh' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng so sánh bằng so sánh sai cách dùng?', 'Cô gái này cao hơn em gái kia.', 'Cô gái này cao hơn em gái.', 'Cô gái này cao hơn em gái kia hơn.', 'Cô gái này cao hơn em gái kia cao hơn.', 'B', 'B', 'Câu ''Cô gái này cao hơn em gái'' sử dụng so sánh bằng so sánh sai cách dùng vì nó không so sánh hai đối tượng có cùng tính chất.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'So sánh bằng so sánh' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng so sánh bằng so sánh?', 'Cô bé này xinh đẹp hơn em gái.', 'Cô bé này xinh đẹp hơn em gái kia.', 'Cô bé này xinh đẹp hơn em gái kia hơn.', 'Cô bé này xinh đẹp hơn em gái kia xinh đẹp hơn.', 'B', 'B', 'Câu ''Cô bé này xinh đẹp hơn em gái kia'' sử dụng so sánh bằng so sánh vì nó so sánh hai từ có cùng gốc ''xinh đẹp'' bằng cách thêm -er vào gốc từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'So sánh bằng so sánh' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng so sánh bằng so sánh sai cấu trúc?', 'Cô gái này cao hơn em gái.', 'Cô gái này cao hơn em gái kia.', 'Cô gái này cao hơn em gái kia hơn.', 'Cô gái này cao hơn em gái kia cao hơn.', 'A', 'A', 'Câu ''Cô gái này cao hơn em gái'' sử dụng so sánh bằng so sánh sai cấu trúc vì nó không thêm -er vào gốc từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'So sánh bằng so sánh' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng so sánh bằng so sánh sai cách dùng?', 'Cô gái này cao hơn em gái kia.', 'Cô gái này cao hơn em gái.', 'Cô gái này cao hơn em gái kia hơn.', 'Cô gái này cao hơn em gái kia cao hơn.', 'B', 'B', 'Câu ''Cô gái này cao hơn em gái'' sử dụng so sánh bằng so sánh sai cách dùng vì nó không so sánh hai đối tượng có cùng tính chất.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'So sánh bằng so sánh' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng so sánh bằng so sánh?', 'Anh chàng này mạnh hơn em trai.', 'Anh chàng này mạnh hơn em trai kia.', 'Anh chàng này mạnh hơn em trai kia hơn.', 'Anh chàng này mạnh hơn em trai kia mạnh hơn.', 'B', 'B', 'Câu ''Anh chàng này mạnh hơn em trai kia'' sử dụng so sánh bằng so sánh vì nó so sánh hai từ có cùng gốc ''mạnh'' bằng cách thêm -er vào gốc từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'So sánh bằng so sánh' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng so sánh bằng so sánh sai cấu trúc?', 'Anh chàng này mạnh hơn em trai.', 'Anh chàng này mạnh hơn em trai kia.', 'Anh chàng này mạnh hơn em trai kia hơn.', 'Anh chàng này mạnh hơn em trai kia mạnh hơn.', 'A', 'A', 'Câu ''Anh chàng này mạnh hơn em trai'' sử dụng so sánh bằng so sánh sai cấu trúc vì nó không thêm -er vào gốc từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'So sánh bằng so sánh' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'A2', 'Câu nào dưới đây sử dụng so sánh bằng so sánh sai cách dùng?', 'Anh chàng này mạnh hơn em trai kia.', 'Anh chàng này mạnh hơn em trai.', 'Anh chàng này mạnh hơn em trai kia hơn.', 'Anh chàng này mạnh hơn em trai kia mạnh hơn.', 'B', 'B', 'Câu ''Anh chàng này mạnh hơn em trai'' sử dụng so sánh bằng so sánh sai cách dùng vì nó không so sánh hai đối tượng có cùng tính chất.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Số đếm tuyệt đối', 'A2', '### Số đếm tuyệt đối
#### Cấu trúc/Công thức
Số đếm tuyệt đối được sử dụng để so sánh thứ tự trong một nhóm các đối tượng. Cấu trúc của số đếm tuyệt đối là:
- **Số đếm tuyệt đối** + **động từ** + **đối tượng**

#### Cách dùng
Số đếm tuyệt đối thường được sử dụng để so sánh thứ tự trong một nhóm các đối tượng. Ví dụ:
- Đây là **đối tượng** nhất trong nhóm.
- Đây là **đối tượng** lớn nhất trong nhóm.

#### Ví dụ minh họa
- Đây là **đối tượng** lớn nhất trong nhóm bạn.
- Cô ấy là **đối tượng** thông minh nhất trong lớp.

#### Mẹo học
- Hãy nhớ rằng số đếm tuyệt đối thường được sử dụng để so sánh thứ tự trong một nhóm các đối tượng.
- Hãy sử dụng số đếm tuyệt đối đúng cách để tránh nhầm lẫn.

#### Các lỗi thường gặp
- Sử dụng số đếm tuyệt đối sai cách.
- Không sử dụng số đếm tuyệt đối đúng lúc.

#### Tóm tắt
Số đếm tuyệt đối là một phần quan trọng trong tiếng Anh. Hãy nhớ cách sử dụng số đếm tuyệt đối đúng cách để tránh nhầm lẫn và cải thiện kỹ năng tiếng Anh của mình.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm tuyệt đối' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A2', 'Cấu trúc của số đếm tuyệt đối là gì?', 'Số đếm tuyệt đối + động từ + đối tượng', 'Động từ + số đếm tuyệt đối + đối tượng', 'Số đếm tuyệt đối + đối tượng + động từ', 'Đối tượng + số đếm tuyệt đối + động từ', 'A', 'A', 'Cấu trúc của số đếm tuyệt đối là: Số đếm tuyệt đối + động từ + đối tượng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm tuyệt đối' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A2', 'Số đếm tuyệt đối thường được sử dụng để so sánh thứ tự trong một nhóm các đối tượng như thế nào?', 'Để so sánh thứ tự trong một nhóm các đối tượng', 'Để so sánh kích thước trong một nhóm các đối tượng', 'Để so sánh trọng lượng trong một nhóm các đối tượng', 'Để so sánh màu sắc trong một nhóm các đối tượng', 'A', 'A', 'Số đếm tuyệt đối thường được sử dụng để so sánh thứ tự trong một nhóm các đối tượng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm tuyệt đối' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A2', 'Ví dụ về số đếm tuyệt đối là gì?', 'Đây là đối tượng lớn nhất trong nhóm bạn.', 'Cô ấy là đối tượng thông minh nhất trong lớp.', 'Đây là đối tượng nhỏ nhất trong nhóm bạn.', 'Cô ấy là đối tượng yếu nhất trong lớp.', 'B', 'B', 'Ví dụ về số đếm tuyệt đối là: Cô ấy là đối tượng thông minh nhất trong lớp.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm tuyệt đối' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A2', 'Mẹo học về số đếm tuyệt đối là gì?', 'Hãy nhớ rằng số đếm tuyệt đối thường được sử dụng để so sánh thứ tự trong một nhóm các đối tượng.', 'Hãy sử dụng số đếm tuyệt đối đúng cách để tránh nhầm lẫn.', 'Hãy sử dụng số đếm tuyệt đối sai cách để tránh nhầm lẫn.', 'Hãy không sử dụng số đếm tuyệt đối đúng lúc.', 'B', 'B', 'Mẹo học về số đếm tuyệt đối là: Hãy sử dụng số đếm tuyệt đối đúng cách để tránh nhầm lẫn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm tuyệt đối' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A2', 'Các lỗi thường gặp khi sử dụng số đếm tuyệt đối là gì?', 'Sử dụng số đếm tuyệt đối sai cách.', 'Không sử dụng số đếm tuyệt đối đúng lúc.', 'Sử dụng số đếm tuyệt đối đúng cách.', 'Không sử dụng số đếm tuyệt đối sai cách.', 'A', 'A', 'Các lỗi thường gặp khi sử dụng số đếm tuyệt đối là: Sử dụng số đếm tuyệt đối sai cách.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm tuyệt đối' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A2', 'Tóm tắt về số đếm tuyệt đối là gì?', 'Số đếm tuyệt đối là một phần quan trọng trong tiếng Anh.', 'Số đếm tuyệt đối là một phần không quan trọng trong tiếng Anh.', 'Số đếm tuyệt đối là một phần quan trọng trong tiếng Anh, nhưng không được sử dụng thường xuyên.', 'Số đếm tuyệt đối là một phần không quan trọng trong tiếng Anh, nhưng được sử dụng thường xuyên.', 'A', 'A', 'Tóm tắt về số đếm tuyệt đối là: Số đếm tuyệt đối là một phần quan trọng trong tiếng Anh.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm tuyệt đối' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A2', 'Số đếm tuyệt đối thường được sử dụng để so sánh thứ tự trong một nhóm các đối tượng như thế nào?', 'Để so sánh thứ tự trong một nhóm các đối tượng.', 'Để so sánh kích thước trong một nhóm các đối tượng.', 'Để so sánh trọng lượng trong một nhóm các đối tượng.', 'Để so sánh màu sắc trong một nhóm các đối tượng.', 'A', 'A', 'Số đếm tuyệt đối thường được sử dụng để so sánh thứ tự trong một nhóm các đối tượng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm tuyệt đối' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A2', 'Ví dụ về số đếm tuyệt đối là gì?', 'Đây là đối tượng lớn nhất trong nhóm bạn.', 'Cô ấy là đối tượng thông minh nhất trong lớp.', 'Đây là đối tượng nhỏ nhất trong nhóm bạn.', 'Cô ấy là đối tượng yếu nhất trong lớp.', 'B', 'B', 'Ví dụ về số đếm tuyệt đối là: Cô ấy là đối tượng thông minh nhất trong lớp.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm tuyệt đối' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A2', 'Mẹo học về số đếm tuyệt đối là gì?', 'Hãy nhớ rằng số đếm tuyệt đối thường được sử dụng để so sánh thứ tự trong một nhóm các đối tượng.', 'Hãy sử dụng số đếm tuyệt đối đúng cách để tránh nhầm lẫn.', 'Hãy sử dụng số đếm tuyệt đối sai cách để tránh nhầm lẫn.', 'Hãy không sử dụng số đếm tuyệt đối đúng lúc.', 'B', 'B', 'Mẹo học về số đếm tuyệt đối là: Hãy sử dụng số đếm tuyệt đối đúng cách để tránh nhầm lẫn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm tuyệt đối' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A2', 'Các lỗi thường gặp khi sử dụng số đếm tuyệt đối là gì?', 'Sử dụng số đếm tuyệt đối sai cách.', 'Không sử dụng số đếm tuyệt đối đúng lúc.', 'Sử dụng số đếm tuyệt đối đúng cách.', 'Không sử dụng số đếm tuyệt đối sai cách.', 'A', 'A', 'Các lỗi thường gặp khi sử dụng số đếm tuyệt đối là: Sử dụng số đếm tuyệt đối sai cách.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm tuyệt đối' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'A2', 'Tóm tắt về số đếm tuyệt đối là gì?', 'Số đếm tuyệt đối là một phần quan trọng trong tiếng Anh.', 'Số đếm tuyệt đối là một phần không quan trọng trong tiếng Anh.', 'Số đếm tuyệt đối là một phần quan trọng trong tiếng Anh, nhưng không được sử dụng thường xuyên.', 'Số đếm tuyệt đối là một phần không quan trọng trong tiếng Anh, nhưng được sử dụng thường xuyên.', 'A', 'A', 'Tóm tắt về số đếm tuyệt đối là: Số đếm tuyệt đối là một phần quan trọng trong tiếng Anh.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Số đếm và không đếm được', 'A2', '# Số đếm và không đếm được

## Cấu trúc/Công thức

Số đếm được (Countable Nouns) thường được sử dụng với số đếm (quantifiers) như *a*, *an*, *some*, *any*, *no*, *few*, *many*, *little*, *much*... 

Số không đếm được (Uncountable Nouns) thường được sử dụng với các từ chỉ số lượng như *a lot of*, *a great deal of*, *a large amount of*, *a small amount of*...

## Cách dùng

Số đếm được thường được sử dụng để chỉ các vật thể có thể được đếm được như *book*, *apple*, *car*... 

Số không đếm được thường được sử dụng để chỉ các vật thể không thể được đếm được như *water*, *air*, *music*...

## Ví dụ minh họa

- Số đếm được: *I have *three* books.* (Tôi có ba quyển sách.)
- Số không đếm được: *I have *a lot of* water.* (Tôi có một lượng nước lớn.)

## Mẹo học

- Hãy nhớ rằng số đếm được thường được sử dụng với số đếm, còn số không đếm được thường được sử dụng với các từ chỉ số lượng.
- Hãy luyện tập sử dụng số đếm được và số không đếm được trong các câu đơn giản.

## Các lỗi thường gặp

- Sử dụng số đếm được với số không đếm được: *I have *three* water.* (Sai vì *water* là số không đếm được.)
- Sử dụng số không đếm được với số đếm: *I have *a lot of* book.* (Sai vì *book* là số đếm được.)

## Tóm tắt

Số đếm được và số không đếm được là hai loại từ có thể được sử dụng trong tiếng Anh. Số đếm được thường được sử dụng để chỉ các vật thể có thể được đếm được, còn số không đếm được thường được sử dụng để chỉ các vật thể không thể được đếm được.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm và không đếm được' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A2', 'Số đếm được thường được sử dụng với số đếm?', 'Số không đếm được', 'Số đếm', 'Các từ chỉ số lượng', 'Các từ chỉ thời gian', 'B', 'B', 'Số đếm được thường được sử dụng với số đếm như *a*, *an*, *some*, *any*, *no*, *few*, *many*, *little*, *much*...');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm và không đếm được' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A2', 'Số không đếm được thường được sử dụng với các từ chỉ số lượng?', 'Số đếm được', 'Số không đếm được', 'Các từ chỉ thời gian', 'Các từ chỉ địa điểm', 'B', 'B', 'Số không đếm được thường được sử dụng với các từ chỉ số lượng như *a lot of*, *a great deal of*, *a large amount of*, *a small amount of*...');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm và không đếm được' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A2', 'Số đếm được thường được sử dụng để chỉ các vật thể có thể được đếm được?', 'Không', 'Có', 'Có thể', 'Không thể', 'B', 'B', 'Số đếm được thường được sử dụng để chỉ các vật thể có thể được đếm được như *book*, *apple*, *car*...');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm và không đếm được' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A2', 'Số không đếm được thường được sử dụng để chỉ các vật thể không thể được đếm được?', 'Không', 'Có', 'Có thể', 'Không thể', 'B', 'B', 'Số không đếm được thường được sử dụng để chỉ các vật thể không thể được đếm được như *water*, *air*, *music*...');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm và không đếm được' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A2', 'Số đếm được thường được sử dụng với số không đếm được?', 'Có', 'Không', 'Có thể', 'Không thể', 'B', 'B', 'Số đếm được thường được sử dụng với số đếm, còn số không đếm được thường được sử dụng với các từ chỉ số lượng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm và không đếm được' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A2', 'Số không đếm được thường được sử dụng với số đếm?', 'Có', 'Không', 'Có thể', 'Không thể', 'B', 'B', 'Số không đếm được thường được sử dụng với các từ chỉ số lượng, còn số đếm được thường được sử dụng với số đếm.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm và không đếm được' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A2', 'Số đếm được thường được sử dụng để chỉ các vật thể không thể được đếm được?', 'Có', 'Không', 'Có thể', 'Không thể', 'B', 'B', 'Số đếm được thường được sử dụng để chỉ các vật thể có thể được đếm được như *book*, *apple*, *car*...');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm và không đếm được' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A2', 'Số không đếm được thường được sử dụng để chỉ các vật thể có thể được đếm được?', 'Có', 'Không', 'Có thể', 'Không thể', 'B', 'B', 'Số không đếm được thường được sử dụng để chỉ các vật thể không thể được đếm được như *water*, *air*, *music*...');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm và không đếm được' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A2', 'Số đếm được thường được sử dụng với các từ chỉ thời gian?', 'Có', 'Không', 'Có thể', 'Không thể', 'B', 'B', 'Số đếm được thường được sử dụng với số đếm, còn số không đếm được thường được sử dụng với các từ chỉ số lượng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm và không đếm được' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A2', 'Số không đếm được thường được sử dụng với các từ chỉ địa điểm?', 'Có', 'Không', 'Có thể', 'Không thể', 'B', 'B', 'Số không đếm được thường được sử dụng với các từ chỉ số lượng, còn số đếm được thường được sử dụng với số đếm.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm và không đếm được' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'A2', 'Số đếm được thường được sử dụng để chỉ các vật thể không thể được đếm được và có thể được đếm được?', 'Có', 'Không', 'Có thể', 'Không thể', 'B', 'B', 'Số đếm được thường được sử dụng để chỉ các vật thể có thể được đếm được như *book*, *apple*, *car*...');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Số đếm và không đếm được' ORDER BY id DESC LIMIT 1), 12, 'MULTIPLE_CHOICE', 'A2', 'Số không đếm được thường được sử dụng để chỉ các vật thể có thể được đếm được và không thể được đếm được?', 'Có', 'Không', 'Có thể', 'Không thể', 'B', 'B', 'Số không đếm được thường được sử dụng để chỉ các vật thể không thể được đếm được như *water*, *air*, *music*...');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Adverbs of Frequency & Manner', 'A2', '### Cấu trúc/Công thức (Formula)
Adverbs of frequency và adverbs of manner thường được sử dụng để mô tả hành động hoặc trạng thái của một người.

#### Adverbs of Frequency
- Cấu trúc: [adverb of frequency] + [verb] (e.g. I always study English.)
- Ví dụ: 
  - I often go to the gym. (thường xuyên đi tập gym)
  - She rarely eats breakfast. (hiếm khi ăn sáng)
- Mẹo học: Hãy sử dụng các adverb of frequency phù hợp với ngữ cảnh và tình huống.
- Các lỗi thường gặp: Sử dụng adverb of frequency không phù hợp với ngữ cảnh.

#### Adverbs of Manner
- Cấu trúc: [adverb of manner] + [verb] (e.g. I speak English fluently.)
- Ví dụ: 
  - He sings beautifully. (hát đẹp)
  - She writes slowly. (viết chậm)
- Mẹo học: Hãy sử dụng các adverb of manner phù hợp với ngữ cảnh và tình huống.
- Các lỗi thường gặp: Sử dụng adverb of manner không phù hợp với ngữ cảnh.

#### Ví dụ minh họa
- I usually wake up at 6 am. (thường thức dậy lúc 6 giờ sáng)
- She speaks English very well. (nói tiếng Anh rất tốt)

#### Tóm tắt
- Adverbs of frequency và adverbs of manner được sử dụng để mô tả hành động hoặc trạng thái của một người.
- Hãy sử dụng các adverb phù hợp với ngữ cảnh và tình huống.
- Tránh sử dụng adverb không phù hợp với ngữ cảnh.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adverbs of Frequency & Manner' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A2', 'Cấu trúc của adverb of frequency là gì?', '[adverb of frequency] + [verb]', '[verb] + [adverb of frequency]', '[adverb of frequency] + [noun]', '[noun] + [adverb of frequency]', 'A', 'A', 'Cấu trúc của adverb of frequency là [adverb of frequency] + [verb]. Ví dụ: I always study English.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adverbs of Frequency & Manner' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A2', 'Adverb of frequency nào thường được sử dụng để mô tả hành động thường xuyên?', 'rarely', 'often', 'usually', 'seldom', 'B', 'B', 'Adverb of frequency ''often'' thường được sử dụng để mô tả hành động thường xuyên. Ví dụ: I often go to the gym.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adverbs of Frequency & Manner' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A2', 'Cấu trúc của adverb of manner là gì?', '[adverb of manner] + [noun]', '[adverb of manner] + [verb]', '[noun] + [adverb of manner]', '[verb] + [adverb of manner]', 'B', 'B', 'Cấu trúc của adverb of manner là [adverb of manner] + [verb]. Ví dụ: She sings beautifully.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adverbs of Frequency & Manner' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A2', 'Adverb of manner nào thường được sử dụng để mô tả hành động nhanh chóng?', 'quickly', 'slowly', 'carefully', 'happily', 'A', 'A', 'Adverb of manner ''quickly'' thường được sử dụng để mô tả hành động nhanh chóng. Ví dụ: He runs quickly.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adverbs of Frequency & Manner' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A2', 'Hãy chọn câu đúng về sử dụng adverb of frequency:', 'Sử dụng adverb of frequency phù hợp với ngữ cảnh và tình huống.', 'Sử dụng adverb of frequency không phù hợp với ngữ cảnh.', 'Sử dụng adverb of manner để mô tả hành động thường xuyên.', 'Sử dụng adverb of manner để mô tả hành động nhanh chóng.', 'A', 'A', 'Hãy sử dụng adverb of frequency phù hợp với ngữ cảnh và tình huống.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adverbs of Frequency & Manner' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A2', 'Hãy chọn câu đúng về sử dụng adverb of manner:', 'Sử dụng adverb of manner phù hợp với ngữ cảnh và tình huống.', 'Sử dụng adverb of frequency không phù hợp với ngữ cảnh.', 'Sử dụng adverb of manner để mô tả hành động thường xuyên.', 'Sử dụng adverb of manner để mô tả hành động nhanh chóng.', 'A', 'A', 'Hãy sử dụng adverb of manner phù hợp với ngữ cảnh và tình huống.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adverbs of Frequency & Manner' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A2', 'Câu sau là đúng về sử dụng adverb of frequency:', 'I usually go to the gym.', 'I rarely go to the gym.', 'I often go to the gym.', 'I seldom go to the gym.', 'C', 'C', 'Câu ''I often go to the gym.'' là đúng về sử dụng adverb of frequency.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adverbs of Frequency & Manner' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A2', 'Câu sau là đúng về sử dụng adverb of manner:', 'She sings beautifully.', 'She sings quickly.', 'She sings slowly.', 'She sings carefully.', 'A', 'A', 'Câu ''She sings beautifully.'' là đúng về sử dụng adverb of manner.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adverbs of Frequency & Manner' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A2', 'Hãy chọn câu đúng về các lỗi thường gặp khi sử dụng adverb:', 'Sử dụng adverb phù hợp với ngữ cảnh và tình huống.', 'Sử dụng adverb không phù hợp với ngữ cảnh.', 'Sử dụng adverb của người khác.', 'Sử dụng adverb của chính mình.', 'B', 'B', 'Hãy tránh sử dụng adverb không phù hợp với ngữ cảnh.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adverbs of Frequency & Manner' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A2', 'Hãy chọn câu đúng về tóm tắt về adverb:', 'Adverb được sử dụng để mô tả hành động hoặc trạng thái của một người.', 'Adverb được sử dụng để mô tả hành động hoặc trạng thái của một vật.', 'Adverb được sử dụng để mô tả hành động hoặc trạng thái của một nhóm người.', 'Adverb được sử dụng để mô tả hành động hoặc trạng thái của một quốc gia.', 'A', 'A', 'Adverb được sử dụng để mô tả hành động hoặc trạng thái của một người.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Adverbs of Frequency & Manner' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'A2', 'Hãy chọn câu đúng về cách học adverb:', 'Hãy sử dụng các adverb phù hợp với ngữ cảnh và tình huống.', 'Hãy sử dụng các adverb không phù hợp với ngữ cảnh.', 'Hãy sử dụng các adverb của người khác.', 'Hãy sử dụng các adverb của chính mình.', 'A', 'A', 'Hãy sử dụng các adverb phù hợp với ngữ cảnh và tình huống.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Present Perfect (Introduction)', 'A2', '### Cấu trúc/Công thức (Formula)
   - **S + đã + V + (object)**: S là chủ ngữ, đã là động từ đã, V là động từ chính, object là đối tượng của động từ.
   - Ví dụ: I **have eaten** breakfast. (Tôi đã ăn sáng.)

   ### Cách dùng (Usage)
   - **Báo cáo hành động đã xảy ra trong quá khứ và liên quan đến hiện tại**: Sử dụng để báo cáo hành động đã xảy ra trong quá khứ và liên quan đến hiện tại.
   - Ví dụ: I **have been** to Paris. (Tôi đã đi Paris.)

   ### Ví dụ minh họa (Examples)
   - I **have finished** my homework. (Tôi đã hoàn thành bài tập về nhà.)
   - She **has studied** English for three years. (Cô ấy đã học tiếng Anh trong ba năm.)

   ### Mẹo học (Tips)
   - Sử dụng **have** với người thứ nhất và thứ ba, **has** với người thứ hai.
   - Sử dụng **had** với quá khứ hoàn thành.

   ### Các lỗi thường gặp (Common Mistakes)
   - Không sử dụng **have** và **has** đúng cách.
   - Không sử dụng **had** đúng cách.

   ### Tóm tắt (Summary)
   - Present Perfect là một cấu trúc ngữ pháp được sử dụng để báo cáo hành động đã xảy ra trong quá khứ và liên quan đến hiện tại.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect (Introduction)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A2', 'Cấu trúc của Present Perfect là gì?', 'S + V + (object)', 'S + đã + V + (object)', 'S + V + đã + (object)', 'S + đã + V + object', 'B', 'B', 'Cấu trúc của Present Perfect là S + đã + V + (object).');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect (Introduction)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A2', 'Sử dụng Present Perfect để báo cáo hành động gì?', 'Hành động đã xảy ra trong quá khứ và liên quan đến hiện tại', 'Hành động đang xảy ra trong hiện tại', 'Hành động sẽ xảy ra trong tương lai', 'Hành động đã xảy ra trong quá khứ và không liên quan đến hiện tại', 'A', 'A', 'Sử dụng Present Perfect để báo cáo hành động đã xảy ra trong quá khứ và liên quan đến hiện tại.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect (Introduction)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A2', 'Ví dụ về Present Perfect là gì?', 'I **have eaten** breakfast.', 'I **have been** to Paris.', 'I **have studied** English for three years.', 'I **have finished** my homework.', 'D', 'D', 'Ví dụ về Present Perfect là I **have finished** my homework.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect (Introduction)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A2', 'Sử dụng **have** và **has** như thế nào?', 'Sử dụng **have** với người thứ hai và thứ ba, **has** với người thứ nhất.', 'Sử dụng **have** với người thứ nhất và thứ ba, **has** với người thứ hai.', 'Sử dụng **have** và **has** với tất cả người.', 'Không sử dụng **have** và **has**.', 'B', 'B', 'Sử dụng **have** với người thứ nhất và thứ ba, **has** với người thứ hai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect (Introduction)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A2', 'Sử dụng **had** như thế nào?', 'Sử dụng **had** với quá khứ hoàn thành.', 'Sử dụng **had** với hiện tại hoàn thành.', 'Sử dụng **had** với tương lai hoàn thành.', 'Không sử dụng **had**.', 'A', 'A', 'Sử dụng **had** với quá khứ hoàn thành.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect (Introduction)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A2', 'Câu sau là đúng hay sai?', 'I **have been** to Paris.', 'I **has been** to Paris.', 'I **have been** to Paris yesterday.', 'I **has been** to Paris yesterday.', 'A', 'A', 'Câu I **have been** to Paris là đúng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect (Introduction)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A2', 'Câu sau là đúng hay sai?', 'She **has studied** English for three years.', 'She **have studied** English for three years.', 'She **has been** studying English for three years.', 'She **have been** studying English for three years.', 'A', 'A', 'Câu She **has studied** English for three years là đúng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect (Introduction)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A2', 'Câu sau là đúng hay sai?', 'I **have finished** my homework.', 'I **has finished** my homework.', 'I **have been** finishing my homework.', 'I **has been** finishing my homework.', 'A', 'A', 'Câu I **have finished** my homework là đúng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect (Introduction)' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A2', 'Câu sau là đúng hay sai?', 'They **have been** to Paris.', 'They **has been** to Paris.', 'They **have been** studying English for three years.', 'They **has been** studying English for three years.', 'A', 'A', 'Câu They **have been** to Paris là đúng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect (Introduction)' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A2', 'Câu sau là đúng hay sai?', 'I **have studied** English for three years.', 'I **has studied** English for three years.', 'I **have been** studying English for three years.', 'I **has been** studying English for three years.', 'A', 'A', 'Câu I **have studied** English for three years là đúng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect (Introduction)' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'A2', 'Câu sau là đúng hay sai?', 'She **has been** studying English for three years.', 'She **have been** studying English for three years.', 'She **has studied** English for three years.', 'She **have studied** English for three years.', 'A', 'A', 'Câu She **has been** studying English for three years là đúng.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Modals of Ability and Permission (Could, May)', 'A2', '### Modals of Ability and Permission (Could, May)
#### Cấu trúc/Công thức (Formula)
- **Could**: có thể + V (động từ)
- **May**: có thể + V (động từ)
#### Cách dùng (Usage)
- **Could**: dùng để nói về khả năng, khả năng đã có trong quá khứ
- **May**: dùng để nói về sự cho phép, sự đồng ý
#### Ví dụ minh họa (Examples)
- **Could**: Tôi có thể nói tiếng Anh. (Tôi có khả năng nói tiếng Anh)
- Tôi có thể đi du lịch vào tháng 8. (Tôi có khả năng đi du lịch vào tháng 8)
- **May**: Bạn có thể đi chơi với tôi vào thứ 7? (Bạn có thể đi chơi với tôi vào thứ 7)
- Tôi có thể đi xem phim vào tối nay? (Bạn có thể cho phép tôi đi xem phim vào tối nay)
#### Mẹo học (Tips)
- Hãy nhớ rằng **Could** và **May** đều có thể được sử dụng để nói về khả năng, nhưng **Could** thường được sử dụng để nói về khả năng đã có trong quá khứ
- Hãy sử dụng **May** khi bạn muốn hỏi về sự cho phép hoặc sự đồng ý
#### Các lỗi thường gặp (Common Mistakes)
- Không sử dụng **Could** và **May** đúng cách
- Sử dụng **Could** và **May** để nói về sự chắc chắn
#### Tóm tắt (Summary)
- **Could**: dùng để nói về khả năng, khả năng đã có trong quá khứ
- **May**: dùng để nói về sự cho phép, sự đồng ý
- Hãy sử dụng **Could** và **May** đúng cách để tránh các lỗi thường gặp', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Ability and Permission (Could, May)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A2', 'Câu nào sau đây sử dụng modal ''Could'' đúng cách?', 'Tôi có thể đi du lịch vào tháng 8.', 'Tôi có thể đi xem phim vào tối nay.', 'Tôi có thể đi chơi với bạn vào thứ 7.', 'Tôi có thể đi học vào sáng nay.', 'A', 'A', 'Câu ''Tôi có thể đi du lịch vào tháng 8.'' sử dụng modal ''Could'' đúng cách vì nó nói về khả năng đã có trong quá khứ');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Ability and Permission (Could, May)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A2', 'Câu nào sau đây sử dụng modal ''May'' đúng cách?', 'Bạn có thể đi chơi với tôi vào thứ 7?', 'Tôi có thể đi xem phim vào tối nay.', 'Tôi có thể đi học vào sáng nay.', 'Tôi có thể đi du lịch vào tháng 8.', 'A', 'A', 'Câu ''Bạn có thể đi chơi với tôi vào thứ 7?'' sử dụng modal ''May'' đúng cách vì nó hỏi về sự cho phép');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Ability and Permission (Could, May)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A2', 'Câu nào sau đây sử dụng modal ''Could'' sai cách?', 'Tôi có thể đi xem phim vào tối nay.', 'Tôi có thể đi học vào sáng nay.', 'Tôi có thể đi chơi với bạn vào thứ 7.', 'Tôi có thể đi du lịch vào tháng 8.', 'A', 'A', 'Câu ''Tôi có thể đi xem phim vào tối nay.'' sử dụng modal ''Could'' sai cách vì nó nói về sự chắc chắn');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Ability and Permission (Could, May)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A2', 'Câu nào sau đây sử dụng modal ''May'' sai cách?', 'Bạn có thể đi chơi với tôi vào thứ 7?', 'Tôi có thể đi xem phim vào tối nay.', 'Tôi có thể đi học vào sáng nay.', 'Tôi có thể đi du lịch vào tháng 8.', 'B', 'B', 'Câu ''Tôi có thể đi xem phim vào tối nay.'' sử dụng modal ''May'' sai cách vì nó nói về sự chắc chắn');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Ability and Permission (Could, May)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A2', 'Câu nào sau đây sử dụng modal ''Could'' đúng cách để nói về khả năng đã có trong quá khứ?', 'Tôi có thể đi xem phim vào tối nay.', 'Tôi có thể đi học vào sáng nay.', 'Tôi có thể đi chơi với bạn vào thứ 7.', 'Tôi có thể đi du lịch vào tháng 8.', 'D', 'D', 'Câu ''Tôi có thể đi du lịch vào tháng 8.'' sử dụng modal ''Could'' đúng cách để nói về khả năng đã có trong quá khứ');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Ability and Permission (Could, May)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A2', 'Câu nào sau đây sử dụng modal ''May'' đúng cách để hỏi về sự cho phép?', 'Tôi có thể đi xem phim vào tối nay.', 'Bạn có thể đi chơi với tôi vào thứ 7?', 'Tôi có thể đi học vào sáng nay.', 'Tôi có thể đi du lịch vào tháng 8.', 'B', 'B', 'Câu ''Bạn có thể đi chơi với tôi vào thứ 7?'' sử dụng modal ''May'' đúng cách để hỏi về sự cho phép');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Ability and Permission (Could, May)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A2', 'Câu nào sau đây sử dụng modal ''Could'' sai cách để nói về sự chắc chắn?', 'Tôi có thể đi xem phim vào tối nay.', 'Tôi có thể đi học vào sáng nay.', 'Tôi có thể đi chơi với bạn vào thứ 7.', 'Tôi có thể đi du lịch vào tháng 8.', 'A', 'A', 'Câu ''Tôi có thể đi xem phim vào tối nay.'' sử dụng modal ''Could'' sai cách để nói về sự chắc chắn');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Ability and Permission (Could, May)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A2', 'Câu nào sau đây sử dụng modal ''May'' sai cách để nói về sự chắc chắn?', 'Tôi có thể đi xem phim vào tối nay.', 'Tôi có thể đi học vào sáng nay.', 'Tôi có thể đi chơi với bạn vào thứ 7.', 'Tôi có thể đi du lịch vào tháng 8.', 'A', 'A', 'Câu ''Tôi có thể đi xem phim vào tối nay.'' sử dụng modal ''May'' sai cách để nói về sự chắc chắn');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Ability and Permission (Could, May)' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A2', 'Câu nào sau đây sử dụng modal ''Could'' đúng cách để nói về khả năng?', 'Tôi có thể đi xem phim vào tối nay.', 'Tôi có thể đi học vào sáng nay.', 'Tôi có thể đi chơi với bạn vào thứ 7.', 'Tôi có thể đi du lịch vào tháng 8.', 'D', 'D', 'Câu ''Tôi có thể đi du lịch vào tháng 8.'' sử dụng modal ''Could'' đúng cách để nói về khả năng');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Ability and Permission (Could, May)' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A2', 'Câu nào sau đây sử dụng modal ''May'' đúng cách để hỏi về sự cho phép?', 'Tôi có thể đi xem phim vào tối nay.', 'Bạn có thể đi chơi với tôi vào thứ 7?', 'Tôi có thể đi học vào sáng nay.', 'Tôi có thể đi du lịch vào tháng 8.', 'B', 'B', 'Câu ''Bạn có thể đi chơi với tôi vào thứ 7?'' sử dụng modal ''May'' đúng cách để hỏi về sự cho phép');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Ability and Permission (Could, May)' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'A2', 'Câu nào sau đây sử dụng modal ''Could'' đúng cách để nói về khả năng đã có trong quá khứ?', 'Tôi có thể đi xem phim vào tối nay.', 'Tôi có thể đi học vào sáng nay.', 'Tôi có thể đi chơi với bạn vào thứ 7.', 'Tôi có thể đi du lịch vào tháng 8.', 'D', 'D', 'Câu ''Tôi có thể đi du lịch vào tháng 8.'' sử dụng modal ''Could'' đúng cách để nói về khả năng đã có trong quá khứ');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Gerunds vs Infinitives', 'A2', '### Gerunds vs Infinitives

#### Cấu trúc/Công thức (Formula)

- Gerund: động từ + -ing (e.g. eating, writing)
- Infinitive: to + động từ (e.g. to eat, to write)

#### Cách dùng (Usage)

- Gerund thường được sử dụng như một động từ trong câu, trong khi Infinitive thường được sử dụng như một tính từ.
- Gerund thường được sử dụng để mô tả hành động đang diễn ra, trong khi Infinitive thường được sử dụng để mô tả hành động có thể diễn ra.

#### Ví dụ minh họa (Examples)

- I love eating pizza. (Gerund)
- I want to eat pizza. (Infinitive)
- I''m good at writing stories. (Gerund)
- I''m going to write a story. (Infinitive)

#### Mẹo học (Tips)

- Hãy nhớ rằng Gerund thường được sử dụng như một động từ, trong khi Infinitive thường được sử dụng như một tính từ.
- Hãy kiểm tra lại câu để đảm bảo rằng bạn đã sử dụng Gerund hoặc Infinitive đúng cách.

#### Các lỗi thường gặp (Common Mistakes)

- Sử dụng Gerund khi cần sử dụng Infinitive.
- Sử dụng Infinitive khi cần sử dụng Gerund.

#### Tóm tắt (Summary)

- Gerund và Infinitive là hai dạng của động từ trong tiếng Anh.
- Gerund thường được sử dụng như một động từ, trong khi Infinitive thường được sử dụng như một tính từ.
- Hãy nhớ kiểm tra lại câu để đảm bảo rằng bạn đã sử dụng Gerund hoặc Infinitive đúng cách.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds vs Infinitives' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'A2', 'Câu sau sử dụng Gerund hay Infinitive?', 'Gerund', 'Infinitive', 'Cả hai đều đúng', 'Cả hai đều sai', 'A', 'A', 'Câu sau sử dụng Gerund: I love eating pizza.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds vs Infinitives' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'A2', 'Câu sau sử dụng Gerund hay Infinitive?', 'Gerund', 'Infinitive', 'Cả hai đều đúng', 'Cả hai đều sai', 'B', 'B', 'Câu sau sử dụng Infinitive: I want to eat pizza.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds vs Infinitives' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'A2', 'Câu sau sử dụng Gerund hay Infinitive?', 'Gerund', 'Infinitive', 'Cả hai đều đúng', 'Cả hai đều sai', 'A', 'A', 'Câu sau sử dụng Gerund: I''m good at writing stories.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds vs Infinitives' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'A2', 'Câu sau sử dụng Gerund hay Infinitive?', 'Gerund', 'Infinitive', 'Cả hai đều đúng', 'Cả hai đều sai', 'B', 'B', 'Câu sau sử dụng Infinitive: I''m going to write a story.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds vs Infinitives' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'A2', 'Gerund thường được sử dụng như một động từ hay tính từ?', 'Động từ', 'Tính từ', 'Cả hai đều đúng', 'Cả hai đều sai', 'A', 'A', 'Gerund thường được sử dụng như một động từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds vs Infinitives' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'A2', 'Infinitive thường được sử dụng như một động từ hay tính từ?', 'Động từ', 'Tính từ', 'Cả hai đều đúng', 'Cả hai đều sai', 'B', 'B', 'Infinitive thường được sử dụng như một tính từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds vs Infinitives' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'A2', 'Câu sau sử dụng Gerund hay Infinitive?', 'Gerund', 'Infinitive', 'Cả hai đều đúng', 'Cả hai đều sai', 'A', 'A', 'Câu sau sử dụng Gerund: I love reading books.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds vs Infinitives' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'A2', 'Câu sau sử dụng Gerund hay Infinitive?', 'Gerund', 'Infinitive', 'Cả hai đều đúng', 'Cả hai đều sai', 'B', 'B', 'Câu sau sử dụng Infinitive: I want to read a book.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds vs Infinitives' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'A2', 'Gerund thường được sử dụng để mô tả hành động đang diễn ra hay có thể diễn ra?', 'Hành động đang diễn ra', 'Hành động có thể diễn ra', 'Cả hai đều đúng', 'Cả hai đều sai', 'A', 'A', 'Gerund thường được sử dụng để mô tả hành động đang diễn ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds vs Infinitives' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'A2', 'Infinitive thường được sử dụng để mô tả hành động đang diễn ra hay có thể diễn ra?', 'Hành động đang diễn ra', 'Hành động có thể diễn ra', 'Cả hai đều đúng', 'Cả hai đều sai', 'B', 'B', 'Infinitive thường được sử dụng để mô tả hành động có thể diễn ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds vs Infinitives' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'A2', 'Câu sau sử dụng Gerund hay Infinitive?', 'Gerund', 'Infinitive', 'Cả hai đều đúng', 'Cả hai đều sai', 'A', 'A', 'Câu sau sử dụng Gerund: I''m good at singing.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Present Perfect Simple vs Continuous', 'B1', '### Cấu trúc/Công thức (Formula)
   - Present Perfect Simple: đã làm gì (đã + động từ không thay đổi hình thái)
   - Present Perfect Continuous: đã làm gì trong khoảng thời gian gần đây (đã + đang + động từ ở dạng quá khứ đơn)

   ### Cách dùng (Usage)
   - Present Perfect Simple:
     + Được sử dụng để nói về việc đã làm gì trong quá khứ mà không biết chính xác thời gian.
     + Được sử dụng để nói về việc đã làm gì mà kết quả còn tồn tại đến thời điểm hiện tại.
   - Present Perfect Continuous:
     + Được sử dụng để nói về việc đã làm gì trong khoảng thời gian gần đây.
     + Được sử dụng để nói về việc đã làm gì mà kết quả vẫn còn tồn tại đến thời điểm hiện tại.

   ### Ví dụ minh họa (Examples)
   - Present Perfect Simple:
     + I have eaten breakfast. (Tôi đã ăn sáng.)
     + She has studied English for three years. (Cô ấy đã học tiếng Anh trong ba năm.)
   - Present Perfect Continuous:
     + I have been studying English for three years. (Tôi đã học tiếng Anh trong ba năm.)
     + They have been living in London for five years. (Họ đã sống ở London trong năm năm.)

   ### Mẹo học (Tips)
   - Hãy nhớ rằng Present Perfect Simple thường được sử dụng để nói về việc đã làm gì mà kết quả còn tồn tại đến thời điểm hiện tại.
   - Hãy nhớ rằng Present Perfect Continuous thường được sử dụng để nói về việc đã làm gì trong khoảng thời gian gần đây.

   ### Các lỗi thường gặp (Common Mistakes)
   - Không sử dụng đúng cấu trúc của Present Perfect Simple và Present Perfect Continuous.
   - Không sử dụng đúng cách dùng của Present Perfect Simple và Present Perfect Continuous.

   ### Tóm tắt (Summary)
   - Present Perfect Simple và Present Perfect Continuous đều được sử dụng để nói về việc đã làm gì trong quá khứ.
   - Tuy nhiên, chúng có cách dùng và cấu trúc khác nhau.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect Simple vs Continuous' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây sử dụng đúng cấu trúc của Present Perfect Simple?', 'Tôi đã học tiếng Anh trong ba năm.', 'Tôi đã học tiếng Anh ba năm.', 'Tôi đã học tiếng Anh từ năm 2018.', 'Tôi đã học tiếng Anh trong năm nay.', 'B', 'B', 'Câu "Tôi đã học tiếng Anh ba năm." sử dụng đúng cấu trúc của Present Perfect Simple vì nó sử dụng động từ học ở dạng quá khứ đơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect Simple vs Continuous' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây sử dụng đúng cách dùng của Present Perfect Continuous?', 'Tôi đã học tiếng Anh trong ba năm.', 'Tôi đã học tiếng Anh ba năm.', 'Tôi đã học tiếng Anh từ năm 2018.', 'Tôi đã học tiếng Anh trong năm nay.', 'D', 'D', 'Câu "Tôi đã học tiếng Anh trong năm nay." sử dụng đúng cách dùng của Present Perfect Continuous vì nó nói về việc đã làm gì trong khoảng thời gian gần đây.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect Simple vs Continuous' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây sử dụng đúng cấu trúc của Present Perfect Continuous?', 'Tôi đã học tiếng Anh trong ba năm.', 'Tôi đã học tiếng Anh ba năm.', 'Tôi đã học tiếng Anh từ năm 2018.', 'Tôi đã học tiếng Anh trong năm nay.', 'C', 'C', 'Câu "Tôi đã học tiếng Anh từ năm 2018." sử dụng đúng cấu trúc của Present Perfect Continuous vì nó sử dụng động từ học ở dạng quá khứ đơn và đang.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect Simple vs Continuous' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây sử dụng đúng cách dùng của Present Perfect Simple?', 'Tôi đã học tiếng Anh trong ba năm.', 'Tôi đã học tiếng Anh ba năm.', 'Tôi đã học tiếng Anh từ năm 2018.', 'Tôi đã học tiếng Anh trong năm nay.', 'A', 'A', 'Câu "Tôi đã học tiếng Anh trong ba năm." sử dụng đúng cách dùng của Present Perfect Simple vì nó nói về việc đã làm gì mà kết quả còn tồn tại đến thời điểm hiện tại.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect Simple vs Continuous' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây sử dụng đúng cấu trúc của Present Perfect Simple?', 'Tôi đã học tiếng Anh trong ba năm.', 'Tôi đã học tiếng Anh ba năm.', 'Tôi đã học tiếng Anh từ năm 2018.', 'Tôi đã học tiếng Anh trong năm nay.', 'B', 'B', 'Câu "Tôi đã học tiếng Anh ba năm." sử dụng đúng cấu trúc của Present Perfect Simple vì nó sử dụng động từ học ở dạng quá khứ đơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect Simple vs Continuous' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây sử dụng đúng cách dùng của Present Perfect Continuous?', 'Tôi đã học tiếng Anh trong ba năm.', 'Tôi đã học tiếng Anh ba năm.', 'Tôi đã học tiếng Anh từ năm 2018.', 'Tôi đã học tiếng Anh trong năm nay.', 'D', 'D', 'Câu "Tôi đã học tiếng Anh trong năm nay." sử dụng đúng cách dùng của Present Perfect Continuous vì nó nói về việc đã làm gì trong khoảng thời gian gần đây.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect Simple vs Continuous' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây sử dụng đúng cấu trúc của Present Perfect Continuous?', 'Tôi đã học tiếng Anh trong ba năm.', 'Tôi đã học tiếng Anh ba năm.', 'Tôi đã học tiếng Anh từ năm 2018.', 'Tôi đã học tiếng Anh trong năm nay.', 'C', 'C', 'Câu "Tôi đã học tiếng Anh từ năm 2018." sử dụng đúng cấu trúc của Present Perfect Continuous vì nó sử dụng động từ học ở dạng quá khứ đơn và đang.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect Simple vs Continuous' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây sử dụng đúng cách dùng của Present Perfect Simple?', 'Tôi đã học tiếng Anh trong ba năm.', 'Tôi đã học tiếng Anh ba năm.', 'Tôi đã học tiếng Anh từ năm 2018.', 'Tôi đã học tiếng Anh trong năm nay.', 'A', 'A', 'Câu "Tôi đã học tiếng Anh trong ba năm." sử dụng đúng cách dùng của Present Perfect Simple vì nó nói về việc đã làm gì mà kết quả còn tồn tại đến thời điểm hiện tại.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect Simple vs Continuous' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây sử dụng đúng cấu trúc của Present Perfect Simple?', 'Tôi đã học tiếng Anh trong ba năm.', 'Tôi đã học tiếng Anh ba năm.', 'Tôi đã học tiếng Anh từ năm 2018.', 'Tôi đã học tiếng Anh trong năm nay.', 'B', 'B', 'Câu "Tôi đã học tiếng Anh ba năm." sử dụng đúng cấu trúc của Present Perfect Simple vì nó sử dụng động từ học ở dạng quá khứ đơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect Simple vs Continuous' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây sử dụng đúng cách dùng của Present Perfect Continuous?', 'Tôi đã học tiếng Anh trong ba năm.', 'Tôi đã học tiếng Anh ba năm.', 'Tôi đã học tiếng Anh từ năm 2018.', 'Tôi đã học tiếng Anh trong năm nay.', 'D', 'D', 'Câu "Tôi đã học tiếng Anh trong năm nay." sử dụng đúng cách dùng của Present Perfect Continuous vì nó nói về việc đã làm gì trong khoảng thời gian gần đây.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Present Perfect Simple vs Continuous' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây sử dụng đúng cấu trúc của Present Perfect Continuous?', 'Tôi đã học tiếng Anh trong ba năm.', 'Tôi đã học tiếng Anh ba năm.', 'Tôi đã học tiếng Anh từ năm 2018.', 'Tôi đã học tiếng Anh trong năm nay.', 'C', 'C', 'Câu "Tôi đã học tiếng Anh từ năm 2018." sử dụng đúng cấu trúc của Present Perfect Continuous vì nó sử dụng động từ học ở dạng quá khứ đơn và đang.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Past Continuous và Past Perfect', 'B1', '### Past Continuous và Past Perfect
#### Cấu trúc/Công thức
- Past Continuous: was/were + động từ không hoàn thành + thời điểm
- Past Perfect: had + động từ hoàn thành + thời điểm
#### Cách dùng
- Past Continuous: mô tả hành động đang diễn ra vào thời điểm khác
- Past Perfect: mô tả hành động đã kết thúc trước thời điểm khác
#### Ví dụ minh họa
- Past Continuous:
 * I was studying when you called me. (Tôi đang học khi bạn gọi cho tôi)
 * She was watching TV when the power went out. (Cô ấy đang xem TV khi điện bị cắt)
- Past Perfect:
 * I had eaten breakfast before I went to school. (Tôi đã ăn sáng trước khi đi học)
 * They had finished their homework before they went to bed. (Họ đã hoàn thành bài tập về nhà trước khi đi ngủ)
#### Mẹo học
- Sử dụng Past Continuous để mô tả hành động đang diễn ra vào thời điểm khác
- Sử dụng Past Perfect để mô tả hành động đã kết thúc trước thời điểm khác
#### Các lỗi thường gặp
- Sử dụng Past Continuous để mô tả hành động đã kết thúc trước thời điểm khác
- Sử dụng Past Perfect để mô tả hành động đang diễn ra vào thời điểm khác
#### Tóm tắt
- Past Continuous: was/were + động từ không hoàn thành + thời điểm
- Past Perfect: had + động từ hoàn thành + thời điểm
- Sử dụng Past Continuous để mô tả hành động đang diễn ra vào thời điểm khác
- Sử dụng Past Perfect để mô tả hành động đã kết thúc trước thời điểm khác', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Continuous và Past Perfect' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B1', 'Hành động nào đang diễn ra vào thời điểm khác?', 'Hành động đã kết thúc trước thời điểm khác', 'Hành động đang diễn ra vào thời điểm khác', 'Hành động sẽ diễn ra sau thời điểm khác', 'Hành động không liên quan đến thời điểm khác', 'B', 'B', 'Hành động đang diễn ra vào thời điểm khác được mô tả bằng Past Continuous.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Continuous và Past Perfect' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B1', 'Hành động nào đã kết thúc trước thời điểm khác?', 'Hành động đang diễn ra vào thời điểm khác', 'Hành động đã kết thúc trước thời điểm khác', 'Hành động sẽ diễn ra sau thời điểm khác', 'Hành động không liên quan đến thời điểm khác', 'B', 'B', 'Hành động đã kết thúc trước thời điểm khác được mô tả bằng Past Perfect.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Continuous và Past Perfect' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây sử dụng Past Continuous?', 'Tôi đã ăn sáng trước khi đi học.', 'Tôi đang học khi bạn gọi cho tôi.', 'Tôi sẽ học khi bạn gọi cho tôi.', 'Tôi không học khi bạn gọi cho tôi.', 'B', 'B', 'Câu ''Tôi đang học khi bạn gọi cho tôi.'' sử dụng Past Continuous.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Continuous và Past Perfect' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây sử dụng Past Perfect?', 'Tôi đang học khi bạn gọi cho tôi.', 'Tôi đã ăn sáng trước khi đi học.', 'Tôi sẽ học khi bạn gọi cho tôi.', 'Tôi không học khi bạn gọi cho tôi.', 'B', 'B', 'Câu ''Tôi đã ăn sáng trước khi đi học.'' sử dụng Past Perfect.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Continuous và Past Perfect' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B1', 'Hành động nào được mô tả bằng Past Continuous?', 'Hành động đã kết thúc trước thời điểm khác', 'Hành động đang diễn ra vào thời điểm khác', 'Hành động sẽ diễn ra sau thời điểm khác', 'Hành động không liên quan đến thời điểm khác', 'B', 'B', 'Hành động đang diễn ra vào thời điểm khác được mô tả bằng Past Continuous.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Continuous và Past Perfect' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B1', 'Hành động nào được mô tả bằng Past Perfect?', 'Hành động đang diễn ra vào thời điểm khác', 'Hành động đã kết thúc trước thời điểm khác', 'Hành động sẽ diễn ra sau thời điểm khác', 'Hành động không liên quan đến thời điểm khác', 'B', 'B', 'Hành động đã kết thúc trước thời điểm khác được mô tả bằng Past Perfect.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Continuous và Past Perfect' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây đúng về Past Continuous?', 'Past Continuous được sử dụng để mô tả hành động đã kết thúc trước thời điểm khác.', 'Past Continuous được sử dụng để mô tả hành động đang diễn ra vào thời điểm khác.', 'Past Continuous được sử dụng để mô tả hành động sẽ diễn ra sau thời điểm khác.', 'Past Continuous không được sử dụng để mô tả hành động liên quan đến thời điểm khác.', 'B', 'B', 'Past Continuous được sử dụng để mô tả hành động đang diễn ra vào thời điểm khác.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Continuous và Past Perfect' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây đúng về Past Perfect?', 'Past Perfect được sử dụng để mô tả hành động đang diễn ra vào thời điểm khác.', 'Past Perfect được sử dụng để mô tả hành động đã kết thúc trước thời điểm khác.', 'Past Perfect được sử dụng để mô tả hành động sẽ diễn ra sau thời điểm khác.', 'Past Perfect không được sử dụng để mô tả hành động liên quan đến thời điểm khác.', 'B', 'B', 'Past Perfect được sử dụng để mô tả hành động đã kết thúc trước thời điểm khác.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Continuous và Past Perfect' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B1', 'Hành động nào được mô tả bằng Past Continuous trong câu sau?', 'Tôi đã ăn sáng trước khi đi học.', 'Tôi đang học khi bạn gọi cho tôi.', 'Tôi sẽ học khi bạn gọi cho tôi.', 'Tôi không học khi bạn gọi cho tôi.', 'B', 'B', 'Hành động đang học được mô tả bằng Past Continuous trong câu ''Tôi đang học khi bạn gọi cho tôi.''');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Past Continuous và Past Perfect' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B1', 'Hành động nào được mô tả bằng Past Perfect trong câu sau?', 'Tôi đang học khi bạn gọi cho tôi.', 'Tôi đã ăn sáng trước khi đi học.', 'Tôi sẽ học khi bạn gọi cho tôi.', 'Tôi không học khi bạn gọi cho tôi.', 'B', 'B', 'Hành động đã ăn sáng được mô tả bằng Past Perfect trong câu ''Tôi đã ăn sáng trước khi đi học.''');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Passive Voice (Present & Past)', 'B1', '### Passive Voice (Present & Past)
#### Cấu trúc/Công thức (Formula)
- Hiện tại: Verb + am/is/are + được + Verb (past participle)
- Quá khứ: Verb + was/were + được + Verb (past participle)

#### Cách dùng (Usage)
- Sử dụng để mô tả một hành động được thực hiện bởi một người hoặc một nhóm người không được chỉ định.
- Có thể sử dụng để tạo ra một câu phức tạp hơn và thú vị hơn.

#### Ví dụ minh họa (Examples)
- Hiện tại:
 + The book is being read by John. (Sách đang được John đọc.)
 + The letter is being written by Mary. (Thư đang được Mary viết.)
- Quá khứ:
 + The book was being read by John yesterday. (Sách đang được John đọc vào hôm qua.)
 + The letter was being written by Mary last week. (Thư đang được Mary viết tuần trước.)

#### Mẹo học (Tips)
- Hãy sử dụng passive voice khi bạn muốn nhấn mạnh vào hành động chứ không phải người thực hiện hành động.
- Hãy sử dụng active voice khi bạn muốn nhấn mạnh vào người thực hiện hành động.

#### Các lỗi thường gặp (Common Mistakes)
- Sử dụng passive voice không đúng lúc.
- Sử dụng active voice không đúng lúc.

#### Tóm tắt (Summary)
- Passive voice được sử dụng để mô tả một hành động được thực hiện bởi một người hoặc một nhóm người không được chỉ định.
- Có hai loại passive voice: hiện tại và quá khứ.
- Hãy sử dụng passive voice khi bạn muốn nhấn mạnh vào hành động chứ không phải người thực hiện hành động.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Present & Past)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B1', 'Câu sau sử dụng passive voice hay không?', 'Không', 'Có', 'Có thể', 'Không rõ', 'B', 'B', 'Câu sau: The book is being read by John. Sử dụng passive voice vì nó mô tả hành động được thực hiện bởi một người không được chỉ định.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Present & Past)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B1', 'Cấu trúc của passive voice hiện tại là gì?', 'Verb + am/is/are + được + Verb (past participle)', 'Verb + was/were + được + Verb (past participle)', 'Verb + am/is/are + Verb (past participle)', 'Verb + was/were + Verb (past participle)', 'A', 'A', 'Cấu trúc của passive voice hiện tại là: Verb + am/is/are + được + Verb (past participle).');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Present & Past)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B1', 'Câu sau sử dụng active voice hay không?', 'Không', 'Có', 'Có thể', 'Không rõ', 'B', 'B', 'Câu sau: John is reading the book. Sử dụng active voice vì nó mô tả hành động được thực hiện bởi một người được chỉ định.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Present & Past)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B1', 'Cấu trúc của passive voice quá khứ là gì?', 'Verb + am/is/are + được + Verb (past participle)', 'Verb + was/were + được + Verb (past participle)', 'Verb + am/is/are + Verb (past participle)', 'Verb + was/were + Verb (past participle)', 'B', 'B', 'Cấu trúc của passive voice quá khứ là: Verb + was/were + được + Verb (past participle).');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Present & Past)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B1', 'Câu sau sử dụng passive voice quá khứ hay không?', 'Không', 'Có', 'Có thể', 'Không rõ', 'B', 'B', 'Câu sau: The book was being read by John yesterday. Sử dụng passive voice quá khứ vì nó mô tả hành động được thực hiện bởi một người không được chỉ định vào quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Present & Past)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B1', 'Mẹo học khi sử dụng passive voice là gì?', 'Sử dụng active voice khi bạn muốn nhấn mạnh vào hành động.', 'Sử dụng passive voice khi bạn muốn nhấn mạnh vào hành động.', 'Sử dụng active voice khi bạn muốn nhấn mạnh vào người thực hiện hành động.', 'Sử dụng passive voice khi bạn muốn nhấn mạnh vào người thực hiện hành động.', 'C', 'C', 'Mẹo học khi sử dụng passive voice là sử dụng active voice khi bạn muốn nhấn mạnh vào người thực hiện hành động.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Present & Past)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B1', 'Câu sau sử dụng active voice hay không?', 'Không', 'Có', 'Có thể', 'Không rõ', 'B', 'B', 'Câu sau: John is reading the book. Sử dụng active voice vì nó mô tả hành động được thực hiện bởi một người được chỉ định.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Present & Past)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B1', 'Cấu trúc của passive voice hiện tại đơn là gì?', 'Verb + am/is/are + được + Verb (past participle)', 'Verb + was/were + được + Verb (past participle)', 'Verb + am/is/are + Verb (past participle)', 'Verb + was/were + Verb (past participle)', 'A', 'A', 'Cấu trúc của passive voice hiện tại đơn là: Verb + am/is/are + được + Verb (past participle).');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Present & Past)' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B1', 'Câu sau sử dụng passive voice hiện tại đơn hay không?', 'Không', 'Có', 'Có thể', 'Không rõ', 'B', 'B', 'Câu sau: The book is being read by John. Sử dụng passive voice hiện tại đơn vì nó mô tả hành động được thực hiện bởi một người không được chỉ định.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Present & Past)' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B1', 'Cấu trúc của passive voice quá khứ đơn là gì?', 'Verb + am/is/are + được + Verb (past participle)', 'Verb + was/were + được + Verb (past participle)', 'Verb + am/is/are + Verb (past participle)', 'Verb + was/were + Verb (past participle)', 'B', 'B', 'Cấu trúc của passive voice quá khứ đơn là: Verb + was/were + được + Verb (past participle).');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Present & Past)' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'B1', 'Câu sau sử dụng passive voice quá khứ đơn hay không?', 'Không', 'Có', 'Có thể', 'Không rõ', 'B', 'B', 'Câu sau: The book was being read by John yesterday. Sử dụng passive voice quá khứ đơn vì nó mô tả hành động được thực hiện bởi một người không được chỉ định vào quá khứ.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Relative Clauses', 'B1', '# Relative Clauses

## Cấu trúc/Công thức (Formula)

Relative clauses là các từ ngữ bổ nghĩa cho người, vật, thời gian, địa điểm, sự việc trong câu.

Cấu trúc chung của relative clauses là:

[Động từ được] [số và ngôi] [tính từ] [đối tượng]

Ví dụ:

- Người mà tôi gặp ở quán cà phê là bạn cũ.

- Cô gái đang đi bộ trên đường là em gái của tôi.

## Cách dùng (Usage)

Relative clauses thường được sử dụng để bổ nghĩa cho người, vật, thời gian, địa điểm, sự việc trong câu.

- Để chỉ người, vật cụ thể:

- Người mà tôi gặp ở quán cà phê là bạn cũ.

- Cô gái đang đi bộ trên đường là em gái của tôi.

- Để chỉ thời gian, địa điểm, sự việc:

- Tôi đã đến thăm thành phố Paris vào tháng 6.

- Cô ấy đã đi du lịch đến Mỹ vào năm 2010.

## Ví dụ minh họa (Examples)

- Người mà tôi gặp ở quán cà phê là bạn cũ.

- Cô gái đang đi bộ trên đường là em gái của tôi.

- Tôi đã đến thăm thành phố Paris vào tháng 6.

- Cô ấy đã đi du lịch đến Mỹ vào năm 2010.

## Mẹo học (Tips)

- Hãy sử dụng relative clauses để bổ nghĩa cho người, vật, thời gian, địa điểm, sự việc trong câu.

- Hãy sử dụng động từ được để chỉ hành động đã xảy ra.

## Các lỗi thường gặp (Common Mistakes)

- Sử dụng relative clauses không đúng cấu trúc.

- Sử dụng động từ không đúng.

## Tóm tắt (Summary)

Relative clauses là các từ ngữ bổ nghĩa cho người, vật, thời gian, địa điểm, sự việc trong câu.

Cấu trúc chung của relative clauses là:

[Động từ được] [số và ngôi] [tính từ] [đối tượng]

Relative clauses thường được sử dụng để bổ nghĩa cho người, vật, thời gian, địa điểm, sự việc trong câu.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B1', 'Cấu trúc chung của relative clauses là gì?', 'Động từ được [số và ngôi] [tính từ] [đối tượng]', '[Động từ được] [số và ngôi] [tính từ] [đối tượng]', '[Động từ được] [tính từ] [số và ngôi] [đối tượng]', '[Động từ được] [số và ngôi] [đối tượng] [tính từ]', 'B', 'B', 'Cấu trúc chung của relative clauses là [Động từ được] [số và ngôi] [tính từ] [đối tượng].');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B1', 'Relative clauses thường được sử dụng để bổ nghĩa cho người, vật, thời gian, địa điểm, sự việc trong câu như thế nào?', 'Để chỉ người, vật cụ thể', 'Để chỉ thời gian, địa điểm, sự việc', 'Để chỉ hành động đã xảy ra', 'Để chỉ sự việc đã xảy ra', 'B', 'B', 'Relative clauses thường được sử dụng để bổ nghĩa cho thời gian, địa điểm, sự việc trong câu.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B1', 'Ví dụ về relative clauses để chỉ người, vật cụ thể là gì?', 'Người mà tôi gặp ở quán cà phê là bạn cũ.', 'Cô gái đang đi bộ trên đường là em gái của tôi.', 'Tôi đã đến thăm thành phố Paris vào tháng 6.', 'Cô ấy đã đi du lịch đến Mỹ vào năm 2010.', 'A', 'A', 'Ví dụ về relative clauses để chỉ người, vật cụ thể là ''Người mà tôi gặp ở quán cà phê là bạn cũ.''');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B1', 'Ví dụ về relative clauses để chỉ thời gian, địa điểm, sự việc là gì?', 'Người mà tôi gặp ở quán cà phê là bạn cũ.', 'Cô gái đang đi bộ trên đường là em gái của tôi.', 'Tôi đã đến thăm thành phố Paris vào tháng 6.', 'Cô ấy đã đi du lịch đến Mỹ vào năm 2010.', 'C', 'C', 'Ví dụ về relative clauses để chỉ thời gian, địa điểm, sự việc là ''Tôi đã đến thăm thành phố Paris vào tháng 6.''');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B1', 'Relative clauses thường được sử dụng để bổ nghĩa cho người, vật, thời gian, địa điểm, sự việc trong câu như thế nào?', 'Để chỉ người, vật cụ thể', 'Để chỉ thời gian, địa điểm, sự việc', 'Để chỉ hành động đã xảy ra', 'Để chỉ sự việc đã xảy ra', 'B', 'B', 'Relative clauses thường được sử dụng để bổ nghĩa cho thời gian, địa điểm, sự việc trong câu.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B1', 'Cấu trúc chung của relative clauses là gì?', '[Động từ được] [số và ngôi] [tính từ] [đối tượng]', '[Động từ được] [số và ngôi] [tính từ] [đối tượng]', '[Động từ được] [tính từ] [số và ngôi] [đối tượng]', '[Động từ được] [số và ngôi] [đối tượng] [tính từ]', 'B', 'B', 'Cấu trúc chung của relative clauses là [Động từ được] [số và ngôi] [tính từ] [đối tượng].');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B1', 'Relative clauses thường được sử dụng để bổ nghĩa cho người, vật, thời gian, địa điểm, sự việc trong câu như thế nào?', 'Để chỉ người, vật cụ thể', 'Để chỉ thời gian, địa điểm, sự việc', 'Để chỉ hành động đã xảy ra', 'Để chỉ sự việc đã xảy ra', 'B', 'B', 'Relative clauses thường được sử dụng để bổ nghĩa cho thời gian, địa điểm, sự việc trong câu.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B1', 'Ví dụ về relative clauses để chỉ người, vật cụ thể là gì?', 'Người mà tôi gặp ở quán cà phê là bạn cũ.', 'Cô gái đang đi bộ trên đường là em gái của tôi.', 'Tôi đã đến thăm thành phố Paris vào tháng 6.', 'Cô ấy đã đi du lịch đến Mỹ vào năm 2010.', 'A', 'A', 'Ví dụ về relative clauses để chỉ người, vật cụ thể là ''Người mà tôi gặp ở quán cà phê là bạn cũ.''');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B1', 'Ví dụ về relative clauses để chỉ thời gian, địa điểm, sự việc là gì?', 'Người mà tôi gặp ở quán cà phê là bạn cũ.', 'Cô gái đang đi bộ trên đường là em gái của tôi.', 'Tôi đã đến thăm thành phố Paris vào tháng 6.', 'Cô ấy đã đi du lịch đến Mỹ vào năm 2010.', 'C', 'C', 'Ví dụ về relative clauses để chỉ thời gian, địa điểm, sự việc là ''Tôi đã đến thăm thành phố Paris vào tháng 6.''');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B1', 'Relative clauses thường được sử dụng để bổ nghĩa cho người, vật, thời gian, địa điểm, sự việc trong câu như thế nào?', 'Để chỉ người, vật cụ thể', 'Để chỉ thời gian, địa điểm, sự việc', 'Để chỉ hành động đã xảy ra', 'Để chỉ sự việc đã xảy ra', 'B', 'B', 'Relative clauses thường được sử dụng để bổ nghĩa cho thời gian, địa điểm, sự việc trong câu.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'First và Second Conditional', 'B1', '### Cấu trúc/Công thức
First Conditional: If + hiện tại đơn (present simple) + sẽ + hiện tại đơn (present simple)
Second Conditional: If + quá khứ đơn (past simple) + sẽ + quá khứ đơn (past simple)

### Cách dùng
- First Conditional: Sử dụng để nói về những việc sẽ xảy ra trong tương lai nếu điều kiện được đáp ứng.
- Second Conditional: Sử dụng để nói về những việc sẽ xảy ra trong tương lai nếu điều kiện không thể xảy ra.

### Ví dụ minh họa
- First Conditional:
 + Nếu tôi học tập chăm chỉ, tôi sẽ thành công trong tương lai.
 + Nếu tôi ăn uống lành mạnh, tôi sẽ khỏe mạnh.
- Second Conditional:
 + Nếu tôi có thể bay lên trời, tôi sẽ thấy thế giới từ trên cao.
 + Nếu tôi có thể nói được nhiều ngôn ngữ, tôi sẽ có nhiều cơ hội hơn.

### Mẹo học
- Hãy sử dụng First Conditional khi nói về những việc sẽ xảy ra trong tương lai nếu điều kiện được đáp ứng.
- Hãy sử dụng Second Conditional khi nói về những việc sẽ xảy ra trong tương lai nếu điều kiện không thể xảy ra.

### Các lỗi thường gặp
- Sử dụng First Conditional khi nói về những việc không thể xảy ra trong tương lai.
- Sử dụng Second Conditional khi nói về những việc có thể xảy ra trong tương lai.

### Tóm tắt
- First Conditional: If + hiện tại đơn + sẽ + hiện tại đơn
- Second Conditional: If + quá khứ đơn + sẽ + quá khứ đơn
- Sử dụng First Conditional khi nói về những việc sẽ xảy ra trong tương lai nếu điều kiện được đáp ứng.
- Sử dụng Second Conditional khi nói về những việc sẽ xảy ra trong tương lai nếu điều kiện không thể xảy ra.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'First và Second Conditional' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B1', 'Nếu tôi học tập chăm chỉ, tôi sẽ thành công trong tương lai.', 'First Conditional', 'Second Conditional', 'Present Perfect', 'Future Perfect', 'A', 'A', 'Câu trên sử dụng First Conditional vì nó nói về việc sẽ xảy ra trong tương lai nếu điều kiện được đáp ứng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'First và Second Conditional' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B1', 'Nếu tôi có thể bay lên trời, tôi sẽ thấy thế giới từ trên cao.', 'First Conditional', 'Second Conditional', 'Present Perfect', 'Future Perfect', 'B', 'B', 'Câu trên sử dụng Second Conditional vì nó nói về việc sẽ xảy ra trong tương lai nếu điều kiện không thể xảy ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'First và Second Conditional' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B1', 'Tôi sẽ học tập chăm chỉ nếu tôi muốn thành công.', 'First Conditional', 'Second Conditional', 'Present Perfect', 'Future Perfect', 'A', 'A', 'Câu trên sử dụng First Conditional vì nó nói về việc sẽ xảy ra trong tương lai nếu điều kiện được đáp ứng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'First và Second Conditional' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B1', 'Nếu tôi có thể nói được nhiều ngôn ngữ, tôi sẽ có nhiều cơ hội hơn.', 'First Conditional', 'Second Conditional', 'Present Perfect', 'Future Perfect', 'B', 'B', 'Câu trên sử dụng Second Conditional vì nó nói về việc sẽ xảy ra trong tương lai nếu điều kiện không thể xảy ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'First và Second Conditional' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B1', 'Tôi sẽ thành công nếu tôi học tập chăm chỉ.', 'First Conditional', 'Second Conditional', 'Present Perfect', 'Future Perfect', 'A', 'A', 'Câu trên sử dụng First Conditional vì nó nói về việc sẽ xảy ra trong tương lai nếu điều kiện được đáp ứng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'First và Second Conditional' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B1', 'Nếu tôi có thể bay lên trời, tôi sẽ thấy thế giới từ trên cao.', 'First Conditional', 'Second Conditional', 'Present Perfect', 'Future Perfect', 'B', 'B', 'Câu trên sử dụng Second Conditional vì nó nói về việc sẽ xảy ra trong tương lai nếu điều kiện không thể xảy ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'First và Second Conditional' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B1', 'Tôi sẽ học tập chăm chỉ nếu tôi muốn thành công.', 'First Conditional', 'Second Conditional', 'Present Perfect', 'Future Perfect', 'A', 'A', 'Câu trên sử dụng First Conditional vì nó nói về việc sẽ xảy ra trong tương lai nếu điều kiện được đáp ứng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'First và Second Conditional' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B1', 'Nếu tôi có thể nói được nhiều ngôn ngữ, tôi sẽ có nhiều cơ hội hơn.', 'First Conditional', 'Second Conditional', 'Present Perfect', 'Future Perfect', 'B', 'B', 'Câu trên sử dụng Second Conditional vì nó nói về việc sẽ xảy ra trong tương lai nếu điều kiện không thể xảy ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'First và Second Conditional' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B1', 'Tôi sẽ thành công nếu tôi học tập chăm chỉ.', 'First Conditional', 'Second Conditional', 'Present Perfect', 'Future Perfect', 'A', 'A', 'Câu trên sử dụng First Conditional vì nó nói về việc sẽ xảy ra trong tương lai nếu điều kiện được đáp ứng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'First và Second Conditional' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B1', 'Nếu tôi có thể bay lên trời, tôi sẽ thấy thế giới từ trên cao.', 'First Conditional', 'Second Conditional', 'Present Perfect', 'Future Perfect', 'B', 'B', 'Câu trên sử dụng Second Conditional vì nó nói về việc sẽ xảy ra trong tương lai nếu điều kiện không thể xảy ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'First và Second Conditional' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'B1', 'Tôi sẽ học tập chăm chỉ nếu tôi muốn thành công.', 'First Conditional', 'Second Conditional', 'Present Perfect', 'Future Perfect', 'A', 'A', 'Câu trên sử dụng First Conditional vì nó nói về việc sẽ xảy ra trong tương lai nếu điều kiện được đáp ứng.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Modal Verbs of Obligation & Advice', 'B1', '### Cấu trúc/Công thức (Formula)
Modal verbs của nghĩa vụ và lời khuyên thường được sử dụng trong các cấu trúc sau:
- *must* + động từ (phải làm gì)
- *should* + động từ (nên làm gì)
- *ought to* + động từ (cần phải làm gì)
- *had better* + động từ (nên làm gì)
- *need to* + động từ (phải làm gì)

### Cách dùng (Usage)
- *Must* thường được sử dụng để thể hiện một nghĩa vụ hoặc một điều kiện bắt buộc.
- *Should* thường được sử dụng để thể hiện một lời khuyên hoặc một ý kiến.
- *Ought to* thường được sử dụng để thể hiện một điều cần phải làm.
- *Had better* thường được sử dụng để thể hiện một lời khuyên hoặc một ý kiến.
- *Need to* thường được sử dụng để thể hiện một nghĩa vụ hoặc một điều kiện bắt buộc.

### Ví dụ minh họa (Examples)
- Tôi *must* đi học vào sáng nay. (Tôi phải đi học vào sáng nay)
- Bạn *should* ăn uống cân đối để có sức khỏe tốt. (Bạn nên ăn uống cân đối để có sức khỏe tốt)
- Anh ấy *ought to* nghỉ ngơi nhiều hơn. (Anh ấy cần phải nghỉ ngơi nhiều hơn)
- Bạn *had better* không đi ra ngoài vào thời tiết này. (Bạn nên không đi ra ngoài vào thời tiết này)
- Tôi *need to* hoàn thành dự án này trước thời hạn. (Tôi phải hoàn thành dự án này trước thời hạn)

### Mẹo học (Tips)
- Hãy sử dụng các modal verbs một cách phù hợp với ngữ cảnh.
- Hãy nhớ rằng *must* và *need to* thường được sử dụng để thể hiện một nghĩa vụ hoặc một điều kiện bắt buộc.

### Các lỗi thường gặp (Common Mistakes)
- Sử dụng *must* và *need to* một cách không phù hợp.
- Sử dụng *should* và *ought to* một cách không phù hợp.

### Tóm tắt (Summary)
- Modal verbs của nghĩa vụ và lời khuyên thường được sử dụng trong các cấu trúc *must*, *should*, *ought to*, *had better*, và *need to*.
- Hãy sử dụng các modal verbs một cách phù hợp với ngữ cảnh.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modal Verbs of Obligation & Advice' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B1', 'Cấu trúc nào dưới đây không đúng?', '*Must* + động từ', '*Should* + động từ', '*Ought to* + động từ', '*Had better* + động từ + *to*', 'D', 'D', 'Cấu trúc *Had better* + động từ không cần phải có *to*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modal Verbs of Obligation & Advice' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B1', 'Lời khuyên nào dưới đây đúng?', 'Bạn *must* ăn uống cân đối.', 'Bạn *should* ăn uống cân đối.', 'Bạn *ought to* ăn uống cân đối.', 'Bạn *had better* không ăn uống cân đối.', 'B', 'B', 'Lời khuyên đúng là *should* + động từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modal Verbs of Obligation & Advice' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B1', 'Ngĩa vụ nào dưới đây đúng?', 'Tôi *should* đi học vào sáng nay.', 'Tôi *must* đi học vào sáng nay.', 'Tôi *ought to* đi học vào sáng nay.', 'Tôi *had better* không đi học vào sáng nay.', 'B', 'B', 'Ngĩa vụ đúng là *must* + động từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modal Verbs of Obligation & Advice' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây đúng?', 'Anh ấy *had better* nghỉ ngơi nhiều hơn.', 'Anh ấy *should* nghỉ ngơi nhiều hơn.', 'Anh ấy *ought to* nghỉ ngơi nhiều hơn.', 'Anh ấy *must* nghỉ ngơi nhiều hơn.', 'A', 'A', 'Câu đúng là *had better* + động từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modal Verbs of Obligation & Advice' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B1', 'Cấu trúc nào dưới đây không đúng?', '*Need to* + động từ', '*Should* + động từ', '*Ought to* + động từ', '*Had better* + động từ', 'B', 'B', 'Cấu trúc *Should* + động từ không đúng khi thể hiện một nghĩa vụ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modal Verbs of Obligation & Advice' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B1', 'Lời khuyên nào dưới đây đúng?', 'Bạn *must* ăn uống cân đối.', 'Bạn *should* ăn uống cân đối.', 'Bạn *ought to* ăn uống cân đối.', 'Bạn *had better* không ăn uống cân đối.', 'B', 'B', 'Lời khuyên đúng là *should* + động từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modal Verbs of Obligation & Advice' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B1', 'Ngĩa vụ nào dưới đây đúng?', 'Tôi *should* đi học vào sáng nay.', 'Tôi *must* đi học vào sáng nay.', 'Tôi *ought to* đi học vào sáng nay.', 'Tôi *had better* không đi học vào sáng nay.', 'B', 'B', 'Ngĩa vụ đúng là *must* + động từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modal Verbs of Obligation & Advice' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây đúng?', 'Anh ấy *had better* nghỉ ngơi nhiều hơn.', 'Anh ấy *should* nghỉ ngơi nhiều hơn.', 'Anh ấy *ought to* nghỉ ngơi nhiều hơn.', 'Anh ấy *must* nghỉ ngơi nhiều hơn.', 'A', 'A', 'Câu đúng là *had better* + động từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modal Verbs of Obligation & Advice' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B1', 'Cấu trúc nào dưới đây không đúng?', '*Need to* + động từ', '*Should* + động từ', '*Ought to* + động từ', '*Had better* + động từ', 'B', 'B', 'Cấu trúc *Should* + động từ không đúng khi thể hiện một nghĩa vụ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modal Verbs of Obligation & Advice' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B1', 'Lời khuyên nào dưới đây đúng?', 'Bạn *must* ăn uống cân đối.', 'Bạn *should* ăn uống cân đối.', 'Bạn *ought to* ăn uống cân đối.', 'Bạn *had better* không ăn uống cân đối.', 'B', 'B', 'Lời khuyên đúng là *should* + động từ.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Báo cáo lại lời nói (Câu khẳng định cơ bản)', 'B1', '### Cấu trúc/Công thức
   Câu khẳng định cơ bản được báo cáo lại bằng cách sử dụng các động từ báo cáo như *say*, *tell*, *ask*, *ask*...

   ### Cách dùng
   - Sử dụng để báo cáo lại lời nói của người khác.
   - Câu khẳng định cơ bản được báo cáo lại bằng cách sử dụng các động từ báo cáo như *say*, *tell*, *ask*, *ask*...

   ### Ví dụ minh họa
   - John said (that) he was tired.
   - She told me (that) she was going to the store.
   - He asked me (if) I wanted to go to the movies.

   ### Mẹo học
   - Hãy nhớ rằng các động từ báo cáo như *say*, *tell*, *ask*... được sử dụng để báo cáo lại lời nói của người khác.
   - Hãy sử dụng các động từ báo cáo đúng để báo cáo lại lời nói của người khác.

   ### Các lỗi thường gặp
   - Sử dụng các động từ báo cáo không đúng để báo cáo lại lời nói của người khác.
   - Không sử dụng các động từ báo cáo để báo cáo lại lời nói của người khác.

   ### Tóm tắt
   - Câu khẳng định cơ bản được báo cáo lại bằng cách sử dụng các động từ báo cáo như *say*, *tell*, *ask*, *ask*...
   - Sử dụng các động từ báo cáo đúng để báo cáo lại lời nói của người khác.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Câu khẳng định cơ bản)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây được báo cáo lại bằng cách sử dụng động từ *say*?', 'John told me (that) he was tired.', 'John said (that) he was tired.', 'John asked me (if) I wanted to go to the movies.', 'John asked me (what) time it was.', 'B', 'B', 'Câu *John said (that) he was tired.* được báo cáo lại bằng cách sử dụng động từ *say*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Câu khẳng định cơ bản)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây được báo cáo lại bằng cách sử dụng động từ *tell*?', 'She said (that) she was going to the store.', 'She told me (that) she was going to the store.', 'She asked me (if) I wanted to go to the movies.', 'She asked me (what) time it was.', 'B', 'B', 'Câu *She told me (that) she was going to the store.* được báo cáo lại bằng cách sử dụng động từ *tell*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Câu khẳng định cơ bản)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây được báo cáo lại bằng cách sử dụng động từ *ask*?', 'He said (that) he was tired.', 'He told me (that) he was going to the store.', 'He asked me (if) I wanted to go to the movies.', 'He asked me (what) time it was.', 'C', 'C', 'Câu *He asked me (if) I wanted to go to the movies.* được báo cáo lại bằng cách sử dụng động từ *ask*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Câu khẳng định cơ bản)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây không được báo cáo lại bằng cách sử dụng động từ *say*?', 'John said (that) he was tired.', 'John told me (that) he was tired.', 'John asked me (if) I wanted to go to the movies.', 'John asked me (what) time it was.', 'B', 'B', 'Câu *John told me (that) he was tired.* không được báo cáo lại bằng cách sử dụng động từ *say*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Câu khẳng định cơ bản)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây được báo cáo lại bằng cách sử dụng động từ *ask*?', 'She said (that) she was going to the store.', 'She told me (that) she was going to the store.', 'She asked me (if) I wanted to go to the movies.', 'She asked me (what) time it was.', 'C', 'C', 'Câu *She asked me (if) I wanted to go to the movies.* được báo cáo lại bằng cách sử dụng động từ *ask*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Câu khẳng định cơ bản)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây không được báo cáo lại bằng cách sử dụng động từ *tell*?', 'She said (that) she was going to the store.', 'She told me (that) she was going to the store.', 'She asked me (if) I wanted to go to the movies.', 'She asked me (what) time it was.', 'A', 'A', 'Câu *She said (that) she was going to the store.* không được báo cáo lại bằng cách sử dụng động từ *tell*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Câu khẳng định cơ bản)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây được báo cáo lại bằng cách sử dụng động từ *say*?', 'He told me (that) he was going to the store.', 'He said (that) he was tired.', 'He asked me (if) I wanted to go to the movies.', 'He asked me (what) time it was.', 'B', 'B', 'Câu *He said (that) he was tired.* được báo cáo lại bằng cách sử dụng động từ *say*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Câu khẳng định cơ bản)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây không được báo cáo lại bằng cách sử dụng động từ *ask*?', 'She said (that) she was going to the store.', 'She told me (that) she was going to the store.', 'She asked me (if) I wanted to go to the movies.', 'She asked me (what) time it was.', 'B', 'B', 'Câu *She told me (that) she was going to the store.* không được báo cáo lại bằng cách sử dụng động từ *ask*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Câu khẳng định cơ bản)' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây được báo cáo lại bằng cách sử dụng động từ *tell*?', 'John said (that) he was tired.', 'John told me (that) he was tired.', 'John asked me (if) I wanted to go to the movies.', 'John asked me (what) time it was.', 'B', 'B', 'Câu *John told me (that) he was tired.* được báo cáo lại bằng cách sử dụng động từ *tell*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Câu khẳng định cơ bản)' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây không được báo cáo lại bằng cách sử dụng động từ *say*?', 'She told me (that) she was going to the store.', 'She said (that) she was going to the store.', 'She asked me (if) I wanted to go to the movies.', 'She asked me (what) time it was.', 'B', 'B', 'Câu *She said (that) she was going to the store.* không được báo cáo lại bằng cách sử dụng động từ *say*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Câu khẳng định cơ bản)' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'B1', 'Câu nào dưới đây được báo cáo lại bằng cách sử dụng động từ *ask*?', 'He said (that) he was tired.', 'He told me (that) he was going to the store.', 'He asked me (if) I wanted to go to the movies.', 'He asked me (what) time it was.', 'C', 'C', 'Câu *He asked me (if) I wanted to go to the movies.* được báo cáo lại bằng cách sử dụng động từ *ask*.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Used to / Would', 'B1', '### Cấu trúc/Công thức (Formula)
Used to và Would thường được sử dụng để nói về hành vi hoặc tình huống trong quá khứ.

- Used to: được sử dụng để nói về hành vi hoặc tình huống trong quá khứ, thường được lặp lại nhiều lần.
- Would: được sử dụng để nói về hành vi hoặc tình huống trong quá khứ, thường được sử dụng để thể hiện ý định hoặc dự định.

### Cách dùng (Usage)
- Used to: thường được sử dụng để nói về hành vi hoặc tình huống trong quá khứ, thường được lặp lại nhiều lần.
- Would: thường được sử dụng để nói về hành vi hoặc tình huống trong quá khứ, thường được sử dụng để thể hiện ý định hoặc dự định.

### Ví dụ minh họa (Examples)
- Used to: Tôi thường ăn sáng ở nhà. (Tôi thường ăn sáng ở nhà trong quá khứ.)
- Would: Tôi sẽ đi du lịch vào tháng 8. (Tôi dự định đi du lịch vào tháng 8.)

### Mẹo học (Tips)
- Sử dụng Used to để nói về hành vi hoặc tình huống trong quá khứ, thường được lặp lại nhiều lần.
- Sử dụng Would để nói về hành vi hoặc tình huống trong quá khứ, thường được sử dụng để thể hiện ý định hoặc dự định.

### Các lỗi thường gặp (Common Mistakes)
- Sử dụng Would thay vì Used to trong một số trường hợp.
- Sử dụng Used to thay vì Would trong một số trường hợp.

### Tóm tắt (Summary)
- Used to và Would thường được sử dụng để nói về hành vi hoặc tình huống trong quá khứ.
- Sử dụng Used to để nói về hành vi hoặc tình huống trong quá khứ, thường được lặp lại nhiều lần.
- Sử dụng Would để nói về hành vi hoặc tình huống trong quá khứ, thường được sử dụng để thể hiện ý định hoặc dự định.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Used to / Would' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B1', 'Cấu trúc của Used to là gì?', 'Tôi thường ăn sáng ở nhà.', 'Tôi sẽ ăn sáng ở nhà.', 'Tôi ăn sáng ở nhà.', 'Tôi đã ăn sáng ở nhà.', 'A', 'A', 'Cấu trúc của Used to là: Tôi thường/hay/từng + động từ + ở + vị trí.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Used to / Would' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B1', 'Cấu trúc của Would là gì?', 'Tôi sẽ ăn sáng ở nhà.', 'Tôi thường ăn sáng ở nhà.', 'Tôi ăn sáng ở nhà.', 'Tôi đã ăn sáng ở nhà.', 'A', 'A', 'Cấu trúc của Would là: Tôi sẽ/hay/từng + động từ + ở + vị trí.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Used to / Would' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B1', 'Sử dụng Used to để nói về hành vi hoặc tình huống trong quá khứ, thường được lặp lại nhiều lần.', 'Tôi sẽ ăn sáng ở nhà.', 'Tôi thường ăn sáng ở nhà.', 'Tôi ăn sáng ở nhà.', 'Tôi đã ăn sáng ở nhà.', 'B', 'B', 'Sử dụng Used to để nói về hành vi hoặc tình huống trong quá khứ, thường được lặp lại nhiều lần.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Used to / Would' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B1', 'Sử dụng Would để nói về hành vi hoặc tình huống trong quá khứ, thường được sử dụng để thể hiện ý định hoặc dự định.', 'Tôi sẽ ăn sáng ở nhà.', 'Tôi thường ăn sáng ở nhà.', 'Tôi ăn sáng ở nhà.', 'Tôi đã ăn sáng ở nhà.', 'A', 'A', 'Sử dụng Would để nói về hành vi hoặc tình huống trong quá khứ, thường được sử dụng để thể hiện ý định hoặc dự định.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Used to / Would' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B1', 'Câu sau là đúng hay sai?', 'Tôi thường ăn sáng ở nhà.', 'Tôi sẽ ăn sáng ở nhà.', 'Tôi ăn sáng ở nhà.', 'Tất cả đều đúng.', 'A', 'A', 'Câu "Tôi thường ăn sáng ở nhà." là đúng vì nó sử dụng Used to để nói về hành vi hoặc tình huống trong quá khứ, thường được lặp lại nhiều lần.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Used to / Would' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B1', 'Câu sau là đúng hay sai?', 'Tôi sẽ ăn sáng ở nhà.', 'Tôi thường ăn sáng ở nhà.', 'Tôi ăn sáng ở nhà.', 'Tất cả đều sai.', 'A', 'A', 'Câu "Tôi sẽ ăn sáng ở nhà." là đúng vì nó sử dụng Would để nói về hành vi hoặc tình huống trong quá khứ, thường được sử dụng để thể hiện ý định hoặc dự định.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Used to / Would' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B1', 'Câu sau là đúng hay sai?', 'Tôi ăn sáng ở nhà.', 'Tôi thường ăn sáng ở nhà.', 'Tôi sẽ ăn sáng ở nhà.', 'Tất cả đều sai.', 'B', 'B', 'Câu "Tôi thường ăn sáng ở nhà." là đúng vì nó sử dụng Used to để nói về hành vi hoặc tình huống trong quá khứ, thường được lặp lại nhiều lần.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Used to / Would' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B1', 'Câu sau là đúng hay sai?', 'Tôi sẽ ăn sáng ở nhà.', 'Tôi thường ăn sáng ở nhà.', 'Tôi ăn sáng ở nhà.', 'Tất cả đều sai.', 'A', 'A', 'Câu "Tôi sẽ ăn sáng ở nhà." là đúng vì nó sử dụng Would để nói về hành vi hoặc tình huống trong quá khứ, thường được sử dụng để thể hiện ý định hoặc dự định.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Used to / Would' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B1', 'Câu sau là đúng hay sai?', 'Tôi thường ăn sáng ở nhà.', 'Tôi sẽ ăn sáng ở nhà.', 'Tôi ăn sáng ở nhà.', 'Tất cả đều sai.', 'A', 'A', 'Câu "Tôi thường ăn sáng ở nhà." là đúng vì nó sử dụng Used to để nói về hành vi hoặc tình huống trong quá khứ, thường được lặp lại nhiều lần.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Used to / Would' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B1', 'Câu sau là đúng hay sai?', 'Tôi sẽ ăn sáng ở nhà.', 'Tôi thường ăn sáng ở nhà.', 'Tôi ăn sáng ở nhà.', 'Tất cả đều sai.', 'A', 'A', 'Câu "Tôi sẽ ăn sáng ở nhà." là đúng vì nó sử dụng Would để nói về hành vi hoặc tình huống trong quá khứ, thường được sử dụng để thể hiện ý định hoặc dự định.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Used to / Would' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'B1', 'Câu sau là đúng hay sai?', 'Tôi thường ăn sáng ở nhà.', 'Tôi sẽ ăn sáng ở nhà.', 'Tôi ăn sáng ở nhà.', 'Tất cả đều sai.', 'A', 'A', 'Câu "Tôi thường ăn sáng ở nhà." là đúng vì nó sử dụng Used to để nói về hành vi hoặc tình huống trong quá khứ, thường được lặp lại nhiều lần.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Conjunctions of Contrast', 'B1', '### Cấu trúc/Công thức (Formula)
Conjunctions of contrast là các từ nối chỉ sự khác biệt giữa hai hoặc nhiều ý tưởng, sự kiện, đặc điểm.

### Cách dùng (Usage)
- Sử dụng để chỉ sự khác biệt giữa hai hoặc nhiều ý tưởng, sự kiện, đặc điểm.
- Có thể sử dụng để so sánh, đối chiếu giữa hai hoặc nhiều ý tưởng, sự kiện, đặc điểm.

### Ví dụ minh họa (Examples)
- Tôi thích cà phê, nhưng tôi không thích trà.
- Tôi muốn đi du lịch, nhưng tôi không có tiền.
- Cô ấy là một người thông minh, nhưng cô ấy không biết cách lái xe.

### Mẹo học (Tips)
- Hãy sử dụng các từ nối của sự khác biệt để thể hiện sự khác biệt giữa hai hoặc nhiều ý tưởng, sự kiện, đặc điểm.
- Hãy sử dụng các từ nối của sự khác biệt để so sánh, đối chiếu giữa hai hoặc nhiều ý tưởng, sự kiện, đặc điểm.

### Các lỗi thường gặp (Common Mistakes)
- Sử dụng các từ nối của sự khác biệt sai cách.
- Không sử dụng các từ nối của sự khác biệt đúng cách.

### Tóm tắt (Summary)
Conjunctions of contrast là các từ nối chỉ sự khác biệt giữa hai hoặc nhiều ý tưởng, sự kiện, đặc điểm. Chúng được sử dụng để thể hiện sự khác biệt giữa hai hoặc nhiều ý tưởng, sự kiện, đặc điểm và để so sánh, đối chiếu giữa hai hoặc nhiều ý tưởng, sự kiện, đặc điểm.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions of Contrast' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B1', 'Câu sau sử dụng từ nối của sự khác biệt?', 'Tôi thích cà phê.', 'Tôi thích cà phê, nhưng tôi không thích trà.', 'Tôi không thích cà phê.', 'Tôi thích cà phê và trà.', 'B', 'B', 'Câu sau sử dụng từ nối của sự khác biệt ''nhưng'' để chỉ sự khác biệt giữa hai ý tưởng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions of Contrast' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B1', 'Từ nối của sự khác biệt sau chỉ sự khác biệt giữa hai ý tưởng?', 'và', 'nhưng', 'hoặc', 'mặc dù', 'B', 'B', 'Từ nối của sự khác biệt ''nhưng'' chỉ sự khác biệt giữa hai ý tưởng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions of Contrast' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B1', 'Câu sau sử dụng từ nối của sự khác biệt để so sánh, đối chiếu giữa hai ý tưởng?', 'Tôi thích cà phê, nhưng tôi không thích trà.', 'Tôi thích cà phê và trà.', 'Tôi thích cà phê hơn trà.', 'Tôi thích cà phê và không thích trà.', 'C', 'C', 'Câu sau sử dụng từ nối của sự khác biệt để so sánh, đối chiếu giữa hai ý tưởng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions of Contrast' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B1', 'Từ nối của sự khác biệt sau chỉ sự khác biệt giữa nhiều ý tưởng?', 'và', 'nhưng', 'hoặc', 'mặc dù', 'C', 'C', 'Từ nối của sự khác biệt ''hoặc'' chỉ sự khác biệt giữa nhiều ý tưởng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions of Contrast' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B1', 'Câu sau sử dụng từ nối của sự khác biệt để thể hiện sự khác biệt giữa nhiều ý tưởng?', 'Tôi thích cà phê, trà và sữa.', 'Tôi thích cà phê, nhưng tôi không thích trà.', 'Tôi thích cà phê hơn trà và sữa.', 'Tôi thích cà phê và trà, nhưng không thích sữa.', 'A', 'A', 'Câu sau sử dụng từ nối của sự khác biệt để thể hiện sự khác biệt giữa nhiều ý tưởng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions of Contrast' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B1', 'Từ nối của sự khác biệt sau chỉ sự khác biệt giữa ý tưởng và sự kiện?', 'và', 'nhưng', 'hoặc', 'mặc dù', 'B', 'B', 'Từ nối của sự khác biệt ''nhưng'' chỉ sự khác biệt giữa ý tưởng và sự kiện.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions of Contrast' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B1', 'Câu sau sử dụng từ nối của sự khác biệt để chỉ sự khác biệt giữa ý tưởng và sự kiện?', 'Tôi thích cà phê, nhưng tôi không thích đi du lịch.', 'Tôi thích cà phê và đi du lịch.', 'Tôi thích cà phê hơn đi du lịch.', 'Tôi thích cà phê và không thích đi du lịch.', 'A', 'A', 'Câu sau sử dụng từ nối của sự khác biệt để chỉ sự khác biệt giữa ý tưởng và sự kiện.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions of Contrast' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B1', 'Từ nối của sự khác biệt sau chỉ sự khác biệt giữa đặc điểm?', 'và', 'nhưng', 'hoặc', 'mặc dù', 'B', 'B', 'Từ nối của sự khác biệt ''nhưng'' chỉ sự khác biệt giữa đặc điểm.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions of Contrast' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B1', 'Câu sau sử dụng từ nối của sự khác biệt để chỉ sự khác biệt giữa đặc điểm?', 'Cô ấy là một người thông minh, nhưng cô ấy không biết cách lái xe.', 'Cô ấy là một người thông minh và biết cách lái xe.', 'Cô ấy là một người thông minh hơn người khác.', 'Cô ấy là một người thông minh và không biết cách lái xe.', 'A', 'A', 'Câu sau sử dụng từ nối của sự khác biệt để chỉ sự khác biệt giữa đặc điểm.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions of Contrast' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B1', 'Từ nối của sự khác biệt sau chỉ sự khác biệt giữa nhiều đặc điểm?', 'và', 'nhưng', 'hoặc', 'mặc dù', 'C', 'C', 'Từ nối của sự khác biệt ''hoặc'' chỉ sự khác biệt giữa nhiều đặc điểm.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions of Contrast' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'B1', 'Câu sau sử dụng từ nối của sự khác biệt để chỉ sự khác biệt giữa nhiều đặc điểm?', 'Cô ấy là một người thông minh, biết cách lái xe và có nhiều kinh nghiệm.', 'Cô ấy là một người thông minh, nhưng cô ấy không biết cách lái xe.', 'Cô ấy là một người thông minh hơn người khác, biết cách lái xe và có nhiều kinh nghiệm.', 'Cô ấy là một người thông minh và không biết cách lái xe, nhưng cô ấy có nhiều kinh nghiệm.', 'A', 'A', 'Câu sau sử dụng từ nối của sự khác biệt để chỉ sự khác biệt giữa nhiều đặc điểm.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Gerunds and Infinitives after specific verbs', 'B1', '### Cấu trúc/Công thức (Formula)
Sau các động từ sau, thường sử dụng gerunds (vần -ing) hoặc infinitives (vần to + động từ):

- **Like**: thích, yêu thích
- **Love**: yêu thích
- **Hate**: ghét
- **Enjoy**: thích
- **Stop**: ngừng
- **Continue**: tiếp tục
- **Finish**: kết thúc
- **Begin**: bắt đầu
- **Go on**: tiếp tục
- **Start**: bắt đầu
- **Try**: thử
- **Avoid**: tránh
- **Forget**: quên
- **Remember**: nhớ
- **Regret**: hối hận
- **Mind**: quan tâm
- **Suggest**: đề xuất
- **Recommend**: khuyến nghị
- **Advise**: khuyên
- **Ask**: hỏi
- **Invite**: mời
- **Request**: yêu cầu
- **Demand**: đòi hỏi
- **Order**: yêu cầu
- **Forbid**: cấm
- **Prohibit**: cấm
- **Allow**: cho phép
- **Permit**: cho phép
- **Require**: yêu cầu
- **Need**: cần
- **Want**: muốn
- **Hope**: hy vọng
- **Expect**: mong đợi
- **Fear**: sợ
- **Dread**: sợ hãi
- **Avoid**: tránh
- **Prefer**: thích hơn
- **Like better**: thích hơn
- **Love better**: yêu thích hơn
- **Hate better**: ghét hơn
- **Enjoy better**: thích hơn
- **Stop doing**: ngừng làm
- **Continue doing**: tiếp tục làm
- **Finish doing**: kết thúc việc làm
- **Begin doing**: bắt đầu làm
- **Go on doing**: tiếp tục làm
- **Start doing**: bắt đầu làm
- **Try doing**: thử làm
- **Avoid doing**: tránh làm
- **Forget doing**: quên việc làm
- **Remember doing**: nhớ việc làm
- **Regret doing**: hối hận vì việc làm
- **Mind doing**: quan tâm đến việc làm
- **Suggest doing**: đề xuất việc làm
- **Recommend doing**: khuyến nghị việc làm
- **Advise doing**: khuyên việc làm
- **Ask to do**: hỏi việc làm
- **Invite to do**: mời việc làm
- **Request to do**: yêu cầu việc làm
- **Demand to do**: đòi hỏi việc làm
- **Order to do**: yêu cầu việc làm
- **Forbid to do**: cấm việc làm
- **Prohibit to do**: cấm việc làm
- **Allow to do**: cho phép việc làm
- **Permit to do**: cho phép việc làm
- **Require to do**: yêu cầu việc làm
- **Need to do**: cần việc làm
- **Want to do**: muốn việc làm
- **Hope to do**: hy vọng việc làm
- **Expect to do**: mong đợi việc làm
- **Fear to do**: sợ việc làm
- **Dread to do**: sợ hãi việc làm
- **Avoid to do**: tránh việc làm
- **Prefer to do**: thích hơn việc làm
- **Like better to do**: thích hơn việc làm
- **Love better to do**: yêu thích hơn việc làm
- **Hate better to do**: ghét hơn việc làm
- **Enjoy better to do**: thích hơn việc làm

### Cách dùng (Usage)
- Sau các động từ trên, thường sử dụng gerunds (vần -ing) để chỉ hành động đang diễn ra hoặc đã diễn ra.
- Sau các động từ trên, thường sử dụng infinitives (vần to + động từ) để chỉ hành động sẽ diễn ra hoặc có thể diễn ra.

### Ví dụ minh họa (Examples)
- Tôi thích đọc sách. (gerund)
- Tôi thích đọc sách. (infinitive)
- Tôi yêu thích đọc sách. (gerund)
- Tôi yêu thích đọc sách. (infinitive)
- Tôi ghét làm việc này. (gerund)
- Tôi ghét làm việc này. (infinitive)

### Mẹo học (Tips)
- Hãy nhớ rằng sau các động từ trên, thường sử dụng gerunds (vần -ing) hoặc infinitives (vần to + động từ).
- Hãy kiểm tra ngữ cảnh để xác định sử dụng gerunds (vần -ing) hoặc infinitives (vần to + động từ).

### Các lỗi thường gặp (Common Mistakes)
- Sử dụng gerunds (vần -ing) sai trong ngữ cảnh.
- Sử dụng infinitives (vần to + động từ) sai trong ngữ cảnh.

### Tóm tắt (Summary)
- Sau các động từ trên, thường sử dụng gerunds (vần -ing) hoặc infinitives (vần to + động từ).
- Hãy kiểm tra ngữ cảnh để xác định sử dụng gerunds (vần -ing) hoặc infinitives (vần to + động từ).', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds and Infinitives after specific verbs' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B1', 'Động từ nào sau đây thường sử dụng gerunds (vần -ing)?', 'Like', 'Love', 'Hate', 'Enjoy', 'A', 'A', 'Động từ Like thường sử dụng gerunds (vần -ing) để chỉ hành động đang diễn ra hoặc đã diễn ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds and Infinitives after specific verbs' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B1', 'Động từ nào sau đây thường sử dụng infinitives (vần to + động từ)?', 'Like', 'Love', 'Hate', 'Enjoy', 'B', 'B', 'Động từ Love thường sử dụng infinitives (vần to + động từ) để chỉ hành động sẽ diễn ra hoặc có thể diễn ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds and Infinitives after specific verbs' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B1', 'Hành động nào sau đây thường sử dụng gerunds (vần -ing)?', 'Hành động đang diễn ra', 'Hành động đã diễn ra', 'Hành động sẽ diễn ra', 'Hành động có thể diễn ra', 'B', 'B', 'Hành động đã diễn ra thường sử dụng gerunds (vần -ing).');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds and Infinitives after specific verbs' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B1', 'Động từ nào sau đây thường sử dụng infinitives (vần to + động từ)?', 'Like', 'Love', 'Hate', 'Enjoy', 'C', 'C', 'Động từ Hate thường sử dụng infinitives (vần to + động từ) để chỉ hành động sẽ diễn ra hoặc có thể diễn ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds and Infinitives after specific verbs' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B1', 'Hành động nào sau đây thường sử dụng infinitives (vần to + động từ)?', 'Hành động đang diễn ra', 'Hành động đã diễn ra', 'Hành động sẽ diễn ra', 'Hành động có thể diễn ra', 'C', 'C', 'Hành động sẽ diễn ra thường sử dụng infinitives (vần to + động từ).');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds and Infinitives after specific verbs' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B1', 'Động từ nào sau đây thường sử dụng gerunds (vần -ing) và infinitives (vần to + động từ)?', 'Like', 'Love', 'Hate', 'Enjoy', 'D', 'D', 'Động từ Enjoy thường sử dụng gerunds (vần -ing) và infinitives (vần to + động từ).');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds and Infinitives after specific verbs' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B1', 'Hành động nào sau đây thường sử dụng gerunds (vần -ing) và infinitives (vần to + động từ)?', 'Hành động đang diễn ra', 'Hành động đã diễn ra', 'Hành động sẽ diễn ra', 'Hành động có thể diễn ra', 'A', 'A', 'Hành động đang diễn ra thường sử dụng gerunds (vần -ing) và infinitives (vần to + động từ).');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Gerunds and Infinitives after specific verbs' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B1', 'Động từ nào sau đây không thường sử dụng gerunds (vần -ing) và infinitives (vần to + động từ)?', 'Like', 'Love', 'Hate', 'Enjoy', 'C', 'C', 'Động từ Hate không thường sử dụng gerunds (vần -ing) và infinitives (vần to + động từ).');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Báo cáo lại lời nói (Advanced)', 'B2', '### Cấu trúc/Công thức (Formula)
   Để báo cáo lại lời nói, chúng ta sử dụng các động từ báo cáo như *say*, *tell*, *ask*, *ask*... sau đó thêm *that* và câu nói được báo cáo lại.

   Ví dụ:
   - ''He said that he was tired.'' (Anh ấy nói rằng anh ấy mệt mỏi.)
   - ''She told me that she was going to the store.'' (Cô ấy nói với tôi rằng cô ấy sẽ đi đến cửa hàng.)

   ### Cách dùng (Usage)
   - Để báo cáo lại lời nói, chúng ta sử dụng các động từ báo cáo như *say*, *tell*, *ask*, *ask*...
   - Câu nói được báo cáo lại thường được đặt sau *that*.
   - Chúng ta có thể sử dụng các động từ báo cáo khác nhau để báo cáo lại lời nói.

   ### Ví dụ minh họa (Examples)
   - ''He asked me if I wanted to go to the movies.'' (Anh ấy hỏi tôi có muốn đi xem phim không.)
   - ''She said that she loved the book.'' (Cô ấy nói rằng cô ấy yêu sách đó.)

   ### Mẹo học (Tips)
   - Hãy nhớ sử dụng các động từ báo cáo đúng để báo cáo lại lời nói.
   - Hãy kiểm tra lại câu nói được báo cáo lại để đảm bảo nó chính xác.

   ### Các lỗi thường gặp (Common Mistakes)
   - Sử dụng các động từ báo cáo không đúng.
   - Không kiểm tra lại câu nói được báo cáo lại.

   ### Tóm tắt (Summary)
   - Để báo cáo lại lời nói, chúng ta sử dụng các động từ báo cáo như *say*, *tell*, *ask*, *ask*...
   - Câu nói được báo cáo lại thường được đặt sau *that*.
   - Chúng ta có thể sử dụng các động từ báo cáo khác nhau để báo cáo lại lời nói.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Advanced)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc của câu báo cáo lại lời nói là gì?', 'Động từ báo cáo + rằng + câu nói được báo cáo lại', 'Động từ báo cáo + câu nói được báo cáo lại', 'Rằng + động từ báo cáo + câu nói được báo cáo lại', 'Câu nói được báo cáo lại + rằng + động từ báo cáo', 'A', 'A', 'Cấu trúc của câu báo cáo lại lời nói là động từ báo cáo + rằng + câu nói được báo cáo lại.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Advanced)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B2', 'Ví dụ về câu báo cáo lại lời nói là gì?', 'Anh ấy nói rằng anh ấy mệt mỏi.', 'Cô ấy nói với tôi rằng cô ấy yêu sách đó.', 'Anh ấy hỏi tôi có muốn đi xem phim không.', 'Cô ấy nói rằng cô ấy sẽ đi đến cửa hàng.', 'A', 'A', 'Ví dụ về câu báo cáo lại lời nói là ''Anh ấy nói rằng anh ấy mệt mỏi.''');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Advanced)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B2', 'Động từ báo cáo nào thường được sử dụng để báo cáo lại lời nói?', 'Say', 'Tell', 'Ask', 'All of the above', 'D', 'D', 'Động từ báo cáo nào thường được sử dụng để báo cáo lại lời nói là ''say'', ''tell'', ''ask''...');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Advanced)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B2', 'Câu nói được báo cáo lại thường được đặt sau động từ báo cáo như thế nào?', 'Trước', 'Sau', 'Không có quy tắc', 'Rằng', 'B', 'B', 'Câu nói được báo cáo lại thường được đặt sau động từ báo cáo.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Advanced)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B2', 'Ví dụ về câu báo cáo lại lời nói sử dụng động từ ''ask'' là gì?', 'Anh ấy nói rằng anh ấy mệt mỏi.', 'Cô ấy nói với tôi rằng cô ấy yêu sách đó.', 'Anh ấy hỏi tôi có muốn đi xem phim không.', 'Cô ấy nói rằng cô ấy sẽ đi đến cửa hàng.', 'C', 'C', 'Ví dụ về câu báo cáo lại lời nói sử dụng động từ ''ask'' là ''Anh ấy hỏi tôi có muốn đi xem phim không.''');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Advanced)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B2', 'Lỗi thường gặp khi báo cáo lại lời nói là gì?', 'Sử dụng các động từ báo cáo không đúng.', 'Không kiểm tra lại câu nói được báo cáo lại.', 'Tất cả các lựa chọn trên.', 'Không có lỗi.', 'C', 'C', 'Lỗi thường gặp khi báo cáo lại lời nói là sử dụng các động từ báo cáo không đúng và không kiểm tra lại câu nói được báo cáo lại.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Advanced)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B2', 'Câu nói được báo cáo lại thường được đặt sau động từ báo cáo và từ ''that'' như thế nào?', 'Trước', 'Sau', 'Không có quy tắc', 'Rằng', 'B', 'B', 'Câu nói được báo cáo lại thường được đặt sau động từ báo cáo và từ ''that''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Advanced)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B2', 'Ví dụ về câu báo cáo lại lời nói sử dụng động từ ''tell'' là gì?', 'Anh ấy nói rằng anh ấy mệt mỏi.', 'Cô ấy nói với tôi rằng cô ấy yêu sách đó.', 'Anh ấy hỏi tôi có muốn đi xem phim không.', 'Cô ấy nói rằng cô ấy sẽ đi đến cửa hàng.', 'B', 'B', 'Ví dụ về câu báo cáo lại lời nói sử dụng động từ ''tell'' là ''Cô ấy nói với tôi rằng cô ấy yêu sách đó.''');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Advanced)' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B2', 'Câu nói được báo cáo lại thường được đặt sau động từ báo cáo và từ ''that'' như thế nào?', 'Trước', 'Sau', 'Không có quy tắc', 'Rằng', 'B', 'B', 'Câu nói được báo cáo lại thường được đặt sau động từ báo cáo và từ ''that''.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Advanced)' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B2', 'Ví dụ về câu báo cáo lại lời nói sử dụng động từ ''say'' là gì?', 'Anh ấy nói rằng anh ấy mệt mỏi.', 'Cô ấy nói với tôi rằng cô ấy yêu sách đó.', 'Anh ấy hỏi tôi có muốn đi xem phim không.', 'Cô ấy nói rằng cô ấy sẽ đi đến cửa hàng.', 'A', 'A', 'Ví dụ về câu báo cáo lại lời nói sử dụng động từ ''say'' là ''Anh ấy nói rằng anh ấy mệt mỏi.''');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Báo cáo lại lời nói (Advanced)' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'B2', 'Lời khuyên khi học về báo cáo lại lời nói là gì?', 'Hãy sử dụng các động từ báo cáo đúng.', 'Hãy kiểm tra lại câu nói được báo cáo lại.', 'Tất cả các lựa chọn trên.', 'Không có lời khuyên.', 'C', 'C', 'Lời khuyên khi học về báo cáo lại lời nói là hãy sử dụng các động từ báo cáo đúng và hãy kiểm tra lại câu nói được báo cáo lại.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Mixed Conditionals (Type 2 + Type 3)', 'B2', '# Điều kiện hỗn hợp (Type 2 + Type 3)

## Cấu trúc/Công thức (Formula)

Điều kiện hỗn hợp được sử dụng để mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong hiện tại hoặc tương lai.

Cấu trúc chung:

- Nếu tôi đã làm điều đó, tôi sẽ làm điều này.
- Nếu tôi đã làm điều đó, tôi sẽ không làm điều này.
- Nếu tôi đã làm điều đó, tôi sẽ làm điều này nếu... (với điều kiện phụ)

## Cách dùng (Usage)

Điều kiện hỗn hợp được sử dụng để mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong hiện tại hoặc tương lai.

- Để mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong hiện tại:
  + Nếu tôi đã học tiếng Anh, tôi sẽ có thể nói với người nước ngoài.
- Để mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong tương lai:
  + Nếu tôi đã học tiếng Anh, tôi sẽ có thể nói với người nước ngoài khi tôi đi du lịch.

## Ví dụ minh họa (Examples)

- Nếu tôi đã học tiếng Anh, tôi sẽ có thể nói với người nước ngoài.
- Nếu tôi đã học tiếng Anh, tôi sẽ không làm việc tại nước ngoài.
- Nếu tôi đã học tiếng Anh, tôi sẽ làm việc tại nước ngoài nếu tôi có cơ hội.

## Mẹo học (Tips)

- Hãy sử dụng điều kiện hỗn hợp khi mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong hiện tại hoặc tương lai.
- Hãy sử dụng cấu trúc đúng đắn để tránh nhầm lẫn.

## Các lỗi thường gặp (Common Mistakes)

- Sử dụng điều kiện hỗn hợp sai cấu trúc.
- Sử dụng điều kiện hỗn hợp để mô tả một tình huống không có kết quả.

## Tóm tắt (Summary)

- Điều kiện hỗn hợp được sử dụng để mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong hiện tại hoặc tương lai.
- Cấu trúc chung của điều kiện hỗn hợp là: Nếu tôi đã làm điều đó, tôi sẽ làm điều này.
- Điều kiện hỗn hợp được sử dụng để mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong hiện tại hoặc tương lai.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mixed Conditionals (Type 2 + Type 3)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc chung của điều kiện hỗn hợp là gì?', 'Nếu tôi làm điều đó, tôi sẽ làm điều này.', 'Nếu tôi đã làm điều đó, tôi sẽ làm điều này.', 'Nếu tôi làm điều đó, tôi sẽ không làm điều này.', 'Nếu tôi đã làm điều đó, tôi sẽ không làm điều này.', 'B', 'B', 'Cấu trúc chung của điều kiện hỗn hợp là: Nếu tôi đã làm điều đó, tôi sẽ làm điều này.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mixed Conditionals (Type 2 + Type 3)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B2', 'Điều kiện hỗn hợp được sử dụng để mô tả tình huống nào?', 'Một tình huống có thể xảy ra trong hiện tại và kết quả có thể xảy ra trong tương lai.', 'Một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong hiện tại hoặc tương lai.', 'Một tình huống có thể xảy ra trong tương lai và kết quả có thể xảy ra trong hiện tại.', 'Một tình huống có thể xảy ra trong hiện tại và kết quả có thể xảy ra trong quá khứ.', 'B', 'B', 'Điều kiện hỗn hợp được sử dụng để mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong hiện tại hoặc tương lai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mixed Conditionals (Type 2 + Type 3)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B2', 'Ví dụ về điều kiện hỗn hợp là gì?', 'Nếu tôi làm việc chăm chỉ, tôi sẽ thành công.', 'Nếu tôi đã học tiếng Anh, tôi sẽ có thể nói với người nước ngoài.', 'Nếu tôi làm việc chăm chỉ, tôi sẽ không thành công.', 'Nếu tôi đã học tiếng Anh, tôi sẽ không làm việc tại nước ngoài.', 'B', 'B', 'Ví dụ về điều kiện hỗn hợp là: Nếu tôi đã học tiếng Anh, tôi sẽ có thể nói với người nước ngoài.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mixed Conditionals (Type 2 + Type 3)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc của điều kiện hỗn hợp khi mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong hiện tại là gì?', 'Nếu tôi làm điều đó, tôi sẽ làm điều này.', 'Nếu tôi đã làm điều đó, tôi sẽ làm điều này.', 'Nếu tôi làm điều đó, tôi sẽ không làm điều này.', 'Nếu tôi đã làm điều đó, tôi sẽ không làm điều này.', 'B', 'B', 'Cấu trúc của điều kiện hỗn hợp khi mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong hiện tại là: Nếu tôi đã làm điều đó, tôi sẽ làm điều này.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mixed Conditionals (Type 2 + Type 3)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc của điều kiện hỗn hợp khi mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong tương lai là gì?', 'Nếu tôi làm điều đó, tôi sẽ làm điều này.', 'Nếu tôi đã làm điều đó, tôi sẽ làm điều này.', 'Nếu tôi làm điều đó, tôi sẽ không làm điều này.', 'Nếu tôi đã làm điều đó, tôi sẽ không làm điều này.', 'B', 'B', 'Cấu trúc của điều kiện hỗn hợp khi mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong tương lai là: Nếu tôi đã làm điều đó, tôi sẽ làm điều này nếu...');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mixed Conditionals (Type 2 + Type 3)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B2', 'Điều kiện hỗn hợp được sử dụng để mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong hiện tại hoặc tương lai. Điều này có đúng không?', 'Không', 'Có', 'Có thể', 'Không chắc chắn', 'B', 'B', 'Điều kiện hỗn hợp được sử dụng để mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong hiện tại hoặc tương lai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mixed Conditionals (Type 2 + Type 3)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B2', 'Ví dụ về điều kiện hỗn hợp khi mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong hiện tại là gì?', 'Nếu tôi làm việc chăm chỉ, tôi sẽ thành công.', 'Nếu tôi đã học tiếng Anh, tôi sẽ có thể nói với người nước ngoài.', 'Nếu tôi làm việc chăm chỉ, tôi sẽ không thành công.', 'Nếu tôi đã học tiếng Anh, tôi sẽ không làm việc tại nước ngoài.', 'B', 'B', 'Ví dụ về điều kiện hỗn hợp khi mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong hiện tại là: Nếu tôi đã học tiếng Anh, tôi sẽ có thể nói với người nước ngoài.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mixed Conditionals (Type 2 + Type 3)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B2', 'Ví dụ về điều kiện hỗn hợp khi mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong tương lai là gì?', 'Nếu tôi làm việc chăm chỉ, tôi sẽ thành công.', 'Nếu tôi đã học tiếng Anh, tôi sẽ có thể nói với người nước ngoài khi tôi đi du lịch.', 'Nếu tôi làm việc chăm chỉ, tôi sẽ không thành công.', 'Nếu tôi đã học tiếng Anh, tôi sẽ không làm việc tại nước ngoài.', 'B', 'B', 'Ví dụ về điều kiện hỗn hợp khi mô tả một tình huống có thể xảy ra trong quá khứ và kết quả có thể xảy ra trong tương lai là: Nếu tôi đã học tiếng Anh, tôi sẽ có thể nói với người nước ngoài khi tôi đi du lịch.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Inversion with Negative Adverbials', 'B2', '# Inversion with Negative Adverbials

## Cấu trúc/Công thức (Formula)

Inversion with negative adverbials thường được sử dụng để nhấn mạnh sự phủ định của một hành động hoặc tình huống. Cấu trúc chung của nó là:

* Negative adverbial + không + subject + verb

Ví dụ:

* Never do I go to the movies. (Không bao giờ tôi đi xem phim.)

## Cách dùng (Usage)

Inversion with negative adverbials thường được sử dụng để thể hiện sự phủ định của một hành động hoặc tình huống. Nó giúp tạo ra một cảm giác mạnh mẽ và nhấn mạnh sự thật của sự việc.

## Ví dụ minh họa (Examples)

* Never have I seen such a beautiful sunset. (Không bao giờ tôi đã thấy một hoàng hôn đẹp như vậy.)
* Rarely do I eat breakfast in the morning. (Ít khi tôi ăn sáng vào buổi sáng.)

## Mẹo học (Tips)

* Hãy sử dụng inversion with negative adverbials để thể hiện sự phủ định của một hành động hoặc tình huống.
* Hãy chọn đúng negative adverbial phù hợp với ngữ cảnh.

## Các lỗi thường gặp (Common Mistakes)

* Sử dụng inversion with negative adverbials sai ngữ cảnh.
* Không chọn đúng negative adverbial phù hợp.

## Tóm tắt (Summary)

Inversion with negative adverbials là một cấu trúc ngữ pháp quan trọng giúp thể hiện sự phủ định của một hành động hoặc tình huống. Nó giúp tạo ra một cảm giác mạnh mẽ và nhấn mạnh sự thật của sự việc.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion with Negative Adverbials' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc chung của inversion with negative adverbials là gì?', 'Negative adverbial + subject + verb', 'Negative adverbial + không + subject + verb', 'Không + subject + verb + negative adverbial', 'Subject + verb + negative adverbial', 'B', 'B', 'Cấu trúc chung của inversion with negative adverbials là Negative adverbial + không + subject + verb.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion with Negative Adverbials' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B2', 'Ví dụ nào sau đây sử dụng inversion with negative adverbials đúng ngữ cảnh?', 'I never go to the movies.', 'Never do I go to the movies.', 'I go to the movies never.', 'Never I go to the movies.', 'B', 'B', 'Ví dụ ''Never do I go to the movies.'' sử dụng inversion with negative adverbials đúng ngữ cảnh.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion with Negative Adverbials' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B2', 'Negative adverbial nào sau đây phù hợp với câu ''I have never eaten such a delicious food.''?', 'Rarely', 'Never', 'Hardly', 'Seldom', 'B', 'B', 'Negative adverbial ''Never'' phù hợp với câu ''I have never eaten such a delicious food.''');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion with Negative Adverbials' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B2', 'Câu nào sau đây sử dụng inversion with negative adverbials sai ngữ cảnh?', 'I never eat breakfast in the morning.', 'Never do I eat breakfast in the morning.', 'I eat breakfast in the morning never.', 'Never I eat breakfast in the morning.', 'C', 'C', 'Câu ''I eat breakfast in the morning never.'' sử dụng inversion with negative adverbials sai ngữ cảnh.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion with Negative Adverbials' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B2', 'Ví dụ nào sau đây sử dụng inversion with negative adverbials để thể hiện sự phủ định của một hành động?', 'I go to the movies every weekend.', 'Never do I go to the movies.', 'I never go to the movies.', 'I go to the movies never.', 'B', 'B', 'Ví dụ ''Never do I go to the movies.'' sử dụng inversion with negative adverbials để thể hiện sự phủ định của một hành động.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion with Negative Adverbials' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc nào sau đây không phải là inversion with negative adverbials?', 'Negative adverbial + không + subject + verb', 'Subject + verb + negative adverbial', 'Không + subject + verb + negative adverbial', 'Negative adverbial + subject + verb', 'B', 'B', 'Cấu trúc ''Subject + verb + negative adverbial'' không phải là inversion with negative adverbials.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion with Negative Adverbials' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B2', 'Ví dụ nào sau đây sử dụng inversion with negative adverbials để thể hiện sự phủ định của một tình huống?', 'I have never been to Paris.', 'Never have I been to Paris.', 'I never go to Paris.', 'Never do I go to Paris.', 'B', 'B', 'Ví dụ ''Never have I been to Paris.'' sử dụng inversion with negative adverbials để thể hiện sự phủ định của một tình huống.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion with Negative Adverbials' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B2', 'Negative adverbial nào sau đây phù hợp với câu ''I have seldom eaten such a delicious food.''?', 'Rarely', 'Seldom', 'Hardly', 'Never', 'B', 'B', 'Negative adverbial ''Seldom'' phù hợp với câu ''I have seldom eaten such a delicious food.''');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion with Negative Adverbials' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B2', 'Câu nào sau đây sử dụng inversion with negative adverbials để thể hiện sự phủ định của một hành động?', 'I go to the movies every weekend.', 'Never do I go to the movies.', 'I never go to the movies.', 'I go to the movies never.', 'B', 'B', 'Câu ''Never do I go to the movies.'' sử dụng inversion with negative adverbials để thể hiện sự phủ định của một hành động.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion with Negative Adverbials' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B2', 'Ví dụ nào sau đây sử dụng inversion with negative adverbials đúng ngữ cảnh?', 'I never eat breakfast in the morning.', 'Never do I eat breakfast in the morning.', 'I eat breakfast in the morning never.', 'Never I eat breakfast in the morning.', 'B', 'B', 'Ví dụ ''Never do I eat breakfast in the morning.'' sử dụng inversion with negative adverbials đúng ngữ cảnh.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion with Negative Adverbials' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc nào sau đây không phải là inversion with negative adverbials?', 'Negative adverbial + không + subject + verb', 'Subject + verb + negative adverbial', 'Không + subject + verb + negative adverbial', 'Negative adverbial + subject + verb', 'B', 'B', 'Cấu trúc ''Subject + verb + negative adverbial'' không phải là inversion with negative adverbials.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Advanced Modal Verbs of Deduction', 'B2', '# Advanced Modal Verbs of Deduction

## Cấu trúc/Công thức (Formula)

Các động từ modal nâng cao của suy luận bao gồm:

* may
* might
* could
* would

Cấu trúc chung:

[Modal Verb] + [sẽ] + [động từ] + [đối tượng]

Ví dụ:

* May I be wrong, but I think it''s going to rain today.
* It might be a good idea to bring an umbrella.

## Cách dùng (Usage)

Các động từ modal nâng cao của suy luận thường được sử dụng để thể hiện sự nghi ngờ, khả năng hoặc suy đoán.

* May: được sử dụng để thể hiện sự nghi ngờ hoặc khả năng.
* Might: được sử dụng để thể hiện sự nghi ngờ hoặc khả năng, nhưng ít hơn so với may.
* Could: được sử dụng để thể hiện sự khả năng hoặc có thể.
* Would: được sử dụng để thể hiện sự suy đoán hoặc dự đoán.

## Ví dụ minh họa (Examples)

* May I be wrong, but I think it''s going to rain today. (Tôi có thể sai, nhưng tôi nghĩ hôm nay sẽ mưa)
* It might be a good idea to bring an umbrella. (Có thể là một ý tưởng hay để mang mũ chống mưa)

## Mẹo học (Tips)

* Hãy nhớ rằng các động từ modal nâng cao của suy luận thường được sử dụng để thể hiện sự nghi ngờ hoặc khả năng.
* Hãy sử dụng các động từ modal phù hợp với ngữ cảnh và ý nghĩa.

## Các lỗi thường gặp (Common Mistakes)

* Sử dụng may và might không đúng cách.
* Sử dụng could và would không đúng cách.

## Tóm tắt (Summary)

Các động từ modal nâng cao của suy luận bao gồm may, might, could và would. Chúng thường được sử dụng để thể hiện sự nghi ngờ, khả năng hoặc suy đoán. Hãy nhớ sử dụng các động từ modal phù hợp với ngữ cảnh và ý nghĩa.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Modal Verbs of Deduction' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc chung của các động từ modal nâng cao của suy luận là gì?', '[Modal Verb] + [sẽ] + [động từ] + [đối tượng]', '[Modal Verb] + [động từ] + [đối tượng]', '[Modal Verb] + [sẽ] + [đối tượng]', '[Modal Verb] + [động từ]', 'A', 'A', 'Cấu trúc chung của các động từ modal nâng cao của suy luận là [Modal Verb] + [sẽ] + [động từ] + [đối tượng].');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Modal Verbs of Deduction' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B2', 'Động từ modal nào được sử dụng để thể hiện sự nghi ngờ hoặc khả năng?', 'May', 'Might', 'Could', 'Would', 'A', 'A', 'May được sử dụng để thể hiện sự nghi ngờ hoặc khả năng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Modal Verbs of Deduction' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B2', 'Câu nào sau đây sử dụng động từ modal may đúng cách?', 'It might be a good idea to bring an umbrella.', 'May I be wrong, but I think it''s going to rain today.', 'I may go to the store.', 'It may be a good idea to bring a book.', 'B', 'B', 'Câu ''May I be wrong, but I think it''s going to rain today.'' sử dụng động từ modal may đúng cách.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Modal Verbs of Deduction' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B2', 'Động từ modal nào được sử dụng để thể hiện sự suy đoán hoặc dự đoán?', 'May', 'Might', 'Could', 'Would', 'D', 'D', 'Would được sử dụng để thể hiện sự suy đoán hoặc dự đoán.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Modal Verbs of Deduction' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B2', 'Câu nào sau đây sử dụng động từ modal might đúng cách?', 'It may be a good idea to bring an umbrella.', 'May I be wrong, but I think it''s going to rain today.', 'It might be a good idea to bring an umbrella.', 'I might go to the store.', 'C', 'C', 'Câu ''It might be a good idea to bring an umbrella.'' sử dụng động từ modal might đúng cách.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Modal Verbs of Deduction' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B2', 'Động từ modal nào được sử dụng để thể hiện sự khả năng hoặc có thể?', 'May', 'Might', 'Could', 'Would', 'C', 'C', 'Could được sử dụng để thể hiện sự khả năng hoặc có thể.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Modal Verbs of Deduction' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B2', 'Câu nào sau đây sử dụng động từ modal would đúng cách?', 'It may be a good idea to bring an umbrella.', 'May I be wrong, but I think it''s going to rain today.', 'It would be a good idea to bring an umbrella.', 'I would go to the store.', 'C', 'C', 'Câu ''It would be a good idea to bring an umbrella.'' sử dụng động từ modal would đúng cách.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Modal Verbs of Deduction' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B2', 'Sự khác biệt giữa may và might là gì?', 'May được sử dụng để thể hiện sự nghi ngờ hoặc khả năng, trong khi might được sử dụng để thể hiện sự nghi ngờ hoặc khả năng ít hơn.', 'May được sử dụng để thể hiện sự nghi ngờ hoặc khả năng, trong khi might được sử dụng để thể hiện sự suy đoán hoặc dự đoán.', 'May được sử dụng để thể hiện sự khả năng hoặc có thể, trong khi might được sử dụng để thể hiện sự nghi ngờ hoặc khả năng.', 'May được sử dụng để thể hiện sự suy đoán hoặc dự đoán, trong khi might được sử dụng để thể hiện sự nghi ngờ hoặc khả năng.', 'A', 'A', 'May được sử dụng để thể hiện sự nghi ngờ hoặc khả năng, trong khi might được sử dụng để thể hiện sự nghi ngờ hoặc khả năng ít hơn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Modal Verbs of Deduction' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B2', 'Câu nào sau đây sử dụng động từ modal could đúng cách?', 'It may be a good idea to bring an umbrella.', 'May I be wrong, but I think it''s going to rain today.', 'I could go to the store.', 'It could be a good idea to bring a book.', 'C', 'C', 'Câu ''I could go to the store.'' sử dụng động từ modal could đúng cách.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Modal Verbs of Deduction' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B2', 'Sự khác biệt giữa could và would là gì?', 'Could được sử dụng để thể hiện sự khả năng hoặc có thể, trong khi would được sử dụng để thể hiện sự suy đoán hoặc dự đoán.', 'Could được sử dụng để thể hiện sự nghi ngờ hoặc khả năng, trong khi would được sử dụng để thể hiện sự khả năng hoặc có thể.', 'Could được sử dụng để thể hiện sự suy đoán hoặc dự đoán, trong khi would được sử dụng để thể hiện sự nghi ngờ hoặc khả năng.', 'Could được sử dụng để thể hiện sự nghi ngờ hoặc khả năng, trong khi would được sử dụng để thể hiện sự suy đoán hoặc dự đoán.', 'A', 'A', 'Could được sử dụng để thể hiện sự khả năng hoặc có thể, trong khi would được sử dụng để thể hiện sự suy đoán hoặc dự đoán.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Modal Verbs of Deduction' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'B2', 'Câu nào sau đây sử dụng động từ modal would đúng cách?', 'It may be a good idea to bring an umbrella.', 'May I be wrong, but I think it''s going to rain today.', 'It would be a good idea to bring an umbrella.', 'I would go to the store.', 'C', 'C', 'Câu ''It would be a good idea to bring an umbrella.'' sử dụng động từ modal would đúng cách.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Causative Verbs (Have / Get done)', 'B2', '### Cấu trúc/Công thức (Formula)
Cấu trúc của động từ gây tác động (causative verbs) là:
- **Have** + **động từ được gây tác động** + **by** + **người gây tác động**
- **Get** + **động từ được gây tác động** + **by** + **người gây tác động**

### Cách dùng (Usage)
- **Have** + **động từ được gây tác động** + **by** + **người gây tác động**: thường dùng để nói về việc cho phép, yêu cầu, yêu cầu ai đó thực hiện một hành động.
- **Get** + **động từ được gây tác động** + **by** + **người gây tác động**: thường dùng để nói về việc bị ép buộc, bị yêu cầu thực hiện một hành động.

### Ví dụ minh họa (Examples)
- Tôi **cho phép** anh ấy đi chơi. (I let him go out.)
- Cô ấy **yêu cầu** anh ấy giúp đỡ. (She asked him to help.)
- Anh ấy **bị ép buộc** phải làm việc vào cuối tuần. (He was forced to work on weekends.)

### Mẹo học (Tips)
- Hãy nhớ rằng **Have** và **Get** có thể được sử dụng để tạo ra các động từ gây tác động khác nhau.
- Hãy sử dụng các ví dụ minh họa để hiểu rõ hơn về cách sử dụng các động từ gây tác động.

### Các lỗi thường gặp (Common Mistakes)
- Không sử dụng **by** sau **have** hoặc **get**.
- Sử dụng **have** hoặc **get** sai trong các câu.

### Tóm tắt (Summary)
- Cấu trúc của động từ gây tác động là: **Have** + **động từ được gây tác động** + **by** + **người gây tác động** hoặc **Get** + **động từ được gây tác động** + **by** + **người gây tác động**.
- **Have** và **Get** có thể được sử dụng để tạo ra các động từ gây tác động khác nhau.
- Hãy sử dụng các ví dụ minh họa để hiểu rõ hơn về cách sử dụng các động từ gây tác động.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Causative Verbs (Have / Get done)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc của động từ gây tác động là gì?', 'Have + động từ được gây tác động + by + người gây tác động', 'Get + động từ được gây tác động + by + người gây tác động', 'Have + động từ được gây tác động + người gây tác động', 'Get + động từ được gây tác động + người gây tác động', 'A', 'A', 'Cấu trúc của động từ gây tác động là: Have + động từ được gây tác động + by + người gây tác động hoặc Get + động từ được gây tác động + by + người gây tác động.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Causative Verbs (Have / Get done)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B2', 'Động từ gây tác động thường dùng để nói về việc cho phép, yêu cầu, yêu cầu ai đó thực hiện một hành động là gì?', 'Get', 'Have', 'Both', 'None', 'B', 'B', 'Động từ gây tác động thường dùng để nói về việc cho phép, yêu cầu, yêu cầu ai đó thực hiện một hành động là Have.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Causative Verbs (Have / Get done)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B2', 'Câu sau là ví dụ minh họa cho động từ gây tác động là gì?', 'Tôi cho phép anh ấy đi chơi.', 'Cô ấy yêu cầu anh ấy giúp đỡ.', 'Anh ấy bị ép buộc phải làm việc vào cuối tuần.', 'Tất cả các câu trên', 'D', 'D', 'Tất cả các câu trên đều là ví dụ minh họa cho động từ gây tác động.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Causative Verbs (Have / Get done)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B2', 'Động từ gây tác động thường dùng để nói về việc bị ép buộc, bị yêu cầu thực hiện một hành động là gì?', 'Have', 'Get', 'Both', 'None', 'B', 'B', 'Động từ gây tác động thường dùng để nói về việc bị ép buộc, bị yêu cầu thực hiện một hành động là Get.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Causative Verbs (Have / Get done)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B2', 'Câu sau là ví dụ minh họa cho động từ gây tác động không đúng là gì?', 'Tôi cho phép anh ấy đi chơi.', 'Cô ấy yêu cầu anh ấy giúp đỡ.', 'Anh ấy bị ép buộc phải làm việc vào cuối tuần.', 'Tôi yêu cầu anh ấy đi chơi.', 'D', 'D', 'Câu ''Tôi yêu cầu anh ấy đi chơi.'' là ví dụ minh họa cho động từ gây tác động không đúng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Causative Verbs (Have / Get done)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc của động từ gây tác động là?', 'Have + động từ được gây tác động + by + người gây tác động', 'Get + động từ được gây tác động + by + người gây tác động', 'Both', 'None', 'C', 'C', 'Cấu trúc của động từ gây tác động là: Have + động từ được gây tác động + by + người gây tác động hoặc Get + động từ được gây tác động + by + người gây tác động.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Causative Verbs (Have / Get done)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B2', 'Động từ gây tác động thường dùng để tạo ra các động từ gây tác động khác nhau là gì?', 'Have', 'Get', 'Both', 'None', 'C', 'C', 'Động từ gây tác động thường dùng để tạo ra các động từ gây tác động khác nhau là Both.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Causative Verbs (Have / Get done)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B2', 'Câu sau là ví dụ minh họa cho cách sử dụng động từ gây tác động là gì?', 'Tôi cho phép anh ấy đi chơi.', 'Cô ấy yêu cầu anh ấy giúp đỡ.', 'Anh ấy bị ép buộc phải làm việc vào cuối tuần.', 'Tất cả các câu trên', 'D', 'D', 'Tất cả các câu trên đều là ví dụ minh họa cho cách sử dụng động từ gây tác động.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Causative Verbs (Have / Get done)' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B2', 'Động từ gây tác động thường dùng để nói về việc cho phép, yêu cầu, yêu cầu ai đó thực hiện một hành động là gì?', 'Get', 'Have', 'Both', 'None', 'B', 'B', 'Động từ gây tác động thường dùng để nói về việc cho phép, yêu cầu, yêu cầu ai đó thực hiện một hành động là Have.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Causative Verbs (Have / Get done)' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B2', 'Câu sau là ví dụ minh họa cho cách sử dụng động từ gây tác động không đúng là gì?', 'Tôi cho phép anh ấy đi chơi.', 'Cô ấy yêu cầu anh ấy giúp đỡ.', 'Anh ấy bị ép buộc phải làm việc vào cuối tuần.', 'Tôi yêu cầu anh ấy đi chơi.', 'D', 'D', 'Câu ''Tôi yêu cầu anh ấy đi chơi.'' là ví dụ minh họa cho cách sử dụng động từ gây tác động không đúng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Causative Verbs (Have / Get done)' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc của động từ gây tác động là?', 'Have + động từ được gây tác động + by + người gây tác động', 'Get + động từ được gây tác động + by + người gây tác động', 'Both', 'None', 'C', 'C', 'Cấu trúc của động từ gây tác động là: Have + động từ được gây tác động + by + người gây tác động hoặc Get + động từ được gây tác động + by + người gây tác động.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Mood Subjunctive', 'B2', '### Cấu trúc/Công thức (Formula)
   - Động từ được viết ở dạng nguyên thể hoặc dạng phân từ thứ nhất (đối với động từ một số ngôi)
   - Động từ được viết ở dạng phân từ thứ hai (đối với động từ nhiều ngôi)
   - Động từ được viết ở dạng phân từ thứ ba (đối với động từ ngôi thứ ba)

### Cách dùng (Usage)
- Sử dụng để thể hiện một ý kiến hoặc một sự kiện không chắc chắn
- Sử dụng để thể hiện một ý kiến hoặc một sự kiện không thực tế
- Sử dụng để thể hiện một ý kiến hoặc một sự kiện không mong muốn

### Ví dụ minh họa (Examples)
- It is necessary that he **be** here.
- I suggest that you **take** a taxi.
- It is possible that she **win** the competition.

### Mẹo học (Tips)
- Hãy nhớ rằng động từ được viết ở dạng nguyên thể hoặc phân từ thứ nhất, thứ hai, thứ ba
- Hãy nhớ rằng subjunctive được sử dụng để thể hiện một ý kiến hoặc sự kiện không chắc chắn, không thực tế, không mong muốn

### Các lỗi thường gặp (Common Mistakes)
- Sử dụng indicative thay vì subjunctive
- Sử dụng động từ không đúng dạng

### Tóm tắt (Summary)
- Subjunctive được sử dụng để thể hiện một ý kiến hoặc sự kiện không chắc chắn, không thực tế, không mong muốn
- Động từ được viết ở dạng nguyên thể hoặc phân từ thứ nhất, thứ hai, thứ ba', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mood Subjunctive' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B2', 'Động từ được viết ở dạng nào trong câu subjunctive?', 'Nguyên thể', 'Phân từ thứ nhất', 'Phân từ thứ hai', 'Phân từ thứ ba', 'A', 'A', 'Trong câu subjunctive, động từ thường được viết ở dạng nguyên thể hoặc phân từ thứ nhất (đối với động từ một số ngôi)');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mood Subjunctive' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B2', 'Câu subjunctive được sử dụng để thể hiện điều gì?', 'Một ý kiến chắc chắn', 'Một ý kiến không chắc chắn', 'Một sự kiện thực tế', 'Một sự kiện không thực tế', 'B', 'B', 'Câu subjunctive được sử dụng để thể hiện một ý kiến hoặc một sự kiện không chắc chắn');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mood Subjunctive' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B2', 'Động từ nào được viết ở dạng phân từ thứ hai trong câu subjunctive?', 'Động từ một số ngôi', 'Động từ nhiều ngôi', 'Động từ ngôi thứ ba', 'Động từ ngôi thứ nhất', 'B', 'B', 'Động từ nhiều ngôi được viết ở dạng phân từ thứ hai trong câu subjunctive');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mood Subjunctive' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B2', 'Câu subjunctive được sử dụng để thể hiện điều gì không mong muốn?', 'Một ý kiến', 'Một sự kiện', 'Một sự kiện không mong muốn', 'Một ý kiến không mong muốn', 'C', 'C', 'Câu subjunctive được sử dụng để thể hiện một ý kiến hoặc một sự kiện không mong muốn');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mood Subjunctive' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B2', 'Động từ nào được viết ở dạng phân từ thứ ba trong câu subjunctive?', 'Động từ một số ngôi', 'Động từ nhiều ngôi', 'Động từ ngôi thứ ba', 'Động từ ngôi thứ nhất', 'C', 'C', 'Động từ ngôi thứ ba được viết ở dạng phân từ thứ ba trong câu subjunctive');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mood Subjunctive' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B2', 'Câu subjunctive được sử dụng trong trường hợp nào?', 'Khi thể hiện một ý kiến chắc chắn', 'Khi thể hiện một ý kiến không chắc chắn', 'Khi thể hiện một sự kiện thực tế', 'Khi thể hiện một sự kiện không thực tế', 'B', 'B', 'Câu subjunctive được sử dụng khi thể hiện một ý kiến hoặc một sự kiện không chắc chắn');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mood Subjunctive' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B2', 'Động từ nào được viết ở dạng nguyên thể trong câu subjunctive?', 'Động từ một số ngôi', 'Động từ nhiều ngôi', 'Động từ ngôi thứ ba', 'Động từ ngôi thứ nhất', 'A', 'A', 'Động từ một số ngôi được viết ở dạng nguyên thể trong câu subjunctive');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mood Subjunctive' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B2', 'Câu subjunctive được sử dụng để thể hiện điều gì không thực tế?', 'Một ý kiến', 'Một sự kiện', 'Một sự kiện không mong muốn', 'Một ý kiến không thực tế', 'D', 'D', 'Câu subjunctive được sử dụng để thể hiện một ý kiến hoặc một sự kiện không thực tế');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mood Subjunctive' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B2', 'Động từ nào được viết ở dạng phân từ thứ nhất trong câu subjunctive?', 'Động từ một số ngôi', 'Động từ nhiều ngôi', 'Động từ ngôi thứ ba', 'Động từ ngôi thứ nhất', 'A', 'A', 'Động từ một số ngôi được viết ở dạng phân từ thứ nhất trong câu subjunctive');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mood Subjunctive' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B2', 'Câu subjunctive được sử dụng trong trường hợp nào không?', 'Khi thể hiện một ý kiến chắc chắn', 'Khi thể hiện một ý kiến không chắc chắn', 'Khi thể hiện một sự kiện thực tế', 'Khi thể hiện một ý kiến không mong muốn', 'C', 'C', 'Câu subjunctive không được sử dụng khi thể hiện một sự kiện thực tế');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Mood Subjunctive' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'B2', 'Động từ nào được viết ở dạng phân từ thứ hai trong câu subjunctive?', 'Động từ một số ngôi', 'Động từ nhiều ngôi', 'Động từ ngôi thứ ba', 'Động từ ngôi thứ nhất', 'B', 'B', 'Động từ nhiều ngôi được viết ở dạng phân từ thứ hai trong câu subjunctive');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Wish / If Only Clauses', 'B2', '### Cấu trúc/Công thức (Formula)
Wish / If Only clauses thường được sử dụng để thể hiện một ước muốn hoặc một điều ước không thể xảy ra.

- Nếu bạn muốn thể hiện một ước muốn, bạn sẽ sử dụng cấu trúc: *If only + được + đã + động từ*
- Nếu bạn muốn thể hiện một điều ước không thể xảy ra, bạn sẽ sử dụng cấu trúc: *If only + được + có thể + động từ*

### Cách dùng (Usage)
- Wish / If Only clauses thường được sử dụng trong các tình huống như:
 + Thể hiện một ước muốn không thể xảy ra
 + Thể hiện một điều ước không thể xảy ra
 + Thể hiện một cảm giác tiếc nuối

### Ví dụ minh họa (Examples)
- Nếu bạn muốn thể hiện một ước muốn:
 + I wish I had studied harder for this exam. (Tôi ước mình đã học tập chăm chỉ hơn cho kỳ thi này.)
- Nếu bạn muốn thể hiện một điều ước không thể xảy ra:
 + If only I could fly! (Nếu chỉ tôi có thể bay!)

### Mẹo học (Tips)
- Hãy sử dụng Wish / If Only clauses một cách linh hoạt để thể hiện các cảm xúc và ý nghĩ của mình.
- Hãy chú ý đến ngữ cảnh và tình huống khi sử dụng Wish / If Only clauses.

### Các lỗi thường gặp (Common Mistakes)
- Không sử dụng Wish / If Only clauses một cách linh hoạt
- Không chú ý đến ngữ cảnh và tình huống khi sử dụng Wish / If Only clauses

### Tóm tắt (Summary)
Wish / If Only clauses là một cấu trúc ngữ pháp quan trọng để thể hiện các ước muốn và điều ước không thể xảy ra. Hãy sử dụng nó một cách linh hoạt và chú ý đến ngữ cảnh và tình huống để thể hiện các cảm xúc và ý nghĩ của mình.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wish / If Only Clauses' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc Wish / If Only clauses thường được sử dụng để thể hiện:', 'Một sự kiện đã xảy ra', 'Một ước muốn hoặc một điều ước không thể xảy ra', 'Một cảm giác hạnh phúc', 'Một cảm giác buồn bã', 'B', 'B', 'Wish / If Only clauses thường được sử dụng để thể hiện một ước muốn hoặc một điều ước không thể xảy ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wish / If Only Clauses' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc Wish / If Only clauses để thể hiện một ước muốn là:', '*If only + được + có thể + động từ*', '*If only + được + đã + động từ*', '*If only + có thể + động từ*', '*If only + được + động từ*', 'B', 'B', 'Cấu trúc Wish / If Only clauses để thể hiện một ước muốn là *If only + được + đã + động từ*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wish / If Only Clauses' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B2', 'Câu sau là ví dụ minh họa cho cấu trúc Wish / If Only clauses để thể hiện một ước muốn:', 'I wish I had studied harder for this exam.', 'If only I could fly!', 'I wish I could fly!', 'If only I had studied harder for this exam.', 'A', 'A', 'Câu I wish I had studied harder for this exam. là ví dụ minh họa cho cấu trúc Wish / If Only clauses để thể hiện một ước muốn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wish / If Only Clauses' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc Wish / If Only clauses để thể hiện một điều ước không thể xảy ra là:', '*If only + được + đã + động từ*', '*If only + được + có thể + động từ*', '*If only + có thể + động từ*', '*If only + được + động từ*', 'B', 'B', 'Cấu trúc Wish / If Only clauses để thể hiện một điều ước không thể xảy ra là *If only + được + có thể + động từ*.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wish / If Only Clauses' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B2', 'Câu sau là ví dụ minh họa cho cấu trúc Wish / If Only clauses để thể hiện một điều ước không thể xảy ra:', 'I wish I had studied harder for this exam.', 'If only I could fly!', 'I wish I could fly!', 'If only I had studied harder for this exam.', 'B', 'B', 'Câu If only I could fly! là ví dụ minh họa cho cấu trúc Wish / If Only clauses để thể hiện một điều ước không thể xảy ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wish / If Only Clauses' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B2', 'Wish / If Only clauses thường được sử dụng trong các tình huống như:', 'Thể hiện một sự kiện đã xảy ra', 'Thể hiện một ước muốn hoặc một điều ước không thể xảy ra', 'Thể hiện một cảm giác hạnh phúc', 'Thể hiện một cảm giác buồn bã', 'B', 'B', 'Wish / If Only clauses thường được sử dụng trong các tình huống như thể hiện một ước muốn hoặc một điều ước không thể xảy ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wish / If Only Clauses' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B2', 'Mẹo học khi sử dụng Wish / If Only clauses là:', 'Không sử dụng Wish / If Only clauses một cách linh hoạt', 'Sử dụng Wish / If Only clauses một cách linh hoạt', 'Không chú ý đến ngữ cảnh và tình huống', 'Chú ý đến ngữ cảnh và tình huống', 'B', 'B', 'Mẹo học khi sử dụng Wish / If Only clauses là sử dụng nó một cách linh hoạt.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wish / If Only Clauses' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B2', 'Các lỗi thường gặp khi sử dụng Wish / If Only clauses là:', 'Sử dụng Wish / If Only clauses một cách linh hoạt', 'Không sử dụng Wish / If Only clauses một cách linh hoạt', 'Chú ý đến ngữ cảnh và tình huống', 'Không chú ý đến ngữ cảnh và tình huống', 'B', 'B', 'Các lỗi thường gặp khi sử dụng Wish / If Only clauses là không sử dụng nó một cách linh hoạt.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wish / If Only Clauses' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B2', 'Tóm tắt về Wish / If Only clauses là:', 'Một cấu trúc ngữ pháp quan trọng để thể hiện các sự kiện đã xảy ra', 'Một cấu trúc ngữ pháp quan trọng để thể hiện các ước muốn và điều ước không thể xảy ra', 'Một cấu trúc ngữ pháp quan trọng để thể hiện các cảm giác hạnh phúc', 'Một cấu trúc ngữ pháp quan trọng để thể hiện các cảm giác buồn bã', 'B', 'B', 'Tóm tắt về Wish / If Only clauses là một cấu trúc ngữ pháp quan trọng để thể hiện các ước muốn và điều ước không thể xảy ra.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wish / If Only Clauses' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B2', 'Câu sau không phải là ví dụ minh họa cho cấu trúc Wish / If Only clauses:', 'I wish I had studied harder for this exam.', 'If only I could fly!', 'I studied hard for this exam.', 'If only I had studied harder for this exam.', 'C', 'C', 'Câu I studied hard for this exam. không phải là ví dụ minh họa cho cấu trúc Wish / If Only clauses.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Wish / If Only Clauses' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc Wish / If Only clauses thường được sử dụng trong các tình huống như thể hiện:', 'Một sự kiện đã xảy ra', 'Một ước muốn hoặc một điều ước không thể xảy ra', 'Một cảm giác hạnh phúc', 'Một cảm giác buồn bã', 'B', 'B', 'Cấu trúc Wish / If Only clauses thường được sử dụng trong các tình huống như thể hiện một ước muốn hoặc một điều ước không thể xảy ra.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Future Perfect & Future Continuous', 'B2', '### Future Perfect & Future Continuous

#### Cấu trúc/Công thức (Formula)

Future Perfect: 
* S + sẽ + đã + V (hoặc V-ing) + O + bởi vì + thời điểm

Future Continuous: 
* S + sẽ + đang + V-ing + O + bởi vì + thời điểm

#### Cách dùng (Usage)

Future Perfect thường dùng để nói về một hành động sẽ kết thúc vào một thời điểm trong tương lai.
Future Continuous thường dùng để nói về một hành động sẽ tiếp diễn vào một thời điểm trong tương lai.

#### Ví dụ minh họa (Examples)

Future Perfect:
* Tôi sẽ đã học xong bài tập này vào lúc 5 giờ chiều.
* Họ sẽ đã hoàn thành dự án này vào cuối tháng này.

Future Continuous:
* Tôi sẽ đang học bài tập này vào lúc 5 giờ chiều.
* Họ sẽ đang làm việc vào cuối tuần này.

#### Mẹo học (Tips)

* Sử dụng Future Perfect khi nói về một hành động sẽ kết thúc vào một thời điểm trong tương lai.
* Sử dụng Future Continuous khi nói về một hành động sẽ tiếp diễn vào một thời điểm trong tương lai.

#### Các lỗi thường gặp (Common Mistakes)

* Sử dụng Future Perfect khi nói về một hành động sẽ tiếp diễn vào một thời điểm trong tương lai.
* Sử dụng Future Continuous khi nói về một hành động sẽ kết thúc vào một thời điểm trong tương lai.

#### Tóm tắt (Summary)

Future Perfect và Future Continuous là hai cấu trúc ngữ pháp quan trọng trong tiếng Anh. Future Perfect thường dùng để nói về một hành động sẽ kết thúc vào một thời điểm trong tương lai, trong khi Future Continuous thường dùng để nói về một hành động sẽ tiếp diễn vào một thời điểm trong tương lai.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Perfect & Future Continuous' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc của Future Perfect là gì?', 'S + sẽ + đang + V-ing + O + bởi vì + thời điểm', 'S + sẽ + đã + V (hoặc V-ing) + O + bởi vì + thời điểm', 'S + sẽ + đang + V + O + bởi vì + thời điểm', 'S + sẽ + đã + V-ing + O + bởi vì + thời điểm', 'B', 'B', 'Cấu trúc của Future Perfect là S + sẽ + đã + V (hoặc V-ing) + O + bởi vì + thời điểm.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Perfect & Future Continuous' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B2', 'Future Perfect thường dùng để nói về hành động gì?', 'Một hành động sẽ tiếp diễn vào một thời điểm trong tương lai', 'Một hành động sẽ kết thúc vào một thời điểm trong tương lai', 'Một hành động sẽ bắt đầu vào một thời điểm trong tương lai', 'Một hành động sẽ xảy ra vào một thời điểm trong tương lai', 'B', 'B', 'Future Perfect thường dùng để nói về một hành động sẽ kết thúc vào một thời điểm trong tương lai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Perfect & Future Continuous' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc của Future Continuous là gì?', 'S + sẽ + đang + V + O + bởi vì + thời điểm', 'S + sẽ + đã + V-ing + O + bởi vì + thời điểm', 'S + sẽ + đang + V-ing + O + bởi vì + thời điểm', 'S + sẽ + đã + V + O + bởi vì + thời điểm', 'C', 'C', 'Cấu trúc của Future Continuous là S + sẽ + đang + V-ing + O + bởi vì + thời điểm.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Perfect & Future Continuous' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B2', 'Future Continuous thường dùng để nói về hành động gì?', 'Một hành động sẽ kết thúc vào một thời điểm trong tương lai', 'Một hành động sẽ tiếp diễn vào một thời điểm trong tương lai', 'Một hành động sẽ bắt đầu vào một thời điểm trong tương lai', 'Một hành động sẽ xảy ra vào một thời điểm trong tương lai', 'B', 'B', 'Future Continuous thường dùng để nói về một hành động sẽ tiếp diễn vào một thời điểm trong tương lai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Perfect & Future Continuous' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B2', 'Dưới đây là ví dụ về Future Perfect: 
Tôi sẽ đã học xong bài tập này vào lúc 5 giờ chiều. 
Hãy chọn đáp án đúng!', 'Future Continuous', 'Future Perfect', 'Present Perfect', 'Past Perfect', 'B', 'B', 'Ví dụ này sử dụng Future Perfect để nói về một hành động sẽ kết thúc vào một thời điểm trong tương lai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Perfect & Future Continuous' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B2', 'Dưới đây là ví dụ về Future Continuous: 
Tôi sẽ đang học bài tập này vào lúc 5 giờ chiều. 
Hãy chọn đáp án đúng!', 'Future Perfect', 'Future Continuous', 'Present Perfect', 'Past Perfect', 'B', 'B', 'Ví dụ này sử dụng Future Continuous để nói về một hành động sẽ tiếp diễn vào một thời điểm trong tương lai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Perfect & Future Continuous' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B2', 'Sử dụng Future Perfect khi nói về hành động gì?', 'Một hành động sẽ tiếp diễn vào một thời điểm trong tương lai', 'Một hành động sẽ kết thúc vào một thời điểm trong tương lai', 'Một hành động sẽ bắt đầu vào một thời điểm trong tương lai', 'Một hành động sẽ xảy ra vào một thời điểm trong tương lai', 'B', 'B', 'Sử dụng Future Perfect khi nói về một hành động sẽ kết thúc vào một thời điểm trong tương lai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Perfect & Future Continuous' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B2', 'Sử dụng Future Continuous khi nói về hành động gì?', 'Một hành động sẽ kết thúc vào một thời điểm trong tương lai', 'Một hành động sẽ tiếp diễn vào một thời điểm trong tương lai', 'Một hành động sẽ bắt đầu vào một thời điểm trong tương lai', 'Một hành động sẽ xảy ra vào một thời điểm trong tương lai', 'B', 'B', 'Sử dụng Future Continuous khi nói về một hành động sẽ tiếp diễn vào một thời điểm trong tương lai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Perfect & Future Continuous' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B2', 'Future Perfect thường dùng để nói về một hành động sẽ kết thúc vào một thời điểm nào?', 'Một thời điểm trong quá khứ', 'Một thời điểm trong hiện tại', 'Một thời điểm trong tương lai', 'Một thời điểm trong quá khứ gần đây', 'C', 'C', 'Future Perfect thường dùng để nói về một hành động sẽ kết thúc vào một thời điểm trong tương lai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Future Perfect & Future Continuous' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B2', 'Future Continuous thường dùng để nói về một hành động sẽ tiếp diễn vào một thời điểm nào?', 'Một thời điểm trong quá khứ', 'Một thời điểm trong hiện tại', 'Một thời điểm trong tương lai', 'Một thời điểm trong quá khứ gần đây', 'C', 'C', 'Future Continuous thường dùng để nói về một hành động sẽ tiếp diễn vào một thời điểm trong tương lai.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Participle Clauses', 'B2', '### Cấu trúc/Công thức (Formula)
   Một cụm từ participle bao gồm một động từ participle (động từ được sử dụng như một tính từ) và một từ hoặc cụm từ làm chủ ngữ.

   ### Cách dùng (Usage)
   Cụm từ participle thường được sử dụng để mô tả hành động hoặc trạng thái của chủ ngữ.

   ### Ví dụ minh họa (Examples)
   - *Đang học* là một cụm từ participle mô tả hành động của tôi.
   - *Đã học* là một cụm từ participle mô tả trạng thái của tôi.

   ### Mẹo học (Tips)
   - Hãy nhớ rằng động từ participle thường được sử dụng để mô tả hành động hoặc trạng thái của chủ ngữ.
   - Hãy kiểm tra lại ngữ cảnh để đảm bảo rằng cụm từ participle được sử dụng đúng cách.

   ### Các lỗi thường gặp (Common Mistakes)
   - Không phân biệt được giữa động từ participle và động từ nguyên thể.
   - Không sử dụng cụm từ participle đúng cách trong ngữ cảnh.

   ### Tóm tắt (Summary)
   Cụm từ participle là một phần quan trọng của tiếng Anh, giúp mô tả hành động hoặc trạng thái của chủ ngữ. Hãy nhớ cách sử dụng và phân biệt giữa động từ participle và động từ nguyên thể để tránh các lỗi thường gặp.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc của cụm từ participle bao gồm?', 'Động từ participle + từ hoặc cụm từ làm chủ ngữ', 'Động từ nguyên thể + từ hoặc cụm từ làm chủ ngữ', 'Tính từ + từ hoặc cụm từ làm chủ ngữ', 'Động từ + từ hoặc cụm từ làm chủ ngữ', 'A', 'A', 'Cấu trúc của cụm từ participle bao gồm động từ participle và từ hoặc cụm từ làm chủ ngữ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B2', 'Cụm từ participle thường được sử dụng để mô tả?', 'Hành động của chủ ngữ', 'Trạng thái của chủ ngữ', 'Giá trị của chủ ngữ', 'Thời gian của chủ ngữ', 'B', 'B', 'Cụm từ participle thường được sử dụng để mô tả trạng thái của chủ ngữ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B2', 'Ví dụ về cụm từ participle là?', '*Đang học* là một cụm từ participle mô tả hành động của tôi.', '*Đã học* là một cụm từ participle mô tả trạng thái của tôi.', '*Sẽ học* là một cụm từ participle mô tả hành động của tôi.', '*Học* là một cụm từ participle mô tả trạng thái của tôi.', 'B', 'B', 'Ví dụ về cụm từ participle là *Đã học* là một cụm từ participle mô tả trạng thái của tôi.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B2', 'Mẹo học để tránh các lỗi thường gặp là?', 'Kiểm tra lại ngữ cảnh trước khi sử dụng cụm từ participle.', 'Sử dụng động từ nguyên thể thay cho động từ participle.', 'Sử dụng tính từ thay cho động từ participle.', 'Không sử dụng cụm từ participle.', 'A', 'A', 'Mẹo học để tránh các lỗi thường gặp là kiểm tra lại ngữ cảnh trước khi sử dụng cụm từ participle.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B2', 'Cụm từ participle thường được sử dụng trong ngữ cảnh nào?', 'Ngữ cảnh mô tả hành động của chủ ngữ.', 'Ngữ cảnh mô tả trạng thái của chủ ngữ.', 'Ngữ cảnh mô tả giá trị của chủ ngữ.', 'Ngữ cảnh mô tả thời gian của chủ ngữ.', 'B', 'B', 'Cụm từ participle thường được sử dụng trong ngữ cảnh mô tả trạng thái của chủ ngữ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc của cụm từ participle bao gồm động từ participle và?', 'Tính từ.', 'Từ hoặc cụm từ làm chủ ngữ.', 'Động từ nguyên thể.', 'Giá trị của chủ ngữ.', 'B', 'B', 'Cấu trúc của cụm từ participle bao gồm động từ participle và từ hoặc cụm từ làm chủ ngữ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B2', 'Ví dụ về cụm từ participle mô tả trạng thái của chủ ngữ là?', '*Đang học* là một cụm từ participle mô tả hành động của tôi.', '*Đã học* là một cụm từ participle mô tả trạng thái của tôi.', '*Sẽ học* là một cụm từ participle mô tả hành động của tôi.', '*Học* là một cụm từ participle mô tả trạng thái của tôi.', 'B', 'B', 'Ví dụ về cụm từ participle mô tả trạng thái của chủ ngữ là *Đã học* là một cụm từ participle mô tả trạng thái của tôi.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B2', 'Mẹo học để tránh các lỗi thường gặp là?', 'Sử dụng động từ nguyên thể thay cho động từ participle.', 'Sử dụng tính từ thay cho động từ participle.', 'Kiểm tra lại ngữ cảnh trước khi sử dụng cụm từ participle.', 'Không sử dụng cụm từ participle.', 'C', 'C', 'Mẹo học để tránh các lỗi thường gặp là kiểm tra lại ngữ cảnh trước khi sử dụng cụm từ participle.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B2', 'Cụm từ participle thường được sử dụng trong ngữ cảnh nào?', 'Ngữ cảnh mô tả hành động của chủ ngữ.', 'Ngữ cảnh mô tả trạng thái của chủ ngữ.', 'Ngữ cảnh mô tả giá trị của chủ ngữ.', 'Ngữ cảnh mô tả thời gian của chủ ngữ.', 'B', 'B', 'Cụm từ participle thường được sử dụng trong ngữ cảnh mô tả trạng thái của chủ ngữ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc của cụm từ participle bao gồm động từ participle và từ hoặc cụm từ làm chủ ngữ.', 'Động từ participle + tính từ.', 'Động từ participle + từ hoặc cụm từ làm chủ ngữ.', 'Động từ nguyên thể + từ hoặc cụm từ làm chủ ngữ.', 'Tính từ + từ hoặc cụm từ làm chủ ngữ.', 'B', 'B', 'Cấu trúc của cụm từ participle bao gồm động từ participle và từ hoặc cụm từ làm chủ ngữ.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Cleft Sentences', 'B2', '### Cleft Sentences
#### Cấu trúc/Công thức (Formula)
Câu chia đôi (Cleft sentence) là một loại câu phức tạp được tạo thành từ hai hoặc nhiều câu đơn. Cấu trúc cơ bản của câu chia đôi là:
It + được + động từ + chủ ngữ + phụ từ
#### Cách dùng (Usage)
Câu chia đôi thường được sử dụng để nhấn mạnh một phần của câu, tạo ra sự tập trung vào một chi tiết cụ thể.
#### Ví dụ minh họa (Examples)
- It was John who broke the window.
- What was it that you wanted to buy?
- It is not I who am going to the party.
#### Mẹo học (Tips)
- Sử dụng câu chia đôi để nhấn mạnh một phần của câu.
- Đảm bảo rằng động từ và chủ ngữ được đặt đúng vị trí trong câu.
- Sử dụng phụ từ để tạo ra sự liên kết giữa các phần của câu.
#### Các lỗi thường gặp (Common Mistakes)
- Sử dụng câu chia đôi không đúng cấu trúc.
- Không sử dụng phụ từ để tạo ra sự liên kết giữa các phần của câu.
#### Tóm tắt (Summary)
Câu chia đôi là một loại câu phức tạp được sử dụng để nhấn mạnh một phần của câu. Cấu trúc cơ bản của câu chia đôi là It + được + động từ + chủ ngữ + phụ từ.
', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'B2', 'Cấu trúc cơ bản của câu chia đôi là gì?', 'It + được + động từ + chủ ngữ + phụ từ', 'It + động từ + chủ ngữ + phụ từ', 'Động từ + chủ ngữ + phụ từ', 'Chủ ngữ + phụ từ + động từ', 'A', 'A', 'Cấu trúc cơ bản của câu chia đôi là It + được + động từ + chủ ngữ + phụ từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'B2', 'Câu chia đôi thường được sử dụng để làm gì?', 'Nhấn mạnh một phần của câu', 'Tạo ra sự tập trung vào một chi tiết cụ thể', 'Sử dụng để nói về một sự kiện', 'Sử dụng để nói về một người', 'B', 'B', 'Câu chia đôi thường được sử dụng để nhấn mạnh một phần của câu, tạo ra sự tập trung vào một chi tiết cụ thể.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'B2', 'Ví dụ về câu chia đôi là gì?', 'It was John who broke the window.', 'What was it that you wanted to buy?', 'It is not I who am going to the party.', 'All of the above', 'D', 'D', 'Tất cả các ví dụ trên đều là câu chia đôi.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'B2', 'Sử dụng câu chia đôi để nhấn mạnh một phần của câu như thế nào?', 'Sử dụng It + được + động từ + chủ ngữ + phụ từ', 'Sử dụng It + động từ + chủ ngữ + phụ từ', 'Sử dụng động từ + chủ ngữ + phụ từ', 'Sử dụng chủ ngữ + phụ từ + động từ', 'A', 'A', 'Sử dụng câu chia đôi để nhấn mạnh một phần của câu bằng cách sử dụng It + được + động từ + chủ ngữ + phụ từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'B2', 'Câu chia đôi thường gặp lỗi gì?', 'Sử dụng câu chia đôi không đúng cấu trúc', 'Không sử dụng phụ từ để tạo ra sự liên kết giữa các phần của câu', 'Sử dụng động từ không đúng', 'Sử dụng chủ ngữ không đúng', 'B', 'B', 'Câu chia đôi thường gặp lỗi không sử dụng phụ từ để tạo ra sự liên kết giữa các phần của câu.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'B2', 'Câu chia đôi có thể được sử dụng để nói về một người như thế nào?', 'Sử dụng It + được + động từ + chủ ngữ + phụ từ', 'Sử dụng It + động từ + chủ ngữ + phụ từ', 'Sử dụng động từ + chủ ngữ + phụ từ', 'Sử dụng chủ ngữ + phụ từ + động từ', 'A', 'A', 'Câu chia đôi có thể được sử dụng để nói về một người bằng cách sử dụng It + được + động từ + chủ ngữ + phụ từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'B2', 'Câu chia đôi có thể được sử dụng để tạo ra sự tập trung vào một chi tiết cụ thể như thế nào?', 'Sử dụng It + được + động từ + chủ ngữ + phụ từ', 'Sử dụng It + động từ + chủ ngữ + phụ từ', 'Sử dụng động từ + chủ ngữ + phụ từ', 'Sử dụng chủ ngữ + phụ từ + động từ', 'A', 'A', 'Câu chia đôi có thể được sử dụng để tạo ra sự tập trung vào một chi tiết cụ thể bằng cách sử dụng It + được + động từ + chủ ngữ + phụ từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'B2', 'Câu chia đôi thường được sử dụng trong các tình huống nào?', 'Tình huống cần nhấn mạnh một phần của câu', 'Tình huống cần tạo ra sự tập trung vào một chi tiết cụ thể', 'Tình huống cần nói về một người', 'Tất cả các tình huống trên', 'D', 'D', 'Câu chia đôi thường được sử dụng trong các tình huống cần nhấn mạnh một phần của câu, tạo ra sự tập trung vào một chi tiết cụ thể, hoặc nói về một người.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'B2', 'Câu chia đôi có thể được sử dụng để nhấn mạnh một phần của câu bằng cách sử dụng phụ từ như thế nào?', 'Sử dụng It + được + động từ + chủ ngữ + phụ từ', 'Sử dụng It + động từ + chủ ngữ + phụ từ', 'Sử dụng động từ + chủ ngữ + phụ từ', 'Sử dụng chủ ngữ + phụ từ + động từ', 'A', 'A', 'Câu chia đôi có thể được sử dụng để nhấn mạnh một phần của câu bằng cách sử dụng It + được + động từ + chủ ngữ + phụ từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'B2', 'Câu chia đôi thường gặp lỗi không sử dụng phụ từ để tạo ra sự liên kết giữa các phần của câu như thế nào?', 'Sử dụng It + được + động từ + chủ ngữ + phụ từ', 'Sử dụng It + động từ + chủ ngữ + phụ từ', 'Sử dụng động từ + chủ ngữ + phụ từ', 'Sử dụng chủ ngữ + phụ từ + động từ', 'B', 'B', 'Câu chia đôi thường gặp lỗi không sử dụng phụ từ để tạo ra sự liên kết giữa các phần của câu bằng cách sử dụng It + động từ + chủ ngữ + phụ từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'B2', 'Câu chia đôi có thể được sử dụng để tạo ra sự tập trung vào một chi tiết cụ thể bằng cách sử dụng It + được + động từ + chủ ngữ + phụ từ như thế nào?', 'Sử dụng It + được + động từ + chủ ngữ + phụ từ', 'Sử dụng It + động từ + chủ ngữ + phụ từ', 'Sử dụng động từ + chủ ngữ + phụ từ', 'Sử dụng chủ ngữ + phụ từ + động từ', 'A', 'A', 'Câu chia đôi có thể được sử dụng để tạo ra sự tập trung vào một chi tiết cụ thể bằng cách sử dụng It + được + động từ + chủ ngữ + phụ từ.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Inversion (Advanced structures)', 'C1', '# Inversion (Advanced structures)

## Cấu trúc/Công thức (Formula)

Inversion là một cấu trúc ngữ pháp phức tạp trong tiếng Anh, trong đó vị trí của các từ trong câu được đảo ngược. Cấu trúc cơ bản của Inversion là:

*   Câu chủ ngữ (Subject) đứng sau động từ (Verb)
*   Câu phụ ngữ (Predicate) đứng trước động từ (Verb)

## Cách dùng (Usage)

Inversion thường được sử dụng trong các trường hợp sau:

*   Khi muốn nhấn mạnh vào một chi tiết cụ thể trong câu
*   Khi muốn tạo ra một hiệu ứng đặc biệt trong văn bản
*   Khi muốn thể hiện sự ngạc nhiên hoặc bất ngờ

## Ví dụ minh họa (Examples)

*   It was she who ate the last cookie. (Câu chủ ngữ là ''she'', đứng sau động từ ''ate'')
*   What I need is a cup of coffee. (Câu phụ ngữ là ''a cup of coffee'', đứng trước động từ ''need'')

## Mẹo học (Tips)

*   Hãy tập trung vào việc sử dụng Inversion một cách linh hoạt và phù hợp với ngữ cảnh
*   Hãy đọc và nghe nhiều văn bản tiếng Anh để có thể nhận biết và sử dụng Inversion một cách tự nhiên

## Các lỗi thường gặp (Common Mistakes)

*   Sử dụng Inversion không đúng ngữ cảnh
*   Sử dụng Inversion không đúng cách

## Tóm tắt (Summary)

Inversion là một cấu trúc ngữ pháp phức tạp trong tiếng Anh, được sử dụng để nhấn mạnh vào một chi tiết cụ thể, tạo ra hiệu ứng đặc biệt hoặc thể hiện sự ngạc nhiên. Hãy sử dụng Inversion một cách linh hoạt và phù hợp với ngữ cảnh để có thể sử dụng nó một cách hiệu quả.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion (Advanced structures)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc cơ bản của Inversion là gì?', 'Câu chủ ngữ đứng trước động từ', 'Câu chủ ngữ đứng sau động từ', 'Câu phụ ngữ đứng trước động từ', 'Câu phụ ngữ đứng sau động từ', 'B', 'B', 'Cấu trúc cơ bản của Inversion là câu chủ ngữ đứng sau động từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion (Advanced structures)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'C1', 'Inversion thường được sử dụng trong trường hợp nào?', 'Khi muốn nhấn mạnh vào một chi tiết cụ thể', 'Khi muốn tạo ra một hiệu ứng đặc biệt', 'Khi muốn thể hiện sự ngạc nhiên hoặc bất ngờ', 'Tất cả các trường hợp trên', 'D', 'D', 'Inversion thường được sử dụng trong các trường hợp trên.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion (Advanced structures)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'C1', 'Ví dụ minh họa cho Inversion là gì?', 'It was she who ate the last cookie.', 'What I need is a cup of coffee.', 'She ate the last cookie.', 'I need a cup of coffee.', 'D', 'D', 'Câu ''She ate the last cookie.'' không phải là ví dụ minh họa cho Inversion, vì nó không có cấu trúc đảo ngược. Câu ''I need a cup of coffee.'' cũng không phải là ví dụ minh họa cho Inversion, vì nó không có cấu trúc đảo ngược.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion (Advanced structures)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'C1', 'Mẹo học để sử dụng Inversion một cách hiệu quả là gì?', 'Hãy đọc và nghe nhiều văn bản tiếng Anh', 'Hãy tập trung vào việc sử dụng Inversion một cách linh hoạt và phù hợp với ngữ cảnh', 'Hãy sử dụng Inversion không đúng ngữ cảnh', 'Hãy sử dụng Inversion không đúng cách', 'B', 'B', 'Mẹo học để sử dụng Inversion một cách hiệu quả là hãy tập trung vào việc sử dụng Inversion một cách linh hoạt và phù hợp với ngữ cảnh.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion (Advanced structures)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'C1', 'Các lỗi thường gặp khi sử dụng Inversion là gì?', 'Sử dụng Inversion không đúng ngữ cảnh', 'Sử dụng Inversion không đúng cách', 'Tất cả các lỗi trên', 'Không có lỗi nào', 'C', 'C', 'Các lỗi thường gặp khi sử dụng Inversion là sử dụng Inversion không đúng ngữ cảnh và sử dụng Inversion không đúng cách.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion (Advanced structures)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'C1', 'Inversion được sử dụng để nhấn mạnh vào một chi tiết cụ thể trong câu.', 'Đúng', 'Sai', 'Không rõ', 'Không có ý nghĩa', 'A', 'A', 'Inversion được sử dụng để nhấn mạnh vào một chi tiết cụ thể trong câu.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion (Advanced structures)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'C1', 'Inversion thường được sử dụng trong các trường hợp sau: nhấn mạnh vào một chi tiết cụ thể, tạo ra hiệu ứng đặc biệt, thể hiện sự ngạc nhiên hoặc bất ngờ.', 'Đúng', 'Sai', 'Không rõ', 'Không có ý nghĩa', 'A', 'A', 'Inversion thường được sử dụng trong các trường hợp trên.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion (Advanced structures)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'C1', 'Câu chủ ngữ đứng sau động từ là cấu trúc cơ bản của Inversion.', 'Đúng', 'Sai', 'Không rõ', 'Không có ý nghĩa', 'A', 'A', 'Câu chủ ngữ đứng sau động từ là cấu trúc cơ bản của Inversion.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion (Advanced structures)' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'C1', 'Inversion không được sử dụng để thể hiện sự ngạc nhiên hoặc bất ngờ.', 'Đúng', 'Sai', 'Không rõ', 'Không có ý nghĩa', 'B', 'B', 'Inversion được sử dụng để thể hiện sự ngạc nhiên hoặc bất ngờ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion (Advanced structures)' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'C1', 'Mẹo học để sử dụng Inversion một cách hiệu quả là hãy đọc và nghe nhiều văn bản tiếng Anh.', 'Đúng', 'Sai', 'Không rõ', 'Không có ý nghĩa', 'A', 'A', 'Mẹo học để sử dụng Inversion một cách hiệu quả là hãy tập trung vào việc sử dụng Inversion một cách linh hoạt và phù hợp với ngữ cảnh.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Inversion (Advanced structures)' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'C1', 'Các lỗi thường gặp khi sử dụng Inversion là sử dụng Inversion không đúng ngữ cảnh và sử dụng Inversion không đúng cách.', 'Đúng', 'Sai', 'Không rõ', 'Không có ý nghĩa', 'A', 'A', 'Các lỗi thường gặp khi sử dụng Inversion là sử dụng Inversion không đúng ngữ cảnh và sử dụng Inversion không đúng cách.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Participle Clauses (Advanced rhetorical usage)', 'C1', '# Câu từ participle (Câu từ động từ thứ hai)

## Cấu trúc/Công thức

Câu từ participle thường được sử dụng để mô tả hành động hoặc trạng thái của một người hoặc một vật thể trong một thời điểm cụ thể.

Cấu trúc cơ bản của câu từ participle là:

- Động từ participle (động từ thứ hai) + từ ngữ chỉ người hoặc vật thể

Ví dụ:

- Eating breakfast, she watched TV.

- Having studied for hours, he was still unable to solve the problem.

## Cách dùng

Câu từ participle thường được sử dụng để mô tả hành động hoặc trạng thái của một người hoặc một vật thể trong một thời điểm cụ thể.

- Mô tả hành động đang diễn ra tại thời điểm hiện tại:

  + Eating breakfast, she watched TV.

  + Having studied for hours, he was still unable to solve the problem.

- Mô tả hành động đã diễn ra trước thời điểm hiện tại:

  + Having eaten breakfast, she felt refreshed.

  + Having studied for hours, he was still unable to solve the problem.

## Ví dụ minh họa

- Eating breakfast, she watched TV.

- Having studied for hours, he was still unable to solve the problem.

- Having eaten breakfast, she felt refreshed.

- Having studied for hours, he was still unable to solve the problem.

## Mẹo học

- Hãy chú ý đến động từ participle và từ ngữ chỉ người hoặc vật thể trong câu từ participle.

- Hãy sử dụng câu từ participle để mô tả hành động hoặc trạng thái của một người hoặc một vật thể trong một thời điểm cụ thể.

## Các lỗi thường gặp

- Sử dụng động từ participle không đúng cách.

- Quên sử dụng từ ngữ chỉ người hoặc vật thể trong câu từ participle.

## Tóm tắt

Câu từ participle là một loại câu từ động từ thứ hai được sử dụng để mô tả hành động hoặc trạng thái của một người hoặc một vật thể trong một thời điểm cụ thể.

Cấu trúc cơ bản của câu từ participle là động từ participle + từ ngữ chỉ người hoặc vật thể.

Câu từ participle thường được sử dụng để mô tả hành động đang diễn ra tại thời điểm hiện tại hoặc hành động đã diễn ra trước thời điểm hiện tại.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses (Advanced rhetorical usage)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'C1', 'Câu từ participle thường được sử dụng để mô tả hành động nào?', 'Hành động đang diễn ra tại thời điểm hiện tại', 'Hành động đã diễn ra trước thời điểm hiện tại', 'Hành động sẽ diễn ra trong tương lai', 'Hành động không có thời gian cụ thể', 'A', 'A', 'Câu từ participle thường được sử dụng để mô tả hành động đang diễn ra tại thời điểm hiện tại.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses (Advanced rhetorical usage)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc cơ bản của câu từ participle là gì?', 'Động từ participle + từ ngữ chỉ người hoặc vật thể', 'Từ ngữ chỉ người hoặc vật thể + động từ participle', 'Động từ participle + tính từ', 'Tính từ + động từ participle', 'A', 'A', 'Cấu trúc cơ bản của câu từ participle là động từ participle + từ ngữ chỉ người hoặc vật thể.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses (Advanced rhetorical usage)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'C1', 'Câu từ participle thường được sử dụng để mô tả hành động nào trước thời điểm hiện tại?', 'Hành động đang diễn ra', 'Hành động đã diễn ra', 'Hành động sẽ diễn ra', 'Hành động không có thời gian cụ thể', 'B', 'B', 'Câu từ participle thường được sử dụng để mô tả hành động đã diễn ra trước thời điểm hiện tại.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses (Advanced rhetorical usage)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'C1', 'Câu từ participle thường được sử dụng để mô tả hành động nào trong tương lai?', 'Hành động đang diễn ra', 'Hành động đã diễn ra', 'Hành động sẽ diễn ra', 'Hành động không có thời gian cụ thể', 'C', 'C', 'Câu từ participle không thường được sử dụng để mô tả hành động sẽ diễn ra trong tương lai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses (Advanced rhetorical usage)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'C1', 'Câu từ participle thường được sử dụng để mô tả hành động nào không có thời gian cụ thể?', 'Hành động đang diễn ra', 'Hành động đã diễn ra', 'Hành động sẽ diễn ra', 'Hành động không có thời gian cụ thể', 'D', 'D', 'Câu từ participle không thường được sử dụng để mô tả hành động không có thời gian cụ thể.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses (Advanced rhetorical usage)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'C1', 'Câu từ participle thường được sử dụng để mô tả hành động nào trong một thời điểm cụ thể?', 'Hành động đang diễn ra', 'Hành động đã diễn ra', 'Hành động sẽ diễn ra', 'Hành động không có thời gian cụ thể', 'A', 'A', 'Câu từ participle thường được sử dụng để mô tả hành động đang diễn ra tại thời điểm hiện tại.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses (Advanced rhetorical usage)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc cơ bản của câu từ participle bao gồm động từ participle và từ ngữ chỉ người hoặc vật thể?', 'Đúng', 'Sai', 'Không rõ', 'Không có', 'A', 'A', 'Cấu trúc cơ bản của câu từ participle bao gồm động từ participle và từ ngữ chỉ người hoặc vật thể.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses (Advanced rhetorical usage)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'C1', 'Câu từ participle thường được sử dụng để mô tả hành động đã diễn ra trước thời điểm hiện tại?', 'Đúng', 'Sai', 'Không rõ', 'Không có', 'A', 'A', 'Câu từ participle thường được sử dụng để mô tả hành động đã diễn ra trước thời điểm hiện tại.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses (Advanced rhetorical usage)' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'C1', 'Câu từ participle thường được sử dụng để mô tả hành động sẽ diễn ra trong tương lai?', 'Đúng', 'Sai', 'Không rõ', 'Không có', 'B', 'B', 'Câu từ participle không thường được sử dụng để mô tả hành động sẽ diễn ra trong tương lai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses (Advanced rhetorical usage)' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'C1', 'Câu từ participle thường được sử dụng để mô tả hành động không có thời gian cụ thể?', 'Đúng', 'Sai', 'Không rõ', 'Không có', 'B', 'B', 'Câu từ participle không thường được sử dụng để mô tả hành động không có thời gian cụ thể.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Participle Clauses (Advanced rhetorical usage)' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'C1', 'Câu từ participle thường được sử dụng để mô tả hành động đang diễn ra tại thời điểm hiện tại?', 'Đúng', 'Sai', 'Không rõ', 'Không có', 'A', 'A', 'Câu từ participle thường được sử dụng để mô tả hành động đang diễn ra tại thời điểm hiện tại.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Subjunctive (Formal and legal use)', 'C1', '# Subjunctive (Formal và Legal use)

## Cấu trúc/Công thức (Formula)

Subjunctive là một trong những dạng ngữ pháp phức tạp trong tiếng Anh, thường được sử dụng trong các văn bản chính thức và pháp lý. Cấu trúc của subjunctive bao gồm:

* Động từ được viết ở dạng không hoàn thành (động từ không có tiền tố ''has'' hoặc ''have'')
* Động từ được viết ở dạng không hoàn thành ở ngôi thứ ba

Ví dụ:

* It is necessary that he be there. (Nó cần thiết rằng anh ấy phải có mặt)
* I suggest that she take a break. (Tôi đề nghị rằng cô ấy nên nghỉ ngơi)

## Cách dùng (Usage)

Subjunctive thường được sử dụng trong các trường hợp sau:

* Khi đề cập đến một sự kiện không chắc chắn hoặc có thể xảy ra
* Khi đề cập đến một điều kiện hoặc một sự kiện không chắc chắn
* Khi đề cập đến một hành động hoặc một tình huống không chắc chắn

Ví dụ:

* It is possible that he will be late. (Có thể anh ấy sẽ muộn)
* I doubt that she will pass the exam. (Tôi nghi ngờ rằng cô ấy sẽ không vượt qua kỳ thi)

## Ví dụ minh họa (Examples)

* It is necessary that he be there. (Nó cần thiết rằng anh ấy phải có mặt)
* I suggest that she take a break. (Tôi đề nghị rằng cô ấy nên nghỉ ngơi)
* It is possible that he will be late. (Có thể anh ấy sẽ muộn)
* I doubt that she will pass the exam. (Tôi nghi ngờ rằng cô ấy sẽ không vượt qua kỳ thi)

## Mẹo học (Tips)

* Hãy nhớ rằng subjunctive thường được sử dụng trong các văn bản chính thức và pháp lý
* Hãy chú ý đến cấu trúc của subjunctive và cách sử dụng nó trong các trường hợp khác nhau

## Các lỗi thường gặp (Common Mistakes)

* Sử dụng subjunctive không đúng cách trong các văn bản không chính thức
* Quên sử dụng subjunctive trong các trường hợp cần thiết

## Tóm tắt (Summary)

Subjunctive là một dạng ngữ pháp phức tạp trong tiếng Anh, thường được sử dụng trong các văn bản chính thức và pháp lý. Cấu trúc của subjunctive bao gồm động từ được viết ở dạng không hoàn thành và động từ được viết ở dạng không hoàn thành ở ngôi thứ ba. Subjunctive thường được sử dụng trong các trường hợp như đề cập đến một sự kiện không chắc chắn hoặc có thể xảy ra, đề cập đến một điều kiện hoặc một sự kiện không chắc chắn, đề cập đến một hành động hoặc một tình huống không chắc chắn.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Subjunctive (Formal and legal use)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc của subjunctive bao gồm động từ được viết ở dạng nào?', 'Dạng hoàn thành', 'Dạng không hoàn thành', 'Dạng hiện tại', 'Dạng quá khứ', 'B', 'B', 'Subjunctive bao gồm động từ được viết ở dạng không hoàn thành (động từ không có tiền tố ''has'' hoặc ''have'')');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Subjunctive (Formal and legal use)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'C1', 'Subjunctive thường được sử dụng trong các trường hợp nào?', 'Đề cập đến một sự kiện chắc chắn', 'Đề cập đến một sự kiện không chắc chắn hoặc có thể xảy ra', 'Đề cập đến một điều kiện hoặc một sự kiện chắc chắn', 'Đề cập đến một hành động hoặc một tình huống chắc chắn', 'B', 'B', 'Subjunctive thường được sử dụng trong các trường hợp như đề cập đến một sự kiện không chắc chắn hoặc có thể xảy ra, đề cập đến một điều kiện hoặc một sự kiện không chắc chắn, đề cập đến một hành động hoặc một tình huống không chắc chắn');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Subjunctive (Formal and legal use)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'C1', 'Ví dụ của subjunctive bao gồm?', 'It is necessary that he be there.', 'I suggest that she take a break.', 'It is possible that he will be late.', 'All of the above', 'D', 'D', 'Ví dụ của subjunctive bao gồm cả It is necessary that he be there., I suggest that she take a break., và It is possible that he will be late.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Subjunctive (Formal and legal use)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'C1', 'Subjunctive thường được sử dụng trong các văn bản nào?', 'Văn bản không chính thức', 'Văn bản chính thức và pháp lý', 'Văn bản hiện tại', 'Văn bản quá khứ', 'B', 'B', 'Subjunctive thường được sử dụng trong các văn bản chính thức và pháp lý');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Subjunctive (Formal and legal use)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc của subjunctive bao gồm động từ được viết ở ngôi thứ ba?', 'Không', 'Có', 'Không rõ', 'Không liên quan', 'B', 'B', 'Subjunctive bao gồm động từ được viết ở dạng không hoàn thành ở ngôi thứ ba');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Subjunctive (Formal and legal use)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'C1', 'Subjunctive thường được sử dụng trong các trường hợp như đề cập đến một điều kiện?', 'Không', 'Có', 'Không rõ', 'Không liên quan', 'B', 'B', 'Subjunctive thường được sử dụng trong các trường hợp như đề cập đến một điều kiện hoặc một sự kiện không chắc chắn');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Subjunctive (Formal and legal use)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'C1', 'Ví dụ của subjunctive bao gồm I doubt that she will pass the exam?', 'Không', 'Có', 'Không rõ', 'Không liên quan', 'B', 'B', 'Ví dụ của subjunctive bao gồm cả I doubt that she will pass the exam.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Subjunctive (Formal and legal use)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'C1', 'Subjunctive thường được sử dụng trong các văn bản không chính thức?', 'Không', 'Có', 'Không rõ', 'Không liên quan', 'A', 'A', 'Subjunctive thường được sử dụng trong các văn bản chính thức và pháp lý');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Subjunctive (Formal and legal use)' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc của subjunctive bao gồm động từ được viết ở dạng hiện tại?', 'Không', 'Có', 'Không rõ', 'Không liên quan', 'A', 'A', 'Subjunctive bao gồm động từ được viết ở dạng không hoàn thành (động từ không có tiền tố ''has'' hoặc ''have'')');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Subjunctive (Formal and legal use)' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'C1', 'Subjunctive thường được sử dụng trong các trường hợp như đề cập đến một hành động?', 'Không', 'Có', 'Không rõ', 'Không liên quan', 'B', 'B', 'Subjunctive thường được sử dụng trong các trường hợp như đề cập đến một hành động hoặc một tình huống không chắc chắn');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Subjunctive (Formal and legal use)' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'C1', 'Subjunctive thường được sử dụng trong các văn bản quá khứ?', 'Không', 'Có', 'Không rõ', 'Không liên quan', 'A', 'A', 'Subjunctive thường được sử dụng trong các văn bản chính thức và pháp lý');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Cleft Sentences (It was/What for emphasis)', 'C1', '### Cleft Sentences (It was/What for emphasis)
#### Cấu trúc/Công thức
Câu chia tách (cleft sentence) là một loại câu phức tạp được tạo ra bằng cách chia một câu đơn thành hai hoặc nhiều câu. Câu chia tách thường được sử dụng để nhấn mạnh một phần của câu hoặc để tạo ra một hiệu ứng khác biệt.

Cấu trúc chung của câu chia tách là:
- It was + động từ + chủ ngữ + ... (câu chia tách với It was)
- What + động từ + chủ ngữ + ... (câu chia tách với What)

#### Cách dùng
Câu chia tách thường được sử dụng để:
- Nhấn mạnh một phần của câu
- Tạo ra một hiệu ứng khác biệt
- Giúp người nói hoặc người viết nhấn mạnh một ý tưởng hoặc một chi tiết cụ thể

#### Ví dụ minh họa
- It was John who called me yesterday. (Câu chia tách với It was)
- What I need is a cup of coffee. (Câu chia tách với What)

#### Mẹo học
- Câu chia tách thường được sử dụng trong các câu phức tạp.
- Câu chia tách có thể được sử dụng để nhấn mạnh một phần của câu hoặc để tạo ra một hiệu ứng khác biệt.
- Hãy chú ý đến cấu trúc và cách dùng của câu chia tách để sử dụng nó một cách hiệu quả.

#### Các lỗi thường gặp
- Sử dụng câu chia tách không đúng cách
- Không chú ý đến cấu trúc và cách dùng của câu chia tách

#### Tóm tắt
Câu chia tách là một loại câu phức tạp được tạo ra bằng cách chia một câu đơn thành hai hoặc nhiều câu. Câu chia tách thường được sử dụng để nhấn mạnh một phần của câu hoặc để tạo ra một hiệu ứng khác biệt. Hãy chú ý đến cấu trúc và cách dùng của câu chia tách để sử dụng nó một cách hiệu quả.
', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences (It was/What for emphasis)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'C1', 'Câu chia tách thường được sử dụng để nhấn mạnh một phần của câu.', 'Không đúng', 'Đúng', 'Không rõ', 'Không liên quan', 'B', 'B', 'Câu chia tách thường được sử dụng để nhấn mạnh một phần của câu.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences (It was/What for emphasis)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc chung của câu chia tách là It was + động từ + chủ ngữ + ...', 'Đúng', 'Không đúng', 'Không rõ', 'Không liên quan', 'A', 'A', 'Cấu trúc chung của câu chia tách là It was + động từ + chủ ngữ + ...');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences (It was/What for emphasis)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'C1', 'Câu chia tách thường được sử dụng trong các câu đơn.', 'Đúng', 'Không đúng', 'Không rõ', 'Không liên quan', 'B', 'B', 'Câu chia tách thường được sử dụng trong các câu phức tạp.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences (It was/What for emphasis)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'C1', 'Câu chia tách có thể được sử dụng để tạo ra một hiệu ứng khác biệt.', 'Không đúng', 'Đúng', 'Không rõ', 'Không liên quan', 'B', 'B', 'Câu chia tách có thể được sử dụng để tạo ra một hiệu ứng khác biệt.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences (It was/What for emphasis)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'C1', 'Câu chia tách thường được sử dụng để nhấn mạnh một ý tưởng hoặc một chi tiết cụ thể.', 'Không đúng', 'Đúng', 'Không rõ', 'Không liên quan', 'B', 'B', 'Câu chia tách thường được sử dụng để nhấn mạnh một ý tưởng hoặc một chi tiết cụ thể.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences (It was/What for emphasis)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc chung của câu chia tách là What + động từ + chủ ngữ + ...', 'Đúng', 'Không đúng', 'Không rõ', 'Không liên quan', 'B', 'B', 'Cấu trúc chung của câu chia tách là It was + động từ + chủ ngữ + ...');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences (It was/What for emphasis)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'C1', 'Câu chia tách thường được sử dụng trong các câu phức tạp.', 'Không đúng', 'Đúng', 'Không rõ', 'Không liên quan', 'B', 'B', 'Câu chia tách thường được sử dụng trong các câu phức tạp.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences (It was/What for emphasis)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'C1', 'Câu chia tách có thể được sử dụng để nhấn mạnh một phần của câu.', 'Không đúng', 'Đúng', 'Không rõ', 'Không liên quan', 'B', 'B', 'Câu chia tách có thể được sử dụng để nhấn mạnh một phần của câu.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences (It was/What for emphasis)' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc chung của câu chia tách là It was + chủ ngữ + động từ + ...', 'Đúng', 'Không đúng', 'Không rõ', 'Không liên quan', 'B', 'B', 'Cấu trúc chung của câu chia tách là It was + động từ + chủ ngữ + ...');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences (It was/What for emphasis)' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'C1', 'Câu chia tách thường được sử dụng để tạo ra một hiệu ứng khác biệt.', 'Không đúng', 'Đúng', 'Không rõ', 'Không liên quan', 'B', 'B', 'Câu chia tách có thể được sử dụng để tạo ra một hiệu ứng khác biệt.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Cleft Sentences (It was/What for emphasis)' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'C1', 'Câu chia tách thường được sử dụng trong các câu đơn.', 'Đúng', 'Không đúng', 'Không rõ', 'Không liên quan', 'B', 'B', 'Câu chia tách thường được sử dụng trong các câu phức tạp.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Advanced Conditionals (Mixed và Alternatives to If)', 'C1', '# Điều kiện nâng cao (Mixed và Alternatives to If)

## Cấu trúc/Công thức (Formula)

Điều kiện nâng cao bao gồm các loại sau:

* Điều kiện hỗn hợp (Mixed Conditional): được sử dụng để mô tả một tình huống có thể xảy ra trong tương lai và kết quả của nó.
* Điều kiện thay thế (Alternative Conditional): được sử dụng để mô tả một tình huống có thể xảy ra trong tương lai và kết quả của nó, nhưng với một điều kiện thay thế.

Cấu trúc của điều kiện hỗn hợp là:

Nếu tôi học tiếng Anh, tôi sẽ đi du lịch đến Anh.

Cấu trúc của điều kiện thay thế là:

Nếu tôi học tiếng Anh, tôi sẽ đi du lịch đến Anh, nhưng tôi sẽ không đi nếu tôi không có tiền.

## Cách dùng (Usage)

Điều kiện nâng cao được sử dụng để mô tả các tình huống có thể xảy ra trong tương lai và kết quả của nó.

* Điều kiện hỗn hợp được sử dụng để mô tả các tình huống có thể xảy ra trong tương lai và kết quả của nó.
* Điều kiện thay thế được sử dụng để mô tả các tình huống có thể xảy ra trong tương lai và kết quả của nó, nhưng với một điều kiện thay thế.

## Ví dụ minh họa (Examples)

* Điều kiện hỗn hợp:

Nếu tôi học tiếng Anh, tôi sẽ đi du lịch đến Anh.

Nếu tôi không học tiếng Anh, tôi sẽ không đi du lịch đến Anh.

* Điều kiện thay thế:

Nếu tôi học tiếng Anh, tôi sẽ đi du lịch đến Anh, nhưng tôi sẽ không đi nếu tôi không có tiền.

Nếu tôi không học tiếng Anh, tôi sẽ không đi du lịch đến Anh, nhưng tôi sẽ đi nếu tôi có tiền.

## Mẹo học (Tips)

* Sử dụng điều kiện hỗn hợp để mô tả các tình huống có thể xảy ra trong tương lai và kết quả của nó.
* Sử dụng điều kiện thay thế để mô tả các tình huống có thể xảy ra trong tương lai và kết quả của nó, nhưng với một điều kiện thay thế.

## Các lỗi thường gặp (Common Mistakes)

* Sử dụng điều kiện hỗn hợp sai.
* Sử dụng điều kiện thay thế sai.

## Tóm tắt (Summary)

Điều kiện nâng cao bao gồm các loại sau:

* Điều kiện hỗn hợp (Mixed Conditional): được sử dụng để mô tả một tình huống có thể xảy ra trong tương lai và kết quả của nó.
* Điều kiện thay thế (Alternative Conditional): được sử dụng để mô tả một tình huống có thể xảy ra trong tương lai và kết quả của nó, nhưng với một điều kiện thay thế.

', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Conditionals (Mixed và Alternatives to If)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc của điều kiện hỗn hợp là gì?', 'Nếu tôi học tiếng Anh, tôi sẽ đi du lịch đến Anh.', 'Nếu tôi không học tiếng Anh, tôi sẽ không đi du lịch đến Anh.', 'Nếu tôi học tiếng Anh, tôi sẽ đi du lịch đến Anh, nhưng tôi sẽ không đi nếu tôi không có tiền.', 'Nếu tôi không học tiếng Anh, tôi sẽ không đi du lịch đến Anh, nhưng tôi sẽ đi nếu tôi có tiền.', 'A', 'A', 'Cấu trúc của điều kiện hỗn hợp là: Nếu tôi học tiếng Anh, tôi sẽ đi du lịch đến Anh.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Conditionals (Mixed và Alternatives to If)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'C1', 'Điều kiện hỗn hợp được sử dụng để mô tả tình huống nào?', 'Tình huống có thể xảy ra trong tương lai và kết quả của nó.', 'Tình huống có thể xảy ra trong quá khứ và kết quả của nó.', 'Tình huống có thể xảy ra trong hiện tại và kết quả của nó.', 'Tình huống có thể xảy ra trong tương lai và kết quả của nó, nhưng với một điều kiện thay thế.', 'A', 'A', 'Điều kiện hỗn hợp được sử dụng để mô tả tình huống có thể xảy ra trong tương lai và kết quả của nó.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Conditionals (Mixed và Alternatives to If)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc của điều kiện thay thế là gì?', 'Nếu tôi học tiếng Anh, tôi sẽ đi du lịch đến Anh.', 'Nếu tôi không học tiếng Anh, tôi sẽ không đi du lịch đến Anh.', 'Nếu tôi học tiếng Anh, tôi sẽ đi du lịch đến Anh, nhưng tôi sẽ không đi nếu tôi không có tiền.', 'Nếu tôi không học tiếng Anh, tôi sẽ không đi du lịch đến Anh, nhưng tôi sẽ đi nếu tôi có tiền.', 'C', 'C', 'Cấu trúc của điều kiện thay thế là: Nếu tôi học tiếng Anh, tôi sẽ đi du lịch đến Anh, nhưng tôi sẽ không đi nếu tôi không có tiền.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Conditionals (Mixed và Alternatives to If)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'C1', 'Điều kiện thay thế được sử dụng để mô tả tình huống nào?', 'Tình huống có thể xảy ra trong tương lai và kết quả của nó.', 'Tình huống có thể xảy ra trong tương lai và kết quả của nó, nhưng với một điều kiện thay thế.', 'Tình huống có thể xảy ra trong quá khứ và kết quả của nó.', 'Tình huống có thể xảy ra trong hiện tại và kết quả của nó.', 'B', 'B', 'Điều kiện thay thế được sử dụng để mô tả tình huống có thể xảy ra trong tương lai và kết quả của nó, nhưng với một điều kiện thay thế.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Conditionals (Mixed và Alternatives to If)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'C1', 'Sử dụng điều kiện hỗn hợp sai là lỗi thường gặp nào?', 'Sử dụng điều kiện hỗn hợp để mô tả tình huống có thể xảy ra trong quá khứ và kết quả của nó.', 'Sử dụng điều kiện hỗn hợp để mô tả tình huống có thể xảy ra trong hiện tại và kết quả của nó.', 'Sử dụng điều kiện hỗn hợp để mô tả tình huống có thể xảy ra trong tương lai và kết quả của nó, nhưng với một điều kiện thay thế.', 'Sử dụng điều kiện hỗn hợp để mô tả tình huống có thể xảy ra trong tương lai và kết quả của nó.', 'A', 'A', 'Sử dụng điều kiện hỗn hợp sai là lỗi thường gặp khi sử dụng điều kiện hỗn hợp để mô tả tình huống có thể xảy ra trong quá khứ và kết quả của nó.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Conditionals (Mixed và Alternatives to If)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'C1', 'Sử dụng điều kiện thay thế sai là lỗi thường gặp nào?', 'Sử dụng điều kiện thay thế để mô tả tình huống có thể xảy ra trong tương lai và kết quả của nó.', 'Sử dụng điều kiện thay thế để mô tả tình huống có thể xảy ra trong tương lai và kết quả của nó, nhưng với một điều kiện thay thế.', 'Sử dụng điều kiện thay thế để mô tả tình huống có thể xảy ra trong quá khứ và kết quả của nó.', 'Sử dụng điều kiện thay thế để mô tả tình huống có thể xảy ra trong hiện tại và kết quả của nó.', 'A', 'A', 'Sử dụng điều kiện thay thế sai là lỗi thường gặp khi sử dụng điều kiện thay thế để mô tả tình huống có thể xảy ra trong tương lai và kết quả của nó.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Advanced Conditionals (Mixed và Alternatives to If)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'C1', 'Điều kiện hỗn hợp được sử dụng để mô tả tình huống nào trong tương lai?', 'Tình huống có thể xảy ra trong tương lai và kết quả của nó.', 'Tình huống có thể xảy ra trong quá khứ và kết quả của nó.', 'Tình huống có thể xảy ra trong hiện tại và kết quả của nó.', 'Tình huống có thể xảy ra trong tương lai và kết quả của nó, nhưng với một điều kiện thay thế.', 'A', 'A', 'Điều kiện hỗn hợp được sử dụng để mô tả tình huống có thể xảy ra trong tương lai và kết quả của nó.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Relative Clauses with Prepositions', 'C1', '### Relative Clauses with Prepositions
#### Cấu trúc/Công thức
Relative clauses with prepositions được sử dụng để thêm thông tin về một người, một vật, một nơi, một sự kiện,... trong một câu. Cấu trúc của relative clauses with prepositions là:
- [Số tự đồng vị] + [Động từ] + [Preposition] + [Số tự đồng vị]
- [Số tự đồng vị] + [Động từ] + [Preposition] + [Số tự đồng vị] + [Động từ]
#### Cách dùng
Relative clauses with prepositions được sử dụng để thêm thông tin về một người, một vật, một nơi, một sự kiện,... trong một câu. Chúng thường được sử dụng để thêm thông tin về vị trí, thời gian, lý do, kết quả, v.v.
#### Ví dụ minh họa
- The book, which is on the table, is mine. (Sách đó, nằm trên bàn, là của tôi.)
- The city, where I live, is very beautiful. (Thành phố đó, nơi tôi sống, rất đẹp.)
- The teacher, who is standing at the door, is my friend. (Giáo viên đó, đứng ở cửa, là bạn của tôi.)
#### Mẹo học
- Hãy sử dụng relative clauses with prepositions để thêm thông tin về một người, một vật, một nơi, một sự kiện,...
- Hãy sử dụng các từ động từ phù hợp để thêm thông tin về vị trí, thời gian, lý do, kết quả, v.v.
#### Các lỗi thường gặp
- Sử dụng relative clauses with prepositions không đúng cấu trúc.
- Sử dụng các từ động từ không phù hợp.
- Không sử dụng relative clauses with prepositions để thêm thông tin về một người, một vật, một nơi, một sự kiện,...
#### Tóm tắt
Relative clauses with prepositions là một loại từ ngữ được sử dụng để thêm thông tin về một người, một vật, một nơi, một sự kiện,... trong một câu. Chúng thường được sử dụng để thêm thông tin về vị trí, thời gian, lý do, kết quả, v.v. Hãy sử dụng relative clauses with prepositions đúng cấu trúc và phù hợp với ngữ cảnh.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses with Prepositions' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc của relative clauses with prepositions là gì?', 'Số tự đồng vị + Động từ', 'Số tự đồng vị + Động từ + Preposition + Số tự đồng vị', 'Số tự đồng vị + Động từ + Preposition', 'Số tự đồng vị + Động từ + Số tự đồng vị', 'B', 'B', 'Cấu trúc của relative clauses with prepositions là: Số tự đồng vị + Động từ + Preposition + Số tự đồng vị.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses with Prepositions' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'C1', 'Relative clauses with prepositions được sử dụng để thêm thông tin về gì?', 'Một người', 'Một vật, một nơi, một sự kiện,...', 'Một thời gian', 'Một lý do', 'B', 'B', 'Relative clauses with prepositions được sử dụng để thêm thông tin về một vật, một nơi, một sự kiện,...');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses with Prepositions' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'C1', 'Ví dụ về relative clauses with prepositions là gì?', 'The book, which is on the table, is mine.', 'The city, where I live, is very beautiful.', 'The teacher, who is standing at the door, is my friend.', 'All of the above', 'D', 'D', 'Tất cả các ví dụ trên đều là relative clauses with prepositions.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses with Prepositions' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'C1', 'Relative clauses with prepositions thường được sử dụng để thêm thông tin về gì?', 'Vị trí', 'Thời gian', 'Lý do', 'Kết quả', 'D', 'D', 'Relative clauses with prepositions thường được sử dụng để thêm thông tin về kết quả.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses with Prepositions' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'C1', 'Sử dụng relative clauses with prepositions không đúng cấu trúc là một lỗi thường gặp.', 'Đúng', 'Sai', 'Không rõ', 'Không', 'A', 'A', 'Sử dụng relative clauses with prepositions không đúng cấu trúc là một lỗi thường gặp.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses with Prepositions' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'C1', 'Relative clauses with prepositions được sử dụng để thêm thông tin về một người, một vật, một nơi, một sự kiện,... trong một câu.', 'Đúng', 'Sai', 'Không rõ', 'Không', 'A', 'A', 'Relative clauses with prepositions được sử dụng để thêm thông tin về một người, một vật, một nơi, một sự kiện,... trong một câu.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses with Prepositions' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc của relative clauses with prepositions là: Số tự đồng vị + Động từ + Preposition + Số tự đồng vị + Động từ.', 'Đúng', 'Sai', 'Không rõ', 'Không', 'B', 'B', 'Cấu trúc của relative clauses with prepositions là: Số tự đồng vị + Động từ + Preposition + Số tự đồng vị.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses with Prepositions' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'C1', 'Relative clauses with prepositions thường được sử dụng để thêm thông tin về vị trí.', 'Đúng', 'Sai', 'Không rõ', 'Không', 'B', 'B', 'Relative clauses with prepositions thường được sử dụng để thêm thông tin về vị trí, thời gian, lý do, kết quả, v.v.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses with Prepositions' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'C1', 'Sử dụng relative clauses with prepositions không đúng cấu trúc là một lỗi thường gặp.', 'Đúng', 'Sai', 'Không rõ', 'Không', 'A', 'A', 'Sử dụng relative clauses with prepositions không đúng cấu trúc là một lỗi thường gặp.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses with Prepositions' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'C1', 'Relative clauses with prepositions được sử dụng để thêm thông tin về một người, một vật, một nơi, một sự kiện,... trong một câu.', 'Đúng', 'Sai', 'Không rõ', 'Không', 'A', 'A', 'Relative clauses with prepositions được sử dụng để thêm thông tin về một người, một vật, một nơi, một sự kiện,... trong một câu.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Relative Clauses with Prepositions' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc của relative clauses with prepositions là: Số tự đồng vị + Động từ + Preposition + Số tự đồng vị.', 'Đúng', 'Sai', 'Không rõ', 'Không', 'A', 'A', 'Cấu trúc của relative clauses with prepositions là: Số tự đồng vị + Động từ + Preposition + Số tự đồng vị.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Modals of Deduction and Speculation in the Past', 'C1', '### Modals of Deduction and Speculation in the Past

#### Cấu trúc/Công thức (Formula)

Các modal dùng để suy đoán hoặc suy luận về quá khứ bao gồm:

- *must have* (phải có)
- *can''t have* (không thể có)
- *may have* (có thể có)
- *might have* (có thể có)
- *should have* (nên có)
- *ought to have* (nên có)
- *would have* (có thể có)

#### Cách dùng (Usage)

- *must have*: dùng để nói về điều chắc chắn đã xảy ra trong quá khứ
- *can''t have*: dùng để nói về điều không thể xảy ra trong quá khứ
- *may have* và *might have*: dùng để nói về điều có thể xảy ra trong quá khứ
- *should have* và *ought to have*: dùng để nói về điều nên xảy ra trong quá khứ
- *would have*: dùng để nói về điều có thể xảy ra trong quá khứ

#### Ví dụ minh họa (Examples)

- *I must have left my keys at home.* (Tôi chắc chắn đã để chìa khóa tại nhà.)
- *She can''t have eaten all the cake by herself.* (Cô ấy không thể ăn hết tất cả bánh quy một mình.)
- *He may have forgotten his phone at the office.* (Anh ấy có thể đã quên điện thoại tại văn phòng.)

#### Mẹo học (Tips)

- Hãy sử dụng các modal đúng để thể hiện ý nghĩa của câu.
- Hãy sử dụng các ví dụ minh họa để hiểu rõ hơn về cách dùng của các modal.

#### Các lỗi thường gặp (Common Mistakes)

- Sử dụng các modal không đúng.
- Sử dụng các ví dụ minh họa không phù hợp.

#### Tóm tắt (Summary)

- Các modal dùng để suy đoán hoặc suy luận về quá khứ bao gồm *must have*, *can''t have*, *may have*, *might have*, *should have*, *ought to have*, và *would have*.
- Hãy sử dụng các modal đúng để thể hiện ý nghĩa của câu.
- Hãy sử dụng các ví dụ minh họa để hiểu rõ hơn về cách dùng của các modal.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Deduction and Speculation in the Past' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'C1', 'Câu sau dùng modal nào?', 'must have', 'can''t have', 'may have', 'should have', 'A', 'A', 'Câu sau dùng modal *must have* vì nó nói về điều chắc chắn đã xảy ra trong quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Deduction and Speculation in the Past' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'C1', 'Câu sau dùng modal nào?', 'may have', 'might have', 'should have', 'ought to have', 'B', 'B', 'Câu sau dùng modal *might have* vì nó nói về điều có thể xảy ra trong quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Deduction and Speculation in the Past' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'C1', 'Câu sau dùng modal nào?', 'can''t have', 'must have', 'may have', 'should have', 'A', 'A', 'Câu sau dùng modal *can''t have* vì nó nói về điều không thể xảy ra trong quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Deduction and Speculation in the Past' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'C1', 'Câu sau dùng modal nào?', 'would have', 'should have', 'ought to have', 'may have', 'A', 'A', 'Câu sau dùng modal *would have* vì nó nói về điều có thể xảy ra trong quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Deduction and Speculation in the Past' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'C1', 'Câu sau dùng modal nào?', 'must have', 'can''t have', 'may have', 'should have', 'B', 'B', 'Câu sau dùng modal *can''t have* vì nó nói về điều không thể xảy ra trong quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Deduction and Speculation in the Past' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'C1', 'Câu sau dùng modal nào?', 'may have', 'might have', 'should have', 'ought to have', 'A', 'A', 'Câu sau dùng modal *may have* vì nó nói về điều có thể xảy ra trong quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Deduction and Speculation in the Past' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'C1', 'Câu sau dùng modal nào?', 'would have', 'should have', 'ought to have', 'may have', 'C', 'C', 'Câu sau dùng modal *ought to have* vì nó nói về điều nên xảy ra trong quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Deduction and Speculation in the Past' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'C1', 'Câu sau dùng modal nào?', 'can''t have', 'must have', 'may have', 'should have', 'B', 'B', 'Câu sau dùng modal *must have* vì nó nói về điều chắc chắn đã xảy ra trong quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Deduction and Speculation in the Past' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'C1', 'Câu sau dùng modal nào?', 'may have', 'might have', 'should have', 'ought to have', 'D', 'D', 'Câu sau dùng modal *ought to have* vì nó nói về điều nên xảy ra trong quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Deduction and Speculation in the Past' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'C1', 'Câu sau dùng modal nào?', 'would have', 'should have', 'ought to have', 'may have', 'B', 'B', 'Câu sau dùng modal *should have* vì nó nói về điều nên xảy ra trong quá khứ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Modals of Deduction and Speculation in the Past' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'C1', 'Câu sau dùng modal nào?', 'can''t have', 'must have', 'may have', 'should have', 'C', 'C', 'Câu sau dùng modal *may have* vì nó nói về điều có thể xảy ra trong quá khứ.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Passive Voice (Advanced Structures with Reporting Verbs)', 'C1', '### Passive Voice (Advanced Structures with Reporting Verbs)
#### Cấu trúc/Công thức (Formula)
 Passive voice được sử dụng với các động từ báo cáo (reporting verbs) như: announce, claim, deny, report, say, state, suggest, và nhiều hơn nữa.

#### Cách dùng (Usage)
 Passive voice được sử dụng để thể hiện rằng một hành động đã được thực hiện bởi một người hoặc một nhóm người không được chỉ định.

#### Ví dụ minh họa (Examples)
 - The new policy will be announced next week. (Chính sách mới sẽ được công bố vào tuần tới.)
 - The company has been accused of exploiting its workers. (Công ty đã bị cáo buộc về việc bóc lột nhân viên.)
 - The results of the election will be announced tomorrow. (Kết quả bầu cử sẽ được công bố ngày mai.)

#### Mẹo học (Tips)
 - Sử dụng passive voice khi bạn muốn nhấn mạnh vào hành động chứ không phải người thực hiện hành động.
 - Sử dụng các động từ báo cáo để thể hiện rằng thông tin được truyền đạt từ một nguồn khác.

#### Các lỗi thường gặp (Common Mistakes)
 - Sử dụng passive voice không đúng chỗ, dẫn đến ngữ pháp không rõ ràng.
 - Không sử dụng các động từ báo cáo để thể hiện nguồn thông tin.

#### Tóm tắt (Summary)
 Passive voice là một cấu trúc ngữ pháp quan trọng trong tiếng Anh, được sử dụng để thể hiện hành động đã được thực hiện bởi một người hoặc một nhóm người không được chỉ định. Sử dụng các động từ báo cáo để thể hiện nguồn thông tin và nhấn mạnh vào hành động chứ không phải người thực hiện hành động.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Advanced Structures with Reporting Verbs)' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc của passive voice khi sử dụng với động từ báo cáo là gì?', 'S + V + O', 'S + được + V + O', 'S + V + O + được', 'S + O + V', 'B', 'B', 'Cấu trúc của passive voice khi sử dụng với động từ báo cáo là S + được + V + O.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Advanced Structures with Reporting Verbs)' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'C1', 'Dưới đây là một câu sử dụng passive voice: ''The new policy will be announced next week.'' Câu này thể hiện hành động được thực hiện bởi:', 'Một người cụ thể', 'Một nhóm người', 'Không ai', 'Một tổ chức', 'C', 'C', 'Câu này thể hiện hành động được thực hiện bởi không ai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Advanced Structures with Reporting Verbs)' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'C1', 'Dưới đây là một câu sử dụng động từ báo cáo: ''The company has been accused of exploiting its workers.'' Câu này thể hiện nguồn thông tin là:', 'Một người cụ thể', 'Một nhóm người', 'Một tổ chức', 'Không ai', 'C', 'C', 'Câu này thể hiện nguồn thông tin là một tổ chức.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Advanced Structures with Reporting Verbs)' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'C1', 'Sử dụng passive voice khi nào?', 'Khi muốn nhấn mạnh vào người thực hiện hành động', 'Khi muốn nhấn mạnh vào hành động', 'Khi muốn thể hiện nguồn thông tin', 'Khi muốn thể hiện thời gian', 'B', 'B', 'Sử dụng passive voice khi muốn nhấn mạnh vào hành động.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Advanced Structures with Reporting Verbs)' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'C1', 'Dưới đây là một câu sử dụng passive voice: ''The results of the election will be announced tomorrow.'' Câu này thể hiện hành động được thực hiện bởi:', 'Một người cụ thể', 'Một nhóm người', 'Không ai', 'Một tổ chức', 'C', 'C', 'Câu này thể hiện hành động được thực hiện bởi không ai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Advanced Structures with Reporting Verbs)' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'C1', 'Sử dụng động từ báo cáo khi nào?', 'Khi muốn thể hiện nguồn thông tin', 'Khi muốn nhấn mạnh vào người thực hiện hành động', 'Khi muốn thể hiện thời gian', 'Khi muốn thể hiện địa điểm', 'A', 'A', 'Sử dụng động từ báo cáo khi muốn thể hiện nguồn thông tin.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Advanced Structures with Reporting Verbs)' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'C1', 'Dưới đây là một câu sử dụng passive voice: ''The new policy will be announced next week.'' Câu này thể hiện hành động được thực hiện bởi:', 'Một người cụ thể', 'Một nhóm người', 'Không ai', 'Một tổ chức', 'C', 'C', 'Câu này thể hiện hành động được thực hiện bởi không ai.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Advanced Structures with Reporting Verbs)' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'C1', 'Sử dụng passive voice có thể dẫn đến:', 'Ngữ pháp rõ ràng', 'Ngữ pháp không rõ ràng', 'Sử dụng động từ báo cáo', 'Sử dụng thời gian', 'B', 'B', 'Sử dụng passive voice có thể dẫn đến ngữ pháp không rõ ràng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Advanced Structures with Reporting Verbs)' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'C1', 'Dưới đây là một câu sử dụng động từ báo cáo: ''The company has been accused of exploiting its workers.'' Câu này thể hiện nguồn thông tin là:', 'Một người cụ thể', 'Một nhóm người', 'Một tổ chức', 'Không ai', 'C', 'C', 'Câu này thể hiện nguồn thông tin là một tổ chức.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Advanced Structures with Reporting Verbs)' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'C1', 'Sử dụng passive voice khi muốn thể hiện:', 'Người thực hiện hành động', 'Hành động', 'Nguồn thông tin', 'Thời gian', 'B', 'B', 'Sử dụng passive voice khi muốn thể hiện hành động.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Passive Voice (Advanced Structures with Reporting Verbs)' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'C1', 'Dưới đây là một câu sử dụng passive voice: ''The results of the election will be announced tomorrow.'' Câu này thể hiện hành động được thực hiện bởi:', 'Một người cụ thể', 'Một nhóm người', 'Không ai', 'Một tổ chức', 'C', 'C', 'Câu này thể hiện hành động được thực hiện bởi không ai.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Nominalization', 'C1', '### Nominalization
#### Cấu trúc/Công thức
Nominalization là quá trình chuyển một động từ thành một tính từ hoặc một danh từ.

#### Cách dùng
Nominalization thường được sử dụng để tạo ra một danh từ mới từ một động từ hoặc một tính từ. Điều này giúp cho câu văn trở nên phong phú và đa dạng hơn.

#### Ví dụ minh họa
- Chuyển động từ thành danh từ: *The manager *is *managing* the project.* -> *The manager *of* the project*.
- Chuyển tính từ thành danh từ: *The city *is* beautiful.* -> *The beauty *of* the city*.

#### Mẹo học
- Hãy tập trung vào việc sử dụng nominalization trong các câu văn khác nhau.
- Hãy thử chuyển động từ và tính từ thành danh từ để tạo ra các câu văn mới.

#### Các lỗi thường gặp
- Sử dụng nominalization không đúng cách có thể dẫn đến sự nhầm lẫn trong câu văn.
- Hãy cẩn thận khi sử dụng nominalization để tránh các lỗi này.

#### Tóm tắt
Nominalization là một kỹ thuật quan trọng trong tiếng Anh giúp tạo ra các danh từ mới từ các động từ và tính từ. Hãy sử dụng nó một cách cẩn thận để tạo ra các câu văn phong phú và đa dạng.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Nominalization' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'C1', 'Nominalization thường được sử dụng để:', 'Tạo ra các động từ mới', 'Tạo ra các danh từ mới từ các động từ và tính từ', 'Tạo ra các tính từ mới', 'Tạo ra các câu văn đơn giản', 'B', 'B', 'Nominalization thường được sử dụng để tạo ra các danh từ mới từ các động từ và tính từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Nominalization' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc của nominalization thường bao gồm:', 'Động từ + danh từ', 'Tính từ + danh từ', 'Động từ/tính từ + danh từ', 'Danh từ + động từ', 'C', 'C', 'Cấu trúc của nominalization thường bao gồm động từ/tính từ + danh từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Nominalization' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'C1', 'Nominalization có thể được sử dụng trong các trường hợp sau:', 'Chỉ trong các câu văn phức tạp', 'Chỉ trong các câu văn đơn giản', 'Trong các câu văn khác nhau', 'Không được sử dụng trong bất kỳ trường hợp nào', 'C', 'C', 'Nominalization có thể được sử dụng trong các câu văn khác nhau.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Nominalization' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'C1', 'Sử dụng nominalization không đúng cách có thể dẫn đến:', 'Sự nhầm lẫn trong câu văn', 'Sự phức tạp trong câu văn', 'Sự đơn giản trong câu văn', 'Không có ảnh hưởng nào', 'A', 'A', 'Sử dụng nominalization không đúng cách có thể dẫn đến sự nhầm lẫn trong câu văn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Nominalization' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'C1', 'Nominalization thường được sử dụng trong các lĩnh vực sau:', 'Tiếng Anh', 'Toán học', 'Văn học', 'Tất cả các lĩnh vực', 'D', 'D', 'Nominalization thường được sử dụng trong tất cả các lĩnh vực.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Nominalization' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'C1', 'Câu văn sau sử dụng nominalization đúng cách hay không?', 'The manager of the company is very experienced.', 'The manager is very experienced.', 'The manager of the company is very experiencedly.', 'The manager is very experiencedly.', 'A', 'A', 'Câu văn ''The manager of the company is very experienced.'' sử dụng nominalization đúng cách.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Nominalization' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'C1', 'Nominalization có thể được sử dụng để:', 'Tạo ra các động từ mới', 'Tạo ra các danh từ mới từ các động từ và tính từ', 'Tạo ra các tính từ mới', 'Tạo ra các câu văn đơn giản', 'B', 'B', 'Nominalization có thể được sử dụng để tạo ra các danh từ mới từ các động từ và tính từ.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Nominalization' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'C1', 'Câu văn sau sử dụng nominalization không đúng cách hay không?', 'The beauty of the city is very beautiful.', 'The city is very beautiful.', 'The beauty of the city is very beautifuly.', 'The city is very beautifuly.', 'C', 'C', 'Câu văn ''The beauty of the city is very beautifuly.'' sử dụng nominalization không đúng cách.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Nominalization' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'C1', 'Nominalization thường được sử dụng trong các trường hợp sau:', 'Chỉ trong các câu văn phức tạp', 'Chỉ trong các câu văn đơn giản', 'Trong các câu văn khác nhau', 'Không được sử dụng trong bất kỳ trường hợp nào', 'C', 'C', 'Nominalization có thể được sử dụng trong các câu văn khác nhau.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Nominalization' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'C1', 'Sử dụng nominalization không đúng cách có thể dẫn đến:', 'Sự nhầm lẫn trong câu văn', 'Sự phức tạp trong câu văn', 'Sự đơn giản trong câu văn', 'Không có ảnh hưởng nào', 'A', 'A', 'Sử dụng nominalization không đúng cách có thể dẫn đến sự nhầm lẫn trong câu văn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Nominalization' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'C1', 'Nominalization thường được sử dụng trong các lĩnh vực sau:', 'Tiếng Anh', 'Toán học', 'Văn học', 'Tất cả các lĩnh vực', 'D', 'D', 'Nominalization thường được sử dụng trong tất cả các lĩnh vực.');
INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', 'Conjunctions and Linking Words for Complex Rhetorical Structures', 'C1', '# Cấu trúc và công thức của các từ nối và từ liên kết phức tạp

## Cấu trúc và công thức

Cấu trúc của các từ nối và từ liên kết phức tạp thường bao gồm một hoặc nhiều từ nối và từ liên kết được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn.

### Ví dụ

- **Và**: A và B, A và B và C
- **Hoặc**: A hoặc B, A hoặc B hoặc C
- **Nhưng**: A nhưng B, A nhưng B và C
- **Vì**: A vì B, A vì B và C
- **Mặc dù**: A mặc dù B, A mặc dù B và C

## Cách dùng

- **Và**: Sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ tích cực.
- **Hoặc**: Sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ đối lập.
- **Nhưng**: Sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ đối lập nhưng có thể có một số điểm tương đồng.
- **Vì**: Sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ nguyên nhân và kết quả.
- **Mặc dù**: Sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ đối lập nhưng có thể có một số điểm tương đồng.

## Ví dụ minh họa

- **Và**: Tôi yêu đọc sách và xem phim.
- **Hoặc**: Tôi có thể đi bộ hoặc chạy để tập thể dục.
- **Nhưng**: Tôi muốn đi du lịch nhưng không có tiền.
- **Vì**: Tôi học tập chăm chỉ vì muốn trở thành một chuyên gia trong lĩnh vực của mình.
- **Mặc dù**: Tôi không thích đi học mặc dù tôi biết nó rất quan trọng.

## Mẹo học

- Hãy sử dụng các từ nối và từ liên kết một cách linh hoạt để tạo nên các cấu trúc phức tạp.
- Hãy chú ý đến mối quan hệ giữa các ý tưởng, câu hoặc đoạn văn để sử dụng các từ nối và từ liên kết phù hợp.

## Các lỗi thường gặp

- Sử dụng các từ nối và từ liên kết không phù hợp với mối quan hệ giữa các ý tưởng, câu hoặc đoạn văn.
- Sử dụng các từ nối và từ liên kết quá nhiều hoặc quá ít.

## Tóm tắt

- Các từ nối và từ liên kết phức tạp được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ phức tạp.
- Hãy sử dụng các từ nối và từ liên kết một cách linh hoạt và phù hợp với mối quan hệ giữa các ý tưởng, câu hoặc đoạn văn.', 15, 10);
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions and Linking Words for Complex Rhetorical Structures' ORDER BY id DESC LIMIT 1), 1, 'MULTIPLE_CHOICE', 'C1', 'Cấu trúc của từ nối và từ liên kết phức tạp bao gồm?', 'Một hoặc nhiều từ nối và từ liên kết', 'Một từ nối và một từ liên kết', 'Hai từ nối và hai từ liên kết', 'Ba từ nối và ba từ liên kết', 'A', 'A', 'Cấu trúc của từ nối và từ liên kết phức tạp thường bao gồm một hoặc nhiều từ nối và từ liên kết được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions and Linking Words for Complex Rhetorical Structures' ORDER BY id DESC LIMIT 1), 2, 'MULTIPLE_CHOICE', 'C1', 'Từ nối và từ liên kết nào được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ tích cực?', 'Và', 'Hoặc', 'Nhưng', 'Vì', 'A', 'A', 'Từ nối và từ liên kết ''và'' được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ tích cực.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions and Linking Words for Complex Rhetorical Structures' ORDER BY id DESC LIMIT 1), 3, 'MULTIPLE_CHOICE', 'C1', 'Từ nối và từ liên kết nào được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ đối lập?', 'Và', 'Hoặc', 'Nhưng', 'Mặc dù', 'B', 'B', 'Từ nối và từ liên kết ''hoặc'' được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ đối lập.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions and Linking Words for Complex Rhetorical Structures' ORDER BY id DESC LIMIT 1), 4, 'MULTIPLE_CHOICE', 'C1', 'Từ nối và từ liên kết nào được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ nguyên nhân và kết quả?', 'Vì', 'Mặc dù', 'Nhưng', 'Hoặc', 'A', 'A', 'Từ nối và từ liên kết ''vì'' được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ nguyên nhân và kết quả.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions and Linking Words for Complex Rhetorical Structures' ORDER BY id DESC LIMIT 1), 5, 'MULTIPLE_CHOICE', 'C1', 'Từ nối và từ liên kết nào được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ đối lập nhưng có thể có một số điểm tương đồng?', 'Và', 'Hoặc', 'Nhưng', 'Mặc dù', 'D', 'D', 'Từ nối và từ liên kết ''mặc dù'' được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ đối lập nhưng có thể có một số điểm tương đồng.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions and Linking Words for Complex Rhetorical Structures' ORDER BY id DESC LIMIT 1), 6, 'MULTIPLE_CHOICE', 'C1', 'Sử dụng từ nối và từ liên kết không phù hợp với mối quan hệ giữa các ý tưởng, câu hoặc đoạn văn là một lỗi thường gặp.', 'Đúng', 'Sai', 'Không rõ', 'Không liên quan', 'A', 'A', 'Sử dụng từ nối và từ liên kết không phù hợp với mối quan hệ giữa các ý tưởng, câu hoặc đoạn văn là một lỗi thường gặp.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions and Linking Words for Complex Rhetorical Structures' ORDER BY id DESC LIMIT 1), 7, 'MULTIPLE_CHOICE', 'C1', 'Sử dụng từ nối và từ liên kết quá nhiều hoặc quá ít là một lỗi thường gặp.', 'Đúng', 'Sai', 'Không rõ', 'Không liên quan', 'A', 'A', 'Sử dụng từ nối và từ liên kết quá nhiều hoặc quá ít là một lỗi thường gặp.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions and Linking Words for Complex Rhetorical Structures' ORDER BY id DESC LIMIT 1), 8, 'MULTIPLE_CHOICE', 'C1', 'Từ nối và từ liên kết phức tạp được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ phức tạp.', 'Đúng', 'Sai', 'Không rõ', 'Không liên quan', 'A', 'A', 'Từ nối và từ liên kết phức tạp được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ phức tạp.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions and Linking Words for Complex Rhetorical Structures' ORDER BY id DESC LIMIT 1), 9, 'MULTIPLE_CHOICE', 'C1', 'Hãy sử dụng từ nối và từ liên kết một cách linh hoạt và phù hợp với mối quan hệ giữa các ý tưởng, câu hoặc đoạn văn.', 'Đúng', 'Sai', 'Không rõ', 'Không liên quan', 'A', 'A', 'Hãy sử dụng từ nối và từ liên kết một cách linh hoạt và phù hợp với mối quan hệ giữa các ý tưởng, câu hoặc đoạn văn.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions and Linking Words for Complex Rhetorical Structures' ORDER BY id DESC LIMIT 1), 10, 'MULTIPLE_CHOICE', 'C1', 'Từ nối và từ liên kết ''và'' được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ đối lập.', 'Đúng', 'Sai', 'Không rõ', 'Không liên quan', 'B', 'B', 'Từ nối và từ liên kết ''và'' được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ tích cực.');
INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = 'Conjunctions and Linking Words for Complex Rhetorical Structures' ORDER BY id DESC LIMIT 1), 11, 'MULTIPLE_CHOICE', 'C1', 'Từ nối và từ liên kết ''hoặc'' được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ tích cực.', 'Đúng', 'Sai', 'Không rõ', 'Không liên quan', 'B', 'B', 'Từ nối và từ liên kết ''hoặc'' được sử dụng để kết nối các ý tưởng, câu hoặc đoạn văn có mối quan hệ đối lập.');
