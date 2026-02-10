import sys
import os
from datetime import datetime, timedelta

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.connection import SessionLocal
from models.user import User, UserRole
from models.assignment import Assignment, Submission
from auth.jwt_handler import get_password_hash

def seed_grader_data():
    db = SessionLocal()
    try:
        print("Starting Auto-Grader seeding...")

        # 1. Get Faculty
        faculty = db.query(User).filter(User.email == "faculty@brainware.edu").first()
        if not faculty:
            print("Creating Faculty...")
            faculty = User(
                email="faculty@brainware.edu",
                password_hash=get_password_hash("faculty123"),
                name="Prof. Dumbledore",
                role=UserRole.FACULTY
            )
            db.add(faculty)
            db.commit()
            db.refresh(faculty)
        
        # 2. Get Student
        student = db.query(User).filter(User.email == "student@brainware.edu").first()
        if not student:
            print("Creating Student...")
            student = User(
                email="student@brainware.edu",
                password_hash=get_password_hash("student123"),
                name="Harry Potter",
                role=UserRole.STUDENT
            )
            db.add(student)
            db.commit()
            db.refresh(student)

        # 3. Create Assignment
        assignment_title = "History of Magic Essay"
        assignment = db.query(Assignment).filter(Assignment.title == assignment_title).first()
        if not assignment:
            print("Creating Assignment...")
            assignment = Assignment(
                faculty_id=faculty.id,
                title=assignment_title,
                description="Write an essay about the Goblin Rebellions.",
                subject="History of Magic",
                max_marks=100.0,
                due_date=datetime.utcnow() + timedelta(days=7)
            )
            db.add(assignment)
            db.commit()
            db.refresh(assignment)

        # 4. Create Pending Submission
        submission = db.query(Submission).filter(Submission.assignment_id == assignment.id).first()
        if not submission:
            print("Creating Submission...")
            submission = Submission(
                assignment_id=assignment.id,
                student_id=student.id,
                content="The Goblin Rebellions were a series of rebellions by goblins against wizarding oppression...",
                status="submitted"
            )
            db.add(submission)
            db.commit()
            print("✓ Created pending submission")
        else:
            print("Submission already exists.")

    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_grader_data()
