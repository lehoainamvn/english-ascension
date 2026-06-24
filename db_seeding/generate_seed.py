import os
import sys
import json
import time
import ssl
import urllib.request
import urllib.parse
import argparse

# Reconfigure standard output to support UTF-8 on Windows
if sys.version_info >= (3, 7):
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Configuration
ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
CHECKPOINT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "checkpoint.json"))
OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "sql_output"))

# SSL context to ignore self-signed certificates
SSL_CONTEXT = ssl._create_unverified_context()

# Ensure directories exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. Utility to load .env file
def load_env(env_path):
    env_vars = {}
    if not os.path.exists(env_path):
        print(f"[-] Warning: .env file not found at {env_path}")
        return env_vars
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, val = line.split("=", 1)
                env_vars[key.strip()] = val.strip()
    return env_vars

ENV = load_env(ENV_PATH)
GROQ_API_KEY = ENV.get("GROQ_API_KEY", "")
GROQ_API_URL = ENV.get("GROQ_API_URL", "https://api.groq.com/openai/v1")
GROQ_MODEL = ENV.get("GROQ_API_MODEL", "llama-3.3-70b-versatile")

if not GROQ_API_KEY:
    print("[-] Error: GROQ_API_KEY not found in .env. Please check configuration.")
    sys.exit(1)

# 2. Checkpoint manager
def load_checkpoint():
    default_checkpoint = {
        "vocab": {"A1": 0, "A2": 0, "B1": 0, "B2": 0, "C1": 0}, # 0 to 10 modules completed
        "grammar": {"A1": 0, "A2": 0, "B1": 0, "B2": 0, "C1": 0}, # 0 to 10 lessons completed
        "reading": {"A1": 0, "A2": 0, "B1": 0, "B2": 0, "C1": 0}, # 0 to 20 passages completed
        "listening": {"A1": 0, "A2": 0, "B1": 0, "B2": 0, "C1": 0}, # 0 to 20 topics completed
        "placement_test": False,
        "level_tests": {"A1": False, "A2": False, "B1": False, "B2": False, "C1": False},
        "toeic_mini": 0, # up to 20
        "toeic_full": 0  # up to 10
    }
    if os.path.exists(CHECKPOINT_PATH):
        try:
            with open(CHECKPOINT_PATH, "r", encoding="utf-8") as f:
                checkpoint = json.load(f)
                # Merge missing default fields
                for k, v in default_checkpoint.items():
                    if k not in checkpoint:
                        checkpoint[k] = v
                return checkpoint
        except Exception as e:
            print(f"[-] Error loading checkpoint: {e}. Starting fresh.")
    return default_checkpoint

def save_checkpoint(checkpoint):
    try:
        with open(CHECKPOINT_PATH, "w", encoding="utf-8") as f:
            json.dump(checkpoint, f, indent=4, ensure_ascii=False)
    except Exception as e:
        print(f"[-] Error saving checkpoint: {e}")

# 3. HTTP Client for Groq API
def call_groq(system_prompt, user_prompt, max_retries=5, delay=5):
    url = f"{GROQ_API_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2,
        "response_format": {"type": "json_object"}
    }

    req_body = json.dumps(payload).encode("utf-8")
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(url, data=req_body, headers=headers, method="POST")
            with urllib.request.urlopen(req, context=SSL_CONTEXT) as response:
                if response.status == 200:
                    res_body = json.loads(response.read().decode("utf-8"))
                    return json.loads(res_body["choices"][0]["message"]["content"])
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode("utf-8") if e.fp else str(e)
            print(f"[-] HTTP Error (Attempt {attempt+1}/{max_retries}): {e.code} - {err_msg}")
            if e.code == 429: # Rate limit
                print("[!] Rate limit hit. Sleeping for 30s...")
                time.sleep(30)
            else:
                time.sleep(delay)
        except Exception as e:
            print(f"[-] Error (Attempt {attempt+1}/{max_retries}): {e}")
            time.sleep(delay)
    raise RuntimeError("Failed to get response from Groq API after multiple retries.")

# 4. SQL Formatting Helpers
def escape_sql(val):
    if val is None:
        return "NULL"
    escaped = str(val).replace("'", "''")
    return f"'{escaped}'"

def append_sql(filename, sql_statements):
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, "a", encoding="utf-8") as f:
        f.write(sql_statements + "\n")

# 5. Curriculum definitions to guarantee clean structure
GRAMMAR_TOPICS = {
    "A1": [
        "Verb To Be", "Present Simple", "Articles (A/An/The)", "Plural Nouns & Pronouns", 
        "There Is / There Are", "Possessive Adjectives & Suffixes", "Adjectives & Word Order", 
        "Can / Cannot", "Imperatives & Prepositions of Place", "Wh- Questions"
    ],
    "A2": [
        "Present Continuous", "Past Simple (Regular & Irregular)", "Future Simple (Will / Be going to)", 
        "Comparative Adjectives", "Superlative Adjectives", "Countable and Uncountable Nouns", 
        "Adverbs of Frequency & Manner", "Present Perfect (Introduction)", "Modals of Ability and Permission (Could, May)", 
        "Gerunds vs Infinitives"
    ],
    "B1": [
        "Present Perfect Simple vs Continuous", "Past Continuous & Past Perfect", "Passive Voice (Present & Past)", 
        "Relative Clauses", "First & Second Conditional", "Modal Verbs of Obligation & Advice", 
        "Reported Speech (Basic Statements)", "Used to / Would", "Conjunctions of Contrast", 
        "Gerunds and Infinitives after specific verbs"
    ],
    "B2": [
        "Reported Speech (Advanced)", "Mixed Conditionals (Type 2 + Type 3)", "Inversion with negative adverbials", 
        "Advanced Modal Verbs of Deduction", "Causative Verbs (Have / Get done)", "Subjunctive Mood", 
        "Wish / If Only clauses", "Future Perfect & Future Continuous", "Participle Clauses", "Cleft Sentences"
    ],
    "C1": [
        "Inversion (Advanced structures)", "Participle Clauses (Advanced rhetorical usage)", "Subjunctive (Formal and legal use)", 
        "Cleft sentences (It was/What for emphasis)", "Advanced Conditionals (Mixed and alternatives to if)", "Relative clauses with prepositions", 
        "Modals of deduction and speculation in the past", "Passive voice (Advanced structures with reporting verbs)", "Nominalization", 
        "Conjunctions and linking words for complex rhetorical structures"
    ]
}

READING_TYPES = ["Short Story", "Email", "Article", "TOEIC Passage", "Advertisement", "Announcement"]
LISTENING_TYPES = ["Conversation", "Phone Call", "Meeting", "Interview", "Announcement", "Monologue"]

# 6. Generator Functions
def generate_vocabulary(levels=["A1", "A2", "B1", "B2", "C1"]):
    checkpoint = load_checkpoint()
    
    sys_prompt = "You are an expert English lexicographer. Your task is to output raw JSON containing exactly 20 distinct vocabulary words suitable for the requested CEFR level and module index. Return ONLY JSON without markdown tags."
    
    user_prompt_template = """
    Generate exactly 20 distinct English words for level '{level}' and module index {module_idx} (representing theme: '{theme}').
    Each word must have:
    - word: the English word.
    - partOfSpeech: e.g. 'Noun', 'Verb', 'Adjective', 'Adverb', 'Preposition'.
    - phonetic: IPA transcription (e.g. /əˈraɪv/).
    - definition: Vietnamese meaning of the word.
    - englishDefinition: brief English definition.
    - exampleSentence: example English sentence using the word.
    - exampleTranslation: Vietnamese translation of the example sentence.
    
    Format:
    {{
       "words": [
          {{
             "word": "arrive",
             "partOfSpeech": "Verb",
             "phonetic": "/əˈraɪv/",
             "definition": "đến nơi",
             "englishDefinition": "to reach a place",
             "exampleSentence": "The train will arrive on time.",
             "exampleTranslation": "Tàu hỏa sẽ đến nơi đúng giờ."
          }}
       ]
    }}
    Ensure all fields are filled, no duplicates, and translations are natural Vietnamese.
    """

    vocab_themes = {
        "A1": ["Chào hỏi & Bản thân", "Gia đình & Bạn bè", "Trường học & Học tập", "Đồ ăn & Đồ uống", "Thời tiết & Quần áo", "Nhà cửa & Đồ đạc", "Động vật & Thiên nhiên", "Hoạt động hàng ngày", "Màu sắc & Số đếm", "Phương tiện giao thông"],
        "A2": ["Mua sắm & Giá cả", "Du lịch & Khách sạn", "Sức khỏe & Cơ thể", "Giải trí & Thể thao", "Nghề nghiệp & Công việc", "Công nghệ cơ bản", "Địa điểm trong thành phố", "Thời gian rảnh rỗi", "Lễ hội & Sự kiện", "Mô tả người & vật"],
        "B1": ["Môi trường & Biến đổi khí hậu", "Giáo dục & Học thuật", "Văn hóa & Nghệ thuật", "Kinh doanh & Khởi nghiệp", "Phương tiện truyền thông", "Các mối quan hệ xã hội", "Phát triển cá nhân", "Khoa học & Đổi mới", "Giao thông công cộng", "Du lịch khám phá"],
        "B2": ["Tài chính & Đầu tư", "Quản trị doanh nghiệp", "Luật pháp & Xã hội", "Y học & Công nghệ sinh học", "Toàn cầu hóa", "Tâm lý học hành vi", "Thị trường lao động", "Trí tuệ nhân tạo", "Thương mại quốc tế", "Truyền thông đại chúng"],
        "C1": ["Ngoại giao & Quan hệ quốc tế", "Nghiên cứu & Học thuật chuyên sâu", "Văn học & Ngôn ngữ học", "Triết học & Tư tưởng", "Chính sách công & Quản lý nhà nước", "Đạo đức nghề nghiệp", "Phát triển bền vững toàn cầu", "Khoa học không gian & Thiên văn học", "Kinh tế học vĩ mô", "Xu hướng văn hóa đương đại"]
    }

    for lvl in levels:
        for m_idx in range(1, 11):
            current_completed = checkpoint["vocab"].get(lvl, 0)
            if m_idx <= current_completed:
                continue
            
            theme = vocab_themes[lvl][m_idx - 1]
            print(f"[+] Generating Vocabulary Level {lvl} - Module {m_idx}/10: '{theme}'...")
            
            prompt = user_prompt_template.format(level=lvl, module_idx=m_idx, theme=theme)
            success = False
            for retry_attempt in range(3):
                try:
                    res = call_groq(sys_prompt, prompt)
                    words = res.get("words", [])
                    if not words or len(words) < 15:
                        print(f"[-] AI returned insufficient words ({len(words) if words else 0}). Retrying same module (attempt {retry_attempt+1}/3)...")
                        time.sleep(5)
                        continue
                    
                    sql_lines = []
                    for w in words:
                        sql = f"INSERT INTO vocabulary_words (cefr_level, module_index, word, part_of_speech, phonetic, definition, example_sentence, example_translation) VALUES ({escape_sql(lvl)}, {m_idx}, {escape_sql(w.get('word'))}, {escape_sql(w.get('partOfSpeech'))}, {escape_sql(w.get('phonetic'))}, {escape_sql(w.get('definition'))}, {escape_sql(w.get('exampleSentence'))}, {escape_sql(w.get('exampleTranslation'))});"
                        sql_lines.append(sql)
                    
                    append_sql("seed_vocab.sql", "\n".join(sql_lines))
                    
                    # Update checkpoint
                    checkpoint["vocab"][lvl] = m_idx
                    save_checkpoint(checkpoint)
                    print(f"[+] Successfully saved {len(words)} words for {lvl} Module {m_idx}.")
                    success = True
                    time.sleep(3) # Throttle
                    break
                except Exception as e:
                    print(f"[-] Failed to generate level {lvl} module {m_idx} (attempt {retry_attempt+1}/3): {e}")
                    time.sleep(5)
            if not success:
                print(f"[-] Aborting vocabulary generation for level {lvl} module {m_idx} after 3 failed attempts.")
                return

def generate_grammar(levels=["A1", "A2", "B1", "B2", "C1"]):
    checkpoint = load_checkpoint()
    
    sys_prompt = "You are an expert English Grammar teacher. Generate detailed grammar lesson content in Markdown and a quiz of exactly 10 questions. Return ONLY raw JSON without markdown code tags."
    
    user_prompt_template = """
    Generate a detailed English grammar lesson for Level '{level}', Topic: '{topic}'.
    The output must contain:
    - title: topic name.
    - category: CEFR level (e.g. 'A1', 'A2').
    - bodyText: Detailed grammar guide in Vietnamese using Markdown. Include:
       1. Cấu trúc/Công thức (Formula)
       2. Cách dùng (Usage)
       3. Ví dụ minh họa (Examples)
       4. Mẹo học (Tips)
       5. Các lỗi thường gặp (Common Mistakes)
       6. Tóm tắt (Summary)
    - questions: array of exactly 10 multiple-choice questions testing this topic:
       - questionText: the question text in English.
       - optionA, optionB, optionC, optionD: option values.
       - correctOption: A, B, C, or D.
       - explanation: detailed explanation in Vietnamese.

    Format:
    {{
       "title": "Topic Name",
       "category": "A1",
       "bodyText": "Markdown content...",
       "questions": [
          {{
             "questionText": "Question 1?",
             "optionA": "Opt A",
             "optionB": "Opt B",
             "optionC": "Opt C",
             "optionD": "Opt D",
             "correctOption": "B",
             "explanation": "Giải thích chi tiết..."
          }}
       ]
    }}
    Ensure all fields are populated and high quality.
    """

    for lvl in levels:
        topics = GRAMMAR_TOPICS[lvl]
        for idx, topic in enumerate(topics, 1):
            current_completed = checkpoint["grammar"].get(lvl, 0)
            if idx <= current_completed:
                continue
            
            print(f"[+] Generating Grammar Level {lvl} - Topic {idx}/10: '{topic}'...")
            prompt = user_prompt_template.format(level=lvl, topic=topic)
            
            success = False
            for retry_attempt in range(3):
                try:
                    res = call_groq(sys_prompt, prompt)
                    
                    # Append StudyContent
                    sc_sql = f"INSERT INTO study_contents (type, title, category, body_text, duration, questions_count) VALUES ('GRAMMAR', {escape_sql(res.get('title'))}, {escape_sql(lvl)}, {escape_sql(res.get('bodyText'))}, 15, 10);"
                    
                    # We need to link questions via parent_id.
                    # In PostgreSQL, we can use a subquery to find the last inserted study_content ID:
                    # parent_id = (SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = '...' ORDER BY id DESC LIMIT 1)
                    title_esc = escape_sql(res.get('title'))
                    parent_id_subquery = f"(SELECT id FROM study_contents WHERE type = 'GRAMMAR' AND title = {title_esc} ORDER BY id DESC LIMIT 1)"
                    
                    q_sqls = []
                    for q_num, q in enumerate(res.get("questions", []), 1):
                        q_sql = f"INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('GRAMMAR', {parent_id_subquery}, {q_num}, 'MULTIPLE_CHOICE', {escape_sql(lvl)}, {escape_sql(q.get('questionText'))}, {escape_sql(q.get('optionA'))}, {escape_sql(q.get('optionB'))}, {escape_sql(q.get('optionC'))}, {escape_sql(q.get('optionD'))}, {escape_sql(q.get('correctOption'))}, {escape_sql(q.get('correctOption'))}, {escape_sql(q.get('explanation'))});"
                        q_sqls.append(q_sql)
                    
                    full_sql = sc_sql + "\n" + "\n".join(q_sqls)
                    append_sql("seed_grammar.sql", full_sql)
                    
                    checkpoint["grammar"][lvl] = idx
                    save_checkpoint(checkpoint)
                    print(f"[+] Successfully generated and saved Grammar lesson & quiz for '{topic}'.")
                    success = True
                    time.sleep(3)
                    break
                except Exception as e:
                    print(f"[-] Failed to generate Grammar Topic '{topic}' (attempt {retry_attempt+1}/3): {e}")
                    time.sleep(5)
            if not success:
                print(f"[-] Aborting Grammar generation for Level {lvl} Topic '{topic}' after 3 failed attempts.")
                return

def generate_reading(levels=["A1", "A2", "B1", "B2", "C1"]):
    checkpoint = load_checkpoint()
    
    sys_prompt = "You are an English Reading content designer. Create a reading passage, its Vietnamese translation, vocabulary list, and 5-10 multiple-choice questions. Return ONLY raw JSON without markdown code tags."
    
    user_prompt_template = """
    Generate a reading lesson for CEFR Level '{level}', Passage Index {index} (Scenario: '{scenario}').
    The output must contain:
    - title: title of the passage.
    - type: must be one of: 'Short Story', 'Email', 'Article', 'TOEIC Passage', 'Advertisement', 'Announcement'.
    - bodyText: the actual passage text in English.
    - translation: Vietnamese translation of the passage.
    - keywords: comma-separated list of 5-8 key words with meanings (e.g. 'commute (v): đi lại, route (n): tuyến đường').
    - questions: array of 5-8 multiple-choice reading comprehension questions:
       - questionText: the question in English.
       - optionA, optionB, optionC, optionD: option values.
       - correctOption: A, B, C, or D.
       - explanation: explanation in Vietnamese.

    Format:
    {{
       "title": "Passage Title",
       "type": "Email",
       "bodyText": "Passage content...",
       "translation": "Bản dịch tiếng Việt...",
       "keywords": "từ khóa 1: nghĩa, từ khóa 2: nghĩa...",
       "questions": [
          {{
             "questionText": "Question 1?",
             "optionA": "Opt A",
             "optionB": "Opt B",
             "optionC": "Opt C",
             "optionD": "Opt D",
             "correctOption": "A",
             "explanation": "Giải thích chi tiết..."
          }}
       ]
    }}
    Ensure all fields are populated and high quality.
    """

    reading_scenarios = {
        "A1": [
            "My Daily Routine", "Introducing My Family", "A Day at the Zoo", "My Favorite Hobby", "A Simple Recipe for Pancakes",
            "Welcome to My House", "A Letter to a Penpal", "School Timetable Announcement", "An Invitation to a Birthday Party", "Lost Dog Poster",
            "At the Supermarket", "My Weekend Trip", "A Simple Job Ad for a Cashier", "Classroom Rules Announcement", "Meet My Pet",
            "An Email to Invite a Friend to lunch", "At the Library", "My Favorite Season", "Weather Forecast Memo", "Visiting a Doctor"
        ],
        "A2": [
            "Email to a Colleague about Meeting Rescheduling", "A Tourist Guide of New York", "Gym Membership Promotion", "Office Kitchen Cleanup Rules Notice",
            "A Message Board Post about Shopping", "Job Description for an Administrative Assistant", "An Email confirming an Online Order", "A Review of a local Café",
            "Safety Instructions for Fire Drills", "Weekend Flight Delay Announcement", "A Conversation about Weekend Plans", "Housing Rental Advertisement",
            "Lost Wallet Notice in Office", "How to Use the Office Coffee Machine Guide", "Invitation to Company Team Building Event", "A Short Article on healthy eating habits",
            "Email requesting a vacation day", "A local Museum Information Page", "An Advertisement for English Classes", "Company Holiday Notice"
        ],
        "B1": [
            "Client Feedback Report Summary", "Business Trip Expense Reimbursement Procedure Email", "An Article on Remote Work Productivity", "Product Recall Notice",
            "Annual Office Supplies Audit Memo", "TOEIC Part 7: Email Chain regarding a contract negotiation", "Company Policy on Using Personal Laptops", "Customer Service Inquiry Response",
            "Press Release for a New Product Launch", "Instructions for Operating a 3D Printer", "An Article on Digital Marketing Basics", "A Review of a Leadership Book",
            "Office Expansion Plan Announcement", "Company Newsletter - Employee of the Month", "Website terms of service update notice", "Employee Training Program Agenda",
            "Email regarding a budget proposal update", "Project Milestone Achievement Report", "An Article on eco-friendly packaging", "Request for Proposal (RFP) Cover Letter"
        ],
        "B2": [
            "Quarterly Financial Performance Analysis Report", "Company Merger and Acquisition Announcement Memo", "A Deep-Dive Article on Cybersecurity in modern workplaces", "Commercial Real Estate Lease Agreement Excerpt",
            "Press Release regarding a major product security breach", "TOEIC Part 7: Complex Multi-document Email Chain regarding supply chain delay", "Board of Directors Meeting Summary Minutes", "Employee Code of Conduct update regarding AI Usage",
            "Whitepaper Abstract on Renewable Energy integration", "Business Proposal for a Strategic Joint Venture", "Article on Psychological Safety in corporate teams", "Annual Corporate Social Responsibility (CSR) Report",
            "Project Risk Assessment and Mitigation Plan", "Vendor Performance Evaluation Report", "Standard Operating Procedure (SOP) for Database migrations", "Analysis of Global E-commerce Market Trends",
            "Email requesting authorization for capital expenditure", "Audit Report Findings and Remediation Actions", "Article on Talent Retention Strategies post-pandemic", "A Request for Quote (RFQ) Technical Specifications"
        ],
        "C1": [
            "A peer-reviewed scientific paper abstract", "A diplomatic policy brief", "An editorial on macro-economic shifts", "A complex legal judgment excerpt",
            "A comprehensive meta-analysis summary", "A philosophical essay on modern ethics", "A detailed grant proposal", "An in-depth literary critique",
            "A sophisticated marketing strategy report", "A technical whitepaper on quantum computing", "An advanced user manual for industrial equipment", "A detailed investigative journalism article",
            "A critique of sustainable development policies", "An academic book review", "A comprehensive psychological case study", "A policy analysis report on public health",
            "A report on space exploration trends", "A sociological research paper", "An advanced guide to negotiation strategies", "A manifesto on cultural evolution"
        ]
    }

    for lvl in levels:
        scenarios = reading_scenarios[lvl]
        for idx in range(1, 21):
            current_completed = checkpoint["reading"].get(lvl, 0)
            if idx <= current_completed:
                continue
            
            scenario = scenarios[idx - 1]
            r_type = READING_TYPES[(idx - 1) % len(READING_TYPES)]
            print(f"[+] Generating Reading Level {lvl} - Passage {idx}/20: '{scenario}' ({r_type})...")
            
            prompt = user_prompt_template.format(level=lvl, index=idx, scenario=scenario)
            success = False
            for retry_attempt in range(3):
                try:
                    res = call_groq(sys_prompt, prompt)
                    q_count = len(res.get("questions", []))
                    
                    # Concatenate translation and keywords into description/metadata
                    meta_desc = f"Vietnamese Translation:\n{res.get('translation')}\n\nKeywords:\n{res.get('keywords')}"
                    
                    sc_sql = f"INSERT INTO study_contents (type, title, category, body_text, description, duration, questions_count) VALUES ('READING', {escape_sql(res.get('title'))}, {escape_sql(lvl)}, {escape_sql(res.get('bodyText'))}, {escape_sql(meta_desc)}, 20, {q_count});"
                    
                    title_esc = escape_sql(res.get('title'))
                    parent_id_subquery = f"(SELECT id FROM study_contents WHERE type = 'READING' AND title = {title_esc} ORDER BY id DESC LIMIT 1)"
                    
                    q_sqls = []
                    for q_num, q in enumerate(res.get("questions", []), 1):
                        q_sql = f"INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('READING', {parent_id_subquery}, {q_num}, 'MULTIPLE_CHOICE', {escape_sql(lvl)}, {escape_sql(q.get('questionText'))}, {escape_sql(q.get('optionA'))}, {escape_sql(q.get('optionB'))}, {escape_sql(q.get('optionC'))}, {escape_sql(q.get('optionD'))}, {escape_sql(q.get('correctOption'))}, {escape_sql(q.get('correctOption'))}, {escape_sql(q.get('explanation'))});"
                        q_sqls.append(q_sql)
                    
                    full_sql = sc_sql + "\n" + "\n".join(q_sqls)
                    append_sql("seed_reading.sql", full_sql)
                    
                    checkpoint["reading"][lvl] = idx
                    save_checkpoint(checkpoint)
                    print(f"[+] Successfully generated Reading passage {idx} for level {lvl}.")
                    success = True
                    time.sleep(3)
                    break
                except Exception as e:
                    print(f"[-] Failed to generate Reading Level {lvl} Passage {idx} (attempt {retry_attempt+1}/3): {e}")
                    time.sleep(5)
            if not success:
                print(f"[-] Aborting Reading generation for level {lvl} passage {idx} after 3 failed attempts.")
                return

def generate_listening(levels=["A1", "A2", "B1", "B2", "C1"]):
    checkpoint = load_checkpoint()
    
    sys_prompt = "You are an English Listening content designer. Create a listening transcript, its Vietnamese summary, key vocabularies, and 5-10 multiple-choice questions. Return ONLY raw JSON without markdown code tags."
    
    user_prompt_template = """
    Generate a listening lesson for CEFR Level '{level}', Listening Index {index} (Scenario: '{scenario}').
    The output must contain:
    - title: title of the listening topic.
    - type: must be one of: 'Conversation', 'Phone Call', 'Meeting', 'Interview', 'Announcement', 'Monologue'.
    - transcript: transcript representing the audio dialogue or statement in English. Highlight speakers (e.g. 'John: ...', 'Lisa: ...').
    - summary: Vietnamese summary of the listening content.
    - keyVocab: comma-separated key vocabulary with English pronunciation/meanings.
    - questions: array of 5-8 multiple-choice questions:
       - questionText: the question in English.
       - optionA, optionB, optionC, optionD: option values.
       - correctOption: A, B, C, or D.
       - explanation: explanation in Vietnamese.

    Format:
    {{
       "title": "Listening Title",
       "type": "Conversation",
       "transcript": "John: Hello... Lisa: Hi...",
       "summary": "Tóm tắt tiếng Việt...",
       "keyVocab": "commute: đi lại, schedule: lịch trình...",
       "questions": [
          {{
             "questionText": "Question 1?",
             "optionA": "Opt A",
             "optionB": "Opt B",
             "optionC": "Opt C",
             "optionD": "Opt D",
             "correctOption": "A",
             "explanation": "Giải thích..."
          }}
       ]
    }}
    Ensure all fields are populated and high quality.
    """

    listening_scenarios = {
        "A1": [
            "Greeting a New Neighbor", "Asking for Directions to the Library", "Ordering Food at a Café", "Buying a Train Ticket", "A Weather Forecast Report",
            "Describing a Living Room", "A Telephone Call to Invite a Friend to a Movie", "Airport Flight Boarding Announcement", "Talking About Weekly Sports Activities", "Lost Dog Announcement in Neighborhood",
            "A Grocery List Discussion", "A School Class Canceled Notice", "Talking About Family Members", "Buying a New Shirt", "A Birthday Plan Conversation",
            "Welcome Speech in English Class", "Booking a Table at a Restaurant", "A Discussion about Daily Housework", "Planning a Weekend Picnic", "Talking About a Favorite Animal"
        ],
        "A2": [
            "A Telephone Conversation about a Delayed Project", "Tour Guide explaining London sights", "Local Gym Membership benefits explanation", "Notice about Office Relocation",
            "A customer inquiring about shopping discount", "Job Interview for a Front Desk Agent", "Confirming a flight reservation over the phone", "A podcast reviewing a local cafe",
            "Office fire drill instructions audio", "Train Station announcement for delayed express", "Discussion about weekend travel plans", "Real estate agent describing a rental flat",
            "Lost item report at hotel reception", "A voice message explaining office copier usage", "Team building location choices discussion", "An audio report on healthy lifestyle tips",
            "Requesting a day off to manager", "Museum tour audio guide introduction", "English course details phone inquiry", "Holiday closure notice on voicemail"
        ],
        "B1": [
            "Quarterly Department Meeting discussion on Sales", "Supply order delay phone call with vendor", "Monologue on remote work challenges", "Safety recall audio announcement for vehicles",
            "Office supply audit review meeting", "Contract details dispute discussion", "New employee onboarding instructions audio", "Customer service dispute regarding invoice error",
            "Product launch keynote introductory speech", "Technical support agent explaining software installation", "Podcast discussion on social media marketing", "Review discussion of a business book",
            "New office branch building plan meeting", "Employee of the month interview audio", "IT notification warning call regarding system update", "Training course intro speech",
            "Budget proposal adjustments meeting", "Project deadline extension agreement conversation", "Podcast on sustainability and packaging", "Request for Proposal review talk"
        ],
        "B2": [
            "Annual Financial Performance and Board Assessment debate", "Mergers and acquisitions strategy meeting snippet", "Cybersecurity threats and mitigation measures lecture", "Lease agreement terms discussion with landlord",
            "Security breach PR handling press conference audio", "Complex shipping and logistics dispute dialogue", "Board meeting debate on quarterly budget reallocation", "HR briefing on employee code of conduct and AI integration",
            "Scientific seminar talk on renewable energy grid integration", "Strategic joint venture contract review discussion", "Executive podcast on building team psychological safety", "Sustainability targets presentation",
            "Project risk assessment panel discussion", "Sourcing director reviewing vendor performance scorecard", "Lead software architect describing database migration SOP", "Webinar analyzing global e-commerce shifts",
            "Capital expenditure request presentation to CFO", "Compliance audit findings debrief meeting", "Panel debate on talent retention post-pandemic", "RFQ technical specification alignment call"
        ],
        "C1": [
            "A university lecture on astrophysics", "A heated political debate panel", "A philosophical podcast discussing existentialism", "A keynote speech on macroeconomic trends",
            "An interview with a Nobel laureate", "A detailed negotiation over international trade", "A medical symposium presentation", "A complex court case cross-examination",
            "A documentary narration on ancient civilizations", "A sophisticated PR damage control interview", "An academic panel discussion on climate change", "A deep-dive technical podcast on AI ethics",
            "A highly technical engineering project debrief", "A nuanced debate on cultural assimilation", "An investigative report broadcast", "A literary festival author Q&A",
            "A corporate strategy planning retreat audio", "A diplomatic summit press conference", "A specialized webinar on linguistic theories", "A high-stakes merger and acquisition negotiation"
        ]
    }

    # Audio files pool (reusing soundhelix list for listening demo)
    soundhelix_pool = [
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    ]

    for lvl in levels:
        scenarios = listening_scenarios[lvl]
        for idx in range(1, 21):
            current_completed = checkpoint["listening"].get(lvl, 0)
            if idx <= current_completed:
                continue
            
            scenario = scenarios[idx - 1]
            l_type = LISTENING_TYPES[(idx - 1) % len(LISTENING_TYPES)]
            print(f"[+] Generating Listening Level {lvl} - Topic {idx}/20: '{scenario}' ({l_type})...")
            
            prompt = user_prompt_template.format(level=lvl, index=idx, scenario=scenario)
            success = False
            for retry_attempt in range(3):
                try:
                    res = call_groq(sys_prompt, prompt)
                    q_count = len(res.get("questions", []))
                    
                    # Combine transcript, summary, and key vocab
                    body_text = f"Transcript:\n{res.get('transcript')}\n\nSummary:\n{res.get('summary')}"
                    audio_url = soundhelix_pool[(idx - 1) % len(soundhelix_pool)]
                    
                    sc_sql = f"INSERT INTO study_contents (type, title, category, body_text, media_url, description, duration, questions_count) VALUES ('LISTENING', {escape_sql(res.get('title'))}, {escape_sql(lvl)}, {escape_sql(body_text)}, '{audio_url}', {escape_sql(res.get('keyVocab'))}, 15, {q_count});"
                    
                    title_esc = escape_sql(res.get('title'))
                    parent_id_subquery = f"(SELECT id FROM study_contents WHERE type = 'LISTENING' AND title = {title_esc} ORDER BY id DESC LIMIT 1)"
                    
                    q_sqls = []
                    for q_num, q in enumerate(res.get("questions", []), 1):
                        q_sql = f"INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('LISTENING', {parent_id_subquery}, {q_num}, 'MULTIPLE_CHOICE', {escape_sql(lvl)}, {escape_sql(q.get('questionText'))}, {escape_sql(q.get('optionA'))}, {escape_sql(q.get('optionB'))}, {escape_sql(q.get('optionC'))}, {escape_sql(q.get('optionD'))}, {escape_sql(q.get('correctOption'))}, {escape_sql(q.get('correctOption'))}, {escape_sql(q.get('explanation'))});"
                        q_sqls.append(q_sql)
                    
                    full_sql = sc_sql + "\n" + "\n".join(q_sqls)
                    append_sql("seed_listening.sql", full_sql)
                    
                    checkpoint["listening"][lvl] = idx
                    save_checkpoint(checkpoint)
                    print(f"[+] Successfully generated Listening topic {idx} for level {lvl}.")
                    success = True
                    time.sleep(3)
                    break
                except Exception as e:
                    print(f"[-] Failed to generate Listening Level {lvl} Topic {idx} (attempt {retry_attempt+1}/3): {e}")
                    time.sleep(5)
            if not success:
                print(f"[-] Aborting Listening generation for level {lvl} topic {idx} after 3 failed attempts.")
                return

def generate_exams():
    checkpoint = load_checkpoint()
    
    # 1. Placement Test (100 Questions)
    if not checkpoint.get("placement_test", False):
        print("[+] Generating Placement Test (100 Questions in 5 batches)...")
        sys_prompt = "You are an English test builder. Generate 20 high-quality multiple-choice questions for an English Placement Test spanning CEFR A1-B2. Return ONLY raw JSON without markdown code tags."
        
        user_prompt_template = """
        Generate exactly 20 distinct multiple-choice questions for a placement test.
        The questions must cover vocabulary, grammar, reading comprehension, and listening comprehension.
        Distribute difficulty: A1 (5 questions), A2 (5 questions), B1 (5 questions), B2 (5 questions).
        For reading comprehension, incorporate a short text snippet in the questionText.
        For listening comprehension, label with '[Audio Question] Listen and answer: ' in the questionText.
        
        Fields required for each question:
        - questionText: in English.
        - type: 'VOCABULARY', 'GRAMMAR', 'READING', or 'LISTENING'.
        - difficulty: 'A1', 'A2', 'B1', or 'B2'.
        - optionA, optionB, optionC, optionD: options.
        - correctOption: 'A', 'B', 'C', or 'D'.
        - explanation: in Vietnamese.
        
        Format:
        {{
           "questions": [
              {{
                 "questionText": "Choose the correct word...",
                 "type": "VOCABULARY",
                 "difficulty": "A1",
                 "optionA": "...",
                 "optionB": "...",
                 "optionC": "...",
                 "optionD": "...",
                 "correctOption": "C",
                 "explanation": "..."
              }}
           ]
        }}
        """
        
        try:
            sql_lines = []
            for batch_num in range(1, 6):
                print(f"   [-] Generating placement test batch {batch_num}/5...")
                success = False
                for retry_attempt in range(3):
                    try:
                        res = call_groq(sys_prompt, user_prompt_template)
                        questions = res.get("questions", [])
                        if not questions or len(questions) < 15:
                            print(f"[-] AI returned insufficient questions ({len(questions) if questions else 0}). Retrying (attempt {retry_attempt+1}/3)...")
                            time.sleep(5)
                            continue
                        
                        batch_sql = []
                        for idx, q in enumerate(questions, 1):
                            q_num = (batch_num - 1) * 20 + idx
                            sql = f"INSERT INTO questions (source_type, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('PLACEMENT_TEST', {q_num}, {escape_sql(q.get('type'))}, {escape_sql(q.get('difficulty'))}, {escape_sql(q.get('questionText'))}, {escape_sql(q.get('optionA'))}, {escape_sql(q.get('optionB'))}, {escape_sql(q.get('optionC'))}, {escape_sql(q.get('optionD'))}, {escape_sql(q.get('correctOption'))}, {escape_sql(q.get('correctOption'))}, {escape_sql(q.get('explanation'))});"
                            batch_sql.append(sql)
                        
                        sql_lines.extend(batch_sql)
                        success = True
                        time.sleep(3)
                        break
                    except Exception as e:
                        print(f"[-] Failed to generate placement test batch {batch_num} (attempt {retry_attempt+1}/3): {e}")
                        time.sleep(5)
                if not success:
                    print(f"[-] Aborting placement test generation after 3 failed attempts at batch {batch_num}.")
                    return
            
            append_sql("seed_exams.sql", "\n".join(sql_lines))
            checkpoint["placement_test"] = True
            save_checkpoint(checkpoint)
            print("[+] Successfully generated and saved Placement Test questions.")
        except Exception as e:
            print(f"[-] Failed to generate Placement Test: {e}")
            return
    
    # 2. Level Final Tests (5 Tests x 100 Questions)
    for lvl in ["A1", "A2", "B1", "B2", "C1"]:
        if checkpoint["level_tests"].get(lvl, False):
            continue
        
        print(f"[+] Generating Level Final Test for {lvl} (100 Questions in 5 batches)...")
        sys_prompt = f"You are a professional test builder. Generate 20 test questions for Level {lvl} final exam. Return ONLY JSON without markdown."
        user_prompt_template = f"""
        Generate 20 distinct multiple-choice questions for Level {lvl} final test.
        Skills: VOCABULARY (5 questions), GRAMMAR (5 questions), READING (5 questions), LISTENING (5 questions).
        For READING, add short reading passages.
        For LISTENING, prefix with '[Audio]'.
        Fields:
        - questionText
        - type ('VOCABULARY', 'GRAMMAR', 'READING', 'LISTENING')
        - optionA, optionB, optionC, optionD
        - correctOption ('A', 'B', 'C', 'D')
        - explanation (in Vietnamese)
        
        Format:
        {{
           "questions": [
              {{
                 "questionText": "...",
                 "type": "GRAMMAR",
                 "optionA": "...",
                 "optionB": "...",
                 "optionC": "...",
                 "optionD": "...",
                 "correctOption": "B",
                 "explanation": "..."
              }}
           ]
        }}
        """
        
        try:
            sql_lines = []
            sc_sql = f"INSERT INTO study_contents (type, title, category, description, duration, questions_count) VALUES ('EXAM', 'Final Level Exam - {lvl}', '{lvl}', 'Bài kiểm tra tổng kết trình độ {lvl} gồm 100 câu hỏi.', 120, 100);"
            sql_lines.append(sc_sql)
            
            parent_id_subquery = f"(SELECT id FROM study_contents WHERE type = 'EXAM' AND title = 'Final Level Exam - {lvl}' ORDER BY id DESC LIMIT 1)"
            
            for batch_num in range(1, 6):
                print(f"   [-] Generating {lvl} final test batch {batch_num}/5...")
                success = False
                for retry_attempt in range(3):
                    try:
                        res = call_groq(sys_prompt, user_prompt_template)
                        questions = res.get("questions", [])
                        if not questions or len(questions) < 15:
                            print(f"[-] AI returned insufficient questions ({len(questions) if questions else 0}). Retrying (attempt {retry_attempt+1}/3)...")
                            time.sleep(5)
                            continue
                        
                        batch_sql = []
                        for idx, q in enumerate(questions, 1):
                            q_num = (batch_num - 1) * 20 + idx
                            sql = f"INSERT INTO questions (source_type, parent_id, question_number, type, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option, correct_answer, explanation) VALUES ('LEVEL_EXAM', {parent_id_subquery}, {q_num}, {escape_sql(q.get('type'))}, '{lvl}', {escape_sql(q.get('questionText'))}, {escape_sql(q.get('optionA'))}, {escape_sql(q.get('optionB'))}, {escape_sql(q.get('optionC'))}, {escape_sql(q.get('optionD'))}, {escape_sql(q.get('correctOption'))}, {escape_sql(q.get('correctOption'))}, {escape_sql(q.get('explanation'))});"
                            batch_sql.append(sql)
                        
                        sql_lines.extend(batch_sql)
                        success = True
                        time.sleep(3)
                        break
                    except Exception as e:
                        print(f"[-] Failed to generate {lvl} final test batch {batch_num} (attempt {retry_attempt+1}/3): {e}")
                        time.sleep(5)
                if not success:
                    print(f"[-] Aborting level test generation for {lvl} after 3 failed attempts at batch {batch_num}.")
                    return
            
            append_sql("seed_exams.sql", "\n".join(sql_lines))
            checkpoint["level_tests"][lvl] = True
            save_checkpoint(checkpoint)
            print(f"[+] Successfully saved Final Exam for level {lvl}.")
        except Exception as e:
            print(f"[-] Failed to generate Level final test {lvl}: {e}")
            return


# 7. Command-line Execution
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="English Ascension AI Data Seeder Tool")
    parser.add_argument("--type", type=str, required=True, choices=["vocab", "grammar", "reading", "listening", "exams", "all"],
                        help="Data category to generate")
    parser.add_argument("--level", type=str, default="A1,A2,B1,B2,C1",
                        help="Comma-separated CEFR levels to generate (e.g. A1,A2)")
    
    args = parser.parse_args()
    levels = [l.strip() for l in args.level.split(",") if l.strip() in ["A1", "A2", "B1", "B2", "C1"]]
    
    print("="*60)
    print(" ENGLISH ASCENSION AI DATABASE SEED GENERATOR")
    print("="*60)
    print(f"[+] Working Directory: {os.path.dirname(__file__)}")
    print(f"[+] Output Directory: {OUTPUT_DIR}")
    print(f"[+] Selected Levels: {levels}")
    print(f"[+] AI Model: {GROQ_MODEL}")
    print("-"*60)
    
    start_time = time.time()
    
    if args.type == "vocab":
        generate_vocabulary(levels)
    elif args.type == "grammar":
        generate_grammar(levels)
    elif args.type == "reading":
        generate_reading(levels)
    elif args.type == "listening":
        generate_listening(levels)
    elif args.type == "exams":
        generate_exams()
    elif args.type == "all":
        print("[*] Generating all types sequentially...")
        generate_vocabulary(levels)
        generate_grammar(levels)
        generate_reading(levels)
        generate_listening(levels)
        generate_exams()

    duration = time.time() - start_time
    print("-"*60)
    print(f"[+] Completed execution in {duration:.2f} seconds.")
    print("="*60)
