# Guía de Implementación del Frontend - CarCol CRUD

## 📋 Información General

**API Base URL:** `https://42h1c3a7f1.execute-api.us-east-1.amazonaws.com/api/v1`

**Tipo:** REST API desplegada en AWS Lambda + API Gateway

**Autenticación:** No requiere (endpoints públicos)

---

## 🚀 Endpoints Disponibles

### 1. Obtener todos los autos
```
GET /car
```
**Respuesta exitosa (200):**
```json
[
  {
    "id": "uuid",
    "modelo": "Tesla Model S",
    "color": "rojo",
    "urlImagen": "https://example.com/imagen.jpg",
    "precio": 89999.99
  }
]
```

### 2. Obtener un auto por ID
```
GET /car/{id}
```
**Parámetros:**
- `id` (path): UUID del auto

**Respuesta exitosa (200):**
```json
{
  "id": "uuid",
  "modelo": "Tesla Model S",
  "color": "rojo",
  "urlImagen": "https://example.com/imagen.jpg",
  "precio": 89999.99
}
```

**Respuesta error (404):**
```json
{
  "error": "Car not found."
}
```

### 3. Crear un auto
```
POST /car
Content-Type: application/json
```
**Body:**
```json
{
  "modelo": "BMW X5",
  "color": "blanco",
  "urlImagen": "https://example.com/bmw.jpg",
  "precio": 65000
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "uuid-generado",
  "modelo": "BMW X5",
  "color": "blanco",
  "urlImagen": "https://example.com/bmw.jpg",
  "precio": 65000
}
```

### 4. Actualizar un auto
```
PUT /car
Content-Type: application/json
```
**Body:**
```json
{
  "id": "uuid-del-auto",
  "modelo": "BMW X5 M",
  "color": "negro",
  "urlImagen": "https://example.com/bmw-m.jpg",
  "precio": 85000
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "uuid-del-auto",
  "modelo": "BMW X5 M",
  "color": "negro",
  "urlImagen": "https://example.com/bmw-m.jpg",
  "precio": 85000
}
```

### 5. Eliminar un auto
```
DELETE /car/{id}
```
**Parámetros:**
- `id` (path): UUID del auto

**Respuesta exitosa (200):**
```json
{
  "id": "uuid-del-auto",
  "modelo": "BMW X5 M",
  "color": "negro",
  "urlImagen": "https://example.com/bmw-m.jpg",
  "precio": 85000
}
```

---

## 💻 Implementación Frontend

### Opción 1: HTML + JavaScript Vanilla

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CarCol - Gestión de Autos</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        h1 {
            text-align: center;
            color: #667eea;
            margin-bottom: 30px;
        }
        
        .form-container {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 30px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }
        
        input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        
        input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .btn {
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s;
            margin-right: 10px;
        }
        
        .btn-primary {
            background: #667eea;
            color: white;
        }
        
        .btn-primary:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #5a6268;
        }
        
        .cars-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
            margin-top: 30px;
        }
        
        .car-card {
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 15px;
            overflow: hidden;
            transition: all 0.3s;
        }
        
        .car-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .car-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background: #f0f0f0;
        }
        
        .car-info {
            padding: 20px;
        }
        
        .car-modelo {
            font-size: 20px;
            font-weight: 700;
            color: #333;
            margin-bottom: 10px;
        }
        
        .car-detail {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            color: #666;
        }
        
        .car-precio {
            font-size: 24px;
            font-weight: 700;
            color: #667eea;
            margin: 15px 0;
        }
        
        .car-actions {
            display: flex;
            gap: 10px;
        }
        
        .btn-edit {
            flex: 1;
            background: #ffc107;
            color: #333;
            padding: 10px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .btn-edit:hover {
            background: #ffb300;
        }
        
        .btn-delete {
            flex: 1;
            background: #dc3545;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .btn-delete:hover {
            background: #c82333;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            color: #667eea;
            font-size: 18px;
        }
        
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #dc3545;
        }
        
        #editId {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚗 CarCol - Gestión de Autos</h1>
        
        <div class="form-container">
            <h2 id="formTitle">Agregar Nuevo Auto</h2>
            <form id="carForm">
                <input type="hidden" id="editId">
                
                <div class="form-group">
                    <label for="modelo">Modelo:</label>
                    <input type="text" id="modelo" required placeholder="Ej: Tesla Model S">
                </div>
                
                <div class="form-group">
                    <label for="color">Color:</label>
                    <input type="text" id="color" required placeholder="Ej: Rojo">
                </div>
                
                <div class="form-group">
                    <label for="urlImagen">URL de la Imagen:</label>
                    <input type="url" id="urlImagen" required placeholder="https://example.com/imagen.jpg">
                </div>
                
                <div class="form-group">
                    <label for="precio">Precio:</label>
                    <input type="number" id="precio" step="0.01" required placeholder="65000">
                </div>
                
                <button type="submit" class="btn btn-primary">Guardar Auto</button>
                <button type="button" class="btn btn-secondary" id="cancelBtn" style="display: none;">Cancelar</button>
            </form>
        </div>
        
        <div id="errorContainer"></div>
        
        <div id="carsContainer">
            <div class="loading">Cargando autos...</div>
        </div>
    </div>

    <script>
        const API_URL = 'https://42h1c3a7f1.execute-api.us-east-1.amazonaws.com/api/v1';
        
        // Función para mostrar errores
        function showError(message) {
            const errorContainer = document.getElementById('errorContainer');
            errorContainer.innerHTML = `<div class="error">${message}</div>`;
            setTimeout(() => {
                errorContainer.innerHTML = '';
            }, 5000);
        }
        
        // Función para cargar todos los autos
        async function loadCars() {
            try {
                const response = await fetch(`${API_URL}/car`);
                if (!response.ok) throw new Error('Error al cargar los autos');
                
                const cars = await response.json();
                displayCars(cars);
            } catch (error) {
                showError('Error al cargar los autos: ' + error.message);
                document.getElementById('carsContainer').innerHTML = 
                    '<div class="loading">Error al cargar los autos</div>';
            }
        }
        
        // Función para mostrar los autos
        function displayCars(cars) {
            const container = document.getElementById('carsContainer');
            
            if (cars.length === 0) {
                container.innerHTML = '<div class="loading">No hay autos registrados</div>';
                return;
            }
            
            container.innerHTML = '<div class="cars-grid">' + 
                cars.map(car => `
                    <div class="car-card">
                        <img src="${car.urlImagen}" alt="${car.modelo}" class="car-image" 
                             onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">
                        <div class="car-info">
                            <div class="car-modelo">${car.modelo}</div>
                            <div class="car-detail">
                                <span>Color:</span>
                                <span>${car.color}</span>
                            </div>
                            <div class="car-precio">$${parseFloat(car.precio).toLocaleString('es-CO', {minimumFractionDigits: 2})}</div>
                            <div class="car-actions">
                                <button class="btn-edit" onclick="editCar('${car.id}')">✏️ Editar</button>
                                <button class="btn-delete" onclick="deleteCar('${car.id}')">🗑️ Eliminar</button>
                            </div>
                        </div>
                    </div>
                `).join('') + 
            '</div>';
        }
        
        // Función para crear/actualizar auto
        document.getElementById('carForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const editId = document.getElementById('editId').value;
            const carData = {
                modelo: document.getElementById('modelo').value,
                color: document.getElementById('color').value,
                urlImagen: document.getElementById('urlImagen').value,
                precio: parseFloat(document.getElementById('precio').value)
            };
            
            try {
                let response;
                
                if (editId) {
                    // Actualizar auto existente
                    carData.id = editId;
                    response = await fetch(`${API_URL}/car`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(carData)
                    });
                } else {
                    // Crear nuevo auto
                    response = await fetch(`${API_URL}/car`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(carData)
                    });
                }
                
                if (!response.ok) throw new Error('Error al guardar el auto');
                
                // Resetear formulario y recargar lista
                document.getElementById('carForm').reset();
                document.getElementById('editId').value = '';
                document.getElementById('formTitle').textContent = 'Agregar Nuevo Auto';
                document.getElementById('cancelBtn').style.display = 'none';
                
                loadCars();
            } catch (error) {
                showError('Error al guardar el auto: ' + error.message);
            }
        });
        
        // Función para editar auto
        async function editCar(id) {
            try {
                const response = await fetch(`${API_URL}/car/${id}`);
                if (!response.ok) throw new Error('Error al obtener el auto');
                
                const car = await response.json();
                
                document.getElementById('editId').value = car.id;
                document.getElementById('modelo').value = car.modelo;
                document.getElementById('color').value = car.color;
                document.getElementById('urlImagen').value = car.urlImagen;
                document.getElementById('precio').value = car.precio;
                
                document.getElementById('formTitle').textContent = 'Editar Auto';
                document.getElementById('cancelBtn').style.display = 'inline-block';
                
                // Scroll al formulario
                document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                showError('Error al cargar el auto para editar: ' + error.message);
            }
        }
        
        // Función para eliminar auto
        async function deleteCar(id) {
            if (!confirm('¿Estás seguro de que deseas eliminar este auto?')) {
                return;
            }
            
            try {
                const response = await fetch(`${API_URL}/car/${id}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) throw new Error('Error al eliminar el auto');
                
                loadCars();
            } catch (error) {
                showError('Error al eliminar el auto: ' + error.message);
            }
        }
        
        // Botón cancelar edición
        document.getElementById('cancelBtn').addEventListener('click', () => {
            document.getElementById('carForm').reset();
            document.getElementById('editId').value = '';
            document.getElementById('formTitle').textContent = 'Agregar Nuevo Auto';
            document.getElementById('cancelBtn').style.display = 'none';
        });
        
        // Cargar autos al iniciar
        loadCars();
    </script>
</body>
</html>
```

---

### Opción 2: Con React

#### Estructura del proyecto
```
car-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── CarForm.jsx
│   │   ├── CarCard.jsx
│   │   └── CarList.jsx
│   ├── services/
│   │   └── carService.js
│   ├── App.jsx
│   └── index.jsx
└── package.json
```

#### `src/services/carService.js`
```javascript
const API_URL = 'https://42h1c3a7f1.execute-api.us-east-1.amazonaws.com/api/v1';

export const carService = {
  // Obtener todos los autos
  async getAllCars() {
    const response = await fetch(`${API_URL}/car`);
    if (!response.ok) throw new Error('Error al obtener los autos');
    return response.json();
  },

  // Obtener un auto por ID
  async getCarById(id) {
    const response = await fetch(`${API_URL}/car/${id}`);
    if (!response.ok) throw new Error('Auto no encontrado');
    return response.json();
  },

  // Crear un nuevo auto
  async createCar(carData) {
    const response = await fetch(`${API_URL}/car`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });
    if (!response.ok) throw new Error('Error al crear el auto');
    return response.json();
  },

  // Actualizar un auto
  async updateCar(carData) {
    const response = await fetch(`${API_URL}/car`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });
    if (!response.ok) throw new Error('Error al actualizar el auto');
    return response.json();
  },

  // Eliminar un auto
  async deleteCar(id) {
    const response = await fetch(`${API_URL}/car/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar el auto');
    return response.json();
  },
};
```

#### `src/App.jsx`
```javascript
import React, { useState, useEffect } from 'react';
import { carService } from './services/carService';
import CarForm from './components/CarForm';
import CarList from './components/CarList';

function App() {
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await carService.getAllCars();
      setCars(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los autos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (carData) => {
    try {
      if (editingCar) {
        await carService.updateCar({ ...carData, id: editingCar.id });
      } else {
        await carService.createCar(carData);
      }
      setEditingCar(null);
      loadCars();
    } catch (err) {
      setError('Error al guardar el auto');
      console.error(err);
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este auto?')) {
      try {
        await carService.deleteCar(id);
        loadCars();
      } catch (err) {
        setError('Error al eliminar el auto');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setEditingCar(null);
  };

  return (
    <div className="App">
      <h1>🚗 CarCol - Gestión de Autos</h1>
      
      {error && <div className="error">{error}</div>}
      
      <CarForm 
        onSave={handleSave} 
        onCancel={handleCancel}
        editingCar={editingCar}
      />
      
      <CarList 
        cars={cars}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
```

---

### Opción 3: Con Vue.js

#### `src/services/carService.js`
```javascript
const API_URL = 'https://42h1c3a7f1.execute-api.us-east-1.amazonaws.com/api/v1';

export default {
  async getAllCars() {
    const response = await fetch(`${API_URL}/car`);
    return response.json();
  },

  async getCarById(id) {
    const response = await fetch(`${API_URL}/car/${id}`);
    return response.json();
  },

  async createCar(carData) {
    const response = await fetch(`${API_URL}/car`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData),
    });
    return response.json();
  },

  async updateCar(carData) {
    const response = await fetch(`${API_URL}/car`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData),
    });
    return response.json();
  },

  async deleteCar(id) {
    const response = await fetch(`${API_URL}/car/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
```

#### `src/App.vue`
```vue
<template>
  <div id="app">
    <h1>🚗 CarCol - Gestión de Autos</h1>
    
    <div v-if="error" class="error">{{ error }}</div>
    
    <CarForm 
      :editing-car="editingCar"
      @save="handleSave"
      @cancel="handleCancel"
    />
    
    <CarList 
      :cars="cars"
      :loading="loading"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<script>
import carService from './services/carService';
import CarForm from './components/CarForm.vue';
import CarList from './components/CarList.vue';

export default {
  name: 'App',
  components: {
    CarForm,
    CarList,
  },
  data() {
    return {
      cars: [],
      editingCar: null,
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.loadCars();
  },
  methods: {
    async loadCars() {
      try {
        this.loading = true;
        this.cars = await carService.getAllCars();
        this.error = null;
      } catch (err) {
        this.error = 'Error al cargar los autos';
      } finally {
        this.loading = false;
      }
    },
    async handleSave(carData) {
      try {
        if (this.editingCar) {
          await carService.updateCar({ ...carData, id: this.editingCar.id });
        } else {
          await carService.createCar(carData);
        }
        this.editingCar = null;
        this.loadCars();
      } catch (err) {
        this.error = 'Error al guardar el auto';
      }
    },
    handleEdit(car) {
      this.editingCar = car;
    },
    async handleDelete(id) {
      if (confirm('¿Estás seguro de eliminar este auto?')) {
        try {
          await carService.deleteCar(id);
          this.loadCars();
        } catch (err) {
          this.error = 'Error al eliminar el auto';
        }
      }
    },
    handleCancel() {
      this.editingCar = null;
    },
  },
};
</script>
```

---

## 📦 Despliegue del Frontend Estático

### Opción 1: GitHub Pages

1. Sube tu archivo HTML a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona la rama y carpeta
4. Tu sitio estará en `https://username.github.io/repo-name`

### Opción 2: Netlify

1. Arrastra tu carpeta con el HTML a [netlify.com/drop](https://app.netlify.com/drop)
2. Obtendrás una URL como `https://random-name.netlify.app`

### Opción 3: Vercel

```bash
npm install -g vercel
vercel deploy
```

### Opción 4: AWS S3 + CloudFront

```bash
# Crear bucket S3
aws s3 mb s3://carcol-frontend

# Configurar como sitio web
aws s3 website s3://carcol-frontend --index-document index.html

# Subir archivos
aws s3 sync ./build s3://carcol-frontend --acl public-read
```

---

## 🎨 Mejoras Sugeridas

1. **Validación de formularios**: Agregar validación client-side más robusta
2. **Confirmaciones visuales**: Toasts o notificaciones para acciones exitosas
3. **Paginación**: Si tienes muchos autos, implementar paginación
4. **Búsqueda y filtros**: Buscar por modelo, filtrar por precio o color
5. **Manejo de imágenes**: Subir imágenes a S3 en lugar de URLs
6. **Responsividad**: El HTML proporcionado ya es responsive, pero puedes mejorar para móviles
7. **Loading states**: Indicadores de carga durante las operaciones
8. **Error boundaries**: Manejo más robusto de errores

---

## 🧪 Pruebas con curl

```bash
# Obtener todos
curl https://42h1c3a7f1.execute-api.us-east-1.amazonaws.com/api/v1/car

# Crear
curl -X POST https://42h1c3a7f1.execute-api.us-east-1.amazonaws.com/api/v1/car \
  -H "Content-Type: application/json" \
  -d '{"modelo":"Ferrari","color":"rojo","urlImagen":"https://example.com/ferrari.jpg","precio":250000}'

# Obtener por ID
curl https://42h1c3a7f1.execute-api.us-east-1.amazonaws.com/api/v1/car/{id}

# Actualizar
curl -X PUT https://42h1c3a7f1.execute-api.us-east-1.amazonaws.com/api/v1/car \
  -H "Content-Type: application/json" \
  -d '{"id":"uuid","modelo":"Ferrari F8","color":"amarillo","urlImagen":"https://example.com/f8.jpg","precio":280000}'

# Eliminar
curl -X DELETE https://42h1c3a7f1.execute-api.us-east-1.amazonaws.com/api/v1/car/{id}
```

---

## 🔐 Consideraciones de Seguridad

⚠️ **Importante**: Tu API actual no tiene autenticación. Para producción considera:

1. **AWS Cognito**: Agregar autenticación de usuarios
2. **API Keys**: Usar API Gateway API Keys
3. **CORS**: Limitar los orígenes permitidos
4. **Rate Limiting**: Limitar requests por IP
5. **Validación**: Validar datos en el backend
6. **HTTPS**: Tu API ya usa HTTPS ✅

---

## 📞 Soporte

Para problemas con la API backend, revisa:
- CloudWatch Logs en AWS
- Serverless Dashboard: https://app.serverless.com/

¡Buena suerte con tu frontend! 🚀
