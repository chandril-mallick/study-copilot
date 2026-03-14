import requests
import sys

BASE_URL = "http://localhost:8000"

USERS = [
    {"role": "student", "email": "student@dababot.ai", "password": "password123", "name": "Student Demo"},
    {"role": "faculty", "email": "faculty@dababot.ai", "password": "password123", "name": "Faculty Demo"},
    {"role": "verifier", "email": "verifier@dababot.ai", "password": "password123", "name": "Verifier Demo"},
    {"role": "admin", "email": "admin@dababot.ai", "password": "password123", "name": "Admin Demo"},
    {"role": "management", "email": "management@dababot.ai", "password": "password123", "name": "Management Demo"},
]

def seed():
    print(f"🌱 Seeding {len(USERS)} default users to {BASE_URL}...")
    
    for u in USERS:
        print(f"   Creating {u['role'].upper()} ({u['email']})...", end=" ")
        
        # 1. Register
        payload = {"email": u["email"], "password": u["password"], "name": u["name"], "role": u["role"]}
        try:
            resp = requests.post(f"{BASE_URL}/api/auth/register", json=payload)
            if resp.status_code == 200:
                print("✅ Created")
            elif resp.status_code == 400 and "already exists" in resp.text:
                print("ℹ️  Already exists")
            else:
                print(f"❌ Failed ({resp.status_code}): {resp.text}")
        except Exception as e:
            print(f"❌ Connection Error: {e}")
            sys.exit(1)

    print("\n✨ Seeding Complete! You can now login via the Frontend.")

if __name__ == "__main__":
    seed()
