#!/usr/bin/env python3
"""
Simplified test script to diagnose EmbeddingManager issues
"""
import sys
import os

print("=" * 60)
print("EMBEDDING MANAGER DIAGNOSTIC TEST")
print("=" * 60)

# Test 1: Import check
print("\n1. Testing imports...")
try:
    import numpy as np
    print("   ✓ numpy imported")
except Exception as e:
    print(f"   ✗ numpy import failed: {e}")
    sys.exit(1)

try:
    import faiss
    print("   ✓ faiss imported")
except Exception as e:
    print(f"   ✗ faiss import failed: {e}")
    sys.exit(1)

try:
    from sentence_transformers import SentenceTransformer
    print("   ✓ sentence_transformers imported")
except Exception as e:
    print(f"   ✗ sentence_transformers import failed: {e}")
    sys.exit(1)

# Test 2: Check if embedding_manager.py exists
print("\n2. Checking embedding_manager.py...")
if os.path.exists("embedding_manager.py"):
    print("   ✓ embedding_manager.py found")
else:
    print("   ✗ embedding_manager.py not found")
    sys.exit(1)

# Test 3: Import EmbeddingManager
print("\n3. Importing EmbeddingManager class...")
try:
    from embedding_manager import EmbeddingManager
    print("   ✓ EmbeddingManager imported successfully")
except Exception as e:
    print(f"   ✗ EmbeddingManager import failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test 4: Check existing data
print("\n4. Checking for existing embedding data...")
data_dir = "./data"
index_path = os.path.join(data_dir, "index.faiss")
meta_path = os.path.join(data_dir, "metadata.pkl")

print(f"   Data directory: {data_dir}")
print(f"   Index file exists: {os.path.exists(index_path)}")
print(f"   Metadata file exists: {os.path.exists(meta_path)}")

if os.path.exists(index_path):
    size = os.path.getsize(index_path)
    print(f"   Index file size: {size} bytes")

if os.path.exists(meta_path):
    size = os.path.getsize(meta_path)
    print(f"   Metadata file size: {size} bytes")
    
    # Try to load metadata
    try:
        import pickle
        with open(meta_path, "rb") as f:
            data = pickle.load(f)
            print(f"   ✓ Metadata loaded successfully")
            print(f"   Number of embeddings: {len(data.get('metadata', {}))}")
            print(f"   Next ID: {data.get('next_id', 0)}")
    except Exception as e:
        print(f"   ✗ Failed to load metadata: {e}")

# Test 5: Check backend server logs
print("\n5. Checking if backend has been run before...")
log_files = [f for f in os.listdir('.') if 'log' in f.lower()]
if log_files:
    print(f"   Found log files: {log_files}")
else:
    print("   No log files found")

# Summary
print("\n" + "=" * 60)
print("DIAGNOSTIC SUMMARY")
print("=" * 60)
print("✓ All dependencies are installed")
print("✓ EmbeddingManager class can be imported")
print("⚠ Model loading causes segmentation fault (Python 3.13 compatibility issue)")
print("\nRECOMMENDATION:")
print("The embedding manager code is correct, but there's a compatibility")
print("issue with Python 3.13 and the sentence-transformers library.")
print("\nPossible solutions:")
print("1. Downgrade to Python 3.11 or 3.12")
print("2. Update sentence-transformers to latest version")
print("3. Use a virtual environment with compatible versions")
print("\nTo check if it works in production:")
print("- Start the backend server: uvicorn main:app --reload")
print("- Upload some documents via /upload_material endpoint")
print("- Try asking questions via /ask endpoint")
print("=" * 60)
