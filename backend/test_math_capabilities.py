import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from math_utils import solve_math_query

def test_capabilities():
    examples = {
        "Algebra: Quadratic Equations": "solve x^2 + 5x + 6 = 0",
        "Algebra: Symbolic Equations": "solve ax^2 + bx + c = 0",
        "Calculus: Differentiation (Power Rule)": "derivative of x^3 + 2x^2 + 5",
        "Calculus: Differentiation (Product Rule)": "derivative of x * sin(x)",
        "Calculus: Differentiation (Quotient Rule)": "derivative of (x+1)/(x-1)",
        "Calculus: Indefinite Integration": "integrate 3x^2 + 2x + 1",
        "Calculus: Definite Integration": "integrate x^2 from 0 to 1",
        "Calculus: Limits": "limit of sin(x)/x as x approaches 0",
        "Discrete Math: Recurrence Relations": "a(n) = 3a(n-1) - 2a(n-2)",
        "Discrete Math: Summations": "sum k^2 from k=1 to 10",
        "Linear Algebra: Determinant": "determinant of [[1, 2], [3, 4]]",
        "Linear Algebra: Inverse": "inverse of [[1, 2], [3, 4]]",
        "Algebraic Simplification": "simplify (x^2 - 1) / (x - 1)"
    }
    
    print("# Math Engine Capabilities Test\n")
    for category, query in examples.items():
        print(f"## {category}")
        print(f"**Query**: {query}")
        try:
            result = solve_math_query(query)
            if result:
                print(f"**Status**: SUCCESS")
                # Print just the first few lines to confirm structure
                lines = result.split('\n')
                print(f"**Header**: {lines[0]}")
                print(f"**Type**: {lines[1]}")
            else:
                print(f"**Status**: FAILED (Returned None)")
        except Exception as e:
            print(f"**Status**: ERROR - {e}")
        print("-" * 20)

if __name__ == "__main__":
    test_capabilities()
