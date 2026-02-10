import PyPDF2
from fastapi import HTTPException
import os
import logging
import re
import asyncio

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_path: str):
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)

            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"

            logger.info(f"Successfully extracted text from PDF: {file_path}")
            return text.strip()  # Return trimmed text to avoid extra whitespace

    except Exception as e:
        logger.error(f"Error extracting text from PDF {file_path}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")


def extract_text_from_txt(file_path: str):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()

        logger.info(f"Successfully extracted text from TXT: {file_path}")
        return text.strip()

    except UnicodeDecodeError:
        # Try with different encoding
        try:
            with open(file_path, 'r', encoding='latin-1') as file:
                text = file.read()
            logger.info(f"Successfully extracted text from TXT with latin-1 encoding: {file_path}")
            return text.strip()
        except Exception as e:
            logger.error(f"Error extracting text from TXT {file_path}: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Failed to extract text from TXT: {str(e)}")
    except Exception as e:
        logger.error(f"Error extracting text from TXT {file_path}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to extract text from TXT: {str(e)}")

from typing import List

def chunk_text(text: str, chunk_size: int = 500) -> List[str]:
    """
    Split text into chunks of approximately chunk_size characters.

    Args:
        text (str): Text to chunk
        chunk_size (int): Maximum size of each chunk

    Returns:
        List[str]: List of text chunks
    """
    # Split by double newlines to preserve paragraphs
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = ""

    for paragraph in paragraphs:
        # If paragraph itself is too big, split by single newlines
        if len(paragraph) > chunk_size:
            lines = paragraph.split('\n')
            for line in lines:
                if len(current_chunk) + len(line) > chunk_size:
                     if current_chunk:
                         chunks.append(current_chunk.strip())
                     current_chunk = line + "\n"
                else:
                    current_chunk += line + "\n"
        else:
            if len(current_chunk) + len(paragraph) > chunk_size:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = paragraph + "\n\n"
            else:
                current_chunk += paragraph + "\n\n"

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    logger.info(f"Created {len(chunks)} chunks from text")
    return chunks
from typing import Tuple

def process_uploaded_file(file_path: str, filename: str) -> Tuple[str, str]:
    """
    Process an uploaded file (PDF or TXT) and extract text.

    Args:
        file_path (str): Path to the uploaded file
        filename (str): Original filename

    Returns:
        Tuple[str, str]: (extracted_text, file_type)
    """
    file_extension = filename.lower().split('.')[-1]

    if file_extension == 'pdf':
        text = extract_text_from_pdf(file_path)
        file_type = 'pdf'
    elif file_extension == 'txt':
        text = extract_text_from_txt(file_path)
        file_type = 'txt'
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Only PDF and TXT files are supported.")

    # Clean up the uploaded file after processing
    try:
        os.remove(file_path)
    except Exception as e:
        logger.warning(f"Failed to clean up uploaded file {file_path}: {str(e)}")

    return text, file_type

def hook(f: callable, file_path: str, filename: str) -> Tuple[str, str]:
    try:
        text, file_type = process_uploaded_file(file_path, filename)
        return text, file_type
    except HTTPException as e:
        return f"Error: {e.detail}", f"Error: {e.status_code}"


# Example usage (for testing):
if __name__ == '__main__':
    async def main():
        await hook(process_uploaded_file, "my_file.pdf", "my_file.pdf")
        await hook(process_uploaded_file, "my_file.txt", "my_file.txt")

    asyncio.run(main())
