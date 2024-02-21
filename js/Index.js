// Lista de productos en el carrito
let carrito = [];

// Función para agregar un producto al carrito
function agregarAlCarrito(nombre, precio) {
    const productoExistente = carrito.find(producto => producto.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }

    actualizarCarrito();
}

// Función para actualizar la cantidad de un producto en el carrito
function actualizarCantidad(nombre, nuevaCantidad) {
    const producto = carrito.find(producto => producto.nombre === nombre);

    if (producto) {
        producto.cantidad = nuevaCantidad;
    }

    actualizarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(nombre) {
    carrito = carrito.filter(producto => producto.nombre !== nombre);
    actualizarCarrito();
}

// Función para recalcular el total del carrito
function recalcularTotal() {
    let total = 0;
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });
    return total;
}

// Función para actualizar el contador del carrito en la barra
function actualizarContadorCarrito() {
    const contadorCarrito = document.querySelector('.cart-count');
    contadorCarrito.textContent = carrito.reduce((total, producto) => total + producto.cantidad, 0);
}

// Función para mostrar los productos en el carrito en la tabla
function mostrarCarritoEnTabla() {
    const carritoBody = document.getElementById('carrito-body');
    carritoBody.innerHTML = "";

    carrito.forEach(producto => {
        const newRow = carritoBody.insertRow();
        newRow.insertCell(0).textContent = producto.nombre;
        newRow.insertCell(1).textContent = `$${producto.precio.toFixed(2)}`;

        const quantityCell = newRow.insertCell(2);
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = producto.cantidad;
        quantityInput.min = 1;
        quantityInput.addEventListener('change', () => {
            actualizarCantidad(producto.nombre, parseInt(quantityInput.value));
        });
        quantityCell.appendChild(quantityInput);

        const total = producto.precio * producto.cantidad;
        newRow.insertCell(3).textContent = `$${total.toFixed(2)}`;

        const actionsCell = newRow.insertCell(4);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            eliminarProducto(producto.nombre);
        });
        actionsCell.appendChild(deleteButton);
    });

    // Mostrar el total en el elemento correspondiente
    document.getElementById('total').textContent = `$${recalcularTotal().toFixed(2)}`;
}

// Función para actualizar el carrito y realizar las operaciones necesarias
function actualizarCarrito() {
    actualizarContadorCarrito();
    mostrarCarritoEnTabla();

    // Almacenar el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Evento de clic en el enlace del carrito para redirigir a la página del carrito
document.getElementById('cartLink').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = "Productos.html";
});

// Llamada inicial para cargar el carrito desde localStorage al inicio
window.onload = function() {
    const carritoGuardado = localStorage.getItem('carrito');

    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
};
//BARRA DE BUSQUEDA
// Función para buscar productos por nombre
function buscarProductos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const productosFiltrados = carrito.filter(producto => producto.nombre.toLowerCase().includes(searchTerm));
    carrito = productosFiltrados;
    actualizarCarrito();
}

// Evento para manejar cambios en el campo de búsqueda
document.getElementById('searchInput').addEventListener('input', buscarProductos);
