import sys
import os
import logging

# Add the current directory to sys.path to import local modules
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from math_utils import solve_math_query

# Configure logging
logging.basicConfig(level=logging.INFO)

def test_equation():
    query = "x^2 + 2x + 10 = 20"
    print(f"Testing query: {query}")
    result = solve_math_query(query)
    if result:
        print("Result found:")
        print(result)
    else:
        print("No result found (returned None)")

if __name__ == "__main__":
    test_equation()
