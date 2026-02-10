import sys
import os
import logging

# Add the current directory to sys.path to import local modules
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from math_utils import solve_math_query

# Configure logging
logging.basicConfig(level=logging.ERROR)

def test_comprehensive_math():
    """Test comprehensive math capabilities including ODEs and partial derivatives."""
    
    test_cases = [
        # Basic Derivatives
        ("derivative of x^2", "Basic polynomial derivative"),
        ("derivative of sin^2x", "Trig power derivative"),
        ("derivative of e^x * cos(x)", "Product rule"),
        ("derivative of (x+1)/(x-1)", "Quotient rule"),
        
        # Basic Integrals
        ("integrate x^2", "Basic polynomial integral"),
        ("integrate sin(x)", "Trig integral"),
        ("integrate x^2 from 0 to 1", "Definite integral"),
        
        # ODEs
        ("solve differential equation y' + y = 0", "First-order ODE"),
        ("solve ode y'' + 4y = 0", "Second-order ODE"),
        
        # Partial Derivatives
        ("partial derivative of x^2 + y^2 with respect to x", "Partial derivative"),
        ("partial derivative of x*y^2 with respect to y", "Multivariable partial"),
        
        # Equations
        ("solve x^2 + 5x + 6 = 0", "Quadratic equation"),
        ("solve 2(x-3) = 4x + 6", "Linear with implicit mult"),
        
        # Limits
        ("limit of sin(x)/x as x approaches 0", "Classic limit"),
        
        # Summations
        ("sum k^2 from k=1 to 10", "Summation"),
        
        # Matrix
        ("determinant of [[1, 2], [3, 4]]", "Matrix determinant"),
        
        # Simplification
        ("simplify (x^2 - 1)/(x - 1)", "Algebraic simplification"),
    ]
    
    print("# Comprehensive Math Engine Test\n")
    print(f"Testing {len(test_cases)} different mathematical operations...\n")
    
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
                for line in result.split('\n'):
                    if "\\mathbf{" in line:
                        print(f"**Result**: {line.strip()}")
                        break
            else:
                print(f"**Status**: ✗ FAILED")
                print(f"**Error**: {result[:100] if result else 'None returned'}")
                failed += 1
        except Exception as e:
            print(f"**Status**: ✗ ERROR - {e}")
            failed += 1
        print("-" * 60)
    
    print(f"\n## Summary")
    print(f"**Passed**: {passed}/{len(test_cases)}")
    print(f"**Failed**: {failed}/{len(test_cases)}")
    print(f"**Success Rate**: {100 * passed / len(test_cases):.1f}%")

if __name__ == "__main__":
    test_comprehensive_math()
