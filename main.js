const productos = [
    {id: 1, nombre: 'Celular', precio: 1000},
    {id: 2, nombre: 'Notebook', precio: 2000},
    {id: 3, nombre: 'Pc', precio: 3000}
];

function mostrarListaProductos() {
    return productos.map(function(producto) {
        return producto.id + '. ' + producto.nombre + ' - $' + producto.precio;
    }).join('\n') + ('\n0. Carrito');
}

let carrito = [];
let continuarCompra = true;

while (continuarCompra) {
    let listaProductos = mostrarListaProductos();
    let elegir = parseInt(prompt('Elige un producto:\n\n' + listaProductos));
    const productoEncontrado = productos.find((producto) => producto.id === elegir);

    if (elegir === 0) {
        const carritoFinal = carrito.reduce((acum, producto) => acum + producto.total, 0);
        alert('El monto total del carrito es : $' + carritoFinal);
        continuarCompra = false;  
    } else if (productoEncontrado){
        let elegirCantidad = parseInt(prompt('Elige la cantidad'));

        if (!isNaN(elegirCantidad) && elegirCantidad > 0) {
            let totalElegido = elegirCantidad * productoEncontrado.precio;
            alert('El monto total de estos productos es de: $' + totalElegido);
            carrito.push({producto: productoEncontrado.nombre, cantidad: elegirCantidad, total: totalElegido});

        } else {
            alert('Cantidad no válida, vuelve a intentarlo');
        }


    } else {
        alert('Producto no encontrado, vuelve a intentarlo');
    }
}