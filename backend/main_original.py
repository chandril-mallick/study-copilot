from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
import logging
import tempfile
from typing import List, Dict, Any

# Import our custom modules
from ollama_utils import run_ollama, check_ollama_availability
from file_utils import process_uploaded_file, chunk_text
from embedding_manager import EmbeddingManager

# Import routers
from routes.ask import router as ask_router
from routes.flashcards import router as flashcards_router
from routes.study_plan import router as study_plan_router
from routes.quiz import router as quiz_router
from routes.summarize import router as summarize_router
from routes.chat import router as chat_router
from routes.ollama_management import router as ollama_management_router
from routes.upload_material import router as upload_material_router
from routes.context_generate import router as context_generate_router
from routes.lesson_plan import router as lesson_plan_router
from routes.progress_tracker import router as progress_tracker_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Dabba AI", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize embedding manager
embedding_manager = EmbeddingManager()

# Pydantic models
class QuestionRequest(BaseModel):
    question: str
    language: str = "en"  # Default to English
    use_context: bool = True  # New field for context mode

class QuestionResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]]

class UploadResponse(BaseModel):
    message: str
    chunks_processed: int
    file_type: str

class StudyPlanRequest(BaseModel):
    subject: str
    duration: int
    difficulty: str = "intermediate"
    goals: str = ""
    learning_style: str = "visual"
    study_time: str = "2 hours per day"
    study_time_period: str = "morning"

class StudyPlanResponse(BaseModel):
    success: bool
    studyPlan: str
    message: str = ""

class QuizRequest(BaseModel):
    topic: str
    subject: str
    difficulty: str = "intermediate"
    numQuestions: int = 5

class QuizResponse(BaseModel):
    success: bool
    quiz: Dict[str, Any]
    message: str = ""

class SummarizeRequest(BaseModel):
    content: str
    maxLength: int = 200

class SummarizeResponse(BaseModel):
    success: bool
    summary: str
    message: str = ""

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

class ChatRequest(BaseModel):
    prompt: str
    model: str = "gemma3:1b"

class ChatResponse(BaseModel):
    success: bool
    response: str
    message: str = ""

class ModelListResponse(BaseModel):
    success: bool
    models: List[Dict[str, str]]
    message: str = ""

class ModelTestRequest(BaseModel):
    model: str = "gemma3:1b"

class ModelTestResponse(BaseModel):
    success: bool
    model: str
    response: str = ""
    error: str = ""
    message: str = ""

class ModelPullRequest(BaseModel):
    model: str

class ModelPullResponse(BaseModel):
    success: bool
    model: str
    message: str = ""

class FlashCardRequest(BaseModel):
    content: str = ""
    file_type: str = "text"
    subject: str = ""
    topic: str = ""
    difficulty: str = "intermediate"
    numCards: int = 10
    cardType: str = "mcq"  # mcq, true_false, short_answer
    priorityAreas: List[str] = []

class FlashCardResponse(BaseModel):
    success: bool
    cards: List[Dict[str, Any]]
    message: str = ""

# Include routers
app.include_router(ask_router)
app.include_router(flashcards_router)
app.include_router(study_plan_router)
app.include_router(quiz_router)
app.include_router(summarize_router)
app.include_router(chat_router)
app.include_router(ollama_management_router)
app.include_router(upload_material_router)
app.include_router(context_generate_router)
app.include_router(lesson_plan_router)
app.include_router(progress_tracker_router)

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <html>
        <head>
            <title>Dabba AI</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .container { max-width: 800px; margin: 0 auto; }
                h1 { color: #333; }
                .status { background: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🧠 Dabba AI</h1>
                <div class="status">
                    <h2>Status: Online</h2>
                    <p>Your AI-powered study assistant is ready to help!</p>
                    <p><strong>Endpoints:</strong></p>
                    <ul>
                        <li>POST /upload_material - Upload study materials (PDF/TXT)</li>
                        <li>POST /ask - Ask questions about your materials</li>
                        <li>GET /health - Health check</li>
                    </ul>
                </div>
            </div>
        </body>
    </html>
    """

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Dabba AI Backend"}
