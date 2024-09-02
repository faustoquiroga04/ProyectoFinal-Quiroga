// Lista de productos disponibles
const productos = [
    { id: 1, nombre: 'Celular', precio: 1000 },
    { id: 2, nombre: 'Notebook', precio: 2000 },
    { id: 3, nombre: 'Pc', precio: 3000 },
];

// Recupera el carrito desde el localStorage o inicializa uno vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Muestra la lista de productos en el menú desplegable
function mostrarListaProductos() {
    const selectProducto = document.getElementById('producto-seleccion');
    productos.forEach(({ id, nombre, precio }) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `${nombre} - $${precio}`;
        selectProducto.appendChild(option);
    });
}

// Muestra mensajes en la interfaz utilizando SweetAlert con botón "OK"
function mostrarMensaje(mensaje, tipo = "success") {
    swal({
        text: mensaje,
        icon: tipo,
        button: "OK",
    });
}

// Actualiza y muestra el contenido del carrito
function actualizarCarrito() {
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.style.display = carrito.length > 0 ? 'block' : 'none';

    if (carrito.length > 0) {
        const carritoHTML = carrito.map(({ cantidad, producto, total }, index) => `
            <div>
                ${cantidad} x ${producto} : $${total}
                <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
            </div>
        `).join('');

        const carritoTotal = carrito.reduce((acum, { total }) => acum + total, 0);
        carritoDiv.innerHTML = `<h3>Tu carrito:</h3>${carritoHTML}<br>Monto total a pagar: $${carritoTotal}`;
    } else {
        carritoDiv.innerHTML = `<h3>Tu carrito está vacío.</h3>`;
    }
}

// Elimina un producto del carrito y actualiza el estado
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarMensaje('Producto eliminado del carrito.', "warning");
    actualizarCarrito();
}

// Muestra la cantidad a seleccionar después de elegir un producto
document.getElementById('producto-seleccion').addEventListener('change', function() {
    const productoId = parseInt(this.value);
    document.getElementById('cantidad-section').style.display = productoId > 0 ? 'block' : 'none';
});

// Agrega el producto seleccionado al carrito con la cantidad indicada
document.getElementById('agregar-al-carrito').addEventListener('click', function() {
    const productoId = parseInt(document.getElementById('producto-seleccion').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);

    if (productoId && cantidad > 0) {
        const { nombre, precio } = productos.find(producto => producto.id === productoId) || {};
        const totalElegido = cantidad * (precio ?? 0);
        const nuevoItem = { producto: nombre || 'Desconocido', cantidad, total: totalElegido };

        carrito = [...carrito, nuevoItem];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarMensaje('Producto agregado al carrito.');
        actualizarCarrito();
        document.getElementById('cantidad').value = '';
    } else {
        mostrarMensaje('Selecciona un producto y una cantidad válida.', "error");
    }
});

// Muestra u oculta el carrito al hacer clic en el botón
document.getElementById('ver-carrito').addEventListener('click', function() {
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.style.display = carritoDiv.style.display === 'none' || carritoDiv.style.display === '' ? 'block' : 'none';
});

// Inicializa la lista de productos y el estado del carrito
mostrarListaProductos();
actualizarCarrito();