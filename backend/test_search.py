#!/usr/bin/env python3
"""Quick test to check if embeddings can be searched"""
import os
os.environ['OMP_NUM_THREADS'] = '1'
os.environ['MKL_NUM_THREADS'] = '1'
os.environ['OPENBLAS_NUM_THREADS'] = '1'

from embedding_manager import EmbeddingManager

print("Initializing embedding manager...")
em = EmbeddingManager(data_dir="./data")

print(f"Number of embeddings loaded: {len(em.metadata)}")
print(f"Next ID: {em.next_id}")

if len(em.metadata) > 0:
    print("\nSample metadata:")
    for i, (doc_id, meta) in enumerate(list(em.metadata.items())[:3]):
        print(f"  ID {doc_id}: {meta['text'][:100]}...")
    
    print("\nTesting search...")
    results = em.search("What is Python?", top_k=3)
    print(f"Found {len(results)} results")
    
    for i, result in enumerate(results, 1):
        print(f"\nResult {i}:")
        print(f"  Score: {result['score']:.4f}")
        print(f"  Text: {result['text'][:150]}...")
        print(f"  Metadata: {result['metadata']}")
else:
    print("No embeddings found!")
