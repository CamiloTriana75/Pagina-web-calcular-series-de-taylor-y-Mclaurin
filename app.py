from flask import Flask, request, jsonify, send_from_directory
import os
import math
import numpy as np
from functools import lru_cache

app = Flask(__name__, static_folder='static')

# Factorial con caché para mejorar rendimiento
@lru_cache(maxsize=128)
def factorial(n):   
    if n == 0 or n == 1:
        return 1
    return n * factorial(n-1)

# Definiciones de funciones matemáticas
functions = {
    'sin': {
        'exact': lambda x: math.sin(x),
        'term': lambda x, n: (-1)**n * (x**(2*n+1)) / factorial(2*n+1),
        'taylor': lambda x, a, n: np.sum([
            ((-1)**(i//2) * (math.sin(a) if i % 4 == 0 else math.cos(a) if i % 4 == 1 else -math.sin(a) if i % 4 == 2 else -math.cos(a))) * 
            ((x-a)**i) / 
            factorial(i) for i in range(n+1)
        ]),
        'name': 'sen(x)'
    },
    'cos': {
        'exact': lambda x: math.cos(x),
        'term': lambda x, n: (-1)**n * (x**(2*n)) / factorial(2*n),
        'taylor': lambda x, a, n: np.sum([
            ((-1)**(i//2) * (math.cos(a) if i % 4 == 0 else -math.sin(a) if i % 4 == 1 else -math.cos(a) if i % 4 == 2 else math.sin(a))) * 
            ((x-a)**i) / 
            factorial(i) for i in range(n+1)
        ]),
        'name': 'cos(x)'
    },
    'exp': {
        'exact': lambda x: math.exp(x),
        'term': lambda x, n: (x**n) / factorial(n),
        'taylor': lambda x, a, n: math.exp(a) * np.sum([
            ((x-a)**i) / factorial(i) for i in range(n+1)
        ]),
        'name': 'exp(x)'
    },
    'ln': {
        'exact': lambda x: math.log(1 + x),
        'term': lambda x, n: ((-1)**n if n > 0 else 1) * (x**(n+1)) / (n+1),
        'taylor': lambda x, a, n: math.log(1+a) + np.sum([
            ((-1)**(i-1)) * ((1/(1+a))**i) * ((x-a)**i) / i for i in range(1, n+1)
        ]) if a != 0 else np.sum([
            ((-1)**(i-1)) * (x**(i)) / i for i in range(1, n+1)
        ]),
        'name': 'ln(1+x)'
    },
    'fraction': {
        'exact': lambda x: 1 / (1 - x),
        'term': lambda x, n: x**n,
        'taylor': lambda x, a, n: np.sum([
            ((1/(1-a))**(i+1)) * ((x-a)**i) for i in range(n+1)
        ]) if a != 0 else np.sum([
            x**i for i in range(n+1)
        ]),
        'name': '1/(1-x)'
    }
}

# Rutas para servir el frontend
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# API para cálculos de series
@app.route('/api/calculate', methods=['POST'])
def calculate():
    data = request.json
    func_name = data.get('function')
    x = float(data.get('x'))
    num_terms = int(data.get('terms'))
    series_type = data.get('type')
    a = float(data.get('a', 0))  # Punto de convergencia para Taylor
    
    if func_name not in functions:
        return jsonify({'error': 'Función no válida'}), 400
    
    func = functions[func_name]
    exact_value = func['exact'](x)
    terms_data = []
    
    if series_type == 'mclaurin':
        running_sum = 0
        for n in range(num_terms + 1):
            term_value = func['term'](x, n)
            running_sum += term_value
            rel_error = abs((exact_value - running_sum) / exact_value) * 100 if exact_value != 0 else 0
            
            terms_data.append({
                'n': n,
                'term': term_value,
                'sum': running_sum,
                'error': rel_error
            })
        
        final_approx = running_sum
    else:  # Taylor
        approx_values = []
        for n in range(num_terms + 1):
            approx = func['taylor'](x, a, n)
            approx_values.append(approx)
            rel_error = abs((exact_value - approx) / exact_value) * 100 if exact_value != 0 else 0
            
            term = approx if n == 0 else approx - approx_values[n-1]
            terms_data.append({
                'n': n,
                'term': term,
                'sum': approx,
                'error': rel_error
            })
        
        final_approx = approx_values[-1]
    
    abs_error = abs(exact_value - final_approx)
    rel_error = (abs_error / abs(exact_value)) * 100 if exact_value != 0 else 0
    
    # Generar fórmulas
    formula = ""
    if series_type == 'mclaurin':
        formula = f"{func['name']} = "
        for i in range(num_terms + 1):
            if func_name in ['sin', 'cos']:
                power = 2*i+1 if func_name == 'sin' else 2*i
                sign = "+" if i % 2 == 0 else "-"
                formula += ('' if i == 0 else f' {sign} ') + f"x^{power}/{factorial(power)}"
            elif func_name == 'exp':
                formula += ('' if i == 0 else ' + ') + f"x^{i}/{factorial(i)}"
            elif func_name == 'ln':
                sign = "+" if i % 2 == 0 else "-"
                formula += ('' if i == 0 else f' {sign} ') + f"x^{i+1}/{i+1}"
            elif func_name == 'fraction':
                formula += ('' if i == 0 else ' + ') + f"x^{i}"
    else:
        if func_name == 'sin':
            formula = f"sen(x) ≈ sen({a})"
            terms = ["sen", "cos", "-sen", "-cos"]
            for i in range(1, num_terms + 1):
                term = terms[i % 4]
                formula += f" + {term}({a}) × (x-{a})^{i}/{factorial(i)}"
        elif func_name == 'cos':
            formula = f"cos(x) ≈ cos({a})"
            terms = ["cos", "-sin", "-cos", "sin"]
            for i in range(1, num_terms + 1):
                term = terms[i % 4]
                formula += f" + {term}({a}) × (x-{a})^{i}/{factorial(i)}"
        elif func_name == 'exp':
            formula = f"exp(x) ≈ exp({a})"
            for i in range(1, num_terms + 1):
                formula += f" + exp({a}) × (x-{a})^{i}/{factorial(i)}"
        elif func_name == 'ln':
            formula = f"ln(1+x) ≈ ln(1+{a})"
            for i in range(1, num_terms + 1):
                sign = "+" if (i % 2 == 1) else "-"
                formula += f" {sign} (1/(1+{a}))^{i} × (x-{a})^{i}/{i}"
        elif func_name == 'fraction':
            formula = f"1/(1-x) ≈ "
            for i in range(num_terms + 1):
                formula += ('' if i == 0 else ' + ') + f"(1/(1-{a}))^{i+1} × (x-{a})^{i}"
    
    return jsonify({
        'exactValue': exact_value,
        'approxValue': final_approx,
        'absError': abs_error,
        'relError': rel_error,
        'terms': terms_data,
        'formula': formula
    })

# Ruta para probar si el servidor está activo
@app.route('/api/status')
def status():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True)