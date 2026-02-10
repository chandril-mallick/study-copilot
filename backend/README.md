# Dabba AI Backend

This is the FastAPI backend for Dabba AI, an AI-powered study assistant that helps students understand their study materials through conversational queries.

## Features

- **File Upload**: Upload PDF and TXT study materials
- **Text Extraction**: Automatically extract text from PDF files using PyPDF2
- **Text Chunking**: Split large documents into manageable chunks (~500 characters each)
- **Vector Embeddings**: Generate embeddings using Sentence-Transformers (`all-MiniLM-L6-v2`)
- **FAISS Vector Search**: Efficient similarity search for relevant context
- **Ollama Integration**: Use local Ollama models (`gemma3:1b`) for AI responses
- **Advanced Math Engine**: Symbolic math solving for calculus, algebra, and discrete math.
- **REST API**: Clean FastAPI endpoints for frontend integration

## Setup Instructions

### Prerequisites

1. **Python 3.8+**: Make sure Python is installed
2. **Ollama**: Install Ollama for local AI model serving
   ```bash
   # Install Ollama (Mac/Linux)
   curl -fsSL https://ollama.ai/install.sh | sh

   # Pull the required model
   ollama pull gemma3:1b
   ```

### Installation

1. **Navigate to backend directory**:

   ```bash
   cd backend
   ```
2. **Install Python dependencies**:

   ```bash
   pip install -r requirements.txt
   ```
3. **Verify Ollama is running**:

   ```bash
   # Check if Ollama is running
   ollama list

   # You should see gemma3:1b in the list
   ```

### Running the Server

1. **Start the FastAPI server**:

   ```bash
   python main.py
   ```
2. **Or run with uvicorn directly**:

   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
3. **The server will be available at**:

   - Local: http://localhost:8000
   - Network: http://0.0.0.0:8000

### API Endpoints

- `GET /` - Welcome page with API information
- `GET /health` - Health check endpoint
- `POST /upload_material` - Upload PDF/TXT files for processing
- `POST /ask` - Ask questions about uploaded materials

### Data Storage

- FAISS index and metadata are stored in the `../data/` directory
- Files: `index.faiss` (vector index) and `materials.pkl` (metadata)

## Troubleshooting

1. **Ollama not found**: Make sure Ollama is installed and running
2. **Model not available**: Run `ollama pull gemma3:1b` to download the model
3. **Import errors**: Ensure all requirements are installed with `pip install -r requirements.txt`
4. **CORS issues**: The server allows all origins in development. Configure appropriately for production.
