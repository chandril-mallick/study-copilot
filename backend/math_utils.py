import re
import json
from sympy import (
    symbols, diff, integrate, sympify, latex, simplify, S, Function, 
    Pow, exp, log, sin, cos, tan, Eq, solve, limit, Sum, Matrix,
    oo, Integer, Float, Rational, Mul, dsolve, Derivative
)
from sympy.parsing.sympy_parser import (
    parse_expr, standard_transformations, 
    implicit_multiplication_application, convert_xor,
    implicit_application
)
import logging
import ast
from typing import Dict, Any, Optional

# Global transformations for math parsing
MATH_TRANSFORMATIONS = standard_transformations + (
    implicit_multiplication_application,
    implicit_application,
    convert_xor
)

def safe_parse(expr_str: str):
    """
    Safely parses a mathematical expression string, handling implicit multiplication
    and symbols like '^' for power.
    """
    if not expr_str:
        return None
    try:
        # Unicode normalization for common math symbols
        unicode_map = {
            '−': '-', # En-dash
            '–': '-', # Em-dash
            '·': '*', # Middle dot
            '×': '*', # Multiplication sign
            '÷': '/', # Division sign
        }
        for u_char, std_char in unicode_map.items():
            expr_str = expr_str.replace(u_char, std_char)

        # Handle LaTeX text artifacts that might appear in input
        expr_str = expr_str.replace(r"\textasciicircum", "^")
        expr_str = expr_str.replace(r"\textasciitilde", "~")

        # Pre-process trigonometric powers like sin^2(x) -> (sin(x))**2
        # This handles sin^2x, cos^3(x), tan^4 x etc.
        trig_functions = "sin|cos|tan|sec|csc|cot|log|exp"
        expr_str = re.sub(
            r"\b(" + trig_functions + r")\^(\d+)\s*\(?([a-z0-9]+)\)?", 
            r"(\1(\3))**\2", 
            expr_str, 
            flags=re.IGNORECASE
        )
        # Also handle sin^2(x) where parenthesis are present but part of the base
        expr_str = re.sub(
            r"\b(" + trig_functions + r")\^(\d+)", 
            r"(\1)**\2", 
            expr_str, 
            flags=re.IGNORECASE
        )

        # 1. Replace LaTeX-style text blocks like \text{content} with just 'content'
        clean_str = re.sub(r"\\text\{(.*?)\}", r"\1", expr_str)
        
        # 2. Remove common LaTeX math commands that aren't operators
        # We replace them with spaces to avoid merging tokens
        clean_str = re.sub(r"\\(?:differentialD|delta|Delta|alpha|beta|gamma|theta|pi|phi|sigma|lambda|mu|differential)\s*", " ", clean_str)
        
        # 3. Remove all other backslashes
        clean_str = clean_str.replace("\\", " ")
        
        # 4. Remove common "stray" words, but ONLY as full words
        # We avoid stripping 'a', 'b', 'c' by ensuring they aren't in this list
        keywords_to_strip = [
            "derivative", "derive", "differentiation", "integral", "integrate", 
            "antiderivative", "calculate", "compute", "find", "the", "value", "of", "is",
            "differentiald", "partiald", "differential", "partial"
        ]
        kw_regex = r"(?i)\b(" + "|".join(keywords_to_strip) + r")\b"
        clean_str = re.sub(kw_regex, " ", clean_str)

        # 5. Remove calculus notation (dx, dt, dy, etc.)
        # Remove d* followed by boundary variable (e.g., dx, dt)
        clean_str = re.sub(r"(?i)\b(d|\\Delta|differential|partial)\s*[x-z]\b", " ", clean_str)
        
        # 6. Normalize variable names and remove trailing punctuation
        clean_str = clean_str.replace(",", " ").strip()
        
        # Handle 'infinity' and 'oo' explicitly
        if clean_str.lower() in ["infinity", "inf"]:
            clean_str = "oo"
            
        if 'X' in clean_str:
            clean_str = clean_str.replace('X', 'x')
            
        # Map 'e' to 'E' (Euler's number) for SymPy parsing
        # We do this carefully to avoid replacing 'e' inside words (though we already stripped most keywords)
        # Replacing solo 'e' or 'e' as a base in e^x
        clean_str = re.sub(r"\be\b", "E", clean_str)
            
        # 7. Final trim
        clean_str = clean_str.strip()
        
        if not clean_str:
            return None
            
        res = parse_expr(clean_str, transformations=MATH_TRANSFORMATIONS)
        
        # If the result is just a function class (e.g. sin, FunctionClass), try to apply it to 'x'
        # Check by name or type since FunctionClass check can be tricky
        if str(type(res)) == "<class 'sympy.core.function.FunctionClass'>":
             res = res(symbols('x'))
             
        return res
    except Exception as e:
        logger.error(f"safe_parse error for '{expr_str}': {e}")
        # Final attempt: remove non-math/non-variable characters and try sympify
        minimal_str = re.sub(r"[^a-zA-Z0-9\+\-\*\/\^\(\)\.\=\s]", "", clean_str)
        return sympify(minimal_str)

# Import run_ollama for intent parsing
try:
    from ollama_utils import run_ollama
except ImportError:
    # Handle the case where math_utils is run standalone for testing
    def run_ollama(prompt, model="gemma3:1b"):
        return None

logger = logging.getLogger(__name__)

def get_mit_style_header(title):
    return f"#### Principles of Discrete Applied Mathematics\n### Operation Type: {title}\n"

def extract_json(text: str) -> Optional[Dict[str, Any]]:
    """Robustly extract JSON from text even if LLM includes markers or preamble."""
    try:
        # Try finding JSON between code blocks first
        match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
        if match:
            return json.loads(match.group(1))
        
        # Try finding the first '{' and last '}'
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1:
            return json.loads(text[start:end+1])
        
        return json.loads(text)
    except:
        return None

def parse_math_intent(query: str) -> Optional[Dict[str, Any]]:
    """
    Uses LLM to parse the mathematical intent from a natural language query.
    Returns a dictionary with 'operation', 'expression', 'variable', and optional 'bounds'.
    """
    prompt = f"""
Analyze the mathematical query below. Your goal is to extract the core operation and expression, ignoring any surrounding conversational text or potentially incorrect mathematical derivations provided by the user.

Query: "{query}"

Extract into this JSON format:
{{
  "operation": "diff|integrate|limit|solve|summation|matrix_det|matrix_inv|simplify",
  "expression": "the clean mathematical expression (e.g., '3*x^2 + 5*x - 4')",
  "variable": "the variable of interest (default 'x')",
  "point": "value" (for limits),
  "lower_bound": "value",
  "upper_bound": "value",
  "is_definite": true|false
}}

Strict Rules:
1. If the user provides a "solution" or "derivation" that is wrong, IGNORE it and just extract the original problem.
2. Return ONLY the JSON object. No preamble or explanation.
3. Use '*' for multiplication and '**' or '^' for powers.
4. DO NOT assume boundaries (0 to 1, etc.) unless explicitly stated in the query. For indefinite integrals (like 'integral of f(x)'), set "is_definite": false and "lower_bound": null, "upper_bound": null.
"""
    try:
        response = run_ollama(prompt)
        if not response:
            return None
        return extract_json(response)
    except Exception as e:
        logger.error(f"Intent parsing error: {e}")
        return None

def explain_derivative_steps(expr, x):
    header = get_mit_style_header("Calculus: Differentiation")
    
    # Check for Quotient Rule: u / v
    numer, denom = expr.as_numer_denom()
    if denom != 1:
        u = numer
        v = denom
        u_prime = diff(u, x)
        v_prime = diff(v, x)
        final_res = diff(expr, x)
        
        return header + f"""
---
**1. Problem Statement**
Find the first derivative of the fractional expression:
$$ f(x) = \\frac{{{latex(u)}}}{{{latex(v)}}} $$

---
**2. Theoretical Foundation**
We utilize the **Quotient Rule**, which states that for a function $f(x) = \\frac{{u(x)}}{{v(x)}}$:
$$ \\frac{{d}}{{dx}} \\left[ \\frac{{u}}{{v}} \\right] = \\frac{{u'v - uv'}}{{v^{{2}}}} $$

---
**3. Analytical Derivation**
*   **Step 1:** Define numerator $u = {latex(u)}$ and denominator $v = {latex(v)}$.
*   **Step 2:** Compute $u' = \\frac{{du}}{{dx}} = {latex(u_prime)}$.
*   **Step 3:** Compute $v' = \\frac{{dv}}{{dx}} = {latex(v_prime)}$.
*   **Step 4:** Substitute components into the rule:
$$ f'(x) = \\frac{{ \\left({latex(u_prime)}\\right)\\left({latex(v)}\\right) - \\left({latex(u)}\\right)\\left({latex(v_prime)}\\right) }}{{ \\left({latex(v)}\\right)^{{2}} }} $$

---
**4. Final Analytical Result**
The simplified derivative is:
$$\\boxed{{ \\frac{{df}}{{dx}} = {latex(final_res)} }}$$

---
**5. Mathematical Insight**
The Quotient Rule is a fundamental analytical technique in calculus for determining the rate of change of rational functions. The result represents the precise slope of the tangent line to the curve at any given point $x$ where $v(x) \\neq 0$.
"""

    # Check for Product Rule: u * v
    if expr.is_Mul:
        args = expr.args
        # Filter arguments that depend on x
        x_deps = [a for a in args if a.has(x)]
        if len(x_deps) >= 2:
            u = x_deps[0]
            v = Mul(*x_deps[1:])
            # Include constants if any
            constants = Mul(*[a for a in args if not a.has(x)])
            
            u_prime = diff(u, x)
            v_prime = diff(v, x)
            final_res = diff(expr, x)
            
            return header + f"""
---
**1. Problem Statement**
Differentiate the product of two functions:
$$ f(x) = {latex(expr)} $$

---
**2. Theoretical Foundation**
We utilize the **Product Rule** (Leibniz Rule), which states that for a function $f(x) = u(x)v(x)$:
$$ \\frac{{d}}{{dx}}[uv] = u'v + uv' $$

---
**3. Analytical Derivation**
*   **Step 1:** Identify the factors $u = {latex(u)}$ and $v = {latex(v)}$.
*   **Step 2:** Compute $u' = \\frac{{du}}{{dx}} = {latex(u_prime)}$.
*   **Step 3:** Compute $v' = \\frac{{dv}}{{dx}} = {latex(v_prime)}$.
*   **Step 4:** Combine using the Product Rule:
$$ f'(x) = \\left({latex(u_prime)}\\right)\\left({latex(v)}\\right) + \\left({latex(u)}\\right)\\left({latex(v_prime)}\\right) $$

---
**4. Final Analytical Result**
After algebraic simplification:
$$\\boxed{{ \\frac{{df}}{{dx}} = {latex(final_res)} }}$$

---
**5. Mathematical Insight**
The Product Rule demonstrates that the rate of change of a product is a weighted sum that accounts for the interaction between both components. This reflects how the variation in one factor scales the value of the other factor in real-time.
"""

    res = diff(expr, x)
    return header + f"""
---
**1. Problem Statement**
Differentiate the expression with respect to $x$:
$$ f(x) = {latex(expr)} $$

---
**2. Theoretical Foundation**
This transformation follows the fundamental rules of differentiation including the **Power Rule** ($\frac{{d}}{{dx}}x^n = nx^{{n-1}}$) and **Linearity**.

---
**3. Analytical Derivation**
Applying the differentiation operator $\\frac{{d}}{{dx}}$ to the terms:
$$ \\frac{{d}}{{dx}} \\left[ {latex(expr)} \\right] $$

---
**4. Final Analytical Result**
The resulting derivative is:
$$\\boxed{{ \\frac{{df}}{{dx}} = {latex(res)} }}$$

---
**5. Mathematical Insight**
The derivative provides the instantaneous rate of change and is critical for determining the critical points (maxima/minima) of the function.
"""

def explain_integral_steps(expr, x, lower=None, upper=None):
    header = get_mit_style_header("Calculus: Integration")
    
    if lower is not None and upper is not None:
        # Definite Integral General Case
        total_result = integrate(expr, (x, lower, upper))
        antiderivative = integrate(expr, x)
        
        # Build analytical derivation steps
        if expr.is_Add or expr.is_Pow or expr.is_Mul or expr.is_Symbol:
            is_poly = expr.is_polynomial(x)
            if is_poly:
                terms = expr.as_ordered_terms()
                steps = []
                for term in terms:
                    term_int = integrate(term, x)
                    steps.append(f"*   $\\int {latex(term)} \\, dx = {latex(term_int)}$")
                derivation_text = "Integrating term-by-term:\n" + "\n".join(steps)
            else:
                derivation_text = f"The indefinite integral (antiderivative) is $F(x) = {latex(antiderivative)} + C$."
        else:
            derivation_text = f"The indefinite integral is $F(x) = {latex(antiderivative)} + C$."

        return header + f"""
---
**1. Problem Statement**
Compute the definite integral:
$$ I = \\int_{{{latex(lower)}}}^{{{latex(upper)}}} \\left( {latex(expr)} \\right) \\differentialD x $$

---
**2. Theoretical Foundation**
We utilize the **Fundamental Theorem of Calculus (Part II)**, which evaluates the accumulated change between boundaries:
$$ \\int_{{a}}^{{b}} f(x) \\differentialD x = F(b) - F(a) $$

---
**3. Analytical Derivation**
*   **Step 1:** Find the antiderivative $F(x) = {latex(antiderivative)}$.
*   **Step 2:** {derivation_text}
*   **Step 3:** Evaluate at boundaries: $F({latex(upper)}) - F({latex(lower)})$
$$ I = \\left[ {latex(antiderivative)} \\right]_{{{latex(lower)}}}^{{{latex(upper)}}} $$
$$ I = ({latex(antiderivative.subs(x, upper))}) - ({latex(antiderivative.subs(x, lower))}) $$

---
**4. Final Analytical Result**
$$\\boxed{{ I = {latex(total_result)} }}$$

---
**5. Mathematical Insight**
This definite integral calculates the exact signed area trapped between the curve and the x-axis within the interval $[{latex(lower)}, {latex(upper)}]$.
"""

    # Indefinite Integral General Case
    result = integrate(expr, x)
    
    # Polynomial specialized handling for indefinite
    if (expr.is_Add or expr.is_Pow or expr.is_Mul or expr.is_Symbol) and expr.is_polynomial(x):
        terms = expr.as_ordered_terms()
        steps = []
        for term in terms:
            term_int = integrate(term, x)
            steps.append(f"*   $\\int {latex(term)} \\, \\differentialD x = {latex(term_int)}$ (using the Power Rule $\\int x^n \\differentialD x = \\frac{{x^{{n+1}}}}{{n+1}}$)")
        derivation_text = "\n".join(steps)
        
        return header + f"""
---
**1. Problem Statement**
Compute the indefinite integral of the polynomial:
$$ f(x) = {latex(expr)} $$

---
**2. Theoretical Foundation**
We utilize the **Linearity of Integration** and the **Power Rule** for polynomials:
$$ \\int x^n \\differentialD x = \\frac{{x^{{n+1}}}}{{n+1}} + C \\quad (n \\neq -1) $$

---
**3. Analytical Derivation**
Applying the integral operator $\\int (\\dots) \\differentialD x$ term-by-term:
{derivation_text}

---
**4. Final Analytical Result**
The general antiderivative is:
$$\\boxed{{ I = {latex(result)} + C }}$$

---
**5. Mathematical Insight**
The result represents the entire family of curves whose derivative is the original function. The constant $C$ accounts for the arbitrary vertical translation of the antiderivative.
"""

    return header + f"""
---
**1. Problem Statement**
Compute the indefinite integral of:
$$ f(x) = {latex(expr)} $$

---
**2. Theoretical Foundation**
Integration is the **inverse operation of differentiation**. This process involves finding the set of all antiderivatives.
$$ F(x) = \\int f(x) \\, dx + C $$

---
**3. Analytical Derivation**
Using standard integration techniques (Power Rule, Substitution, or Trigonometric Identities):
$$ \\int {latex(expr)} \\, dx $$

---
**4. Final Analytical Result**
The general solution is:
$$ \\mathbf{{I = {latex(result)} + C}} $$

---
**5. Mathematical Insight**
The **Constant of Integration** ($C$) represents the vertical shift. Since the derivative of a constant is zero, there is an infinite family of functions that represent the integral.
"""

def explain_matrix_steps(matrix_expr, op):
    header = get_mit_style_header("Linear Algebra: Matrix Operations")
    try:
        # Convert string representation of list of lists to actual list
        if isinstance(matrix_expr, str):
            try:
                matrix_data = ast.literal_eval(matrix_expr)
                M = Matrix(matrix_data)
            except:
                M = Matrix(matrix_expr)
        else:
            M = Matrix(matrix_expr)
            
        if op == "matrix_det":
            res = M.det()
            return header + f"""
---
**1. Problem Statement**
Calculate the determinant of the matrix:
$$ M = {latex(M)} $$

---
**2. Theoretical Foundation**
The determinant is a fundamental scalar attribute of square matrices that characterizes the geometric scaling of the linear transformation.

---
**3. Analytical Derivation**
Applying the Laplace expansion or row reduction algorithms to calculate the alternating sum of products:
$$ \\det(M) = {latex(res)} $$

---
**4. Final Analytical Result**
$$\\boxed{{ \\det(M) = {latex(res)} }}$$

---
**5. Mathematical Insight**
A non-zero determinant ($\\det(M) \\neq 0$) indicates the matrix is non-singular and invertible, preserving the dimensionality of the vector space.
"""
        elif op == "matrix_inv":
            if M.det() == 0:
                return header + r"\n**Error**: The matrix is singular ($\det=0$) and does not have an inverse."
            res = M.inv()
            return header + f"""
---
**1. Problem Statement**
Determine the inverse of matrix $M$:
$$ M = {latex(M)} $$

---
**2. Theoretical Foundation**
The inverse matrix $M^{{-1}}$ is the unique matrix such that $M \\cdot M^{{-1}} = I$, where $I$ is the identity matrix.

---
**3. Analytical Derivation**
Utilizing the Adjugate Matrix method or Gauss-Jordan Elimination:
$$ M^{{-1}} = \\frac{{1}}{{\\det(M)}} \\text{{adj}}(M) $$

---
**4. Final Analytical Result**
$$\\boxed{{ M^{{-1}} = {latex(res)} }}$$

---
**5. Mathematical Insight**
The inverse represents the transformation that "un-does" the action of $M$, effectively mapping vectors back to their original basis.
"""
    except Exception as e:
        return f"Matrix error: {e}"

def explain_limit_steps(expr, x, point):
    header = get_mit_style_header("Calculus: Limits")
    try:
        res = limit(expr, x, point)
        return header + f"""
---
**1. Problem Statement**
Evaluate the limit of the function as it approaches the specified point:
$$ \\lim_{{{latex(x)} \\to {latex(point)}}} \\left( {latex(expr)} \\right) $$

---
**2. Theoretical Foundation**
Limits define the foundational behavior of functions near a point, providing the rigorous basis for continuity and derivatives.

---
**3. Analytical Derivation**
As $x$ approaches ${latex(point)}$, we utilize algebraic reduction or L'Hôpital's rule to resolve indeterminate forms:
$$ \\lim_{{{latex(x)} \\to {latex(point)}}} f(x) = {latex(res)} $$

---
**4. Final Analytical Result**
$$\\boxed{{ \\lim_{{{latex(x)} \\to {latex(point)}}} f(x) = {latex(res)} }}$$

---
**5. Mathematical Insight**
This result characterizes the asymptotic behavior or local continuity. If the limit matches $f({latex(point)})$, the function is continuous.
"""
    except Exception as e:
        return f"Error calculating limit: {e}"

def explain_summation_steps(expr, k, start, end):
    header = get_mit_style_header("Discrete Mathematics: Summations")
    try:
        res = Sum(expr, (k, start, end)).doit()
        return header + f"""
---
**1. Problem Statement**
Compute the series summation:
$$ S = \\sum_{{{latex(k)}={latex(start)}}}^{{{latex(end)}}} {latex(expr)} $$

---
**2. Theoretical Foundation**
Summation is a linear operator that accumulates terms from a discrete sequence, often simplified via closed-form identities.

---
**3. Analytical Derivation**
Iteratively summing terms from $k = {latex(start)}$ to $k = {latex(end)}$ for the expression $f(k) = {latex(expr)}$.

---
**4. Final Analytical Result**
$$\\boxed{{ S = {latex(res)} }}$$

---
**5. Mathematical Insight**
The total sum provides the integrated value of the discrete sequence over the specified range, representing a discrete analog to integration.
"""
    except Exception as e:
        return f"Error calculating summation: {e}"

def explain_equation_solver_steps(expr_str):
    header = get_mit_style_header("Algebra: Equation Solving")
    try:
        # Handle equations like "x^2 = 4" by converting to "x^2 - 4"
        if "=" in expr_str:
            lhs, rhs = expr_str.split("=")
            expr = safe_parse(lhs) - safe_parse(rhs)
        else:
            expr = safe_parse(expr_str)
            
        x = symbols('x')
        # Check if it's a quadratic equation in x
        is_quadratic = False
        try:
            poly = expr.as_poly(x)
            if poly and poly.degree() == 2:
                is_quadratic = True
        except:
            pass

        if is_quadratic:
            # Standard Form: ax^2 + bx + c = 0
            a = expr.coeff(x, 2)
            b = expr.coeff(x, 1)
            c = expr.subs(x, 0)
            
            discriminant = b**2 - 4*a*c
            solutions = solve(expr, x)
            
            # Safe comparison for insight (handle symbolic discriminants)
            insight_text = "The nature of the roots depends on the discriminant $D = b^2 - 4ac$."
            if discriminant.is_Number:
                if discriminant > 0:
                    insight_text = "Since the discriminant $D > 0$, the equation has two distinct real roots."
                elif discriminant < 0:
                    insight_text = "Since the discriminant $D < 0$, the equation has two complex (imaginary) roots."
                else:
                    insight_text = "Since the discriminant $D = 0$, the equation has one repeated real root."

            return header + f"""
---
**1. Problem Statement**
Determine the roots of the quadratic equation:
$$ {latex(expr)} = 0 $$

---
**2. Theoretical Foundation**
A quadratic equation $ax^{{2}} + bx + c = 0$ is solved via the **Quadratic Formula**, where the roots are determined by the discriminant $D = b^{{2}} - 4ac$.

---
**3. Analytical Derivation**
*   **Step 1:** Coefficients: $a = {latex(a)}, b = {latex(b)}, c = {latex(c)}$.
*   **Step 2:** Discriminant calculation:
$$ D = ({latex(b)})^{{2}} - 4({latex(a)})({latex(c)}) = {latex(discriminant)} $$
*   **Step 3:** Application of the formula:
$$ x = \\frac{{-{latex(b)} \\pm \\sqrt{{{latex(discriminant)}}}}}{{2({latex(a)})}} $$

---
**4. Final Analytical Result**
$$\\boxed{{ x \\in \\{{ {', '.join([latex(s) for s in solutions])} \\}} }}$$

---
**5. Mathematical Insight**
{insight_text}
"""

        # Fallback for non-quadratic or general equations
        solutions = solve(expr)
        return header + f"""
---
**1. Problem Statement**
Find all real/complex roots for the equation:
$$ {latex(expr)} = 0 $$

---
**2. Theoretical Foundation**
Root finding involves identifying the values of $x$ for which the function vanishes, corresponding to horizontal axis intercepts.

---
**3. Analytical Derivation**
Utilizing symbolic solvers and algebraic manipulation to isolate the variable:
$$ {latex(expr)} = 0 $$

---
**4. Final Analytical Result**
$$\\boxed{{ x \\in \\{{ {', '.join([latex(s) for s in solutions])} \\}} }}$$

---
**5. Mathematical Insight**
The solution set defines the zero-crossings of the function $f(x) = {latex(expr)}$, where the output value is exactly neutralized.
"""
    except Exception as e:
        logger.error(f"Equation solver error: {e}")
        return f"Error solving equation: {e}"

def solve_discrete_math(query: str) -> str | None:
    header = get_mit_style_header("Discrete Mathematics: Recurrence Relations")
    match = re.search(r"([a-z])\(n\)\s*=\s*([0-9]*)\s*\*?\s*\1\(n-1\)\s*\+\s*([0-9]*)\s*\*?\s*\1\(n-2\)", query.lower())
    if match:
        var_name = match.group(1).upper()
        a_val = int(match.group(2)) if match.group(2) else 1
        b_val = int(match.group(3)) if match.group(3) else 1
        r = symbols('r')
        roots = solve(Eq(r**2 - a_val*r - b_val, 0), r)
        if len(roots) == 2:
            r1, r2 = roots
            return header + f"""
---
**1. Problem Statement**
Determine the closed-form solution for the linear recurrence:
$$ {var_name}_n = {a_val}{var_name}_{{n-1}} + {b_val}{var_name}_{{n-2}} $$

---
**2. Theoretical Foundation**
We utilize the **Method of Characteristic Equations**, assuming a solution of power form $a_n = r^n$.

---
**3. Analytical Derivation**
*   **Step 1:** Formulate characteristic equation: $r^{{2}} - {a_val}r - {b_val} = 0$.
*   **Step 2:** Calculate roots $r_1, r_2$: $r_1 = {latex(r1)}, r_2 = {latex(r2)}$.

---
**4. Final Analytical Result**
$$\\boxed{{ {var_name}_n = c_1 \\left({latex(r1)}\\right)^n + c_2 \\left({latex(r2)}\\right)^n }}$$

---
**5. Mathematical Insight**
The general solution is a linear combination of the characteristic solutions, where constants $c_1, c_2$ are typically determined by initial seed values $a_0, a_1$.
"""
    return None

def solve_math_query(query: str) -> str | None:
    try:
        # 1. Discrete Math check (Regex is fast)
        discrete_res = solve_discrete_math(query)
        if discrete_res: return discrete_res

        # 2. Deterministic check (Equation, Calculus, Discrete, Matrix, Simplify)
        # Handle specific LaTeX artifacts before stripping text/backslashes
        query = query.replace(r"\textasciicircum", "^")
        query = query.replace(r"\textasciitilde", "~")
        
        query_det = re.sub(r"\\text\{(.*?)\}", r"\1", query)
        query_det = query_det.replace("\\", " ").lower()
        
        # Detection flags
        is_ode = any(kw in query_det for kw in ["differential equation", "ode", "y''", "y'", "dy/dx"])
        is_partial = any(kw in query_det for kw in ["partial derivative", "partial", "∂"])
        is_sum = any(kw in query_det for kw in ["sum", "summation", "sigma"])
        is_limit = "limit" in query_det
        is_matrix = any(kw in query_det for kw in ["matrix", "determinant", "inverse", "det(", "inv("])
        is_simplify = "simplify" in query_det
        is_diff = any(kw in query_det for kw in ["derivative", "derive", "d/dx", "differentiation"])
        is_int = any(kw in query_det for kw in ["integral", "integrate", "antiderivative"])
        is_solve = any(kw in query_det for kw in ["solve", "roots of", "find x"])
        has_equals = "=" in query_det

        # Priority Ordered Dispatch
        
        # 0. ODEs (highest priority for differential equations)
        if is_ode:
            # Extract the ODE string
            match = re.search(r"(?:solve|ode|differential equation)\s+(.*)", query_det)
            ode_str = match.group(1) if match else query_det
            return explain_ode_steps(ode_str)
        
        # 0.5 Partial Derivatives
        if is_partial:
            # Extract expression and variables
            # "partial derivative of x^2 + y^2 with respect to x" or "∂f/∂x for f=x^2+y^2"
            match = re.search(r"(?:partial derivative of|partial)\s+(.*?)\s+(?:with respect to|wrt)\s+([a-z,\s]+)", query_det)
            if match:
                expr_str, vars_str = match.groups()
                var_list = [v.strip() for v in vars_str.replace("and", ",").split(",")]
                return explain_partial_derivative_steps(safe_parse(expr_str), var_list)
        
        # 1. Summations (Check before solve because of k=1)
        if is_sum:
            # Try to extract expr, var, lower, upper from natural language
            # "sum k^2 from k=1 to 10"
            match = re.search(r"sum\s+(.*?)\s+(?:from|for|with)\s+([a-z])\s*=\s*(\d+)\s+to\s+(\d+|inf|oo)", query_det)
            if match:
                expr_str, var, start, end = match.groups()
                return explain_summation_steps(safe_parse(expr_str), symbols(var), safe_parse(start), safe_parse(end))
            # Fallback for simpler sum x^2
            match_simple = re.search(r"sum\s+(.*)", query_det)
            if match_simple:
                return explain_summation_steps(safe_parse(match_simple.group(1)), symbols('k'), 1, 10)

        # 2. Limits
        if is_limit:
            match = re.search(r"limit\s+of\s+(.*?)\s+as\s+([a-z])\s+(?:approaches|to|->)\s+(\d+|inf|oo|infinity)", query_det)
            if match:
                expr_str, var, point = match.groups()
                if point == "infinity": point = "oo"
                return explain_limit_steps(safe_parse(expr_str), symbols(var), safe_parse(point))

        # 3. Matrix Operations
        if is_matrix:
            op = "matrix_det" if any(kw in query_det for kw in ["determinant", "det("]) else "matrix_inv"
            # Extract matrix: find [[...]]
            match = re.search(r"(\[\[.*?\]\])", query_det)
            if match:
                return explain_matrix_steps(match.group(1), op)

        # 4. Simplification
        if is_simplify:
            expr_str = query_det.replace("simplify", "").strip()
            return explain_math_query_by_op("simplify", expr_str)

        # 5. Differentiation
        if is_diff:
            match = re.search(r"(?:derivative of|derive|d/dx|differentiation of)\s+(.*)", query_det)
            expr_str = match.group(1) if match else query_det.replace("derivative", "").replace("derive", "").replace("of", "").strip()
            # Clean up function definitions like f(x)= or y=
            expr_str = re.sub(r"\b[a-z]\(x\)\s*=\s*", "", expr_str) # f(x)=
            expr_str = re.sub(r"\b[y]\s*=\s*", "", expr_str)      # y=
            return explain_derivative_steps(safe_parse(expr_str), symbols('x'))

        # 6. Integration
        if is_int:
            # Check for definite boundaries "from A to B"
            match_def = re.search(r"integrate\s+(.*?)\s+from\s+(.*?)\s+to\s+(.*)", query_det)
            if match_def:
                expr_str, lower, upper = match_def.groups()
                return explain_integral_steps(safe_parse(expr_str), symbols('x'), safe_parse(lower), safe_parse(upper))
            match_indef = re.search(r"(?:integral of|integrate|antiderivative of)\s+(.*)", query_det)
            expr_str = match_indef.group(1) if match_indef else query_det.replace("integral", "").replace("integrate", "").replace("of", "").strip()
            return explain_integral_steps(safe_parse(expr_str), symbols('x'))

        # 7. Equation Solving (Lowest priority detection for '=')
        if is_solve or (has_equals and not is_sum):
            expr_candidate = query_det.replace("solve", "").replace("find x for", "").replace("roots of", "").strip()
            if any(c in expr_candidate for c in "0123456789xyz^+-*/="):
                return explain_equation_solver_steps(expr_candidate)

        # 3. LLM Intent Parsing
        intent = parse_math_intent(query)

        op = intent.get("operation")
        expr_str = intent.get("expression", "").replace("^", "**")
        var_symbol = symbols(intent.get("variable", "x"))
        
        return explain_math_query_by_op(op, expr_str, var_symbol, intent)

    except Exception as e:
        logger.error(f"Math utils error: {e}")
        return None

def explain_math_query_by_op(op: str, expr_str: str, var_symbol=None, intent=None) -> str | None:
    """Helper to route operation to explanation function."""
    if not var_symbol:
        var_symbol = symbols(intent.get("variable", "x") if intent else "x")
        
    if op == "diff":
        return explain_derivative_steps(safe_parse(expr_str), var_symbol)
    elif op == "integrate":
        lower = intent.get("lower_bound") if intent else None
        upper = intent.get("upper_bound") if intent else None
        return explain_integral_steps(
            safe_parse(expr_str), 
            var_symbol, 
            safe_parse(str(lower)) if lower is not None else None, 
            safe_parse(str(upper)) if upper is not None else None
        )
    elif op == "limit":
        p = intent.get("point", 0) if intent else 0
        if p == "inf": p = oo
        return explain_limit_steps(safe_parse(expr_str), var_symbol, safe_parse(str(p)))
    elif op == "summation":
        k = symbols(intent.get("variable", "k") if intent else "k")
        lower = intent.get("lower_bound", 1) if intent else 1
        upper = intent.get("upper_bound", 10) if intent else 10
        return explain_summation_steps(
            safe_parse(expr_str), k, 
            safe_parse(str(lower)), 
            safe_parse(str(upper))
        )
    elif op == "solve":
        return explain_equation_solver_steps(expr_str)
    elif op == "matrix_det" or op == "matrix_inv":
        return explain_matrix_steps(expr_str, op)
    elif op == "simplify":
        result = simplify(safe_parse(expr_str))
        header = get_mit_style_header("Algebraic Simplification")
        return header + f"""
---
**1. Problem Statement**
Simplify the given mathematical expression:
$$ {latex(safe_parse(expr_str))} $$

---
**2. Theoretical Foundation**
Simplification involves the systematic reduction of terms via structural identities, factoring, and combining like terms.

---
**3. Analytical Derivation**
Applying symbolic simplification algorithms to identify common factors and consolidate terms.

---
**4. Final Analytical Result**
$$\\boxed{{ {latex(result)} }}$$

---
**5. Mathematical Insight**
Reducing the complexity of an expression facilitates easier analytical manipulation and reveals the underlying structure of the mathematical object.
"""
    return None
def explain_ode_steps(ode_str, func_var='y', indep_var='x'):
    """Solve an ODE and provide MIT-style explanation."""
    header = get_mit_style_header("Differential Equations: ODE Solving")
    try:
        y = Function(func_var)
        x = symbols(indep_var)
        
        # Clean the input
        ode_str = ode_str.replace("'", "'").strip()
        
        # Build the ODE equation directly using SymPy
        # Handle y', y'', etc. by constructing Derivative objects
        if "y''" in ode_str:
            # Second order: replace y'' with actual derivative
            ode_str_clean = ode_str.replace("y''", "YPRIME2").replace("y'", "YPRIME1").replace("y", "Y")
            ode_expr_str = ode_str_clean.replace("YPRIME2", "diff(y(x), x, 2)").replace("YPRIME1", "diff(y(x), x)").replace("Y", "y(x)")
        elif "y'" in ode_str:
            # First order
            ode_str_clean = ode_str.replace("y'", "YPRIME").replace("y", "Y")
            ode_expr_str = ode_str_clean.replace("YPRIME", "diff(y(x), x)").replace("Y", "y(x)")
        else:
            ode_expr_str = ode_str.replace("y", "y(x)")
        
        # Parse as equation using parse_expr for safety and implicit multiplication
        # Define a safe global/local dict for parse_expr
        eval_globals = {
            "x": x, "y": y, "diff": diff, "sin": sin, "cos": cos, "exp": exp,
            "Function": Function, "Eq": Eq, "Derivative": Derivative
        }
        
        if "=" in ode_expr_str:
            lhs_str, rhs_str = ode_expr_str.split("=")
            lhs = parse_expr(lhs_str.strip(), local_dict=eval_globals, transformations=MATH_TRANSFORMATIONS)
            rhs = parse_expr(rhs_str.strip(), local_dict=eval_globals, transformations=MATH_TRANSFORMATIONS)
            ode_expr = Eq(lhs, rhs)
        else:
            ode_expr = parse_expr(ode_expr_str, local_dict=eval_globals, transformations=MATH_TRANSFORMATIONS)
        
        # Solve the ODE
        solution = dsolve(ode_expr, y(x))
        
        result_str = f"""
---
**1. Problem Statement**
Find the general solution for the ODE:
$$ {latex(ode_expr)} $$

---
**2. Theoretical Foundation**
Solving ordinary differential equations requires identifying the equation's order and linearity to apply appropriate integration methods.

---
**3. Analytical Derivation**
Applying the `dsolve` operator to find the family of functions whose derivatives satisfy the local relation:
$$ y(x) = {latex(solution.rhs)} $$

---
**4. Final Analytical Result**
$$\\boxed{{ {latex(solution)} }}$$

---
**5. Mathematical Insight**
The solution represents a family of integral curves. Specific trajectories can be isolated if initial value conditions (IVP) are provided.
"""
        return header + result_str
    except Exception as e:
        logger.error(f"ODE solver error: {e}")
        return f"Error solving ODE: {e}"

def explain_partial_derivative_steps(expr, var_list):
    """Compute partial derivatives for multivariable functions."""
    header = get_mit_style_header("Multivariable Calculus: Partial Derivatives")
    try:
        # var_list should be like ['x', 'y'] or a single var for repeated differentiation
        if isinstance(var_list, str):
            var_list = [var_list]
        
        var_symbols = [symbols(v) for v in var_list]
        result = expr
        
        # Compute partial derivative with respect to each variable in sequence
        for v in var_symbols:
            result = diff(result, v)
        
        # Build the notation string
        if len(var_list) == 1:
            notation = f"\\frac{{\\partial f}}{{\\partial {var_list[0]}}}"
        else:
            partial_str = "".join([f"\\partial {v}" for v in var_list])
            notation = f"\\frac{{\\partial^{len(var_list)} f}}{{{partial_str}}}"
        
        result_str = f"""
---
**1. Problem Statement**
Compute the partial derivative of the multivariable function:
$$ f = {latex(expr)} $$
$$ {notation} $$

---
**2. Theoretical Foundation**
Partial derivatives quantify the sensitivity of a function to change in a specific dimension while treating orthogonal variables as static.

---
**3. Analytical Derivation**
Iteratively applying the differentiation operator with respect to the coordinate variables:
$$ {notation} = {latex(result)} $$

---
**4. Final Analytical Result**
$$\\boxed{{ {notation} = {latex(result)} }}$$

---
**5. Mathematical Insight**
This result provides the local gradient component in the direction of the specified variables, essential for multivariate optimization.
"""
        return header + result_str
    except Exception as e:
        logger.error(f"Partial derivative error: {e}")
        return f"Error computing partial derivative: {e}"
