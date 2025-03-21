// UI Functionality for Taylor/McLaurin Series Calculator

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const menuItems = document.querySelectorAll('.menu-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const htmlRoot = document.documentElement;
    
    // Toggle sidebar
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        
        // On mobile, also handle expanded class
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('expanded');
        }
    });
    
    // Handle tab switching
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            menuItems.forEach(menuItem => menuItem.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}-content`).classList.add('active');
            
            // On mobile, collapse sidebar after selection
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('expanded');
            }
        });
    });
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        const isDarkMode = document.body.parentElement.classList.toggle('dark-mode');
        
        // Update icon
        if (isDarkMode) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        // Save preference to localStorage
        localStorage.setItem('darkMode', isDarkMode);
    });
    
    // Check for saved theme preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.parentElement.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            sidebar.classList.remove('expanded');
        } else {
            sidebar.classList.remove('expanded');
        }
    });
    
    // Initialize UI state based on window size
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
    }
    
    // Modificar los botones de cálculo para mostrar el efecto de carga
    const calculateMcLaurin = document.getElementById('calculate-mclaurin');
    const calculateTaylor = document.getElementById('calculate-taylor');
    
    // Añadir el efecto de carga antes del cálculo
    if (calculateMcLaurin) {
        calculateMcLaurin.addEventListener('click', showLoadingEffect);
    }
    
    if (calculateTaylor) {
        calculateTaylor.addEventListener('click', showLoadingEffect);
    }
    
    function showLoadingEffect() {
        const resultsPanel = document.getElementById('results-panel');
        
        // If results panel exists, show it but don't replace its content
        if (resultsPanel) {
            resultsPanel.style.display = 'block';
            
            // Agregar un elemento de spinner que se eliminará cuando se carguen los resultados
            const loadingSpinner = document.createElement('div');
            loadingSpinner.className = 'spinner';
            loadingSpinner.id = 'loading-spinner';
            
            // Insertar el spinner al inicio del panel de resultados
            resultsPanel.insertBefore(loadingSpinner, resultsPanel.firstChild);
            
            // Eliminar el spinner después de un tiempo (o en respuesta a los eventos de carga)
            setTimeout(() => {
                const spinner = document.getElementById('loading-spinner');
                if (spinner) {
                    spinner.remove();
                }
            }, 800);
        }
    }
});