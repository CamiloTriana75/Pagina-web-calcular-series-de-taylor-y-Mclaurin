document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM completamente cargado");
    
    // Tabs control
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId + '-content').classList.add('active');
        });
    });
    
    // Verificar conexión con el backend
    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            console.log('Backend conectado:', data);
        })
        .catch(error => {
            console.error('Error de conexión con el backend:', error);
            alert('No se pudo conectar con el servidor. Verifique que Flask esté ejecutándose.');
        });

    function setupCalculation(buttonId, functionId, xId, termsId, type) {
        const button = document.getElementById(buttonId);
        if (!button) {
            console.error(`Elemento ${buttonId} no encontrado`);
            return;
        }
        button.addEventListener('click', function() {
            console.log(`Botón ${buttonId} presionado`);
            
            const funcName = document.getElementById(functionId).value;
            const x = parseFloat(document.getElementById(xId).value);
            const numTerms = parseInt(document.getElementById(termsId).value);
            
            console.log("Enviando datos a la API:", { funcName, x, numTerms, type });
            
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) loadingIndicator.style.display = 'block';
            
            fetch('/api/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ function: funcName, x, terms: numTerms, type })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Respuesta recibida del backend:", data);
                displayResults(data, funcName);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al calcular la serie. Verifique la consola para más detalles.');
            })
            .finally(() => {
                if (loadingIndicator) loadingIndicator.style.display = 'none';
            });
        });
    }
    
    setupCalculation('calculate-mclaurin', 'mclaurin-function', 'mclaurin-x', 'mclaurin-terms', 'mclaurin');
    setupCalculation('calculate-taylor', 'taylor-function', 'taylor-x', 'taylor-terms', 'taylor');
    
    function displayResults(data, funcName) {
        document.getElementById('formula-display').textContent = data.formula;
        document.getElementById('exact-value').textContent = data.exactValue.toFixed(8);
        document.getElementById('approx-value').textContent = data.approxValue.toFixed(8);
        document.getElementById('abs-error').textContent = data.absError.toFixed(8);
        document.getElementById('rel-error').textContent = data.relError.toFixed(6) + '%';
    
        const tableBody = document.getElementById('terms-body');
        tableBody.innerHTML = '';
        data.terms.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.n}</td>
                <td>${row.term.toFixed(8)}</td>
                <td>${row.sum.toFixed(8)}</td>
                <td>${row.error.toFixed(6)}%</td>
            `;
            tableBody.appendChild(tr);
        });
    
        // Verificar si las gráficas existen
        const errorCanvas = document.getElementById('error-chart');
        const sumCanvas = document.getElementById('sum-chart');
    
        if (!errorCanvas || !sumCanvas) {
            console.error("No se encontraron los elementos canvas para las gráficas.");
            return;
        }
    
        // Procesar datos para gráficos
        const errorData = data.terms.map(item => ({ n: item.n, error: item.error }));
        const sumData = data.terms.map(item => ({ n: item.n, sum: item.sum }));
    
        if (window.errorChart) window.errorChart.destroy();
        if (window.sumChart) window.sumChart.destroy();
    
        const nValues = errorData.map(d => d.n);
    
        // Gráfica de error relativo
        const errorCtx = errorCanvas.getContext('2d');
        window.errorChart = new Chart(errorCtx, {
            type: 'line',
            data: {
                labels: nValues,
                datasets: [{
                    label: 'Error Relativo (%)',
                    data: errorData.map(d => d.error),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Error Relativo (%)' } },
                    x: { title: { display: true, text: 'Número de términos (n)' } }
                }
            }
        });
    
        // Gráfica de sumatoria
        const sumCtx = sumCanvas.getContext('2d');
        window.sumChart = new Chart(sumCtx, {
            type: 'line',
            data: {
                labels: nValues,
                datasets: [{
                    label: 'Valor de la Serie',
                    data: sumData.map(d => d.sum),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.1
                }, {
                    label: 'Valor Exacto',
                    data: nValues.map(() => data.exactValue),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderDash: [5, 5]
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { title: { display: true, text: 'Valor' } },
                    x: { title: { display: true, text: 'Número de términos (n)' } }
                }
            }
        });
    
        document.getElementById('results-panel').style.display = 'block';
    }
})
