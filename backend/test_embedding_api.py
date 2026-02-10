#!/usr/bin/env python3
"""
Test the embedding manager through the actual API endpoints
"""
import requests
import json
import sys

BASE_URL = "http://localhost:8000"

print("=" * 60)
print("EMBEDDING MANAGER API TEST")
print("=" * 60)

# Test 1: Check if backend is running
print("\n1. Checking if backend is running...")
try:
    response = requests.get(f"{BASE_URL}/health", timeout=5)
    if response.status_code == 200:
        print(f"   ✓ Backend is running: {response.json()}")
    else:
        print(f"   ✗ Backend returned status {response.status_code}")
        sys.exit(1)
except requests.exceptions.ConnectionError:
    print("   ✗ Cannot connect to backend. Is it running on port 8000?")
    sys.exit(1)
except Exception as e:
    print(f"   ✗ Error: {e}")
    sys.exit(1)

# Test 2: Upload a test document
print("\n2. Testing document upload (to populate embeddings)...")
test_content = """
Python Programming Basics:
Python is a high-level, interpreted programming language known for its simplicity and readability.
It supports multiple programming paradigms including procedural, object-oriented, and functional programming.
Python is widely used in web development, data science, machine learning, and automation.

Key features of Python:
- Easy to learn and read
- Extensive standard library
- Dynamic typing
- Cross-platform compatibility
- Large community support
"""

try:
    # Create a test file
    import tempfile
    import os
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        f.write(test_content)
        temp_file = f.name
    
    # Upload the file
    with open(temp_file, 'rb') as f:
        files = {'file': ('test_python.txt', f, 'text/plain')}
        data = {
            'subject': 'Computer Science',
            'topic': 'Python Programming'
        }
        response = requests.post(
            f"{BASE_URL}/upload_material",
            files=files,
            data=data,
            timeout=30
        )
    
    # Clean up temp file
    os.unlink(temp_file)
    
    if response.status_code == 200:
        result = response.json()
        print(f"   ✓ Document uploaded successfully")
        print(f"   Chunks processed: {result.get('chunks_processed', 'N/A')}")
        print(f"   File type: {result.get('file_type', 'N/A')}")
    else:
        print(f"   ✗ Upload failed with status {response.status_code}")
        print(f"   Response: {response.text}")
        
except Exception as e:
    print(f"   ✗ Error during upload: {e}")
    import traceback
    traceback.print_exc()

# Test 3: Ask a question (tests search functionality)
print("\n3. Testing question answering (tests embedding search)...")
questions = [
    "What is Python?",
    "What are the key features of Python?",
    "Is Python good for machine learning?"
]

for i, question in enumerate(questions, 1):
    print(f"\n   Question {i}: {question}")
    try:
        payload = {
            "question": question,
            "language": "en",
            "use_context": True
        }
        response = requests.post(
            f"{BASE_URL}/ask",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            answer = result.get('answer', '')
            sources = result.get('sources', [])
            
            print(f"   ✓ Got answer ({len(answer)} chars)")
            print(f"   Answer preview: {answer[:150]}...")
            print(f"   Sources found: {len(sources)}")
            
            if sources:
                print(f"   Top source score: {sources[0].get('score', 'N/A')}")
                print("   ✓ Embedding search is working!")
            else:
                print("   ⚠ No sources found (embeddings might be empty)")
                
        else:
            print(f"   ✗ Request failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"   ✗ Error: {e}")

# Test 4: Check data directory
print("\n4. Checking embedding data files...")
import os
data_dir = "./data"
index_path = os.path.join(data_dir, "index.faiss")
meta_path = os.path.join(data_dir, "metadata.pkl")

if os.path.exists(index_path):
    size = os.path.getsize(index_path)
    print(f"   ✓ Index file exists ({size} bytes)")
else:
    print(f"   ✗ Index file not found at {index_path}")

if os.path.exists(meta_path):
    size = os.path.getsize(meta_path)
    print(f"   ✓ Metadata file exists ({size} bytes)")
    
    # Try to read metadata
    try:
        import pickle
        with open(meta_path, 'rb') as f:
            data = pickle.load(f)
            num_embeddings = len(data.get('metadata', {}))
            next_id = data.get('next_id', 0)
            print(f"   Number of embeddings: {num_embeddings}")
            print(f"   Next ID: {next_id}")
    except Exception as e:
        print(f"   ⚠ Could not read metadata: {e}")
else:
    print(f"   ✗ Metadata file not found at {meta_path}")

# Summary
print("\n" + "=" * 60)
print("TEST SUMMARY")
print("=" * 60)
print("The embedding manager is being tested through the API.")
print("If you see sources being returned with scores, the embedding")
print("manager is working correctly!")
print("=" * 60)
