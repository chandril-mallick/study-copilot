def explain_ode_steps(ode_str, func_var='y', indep_var='x'):
    """Solve an ODE and provide MIT-style explanation."""
    header = get_mit_style_header("Differential Equations: ODE Solving")
    try:
        y = Function(func_var)
        x = symbols(indep_var)
        
        # Parse the ODE - handle common formats
        # e.g., "y'' + 2y' + y = 0" or "dy/dx = x + y"
        ode_str = ode_str.replace("'", "'")
        
        # Convert notation: y' -> Derivative(y(x), x), y'' -> Derivative(y(x), x, x)
        ode_str = re.sub(r"y''''", "Derivative(y(x), x, x, x, x)", ode_str)
        ode_str = re.sub(r"y'''", "Derivative(y(x), x, x, x)", ode_str)
        ode_str = re.sub(r"y''", "Derivative(y(x), x, x)", ode_str)
        ode_str = re.sub(r"y'", "Derivative(y(x), x)", ode_str)
        ode_str = re.sub(r"\by\b", "y(x)", ode_str)
        
        # Parse the equation
        ode_expr = safe_parse(ode_str)
        
        # Solve the ODE
        solution = dsolve(ode_expr, y(x))
        
        result_str = f"""
---
**1. Problem Statement**
Solve the ordinary differential equation:
$$ {latex(ode_expr)} $$

---
**2. Theoretical Foundation**
We apply standard ODE solving techniques (separation of variables, integrating factors, or characteristic equations depending on the type).

---
**3. Analytical Derivation**
Using SymPy's `dsolve` function, we obtain the general solution.

---
**4. Final Analytical Result**
$$ \\mathbf{{{latex(solution)}}} $$

---
**5. Mathematical Insight**
The solution represents the family of curves satisfying the differential equation. Constants (C1, C2, etc.) are determined by initial conditions.
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
Compute the partial derivative:
$$ f = {latex(expr)} $$
$$ {notation} $$

---
**2. Theoretical Foundation**
Partial derivatives measure the rate of change of a multivariable function with respect to one variable while holding others constant.

---
**3. Analytical Derivation**
Applying the partial derivative operator:
$$ {notation} = {latex(result)} $$

---
**4. Final Analytical Result**
$$ \\mathbf{{{notation} = {latex(result)}}} $$

---
**5. Mathematical Insight**
This partial derivative shows how the function changes in the direction of {', '.join(var_list)}.
"""
        return header + result_str
    except Exception as e:
        logger.error(f"Partial derivative error: {e}")
        return f"Error computing partial derivative: {e}"
