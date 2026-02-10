#!/bin/bash

# Startup script for Dabba AI Backend
# This script sets environment variables to prevent segmentation faults
# with PyTorch/sentence-transformers on macOS ARM

echo "Starting Dabba AI Backend..."
echo "Python version: $(python --version)"
echo ""

# Set threading environment variables to prevent segfaults
export OMP_NUM_THREADS=1
export MKL_NUM_THREADS=1
export OPENBLAS_NUM_THREADS=1

# Activate virtual environment
source .venv/bin/activate

# Start the backend server
echo "Starting uvicorn server on port 8000..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
