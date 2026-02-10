from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from ollama_utils import run_ollama, check_ollama_availability
import logging
import re
import json

router = APIRouter()

class LessonPlanRequest(BaseModel):
    subject: str = ""
    topic: str = ""
    grade: str = "General"
    duration: str = "45 minutes"
    lesson_type: str = "Theory"
    objectives: str = ""
    resources: str = ""

class LessonPlanResponse(BaseModel):
    success: bool
    lesson_plan: Dict[str, Any]
    message: str = ""

@router.post("/tools/lesson-plan", response_model=LessonPlanResponse)
async def generate_lesson_plan(request: LessonPlanRequest):
    try:
        if not check_ollama_availability():
            raise HTTPException(status_code=503, detail="Ollama service is not available. Please ensure Ollama is running and the gemma3:1b model is installed.")

        if not request.subject or not request.topic:
            return LessonPlanResponse(success=False, lesson_plan={}, message="Please provide subject and topic information")

        logging.info(f"Generating lesson plan for subject: {request.subject}, topic: {request.topic}")

        # Create comprehensive prompt for lesson plan generation
        prompt = f"""
You are an expert educational AI assistant. Generate a detailed lesson plan in VALID JSON format only.

CRITICAL INSTRUCTIONS:
- Respond with VALID JSON only, no additional text, explanations, or markdown
- Use double quotes for all strings
- Do not include any text before or after the JSON
- Ensure all arrays contain at least 3 items
- Make all content specific and educational

Input Parameters:
- Subject: {request.subject}
- Topic: {request.topic}
- Grade Level: {request.grade}
- Duration: {request.duration}
- Lesson Type: {request.lesson_type}
- Learning Objectives: {request.objectives or "Create appropriate objectives"}
- Available Resources: {request.resources or "Suggest standard classroom resources"}

Required JSON Structure (copy exactly):
{{
  "lesson_title": "Your lesson title here",
  "learning_objectives": [
    "Objective 1: measurable and specific",
    "Objective 2: measurable and specific",
    "Objective 3: measurable and specific"
  ],
  "key_concepts": [
    "Concept 1 with brief description",
    "Concept 2 with brief description",
    "Concept 3 with brief description"
  ],
  "teaching_activities": [
    "Teacher activity 1 (with time estimate)",
    "Teacher activity 2 (with time estimate)",
    "Teacher activity 3 (with time estimate)"
  ],
  "student_activities": [
    "Student activity 1 (with time estimate)",
    "Student activity 2 (with time estimate)",
    "Student activity 3 (with time estimate)"
  ],
  "assessment_ideas": [
    "Assessment method 1 - how to check understanding",
    "Assessment method 2 - how to check understanding",
    "Assessment method 3 - how to check understanding"
  ],
  "required_resources": [
    "Resource 1 - why needed",
    "Resource 2 - why needed",
    "Resource 3 - why needed"
  ],
  "homework": "Specific homework assignment with clear instructions and due date",
  "differentiation": "How to adapt for different learning styles and abilities",
  "extension_activities": "Additional challenging activities for advanced students"
}}

IMPORTANT:
- Replace all placeholder text with actual educational content
- Ensure timing adds up to approximately {request.duration}
- Make activities age-appropriate for {request.grade} students
- Focus on active learning and student engagement
- Include both formative and summative assessment ideas

Generate the lesson plan now in valid JSON format:
"""

        logging.info("Sending lesson plan prompt to AI model...")
        ai_response = run_ollama(prompt)
        if ai_response is None:
            raise HTTPException(status_code=503, detail="Failed to get response from Ollama AI model")

        logging.info(f"AI Response received (length: {len(ai_response)} chars)")
        logging.info(f"AI Response preview: {ai_response[:200]}...")

        # Parse the JSON response
        lesson_plan = {}
        try:
            # Multiple attempts to extract JSON from response
            json_candidates = [
                re.search(r'```json\s*(\{[\s\S]*?\})\s*```', ai_response, re.DOTALL),  # Markdown code blocks with json
                re.search(r'```\s*(\{[\s\S]*?\})\s*```', ai_response, re.DOTALL),       # Generic code blocks
                re.search(r'```[\s\S]*?(\{[\s\S]*?\})[\s\S]*?```', ai_response, re.DOTALL), # Any code block with JSON
                re.search(r'^[\s]*\{[\s\S]*\}[\s]*$', ai_response, re.MULTILINE),       # Direct JSON with optional whitespace
                re.search(r'\{[\s\S]*\}', ai_response, re.DOTALL),                     # Any JSON object
            ]

            parsed_data = None
            for i, match in enumerate(json_candidates):
                if match:
                    try:
                        # Extract the JSON content from the match
                        json_str = match.group(1) if match.lastindex and match.lastindex >= 1 else match.group(0)

                        logging.info(f"Pattern {i+1} matched: {match.group(0)[:100]}...")
                        logging.info(f"Extracted JSON: {json_str[:200]}...")

                        # Clean the JSON string
                        json_str = json_str.strip()
                        if json_str.startswith('{') and json_str.endswith('}'):
                            parsed_data = json.loads(json_str)
                            logging.info(f"Successfully parsed JSON using pattern {i+1}")
                            break
                        else:
                            logging.warning(f"Pattern {i+1} matched but JSON is malformed: {json_str[:100]}...")
                    except (json.JSONDecodeError, AttributeError) as e:
                        logging.warning(f"Failed to parse JSON with pattern {i+1}: {str(e)}")
                        if 'match.group' in str(e):
                            logging.warning("Regex group extraction failed - trying alternative method")
                            # Try to extract JSON manually
                            start = ai_response.find('{')
                            end = ai_response.rfind('}') + 1
                            if start != -1 and end > start:
                                json_str = ai_response[start:end]
                                try:
                                    parsed_data = json.loads(json_str)
                                    logging.info(f"Successfully parsed JSON using manual extraction")
                                    break
                                except json.JSONDecodeError:
                                    continue
                        continue

            if not parsed_data:
                # Last resort: try to parse the entire response
                try:
                    # Clean the response by removing common prefixes/suffixes
                    cleaned_response = ai_response.strip()
                    if cleaned_response.startswith('```json'):
                        # Extract content between ```json and ```
                        start = cleaned_response.find('{')
                        end = cleaned_response.rfind('}') + 1
                        if start != -1 and end > start:
                            cleaned_response = cleaned_response[start:end]
                        else:
                            # Fallback: remove the ```json wrapper
                            cleaned_response = cleaned_response.replace('```json', '').replace('```', '').strip()
                    elif cleaned_response.startswith('```'):
                        # Generic code block
                        parts = cleaned_response.split('```')
                        if len(parts) >= 3:
                            cleaned_response = parts[1].strip()
                        else:
                            cleaned_response = cleaned_response.replace('```', '').strip()

                    logging.info(f"Cleaned response for parsing: {cleaned_response[:200]}...")
                    parsed_data = json.loads(cleaned_response)
                    logging.info("Parsed cleaned response as JSON")
                except json.JSONDecodeError:
                    logging.error("Failed to parse any JSON from AI response")
                    logging.error(f"Raw AI response: {ai_response}")

                    # Create a fallback lesson plan manually
                    logging.info("Creating fallback lesson plan from input parameters")
                    lesson_plan = {
                        "lesson_title": f"{request.subject} - {request.topic}",
                        "learning_objectives": [
                            f"Understand the basic concepts of {request.topic}",
                            f"Apply {request.topic} knowledge in practical scenarios",
                            f"Explain the importance of {request.topic} in {request.subject}",
                            f"Develop critical thinking skills related to {request.topic}"
                        ],
                        "key_concepts": [
                            f"Core principles of {request.topic}",
                            f"Key components and elements of {request.topic}",
                            f"Practical applications of {request.topic}",
                            f"Real-world examples of {request.topic}"
                        ],
                        "teaching_activities": [
                            f"Introduction to {request.topic} concepts (10 minutes)",
                            f"Direct instruction with visual aids (15 minutes)",
                            f"Guided practice and examples (10 minutes)",
                            f"Review and summary (10 minutes)"
                        ],
                        "student_activities": [
                            f"Individual note-taking during introduction (10 minutes)",
                            f"Group discussions on {request.topic} applications (15 minutes)",
                            f"Hands-on practice exercises (10 minutes)",
                            f"Reflection and question sharing (10 minutes)"
                        ],
                        "assessment_ideas": [
                            "Exit ticket: What is one key concept you learned today?",
                            "Thumbs up/down during explanations to check understanding",
                            "Quick quiz on main concepts",
                            "Peer teaching demonstrations"
                        ],
                        "required_resources": [
                            "Whiteboard and markers for illustrations",
                            "Projector for multimedia presentations",
                            "Handouts with key concepts and examples",
                            "Timer for activity transitions"
                        ],
                        "homework": f"Review {request.topic} notes and prepare 2-3 questions about concepts that need clarification. Due next class.",
                        "differentiation": f"Provide visual aids for visual learners, additional examples for students who need support, and advanced reading materials for students who finish early",
                        "extension_activities": f"Research advanced applications of {request.topic} and prepare a short presentation for the next class"
                    }

                    logging.info("Fallback lesson plan created successfully")

                    return LessonPlanResponse(
                        success=True,
                        lesson_plan=lesson_plan,
                        message=f"Generated lesson plan using fallback method for {request.subject} - {request.topic}"
                    )

            # Clean up and structure the lesson plan
            lesson_plan = {
                "lesson_title": parsed_data.get("lesson_title", f"{request.subject}: {request.topic}"),
                "learning_objectives": parsed_data.get("learning_objectives", [f"Understand key concepts in {request.topic}"]),
                "key_concepts": parsed_data.get("key_concepts", [request.topic]),
                "teaching_activities": parsed_data.get("teaching_activities", ["Introduction and direct instruction"]),
                "student_activities": parsed_data.get("student_activities", ["Active participation and practice"]),
                "assessment_ideas": parsed_data.get("assessment_ideas", ["Observation and questioning"]),
                "required_resources": parsed_data.get("required_resources", ["Standard classroom materials"]),
                "homework": parsed_data.get("homework", f"Review {request.topic} concepts and prepare questions"),
                "differentiation": parsed_data.get("differentiation", "Provide additional support for students who need it"),
                "extension_activities": parsed_data.get("extension_activities", "Advanced reading or research projects")
            }

            # Handle complex data structures (objects with nested properties)
            def normalize_to_simple_list(data, default_prefix=""):
                """Convert complex objects to simple strings"""
                if isinstance(data, list):
                    result = []
                    for item in data:
                        if isinstance(item, dict):
                            # Handle objects like {"time": 10, "activity": "description"}
                            if "activity" in item:
                                time_str = f" ({item.get('time', '')} minutes)" if item.get('time') else ""
                                result.append(f"{item['activity']}{time_str}")
                            elif "description" in item:
                                result.append(item["description"])
                            elif "type" in item and "description" in item:
                                result.append(f"{item['type']}: {item['description']}")
                            else:
                                # Convert dict to string representation
                                result.append(str(item))
                        elif isinstance(item, str):
                            result.append(item)
                        else:
                            result.append(str(item))
                    return result
                elif isinstance(data, str):
                    return [data]
                else:
                    return [str(data)]

            # Normalize complex structures to simple lists/strings
            lesson_plan["teaching_activities"] = normalize_to_simple_list(lesson_plan["teaching_activities"], "Teacher activity")
            lesson_plan["student_activities"] = normalize_to_simple_list(lesson_plan["student_activities"], "Student activity")
            lesson_plan["assessment_ideas"] = normalize_to_simple_list(lesson_plan["assessment_ideas"], "Assessment")
            lesson_plan["required_resources"] = normalize_to_simple_list(lesson_plan["required_resources"], "Resource")
            lesson_plan["learning_objectives"] = normalize_to_simple_list(lesson_plan["learning_objectives"], "Objective")
            lesson_plan["key_concepts"] = normalize_to_simple_list(lesson_plan["key_concepts"], "Concept")
            lesson_plan["extension_activities"] = normalize_to_simple_list(lesson_plan["extension_activities"], "Extension activity")

            # Ensure all fields are properly formatted
            for field in ["learning_objectives", "key_concepts", "teaching_activities", "student_activities", "assessment_ideas", "required_resources", "extension_activities"]:
                if not lesson_plan[field] or lesson_plan[field] == [""]:
                    lesson_plan[field] = [f"Basic {field.replace('_', ' ')} for {request.topic}"]

            logging.info(f"Successfully generated lesson plan with {len(lesson_plan)} sections")

        except Exception as e:
            logging.error(f"Error parsing lesson plan response: {str(e)}")
            logging.error(f"Raw AI response: {ai_response}")
            return LessonPlanResponse(success=False, lesson_plan={}, message="Failed to parse AI response. Please try again.")

        return LessonPlanResponse(
            success=True,
            lesson_plan=lesson_plan,
            message=f"Generated comprehensive lesson plan for {request.subject} - {request.topic}"
        )

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error generating lesson plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate lesson plan: {str(e)}")