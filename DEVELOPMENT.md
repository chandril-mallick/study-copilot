# Dabba AI - Development Setup Guide

## Complete Development Environment Setup

This guide provides step-by-step instructions for setting up the complete Dabba AI development environment, including all prerequisites, dependencies, and development tools.

## Prerequisites

### System Requirements

- **Operating System**: macOS (Linux/Windows support planned)
- **Python**: 3.9 or higher
- **Node.js**: 18 or higher
- **Git**: For version control
- **curl**: For downloading dependencies

### Hardware Requirements

- **RAM**: 8GB minimum (16GB recommended for AI models)
- **Storage**: 10GB free space for models and dependencies
- **Network**: Internet connection for initial setup

---

## 1.  Ollama AI Setup

Ollama provides local AI model inference capabilities. This is the core AI engine for Dabba AI.

### Installation

```bash
# Install Ollama using the official installer
curl -fsSL https://ollama.ai/install.sh | sh

# Verify installation
ollama --version
```

### Pull Required Models

```bash
# Pull the default AI model (lightweight and fast)
ollama pull gemma3:1b

# Pull embedding model for vector search
ollama pull nomic-embed-text

# Optional: Pull additional models for experimentation
ollama pull llama2:7b
ollama pull codellama:7b
```

### Start Ollama Service

```bash
# Start Ollama service (keep this running)
ollama serve

# In a new terminal, verify it's running
curl http://localhost:11434/api/version

# List available models
ollama list
```

### Automated Setup (Recommended)

Use the provided setup script for automated Ollama configuration:

```bash
# Make script executable
chmod +x setup_ollama.sh

# Run automated setup
./setup_ollama.sh
```

**The script will:**

- Check Ollama installation
- Start Ollama service if not running
- Pull required models
- Test model functionality
- Verify Python dependencies

---

## 2.  Backend Setup (FastAPI)

The FastAPI backend handles AI processing, file uploads, and vector search operations.

### Navigate to Backend Directory

```bash
cd backend
```

### Create Python Virtual Environment

```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# On Windows
# .venv\Scripts\activate

# Verify activation
which python  # Should show the virtual environment path
```

### Install Python Dependencies

```bash
# Install from requirements.txt
pip install -r requirements.txt

# Verify key packages are installed
python3 -c "import fastapi, uvicorn, sentence_transformers, faiss"
```

### Install Additional Dependencies (if needed)

```bash
# Some systems may need additional packages
pip install torch torchvision torchaudio  # For PyTorch (if not included)
pip install transformers                   # For additional model support
```

### Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
nano .env  # or use your preferred editor
```

**Sample `.env` configuration:**

```env
OLLAMA_URL=http://localhost:11434
MONGODB_URL=mongodb://localhost:27017/dabba_ai
FAISS_INDEX_PATH=../data/index.faiss
EMBEDDINGS_MODEL=all-MiniLM-L6-v2
DEBUG=true
```

### Run Backend Server

```bash
# Option 1: Run with uvicorn (recommended for development)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Option 2: Run directly with Python
python main.py

# Option 3: Using npm script (if configured)
npm run dev
```

**Verify Backend is Running:**

```bash
# Health check
curl http://localhost:8000/health

# Expected response:
# {"status": "healthy", "service": "Dabba AI Backend"}

# Check Ollama status
curl http://localhost:8000/ollama/status

# Test AI model
curl -X POST http://localhost:8000/ollama/test \
  -H "Content-Type: application/json" \
  -d '{"model": "gemma3:1b"}'
```

---

## 3.  Frontend Setup (React)

The React frontend provides the user interface for interacting with AI tools.

### Navigate to Frontend Directory

```bash
cd frontend
```

### Install Node.js Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### Environment Configuration

```bash
# Copy environment template (if exists)
cp .env.example .env  # If template exists

# Edit .env file
nano .env  # or use your preferred editor
```

**Sample `.env` configuration:**

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_APP_TITLE=Dabba AI
```

### Start Development Server

```bash
# Start development server with hot reload
npm run dev

# Alternative: Preview production build
npm run preview
```

**Frontend will be available at:**

- Local: http://localhost:5173
- Network: http://[your-ip]:5173

### Development Tools

```bash
# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 4.  Database Setup (Optional)

MongoDB is used for optional server-side session storage and user management.

### Install MongoDB

```bash
# Using Homebrew (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

### Configure MongoDB Connection

Update your `.env` file in the backend directory:

```env
MONGODB_URL=mongodb://localhost:27017/dabba_ai
```

### Verify Connection

```bash
# Test MongoDB connection
python3 -c "
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
db = client.dabba_ai
db.test.insert_one({'test': 'connection'})
print('MongoDB connection successful!')
"
```

---

## 5. Testing Setup

### Backend Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run all tests
pytest

# Run specific test file
pytest tests/test_main.py

# Run with coverage
pytest --cov=. --cov-report=html
```

### Frontend Testing

```bash
# Install test dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### End-to-End Testing

```bash
# Install Playwright for E2E tests
npm install --save-dev @playwright/test
npx playwright install

# Run E2E tests
npx playwright test
```

---

## 6.  Development Workflow

### Complete Development Setup

1. **Terminal 1**: Start Ollama service

   ```bash
   ollama serve
   ```
2. **Terminal 2**: Start Backend

   ```bash
   cd backend
   source .venv/bin/activate
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
3. **Terminal 3**: Start Frontend

   ```bash
   cd frontend
   npm run dev
   ```
4. **Terminal 4**: Run tests (optional)

   ```bash
   # Backend tests
   cd backend && pytest

   # Frontend tests
   cd frontend && npm test
   ```

### Development Commands

#### Backend Development

```bash
# Activate virtual environment
source .venv/bin/activate

# Run with auto-reload
uvicorn main:app --reload

# Run tests
pytest

# Check code style
flake8 . --max-line-length=88

# Format code
black .
```

#### Frontend Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Debugging Setup

#### Backend Debugging

```python
# Enable debug logging in main.py
import logging
logging.basicConfig(level=logging.DEBUG)

# Or set environment variable
export DEBUG=true
```

#### Frontend Debugging

1. **Browser DevTools**: Use React DevTools extension
2. **Network Tab**: Monitor API calls
3. **Console**: Check for JavaScript errors

### Performance Monitoring

```bash
# Backend performance monitoring
pip install py-spy  # For Python profiling

# Frontend performance
# Use browser DevTools Performance tab
```

---

## 7.  Troubleshooting

### Common Issues and Solutions

#### Ollama Issues

**Problem**: "Ollama command not found"

```bash
# Solution: Reinstall Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Verify installation
which ollama
ollama --version
```

**Problem**: "Ollama service not running"

```bash
# Solution: Start Ollama service
ollama serve

# Check if running
pgrep -x "ollama"

# Test API
curl http://localhost:11434/api/version
```

**Problem**: "Model not found"

```bash
# Solution: Pull the model
ollama pull gemma3:1b

# List available models
ollama list
```

#### Backend Issues

**Problem**: "Module not found" errors

```bash
# Solution: Reinstall dependencies
pip install -r requirements.txt

# Check if in virtual environment
which python
```

**Problem**: "Port already in use"

```bash
# Solution: Kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
uvicorn main:app --port 8001
```

**Problem**: "FAISS index not found"

```bash
# Solution: The index will be created automatically on first file upload
# Or check data directory permissions
ls -la ../data/
```

#### Frontend Issues

**Problem**: "Node modules not found"

```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Problem**: "Build errors"

```bash
# Solution: Clear cache and rebuild
rm -rf dist node_modules/.vite
npm install
npm run build
```

#### Database Issues

**Problem**: "MongoDB connection failed"

```bash
# Solution: Check MongoDB status
brew services list

# Start MongoDB if needed
brew services start mongodb-community

# Test connection
mongosh --eval "db.runCommand('ismaster')"
```

### Logs and Debugging

#### Backend Logs

```bash
# View backend logs
tail -f /var/log/system.log | grep -i "dabba\|fastapi\|uvicorn"

# Or run with verbose logging
uvicorn main:app --log-level debug
```

#### Frontend Logs

- Use browser Developer Tools Console
- Check Network tab for API errors
- Monitor Application tab for errors

#### Ollama Logs

```bash
# Check Ollama logs
journalctl -u ollama -f  # Linux
# or check Ollama data directory
```

### Getting Help

1. **Check existing documentation**

   - [README.md](../README.md) - Main project documentation
   - [API Documentation](API_DOCUMENTATION.md) - API reference
   - [Architecture Guide](ARCHITECTURE.md) - System architecture
2. **Search GitHub Issues**

   - Look for similar problems
   - Check existing solutions
3. **Create detailed issue report**

   - Include error messages
   - Provide system information
   - Describe steps to reproduce

---

## 8.  Project Structure for Development

```
dabba-ai-v4/
├── 📂 backend/                 # Python/FastAPI backend
│   ├── main.py                # Main FastAPI application
│   ├── ollama_utils.py        # Ollama AI integration
│   ├── embedding_manager.py   # Vector search management
│   ├── file_utils.py          # File processing utilities
│   ├── requirements.txt       # Python dependencies
│   ├── .venv/                 # Python virtual environment
│   └── tests/                 # Backend tests (create if needed)
├── 📂 frontend/               # React frontend
│   ├── src/                   # Source code
│   │   ├── App.jsx           # Main React component
│   │   ├── components/       # UI components
│   │   └── assets/           # Static assets
│   ├── public/               # Public assets
│   ├── node_modules/         # JavaScript dependencies
│   ├── dist/                 # Build output (generated)
│   └── tests/                # Frontend tests (create if needed)
├── 📂 data/                   # Vector search data
│   ├── index.faiss           # FAISS vector index
│   ├── materials.pkl         # Document metadata
│   └── embeddings.db         # Embeddings storage
├── 📄 setup_ollama.sh        # Automated setup script
└── 📄 README.md              # Main documentation
```

---

## 9. 🚀 Next Steps After Setup

1. **Test Basic Functionality**

   ```bash
   # Test health endpoints
   curl http://localhost:8000/health
   curl http://localhost:5173

   # Upload a test file
   curl -X POST http://localhost:8000/upload_material \
     -F "file=@test_document.pdf"

   # Ask a question
   curl -X POST http://localhost:8000/ask \
     -H "Content-Type: application/json" \
     -d '{"question": "What is this document about?"}'
   ```
2. **Explore Features**

   - Try different AI tools (study planner, quiz generator, summarizer)
   - Test file upload with different document types
   - Experiment with different AI models
3. **Development Workflow**

   - Make code changes
   - Test changes thoroughly
   - Run automated tests
   - Update documentation if needed
4. **Contribute to Project**

   - Follow coding standards
   - Write tests for new features
   - Update documentation
   - Submit pull requests

---

## Support and Resources

### Documentation

- [Main README](../README.md) - Project overview
- [API Documentation](API_DOCUMENTATION.md) - Complete API reference
- [Architecture Guide](ARCHITECTURE.md) - System design details
- [Deployment Guide](DEPLOYMENT.md) - Production deployment

### Community

- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: Questions and community support
- Project Wiki: Additional guides and tutorials

---

**Happy coding! 🎉**

This development setup guide provides everything you need to get started with Dabba AI development. If you encounter any issues not covered here, please check the troubleshooting section or create a GitHub issue with detailed information about your problem.
