import sys
import os
import logging
import math

# Add the current directory to sys.path to import local modules
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from math_utils import solve_math_query

# Configure logging
logging.basicConfig(level=logging.ERROR)

def test_calculus_easy_medium():
    """Test easy to medium level derivatives and integrals."""
    
    test_cases = [
        # --- DERIVATIVES ---
        # Easy
        ("derivative of 5x^3 - 2x^2 + x - 7", "Polynomial Derivative (Easy)"),
        ("derivative of sin(x)", "Basic Trig Derivative (Easy)"),
        ("derivative of e^x", "Basic Exponential Derivative (Easy)"),
        ("derivative of log(x)", "Basic Logarithmic Derivative (Easy)"),
        ("derivative of sqrt(x)", "Power Rule with Fraction (Easy)"),
        
        # Medium
        ("derivative of sin^2(x)", "Trig Power (Medium)"),
        ("derivative of tan(x)", "Trig Derivative (Easy-Medium)"),
        ("derivative of sin(x^2)", "Chain Rule (Medium)"),
        ("derivative of e^(2x)", "Chain Rule Exponential (Medium)"),
        ("derivative of x^2 * sin(x)", "Product Rule (Medium)"),
        ("derivative of (x+1)/(x-1)", "Quotient Rule (Medium)"),
        ("derivative of ln(3x + 2)", "Chain Rule Log (Medium)"),
        
        # --- INTEGRALS ---
        # Easy
        ("integrate 3x^2 + 2x + 1", "Basic Polynomial Integral (Easy)"),
        ("integrate cos(x)", "Basic Trig Integral (Easy)"),
        ("integrate e^x", "Basic Exponential Integral (Easy)"),
        ("integrate 1/x", "Basic Reciprocal Integral (Easy)"),
        
        # Medium
        ("integrate sin(2x)", "Substitution Integral (Medium)"),
        ("integrate x * e^(x^2)", "Substitution Integral (Medium)"),
        ("integrate 1/(x^2 + 1)", "Common Identity Integral (Medium)"),
        ("integrate log(x)", "Integration by Parts (Medium)"),
        
        # Definite
        ("integrate x^2 from 0 to 2", "Definite Polynomial (Easy)"),
        ("integrate sin(x) from 0 to pi", "Definite Trig (Medium)"),
        ("integrate e^x from 0 to 1", "Definite Exponential (Easy)"),
    ]
    
    print("# Calculus Engine Test: Easy to Medium Levels\n")
    print(f"Testing {len(test_cases)} different calculus operations...\n")
    
    passed = 0
    failed = 0
    
    for query, description in test_cases:
        print(f"## {description}")
        print(f"**Query**: `{query}`")
        try:
            result = solve_math_query(query)
            if result and "Error" not in result:
                print(f"**Status**: ✓ SUCCESS")
                passed += 1
                # Extract and show the final result
                found_res = False
                for line in result.split('\n'):
                    if "\\mathbf{" in line:
                        print(f"**Result**: {line.strip()}")
                        found_res = True
                        break
                if not found_res:
                    # Fallback to last line if no bold result found
                    print(f"**Result**: {result.strip().splitlines()[-1]}")
            else:
                print(f"**Status**: ✗ FAILED")
                print(f"**Error**: {result[:200] if result else 'None returned'}")
                failed += 1
        except Exception as e:
            print(f"**Status**: ✗ ERROR - {e}")
            failed += 1
        print("-" * 60)
    
    print(f"\n## Final Summary")
    print(f"**Total Tests**: {len(test_cases)}")
    print(f"**Passed**: {passed}/{len(test_cases)}")
    print(f"**Failed**: {failed}/{len(test_cases)}")
    print(f"**Success Rate**: {100 * passed / len(test_cases):.1f}%")

if __name__ == "__main__":
    test_calculus_easy_medium()
