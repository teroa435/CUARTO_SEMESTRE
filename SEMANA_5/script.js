document.addEventListener('DOMContentLoaded', function() {
    const imageUrlInput = document.getElementById('image-url');
    const addButton = document.getElementById('add-btn');
    const deleteButton = document.getElementById('delete-btn');
    const clearButton = document.getElementById('clear-btn');
    const gallery = document.getElementById('gallery');
    const imageCountElement = document.getElementById('image-count');
    
    let selectedImage = null;
    let imageCounter = 0;
    
    const defaultImages = [
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1439853949127-fa647821eba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    ];
    
    function initializeGallery() {
        defaultImages.forEach(url => addImageToGallery(url));
        updateImageCount();
    }
    
    function addImageToGallery(imageUrl) {
        if (!imageUrl || imageUrl.trim() === '') {
            showMessage('Por favor, ingresa una URL válida', 'error');
            return;
        }
        
        if (!isValidImageUrl(imageUrl)) {
            showMessage('La URL debe ser de una imagen (jpg, jpeg, png, gif, webp)', 'error');
            return;
        }
        
        imageCounter++;
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        imageContainer.dataset.id = imageCounter;
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Imagen ${imageCounter} de la galería`;
        img.onerror = function() {
            showMessage('Error al cargar la imagen. Verifica la URL', 'error');
            imageContainer.remove();
            updateImageCount();
        };
        
        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        overlay.innerHTML = `<p>Imagen ${imageCounter}</p>`;
        
        const imageNumber = document.createElement('div');
        imageNumber.className = 'image-number';
        imageNumber.textContent = imageCounter;
        
        imageContainer.appendChild(img);
        imageContainer.appendChild(overlay);
        imageContainer.appendChild(imageNumber);
        
        const emptyGallery = gallery.querySelector('.empty-gallery');
        if (emptyGallery) {
            emptyGallery.remove();
        }
        
        gallery.appendChild(imageContainer);
        
        imageContainer.addEventListener('click', function() {
            selectImage(imageContainer);
        });
        
        imageUrlInput.value = '';
        updateImageCount();
        showMessage('Imagen agregada correctamente', 'success');
    }
    
    function isValidImageUrl(url) {
        const imageRegex = /\.(jpg|jpeg|png|gif|webp|bmp)(\?.*)?$/i;
        return imageRegex.test(url);
    }
    
    function selectImage(imageContainer) {
        if (selectedImage === imageContainer) {
            imageContainer.classList.remove('selected');
            selectedImage = null;
            deleteButton.disabled = true;
            return;
        }
        
        if (selectedImage) {
            selectedImage.classList.remove('selected');
        }
        
        imageContainer.classList.add('selected');
        selectedImage = imageContainer;
        deleteButton.disabled = false;
        deleteButton.focus();
    }
    
    function deleteSelectedImage() {
        if (!selectedImage) {
            showMessage('No hay ninguna imagen seleccionada', 'error');
            return;
        }
        
        selectedImage.style.animation = 'fadeOut 0.3s ease-out';
        
        setTimeout(() => {
            selectedImage.remove();
            selectedImage = null;
            deleteButton.disabled = true;
            
            updateImageCount();
            
            if (gallery.children.length === 0) {
                showEmptyGalleryMessage();
            }
            
            showMessage('Imagen eliminada correctamente', 'success');
        }, 300);
    }
    
    function clearGallery() {
        if (gallery.children.length === 0) {
            showMessage('La galería ya está vacía', 'error');
            return;
        }
        
        if (confirm('¿Estás seguro de que quieres eliminar todas las imágenes de la galería?')) {
            const images = gallery.querySelectorAll('.image-container');
            images.forEach((img, index) => {
                setTimeout(() => {
                    img.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => img.remove(), 300);
                }, index * 50);
            });
            
            setTimeout(() => {
                selectedImage = null;
                deleteButton.disabled = true;
                showEmptyGalleryMessage();
                updateImageCount();
                showMessage('Galería limpiada correctamente', 'success');
            }, images.length * 50 + 300);
        }
    }
    
    function showEmptyGalleryMessage() {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-gallery';
        emptyDiv.innerHTML = `
            <i class="fas fa-image"></i>
            <p>La galería está vacía</p>
            <p class="empty-hint">Agrega imágenes usando el campo de arriba</p>
        `;
        gallery.appendChild(emptyDiv);
    }
    
    function updateImageCount() {
        const count = gallery.querySelectorAll('.image-container').length;
        imageCountElement.textContent = count;
    }
    
    function showMessage(message, type) {
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        messageElement.style.position = 'fixed';
        messageElement.style.top = '20px';
        messageElement.style.right = '20px';
        messageElement.style.padding = '15px 25px';
        messageElement.style.borderRadius = '10px';
        messageElement.style.color = 'white';
        messageElement.style.fontWeight = '500';
        messageElement.style.zIndex = '1000';
        messageElement.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        messageElement.style.animation = 'slideIn 0.3s ease-out';
        
        if (type === 'success') {
            messageElement.style.backgroundColor = '#2ecc71';
            messageElement.style.borderLeft = '5px solid #27ae60';
        } else if (type === 'error') {
            messageElement.style.backgroundColor = '#e74c3c';
            messageElement.style.borderLeft = '5px solid #c0392b';
        } else {
            messageElement.style.backgroundColor = '#3498db';
            messageElement.style.borderLeft = '5px solid #2980b9';
        }
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 300);
        }, 3000);
        
        if (!document.querySelector('#message-animations')) {
            const style = document.createElement('style');
            style.id = 'message-animations';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                        transform: scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function handleKeydown(event) {
        if (event.key === 'Enter' && document.activeElement === imageUrlInput) {
            event.preventDefault();
            addButton.click();
        }
        
        if (event.key === 'Delete' && selectedImage) {
            event.preventDefault();
            deleteSelectedImage();
        }
        
        if (event.key === 'Escape' && selectedImage) {
            event.preventDefault();
            selectedImage.classList.remove('selected');
            selectedImage = null;
            deleteButton.disabled = true;
        }
    }
    
    function setupEventListeners() {
        addButton.addEventListener('click', function() {
            addImageToGallery(imageUrlInput.value);
        });
        
        imageUrlInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                addButton.click();
            }
        });
        
        deleteButton.addEventListener('click', deleteSelectedImage);
        clearButton.addEventListener('click', clearGallery);
        document.addEventListener('keydown', handleKeydown);
        
        imageUrlInput.addEventListener('input', function() {
            const url = imageUrlInput.value;
            if (url && isValidImageUrl(url)) {
                imageUrlInput.style.borderColor = '#2ecc71';
                imageUrlInput.style.boxShadow = '0 0 0 3px rgba(46, 204, 113, 0.2)';
            } else if (url && !isValidImageUrl(url)) {
                imageUrlInput.style.borderColor = '#e74c3c';
                imageUrlInput.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.2)';
            } else {
                imageUrlInput.style.borderColor = '#ddd';
                imageUrlInput.style.boxShadow = 'none';
            }
        });
    }
    
    function init() {
        setupEventListeners();
        initializeGallery();
    }
    
    init();
});