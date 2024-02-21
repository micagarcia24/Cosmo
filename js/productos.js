// Lista de productos en el carrito
let carrito = [];

// Función para agregar un producto al carrito
function agregarAlCarrito(nombre, precio) {
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(producto => producto.nombre === nombre);

    // Si el producto ya está en el carrito, actualizar la cantidad y el total
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        // Si el producto no está en el carrito, agregar un nuevo objeto al carrito
        carrito.push({ nombre, precio, cantidad: 1 });
    }

    // Actualizar el contador del carrito en la barra
    actualizarContadorCarrito();

    // Almacenar el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Agregar el producto a la lista del carrito
    agregarAListaCarrito(nombre, precio);
}

// Función para agregar un producto a la lista del carrito
function agregarAListaCarrito(nombre, precio) {
    const listaProductosCarrito = document.getElementById('productos-carrito-lista');

    // Verificar si ya hay un elemento para el producto en la lista
    const elementoExistente = Array.from(listaProductosCarrito.children).find(elemento => elemento.dataset.nombre === nombre);

    if (elementoExistente) {
        // Si el elemento ya existe, actualizar la cantidad y el total
        const cantidadActual = parseInt(elementoExistente.querySelector('.cantidad').textContent);
        const nuevaCantidad = cantidadActual + 1;
        elementoExistente.querySelector('.cantidad').textContent = nuevaCantidad;

        const nuevoTotal = nuevaCantidad * precio;
        elementoExistente.querySelector('.total').textContent = `$${nuevoTotal.toFixed(2)}`;
    } else {
        // Si el elemento no existe, agregar un nuevo elemento
        const nuevoElemento = document.createElement('div');
        nuevoElemento.dataset.nombre = nombre;
        nuevoElemento.innerHTML = `
            <p>${nombre} - Cantidad: <span class="cantidad">1</span> - Precio: $${precio.toFixed(2)} - Total: $<span class="total">${precio.toFixed(2)}</span></p>
            <button onclick="eliminarElemento('${nombre}')">Eliminar</button>
        `;

        listaProductosCarrito.appendChild(nuevoElemento);
    }

    // Recalcular el total después de agregar un producto
    recalcularTotal();
}

// Función para recalcular el total del carrito
function recalcularTotal() {
    let total = 0;
    const listaProductosCarrito = document.getElementById('productos-carrito-lista');

    // Calcular el total sumando el precio de cada producto multiplicado por su cantidad
    Array.from(listaProductosCarrito.children).forEach(elemento => {
        const precio = parseFloat(elemento.querySelector('.total').textContent);
        total += precio;
    });

    // Mostrar el total en el elemento correspondiente
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Función para eliminar un elemento del carrito
function eliminarElemento(nombre) {
    const listaProductosCarrito = document.getElementById('productos-carrito-lista');
    const elementoEliminar = Array.from(listaProductosCarrito.children).find(elemento => elemento.dataset.nombre === nombre);

    if (elementoEliminar) {
        elementoEliminar.remove();
        recalcularTotal();
    }

    // Eliminar el producto del carrito
    carrito = carrito.filter(producto => producto.nombre !== nombre);
    actualizarContadorCarrito();
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para actualizar el contador del carrito en la barra
function actualizarContadorCarrito() {
    const contadorCarrito = document.querySelector('.cart-count');
    contadorCarrito.textContent = carrito.reduce((total, producto) => total + producto.cantidad, 0);
}

// Evento de clic en el enlace del carrito para redirigir a la página del carrito
document.getElementById('cartLink').addEventListener('click', function(event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
    window.location.href = "Productos.html"; // Reemplaza con la URL real de tu página del carrito
});

// Obtener el carrito almacenado en localStorage al cargar la página
window.onload = function() {
    const carritoGuardado = localStorage.getItem('carrito');

    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
        mostrarCarritoGuardado();
    }
};

// Función para mostrar el carrito almacenado en localStorage
function mostrarCarritoGuardado() {
    const listaProductosCarrito = document.getElementById('productos-carrito-lista');
    listaProductosCarrito.innerHTML = ""; // Limpiar la lista antes de mostrar los nuevos productos

    carrito.forEach(producto => {
        agregarAListaCarrito(producto.nombre, producto.precio);
    });
}
