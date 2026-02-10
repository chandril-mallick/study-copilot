import requests
import sys

BASE_URL = "http://localhost:8000"

def get_token():
    # Login as Management (using the one created by test_all_connections.py if possible, or new one)
    # I'll register a new one to be sure
    email = "test_mgmt_debug@dabbademo.com"
    password = "password123"
    
    requests.post(f"{BASE_URL}/api/auth/register", json={
        "email": email, "password": password, "name": "Mgmt Debug", "role": "management"
    })
    
    resp = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": email, "password": password
    })
    
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        sys.exit(1)
        
    return resp.json()["access_token"]

def reproduce():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    print("1. POST Policy Generate...")
    resp = requests.post(f"{BASE_URL}/api/admin/management/policy/generate", 
                         params={"topic": "Test", "template_type": "circular"},
                         headers=headers)
    print(f"   Status: {resp.status_code}")
    
    print("2. GET Benchmark Placement...")
    resp = requests.get(f"{BASE_URL}/api/admin/management/benchmark/placement", headers=headers)
    print(f"   Status: {resp.status_code}")
    if resp.status_code != 200:
        print(f"   Response: {resp.text}")

if __name__ == "__main__":
    reproduce()
