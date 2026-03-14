import os
import logging
import tempfile
from typing import List, Dict, Any

# CRITICAL: Set threading environment variables BEFORE importing ML libraries
# This prevents segmentation faults on macOS ARM with PyTorch/sentence-transformers
os.environ['OMP_NUM_THREADS'] = '1'
os.environ['MKL_NUM_THREADS'] = '1'
os.environ['OPENBLAS_NUM_THREADS'] = '1'

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Import our custom modules
from ollama_utils import run_ollama, check_ollama_availability
from file_utils import process_uploaded_file, chunk_text
from embedding_manager import EmbeddingManager

# Import routers
from routes.auth import router as auth_router

# Student routers
from routes.student.learning_path import router as student_learning_path_router
from routes.student.ai_tutor import router as student_ai_tutor_router
from routes.student.assignment_assistant import router as student_assignment_router
from routes.student.revision import router as student_revision_router
from routes.student.study_groups import router as student_study_groups_router
from routes.student.feedback import router as student_feedback_router
from routes.student.jobs import router as student_jobs_router
from routes.student.applications import router as student_applications_router

# Faculty routers
from routes.faculty.faculty_apis import router as faculty_router
from routes.faculty.faculty_feedback import router as faculty_feedback_router

# Verifier routers
from routes.verifier.verifier_apis import router as verifier_router

# Admin & Management routers
from routes.admin.admin_management_apis import router as admin_management_router
from routes.admin.automation_apis import router as automation_router

# WebSocket routes
from routes.websocket_routes import router as websocket_router

# Existing routers
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

# Import all models to ensure they're registered with Base.metadata
# This must happen before Base.metadata.create_all()
# Import order matters - import all models before creating tables
from models.user import User  # noqa: F401
from models.assignment import Assignment, Submission  # noqa: F401
from models.chat import ChatSession, ChatMessage  # noqa: F401
from models.document import Document  # noqa: F401
from models.student import StudentProfile  # noqa: F401
from models.faculty import FacultyProfile  # noqa: F401
from models.application import ScholarshipApplication, AdmissionApplication  # noqa: F401
from models.class_feedback import ClassSession, DailyFeedback, FeedbackResponse  # noqa: F401

# Initialize database tables on startup
@app.on_event("startup")
async def startup_event():
    """Create database tables on startup if they don't exist"""
    from database.connection import Base, engine
    try:
        # All models are already imported above, so they're registered
        Base.metadata.create_all(bind=engine)
        logger.info("✓ Database tables initialized successfully")
    except Exception as e:
        logger.error(f"✗ Error initializing database: {e}")

# Add CORS middleware - MUST be added before routers
# Note: When allow_credentials=True, cannot use allow_origins=["*"]
# Must specify exact origins
# Get allowed origins from environment or use defaults
allowed_origins = [
    "http://localhost:5173",  # Vite dev server (default)
    "http://localhost:3000",  # Alternative React dev server
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost:5174",  # Alternative Vite port
    "http://localhost:4173",  # Vite preview
]

# Add environment variable origins if set
if os.getenv("CORS_ORIGINS"):
    allowed_origins.extend(os.getenv("CORS_ORIGINS").split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
    max_age=3600,
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
app.include_router(auth_router)  # Authentication routes

# Student routes
app.include_router(student_learning_path_router)
app.include_router(student_ai_tutor_router)
app.include_router(student_assignment_router)
app.include_router(student_revision_router)
app.include_router(student_study_groups_router)
app.include_router(student_feedback_router)
app.include_router(student_applications_router)
app.include_router(student_jobs_router, prefix="/api/student/jobs", tags=["Student Jobs"])

# Faculty routes
app.include_router(faculty_router)
app.include_router(faculty_feedback_router)

# Verifier routes
app.include_router(verifier_router)

# Admin & Management routes
app.include_router(admin_management_router)
app.include_router(automation_router)

# WebSocket routes
app.include_router(websocket_router)

# Existing routes
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

# CORS test endpoint
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    """Handle OPTIONS requests for CORS preflight"""
    return {"message": "OK"}

# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
