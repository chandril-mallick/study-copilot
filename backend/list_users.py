from sqlalchemy import create_engine, text
import os

DATABASE_URL = "sqlite:///./dabba_ai.db"
engine = create_engine(DATABASE_URL)

def list_users():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT email, role FROM users LIMIT 10"))
        print("Users found:")
        for row in result:
            print(f"- {row[0]} ({row[1]})")

if __name__ == "__main__":
    list_users()
