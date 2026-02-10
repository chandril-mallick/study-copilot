import sys
import os
import unittest
from sympy import symbols, diff, integrate, sympify

# Add backend to path
sys.path.append('/Users/chandrilmallick/Downloads/dabba_ai_v4/backend')

from math_utils import solve_math_query

class TestMathSolver(unittest.TestCase):
    def test_derivative_basic(self):
        query = "derivative of x**2"
        result = solve_math_query(query)
        self.assertIn("Problem Statement", result)
        self.assertIn("Final Analytical Result", result)
        self.assertIn("2", result)
        self.assertIn("x", result)
        self.assertIn("Principles of Discrete Applied Mathematics", result)

    def test_derivative_quotient(self):
        query = "derive x/(x+1)"
        result = solve_math_query(query)
        self.assertIn("Quotient Rule", result)
        self.assertIn("Theoretical Foundation", result)
        # Normalize result for easier matching
        norm = result.replace(" ", "").replace("{", "").replace("}", "").replace("\\left", "").replace("\\right", "")
        self.assertIn("x+1", norm)
        self.assertIn("(x+1)^2", norm)

    def test_integral_basic(self):
        query = "integral of x**3"
        result = solve_math_query(query)
        self.assertIn("Antiderivative", result)
        self.assertIn("x^{4}", result)

    def test_discrete_math_recurrence(self):
        query = "find closed form of F(n) = F(n-1) + F(n-2)"
        result = solve_math_query(query)
        self.assertIn("Recurrence Relations", result)
        self.assertIn("Analytical Derivation", result)
        self.assertIn("Characteristic Equation", result)

    def test_simplify(self):
        query = "simplify (x-1)*(x+1)"
        result = solve_math_query(query)
        self.assertIn("algebraic transformations", result)
        self.assertIn("x^{2}", result)
        self.assertIn("1", result)

if __name__ == "__main__":
    unittest.main()
