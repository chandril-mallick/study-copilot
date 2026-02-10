# Unit Tests for Authentication

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from database.connection import Base, get_db
from models.user import User, UserRole
from auth.jwt_handler import get_password_hash

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def test_client():
    """Create test client"""
    Base.metadata.create_all(bind=engine)
    client = TestClient(app)
    yield client
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_user(test_client):
    """Create a test user"""
    db = TestingSessionLocal()
    user = User(
        email="test@example.com",
        password_hash=get_password_hash("testpassword"),
        name="Test User",
        role=UserRole.STUDENT
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user

class TestAuthentication:
    """Test authentication endpoints"""
    
    def test_register_user(self, test_client):
        """Test user registration"""
        response = test_client.post(
            "/api/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "password123",
                "name": "New User",
                "role": "student"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == "newuser@example.com"
    
    def test_register_duplicate_email(self, test_client, test_user):
        """Test registration with duplicate email"""
        response = test_client.post(
            "/api/auth/register",
            json={
                "email": test_user.email,
                "password": "password123",
                "name": "Duplicate User",
                "role": "student"
            }
        )
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"]
    
    def test_login_success(self, test_client, test_user):
        """Test successful login"""
        response = test_client.post(
            "/api/auth/login",
            json={
                "email": test_user.email,
                "password": "testpassword"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
    
    def test_login_wrong_password(self, test_client, test_user):
        """Test login with wrong password"""
        response = test_client.post(
            "/api/auth/login",
            json={
                "email": test_user.email,
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401
    
    def test_get_current_user(self, test_client, test_user):
        """Test getting current user info"""
        # First login to get token
        login_response = test_client.post(
            "/api/auth/login",
            json={
                "email": test_user.email,
                "password": "testpassword"
            }
        )
        token = login_response.json()["access_token"]
        
        # Get current user
        response = test_client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user.email
    
    def test_unauthorized_access(self, test_client):
        """Test accessing protected endpoint without token"""
        response = test_client.get("/api/auth/me")
        assert response.status_code == 401

class TestRBAC:
    """Test role-based access control"""
    
    def test_student_access_student_endpoint(self, test_client, test_user):
        """Test student can access student endpoints"""
        login_response = test_client.post(
            "/api/auth/login",
            json={"email": test_user.email, "password": "testpassword"}
        )
        token = login_response.json()["access_token"]
        
        response = test_client.get(
            "/api/student/learning-path",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
    
    def test_student_cannot_access_faculty_endpoint(self, test_client, test_user):
        """Test student cannot access faculty endpoints"""
        login_response = test_client.post(
            "/api/auth/login",
            json={"email": test_user.email, "password": "testpassword"}
        )
        token = login_response.json()["access_token"]
        
        response = test_client.get(
            "/api/faculty/dashboard/stats",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 403
