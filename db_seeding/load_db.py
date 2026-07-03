import os
import psycopg2

ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
SCHEMA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "src", "main", "resources", "schema.sql"))
DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "src", "main", "resources", "data.sql"))
SEED_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "sql_output", "seed_all_new.sql"))

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

def run():
    env = load_env(ENV_PATH)
    db_url = env.get("SPRING_DATASOURCE_URL", "jdbc:postgresql://localhost:5432/english_ascension")
    db_user = env.get("SPRING_DATASOURCE_USERNAME", "postgres")
    db_pass = env.get("SPRING_DATASOURCE_PASSWORD", "jcxdc@123")
    
    # Parse host, port, db name from JDBC URL
    # jdbc:postgresql://localhost:5432/english_ascension
    try:
        parts = db_url.replace("jdbc:postgresql://", "").split("/")
        host_port = parts[0].split(":")
        db_host = host_port[0]
        db_port = host_port[1] if len(host_port) > 1 else "5432"
        db_name = parts[1]
    except Exception:
        db_host = "localhost"
        db_port = "5432"
        db_name = "english_ascension"
        
    print(f"[+] Connecting to PostgreSQL at {db_host}:{db_port}/{db_name} as user '{db_user}'...")
    try:
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_pass
        )
        conn.autocommit = True
        cursor = conn.cursor()
        print("[+] Connection established successfully.")
    except Exception as e:
        print(f"[-] Connection failed: {e}")
        return

    # 1. Run schema.sql
    print(f"[+] Executing schema: {SCHEMA_PATH}...")
    try:
        with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
            schema_sql = f.read()
        cursor.execute(schema_sql)
        print("[+] Schema initialization completed successfully.")
    except Exception as e:
        print(f"[-] Schema execution failed: {e}")
        conn.close()
        return

    # 2. Run data.sql
    print(f"[+] Executing base data: {DATA_PATH}...")
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            data_sql = f.read()
        cursor.execute(data_sql)
        print("[+] Base data loaded successfully.")
    except Exception as e:
        print(f"[-] Base data execution failed: {e}")
        conn.close()
        return

    # 3. Run seed_all_new.sql
    print(f"[+] Executing seed lessons and vocabulary: {SEED_PATH}...")
    try:
        with open(SEED_PATH, "r", encoding="utf-8") as f:
            seed_sql = f.read()
        cursor.execute(seed_sql)
        print("[+] Seed lessons and vocabulary loaded successfully.")
    except Exception as e:
        print(f"[-] Seed execution failed: {e}")
        conn.close()
        return

    # 4. Synchronize serial sequences
    print("[+] Synchronizing serial sequences...")
    sequences = [
        "users", "roadmaps", "user_roadmaps", "modules", "lessons", 
        "lesson_contents", "vocabulary_words", "personal_words", 
        "questions", "question_options"
    ]
    for seq in sequences:
        try:
            cursor.execute(f"SELECT setval(pg_get_serial_sequence('{seq}', 'id'), COALESCE(max(id), 1)) FROM {seq};")
        except Exception as e:
            # Some tables might have different primary keys or schema constraints, ignore errors
            pass
            
    print("[+] Sequence synchronization completed.")
    conn.close()
    print("[+] Database loaded successfully!")

if __name__ == "__main__":
    run()
