# 🚗 CarCol - Sistema de Gestión de Autos

Sistema web moderno de gestión de inventario de automóviles, desarrollado con JavaScript Vanilla, HTML5 y CSS3. Permite crear, leer, actualizar y eliminar (CRUD) información de vehículos mediante integración con API REST.

## 📋 Tabla de Contenidos

- Características
- Tecnologías
- Estructura del Proyecto
- Instalación
- Uso
- API
- Funcionalidades Detalladas
- Capturas de Pantalla
- Desarrollo
- Arquitectura del Código
- Accesibilidad
- Responsive Design
- Licencia

## ✨ Características

- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar autos
- 🎨 **Diseño Moderno**: Interfaz atractiva con gradientes y animaciones
- 📱 **Totalmente Responsive**: Funciona en dispositivos móviles, tablets y desktop
- ⚡ **Validación en Tiempo Real**: Retroalimentación instantánea en formularios
- 🔄 **Actualización Dinámica**: Sin recargas de página
- 🌙 **Soporte Modo Oscuro**: Se adapta a las preferencias del sistema
- ♿ **Accesible**: Cumple con estándares ARIA y WAI
- 💰 **Formato de Moneda**: Precios formateados en pesos colombianos (COP)
- 🖼️ **Lazy Loading**: Carga de imágenes optimizada
- ⚠️ **Manejo de Errores**: Mensajes claros y útiles
- 🎯 **UX Mejorada**: Confirmaciones, estados de carga y feedback visual

## 🛠 Tecnologías

- **Frontend**: 
  - HTML5 semántico
  - CSS3 (Variables CSS, Flexbox, Grid, Animaciones)
  - JavaScript ES6+ (Vanilla JS, Async/Await, Fetch API)
  
- **API**: 
  - REST API en AWS Lambda
  - Endpoint: `https://42h1c3a7f1.execute-api.us-east-1.amazonaws.com/api/v1`

- **Herramientas**:
  - Sin dependencias externas (No frameworks)
  - Compatible con todos los navegadores modernos

## 📁 Estructura del Proyecto

```
front-estatico-carros/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS con variables y diseño responsive
├── app.js             # Lógica de la aplicación
└── README.md          # Documentación del proyecto
```

## 🚀 Instalación

### Opción 1: Uso Directo

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/front-estatico-carros.git
cd front-estatico-carros
```

2. Abre el archivo index.html en tu navegador:
```bash
# En Linux/Mac
"$BROWSER" index.html

# O simplemente abre el archivo con doble clic
```

### Opción 2: Servidor Local

Para evitar problemas con CORS, puedes usar un servidor local:

```bash
# Con Python 3
python3 -m http.server 8000

# Con Node.js (npx)
npx serve

# Con PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

## 💻 Uso

### Agregar un Nuevo Auto

1. Completa el formulario con los datos del auto:
   - **Modelo**: Nombre del vehículo (mín. 2 caracteres)
   - **Color**: Color del auto (mín. 2 caracteres)
   - **URL de Imagen**: Enlace a imagen del vehículo (URL válida)
   - **Precio**: Precio en COP (debe ser mayor a 0)

2. Haz clic en **"Guardar Auto"**

3. El auto aparecerá en el catálogo automáticamente

### Editar un Auto

1. Haz clic en el botón **"✏️ Editar"** en la tarjeta del auto
2. El formulario se llenará con los datos actuales
3. Modifica los campos necesarios
4. Haz clic en **"Guardar Auto"**
5. Puedes cancelar la edición con el botón **"Cancelar"**

### Eliminar un Auto

1. Haz clic en el botón **"🗑️ Eliminar"** en la tarjeta del auto
2. Confirma la eliminación en el diálogo
3. El auto se eliminará del catálogo

## 🌐 API

### Endpoints Disponibles

El sistema se conecta a la siguiente API REST:

**Base URL**: `https://42h1c3a7f1.execute-api.us-east-1.amazonaws.com/api/v1`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/car` | Obtiene todos los autos |
| GET | `/car/:id` | Obtiene un auto específico |
| POST | `/car` | Crea un nuevo auto |
| PUT | `/car` | Actualiza un auto existente |
| DELETE | `/car/:id` | Elimina un auto |

### Ejemplo de Objeto Auto

```json
{
  "id": "uuid-v4",
  "modelo": "Tesla Model S",
  "color": "Rojo",
  "urlImagen": "https://example.com/tesla.jpg",
  "precio": 85000000
}
```

## 🎯 Funcionalidades Detalladas

### Validación de Formularios

El sistema incluye validación robusta en app.js:

- **Modelo**: Mínimo 2 caracteres, máximo 100
- **Color**: Mínimo 2 caracteres, máximo 50
- **URL**: Debe ser una URL válida (protocolo http/https)
- **Precio**: Número positivo mayor a 0

```javascript
// Validación en tiempo real
Object.values(elements.inputs).forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim()) {
            utils.validateForm();
        }
    });
});
```

### Formato de Precios

Los precios se formatean automáticamente en pesos colombianos usando la función `utils.formatPrice`:

```javascript
formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 2
    }).format(price);
}
// Ejemplo: 85000000 → "$85.000.000,00"
```



## 🔧 Desarrollo

### Arquitectura del Código

El archivo app.js está organizado en módulos:

```javascript
// Estado de la aplicación
const state = {
    cars: [],
    editingCarId: null,
    isLoading: false
};

// Referencias DOM
const elements = { /* ... */ };

// Utilidades generales
const utils = { /* ... */ };

// Servicios de API
const carService = { /* ... */ };

// Funciones de UI
const ui = { /* ... */ };

// Aplicación principal
const app = { /* ... */ };
```

### Estilos CSS

El archivo styles.css utiliza:

- **Variables CSS** para personalización fácil
- **Grid Layout** para el catálogo de autos
- **Flexbox** para componentes internos
- **Transiciones suaves** para mejor UX
- **Media Queries** para responsive design

```css
:root {
    --primary-color: #667eea;
    --primary-dark: #5568d3;
    --border-radius: 8px;
    --transition: all 0.3s ease;
}
```

### Añadir Nuevas Funcionalidades

1. **Agregar un nuevo servicio API**:
   - Añade el método en el objeto `carService`
   - Implementa el manejo de errores

2. **Agregar validaciones**:
   - Modifica la función `utils.validateForm`
   - Actualiza los mensajes de error

3. **Modificar estilos**:
   - Cambia las variables CSS en `:root`
   - Ajusta los breakpoints en media queries

## ♿ Accesibilidad

El proyecto implementa las siguientes características de accesibilidad:

- ✅ Roles ARIA (`role="alert"`, `role="status"`)
- ✅ Atributos ARIA (`aria-live`, `aria-label`, `aria-required`)
- ✅ Etiquetas semánticas HTML5 (`<main>`, `<section>`, `<article>`)
- ✅ Focus visible personalizado
- ✅ Navegación por teclado
- ✅ Textos alternativos en imágenes
- ✅ Mensajes de error descriptivos

## 📱 Responsive Design

### Breakpoints

- **Desktop**: > 768px (Grid de múltiples columnas)
- **Mobile**: ≤ 768px (Grid de una columna)

### Características Responsive

```css
@media (max-width: 768px) {
    .cars-grid {
        grid-template-columns: 1fr;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
    }
}
```

## 🐛 Solución de Problemas

### Errores Comunes

1. **No se cargan los autos**:
   - Verifica la conexión a internet
   - Revisa la consola del navegador (F12)
   - Confirma que la API esté disponible

2. **Error de CORS**:
   - Usa un servidor local (ver Instalación)
   - No abras el HTML directamente desde el disco

3. **Imágenes no se muestran**:
   - Verifica que la URL sea válida y accesible
   - La aplicación muestra un placeholder si falla la carga

