#!/usr/bin/env python3
"""
Test ALL major frontend-backend API connections for ALL ROLES
Simulates user flows for: Student, Faculty, Verifier, Admin, Management
"""
import requests
import json
import random
import string
import sys
import time
import os

BASE_URL = "http://localhost:8000"
HEADERS = {"Content-Type": "application/json"}

def print_section(title):
    print("\n" + "=" * 60)
    print(f"🔹 {title}")
    print("=" * 60)

def generate_random_email(role):
    chars = string.ascii_lowercase + string.digits
    username = ''.join(random.choice(chars) for _ in range(8))
    return f"{role}_{username}@dabbademo.com"

def check_response(response, expected_code=200, context=""):
    if response.status_code == expected_code:
        print(f"   ✅ PASS: {context} ({response.status_code})")
        try:
            return response.json()
        except:
            return response.text
    else:
        print(f"   ❌ FAIL: {context} ({response.status_code})")
        print(f"   Response: {response.text[:200]}...")
        return None

def get_auth_token(role):
    """Register and Login a user with specific role"""
    print(f"\n🔐 Authenticating as {role.upper()}...")
    email = generate_random_email(role)
    password = "password123"
    
    # Register
    reg_payload = {"email": email, "password": password, "name": f"Test {role.capitalize()}", "role": role}
    requests.post(f"{BASE_URL}/api/auth/register", json=reg_payload)
    
    # Login
    login_payload = {"email": email, "password": password}
    resp = requests.post(f"{BASE_URL}/api/auth/login", json=login_payload)
    data = check_response(resp, 200, f"Login {role}")
    
    if data and "access_token" in data:
        return data["access_token"]
    else:
        print(f"   ⛔ Could not authenticate as {role}")
        return None

def test_faculty_flow():
    token = get_auth_token("faculty")
    if not token: return None
    
    headers = {"Authorization": f"Bearer {token}", **HEADERS}
    
    print_section("👨‍� Testing FACULTY Features")
    
    # 1. Dashboard Stats
    check_response(requests.get(f"{BASE_URL}/api/faculty/dashboard/stats", headers=headers), 200, "Dashboard Stats")
    
    # 2. Generate Lesson Plan
    lesson_p = {"subject": "Computer Science", "topic": "Binary Search", "duration": "45 minutes"}
    check_response(requests.post(f"{BASE_URL}/api/faculty/lessons/generate", params=lesson_p, headers=headers), 200, "Generate Lesson Plan")
    
    # 3. Create Assignment
    assign_p = {
        "title": "Data Structures Basics", "description": "Implement a Linked List", 
        "subject": "CS", "due_date": "2025-12-31T23:59:59", "max_marks": 100
    }
    resp = check_response(requests.post(f"{BASE_URL}/api/faculty/assignments", json=assign_p, headers=headers), 200, "Create Assignment")
    
    if resp and "id" in resp:
        return resp["id"]
    return None

def test_student_flow(assignment_id=None):
    token = get_auth_token("student")
    if not token: return
    
    headers = {"Authorization": f"Bearer {token}", **HEADERS}
    
    print_section("� Testing STUDENT Features")
    
    # 1. Learning Path
    check_response(requests.get(f"{BASE_URL}/api/student/learning-path", headers=headers), 200, "Get Learning Path")
    
    # 2. AI Tutor Chat
    chat_p = {"message": "Explain recursion", "mode": "eli5"}
    check_response(requests.post(f"{BASE_URL}/api/student/tutor/chat", json=chat_p, headers=headers), 200, "AI Tutor Chat")

    # 3. Core: Ask Question
    ask_p = {"question": "What is Python?", "use_context": True}
    check_response(requests.post(f"{BASE_URL}/ask", json=ask_p, headers=headers), 200, "Core: Ask Question")

    # 4. Assignments & Hints (If assignment_id exists)
    if assignment_id:
        print("\n   📝 Testing Assignment Submission flow...")
        # List
        check_response(requests.get(f"{BASE_URL}/api/student/assignments", headers=headers), 200, "List Assignments")
        
        # Get Detail
        check_response(requests.get(f"{BASE_URL}/api/student/assignments/{assignment_id}", headers=headers), 200, "Get Assignment Detail")
        
        # Get Hints
        hint_p = {"question": "How do I start?", "context": "I know class Node"}
        check_response(requests.post(f"{BASE_URL}/api/student/assignments/{assignment_id}/hints", json=hint_p, headers=headers), 200, "Get AI Hints")
        
        # Submit
        sub_p = {"content": "class Node: ... implementation ..."}
        check_response(requests.post(f"{BASE_URL}/api/student/assignments/{assignment_id}/submit", json=sub_p, headers=headers), 200, "Submit Assignment")
    
    # 5. Study Groups
    print("\n   👥 Testing Study Group flow...")
    # List (should be empty or unrelated)
    check_response(requests.get(f"{BASE_URL}/api/student/study-groups", headers=headers), 200, "List Study Groups")
    
    # Create Group
    group_p = {"name": "Python Masters", "subject": "CS", "description": "Advanced Python study"}
    group_resp = check_response(requests.post(f"{BASE_URL}/api/student/study-groups", json=group_p, headers=headers), 200, "Create Study Group")
    
    if group_resp and "id" in group_resp:
        gid = group_resp["id"]
        # Post Message
        msg_p = {"content": "Hello everyone!"}
        check_response(requests.post(f"{BASE_URL}/api/student/study-groups/{gid}/messages", json=msg_p, headers=headers), 200, "Post Group Message")
        
        # Get Messages
        check_response(requests.get(f"{BASE_URL}/api/student/study-groups/{gid}/messages", headers=headers), 200, "Get Group Messages")


def test_verifier_flow():
    token = get_auth_token("verifier")
    if not token: return
    
    headers = {"Authorization": f"Bearer {token}", **HEADERS}
    
    print_section("🔍 Testing VERIFIER Features")
    
    # 1. Verify History
    check_response(requests.get(f"{BASE_URL}/api/verifier/verify/history", headers=headers), 200, "Verification History")
    
    # 2. Verify Certificate
    params = {"certificate_number": "CERT12345", "institution": "Test University"}
    check_response(requests.post(f"{BASE_URL}/api/verifier/verify/certificate", params=params, headers=headers), 200, "Verify Certificate")
    
    # 3. Batch Upload
    import tempfile
    with tempfile.NamedTemporaryFile(suffix=".zip") as tf:
        tf.write(b"PK...dummy zip content...")
        tf.seek(0)
        files = {"file": ("test_batch.zip", tf, "application/zip")}
        up_headers = {"Authorization": f"Bearer {token}"}
        check_response(requests.post(f"{BASE_URL}/api/verifier/batch/upload", files=files, headers=up_headers), 200, "Batch Upload ZIP")

def test_admin_flow():
    token = get_auth_token("admin")
    if not token: return
    
    headers = {"Authorization": f"Bearer {token}", **HEADERS}
    
    print_section("🛡️ Testing ADMIN Features")
    
    # 1. Security Logs
    check_response(requests.get(f"{BASE_URL}/api/admin/security/logs", headers=headers), 200, "Security Logs")
    
    # 2. Activity Insights
    check_response(requests.get(f"{BASE_URL}/api/admin/insights/activity", headers=headers), 200, "Activity Insights")

def test_management_flow():
    token = get_auth_token("management")
    if not token: return
    
    headers = {"Authorization": f"Bearer {token}", **HEADERS}
    
    print_section("💼 Testing MANAGEMENT Features")
    
    # 1. Institution Stats (Brain)
    check_response(requests.get(f"{BASE_URL}/api/admin/brain/stats", headers=headers), 200, "Institution Stats")
    
    # 2. Benchmarking
    check_response(requests.get(f"{BASE_URL}/api/admin/management/benchmark/placement", headers=headers), 200, "Placement Benchmark")
    
    # 3. Policy Generation
    policy_p = {"topic": "Campus Safety", "template_type": "circular"}
    check_response(requests.post(f"{BASE_URL}/api/admin/management/policy/generate", params=policy_p, headers=headers), 200, "Generate Policy")

def main():
    print_section("Checking Backend Availability")
    max_retries = 5
    for i in range(max_retries):
        try:
            requests.get(f"{BASE_URL}/health", timeout=5)
            print("   ✅ Backend is ONLINE")
            break
        except:
            if i == max_retries - 1:
                print("   ❌ Backend not reachable after 5 attempts. Is it running?")
                sys.exit(1)
            print(f"   Using attempt {i+1}/5 to connect...")
            time.sleep(2)

    # REORDERED FLOW: Faculty first to create assignment for Student
    print("\n📦 Starting Workflow Tests...")
    
    # 1. Faculty (Creates assignment)
    assignment_id = test_faculty_flow()
    if assignment_id:
        print(f"   ℹ️  Created Assignment ID: {assignment_id}")
    else:
        print("   ⚠️  Failed to create assignment, skipping student submission test.")

    # 2. Student (Uses assignment)
    test_student_flow(assignment_id)
    
    # 3. Others
    test_verifier_flow()
    test_admin_flow()
    test_management_flow()
    
    print("\n" + "=" * 60)
    print("✅ COMPLETED FULL SYSTEM CHECK")
    print("=" * 60)

if __name__ == "__main__":
    main()
