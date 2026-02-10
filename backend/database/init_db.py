# Database Initialization Script

import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connection import Base, engine, SessionLocal
from models.user import User, UserRole
from models.assignment import Assignment, Submission
from auth.jwt_handler import get_password_hash

def init_database():
    """Initialize database and create tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")

def create_demo_users():
    """Create demo users for each role"""
    db = SessionLocal()
    
    try:
        # Check if users already exist
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"Database already has {existing_users} users. Skipping demo user creation.")
            return
        
        # Demo users with credentials
        demo_users = [
            {
                "email": "student@brainware.edu",
                "password": "student123",  # Shortened for bcrypt
                "name": "Demo Student",
                "role": UserRole.STUDENT
            },
            {
                "email": "faculty@brainware.edu",
                "password": "faculty123",
                "name": "Demo Faculty",
                "role": UserRole.FACULTY
            },
            {
                "email": "verifier@brainware.edu",
                "password": "verifier123",
                "name": "Demo Verifier",
                "role": UserRole.VERIFIER
            },
            {
                "email": "admin@brainware.edu",
                "password": "admin123",
                "name": "Demo Admin",
                "role": UserRole.ADMIN
            },
            {
                "email": "management@brainware.edu",
                "password": "management123",
                "name": "Demo Management",
                "role": UserRole.MANAGEMENT
            }
        ]
        
        print("\nCreating demo users...")
        for user_data in demo_users:
            user = User(
                email=user_data["email"],
                password_hash=get_password_hash(user_data["password"]),
                name=user_data["name"],
                role=user_data["role"]
            )
            db.add(user)
            print(f"  ✓ Created {user_data['role'].value}: {user_data['email']} (password: {user_data['password']})")
        
        db.commit()
        print("\n✓ Demo users created successfully!")
        print("\nYou can now login with any of the above credentials.")
        
    except Exception as e:
        print(f"Error creating demo users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Dabba AI - Database Initialization")
    print("=" * 60)
    
    init_database()
    create_demo_users()
    
    print("\n" + "=" * 60)
    print("Database initialization complete!")
    print("=" * 60)
