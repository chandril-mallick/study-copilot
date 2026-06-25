# Dabba AI

## The Context-Aware Local AI Study Companion

[![Frontend Audit](https://img.shields.io/badge/frontend-0%20vulnerabilities-brightgreen)](./frontend)
[![Backend Audit](https://img.shields.io/badge/backend-0%20vulnerabilities-brightgreen)](./backend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/)
[![Node 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)

> **Next-Generation Local AI Educational Platform** — Personalized, privacy-preserving, offline-capable tutoring for the entire academic ecosystem.

---

## Mission & Vision

**Dabba AI** democratizes high-quality education through an intelligent, personalized, and **fully local** AI assistant. By leveraging **Retrieval-Augmented Generation (RAG)** on the edge, Dabba provides personalized tutoring, automated study planning, and context-aware Q&A — **without sending sensitive data to the cloud**.

> **Core Focus:** Multi-Role · Privacy-Preserving · Offline-Capable · Low-Latency

---

## Key Value Propositions

- **Zero-Cost Operation** — Runs entirely on consumer hardware; no cloud API bills.
- **Privacy-First (100% Local)** — Data never leaves your machine.
- **Role-Based Ecosystem** — Tailored experiences for Students, Faculty, Admins, Management, and Verifiers.
- **High Performance** — Sub-100ms vector retrieval for real-time responsiveness.
- **Rich 3D Experience** — Interactive 3D tutor avatar and force-graph visualizations.

---

## Table of Contents
- [Features](#features)
  - [Student](#student-features)
  - [Faculty](#faculty-features)
  - [Verifier](#verifier-features)
  - [Admin & Management](#admin--management-features)
- [Advanced Capabilities](#advanced-capabilities)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [System Architecture](#system-architecture)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Student Features

| Feature | Description |
|---------|-------------|
| **AI Tutor Chat & Q&A** | Context-aware natural language tutoring via local LLMs (Ollama) over WebSockets |
| **Smart Study Planner** | Dynamic curriculum and schedule generation based on goals, style, and time |
| **Lesson Planner** | Grade-appropriate lesson plans with objectives, resources, and activities |
| **Flashcards** | MCQ, true/false, and short-answer cards with configurable difficulty |
| **Quizzes** | Topic-based quiz generation with adaptive difficulty |
| **Note Summarizer** | Abstractive summarization for long-form academic content |
| **Smart Assignment Assistant** | AI help with assignment understanding and structure |
| **Personalized Learning Path** | Adaptive path generation from student profile |
| **Revision & Progress Tracking** | Tools to monitor learning progress |
| **Q&A Forum** | Dedicated microservice for student discussion |
| **Study Groups** | Collaborative study group management |
| **Daily Class Feedback** | Daily feedback with response tracking |
| **Scholarship & Admission Applications** | Submit and track applications |
| **Job Market Scraping** | Real-time jobs via `python-jobspy` with mock verification |
| **University Resources** | Library and resource access |
| **3D AI Companion** | Interactive 3D Priya avatar as study companion |

### Faculty Features

- **AI Auto-Grader** — Automated, consistent, and fast grading assistance
- **Question Bank & Material Management** — Centralized course material creation
- **Class Session Management** — Organize sessions and collect daily feedback
- **Faculty Dashboard** — Centralized workspace with analytics

### Verifier Features

- **DeepFake Detection** — AI-powered content authenticity analysis
- **Batch Verification** — Bulk document/content verification
- **Cross-Database Verification** — Verification across multiple sources
- **Document Timeline Heatmap** — Visual timeline analysis of documents
- **Verifier Dashboard** — Centralized verification workspace

### Admin & Management Features

- **User Management** — Role and permission administration
- **Workflow Automation** — Streamlined institutional processes
- **Management Analytics Dashboard** — Institution-wide insights
- **Predictive Insights** — AI-driven performance predictions
- **National Benchmarking** — Compare against national standards
- **AI Policy Generator** — Policy document drafting assistance

---

## Advanced Capabilities

- **Retrieval-Augmented Generation (RAG)** — "Chat with PDF/Context" using FAISS vector search over uploaded textbooks
- **Advanced Mathematical Engine** — Calculus, algebra, ODEs, PDEs via SymPy with KaTeX/MathLive rendering
- **Interactive 3D Visualizations** — 3D scenes, avatars, and force-directed graphs (`@react-three/fiber`, `react-force-graph`)
- **Real-Time Communication** — WebSocket-based chat and notifications
- **PDF Export** — Generate PDFs from notes, reports, and tables
- **Google TTS** — Text-to-speech for accessibility
- **Code Rendering** — Syntax-highlighted code blocks in chat
- **Global Search** — Cross-feature search
- **Theming & UI** — Light/dark mode with Tailwind + Radix UI

---

## Technology Stack

### Frontend (User Interface)
- **Framework:** React 19 + Vite 7 (TypeScript + JavaScript mix)
- **Styling:** TailwindCSS, tailwind-animate, clsx, tailwind-merge
- **State:** Zustand + React Context
- **3D & Visualization:** `@react-three/fiber`, `@react-three/drei`, `react-force-graph-2d/3d`
- **Math:** KaTeX, MathLive, `rehype-katex`, `remark-math`
- **Markdown & Code:** `react-markdown`, `react-syntax-highlighter`
- **Export:** `jspdf` 4.x + `jspdf-autotable`
- **UI Components:** Radix UI, lucide-react, sonner
- **HTTP:** Axios 1.18.x (security-patched)
- **Security:** DOMPurify for sanitized rendering

### Backend (API & Logic Layer)
- **API Framework:** FastAPI (async Python)
- **Server:** Uvicorn with WebSocket support
- **Authentication:** JWT via `python-jose` + `passlib` (bcrypt)
- **ORM:** SQLAlchemy + Alembic (SQLite default, PostgreSQL-ready)
- **Caching:** Redis (optional)
- **Middleware:** CORS, RBAC, custom error handling
- **Validation:** Pydantic v2

### AI Engine
- **Local LLM:** Ollama (gemma3:1b, llama2, codellama, etc.)
- **Vector Search:** FAISS
- **Embeddings:** Sentence-Transformers (`all-MiniLM-L6-v2`)
- **Orchestration:** LangChain
- **Mathematics:** SymPy
- **Document Parsing:** `pypdf`

### Real-Time
- **WebSockets:** FastAPI WebSockets + browser `WebSocket` API
- **Job Scraping:** `python-jobspy`

---

## Project Structure

```
dabba_ai_v4/
├── backend/                    # FastAPI backend
│   ├── main.py                 # Application entry point
│   ├── routes/                 # API route modules
│   │   ├── auth.py
│   │   ├── chat.py
│   │   ├── ask.py
│   │   ├── websocket_routes.py
│   │   ├── quiz.py
│   │   ├── flashcards.py
│   │   ├── summarize.py
│   │   ├── study_plan.py
│   │   ├── lesson_plan.py
│   │   ├── ollama_management.py
│   │   ├── upload_material.py
│   │   ├── context_generate.py
│   │   └── ... (auth, student, faculty, verifier, admin subdirs)
│   ├── models/                 # SQLAlchemy models
│   ├── services/               # Business logic
│   ├── middleware/             # Auth, RBAC, CORS
│   ├── database/               # DB connection & seeding
│   ├── auth/                   # JWT handlers
│   ├── embedding_manager.py    # RAG pipeline
│   ├── ollama_utils.py         # LLM utilities
│   ├── math_utils.py           # SymPy math engine
│   ├── file_utils.py           # File processing
│   ├── websocket_manager.py    # WS connection manager
│   ├── requirements.txt
│   └── .env
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── features/           # Feature modules (Student, Verifier, Management)
│   │   ├── services/           # API clients
│   │   ├── store/              # Zustand stores
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Helpers
│   │   ├── App.tsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env
├── qna_forum_service/          # Q&A forum microservice
├── data/                       # FAISS index + materials cache
├── DEPLOYMENT.md               # Deployment guide
├── README.md                   # ← You are here
└── .venv/                      # Python virtual environment
```

---

## Installation

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Python | 3.8+ | Backend runtime |
| Node.js | 18+ | Frontend & tooling |
| npm | 9+ | Package manager |
| Ollama | latest | Local LLM engine |
| Git | latest | Version control |

### 1. Clone the Repository

```bash
git clone https://github.com/chandril-mallick/study-copilot.git
cd dabba_ai_v4
```

### 2. Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
# Database
DATABASE_URL=sqlite:///./dabba.db

# Authentication
JWT_SECRET=replace-with-a-strong-random-secret-at-least-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=gemma3:1b

# RAG / FAISS
FAISS_INDEX_PATH=../data/index.faiss
EMBEDDINGS_MODEL=all-MiniLM-L6-v2

# CORS (comma-separated origins)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### 4. Pull the LLM Model

```bash
ollama pull gemma3:1b
```

---

## Usage

### Start Ollama (Terminal 1)

```bash
ollama serve
```

### Start Backend (Terminal 2)

```bash
cd backend
source ../.venv/bin/activate
uvicorn main:app --reload --port 8000
```

API available at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

### Start Frontend (Terminal 3)

```bash
cd frontend
npm run dev
```

App available at `http://localhost:5173`

### Default Seeded Users (dev only)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@dabba.ai | admin123 |
| Faculty | faculty@dabba.ai | faculty123 |
| Student | student@dabba.ai | student123 |
| Verifier | verifier@dabba.ai | verifier123 |

> ⚠️ **Change these immediately in production.**

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                    │
│   Components · Zustand Store · WebSocket Client · Axios    │
└────────────────────────┬────────────────────────────────────┘
                         │ REST + WebSocket
┌────────────────────────▼────────────────────────────────────┐
│              FastAPI Gateway (Uvicorn :8000)                │
│   Routes · Middleware (CORS, RBAC, JWT) · Pydantic Models  │
└────────┬───────────────┬────────────────┬───────────────────┘
         │               │                │
   ┌─────▼─────┐  ┌──────▼──────┐  ┌──────▼──────┐
   │ SQLAlchemy│  │   Ollama    │  │   FAISS     │
   │ SQLite /  │  │  Local LLM  │  │ Vector Index│
   │ PostgreSQL│  │  gemma3:1b  │  │ + Embeddings│
   └───────────┘  └─────────────┘  └─────────────┘
```

### Document Ingestion Pipeline

```
PDF/TXT Upload → Text Chunking (pypdf)
        ↓
Vector Embedding (Sentence-Transformers)
        ↓
Indexed in FAISS (../data/index.faiss)
        ↓
Ready for sub-100ms semantic search
```

---

## Security

All npm dependencies are continuously audited and **currently report 0 vulnerabilities**.

| Area | Last Audit | Status |
|------|------------|--------|
| Frontend (`frontend/`) | Latest | 0 vulnerabilities |
| Backend (`backend/`) | Latest | 0 vulnerabilities |

### Security Best Practices

- **JWT secret must be rotated** before production (replace default in `.env`)
- All HTTP responses are sanitized via DOMPurify on the frontend
- Passwords are hashed with bcrypt via `passlib`
- CORS is restricted to explicit origins (no wildcards with credentials)
- Auth bypass vulnerabilities (`jws`, `mongoose`) — patched
- SSRF protections on axios — patched
- Prototype pollution in lodash, minimatch, picomatch — patched

### Run Audits Anytime

```bash
cd frontend  && npm audit
cd ../backend && npm audit
```

---

## Testing

```bash
# Backend tests
cd backend
source ../.venv/bin/activate
pytest

# Frontend build check
cd ../frontend
npm run build
npm run lint
```

Math engine test suites are included in `backend/test_*math*.py`.

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment instructions covering:
- Docker / docker-compose
- Production environment configuration
- Nginx reverse proxy
- SSL/TLS setup
- Ollama production tuning

---

## Troubleshooting

### Ollama not detected
```bash
# Make sure Ollama is running
ollama serve
# Check from another terminal
curl http://localhost:11434/api/tags
```

### FAISS index errors
```bash
# Delete and let it rebuild
rm -rf data/index.faiss data/materials.pkl
# Restart backend — it will rebuild on first upload
```

### Port conflicts
- Backend default: `8000` — change with `--port` flag
- Frontend default: `5173` — configured in `vite.config.js`

### CORS errors
Add your frontend origin to `ALLOWED_ORIGINS` in `backend/.env`.

### Reset database
```bash
cd backend
rm dabba.db
# Tables auto-create on next startup
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Run audits before committing: `npm audit` in both folders
4. Commit: `git commit -m "feat: add amazing feature"`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style
- Python: PEP 8, type hints encouraged
- JavaScript/TypeScript: ESLint config in `frontend/`
- Commit messages: [Conventional Commits](https://www.conventionalcommits.org/)

---

## License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

---

## Acknowledgments

- **Ollama** for local LLM inference
- **FAISS** for blazing-fast vector search
- **Sentence-Transformers** for embeddings
- **FastAPI** for the elegant Python web framework
- **React + Vite** for the modern frontend experience
- **LangChain** for AI orchestration

---

<div align="center">

**Built with ❤️ for accessible, private, AI-powered education**

[Report Bug](https://github.com/chandril-mallick/study-copilot/issues) · [Request Feature](https://github.com/chandril-mallick/study-copilot/issues) · [Documentation](./DEPLOYMENT.md)

</div>
