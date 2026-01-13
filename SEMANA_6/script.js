// script.js - CÓDIGO COMPLETO Y CORREGIDO
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const form = document.getElementById('registrationForm');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const edadInput = document.getElementById('edad');
    const submitButton = document.getElementById('submitButton');
    const resetButton = document.getElementById('resetButton');
    const successModal = document.getElementById('successModal');
    const closeModalButton = document.getElementById('closeModal');
    const floatingNotification = document.getElementById('floatingNotification');
    
    // Elementos de contraseña
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const ageHelp = document.getElementById('ageHelp');
    const ageTooltip = document.getElementById('ageTooltip');
    
    // Estado de validación
    const validationState = {
        nombre: false,
        email: false,
        password: false,
        confirmPassword: false,
        edad: false
    };
    
    // Expresión regular para email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Inicialización
    initForm();
    
    function initForm() {
        // Configurar event listeners
        setupEventListeners();
        
        // Validación inicial
        validateAllFields();
        
        // Actualizar progreso
        updateProgress();
    }
    
    function setupEventListeners() {
        // Validación en tiempo real
        nombreInput.addEventListener('input', () => {
            validateNombre();
            updateProgress();
        });
        
        emailInput.addEventListener('input', () => {
            validateEmail();
            updateProgress();
        });
        
        passwordInput.addEventListener('input', () => {
            validatePassword();
            updatePasswordStrength();
            updateProgress();
        });
        
        confirmPasswordInput.addEventListener('input', () => {
            validateConfirmPassword();
            updateProgress();
        });
        
        edadInput.addEventListener('input', () => {
            validateEdad();
            updateProgress();
        });
        
        // Mostrar/ocultar contraseña
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.innerHTML = type === 'password' ? 
                '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
        
        toggleConfirmPassword.addEventListener('click', () => {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            toggleConfirmPassword.innerHTML = type === 'password' ? 
                '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
        
        // Tooltip de ayuda para edad
        ageHelp.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = ageHelp.getBoundingClientRect();
            ageTooltip.style.display = 'block';
            ageTooltip.style.left = (rect.left + window.scrollX - 280) + 'px';
            ageTooltip.style.top = (rect.top + window.scrollY + 40) + 'px';
        });
        
        // Cerrar tooltip al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (ageTooltip.style.display === 'block' && 
                !ageTooltip.contains(e.target) && 
                e.target !== ageHelp) {
                ageTooltip.style.display = 'none';
            }
        });
        
        // Botón de reinicio
        resetButton.addEventListener('click', resetForm);
        
        // Envío del formulario
        form.addEventListener('submit', handleSubmit);
        
        // Cerrar modal
        closeModalButton.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
        
        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.style.display = 'none';
            }
        });
    }
    
    function validateNombre() {
        const value = nombreInput.value.trim();
        const isValid = value.length >= 3;
        
        // Actualizar contador de caracteres
        const counter = document.getElementById('nombre-counter');
        counter.textContent = `${value.length}/3`;
        counter.style.color = isValid ? 'var(--success-color)' : 'var(--danger-color)';
        
        // Actualizar apariencia
        updateFieldAppearance(nombreInput, isValid);
        
        // Mostrar/ocultar mensaje de error
        document.getElementById('nombre-error').style.display = isValid ? 'none' : 'flex';
        
        // Actualizar estado
        validationState.nombre = isValid;
        
        // Actualizar resumen
        updateSummary('nombre', isValid);
        
        // Verificar si se puede enviar el formulario
        checkFormValidity();
        
        return isValid;
    }
    
    function validateEmail() {
        const value = emailInput.value.trim();
        const isValid = emailRegex.test(value);
        
        // Actualizar apariencia
        updateFieldAppearance(emailInput, isValid);
        
        // Mostrar/ocultar mensaje de error
        document.getElementById('email-error').style.display = isValid ? 'none' : 'flex';
        
        // Actualizar estado
        validationState.email = isValid;
        
        // Actualizar resumen
        updateSummary('email', isValid);
        
        // Verificar si se puede enviar el formulario
        checkFormValidity();
        
        return isValid;
    }
    
    function validatePassword() {
        const value = passwordInput.value;
        
        // Verificar requisitos individuales
        const hasLength = value.length >= 8;
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
        const hasUppercase = /[A-Z]/.test(value);
        
        // La contraseña es válida si cumple todos los requisitos
        // CORRECCIÓN: Ahora solo requiere 8 caracteres, un número y un carácter especial
        // No requiere mayúscula obligatoriamente (esto era el problema)
        const isValid = hasLength && hasNumber && hasSpecial;
        
        // Actualizar apariencia
        updateFieldAppearance(passwordInput, isValid);
        
        // Mostrar/ocultar mensaje de error
        document.getElementById('password-error').style.display = isValid ? 'none' : 'flex';
        
        // Actualizar indicadores de requisitos
        updateRequirementIndicators(hasLength, hasNumber, hasSpecial, hasUppercase);
        
        // Actualizar estado
        validationState.password = isValid;
        
        // Actualizar resumen
        updateSummary('password', isValid);
        
        // Si hay confirmación, validarla también
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
        
        // Verificar si se puede enviar el formulario
        checkFormValidity();
        
        return isValid;
    }
    
    function updatePasswordStrength() {
        const value = passwordInput.value;
        let strength = 0;
        
        // Calcular fortaleza
        if (value.length >= 8) strength += 25;
        if (/\d/.test(value)) strength += 25;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) strength += 25;
        if (/[A-Z]/.test(value)) strength += 25;
        
        // Actualizar barra de fortaleza
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');
        
        if (strengthFill && strengthText) {
            strengthFill.style.width = `${strength}%`;
            
            if (strength <= 25) {
                strengthFill.style.backgroundColor = 'var(--danger-color)';
                strengthText.textContent = 'Muy débil';
                strengthText.style.color = 'var(--danger-color)';
            } else if (strength <= 50) {
                strengthFill.style.backgroundColor = '#e67e22';
                strengthText.textContent = 'Débil';
                strengthText.style.color = '#e67e22';
            } else if (strength <= 75) {
                strengthFill.style.backgroundColor = 'var(--warning-color)';
                strengthText.textContent = 'Media';
                strengthText.style.color = 'var(--warning-color)';
            } else {
                strengthFill.style.backgroundColor = 'var(--success-color)';
                strengthText.textContent = 'Fuerte';
                strengthText.style.color = 'var(--success-color)';
            }
        }
    }
    
    function updateRequirementIndicators(hasLength, hasNumber, hasSpecial, hasUppercase) {
        // Actualizar cada requisito visualmente
        const lengthReq = document.getElementById('length-req');
        const numberReq = document.getElementById('number-req');
        const specialReq = document.getElementById('special-req');
        const letterReq = document.getElementById('letter-req');
        
        if (lengthReq) {
            lengthReq.className = hasLength ? 'requirement met' : 'requirement unmet';
            lengthReq.querySelector('i').className = hasLength ? 'fas fa-check-circle' : 'fas fa-times-circle';
        }
        
        if (numberReq) {
            numberReq.className = hasNumber ? 'requirement met' : 'requirement unmet';
            numberReq.querySelector('i').className = hasNumber ? 'fas fa-check-circle' : 'fas fa-times-circle';
        }
        
        if (specialReq) {
            specialReq.className = hasSpecial ? 'requirement met' : 'requirement unmet';
            specialReq.querySelector('i').className = hasSpecial ? 'fas fa-check-circle' : 'fas fa-times-circle';
        }
        
        if (letterReq) {
            letterReq.className = hasUppercase ? 'requirement met' : 'requirement unmet';
            letterReq.querySelector('i').className = hasUppercase ? 'fas fa-check-circle' : 'fas fa-times-circle';
        }
    }
    
    function validateConfirmPassword() {
        const value = confirmPasswordInput.value;
        const passwordValue = passwordInput.value;
        const isValid = value === passwordValue && value !== '';
        
        // Actualizar apariencia
        updateFieldAppearance(confirmPasswordInput, isValid);
        
        // Mostrar/ocultar mensaje de error
        document.getElementById('confirmPassword-error').style.display = isValid ? 'none' : 'flex';
        
        // Actualizar indicador de coincidencia
        const matchIndicator = document.getElementById('match-indicator');
        if (matchIndicator) {
            if (value === '') {
                matchIndicator.style.opacity = '0';
            } else {
                matchIndicator.style.opacity = '1';
                matchIndicator.className = isValid ? 'match-indicator show match' : 'match-indicator show';
                matchIndicator.innerHTML = isValid ? 
                    '<i class="fas fa-check"></i> Las contraseñas coinciden' : 
                    '<i class="fas fa-times"></i> Las contraseñas no coinciden';
            }
        }
        
        // Actualizar estado
        validationState.confirmPassword = isValid;
        
        // Actualizar resumen
        updateSummary('confirm', isValid);
        
        // Verificar si se puede enviar el formulario
        checkFormValidity();
        
        return isValid;
    }
    
    function validateEdad() {
        const value = parseInt(edadInput.value);
        const isValid = !isNaN(value) && value >= 18 && value <= 120;
        
        // Actualizar apariencia
        updateFieldAppearance(edadInput, isValid);
        
        // Mostrar/ocultar mensaje de error
        document.getElementById('edad-error').style.display = isValid ? 'none' : 'flex';
        
        // Actualizar estado
        validationState.edad = isValid;
        
        // Actualizar resumen
        updateSummary('edad', isValid);
        
        // Verificar si se puede enviar el formulario
        checkFormValidity();
        
        return isValid;
    }
    
    function updateFieldAppearance(field, isValid) {
        field.classList.remove('valid', 'invalid');
        if (field.value === '') {
            return;
        }
        field.classList.add(isValid ? 'valid' : 'invalid');
    }
    
    function updateSummary(field, isValid) {
        const summaryItem = document.getElementById(`summary-${field}`);
        if (summaryItem) {
            summaryItem.className = isValid ? 'summary-item valid' : 'summary-item invalid';
            summaryItem.querySelector('i').className = isValid ? 'fas fa-check' : 'fas fa-times';
        }
    }
    
    function checkFormValidity() {
        const allValid = Object.values(validationState).every(state => state === true);
        const termsAccepted = document.getElementById('terms') ? document.getElementById('terms').checked : true;
        
        // Habilitar o deshabilitar el botón de envío
        submitButton.disabled = !(allValid && termsAccepted);
        
        // Mostrar notificación flotante si todo es válido
        if (allValid && termsAccepted) {
            floatingNotification.classList.add('show');
        } else {
            floatingNotification.classList.remove('show');
        }
        
        return allValid && termsAccepted;
    }
    
    function updateProgress() {
        const totalFields = 5;
        const validFields = Object.values(validationState).filter(state => state).length;
        const progressPercentage = Math.round((validFields / totalFields) * 100);
        
        // Actualizar barra de progreso
        const progressBar = document.querySelector('.progress-bar::after');
        if (progressBar) {
            document.querySelector('.progress-bar').style.setProperty('--progress', `${progressPercentage}%`);
        }
        
        // Actualizar texto de progreso
        const progressText = document.getElementById('progressText');
        if (progressText) {
            progressText.textContent = `${progressPercentage}%`;
        }
    }
    
    function validateAllFields() {
        validateNombre();
        validateEmail();
        validatePassword();
        validateConfirmPassword();
        validateEdad();
        updateProgress();
    }
    
    function resetForm() {
        // Resetear formulario
        form.reset();
        
        // Resetear clases de validación
        const inputs = [nombreInput, emailInput, passwordInput, confirmPasswordInput, edadInput];
        inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
        
        // Resetear mensajes de error
        document.querySelectorAll('.validation-message').forEach(msg => {
            msg.style.display = 'none';
        });
        
        // Resetear indicadores de contraseña
        const requirements = ['length-req', 'number-req', 'special-req', 'letter-req'];
        requirements.forEach(reqId => {
            const req = document.getElementById(reqId);
            if (req) {
                req.className = 'requirement unmet';
                req.querySelector('i').className = 'fas fa-circle';
            }
        });
        
        // Resetear barra de fortaleza
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');
        if (strengthFill) strengthFill.style.width = '0%';
        if (strengthText) {
            strengthText.textContent = 'Débil';
            strengthText.style.color = 'var(--danger-color)';
        }
        
        // Resetear indicador de coincidencia
        const matchIndicator = document.getElementById('match-indicator');
        if (matchIndicator) {
            matchIndicator.style.opacity = '0';
            matchIndicator.className = 'match-indicator';
        }
        
        // Resetear contador de nombre
        const counter = document.getElementById('nombre-counter');
        if (counter) {
            counter.textContent = '0/3';
            counter.style.color = 'var(--gray-color)';
        }
        
        // Resetear estado
        Object.keys(validationState).forEach(key => {
            validationState[key] = false;
        });
        
        // Resetear resumen
        const summaryItems = ['nombre', 'email', 'password', 'confirm', 'edad'];
        summaryItems.forEach(item => {
            const summaryItem = document.getElementById(`summary-${item}`);
            if (summaryItem) {
                summaryItem.className = 'summary-item invalid';
                summaryItem.querySelector('i').className = 'fas fa-times';
            }
        });
        
        // Deshabilitar botón de envío
        submitButton.disabled = true;
        
        // Ocultar notificación flotante
        floatingNotification.classList.remove('show');
        
        // Actualizar progreso
        updateProgress();
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        
        // Validar todos los campos
        validateAllFields();
        
        // Verificar si el formulario es válido
        if (checkFormValidity()) {
            // Mostrar loader
            submitButton.querySelector('.btn-text').style.display = 'none';
            submitButton.querySelector('.btn-loader').style.display = 'inline-block';
            
            // Simular envío al servidor
            setTimeout(() => {
                // Ocultar loader
                submitButton.querySelector('.btn-text').style.display = 'inline-block';
                submitButton.querySelector('.btn-loader').style.display = 'none';
                
                // Mostrar modal de éxito
                showSuccessModal();
            }, 1000);
        }
    }
    
    function showSuccessModal() {
        // Llenar datos en el modal
        document.getElementById('modal-nombre').textContent = nombreInput.value;
        document.getElementById('modal-email').textContent = emailInput.value;
        document.getElementById('modal-edad').textContent = `${edadInput.value} años`;
        
        // Mostrar modal
        successModal.style.display = 'flex';
    }
});