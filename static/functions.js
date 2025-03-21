// Funciones matemáticas y definiciones
const functions = {
    sin: {
        exact: (x) => Math.sin(x),
        term: (x, n) => {
            const sign = n % 2 === 0 ? -1 : 1;
            const factorial = math.factorial(2 * n + 1);
            return sign * Math.pow(x, 2 * n + 1) / factorial;
        },
        taylor: (x, a, n) => {
            const diff = x - a;
            const sinA = Math.sin(a);
            const cosA = Math.cos(a);
            
            if (n === 0) return sinA;
            if (n === 1) return sinA + cosA * diff;
            
            let sign = 1;
            let termA = sinA;
            let termB = cosA;
            let result = termA + termB * diff;
            
            for (let i = 2; i <= n; i++) {
                const temp = sign * termA;
                termA = termB;
                termB = temp;
                sign = -sign;
                result += termB * Math.pow(diff, i) / math.factorial(i);
            }
            
            return result;
        },
        name: "sen(x)",
        formula: (n) => {
            let formula = "sen(x) = ";
            for (let i = 0; i <= n; i++) {
                const power = 2 * i + 1;
                const sign = i % 2 === 0 ? "+" : "-";
                formula += (i === 0 ? "" : " " + sign + " ") + "x^" + power + "/" + math.factorial(power);
            }
            return formula;
        },
        taylorFormula: (a, n) => {
            let formula = `sen(x) ≈ sen(${a})`;
            const terms = ["sen", "cos", "-sen", "-cos"];
            for (let i = 1; i <= n; i++) {
                const term = terms[i % 4];
                formula += ` + ${term}(${a}) × (x-${a})^${i}/${math.factorial(i)}`;
            }
            return formula;
        }
    },
    cos: {
        exact: (x) => Math.cos(x),
        term: (x, n) => {
            const sign = n % 2 === 0 ? 1 : -1;
            const factorial = math.factorial(2 * n);
            return sign * Math.pow(x, 2 * n) / factorial;
        },
        taylor: (x, a, n) => {
            const diff = x - a;
            const cosA = Math.cos(a);
            const sinA = Math.sin(a);
            
            if (n === 0) return cosA;
            if (n === 1) return cosA - sinA * diff;
            
            let sign = 1;
            let termA = cosA;
            let termB = -sinA;
            let result = termA + termB * diff;
            
            for (let i = 2; i <= n; i++) {
                const temp = sign * termA;
                termA = termB;
                termB = temp;
                sign = -sign;
                result += termB * Math.pow(diff, i) / math.factorial(i);
            }
            
            return result;
        },
        name: "cos(x)",
        formula: (n) => {
            let formula = "cos(x) = ";
            for (let i = 0; i <= n; i++) {
                const power = 2 * i;
                const sign = i % 2 === 0 ? "+" : "-";
                formula += (i === 0 ? "" : " " + sign + " ") + "x^" + power + "/" + math.factorial(power);
            }
            return formula;
        },
        taylorFormula: (a, n) => {
            let formula = `cos(x) ≈ cos(${a})`;
            const terms = ["cos", "-sin", "-cos", "sin"];
            for (let i = 1; i <= n; i++) {
                const term = terms[i % 4];
                formula += ` + ${term}(${a}) × (x-${a})^${i}/${math.factorial(i)}`;
            }
            return formula;
        }
    },
    exp: {
        exact: (x) => Math.exp(x),
        term: (x, n) => {
            return Math.pow(x, n) / math.factorial(n);
        },
        taylor: (x, a, n) => {
            const expA = Math.exp(a);
            let result = 0;
            for (let i = 0; i <= n; i++) {
                result += expA * Math.pow(x - a, i) / math.factorial(i);
            }
            return result;
        },
        name: "exp(x)",
        formula: (n) => {
            let formula = "exp(x) = ";
            for (let i = 0; i <= n; i++) {
                formula += (i === 0 ? "" : " + ") + "x^" + i + "/" + math.factorial(i);
            }
            return formula;
        },
        taylorFormula: (a, n) => {
            let formula = `exp(x) ≈ exp(${a})`;
            for (let i = 1; i <= n; i++) {
                formula += ` + exp(${a}) × (x-${a})^${i}/${math.factorial(i)}`;
            }
            return formula;
        }
    },
    ln: {
        exact: (x) => Math.log(1 + x),
        term: (x, n) => {
            const sign = n % 2 === 0 ? -1 : 1;
            return sign * Math.pow(x, n + 1) / (n + 1);
        },
        taylor: (x, a, n) => {
            if (a === 0) return calculateSeries(x, n, functions.ln);
            
            const lnA = Math.log(1 + a);
            const termA = 1 / (1 + a);
            let result = lnA;
            
            for (let i = 1; i <= n; i++) {
                const sign = i % 2 === 0 ? 1 : -1;
                result += sign * Math.pow(termA, i) * Math.pow(x - a, i) / i;
            }
            
            return result;
        },
        name: "ln(1+x)",
        formula: (n) => {
            let formula = "ln(1+x) = ";
            for (let i = 0; i <= n; i++) {
                const sign = i % 2 === 0 ? "+" : "-";
                formula += (i === 0 ? "" : " " + sign + " ") + "x^" + (i + 1) + "/" + (i + 1);
            }
            return formula;
        },
        taylorFormula: (a, n) => {
            let formula = `ln(1+x) ≈ ln(1+${a})`;
            for (let i = 1; i <= n; i++) {
                const sign = (i % 2 === 1) ? "+" : "-";
                formula += ` ${sign} (1/(1+${a}))^${i} × (x-${a})^${i}/${i}`;
            }
            return formula;
        }
    },
    fraction: {
        exact: (x) => 1 / (1 - x),
        term: (x, n) => {
            return Math.pow(x, n);
        },
        taylor: (x, a, n) => {
            if (a === 0) return calculateSeries(x, n, functions.fraction);
            
            const termA = 1 / (1 - a);
            let result = 0;
            
            for (let i = 0; i <= n; i++) {
                result += Math.pow(termA, i + 1) * Math.pow(x - a, i);
            }
            
            return result;
        },
        name: "1/(1-x)",
        formula: (n) => {
            let formula = "1/(1-x) = ";
            for (let i = 0; i <= n; i++) {
                formula += (i === 0 ? "" : " + ") + "x^" + i;
            }
            return formula;
        },
        taylorFormula: (a, n) => {
            let formula = `1/(1-x) ≈ `;
            for (let i = 0; i <= n; i++) {
                formula += (i === 0 ? "" : " + ") + `(1/(1-${a}))^${i+1} × (x-${a})^${i}`;
            }
            return formula;
        }
    }
};

// Función para calcular la serie
function calculateSeries(x, numTerms, funcObj) {
    let sum = 0;
    for (let n = 0; n < numTerms; n++) {
        sum += funcObj.term(x, n);
    }
    return sum;
}