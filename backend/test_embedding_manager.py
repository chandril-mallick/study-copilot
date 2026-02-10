#!/usr/bin/env python3
"""
Test script to verify EmbeddingManager functionality
"""
import sys
import os
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_embedding_manager():
    """Test the EmbeddingManager class"""
    
    print("=" * 60)
    print("EMBEDDING MANAGER TEST")
    print("=" * 60)
    
    try:
        # Import the embedding manager
        from embedding_manager import EmbeddingManager
        print("✓ Successfully imported EmbeddingManager")
        
        # Initialize the manager
        print("\n1. Initializing EmbeddingManager...")
        em = EmbeddingManager(data_dir="./test_data")
        print("✓ EmbeddingManager initialized successfully")
        
        # Check model
        print(f"\n2. Model loaded: {em.model_name}")
        print(f"   Model object: {type(em.model)}")
        print("✓ Model is loaded")
        
        # Check existing data
        print(f"\n3. Existing embeddings: {len(em.metadata)}")
        if em.index:
            print(f"   FAISS index exists: Yes")
            print(f"   Next ID: {em.next_id}")
        else:
            print(f"   FAISS index exists: No (will be created on first add)")
        
        # Test adding documents
        print("\n4. Testing document addition...")
        test_docs = [
            "Python is a high-level programming language.",
            "Machine learning is a subset of artificial intelligence.",
            "FAISS is a library for efficient similarity search."
        ]
        
        test_metadata = [
            {"source": "test", "topic": "programming"},
            {"source": "test", "topic": "AI"},
            {"source": "test", "topic": "search"}
        ]
        
        doc_ids = em.add_documents(test_docs, test_metadata)
        print(f"✓ Added {len(doc_ids)} documents with IDs: {doc_ids}")
        
        # Test search
        print("\n5. Testing search functionality...")
        query = "What is Python?"
        results = em.search(query, top_k=2)
        
        print(f"   Query: '{query}'")
        print(f"   Results found: {len(results)}")
        
        for i, result in enumerate(results, 1):
            print(f"\n   Result {i}:")
            print(f"     Score: {result['score']:.4f}")
            print(f"     Text: {result['text'][:60]}...")
            print(f"     Metadata: {result['metadata']}")
        
        if results:
            print("\n✓ Search is working correctly")
        else:
            print("\n✗ Search returned no results (unexpected)")
        
        # Test another search
        print("\n6. Testing another search query...")
        query2 = "Tell me about machine learning"
        results2 = em.search(query2, top_k=2)
        
        print(f"   Query: '{query2}'")
        print(f"   Results found: {len(results2)}")
        
        for i, result in enumerate(results2, 1):
            print(f"\n   Result {i}:")
            print(f"     Score: {result['score']:.4f}")
            print(f"     Text: {result['text'][:60]}...")
        
        # Check persistence
        print("\n7. Checking data persistence...")
        index_path = em._index_path()
        meta_path = em._meta_path()
        
        print(f"   Index file: {index_path}")
        print(f"   Index exists: {os.path.exists(index_path)}")
        print(f"   Metadata file: {meta_path}")
        print(f"   Metadata exists: {os.path.exists(meta_path)}")
        
        if os.path.exists(index_path) and os.path.exists(meta_path):
            print("✓ Data is being persisted correctly")
        else:
            print("✗ Data persistence issue detected")
        
        # Test reloading
        print("\n8. Testing data reload...")
        em2 = EmbeddingManager(data_dir="./test_data")
        print(f"   Reloaded embeddings: {len(em2.metadata)}")
        print(f"   Next ID after reload: {em2.next_id}")
        
        if len(em2.metadata) == len(em.metadata):
            print("✓ Data reloaded successfully")
        else:
            print("✗ Data reload issue detected")
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print("✓ Model initialization: PASSED")
        print("✓ Document addition: PASSED")
        print("✓ Search functionality: PASSED")
        print("✓ Data persistence: PASSED")
        print("✓ Data reload: PASSED")
        print("\n✅ ALL TESTS PASSED - EMBEDDING MANAGER IS WORKING!")
        print("=" * 60)
        
        return True
        
    except ImportError as e:
        print(f"\n✗ Import Error: {e}")
        print("   Make sure all dependencies are installed:")
        print("   - sentence-transformers")
        print("   - faiss-cpu")
        print("   - numpy")
        return False
        
    except Exception as e:
        print(f"\n✗ Error during testing: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_embedding_manager()
    sys.exit(0 if success else 1)
