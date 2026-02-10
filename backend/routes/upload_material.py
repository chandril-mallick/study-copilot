from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
import os
import tempfile
import logging
from file_utils import process_uploaded_file, chunk_text
from embedding_manager import EmbeddingManager

router = APIRouter()
logger = logging.getLogger(__name__)
embedding_manager = EmbeddingManager()

class UploadResponse(BaseModel):
    message: str
    chunks_processed: int
    file_type: str

@router.post("/upload_material", response_model=UploadResponse)
async def upload_material(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file: {file.filename}")
        if not file.filename.lower().endswith((".pdf", ".txt")):
            logger.warning("Unsupported file type")
            raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported")
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        logger.info(f"Saved temp file at: {temp_file_path}")
        extracted_text, file_type = process_uploaded_file(temp_file_path, file.filename)
        logger.info(f"Extracted text length: {len(extracted_text)} | File type: {file_type}")
        chunks = chunk_text(extracted_text, chunk_size=500)
        logger.info(f"Chunked into {len(chunks)} chunks")
        if not chunks:
            logger.warning("No text content found in the uploaded file")
            raise HTTPException(status_code=400, detail="No text content found in the uploaded file")
        chunk_metadata = [{"source_file": file.filename, "chunk_index": i} for i in range(len(chunks))]
        logger.info(f"Adding {len(chunks)} chunks to embedding manager")
        embedding_manager.add_documents(chunks, chunk_metadata)
        logger.info(f"Successfully added chunks to FAISS index")
        return UploadResponse(
            message=f"Successfully processed {file.filename} and added {len(chunks)} chunks to the knowledge base",
            chunks_processed=len(chunks),
            file_type=file_type
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing uploaded file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
