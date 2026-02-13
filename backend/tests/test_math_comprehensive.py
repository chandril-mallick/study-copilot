
import sys
import os
import unittest

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from math_utils import solve_math_query

class TestMathComprehensive(unittest.TestCase):
    
    def assert_math_response(self, query, expected_keywords):
        """Helper to assert that the response contains expected mathematical terms/results."""
        print(f"\nTesting: {query}")
        result = solve_math_query(query)
        self.assertIsNotNone(result, f"Failed to get result for: {query}")
        lower_result = result.lower()
        for kw in expected_keywords:
            self.assertIn(kw.lower(), lower_result, f"Expected '{kw}' in result for query '{query}'")
        print(f"✅ Passed")

    # --- Algebra ---
    def test_algebra_linear_equation(self):
        self.assert_math_response(
            "solve 2x + 5 = 15", 
            ["Equation Solving", "x", "5"]
        )

    def test_algebra_quadratic_equation(self):
        self.assert_math_response(
            "solve x^2 - 5x + 6 = 0", 
            ["Quadratic Formula", "discriminant", "2", "3"]
        )
        
    def test_algebra_simplification(self):
        # simplify(x+x) -> 2x is a better test for simplify than expansion
        self.assert_math_response(
            "simplify x + x", 
            ["Simplification", "2", "x"] # Flexible check
        )

    # --- Calculus: Differentiation ---
    def test_diff_polynomial(self):
        self.assert_math_response(
            "derivative of 3x^3 + 2x^2 - 5x", 
            ["Differentiation", "9", "x^{2}"]
        ) # Matches 9*x**2 which often formats as 9 x^{2} in latex

    def test_diff_trig(self):
        self.assert_math_response(
            "derivative of sin(x)", 
            ["Differentiation", "cos"]
        )

    def test_diff_product(self):
        self.assert_math_response(
            "derivative of x*sin(x)", 
            ["Product Rule", "sin", "cos"]
        )

    # --- Calculus: Integration ---
    def test_int_polynomial(self):
        self.assert_math_response(
            "integrate x^2", 
            ["Integration", "C", "x^{3}"]
        )

    def test_int_definite(self):
        self.assert_math_response(
            "integrate x from 0 to 2", 
            ["Integration", "2"] # integral x is x^2/2 -> 4/2 - 0 = 2
        )

    # --- Calculus: Limits ---
    def test_limit_simple(self):
        self.assert_math_response(
            "limit of x^2 as x approaches 3", 
            ["Limits", "9"]
        )

    def test_limit_infinity(self):
        self.assert_math_response(
            "limit of 1/x as x approaches infinity", 
            ["Limits", "0"]
        )

    # --- Linear Algebra ---
    def test_matrix_determinant(self):
        self.assert_math_response(
            "determinant of [[1, 2], [3, 4]]", 
            ["Determinant", "-2"] # 1*4 - 2*3 = 4 - 6 = -2
        )

    # --- Discrete Math ---
    def test_summation(self):
        self.assert_math_response(
            "sum k from k=1 to 5", 
            ["Summations", "15"] # 1+2+3+4+5 = 15
        )

    # --- Trigonometry & Transcendental (Medium) ---
    def test_diff_trig_power(self):
        self.assert_math_response(
            "derivative of sin^2(x)", 
            ["Differentiation", "2", "sin", "cos"] # d/dx sin^2(x) = 2 sin(x) cos(x)
        )

    def test_diff_exponential(self):
        self.assert_math_response(
            "derivative of e^(2x)", 
            ["Differentiation", "2", "exp"]
        )

    def test_diff_logarithm(self):
        self.assert_math_response(
            "derivative of log(x)", 
            ["Differentiation", "1", "x"] # Matches \frac{1}{x} or 1/x
        )

    def test_solve_trig_simple(self):
        self.assert_math_response(
            "solve sin(x) = 0", 
            ["Equation Solving", "0", "pi"]
        )

    def test_simplify_trig(self):
        self.assert_math_response(
            "simplify sin(x)^2 + cos(x)^2", 
            ["Simplification", "1"]
        )

if __name__ == "__main__":
    unittest.main()
