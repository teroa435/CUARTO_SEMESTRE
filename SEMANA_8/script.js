// Script para la Tienda Virtual TEROA

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tienda Virtual TEROA cargada correctamente');
    
    // 1. Botón de alerta personalizada
    const alertButton = document.getElementById('alertButton');
    
    if (alertButton) {
        alertButton.addEventListener('click', function() {
            // Crear un modal personalizado en lugar de un alert simple
            const alertHTML = `
                <div class="modal fade" id="ofertaModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header bg-warning">
                                <h5 class="modal-title"><i class="bi bi-megaphone"></i> Oferta Especial</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <h4 class="text-center">¡Descuento del 30% en productos seleccionados!</h4>
                                <p class="text-center">Solo por hoy, todos los productos de la categoría "Tecnología" tienen un 30% de descuento.</p>
                                <p class="text-center">Usa el código: <strong>TEROA30</strong> al finalizar tu compra.</p>
                                <div class="text-center mt-3">
                                    <i class="bi bi-gift display-4 text-warning"></i>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button type="button" class="btn btn-primary" id="irProductos">Ver Productos</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Agregar el modal al body si no existe
            if (!document.getElementById('ofertaModal')) {
                document.body.insertAdjacentHTML('beforeend', alertHTML);
            }
            
            // Mostrar el modal
            const ofertaModal = new bootstrap.Modal(document.getElementById('ofertaModal'));
            ofertaModal.show();
            
            // Agregar funcionalidad al botón "Ver Productos"
            document.getElementById('irProductos')?.addEventListener('click', function() {
                ofertaModal.hide();
                // Desplazar hacia la sección de productos
                document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
    
    // 2. Validación del formulario de contacto
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (contactForm) {
        // Elementos del formulario
        const nombreInput = document.getElementById('nombre');
        const emailInput = document.getElementById('email');
        const mensajeInput = document.getElementById('mensaje');
        
        // Función para validar email
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        // Función para mostrar errores
        function showError(input, message) {
            input.classList.add('is-invalid');
            const errorElement = document.getElementById(input.id + 'Error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
        }
        
        // Función para limpiar errores
        function clearError(input) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            const errorElement = document.getElementById(input.id + 'Error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
        
        // Validación en tiempo real para el nombre
        nombreInput.addEventListener('input', function() {
            if (nombreInput.value.trim().length >= 2) {
                clearError(nombreInput);
            } else {
                showError(nombreInput, 'El nombre debe tener al menos 2 caracteres');
            }
        });
        
        // Validación en tiempo real para el email
        emailInput.addEventListener('input', function() {
            if (isValidEmail(emailInput.value.trim())) {
                clearError(emailInput);
            } else {
                showError(emailInput, 'Por favor, ingresa un correo electrónico válido');
            }
        });
        
        // Validación en tiempo real para el mensaje
        mensajeInput.addEventListener('input', function() {
            if (mensajeInput.value.trim().length >= 10) {
                clearError(mensajeInput);
            } else {
                showError(mensajeInput, 'El mensaje debe tener al menos 10 caracteres');
            }
        });
        
        // Manejo del envío del formulario
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            let isValid = true;
            
            // Validar nombre
            if (nombreInput.value.trim().length < 2) {
                showError(nombreInput, 'El nombre debe tener al menos 2 caracteres');
                isValid = false;
            }
            
            // Validar email
            if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'Por favor, ingresa un correo electrónico válido');
                isValid = false;
            }
            
            // Validar mensaje
            if (mensajeInput.value.trim().length < 10) {
                showError(mensajeInput, 'El mensaje debe tener al menos 10 caracteres');
                isValid = false;
            }
            
            // Si el formulario es válido
            if (isValid) {
                // Mostrar mensaje de éxito
                successMessage.classList.remove('d-none');
                
                // Aquí normalmente enviarías los datos al servidor
                console.log('Formulario enviado correctamente');
                console.log('Nombre:', nombreInput.value);
                console.log('Email:', emailInput.value);
                console.log('Mensaje:', mensajeInput.value);
                
                // Resetear formulario después de 3 segundos
                setTimeout(function() {
                    contactForm.reset();
                    successMessage.classList.add('d-none');
                    
                    // Remover clases de validación
                    nombreInput.classList.remove('is-valid');
                    emailInput.classList.remove('is-valid');
                    mensajeInput.classList.remove('is-valid');
                }, 3000);
            }
        });
        
        // Manejar el botón de reset
        contactForm.addEventListener('reset', function() {
            // Limpiar errores y estados de validación
            const inputs = [nombreInput, emailInput, mensajeInput];
            inputs.forEach(input => {
                input.classList.remove('is-invalid');
                input.classList.remove('is-valid');
                const errorElement = document.getElementById(input.id + 'Error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            });
            
            // Ocultar mensaje de éxito si está visible
            successMessage.classList.add('d-none');
        });
    }
    
    // 3. Mejora de navegación suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Desplazamiento suave
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar clase activa en navegación
                    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
        });
    });
    
    // 4. Efecto de hover para las filas de la tabla
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
        
        row.addEventListener('click', function() {
            const productName = this.cells[1].textContent;
            alert(`Has seleccionado: ${productName}\nRedirigiendo a la página del producto...`);
            // En una aplicación real, aquí redirigirías a la página del producto
        });
    });
});