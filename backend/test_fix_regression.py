import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath("/Users/chandrilmallick/Downloads/dabba_ai_v4/backend"))

from math_utils import solve_math_query, safe_parse
from sympy import symbols, diff

def test_implicit_multiplication():
    print("--- Testing Implicit Multiplication Regression ---")
    
    # Test safe_parse directly
    expr = safe_parse("ax^2 + bx + c")
    print(f"Parsed 'ax^2 + bx + c' -> {expr}")
    
    x = symbols('x')
    d = diff(expr, x)
    print(f"Derivative wrt x: {d}")
    
    if str(d) == "2*a*x + b":
        print("Status: SUCCESS (Correct symbolic derivative)")
    else:
        print(f"Status: FAILED (Expected 2*a*x + b, got {d})")
    
    print("-" * 40)
    
    # Test via solve_math_query (mocking intent)
    import math_utils
    original_intent_parser = math_utils.parse_math_intent
    math_utils.parse_math_intent = lambda q: {"operation": "diff", "expression": "ax^2 + bx + c", "variable": "x"}
    
    result = solve_math_query("differentiate ax^2 + bx + c")
    print("Result from solve_math_query:")
    print(result)
    
    if "2 a x + b" in result or "2*a*x + b" in result or "2ax + b" in result:
         print("Status: SUCCESS (Result contains correct derivative)")
    else:
         print("Status: FAILED (Correct derivative not found in output)")

    math_utils.parse_math_intent = original_intent_parser

if __name__ == "__main__":
    test_implicit_multiplication()
