# Unit Tests for Student APIs

import pytest
from fastapi.testclient import TestClient
from tests.test_auth import test_client, test_user

class TestStudentAPIs:
    """Test Student API endpoints"""
    
    def get_student_token(self, test_client):
        """Helper to get student auth token"""
        response = test_client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "testpassword"}
        )
        return response.json()["access_token"]
    
    def test_get_learning_path(self, test_client, test_user):
        """Test getting learning path"""
        token = self.get_student_token(test_client)
        response = test_client.get(
            "/api/student/learning-path",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "weekly_plan" in data
        assert "weak_topics" in data
        assert "overall_progress" in data
    
    def test_ai_tutor_modes(self, test_client, test_user):
        """Test getting AI tutor modes"""
        token = self.get_student_token(test_client)
        response = test_client.get(
            "/api/student/tutor/modes",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        modes = response.json()
        assert len(modes) == 4
        assert any(m["id"] == "explain" for m in modes)
    
    def test_ai_tutor_chat(self, test_client, test_user):
        """Test chatting with AI tutor"""
        token = self.get_student_token(test_client)
        response = test_client.post(
            "/api/student/tutor/chat",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "message": "Explain recursion",
                "mode": "eli5"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert "session_id" in data
    
    def test_list_assignments(self, test_client, test_user):
        """Test listing assignments"""
        token = self.get_student_token(test_client)
        response = test_client.get(
            "/api/student/assignments",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_generate_summary(self, test_client, test_user):
        """Test generating summary"""
        token = self.get_student_token(test_client)
        response = test_client.post(
            "/api/student/revision/summary",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "content": "This is test content about data structures.",
                "subject": "Computer Science",
                "max_length": 100
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "summary" in data
    
    def test_list_study_groups(self, test_client, test_user):
        """Test listing study groups"""
        token = self.get_student_token(test_client)
        response = test_client.get(
            "/api/student/study-groups",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)
