# Dabba AI

The Context-Aware Local AI Study Companion

## Mission & Vision
**Dabba AI** is the Next-Generation Local AI Educational Platform. Our mission is to democratize high-quality education through an intelligent, personalized, and local AI assistant that serves the entire academic ecosystem.

By leveraging **Retrieval-Augmented Generation (RAG)** on the edge, Dabba provides personalized tutoring, automated study planning, and context-aware Q&A without sending sensitive data to the cloud.

> **Core Focus:** Multi-Role, Privacy-Preserving, Offline-Capable, Low-Latency Education

## Key Value Propositions
* **Zero-Cost Operation:** Runs entirely on consumer hardware (no expensive cloud APIs).
* **Privacy-First (100% Local):** Data never leaves the system. All processing is local.
* **Role-Based Ecosystem:** Tailored experiences for Students, Faculty, Admins, Management, and Verifiers.
* **High Performance:** Sub-100ms vector retrieval ensuring real-time responsiveness.

## Multi-Role Ecosystem & Features

### 🎓 Student Features
* **AI Tutor Chat & Q&A:** Context-aware natural language tutoring powered by local LLMs via WebSockets.
* **Smart Study & Lesson Planner:** Automated dynamic curriculum and schedule generation.
* **Flashcards & Quizzes:** Algorithmic creation with instant feedback.
* **Note Summarizer:** Abstractive summarization designed specifically for long-form academic content.

### 👨‍🏫 Faculty & Verifier Features
* **AI Auto-Grader:** Automated, consistent, and fast grading assistance.
* **Question Bank & Lesson Planning:** Tools to streamline course material creation.

### ⚙️ Admin & Management Features
* **Role Insights:** Dashboards for tracking system usage and performance.
* **Workflow Automation:** Streamlined institutional processes.

## Advanced Capabilities
* **Retrieval-Augmented Generation (RAG):** "Chat with PDF/Context" using advanced vector similarity search to query specific textbooks.
* **Advanced Mathematical Rendering:** Complex calculus and algebra using `SymPy` on the backend and `KaTeX`/`MathLive` on the frontend.
* **Interactive 3D Visualizations:** Stunning, interactive visual graphs and 3D scenes (`@react-three/fiber`, `react-force-graph`).
* **Real-time Job Scraping:** Integrated job market analysis tool using `python-jobspy`.

## Technology Stack

### Frontend (User Interface)
* **Framework:** React 19 (Vite) using TypeScript/JavaScript
* **Styling & Animation:** TailwindCSS, Tailwind-Animate, clsx, tailwind-merge
* **State Management:** Zustand (Lightweight global state) & React Context
* **Rich Text & 3D Tools:** `react-markdown`, `rehype-katex`, `remark-math`, `jspdf`, `@react-three/drei`

### Backend (API & Logic Layer)
* **API Framework:** FastAPI (High-performance, async Python web framework)
* **Server & Real-Time:** Uvicorn, WebSockets
* **Authentication:** JWT (JSON Web Tokens), `python-jose`, `bcrypt`
* **Database & Caching:** SQLite (SQLAlchemy + Alembic), Redis

### The AI Engine
* **Local LLM Engine:** Ollama (Supports gemma3:1b, llama2, codellama, etc.)
* **Vector Search:** FAISS (Facebook AI Similarity Search)
* **Embeddings:** Sentence-Transformers (`all-MiniLM-L6-v2`)
* **AI Orchestration:** LangChain
* **Mathematics Engine:** SymPy

## Installation

### Prerequisites
- **Python 3.8+**
- **Node.js 18+**
- **Ollama** (Required for running local LLMs)
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd dabba_ai
```

### 2. Setup Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the `backend/` directory:
```env
OLLAMA_URL=http://localhost:11434
FAISS_INDEX_PATH=../data/index.faiss
EMBEDDINGS_MODEL=all-MiniLM-L6-v2
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## Usage

### 1. Start Ollama
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

### 3. Start Frontend Application
From the `frontend` directory:
```bash
npm run dev
```

## System Architecture

Dabba AI follows a strict **Local-First Architecture**:
* The **React Client** communicates seamlessly with the **FastAPI Gateway** via REST APIs and WebSockets.
* Requests are processed strictly offline via the **Ollama Engine** and local **FAISS indices**.
* **Document Ingestion Pipeline:** PDF/TXT Upload → Text Chunking (`pypdf`) → Vector Embedding (`Sentence-Transformers`) → Indexed in FAISS → Ready for instant semantic search.

## License
This project is licensed under the MIT License.
