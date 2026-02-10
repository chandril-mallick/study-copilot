from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from ollama_utils import run_ollama, check_ollama_availability

router = APIRouter()

class StudyPlanRequest(BaseModel):
    subject: str
    duration: int
    difficulty: str = "intermediate"
    goals: str = ""
    learning_style: str = "visual"
    study_time: str = "2 hours per day"
    study_time_period: str = "morning"
    weakAreas: str = ""

class StudyPlanResponse(BaseModel):
    success: bool
    studyPlan: dict  # <-- change from str to dict for correct JSON serialization
    message: str = ""

@router.post("/tools/study-plan", response_model=StudyPlanResponse)
async def generate_study_plan(request: StudyPlanRequest):
    import re
    import json
    # Validate required fields and build a validation error message
    missing_fields = []
    if not request.subject:
        missing_fields.append("subject")
    if not request.duration:
        missing_fields.append("duration")
    if not request.difficulty:
        missing_fields.append("difficulty")
    if not request.learning_style:
        missing_fields.append("learning_style")
    if not request.study_time:
        missing_fields.append("study_time")
    if not request.study_time_period:
        missing_fields.append("study_time_period")
    if request.goals is None:
        missing_fields.append("goals")
    # weakAreas is optional, so no validation needed
    if missing_fields:
        raise HTTPException(status_code=400, detail=f"Missing required fields: {', '.join(missing_fields)}")
    if not check_ollama_availability():
        raise HTTPException(status_code=503, detail="Ollama service is not available. Please ensure Ollama is running and the gemma3:1b model is installed.")
    # Build prompt for Ollama
    prompt = f"""
You are an expert academic mentor. Generate a personalized study plan in JSON for the following student:
Subject: {request.subject}
Duration: {request.duration} weeks
Difficulty: {request.difficulty}
Learning Style: {request.learning_style}
Study Time: {request.study_time}
Study Time Period: {request.study_time_period}
Goals: {request.goals}
Areas to Focus On: {request.weakAreas}

IMPORTANT: Prioritize the "Areas to Focus On" - these should be given HIGH PRIORITY and should appear early in the study plan with more time allocation and higher priority tasks.

The JSON should be structured as:
{{
  \"subject\": \"...\",
  \"totalWeeks\": {request.duration},
  \"estimatedHoursPerWeek\": \"...\",
  \"weeks\": [
    {{
      \"week\": 1,
      \"weekTitle\": \"Foundation Week\",
      \"days\": [
        {{
          \"day\": 1,
          \"topic\": \"Introduction to Basics\",
          \"priority\": \"high\",
          \"estimatedHours\": 2,
          \"tasks\": [
            {{\"task\": \"Read chapter 1\", \"priority\": \"high\", \"estimatedMinutes\": 45}},
            {{\"task\": \"Watch introductory video\", \"priority\": \"medium\", \"estimatedMinutes\": 30}},
            {{\"task\": \"Take notes\", \"priority\": \"high\", \"estimatedMinutes\": 45}}
          ]
        }},
        {{
          \"day\": 2,
          \"topic\": \"Practice Problems\",
          \"priority\": \"medium\",
          \"estimatedHours\": 2.5,
          \"tasks\": [...]
        }}
      ]
    }},
    {{
      \"week\": 2,
      \"weekTitle\": \"Advanced Week\",
      \"days\": [...]
    }}
  ]
}}

Requirements:
- Create {request.duration} weeks of study plan
- Each week should have 5-6 study days
- Include realistic time estimates (30-180 minutes per task, 2-4 hours per day)
- Use priority levels: high, medium, low
- Tasks should be specific and actionable
- Total weekly hours should match student's available study time
- Progress from basic to advanced topics
- CRITICAL: If "Areas to Focus On" are specified, prioritize these topics:
  * Place them in earlier weeks (Week 1-2)
  * Give them HIGH priority badges
  * Allocate more time to these areas
  * Create more detailed tasks for these topics
- Only return valid JSON, no extra text.
"""
    ai_response = run_ollama(prompt)
    # Extract the first JSON block from the response
    try:
        json_match = re.search(r'\{[\s\S]*\}', ai_response)
        if not json_match:
            raise ValueError("No JSON found in AI response.")
        plan_json = json.loads(json_match.group(0))
        if not plan_json.get("subject") or not isinstance(plan_json.get("weeks"), list):
            raise ValueError("Invalid AI response structure.")
        return StudyPlanResponse(success=True, studyPlan=plan_json, message="Study plan generated.")
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Error parsing AI study plan: {str(e)} | AI response: {ai_response}")
        raise HTTPException(status_code=500, detail="Failed to parse AI study plan. Please try again.")
