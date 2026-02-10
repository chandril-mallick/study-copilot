from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base

# Create all tables
Base.metadata.create_all(bind=engine)

# Import routes
from routes import router

# Create FastAPI app
app = FastAPI(
    title="Dabba AI Q&A Forum",
    description="A scalable Q&A forum service for educational communities",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router, prefix="/api/qna", tags=["Q&A Forum"])

@app.get("/")
async def root():
    return {
        "message": "Dabba AI Q&A Forum Service",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Q&A Forum API",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
