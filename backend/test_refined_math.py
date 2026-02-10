import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath("/Users/chandrilmallick/Downloads/dabba_ai_v4/backend"))

from math_utils import solve_math_query

def test_refined_math_solving():
    queries = [
        "integrate x^2",                     # Power Rule
        "integrate x^5",                     # Power Rule
        "integrate 1/x",                     # Log rule (special power rule)
        "derivative of x * sin(x)"           # Product Rule (Regression Test)
    ]
    
    print("--- Testing Refined Math Utils ---")
    for q in queries:
        print(f"Query: {q}")
        try:
            result = solve_math_query(q)
            if result:
                print("Result:\n" + result[:300] + "...") # Print first 300 chars to check headers
                print("Status: SUCCESS logic")
            else:
                print("Result: None")
                print("Status: FAILED logic (returned None)")
        except Exception as e:
            print(f"Error: {e}")
            
        print("-" * 40)

if __name__ == "__main__":
    test_refined_math_solving()
