import requests
import sys

BASE_URL = "http://localhost:8000"

USERS = [
    {"role": "student", "email": "student@brainware.edu", "password": "student123", "name": "Student Demo"},
    {"role": "faculty", "email": "faculty@brainware.edu", "password": "faculty123", "name": "Faculty Demo"},
    {"role": "verifier", "email": "verifier@brainware.edu", "password": "verifier123", "name": "Verifier Demo"},
    {"role": "admin", "email": "admin@brainware.edu", "password": "admin123", "name": "Admin Demo"},
    {"role": "management", "email": "management@brainware.edu", "password": "management123", "name": "Management Demo"},
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
