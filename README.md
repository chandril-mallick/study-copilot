# Dabba: Context-Aware AI Study Companion

**Dabba** is an intelligent, offline-capable study assistant designed to democratize high-quality education through local AI. By leveraging **Retrieval-Augmented Generation (RAG)** on the edge, Dabba provides personalized tutoring, automated study planning, and context-aware Q&A without sending sensitive data to the cloud.

> **Target Architecture:** Local-First, Privacy-Preserving, Low-Latency.

## Key Technical Features

- **Local RAG Pipeline:** Implements a custom document ingestion system using `sentence-transformers` and **FAISS** for sub-100ms vector retrieval on consumer hardware.
- **Offline Inference:** Runs quantized LLMs (like Gemma 2B, Llama 3) locally via **Ollama**, ensuring zero-latency, zero-cost operation.
- **Semantic Knowledge Retrieval:** Combines vector similarity search with structured metadata to answer questions from specific textbooks or research papers.
- **Automated Curriculum Generation:** Uses structured prompting to generate adaptive study plans, quizzes, and flashcards tailored to user learning styles.

## Core Capabilities

- **AI Assistant Chat**: Natural language tutoring with context retention.
- **Smart Study Planner**: Dynamic schedule generation based on difficulty and goals.
- **Quiz Generator**: Algorithmic assessment creation with instant feedback.
- **Note Summarizer**: Abstractive summarization of long-form academic content.
- **Context-Based Q&A**: "Chat with PDF" functionality using local vector embeddings.
- **Flashcard Generator**: Spaced-repetition card creation from unstructured text.

## Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: TailwindCSS
- **State Management**: Zustand, React Context
- **Math Rendering**: KaTeX, MathLive
- **Visuals**: Three.js, React Force Graph
- **Language**: TypeScript/JavaScript

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite
- **Vector Search**: FAISS (Facebook AI Similarity Search)
- **AI Integration**: Ollama (LangChain, Sentence Transformers)
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Pytest

### AI & Data
- **LLM Engine**: Ollama (supports models like gemma3:1b, llama2, codellama)
- **Embeddings**: Sentence-Transformers (all-MiniLM-L6-v2)
- **Storage**: Local file system, SQLite, FAISS Index

## Prerequisites

Before running the application, ensure you have the following installed:

- **Python 3.8+**: Required for the backend services.
- **Node.js 18+**: Required for the frontend application.
- **Ollama**: Required for running the local LLMs.
- **Git**: For cloning the repository.

## Installation

### 1. Clone the Repository

Clone the project to your local machine:

```bash
git clone <repository-url>
cd dabba_ai
```

### 2. Setup Backend

Navigate to the backend directory and set up the Python environment:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory with the following configuration (see `.env.example`):

```env
OLLAMA_URL=http://localhost:11434
MONGODB_URL=mongodb://localhost:27017/dabba_ai
FAISS_INDEX_PATH=../data/index.faiss
EMBEDDINGS_MODEL=all-MiniLM-L6-v2
```

### 3. Setup Frontend

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### 4. Setup Q&A Forum Service (Optional)

If you plan to use the Q&A forum features:

```bash
cd ../qna_forum_service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Usage

### 1. Start Ollama

Ensure Ollama is running and the required model is pulled:

```bash
ollama serve
# In a new terminal
ollama pull gemma3:1b
```

### 2. Start Backend Server

From the `backend` directory:

```bash
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`.

### 3. Start Frontend Application

From the `frontend` directory:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

- **root/**: Core content and documentation.
- **backend/**: Main FastAPI application for AI tools and logic.
- **frontend/**: React-based user interface.
- **qna_forum_service/**: Microservice for forum functionality.
- **data/**: Storage for vector indices and uploaded files.

## Documentation

For more detailed information, please refer to the following guides located in the root directory:

- **API_DOCUMENTATION.md**: Complete API reference.
- **ARCHITECTURE.md**: System design and architecture details.
- **DEPLOYMENT.md**: Instructions for deploying to production.
- **DEVELOPMENT.md**: Guidelines for contributing and development.
- **USER_GUIDE.md**: User manual for application features.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add some NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
