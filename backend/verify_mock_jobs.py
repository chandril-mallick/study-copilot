import requests
import json

BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api/student/jobs/list"

# Note: This script assumes a local server is running and might need a token.
# However, for a quick verification, we can try to see if it works or if we get a 401/403.
# If it needs a token, we might need a test account.

def verify_jobs():
    print(f"Testing {API_URL}...")
    try:
        # First attempt without token (might fail if auth is strict)
        response = requests.get(API_URL)
        if response.status_code == 200:
            jobs = response.json()
            print(f"Success! Found {len(jobs)} jobs.")
            for job in jobs:
                print(f"- {job['title']} at {job['company']} (ID: {job['id']})")
            
            mock_ids = [j['id'] for j in jobs if j['id'].startswith('mock_')]
            if mock_ids:
                print(f"Verified: Mock jobs are present: {mock_ids}")
            else:
                print("Warning: No mock jobs found in response.")
        else:
            print(f"Failed with status {response.status_code}: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_jobs()
