import sys
import os
import logging
from sympy import symbols, latex

# Add the current directory to sys.path to import local modules
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from math_utils import solve_math_query, safe_parse

# Configure logging
logging.basicConfig(level=logging.ERROR)

def test_trig_parsing():
    queries = [
        "derivative of sin^2x",
        "derivative of cos^3 x",
        "derivative of sin(x)^2",
        "derivative of sin x"
    ]
    
    print("# Trig Parsing Test\n")
    for q in queries:
        print(f"## Query: {q}")
        try:
            # Test direct safe_parse first
            expr_str = q.replace("derivative of ", "")
            parsed = safe_parse(expr_str)
            print(f"Parsed representation: {parsed}")
            
            result = solve_math_query(q)
            if result:
                print(f"**Status**: SUCCESS")
                # Look for the final result line
                for line in result.split('\n'):
                    if "result =" in line.lower() or "\\mathbf{" in line:
                        print(f"Final Result: {line}")
            else:
                print(f"**Status**: FAILED (Returned None)")
        except Exception as e:
            print(f"**Status**: ERROR - {e}")
        print("-" * 20)

if __name__ == "__main__":
    test_trig_parsing()
