"""
Seed CSE Classes for Daily Feedback System
This script creates sample Computer Science Engineering classes
"""

import sys
import os
from datetime import datetime, timedelta

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from database.connection import SessionLocal, init_db
from models.class_feedback import ClassSession
from models.user import User

def seed_cse_classes():
    """Create sample CSE classes for testing"""
    
    # Initialize database
    init_db()
    
    db: Session = SessionLocal()
    
    try:
        # Find a faculty user (or create one if needed)
        faculty = db.query(User).filter(User.role == "faculty").first()
        
        if not faculty:
            print("⚠️  No faculty user found. Please create a faculty user first.")
            print("   You can do this through the login/registration flow.")
            return
        
        print(f"✓ Using faculty: {faculty.name} (ID: {faculty.id})")
        
        # Get today's date
        today = datetime.now()
        
        # CSE Classes to create
        cse_classes = [
            {
                "subject": "Data Structures and Algorithms",
                "topic": "Binary Trees and Tree Traversal",
                "date": today.replace(hour=9, minute=0, second=0, microsecond=0)
            },
            {
                "subject": "Database Management Systems",
                "topic": "SQL Joins and Normalization",
                "date": today.replace(hour=11, minute=0, second=0, microsecond=0)
            },
            {
                "subject": "Operating Systems",
                "topic": "Process Scheduling Algorithms",
                "date": today.replace(hour=14, minute=0, second=0, microsecond=0)
            },
            {
                "subject": "Computer Networks",
                "topic": "TCP/IP Protocol Suite",
                "date": today.replace(hour=16, minute=0, second=0, microsecond=0)
            },
            {
                "subject": "Object Oriented Programming",
                "topic": "Inheritance and Polymorphism",
                "date": (today - timedelta(days=1)).replace(hour=10, minute=0, second=0, microsecond=0)
            },
            {
                "subject": "Web Development",
                "topic": "React Hooks and State Management",
                "date": (today - timedelta(days=1)).replace(hour=15, minute=0, second=0, microsecond=0)
            },
            {
                "subject": "Machine Learning",
                "topic": "Neural Networks Introduction",
                "date": (today - timedelta(days=2)).replace(hour=10, minute=0, second=0, microsecond=0)
            },
            {
                "subject": "Software Engineering",
                "topic": "Agile Methodology and Scrum",
                "date": (today - timedelta(days=2)).replace(hour=14, minute=0, second=0, microsecond=0)
            }
        ]
        
        created_count = 0
        
        for class_data in cse_classes:
            # Check if class already exists
            existing = db.query(ClassSession).filter(
                ClassSession.faculty_id == faculty.id,
                ClassSession.subject == class_data["subject"],
                ClassSession.date == class_data["date"]
            ).first()
            
            if not existing:
                new_class = ClassSession(
                    faculty_id=faculty.id,
                    subject=class_data["subject"],
                    topic=class_data["topic"],
                    date=class_data["date"]
                )
                db.add(new_class)
                created_count += 1
                print(f"✓ Created: {class_data['subject']} - {class_data['topic']}")
            else:
                print(f"⊘ Skipped (already exists): {class_data['subject']}")
        
        db.commit()
        
        print(f"\n✅ Successfully created {created_count} CSE classes!")
        print(f"📚 Total classes in database: {db.query(ClassSession).count()}")
        
        # Show all classes
        print("\n📋 All Available Classes:")
        all_classes = db.query(ClassSession).order_by(ClassSession.date.desc()).all()
        for cls in all_classes:
            date_str = cls.date.strftime("%Y-%m-%d %H:%M")
            print(f"   • {cls.subject} - {cls.topic} ({date_str})")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🎓 Seeding CSE Classes for Daily Feedback System\n")
    seed_cse_classes()
    print("\n✨ Done! Students can now select these classes for feedback.")
