# Dabba AI - API Documentation

## Overview

This document provides comprehensive documentation for all API endpoints in the Dabba AI application. The API consists of two main backend services:

- **FastAPI Backend** (Primary) - Port 8000
- **Express.js Backend** (Secondary) - Port 5000

## Base URLs

- **FastAPI**: `http://localhost:8000`
- **Express.js**: `http://localhost:5000`

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

---

## FastAPI Backend Endpoints

### Core Endpoints

#### Health Check

**GET** `/health`

Returns the health status of the FastAPI backend service.

**Response:**

```json
{
  "status": "healthy",
  "service": "Dabba AI Backend"
}
```

#### Root/Home Page

**GET** `/`

Returns an HTML page with service information and available endpoints.

**Response:** HTML content with service status and endpoint list.

### File Management

#### Upload Study Materials

**POST** `/upload_material`

Upload PDF or TXT files to be processed and added to the knowledge base for context-based Q&A.

**Headers:**

```
Content-Type: multipart/form-data
```

**Body:**

- `file`: PDF or TXT file to upload

**Response:**

```json
{
  "message": "Successfully processed example.pdf and added 15 chunks to the knowledge base",
  "chunks_processed": 15,
  "file_type": "pdf"
}
```

**Error Responses:**

- `400`: Only PDF and TXT files are supported
- `400`: No text content found in the uploaded file
- `500`: Failed to process file

### Question & Answer

#### Ask Questions

**POST** `/ask`

Ask questions about uploaded study materials with context-based responses.

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Body:**

```json
{
  "question": "What is the main topic discussed in the document?",
  "language": "en"
}
```

**Response:**

```json
{
  "answer": "Based on the context provided, the main topic discussed is artificial intelligence and machine learning applications in education...",
  "sources": [
    {
      "text": "Artificial intelligence has revolutionized the way we approach education...",
      "score": 0.8923,
      "metadata": {
        "source_file": "ai_education.pdf",
        "chunk_index": 2
      }
    }
  ]
}
```

**Supported Languages:**

- `en` - English
- `hi` - Hindi
- `bn` - Bengali

**Error Responses:**

- `400`: Question cannot be empty
- `503`: Ollama service is not available

### AI Tools

#### Generate Study Plan

**POST** `/tools/study-plan`

Generate personalized study plans using AI.

**Body:**

```json
{
  "subject": "Computer Science",
  "duration": 8,
  "difficulty": "intermediate",
  "goals": "Focus on algorithms and data structures"
}
```

**Response:**

```json
{
  "success": true,
  "studyPlan": "## Week 1: Introduction to Algorithms\n\n### Daily Schedule:\n- **Monday**: Basic algorithm concepts...\n- **Tuesday**: Time complexity analysis...\n\n### Resources:\n- Cormen Algorithms book\n- Online tutorials on Khan Academy\n\n### Assessment:\n- Weekly quiz on basic concepts\n- Practice problem solving",
  "message": ""
}
```

**Error Responses:**

- `503`: Ollama service is not available

#### Generate Quiz

**POST** `/tools/quiz`

Generate AI-powered quiz questions.

**Body:**

```json
{
  "topic": "Photosynthesis",
  "subject": "Biology",
  "difficulty": "intermediate",
  "numQuestions": 5
}
```

**Response:**

```json
{
  "success": true,
  "quiz": {
    "questions": [
      {
        "question": "What is the primary function of Photosynthesis in Biology?",
        "options": [
          "A) Data storage and retrieval",
          "B) Network communication",
          "C) System optimization",
          "D) User interface design"
        ],
        "correctAnswer": "B",
        "explanation": "In Biology, Photosynthesis primarily handles energy conversion and glucose production in plants."
      }
    ]
  },
  "message": ""
}
```

#### Summarize Notes

**POST** `/tools/summarize`

Summarize text content using AI.

**Body:**

```json
{
  "content": "Long text content to be summarized...",
  "maxLength": 200
}
```

**Response:**

```json
{
  "success": true,
  "summary": "This is a concise summary of the provided text, capturing the key points and main ideas in approximately 200 words...",
  "message": ""
}
```

#### AI Chat

**POST** `/tools/chat`

Chat with an AI assistant for educational purposes.

**Body:**

```json
{
  "prompt": "Explain quantum physics in simple terms",
  "model": "gemma3:1b"
}
```

**Response:**

```json
{
  "success": true,
  "response": "Quantum physics is the branch of physics that deals with the behavior of matter and energy at the smallest scales...",
  "message": ""
}
```

#### Generate Flashcards

**POST** `/tools/flashcards`

Generate flashcards from content or subject matter.

**Body:**

```json
{
  "content": "Text content to generate flashcards from",
  "subject": "Mathematics",
  "topic": "Calculus",
  "difficulty": "intermediate",
  "numCards": 10,
  "cardType": "mcq",
  "priorityAreas": ["high", "medium"]
}
```

**Response:**

```json
{
  "success": true,
  "cards": [
    {
      "question": "What is the derivative of x²?",
      "options": ["A) x", "B) 2x", "C) x²", "D) 1"],
      "correct_answer": "B",
      "explanation": "The power rule states that d/dx(xⁿ) = n*xⁿ⁻¹",
      "difficulty": "easy",
      "priority": "high"
    }
  ],
  "message": "Generated 10 flashcards using Ollama AI"
}
```

### Ollama Integration

#### Test Ollama Connection

**GET** `/tools/test`

Test if Ollama service is available and responding.

**Response:**

```json
{
  "success": true,
  "message": "Ollama is available and responding",
  "test_response": "Ollama is working correctly"
}
```

#### Get Available Models

**GET** `/ollama/models`

Get list of available Ollama models.

**Response:**

```json
{
  "success": true,
  "models": [
    {
      "name": "gemma3:1b",
      "size": "1.2GB",
      "modified": "2024-01-15T10:30:00Z",
      "status": "available"
    }
  ],
  "message": "Found 1 models"
}
```

#### Test Specific Model

**POST** `/ollama/test`

Test a specific Ollama model.

**Body:**

```json
{
  "model": "gemma3:1b"
}
```

**Response:**

```json
{
  "success": true,
  "model": "gemma3:1b",
  "response": "Model test successful",
  "error": "",
  "message": "Model tested successfully"
}
```

#### Pull Model

**POST** `/ollama/pull`

Download a specific Ollama model.

**Body:**

```json
{
  "model": "llama2:7b"
}
```

**Response:**

```json
{
  "success": true,
  "model": "llama2:7b",
  "message": "Model pulled successfully"
}
```

#### Get Ollama Status

**GET** `/ollama/status`

Get comprehensive Ollama service status.

**Response:**

```json
{
  "success": true,
  "available": true,
  "models": ["gemma3:1b", "llama2:7b"],
  "models_count": 2,
  "default_model": "gemma3:1b",
  "default_model_available": true,
  "default_model_test": {
    "success": true,
    "response": "Test successful"
  },
  "message": "Ollama is available with 2 models"
}
```

---

## 🚀 Express.js Backend Endpoints

**Note**: The Express.js backend appears to be a placeholder/incomplete implementation. The routes reference files that don't exist in the current codebase. The main functionality is implemented in the FastAPI backend.

### Planned Routes (Not Implemented)

- `GET /api/ai/test` - Test AI service
- `GET /api/ai/models` - List AI models
- `POST /api/ai/generate` - Generate AI responses
- `POST /api/study-planner/*` - Study planner functionality
- `POST /api/flashcards/*` - Flashcard management
- `POST /api/notes/*` - Note management
- `POST /api/quizzes/*` - Quiz management
- `POST /api/lessons/*` - Lesson planning
- `POST /api/progress/*` - Progress tracking

---

## Data Models

### Request Models

#### QuestionRequest

```typescript
{
  question: string;        // The question to ask
  language?: string;       // Language code (en, hi, bn)
}
```

#### StudyPlanRequest

```typescript
{
  subject: string;         // Subject name
  duration: number;        // Duration in weeks
  difficulty?: string;     // Difficulty level
  goals?: string;         // Additional goals
}
```

#### QuizRequest

```typescript
{
  topic: string;          // Quiz topic
  subject: string;        // Subject area
  difficulty?: string;    // Difficulty level
  numQuestions?: number;  // Number of questions
}
```

#### SummarizeRequest

```typescript
{
  content: string;        // Text to summarize
  maxLength?: number;     // Maximum length in words
}
```

#### ChatRequest

```typescript
{
  prompt: string;         // Chat prompt
  model?: string;         // AI model to use
}
```

#### FlashCardRequest

```typescript
{
  content?: string;       // Content to generate from
  subject?: string;       // Subject area
  topic?: string;         // Specific topic
  difficulty?: string;    // Difficulty level
  numCards?: number;      // Number of cards
  cardType?: string;      // Card type (mcq, true_false, etc.)
  priorityAreas?: string[]; // Priority levels
}
```

### Response Models

#### QuestionResponse

```typescript
{
  answer: string;         // AI-generated answer
  sources: Array<{       // Source documents
    text: string;         // Source text snippet
    score: number;        // Relevance score
    metadata: object;     // Source metadata
  }>;
}
```

#### StudyPlanResponse

```typescript
{
  success: boolean;       // Operation success
  studyPlan: string;      // Generated study plan
  message?: string;       // Status message
}
```

#### QuizResponse

```typescript
{
  success: boolean;       // Operation success
  quiz: {                // Quiz data
    questions: Array<{    // Array of questions
      question: string;   // Question text
      options: string[];  // Answer options
      correctAnswer: string; // Correct answer
      explanation: string;   // Explanation
    }>;
  };
  message?: string;       // Status message
}
```

#### SummarizeResponse

```typescript
{
  success: boolean;       // Operation success
  summary: string;        // Generated summary
  message?: string;       // Status message
}
```

#### ChatResponse

```typescript
{
  success: boolean;       // Operation success
  response: string;       // AI response
  message?: string;       // Status message
}
```

#### FlashCardResponse

```typescript
{
  success: boolean;       // Operation success
  cards: Array<{         // Generated flashcards
    question: string;     // Question text
    options?: string[];   // Answer options
    correct_answer?: string; // Correct answer
    answer?: string;      // Answer text
    explanation: string;  // Explanation
    difficulty: string;   // Difficulty level
    priority: string;     // Priority level
  }>;
  message?: string;       // Status message
}
```

---

## Configuration

### Environment Variables

#### Backend (.env)

```env
OLLAMA_URL=http://localhost:11434
MONGODB_URL=mongodb://localhost:27017/dabba_ai
FAISS_INDEX_PATH=../data/index.faiss
EMBEDDINGS_MODEL=all-MiniLM-L6-v2
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

---

## Error Handling

### Common HTTP Status Codes

| Status Code | Description           | Example Scenarios        |
| ----------- | --------------------- | ------------------------ |
| `200`     | Success               | Normal operation         |
| `400`     | Bad Request           | Invalid input parameters |
| `404`     | Not Found             | Endpoint doesn't exist   |
| `500`     | Internal Server Error | Server-side error        |
| `503`     | Service Unavailable   | Ollama not available     |

### Error Response Format

```json
{
  "detail": "Error description message"
}
```

---

## Usage Examples

### cURL Examples

#### Health Check

```bash
curl http://localhost:8000/health
```

#### Upload File

```bash
curl -X POST http://localhost:8000/upload_material \
  -F "file=@document.pdf"
```

#### Ask Question

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is machine learning?", "language": "en"}'
```

#### Generate Study Plan

```bash
curl -X POST http://localhost:8000/tools/study-plan \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Mathematics",
    "duration": 4,
    "difficulty": "intermediate",
    "goals": "Focus on calculus"
  }'
```

### JavaScript Examples

#### Using Fetch API

```javascript
// Upload file
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:8000/upload_material', {
  method: 'POST',
  body: formData
});

// Ask question
const questionResponse = await fetch('http://localhost:8000/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'Explain quantum computing',
    language: 'en'
  })
});
```

#### Using Axios

```javascript
import axios from 'axios';

// Generate quiz
const quizResponse = await axios.post('http://localhost:8000/tools/quiz', {
  topic: 'Photosynthesis',
  subject: 'Biology',
  difficulty: 'intermediate',
  numQuestions: 5
});

// Summarize text
const summaryResponse = await axios.post('http://localhost:8000/tools/summarize', {
  content: longText,
  maxLength: 200
});
```

---

## Security Considerations

### Current State

- No authentication required
- CORS allows all origins in development
- File upload validation for PDF/TXT only
- Input sanitization and validation implemented

### Production Recommendations

- Implement JWT authentication
- Configure CORS for specific origins only
- Add rate limiting
- Implement input validation and sanitization
- Add request logging and monitoring
- Use HTTPS in production

---

## Troubleshooting

### Common Issues

#### Ollama Connection Issues

```bash
# Check Ollama status
curl http://localhost:11434/api/version

# Test backend connection
curl http://localhost:8000/tools/test
```

#### Model Issues

```bash
# List available models
ollama list

# Pull required model
ollama pull gemma3:1b
```

#### File Upload Issues

- Ensure file is PDF or TXT format
- Check file size (reasonable limits apply)
- Verify file contains readable text content

For more troubleshooting information, see the main README.md file.

---

## Related Documentation

- [Main README](../README.md) - Project overview and setup
- [Architecture Guide](ARCHITECTURE.md) - System architecture details
- [Development Guide](DEVELOPMENT.md) - Development setup and guidelines
- [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions
- [User Guide](USER_GUIDE.md) - End-user documentation
