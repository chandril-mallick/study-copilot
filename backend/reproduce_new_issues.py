import sys
import os
import logging

# Add the current directory to sys.path to import local modules
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from math_utils import solve_math_query

# Configure logging
logging.basicConfig(level=logging.ERROR)

def test_symbolic_equation():
    query = "ax^2 + bx + c = 0"
    print(f"Testing symbolic query: {query}")
    try:
        result = solve_math_query(query)
        if result:
            print("Result found (first 200 chars):")
            print(result[:200] + "...")
        else:
            print("No result found (returned None)")
    except Exception as e:
        print(f"Caught exception: {e}")

def test_latex_derivative():
    query = "\\text{d}e\\text{rivative of (ax}^2+bx+c)\\differentialD x"
    print(f"\nTesting LaTeX derivative query: {query}")
    try:
        result = solve_math_query(query)
        if result:
            print("Result found (first 200 chars):")
            print(result[:200] + "...")
        else:
            print("No result found (returned None)")
    except Exception as e:
        print(f"Caught exception: {e}")

if __name__ == "__main__":
    test_symbolic_equation()
    test_latex_derivative()
