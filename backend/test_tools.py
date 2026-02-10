#!/usr/bin/env python3
"""
Test the "Tools" API endpoints: Flashcards, Quiz, Study Plan, Summarize
"""
import requests
import json
import sys
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8000"

def print_separator(title):
    print("\n" + "=" * 60)
    print(f"TEST: {title}")
    print("=" * 60)

def test_endpoint(name, url, payload, expected_keys):
    print_separator(name)
    logger.info(f"Testing {name} at {url}")
    
    try:
        start_time = time.time()
        logger.info(f"Sending request with payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(f"{BASE_URL}{url}", json=payload, timeout=90)
        duration = time.time() - start_time
        
        logger.info(f"Response received in {duration:.2f}s with status {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            # logger.info(f"Response data: {json.dumps(data, indent=2)}")
            
            # Check success flag if present
            if 'success' in data and not data['success']:
                print(f"❌ {name} Failed: {data.get('message', 'Unknown error')}")
                return False
                
            # Check expected keys
            missing_keys = [k for k in expected_keys if k not in data]
            if missing_keys:
                print(f"❌ {name} Failed: Missing keys {missing_keys}")
                return False
            
            # Specific validation for each tool
            if name == "Summarize":
                print(f"📝 Summary: {data['summary'][:100]}...")
                
            elif name == "Study Plan":
                plan = data.get('studyPlan', {})
                weeks = plan.get('weeks', [])
                print(f"📅 Study Plan generated for {plan.get('subject')}")
                print(f"   Weeks: {len(weeks)}")
                if weeks:
                    print(f"   Week 1 Title: {weeks[0].get('weekTitle')}")
                    
            elif name == "Flashcards":
                cards = data.get('cards', [])
                print(f"🃏 Flashcards generated: {len(cards)}")
                if cards:
                    print(f"   Sample Q: {cards[0].get('question')}")
                    print(f"   Sample A: {cards[0].get('correct_answer')}")
                    
            elif name == "Quiz":
                quiz = data.get('quiz', {})
                questions = quiz.get('questions', [])
                print(f"❓ Quiz generated: {len(questions)} questions")
                if questions:
                    print(f"   Sample Q: {questions[0].get('question')}")
                    
            print(f"✅ {name} Passed!")
            return True
            
        else:
            print(f"❌ {name} Failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ {name} Error: {e}")
        return False

def main():
    # 1. Test Summarize
    test_endpoint(
        "Summarize",
        "/tools/summarize",
        {
            "content": "Artificial Intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. Leading AI textbooks define the field as the study of 'intelligent agents': any system that perceives its environment and takes actions that maximize its chance of achieving its goals.",
            "maxLength": 50
        },
        ["success", "summary"]
    )

    # 2. Test Study Plan (Pure generation, no embedding search)
    test_endpoint(
        "Study Plan",
        "/tools/study-plan",
        {
            "subject": "Intro to AI",
            "duration": 2,
            "difficulty": "beginner",
            "learning_style": "visual",
            "study_time": "1 hour per day",
            "study_time_period": "evening",
            "goals": "Understand basics of AI",
            "weakAreas": "None"
        },
        ["success", "studyPlan"]
    )

    # 3. Test Flashcards (Requires context search)
    # Using "Python" as subject since we know we uploaded Python content or can rely on broad search
    test_endpoint(
        "Flashcards",
        "/tools/flashcards",
        {
            "subject": "Python",
            "topic": "Basics",
            "numCards": 3,
            "difficulty": "beginner",
            "cardType": "mcq"
        },
        ["success", "cards"]
    )

    # 4. Test Quiz (Requires context search)
    test_endpoint(
        "Quiz",
        "/tools/quiz",
        {
            "subject": "Python",
            "topic": "Data Types",
            "numQuestions": 3,
            "difficulty": "beginner",
            "questionType": "multiple-choice"
        },
        ["success", "quiz"]
    )

if __name__ == "__main__":
    main()
