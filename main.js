// Recupera el carrito desde el localStorage o inicializa uno vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Muestra la lista de productos en el menú desplegable
function mostrarListaProductos(productos) {
    const selectProducto = document.getElementById('producto-seleccion');
    selectProducto.innerHTML = '<option value="">Selecciona un producto</option>'; // Para asegurar que la lista esté limpia antes de añadir opciones

    productos.forEach(({ id, nombre, precio }) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `${nombre} - $${precio}`;
        selectProducto.appendChild(option);
    });
}

// Muestra mensajes en la interfaz utilizando SweetAlert con botón "OK" centrado
function mostrarMensaje(mensaje, tipo = "success") {
    swal({
        text: mensaje,
        icon: tipo,
        button: {
            text: "OK",
            className: "btn-centrado"
        },
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
    mostrarMensaje('Producto eliminado del carrito.');
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
        fetch('productos.json')
            .then(response => response.json())
            .then(productos => {
                const productoSeleccionado = productos.find(producto => producto.id === productoId);

                if (productoSeleccionado) {
                    const totalElegido = cantidad * productoSeleccionado.precio;
                    const nuevoItem = {
                        producto: productoSeleccionado.nombre,
                        cantidad: cantidad,
                        total: totalElegido
                    };

                    carrito.push(nuevoItem);
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    mostrarMensaje('Producto agregado al carrito.');
                    actualizarCarrito();
                    document.getElementById('cantidad').value = '';
                } else {
                    mostrarMensaje('Producto no encontrado.', 'error');
                }
            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
                mostrarMensaje('Error al cargar los productos.', 'error');
            });
    } else {
        mostrarMensaje('Selecciona un producto y una cantidad válida.', 'error');
    }
});

// Muestra u oculta el carrito al hacer clic en el botón y cambia el texto del botón
document.getElementById('ver-carrito').addEventListener('click', function() {
    const carritoDiv = document.getElementById('carrito');
    const verCarritoBtn = document.getElementById('ver-carrito');

    if (carritoDiv.style.display === 'none' || carritoDiv.style.display === '') {
        carritoDiv.style.display = 'block';
        verCarritoBtn.textContent = 'Ocultar carrito';
    } else {
        carritoDiv.style.display = 'none';
        verCarritoBtn.textContent = 'Ver carrito';
    }
});

// Carga los productos desde el archivo JSON y los muestra en el menú desplegable
fetch('productos.json')
    .then(response => response.json())
    .then(productos => {
        mostrarListaProductos(productos);
        actualizarCarrito();
    })
    .catch(error => console.error('Error al cargar los productos:', error));
