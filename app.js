// Configuración de la API
const API_URL = 'https://42h1c3a7f1.execute-api.us-east-1.amazonaws.com/api/v1';

// Estado de la aplicación
const state = {
    cars: [],
    editingCarId: null,
    isLoading: false
};

// Elementos del DOM
const elements = {
    carForm: document.getElementById('carForm'),
    carsContainer: document.getElementById('carsContainer'),
    errorContainer: document.getElementById('errorContainer'),
    successContainer: document.getElementById('successContainer'),
    formTitle: document.getElementById('formTitle'),
    cancelBtn: document.getElementById('cancelBtn'),
    submitBtn: document.getElementById('submitBtn'),
    editId: document.getElementById('editId'),
    inputs: {
        modelo: document.getElementById('modelo'),
        color: document.getElementById('color'),
        urlImagen: document.getElementById('urlImagen'),
        precio: document.getElementById('precio')
    }
};

// Utilidades
const utils = {
    showMessage(container, message, type = 'error') {
        const className = type === 'error' ? 'error' : 'success';
        container.innerHTML = `<div class="${className}">${message}</div>`;
        
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    },

    showError(message) {
        this.showMessage(elements.errorContainer, message, 'error');
    },

    showSuccess(message) {
        this.showMessage(elements.successContainer, message, 'success');
    },

    formatPrice(price) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2
        }).format(price);
    },

    validateForm() {
        let isValid = true;
        const errors = {};

        // Validar modelo
        if (elements.inputs.modelo.value.trim().length < 2) {
            errors.modelo = 'El modelo debe tener al menos 2 caracteres';
            isValid = false;
        }

        // Validar color
        if (elements.inputs.color.value.trim().length < 2) {
            errors.color = 'El color debe tener al menos 2 caracteres';
            isValid = false;
        }

        // Validar URL
        try {
            new URL(elements.inputs.urlImagen.value);
        } catch {
            errors.urlImagen = 'Debe ser una URL válida';
            isValid = false;
        }

        // Validar precio
        const precio = parseFloat(elements.inputs.precio.value);
        if (isNaN(precio) || precio <= 0) {
            errors.precio = 'El precio debe ser mayor a 0';
            isValid = false;
        }

        // Mostrar errores
        Object.keys(elements.inputs).forEach(key => {
            const errorElement = document.getElementById(`${key}Error`);
            if (errorElement) {
                errorElement.textContent = errors[key] || '';
            }
        });

        return isValid;
    },

    setLoading(isLoading) {
        state.isLoading = isLoading;
        const btnText = elements.submitBtn.querySelector('.btn-text');
        const btnLoader = elements.submitBtn.querySelector('.btn-loader');
        
        elements.submitBtn.disabled = isLoading;
        btnText.hidden = isLoading;
        btnLoader.hidden = !isLoading;
    },

    resetForm() {
        elements.carForm.reset();
        elements.editId.value = '';
        elements.formTitle.textContent = 'Agregar Nuevo Auto';
        elements.cancelBtn.hidden = true;
        state.editingCarId = null;

        // Limpiar mensajes de error
        Object.keys(elements.inputs).forEach(key => {
            const errorElement = document.getElementById(`${key}Error`);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    }
};

// Servicios de API
const carService = {
    async getAllCars() {
        const response = await fetch(`${API_URL}/car`);
        if (!response.ok) {
            throw new Error('Error al obtener los autos');
        }
        return response.json();
    },

    async getCarById(id) {
        const response = await fetch(`${API_URL}/car/${id}`);
        if (!response.ok) {
            throw new Error('Auto no encontrado');
        }
        return response.json();
    },

    async createCar(carData) {
        const response = await fetch(`${API_URL}/car`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carData)
        });
        if (!response.ok) {
            throw new Error('Error al crear el auto');
        }
        return response.json();
    },

    async updateCar(carData) {
        const response = await fetch(`${API_URL}/car`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carData)
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el auto');
        }
        return response.json();
    },

    async deleteCar(id) {
        const response = await fetch(`${API_URL}/car/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el auto');
        }
        return response.json();
    }
};

// Funciones de UI
const ui = {
    renderCars(cars) {
        if (cars.length === 0) {
            elements.carsContainer.innerHTML = `
                <div class="loading">
                    <p>No hay autos registrados</p>
                </div>
            `;
            return;
        }

        const carsHTML = cars.map(car => `
            <article class="car-card">
                <img 
                    src="${car.urlImagen}" 
                    alt="${car.modelo}" 
                    class="car-image"
                    onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'"
                    loading="lazy"
                >
                <div class="car-info">
                    <h3 class="car-modelo">${car.modelo}</h3>
                    <div class="car-detail">
                        <span>Color:</span>
                        <strong>${car.color}</strong>
                    </div>
                    <div class="car-precio">${utils.formatPrice(car.precio)}</div>
                    <div class="car-actions">
                        <button 
                            class="btn-edit" 
                            onclick="app.editCar('${car.id}')"
                            aria-label="Editar ${car.modelo}"
                        >
                            ✏️ Editar
                        </button>
                        <button 
                            class="btn-delete" 
                            onclick="app.deleteCar('${car.id}')"
                            aria-label="Eliminar ${car.modelo}"
                        >
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            </article>
        `).join('');

        elements.carsContainer.innerHTML = `<div class="cars-grid">${carsHTML}</div>`;
    },

    showLoading() {
        elements.carsContainer.innerHTML = `
            <div class="loading" role="status" aria-live="polite">
                <div class="spinner"></div>
                <p>Cargando autos...</p>
            </div>
        `;
    }
};

// Aplicación principal
const app = {
    async init() {
        this.setupEventListeners();
        await this.loadCars();
    },

    setupEventListeners() {
        // Envío de formulario
        elements.carForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });

        // Botón cancelar
        elements.cancelBtn.addEventListener('click', () => {
            utils.resetForm();
        });

        // Validación en tiempo real
        Object.values(elements.inputs).forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim()) {
                    utils.validateForm();
                }
            });
        });
    },

    async loadCars() {
        try {
            ui.showLoading();
            state.cars = await carService.getAllCars();
            ui.renderCars(state.cars);
        } catch (error) {
            utils.showError('Error al cargar los autos: ' + error.message);
            elements.carsContainer.innerHTML = `
                <div class="loading">
                    <p>Error al cargar los autos</p>
                </div>
            `;
        }
    },

    async handleSubmit() {
        if (!utils.validateForm()) {
            utils.showError('Por favor, corrige los errores en el formulario');
            return;
        }

        const carData = {
            modelo: elements.inputs.modelo.value.trim(),
            color: elements.inputs.color.value.trim(),
            urlImagen: elements.inputs.urlImagen.value.trim(),
            precio: parseFloat(elements.inputs.precio.value)
        };

        try {
            utils.setLoading(true);

            if (state.editingCarId) {
                carData.id = state.editingCarId;
                await carService.updateCar(carData);
                utils.showSuccess('Auto actualizado exitosamente');
            } else {
                await carService.createCar(carData);
                utils.showSuccess('Auto creado exitosamente');
            }

            utils.resetForm();
            await this.loadCars();
        } catch (error) {
            utils.showError('Error al guardar el auto: ' + error.message);
        } finally {
            utils.setLoading(false);
        }
    },

    async editCar(id) {
        try {
            const car = await carService.getCarById(id);
            
            state.editingCarId = id;
            elements.inputs.modelo.value = car.modelo;
            elements.inputs.color.value = car.color;
            elements.inputs.urlImagen.value = car.urlImagen;
            elements.inputs.precio.value = car.precio;
            
            elements.formTitle.textContent = 'Editar Auto';
            elements.cancelBtn.hidden = false;
            
            // Scroll suave al formulario
            elements.carForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            elements.inputs.modelo.focus();
        } catch (error) {
            utils.showError('Error al cargar el auto: ' + error.message);
        }
    },

    async deleteCar(id) {
        if (!confirm('¿Estás seguro de que deseas eliminar este auto?')) {
            return;
        }

        try {
            await carService.deleteCar(id);
            utils.showSuccess('Auto eliminado exitosamente');
            await this.loadCars();
        } catch (error) {
            utils.showError('Error al eliminar el auto: ' + error.message);
        }
    }
};

// Exponer funciones globales necesarias
window.app = app;

// Inicializar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
