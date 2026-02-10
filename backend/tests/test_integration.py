# Integration Tests

import pytest
from fastapi.testclient import TestClient
from tests.test_auth import test_client, test_user
from models.assignment import Assignment, Submission
from database.connection import get_db

class TestIntegration:
    """Integration tests for complete workflows"""
    
    def test_student_assignment_workflow(self, test_client, test_user):
        """Test complete assignment submission workflow"""
        # 1. Login as student
        login_response = test_client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "testpassword"}
        )
        student_token = login_response.json()["access_token"]
        
        # 2. List assignments
        assignments_response = test_client.get(
            "/api/student/assignments",
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert assignments_response.status_code == 200
        
        # 3. Get assignment hints
        hints_response = test_client.post(
            "/api/student/assignments/1/hints",
            headers={"Authorization": f"Bearer {student_token}"},
            json={"question": "What is Big O notation?"}
        )
        assert hints_response.status_code in [200, 404]  # 404 if no assignment exists
        
        # 4. Check plagiarism
        plagiarism_response = test_client.post(
            "/api/student/assignments/1/plagiarism-check",
            headers={"Authorization": f"Bearer {student_token}"},
            json={"content": "My answer about Big O notation..."}
        )
        assert plagiarism_response.status_code == 200
    
    def test_ai_tutor_session_workflow(self, test_client, test_user):
        """Test AI tutor conversation workflow"""
        login_response = test_client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "testpassword"}
        )
        token = login_response.json()["access_token"]
        
        # 1. Get available modes
        modes_response = test_client.get(
            "/api/student/tutor/modes",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert modes_response.status_code == 200
        
        # 2. Start chat in explain mode
        chat1_response = test_client.post(
            "/api/student/tutor/chat",
            headers={"Authorization": f"Bearer {token}"},
            json={"message": "What is recursion?", "mode": "explain"}
        )
        assert chat1_response.status_code == 200
        session_id = chat1_response.json()["session_id"]
        
        # 3. Continue chat in same session
        chat2_response = test_client.post(
            "/api/student/tutor/chat",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "message": "Can you give an example?",
                "mode": "explain",
                "session_id": session_id
            }
        )
        assert chat2_response.status_code == 200
        assert chat2_response.json()["session_id"] == session_id
    
    def test_revision_workflow(self, test_client, test_user):
        """Test complete revision workflow"""
        login_response = test_client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "testpassword"}
        )
        token = login_response.json()["access_token"]
        
        content = "Data structures are fundamental concepts in computer science..."
        
        # 1. Generate summary
        summary_response = test_client.post(
            "/api/student/revision/summary",
            headers={"Authorization": f"Bearer {token}"},
            json={"content": content, "subject": "CS", "max_length": 200}
        )
        assert summary_response.status_code == 200
        
        # 2. Generate mind map
        mindmap_response = test_client.post(
            "/api/student/revision/mindmap",
            headers={"Authorization": f"Bearer {token}"},
            json={"topic": "Data Structures", "subject": "CS"}
        )
        assert mindmap_response.status_code == 200
        
        # 3. Generate flashcards
        flashcards_response = test_client.post(
            "/api/student/revision/flashcards",
            headers={"Authorization": f"Bearer {token}"},
            json={"content": content, "num_cards": 5}
        )
        assert flashcards_response.status_code == 200
        assert len(flashcards_response.json()["cards"]) > 0

class TestPerformance:
    """Performance tests"""
    
    def test_concurrent_requests(self, test_client, test_user):
        """Test handling multiple concurrent requests"""
        import concurrent.futures
        
        login_response = test_client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "testpassword"}
        )
        token = login_response.json()["access_token"]
        
        def make_request():
            return test_client.get(
                "/api/student/learning-path",
                headers={"Authorization": f"Bearer {token}"}
            )
        
        # Make 10 concurrent requests
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request) for _ in range(10)]
            results = [f.result() for f in futures]
        
        # All should succeed
        assert all(r.status_code == 200 for r in results)
