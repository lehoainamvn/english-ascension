import os
import re

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "sql_output"))
NEW_SEED_PATH = os.path.join(OUTPUT_DIR, "seed_all_new.sql")

TRANSLATE_DICT = {
    # --- LISTENING A1 ---
    # Greeting a New Neighbor
    "Ai là người mới chuyển đến sống cạnh John?": "Who just moved in next to John?",
    "Một người hàng xóm khác": "Another neighbor",
    "Người quản lý tòa nhà": "The building manager",
    "Lisa là người mới chuyển đến sống cạnh John.": "Lisa is the one who just moved in next to John.",
    "John cảm thấy thế nào về việc chuyển đến nhà mới?": "How does John feel about moving to the new house?",
    "Hạnh phúc": "Happy",
    "Buồn": "Sad",
    "Không có cảm giác gì": "No feeling",
    "John cảm thấy mệt mỏi vì việc chuyển đến nhà mới.": "John feels tired because of the move today.",
    "Lisa có giúp đỡ John gì không?": "Does Lisa offer any help to John?",
    "Đi mua sắm": "Go shopping",
    "Đi làm": "Go to work",
    "Đóng gói đồ đạc": "Pack things",
    "Đóng gói đồ đạc và giúp đỡ John": "Helping John unpack",
    "Lisa đề nghị giúp đỡ John đóng gói đồ đạc và giúp đỡ John.": "Lisa offers to help John unpack his things.",
    "John có cần giúp đỡ gì không?": "Does John need any help?",
    "Có, tôi cần giúp đỡ": "Yes, I need help",
    "Không, tôi không cần giúp đỡ": "No, thanks. I'm good.",
    "Có thể, nhưng tôi không cần giúp đỡ ngay bây giờ": "Maybe, but I do not need help right now",
    "John nói rằng không cần giúp đỡ.": "John says he is good and doesn't need help.",
    "John cảm thấy thế nào về việc sống ở khu phố mới?": "How does John feel about living in the new neighborhood?",
    "Tốt": "Good",
    "Khá": "Fair",
    "Không tốt": "Bad",
    "John nói rằng hạnh phúc khi sống ở khu phố mới.": "John is glad to be in the new neighborhood.",

    # Asking for Directions to the Library
    "John đang tìm kiếm đâu?": "Where is John looking for?",
    "Thư viện": "The library",
    "Cửa hàng": "The store",
    "Trạm xe buýt": "The bus station",
    "Cafe": "The cafe",
    "John đang tìm kiếm thư viện.": "John is looking for the library.",
    "Lisa chỉ John đi trái hay phải?": "Does Lisa tell John to turn left or right?",
    "Trái": "Left",
    "Phải": "Right",
    "Trên": "Up",
    "Dưới": "Down",
    "Lisa chỉ John đi trái tại đèn giao thông.": "Lisa tells John to turn left at the traffic light.",
    "Thời gian để đi đến thư viện là bao lâu?": "How long does it take to walk to the library?",
    "5 phút": "5 minutes",
    "10 phút": "10 minutes",
    "15 phút": "15 minutes",
    "20 phút": "20 minutes",
    "Lisa nói thời gian để đi đến thư viện là 5 phút.": "Lisa says it is a five-minute walk.",
    "John cảm ơn Lisa bao nhiêu lần?": "How many times does John thank Lisa?",
    "1 lần": "Once",
    "2 lần": "Twice",
    "3 lần": "Three times",
    "4 lần": "Four times",
    "John cảm ơn Lisa 2 lần trong cuộc trò chuyện.": "John thanks Lisa twice during the conversation.",
    "Đường đến thư viện có khó khăn không?": "Is the way to the library difficult?",
    "Khó": "Difficult",
    "Dễ": "Easy",
    "Trung bình": "Moderate",
    "Không rõ": "Unclear",
    "Lisa nói đường đến thư viện chỉ cần đi 5 phút.": "Lisa shows a very simple path that takes only 5 minutes.",

    # Ordering Food at a Café
    "John muốn uống gì?": "What does John want to drink?",
    "Cài phê": "Coffee",
    "Cà phê": "Coffee",
    "Nước": "Water",
    "Trà": "Tea",
    "Soda": "Soda",
    "John muốn uống cà phê.": "John wants to order a coffee.",
    "John muốn ăn gì?": "What does John want to eat?",
    "Ham và phô mai": "Ham and cheese sandwich",
    "Thịt gà": "Chicken",
    "Cá": "Fish",
    "Trứng": "Eggs",
    "John muốn ăn một sandwich ham và phô mai.": "John wants a ham and cheese sandwich.",
    "John sẽ trả tiền bằng cách nào?": "How will John pay for his order?",
    "Thẻ tín dụng": "Card",
    "Tiền mặt": "Cash",
    "Quẹt thẻ": "Swipe card",
    "Đổi tiền": "Exchange money",
    "John sẽ trả tiền bằng thẻ tín dụng.": "John says he will pay with card.",
    "Giá của sandwich là bao nhiêu?": "How much is the sandwich?",
    "$5.00": "$5.00",
    "$5.50": "$5.50",
    "$6.00": "$6.00",
    "$7.00": "$7.00",
    "Giá của sandwich là $5.50.": "The total price is $5.50.",
    "Lisa hỏi John điều gì?": "What does Lisa ask John?",
    "Anh muốn uống gì?": "What would you like to drink?",
    "Anh muốn ăn gì?": "What kind of sandwich would you like?",
    "Anh sẽ trả tiền bằng cách nào?": "Would you like to pay with card or cash?",
    "Lisa hỏi John anh muốn ăn gì.": "Lisa asks John what kind of sandwich he would like.",

    # Buying a Train Ticket
    "John muốn đi đến đâu?": "Where is John travelling to?",
    "Manchester": "Manchester",
    "London": "London",
    "Birmingham": "Birmingham",
    "Liverpool": "Liverpool",
    "John muốn đi đến London.": "John wants to buy a train ticket to London.",
    "Lịch trình của John là gì?": "What is John's preferred schedule?",
    "Đi tàu vào buổi tối": "Leave in the evening",
    "Đi tàu vào buổi sáng": "Leave in the morning",
    "Đi tàu vào buổi trưa": "Leave at noon",
    "John muốn đi tàu vào buổi sáng.": "John wants to leave at 9 am.",
    "Giá vé của John là bao nhiêu?": "How much does the ticket cost?",
    "£40": "£40",
    "£50": "£50",
    "£60": "£60",
    "£70": "£70",
    "Giá vé của John là £50.": "Lisa says the ticket will be £50.",
    "Lisa hỏi John về lịch trình, giá vé và điểm đến.": "Lisa asks John where he is coming from, his schedule, etc.",
    "John muốn mua vé tàu đến đâu?": "Where does John want to buy a train ticket to?",
    "John muốn mua vé tàu đến London.": "John wants to buy a train ticket to London.",

    # Weather Forecast Report
    "Hôm nay thời tiết sẽ như thế nào?": "How is the weather forecast today?",
    "Nắng mưa": "Rainy and sunny",
    "Nắng đẹp": "Sunny",
    "Mưa gió": "Rainy and windy",
    "Gió mạnh": "Strong winds",
    "Hôm nay thời tiết sẽ nắng đẹp với nhiệt độ cao nhất 22 độ C.": "Today is expected to be sunny with a high of 22 degrees Celsius.",
    "Nhiệt độ cao nhất hôm nay là bao nhiêu?": "What is the high temperature today?",
    "20 độ C": "20 degrees Celsius",
    "22 độ C": "22 degrees Celsius",
    "25 độ C": "25 degrees Celsius",
    "30 độ C": "30 degrees Celsius",
    "Nhiệt độ cao nhất hôm nay là 22 độ C.": "The expected high is 22 degrees Celsius.",
    "Hôm nay có gió không?": "Will it be windy today?",
    "Có": "Yes",
    "Không": "No",
    "Không chắc chắn": "Not sure",
    "Hôm nay sẽ có gió trong chiều tối.": "It will be a bit windy in the afternoon.",
    "Nếu bạn đi làm, bạn nên chuẩn bị gì?": "What should you bring if you go out / commute?",
    "Găng tay": "Gloves",
    "Đôi giày": "Shoes",
    "Đôi kính": "Glasses",
    "Nếu bạn đi làm, bạn nên chuẩn bị một chiếc ô để chống mưa.": "John suggests not to forget your umbrella.",
    "Cảm ơn ai?": "Who is being thanked / Who said goodbye?",
    "Cả hai": "Both",
    "Không ai": "No one",
    "Cảm ơn cả John và Lisa vì đã đưa ra thông tin thời tiết hôm nay.": "Both John and Lisa presented the weather forecast.",

    # --- READING A1 ---
    # My Daily Routine
    "Tôi thức dậy lúc mấy giờ?": "What time do I wake up?",
    "Tôi đi xe buýt đến trường vì?": "Why do I take the bus to school?",
    "Tôi làm bài tập về nhà trong giờ?": "When do I do my homework?",
    "Tôi ăn sáng vì?": "Why do I eat breakfast?",
    "Tôi đi ngủ lúc mấy giờ?": "What time do I go to bed?",
    # Introducing My Family
    "Tên của em là gì?": "What is my name?",
    "Mẹ em làm gì?": "What does my mother do?",
    "Bố em làm việc ở đâu?": "Where does my father work?",
    "Gia đình em ăn bữa tối lúc mấy giờ?": "What time does my family have dinner?",
    "Em có em trai nhỏ tên gì?": "What is my little brother's name?",
    # A Day at the Zoo
    "Emma và gia đình cô đi đến sở thú bằng phương tiện gì?": "How do Emma and her family go to the zoo?",
    "Emma thấy một quảng cáo lớn cho sở thú ở đâu?": "Where does Emma see a big advertisement for the zoo?",
    "Con động vật lớn mà Emma thấy đầu tiên là gì?": "What is the first big animal Emma sees?",
    "Emma thấy khỉ đang ăn gì?": "What does Emma see the monkey eating?",
    "Emma có một ngày tuyệt vời tại sở thú vì sao?": "Why does Emma have a great time at the zoo?",
    # My Favorite Hobby
    "Hobby yêu thích của tôi là gì?": "What is my favorite hobby?",
    "Tôi chơi bóng đá với ai?": "Who do I play soccer with?",
    "Tôi chơi bóng đá ở đâu?": "Where do I play soccer?",
    "Tôi thích chơi bóng đá vì lý do gì?": "Why do I like playing soccer?",
    "Tôi chơi bóng đá vào thời gian nào?": "When do I play soccer?",
    # Welcome to My House
    "Tôi sống ở đâu?": "Where do I live?",
    "Ngôi nhà của tôi có bao nhiêu phòng ngủ?": "How many bedrooms does my house have?",
    "Tôi thích làm gì trong phòng khách?": "What do I like to do in the living room?",
    "Mẹ tôi nấu ăn ở đâu?": "Where does my mother cook?",
    "Tôi sống ở tầng nào?": "Which floor do I live on?",
    # A Letter to a Penpal
    "Emily đang ở đâu?": "Where is Emily?",
    "Emily và gia đình ở đâu?": "Where are Emily and her family staying?",
    "Emily đã làm gì hôm qua?": "What did Emily do yesterday?",
    "Emily sẽ làm gì hôm nay?": "What will Emily do today?",
    "Emily sẽ viết thư cho ai?": "Who is Emily writing to?",
    
    # Options A1 Reading
    "Emily": "Emily",
    "Timmy": "Timmy",
    "Mẹ": "Mom",
    "Bố": "Dad",
    "Làm bác sĩ": "Work as a doctor",
    "Làm giáo viên": "Work as a teacher",
    "Làm việc tại bệnh viện": "Work at a hospital",
    "Làm việc tại trường học": "Work at a school",
    "Trường học": "School",
    "Bệnh viện": "Hospital",
    "Nhà": "Home",
    "Trung tâm y tế": "Medical center",
    "6 giờ": "6 o'clock",
    "7 giờ": "7 o'clock",
    "8 giờ": "8 o'clock",
    "9 giờ": "9 o'clock",
    "Xe buýt": "Bus",
    "Xe ô tô": "Car",
    "Xe đạp": "Bicycle",
    "Xe máy": "Motorbike",
    "Trên xe buýt": "On the bus",
    "Tại sở thú": "At the zoo",
    "Trên đường đi đến sở thú": "On the way to the zoo",
    "Trên báo chí": "In the newspaper",
    "Sư tử": "Lion",
    "Khỉ": "Monkey",
    "Gấu": "Bear",
    "Hổ": "Tiger",
    "Chuối": "Bananas",
    "Bánh ngọt": "Cake",
    "Trái cây": "Fruits",
    "Món ăn nhanh": "Fast food",
    "Cô thấy nhiều động vật": "She sees many animals",
    "Cô có một thời gian tuyệt vời với gia đình": "She has a great time with her family",
    "Cô thấy một quảng cáo lớn cho sở thú": "She sees a big zoo advertisement",
    "Tất cả các lý do trên": "All of the above",
    "Chơi bóng đá": "Playing soccer",
    "Đi xem phim": "Watching movies",
    "Đi chơi game": "Playing games",
    "Đi học": "Going to school",
    "Bạn bè": "Friends",
    "Giáo viên": "Teacher",
    "Công viên": "Park",
    "Cầu": "Bridge",
    "Vì nó thú vị": "Because it's fun",
    "Vì nó giúp tôi khỏe mạnh": "Because it keeps me healthy",
    "Vì nó giúp tôi học hỏi": "Because it helps me learn",
    "Vì nó giúp tôi kiếm tiền": "Because it helps me earn money",
    "Mỗi ngày": "Every day",
    "Mỗi tuần": "Every weekend",
    "Mỗi tháng": "Every month",
    "Mỗi năm": "Every year",
    "Một ngôi nhà lớn": "A large house",
    "Một ngôi nhà nhỏ": "A small house",
    "Một căn hộ": "An apartment",
    "Một khách sạn": "A hotel",
    "Một phòng ngủ": "One bedroom",
    "Hai phòng ngủ": "Two bedrooms",
    "Ba phòng ngủ": "Three bedrooms",
    "Nhiều phòng ngủ": "Many bedrooms",
    "Nấu ăn": "Cooking",
    "Chơi trò chơi": "Playing games",
    "Xem TV": "Watching TV",
    "Bếp": "Kitchen",
    "Tầng trên": "Upper floor",
    "Tầng dưới": "Lower floor",
    "Tầng giữa": "Middle floor",
    "Tokyo, Nhật Bản": "Tokyo, Japan",
    "New York, Mỹ": "New York, USA",
    "London, Anh": "London, UK",
    "Paris, Pháp": "Paris, France",
    "Khách sạn gần trung tâm thành phố": "Hotel near the city center",
    "Khách sạn gần công viên": "Hotel near the park",
    "Khách sạn gần bảo tàng": "Hotel near the museum",
    "Khách sạn gần Tokyo Tower": "Hotel near Tokyo Tower",
    "Đi đến công viên": "Go to the park",
    "Đi đến bảo tàng": "Go to the museum",
    "Đi đến Tokyo Tower": "Go to Tokyo Tower",
    "Đi đến trung tâm thành phố": "Go to the city center",
    "Đi đến công viên hôm nay": "Go to the park today",
    "Sarah": "Sarah",
    "Jane": "Jane",
}

def translate(text):
    if not text:
        return text
    clean = text.strip()
    return TRANSLATE_DICT.get(clean, text)

def parse_values(s):
    values = []
    current = []
    in_string = False
    paren_level = 0
    i = 0
    n = len(s)
    while i < n:
        c = s[i]
        if c == "'":
            if in_string:
                # Check for escaped quote ''
                if i + 1 < n and s[i+1] == "'":
                    current.append("'")
                    i += 2
                    continue
                else:
                    in_string = False
            else:
                in_string = True
            current.append(c)
            i += 1
        elif c == "(":
            if not in_string:
                paren_level += 1
            current.append(c)
            i += 1
        elif c == ")":
            if not in_string:
                paren_level -= 1
                if paren_level < 0:
                    values.append("".join(current).strip())
                    break
            current.append(c)
            i += 1
        elif c == ",":
            if in_string or paren_level > 0:
                current.append(c)
                i += 1
            else:
                values.append("".join(current).strip())
                current = []
                i += 1
        else:
            current.append(c)
            i += 1
    return values

def strip_quotes(val):
    if val.startswith("'") and val.endswith("'"):
        return val[1:-1].replace("''", "'")
    return val

def escape_sql(val):
    if val is None:
        return "NULL"
    escaped = str(val).replace("'", "''")
    return f"'{escaped}'"

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text

def run_translation():
    print("[+] Starting seed data translation to new schema...")
    
    # Trackers for lessons
    lessons_db = {} # key: (type, title), value: lesson_id
    lesson_counters = {} # key: (level, type), value: current index
    
    new_sql_statements = []
    
    # 1. Seeding system lessons first
    # Module ID mapping based on Level and Type
    module_mapping = {
        ("A1", "VOCABULARY"): 1001,
        ("A1", "GRAMMAR"): 1002,
        ("A1", "READING"): 1003,
        ("A1", "LISTENING"): 1004,
        
        ("A2", "VOCABULARY"): 1005,
        ("A2", "GRAMMAR"): 1006,
        ("A2", "READING"): 1007,
        ("A2", "LISTENING"): 1008,
        
        ("B1", "VOCABULARY"): 1009,
        ("B1", "GRAMMAR"): 1010,
        ("B1", "READING"): 1011,
        ("B1", "LISTENING"): 1012,
        
        ("B2", "VOCABULARY"): 1013,
        ("B2", "GRAMMAR"): 1014,
        ("B2", "READING"): 1015,
        ("B2", "LISTENING"): 1016,
        
        ("C1", "VOCABULARY"): 1017,
        ("C1", "GRAMMAR"): 1018,
        ("C1", "READING"): 1019,
        ("C1", "LISTENING"): 1020
    }
    
    # Free Vocabulary theme modules (2001-2020)
    for m_idx in range(1, 11):
        # A1 free vocab
        lessons_db[("VOCABULARY_FREE", "A1", m_idx)] = 200100 + m_idx
        # A2 free vocab
        lessons_db[("VOCABULARY_FREE", "A2", m_idx)] = 201100 + m_idx
        
    # Let's pre-insert lessons for all curriculum vocabulary
    for lvl in ["A1", "A2", "B1", "B2", "C1"]:
        mod_id = module_mapping[(lvl, "VOCABULARY")]
        lesson_id = mod_id * 100 + 1
        lessons_db[("VOCABULARY_CURRICULUM", lvl)] = lesson_id
        
        # Add Lesson SQL
        slug = f"vocabulary-{lvl.lower()}"
        new_sql_statements.append(
            f"INSERT INTO lessons (id, slug, module_id, title, order_index, lesson_type, level, difficulty_score, topic) "
            f"VALUES ({lesson_id}, '{slug}', {mod_id}, 'Vocabulary {lvl}', 1, 'VOCABULARY', '{lvl}', 1.0, '{lvl} Core Vocabulary') "
            f"ON CONFLICT (id) DO NOTHING;"
        )
        
    # Let's pre-insert free vocabulary lessons too
    vocab_themes = {
        "A1": ["Chào hỏi & Bản thân", "Gia đình & Bạn bè", "Trường học & Học tập", "Đồ ăn & Đồ uống", "Thời tiết & Quần áo", "Nhà cửa & Đồ đạc", "Động vật & Thiên nhiên", "Hoạt động hàng ngày", "Màu sắc & Số đếm", "Phương tiện giao thông"],
        "A2": ["Mua sắm & Giá cả", "Du lịch & Khách sạn", "Sức khỏe & Cơ thể", "Giải trí & Thể thao", "Nghề nghiệp & Công việc", "Công nghệ cơ bản", "Địa điểm trong thành phố", "Thời gian rảnh rỗi", "Lễ hội & Sự kiện", "Mô tả người & vật"]
    }
    for lvl in ["A1", "A2"]:
        for m_idx, theme in enumerate(vocab_themes[lvl], 1):
            mod_id = 2000 + m_idx if lvl == "A1" else 2010 + m_idx
            lesson_id = lessons_db[("VOCABULARY_FREE", lvl, m_idx)]
            slug = f"vocabulary-cefr-{lvl.lower()}-{m_idx}"
            new_sql_statements.append(
                f"INSERT INTO lessons (id, slug, module_id, title, order_index, lesson_type, level, difficulty_score, topic) "
                f"VALUES ({lesson_id}, '{slug}', {mod_id}, {escape_sql(theme)}, 1, 'VOCABULARY', '{lvl}', 1.0, {escape_sql(theme)}) "
                f"ON CONFLICT (id) DO NOTHING;"
            )

    # Helper to insert questions & options
    global_question_id = 100000
    
    def process_study_contents_file(filename, content_type):
        nonlocal global_question_id
        path = os.path.join(OUTPUT_DIR, filename)
        if not os.path.exists(path):
            print(f"[-] File {filename} not found, skipping.")
            return
            
        with open(path, "r", encoding="utf-8") as f:
            raw_content = f.read()
            
        statements = raw_content.split("INSERT INTO ")
        current_lesson_id = None
        
        for stmt in statements:
            stmt = stmt.strip()
            if not stmt:
                continue
            
            stmt = "INSERT INTO " + stmt
            
            # Parse statement
            parts = stmt.split('(', 1)
            table_name = parts[0].replace('INSERT INTO', '').strip()
            
            col_str, rest = parts[1].split(')', 1)
            columns = [c.strip() for c in col_str.split(',')]
            
            val_start = rest.find('(')
            raw_vals = rest[val_start + 1:]
            vals = parse_values(raw_vals)
            vals_clean = [strip_quotes(v) for v in vals]
            
            val_map = dict(zip(columns, vals_clean))
            
            if table_name == "study_contents":
                title = val_map.get("title")
                lvl = val_map.get("category")
                body_text = val_map.get("body_text")
                media_url = val_map.get("media_url")
                description = val_map.get("description")
                
                # Workaround: For reading articles, media_url is empty but description has translation & vocab.
                # Store description in media_url to avoid changing schema.
                final_media_url = media_url if (media_url and media_url.strip()) else description
                
                mod_id = module_mapping[(lvl, content_type)]
                
                # Auto-increment lesson ID under this module
                key = (lvl, content_type)
                lesson_counters[key] = lesson_counters.get(key, 0) + 1
                idx = lesson_counters[key]
                current_lesson_id = mod_id * 100 + idx
                
                lessons_db[(content_type, title)] = current_lesson_id
                
                slug = slugify(f"{content_type}-{lvl}-{title}")
                
                # Insert Lesson
                new_sql_statements.append(
                    f"INSERT INTO lessons (id, slug, module_id, title, order_index, lesson_type, level, difficulty_score, topic) "
                    f"VALUES ({current_lesson_id}, '{slug}', {mod_id}, {escape_sql(title)}, {idx}, '{content_type}', '{lvl}', 1.0, {escape_sql(title)}) "
                    f"ON CONFLICT (id) DO NOTHING;"
                )
                
                # Insert LessonContent
                new_sql_statements.append(
                    f"INSERT INTO lesson_contents (lesson_id, body_text, media_url, duration_seconds) "
                    f"VALUES ({current_lesson_id}, {escape_sql(body_text)}, {escape_sql(final_media_url)}, 900) "
                    f"ON CONFLICT (lesson_id) DO NOTHING;"
                )
                
            elif table_name == "questions":
                question_text = translate(val_map.get("question_text"))
                explanation = val_map.get("explanation")
                difficulty = val_map.get("difficulty")
                source_type = val_map.get("source_type")
                
                # Extract options
                option_a = translate(val_map.get("option_a"))
                option_b = translate(val_map.get("option_b"))
                option_c = translate(val_map.get("option_c"))
                option_d = translate(val_map.get("option_d"))
                correct_opt = val_map.get("correct_option")
                if not correct_opt:
                    correct_opt = val_map.get("correct_answer")
                
                # Generate unique question id
                global_question_id += 1
                q_id = global_question_id
                
                # Insert Question
                new_sql_statements.append(
                    f"INSERT INTO questions (id, lesson_id, source_type, question_text, explanation, difficulty) "
                    f"VALUES ({q_id}, {current_lesson_id}, 'ROADMAP_QUIZ', {escape_sql(question_text)}, {escape_sql(explanation)}, {escape_sql(difficulty)}) "
                    f"ON CONFLICT (id) DO NOTHING;"
                )
                
                # Insert Options
                for key, val in [("A", option_a), ("B", option_b), ("C", option_c), ("D", option_d)]:
                    if val:
                        is_correct = "true" if key.strip().upper() == correct_opt.strip().upper() else "false"
                        new_sql_statements.append(
                            f"INSERT INTO question_options (question_id, option_key, option_value, is_correct) "
                            f"VALUES ({q_id}, '{key}', {escape_sql(val)}, {is_correct});"
                        )

    # Process files
    process_study_contents_file("seed_grammar.sql", "GRAMMAR")
    process_study_contents_file("seed_reading.sql", "READING")
    process_study_contents_file("seed_listening.sql", "LISTENING")
    
    # 2. Translating seed_vocab.sql
    vocab_path = os.path.join(OUTPUT_DIR, "seed_vocab.sql")
    if os.path.exists(vocab_path):
        with open(vocab_path, "r", encoding="utf-8") as f:
            raw_content = f.read()
            
        statements = raw_content.split("INSERT INTO ")
        for stmt in statements:
            stmt = stmt.strip()
            if not stmt:
                continue
            
            stmt = "INSERT INTO " + stmt
            parts = stmt.split('(', 1)
            table_name = parts[0].replace('INSERT INTO', '').strip()
            if table_name != "vocabulary_words":
                continue
                
            col_str, rest = parts[1].split(')', 1)
            columns = [c.strip() for c in col_str.split(',')]
            
            val_start = rest.find('(')
            raw_vals = rest[val_start + 1:]
            vals = parse_values(raw_vals)
            vals_clean = [strip_quotes(v) for v in vals]
            val_map = dict(zip(columns, vals_clean))
            
            lvl = val_map.get("cefr_level")
            m_idx = int(val_map.get("module_index"))
            word = val_map.get("word")
            pos = val_map.get("part_of_speech")
            phonetic = val_map.get("phonetic")
            definition = val_map.get("definition")
            ex = val_map.get("example_sentence")
            ex_tr = val_map.get("example_translation")
            
            # Map to vocabulary lesson ID
            # If it's B1, B2, or C1 (not in free vocab themes): map to curriculum vocabulary lesson
            if lvl in ["B1", "B2", "C1"]:
                lesson_id = lessons_db.get(("VOCABULARY_CURRICULUM", lvl))
                if lesson_id:
                    new_sql_statements.append(
                        f"INSERT INTO vocabulary_words (lesson_id, word, part_of_speech, phonetic, definition, example_sentence, example_translation) "
                        f"VALUES ({lesson_id}, {escape_sql(word)}, {escape_sql(pos)}, {escape_sql(phonetic)}, {escape_sql(definition)}, {escape_sql(ex)}, {escape_sql(ex_tr)});"
                    )
            else:
                # Map to free vocabulary theme
                free_lesson_id = lessons_db.get(("VOCABULARY_FREE", lvl, m_idx))
                if free_lesson_id:
                    new_sql_statements.append(
                        f"INSERT INTO vocabulary_words (lesson_id, word, part_of_speech, phonetic, definition, example_sentence, example_translation) "
                        f"VALUES ({free_lesson_id}, {escape_sql(word)}, {escape_sql(pos)}, {escape_sql(phonetic)}, {escape_sql(definition)}, {escape_sql(ex)}, {escape_sql(ex_tr)});"
                    )
                # ALSO map to curriculum vocabulary lesson
                curriculum_lesson_id = lessons_db.get(("VOCABULARY_CURRICULUM", lvl))
                if curriculum_lesson_id:
                    new_sql_statements.append(
                        f"INSERT INTO vocabulary_words (lesson_id, word, part_of_speech, phonetic, definition, example_sentence, example_translation) "
                        f"VALUES ({curriculum_lesson_id}, {escape_sql(word)}, {escape_sql(pos)}, {escape_sql(phonetic)}, {escape_sql(definition)}, {escape_sql(ex)}, {escape_sql(ex_tr)});"
                    )
    
    # 3. Translating seed_exams.sql (Placement Test questions)
    exams_path = os.path.join(OUTPUT_DIR, "seed_exams.sql")
    if os.path.exists(exams_path):
        with open(exams_path, "r", encoding="utf-8") as f:
            raw_content = f.read()
            
        statements = raw_content.split("INSERT INTO ")
        for stmt in statements:
            stmt = stmt.strip()
            if not stmt:
                continue
            
            stmt = "INSERT INTO " + stmt
            parts = stmt.split('(', 1)
            table_name = parts[0].replace('INSERT INTO', '').strip()
            if table_name != "questions":
                continue
                
            col_str, rest = parts[1].split(')', 1)
            columns = [c.strip() for c in col_str.split(',')]
            
            val_start = rest.find('(')
            raw_vals = rest[val_start + 1:]
            vals = parse_values(raw_vals)
            vals_clean = [strip_quotes(v) for v in vals]
            val_map = dict(zip(columns, vals_clean))
            
            source_type = val_map.get("source_type")
            question_text = val_map.get("question_text")
            explanation = val_map.get("explanation")
            difficulty = val_map.get("difficulty")
            
            option_a = val_map.get("option_a")
            option_b = val_map.get("option_b")
            option_c = val_map.get("option_c")
            option_d = val_map.get("option_d")
            correct_opt = val_map.get("correct_option")
            if not correct_opt:
                correct_opt = val_map.get("correct_answer")
                
            global_question_id += 1
            q_id = global_question_id
            
            # Placement Test questions have NULL lesson_id
            new_sql_statements.append(
                f"INSERT INTO questions (id, lesson_id, source_type, question_text, explanation, difficulty) "
                f"VALUES ({q_id}, NULL, '{source_type}', {escape_sql(question_text)}, {escape_sql(explanation)}, {escape_sql(difficulty)}) "
                f"ON CONFLICT (id) DO NOTHING;"
            )
            
            # Options
            for key, val in [("A", option_a), ("B", option_b), ("C", option_c), ("D", option_d)]:
                if val:
                    is_correct = "true" if key.strip().upper() == correct_opt.strip().upper() else "false"
                    new_sql_statements.append(
                        f"INSERT INTO question_options (question_id, option_key, option_value, is_correct) "
                        f"VALUES ({q_id}, '{key}', {escape_sql(val)}, {is_correct});"
                    )

    # 4. Save to seed_all_new.sql
    with open(NEW_SEED_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(new_sql_statements))
        
    print(f"[+] Successfully translated all seed SQL data! Saved to {NEW_SEED_PATH}")

if __name__ == "__main__":
    run_translation()
