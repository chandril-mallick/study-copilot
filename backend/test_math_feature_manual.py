import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath("/Users/chandrilmallick/Downloads/dabba_ai_v4/backend"))

from math_utils import solve_math_query

def test_math_solving():
    queries = [
        "derivative of x^2",
        "integrate x",
        "simplify x + x",
        "derivative of sin(x)",
        "what is the capital of france" # Should return None
    ]
    
    print("--- Testing Math Utils ---")
    for q in queries:
        result = solve_math_query(q)
        print(f"Query: {q}")
        if result:
            print(f"Result (First 50 chars): {result[:50]}...")
            print("Status: SUCCESS logic (returned result)")
        else:
            print("Result: None")
            print("Status: SUCCESS logic (ignored non-math)" if "capital" in q else "FAILED logic (returned None for math)")
        print("-" * 20)

if __name__ == "__main__":
    test_math_solving()
