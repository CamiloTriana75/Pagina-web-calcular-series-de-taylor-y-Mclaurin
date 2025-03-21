# README - Sistema de Cálculo de Series de Taylor y McLaurin

## **Descripción del Proyecto**

Este proyecto es un sistema desarrollado en **Python** utilizando **Flask** que permite calcular aproximaciones de funciones matemáticas mediante
**series de Taylor y McLaurin**. Proporciona una API que interactúa con un frontend basado en **HTML, CSS y JavaScript**, permitiendo a los usuarios 
ingresar datos y visualizar los cálculos.

## **Tecnologías Utilizadas**

- **Backend:** Python 3, Flask
- **Frontend:** HTML, CSS, JavaScript
- **Bibliotecas:** NumPy, Math, Functools
- **Servidor Web:** Flask

## **Estructura del Proyecto**

```
/Proyecto
│── /static
│   ├── index.html    # Página principal
│   ├── styles.css    # Estilos del frontend
│   ├── app.js        # Lógica del frontend
│   ├── functions.js  # Funciones matemáticas en JavaScript
│   ├── ui.js         # Manejo de interfaz de usuario
│── app.py            # Servidor backend en Flask
│── README.md         # Documentación del proyecto
```

## **Instalación y Configuración**

### **Requisitos Previos**

- Tener instalado **Python 3** y **pip**.
- Instalar las dependencias necesarias:
  ```bash
  pip install flask numpy
  ```

### **Ejecución del Servidor**

Para iniciar el servidor Flask, ejecutar:

```bash
python app.py
```

Por defecto, el servidor se ejecutará en `http://127.0.0.1:5000/`.

## **Endpoints de la API**

| Método | Endpoint         | Descripción                                           |
| ------ | ---------------- | ----------------------------------------------------- |
| GET    | `/`              | Devuelve la página principal.                         |
| POST   | `/api/calculate` | Calcula la serie de Taylor o McLaurin.                |
| GET    | `/api/status`    | Devuelve `{status: 'ok'}` para verificar la conexión. |

### **Ejemplo de Petición**

```json
{
    "function": "sin",
    "x": 0.5,
    "terms": 10,
    "type": "mclaurin",
    "a": 0
}
```

### **Ejemplo de Respuesta**

```json
{
    "exactValue": 0.4794255386,
    "approxValue": 0.4794252360,
    "absError": 0.0000003026,
    "relError": 0.00006,
    "terms": [...],
    "formula": "sen(x) = x - x^3/3! + x^5/5! - ..."
}
```

## **Explicación del Código**

### **1. Backend**

- Se define la API con Flask.
- Se crean las funciones para calcular series matemáticas.
- Se manejan rutas para interactuar con el frontend.

### **2. Frontend**

- `index.html`: Contiene la interfaz gráfica.
- `app.js`: Maneja la comunicación con el backend.
- `functions.js`: Define cálculos en el frontend.
- `ui.js`: Controla la interacción del usuario.

## **Conclusión**

Este proyecto permite a los usuarios realizar cálculos matemáticos avanzados de manera interactiva. Se puede expandir para agregar más funciones
o mejorar la visualización de resultados.
