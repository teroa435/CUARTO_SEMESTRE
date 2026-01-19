// Array de productos inicial
const productos = [
    {
        id: 1,
        nombre: "Laptop Dell XPS 13",
        precio: 1299.99,
        descripcion: "Laptop ultradelgada con pantalla InfinityEdge y procesador Intel i7."
    },
    {
        id: 2,
        nombre: "Mouse Inalámbrico Logitech MX",
        precio: 79.99,
        descripcion: "Mouse ergonómico con seguimiento preciso y batería de larga duración."
    },
    {
        id: 3,
        nombre: "Teclado Mecánico Corsair",
        precio: 89.99,
        descripcion: "Teclado gaming con switches Cherry MX y retroiluminación RGB personalizable."
    }
];

// Elementos del DOM
const listaProductos = document.getElementById('productosLista');
const formulario = document.getElementById('formProducto');

// Función para renderizar la lista de productos
function renderizarProductos() {
    // Limpiar la lista actual
    listaProductos.innerHTML = '';
    
    // Recorrer el array de productos
    productos.forEach(producto => {
        // Crear elemento li para cada producto
        const itemProducto = document.createElement('li');
        itemProducto.className = 'producto';
        itemProducto.id = `producto-${producto.id}`;
        
        // Crear la plantilla HTML para el producto
        itemProducto.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <p class="descripcion">${producto.descripcion}</p>
        `;
        
        // Agregar el producto a la lista
        listaProductos.appendChild(itemProducto);
    });
}

// Función para agregar un nuevo producto
function agregarProducto(evento) {
    evento.preventDefault(); // Prevenir el envío del formulario
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const descripcion = document.getElementById('descripcion').value;
    
    // Validar que todos los campos estén completos
    if (!nombre || !precio || !descripcion) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    // Validar que el precio sea un número válido
    if (isNaN(precio) || precio <= 0) {
        alert('Por favor, ingresa un precio válido');
        return;
    }
    
    // Crear nuevo objeto producto
    const nuevoProducto = {
        id: productos.length + 1, // ID incremental simple
        nombre: nombre,
        precio: precio,
        descripcion: descripcion
    };
    
    // Agregar el nuevo producto al array
    productos.push(nuevoProducto);
    
    // Renderizar la lista actualizada
    renderizarProductos();
    
    // Limpiar el formulario
    formulario.reset();
    
    // Mostrar mensaje de confirmación
    console.log(`Producto agregado: ${nombre} - $${precio.toFixed(2)}`);
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar los productos iniciales
    renderizarProductos();
    
    // Agregar evento al formulario
    formulario.addEventListener('submit', agregarProducto);
    
    console.log('Aplicación de lista de productos cargada correctamente');
});

// Versión alternativa usando Template Strings más avanzadas (opcional)
function crearPlantillaProducto(producto) {
    return `
        <li class="producto" id="producto-${producto.id}">
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <p class="descripcion">${producto.descripcion}</p>
        </li>
    `;
}

// Función alternativa de renderizado usando map() y join()
function renderizarProductosAlternativo() {
    if (productos.length === 0) {
        listaProductos.innerHTML = '<p>No hay productos disponibles.</p>';
        return;
    }
    
    // Crear HTML usando map() y join()
    const htmlProductos = productos.map(crearPlantillaProducto).join('');
    listaProductos.innerHTML = htmlProductos;
}