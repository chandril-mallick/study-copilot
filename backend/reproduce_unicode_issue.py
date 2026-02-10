import sys
import os
import logging

# Add the current directory to sys.path to import local modules
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from math_utils import solve_math_query

# Configure logging
logging.basicConfig(level=logging.ERROR)

def test_unicode_implicit_multiplication():
    # Note the non-standard minus sign '−' (U+2212)
    query = "2(x−3)=4x+6" 
    print(f"Testing query with non-standard minus and implicit mult: {query}")
    try:
        result = solve_math_query(query)
        if result:
            print("Result found (first 200 chars):")
            print(result[:200] + "...")
        else:
            print("No result found (returned None)")
    except Exception as e:
        print(f"Caught exception: {e}")

def test_standard_implicit_multiplication():
    # Standard minus sign '-'
    query = "2(x-3)=4x+6"
    print(f"\nTesting query with standard minus and implicit mult: {query}")
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
    test_unicode_implicit_multiplication()
    test_standard_implicit_multiplication()
