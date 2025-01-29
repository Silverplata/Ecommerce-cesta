let carrito;  // Variable para almacenar la instancia del carrito.
let productos;  // Variable para almacenar la lista de productos obtenidos desde la API.

// Función para obtener los productos cuando la página se haya cargado completamente.
document.addEventListener("DOMContentLoaded", () => {
    obtenerProductos()  // Llamada a la función que obtiene los productos de la API.
        .then(data => {
            // Si no se encuentran productos en la respuesta, mostramos una advertencia.
            if (!data || !data.products) {
                console.warn("No se encontraron productos en la API.");
                return;
            }

            productos = data.products;  // Guardamos los productos obtenidos en la variable 'productos'.
            carrito = new Carrito(productos); // Creamos una nueva instancia del carrito con los productos obtenidos.

            // Si la moneda del carrito no coincide con la moneda de la API, la actualizamos.
            if (carrito.carrito.currency !== data.currency) {
                carrito.carrito.currency = data.currency;
                carrito.guardarCarrito();  // Guardamos el carrito con la nueva moneda.
            }

            // Mostramos los productos en la página.
            mostrarProductos();
            // Actualizamos el resumen del carrito.
            actualizarResumen();
        })
        .catch(error => console.error("Error al obtener los productos:", error));
});

// Función para mostrar los productos en la página, creando elementos HTML para cada uno.
const mostrarProductos = () => {
    const listaProductos = document.querySelector('.lista-productos');  // Elemento contenedor de los productos.
    const template = document.getElementById('producto-template');  // Plantilla para cada producto.

    // Iteramos sobre los productos y mostramos cada uno.
    productos.forEach(producto => {
        const productoElement = template.content.cloneNode(true);  // Clonamos la plantilla.

        // Rellenamos los datos del producto en la plantilla clonada.
        productoElement.querySelector('.producto-info h3').textContent = producto.title;
        productoElement.querySelector('.ref').textContent = `Ref: ${producto.SKU}`;
        
        const inputCantidad = productoElement.querySelector('.cantidad');
        inputCantidad.dataset.sku = producto.SKU;  // Asignamos el SKU como dataset.

        // Asignamos el SKU a los botones correspondientes.
        productoElement.querySelectorAll('button').forEach(btn => {
            btn.dataset.sku = producto.SKU;
        });
        
        // Mostramos el precio del producto.
        productoElement.querySelector('.precio').textContent = parseFloat(producto.price).toFixed(2);
        
        // Añadimos el producto al contenedor de productos.
        listaProductos.appendChild(productoElement);
    });
};

// Función para actualizar el resumen del carrito.
const actualizarResumen = () => {
    const resumenElement = document.querySelector('.resumen');  // Elemento contenedor del resumen del carrito.
    const carritoInfo = carrito.obtenerCarrito();  // Obtenemos la información actual del carrito.

    // Limpiamos el contenido previo del resumen.
    resumenElement.innerHTML = "";

    // Crear el título "Resumen" para el resumen del carrito.
    const h2 = document.createElement('h2');
    h2.textContent = 'Resumen';
    resumenElement.appendChild(h2);

    let totalGeneral = 0;  // Variable para acumular el total general del carrito.

    // Iteramos sobre los productos en el carrito para mostrarlos en el resumen.
    carritoInfo.products.forEach(producto => {
        if (producto.quantity > 0) {
            const totalProducto = (parseFloat(producto.price) * producto.quantity).toFixed(2);  // Calculamos el total por producto.

            // Creamos un contenedor para cada producto en el resumen.
            const divResumenProducto = document.createElement('div');
            divResumenProducto.classList.add('resumen-producto');

            // Creamos un span para el nombre del producto.
            const spanProducto = document.createElement('span');
            spanProducto.classList.add('producto-resumen');
            spanProducto.textContent = producto.title;

            // Creamos un span para el total del producto.
            const spanTotalProducto = document.createElement('span');
            spanTotalProducto.classList.add('total-resumen');
            spanTotalProducto.textContent = `${totalProducto} ${carritoInfo.currency}`;

            // Añadimos los elementos al contenedor del producto.
            divResumenProducto.appendChild(spanProducto);
            divResumenProducto.appendChild(spanTotalProducto);
            resumenElement.appendChild(divResumenProducto);

            // Acumulamos el total general del carrito.
            totalGeneral += parseFloat(totalProducto);
        }
    });

    // Creamos un contenedor para mostrar el total general.
    const divTotalGeneral = document.createElement('div');
    divTotalGeneral.classList.add('total-general');
    divTotalGeneral.style.borderTop = '1px solid #000';
    divTotalGeneral.style.marginTop = '10px';
    divTotalGeneral.style.paddingTop = '10px';

    // Creamos el texto "TOTAL" y el valor del total general.
    const spanTextoTotal = document.createElement('span');
    spanTextoTotal.classList.add('texto-total');
    spanTextoTotal.textContent = 'TOTAL';

    const spanTotalSuma = document.createElement('span');
    spanTotalSuma.classList.add('total-suma');
    spanTotalSuma.textContent = `${totalGeneral.toFixed(2)} ${carritoInfo.currency}`;

    // Añadimos los elementos al contenedor del total general.
    divTotalGeneral.appendChild(spanTextoTotal);
    divTotalGeneral.appendChild(spanTotalSuma);
    resumenElement.appendChild(divTotalGeneral);

    // Creamos un botón para vaciar el carrito.
    const botonReiniciar = document.createElement('button');
    botonReiniciar.textContent = 'Vaciar carrito';
    botonReiniciar.classList.add('btn-reiniciar');
    botonReiniciar.addEventListener('click', reiniciarCantidades);  // Al hacer click, se reinician las cantidades.
    resumenElement.appendChild(botonReiniciar);

    // Actualizamos los totales individuales de cada producto en la lista de productos.
    document.querySelectorAll('.producto').forEach(productoElement => {
        if (!productoElement.querySelector('.cantidad')) return;

        const sku = productoElement.querySelector('.cantidad').dataset.sku;  // Obtenemos el SKU del producto.
        const producto = carrito.obtenerInformacionProducto(sku);  // Obtenemos la información del producto.

        if (producto) {
            const totalElement = productoElement.querySelector('.total');
            if (totalElement) {
                // Mostramos el total del producto en su respectiva posición.
                totalElement.textContent = (parseFloat(producto.price) * producto.quantity).toFixed(2) + ' ' + carritoInfo.currency;
            }
        }
    });
};

// Función que reinicia las cantidades de los productos en el carrito.
const reiniciarCantidades = () => {
    // Reiniciamos las cantidades de los productos a 0.
    carrito.obtenerCarrito().products.forEach(producto => {
        producto.quantity = 0;
    });
    carrito.total = "0.00";  // Reseteamos el total del carrito.

    // Guardamos el carrito actualizado.
    carrito.guardarCarrito();  

    // Eliminar la clave 'carrito' del localStorage.
    localStorage.removeItem('carrito');

    // Actualizamos los inputs de cantidad en la interfaz de usuario.
    document.querySelectorAll('.cantidad').forEach(input => {
        input.value = 0;
    });

    // Actualizamos el resumen con los valores reiniciados.
    actualizarResumen();  
};

// Manejador de eventos para los botones de cantidad (+ y -).
const cantidadButtonClickHandler = (event) => {
    const sku = event.target.dataset.sku;  // Obtenemos el SKU del producto al que corresponde el botón.
    const input = document.querySelector(`.cantidad[data-sku="${sku}"]`);  // Obtenemos el input correspondiente al SKU.

    if (!input) {
        console.error(`No se encontró el input con data-sku="${sku}"`);
        return;
    }

    let cantidad = parseInt(input.value) || 0;  // Obtenemos la cantidad actual, o 0 si no está definida.

    // Determinamos si se debe aumentar o disminuir la cantidad.
    if (event.target.classList.contains('btn-mas')) {
        cantidad++;
    } else if (cantidad > 0) {
        cantidad--;
    }

    input.value = cantidad;  // Actualizamos la cantidad en el input de la interfaz.
    carrito.actualizarUnidades(sku, cantidad);  // Actualizamos la cantidad en el carrito.

    actualizarResumen();  // Se actualiza el total individual y el resumen general.
};

// Manejador de eventos para los inputs de cantidad (si el usuario escribe directamente).
const cantidadInputHandler = (event) => {
    if (event.target.classList.contains('cantidad')) {
        const sku = event.target.dataset.sku;  // Obtenemos el SKU del producto.
        let cantidad = parseInt(event.target.value);
        cantidad = isNaN(cantidad) ? 0 : Math.max(0, cantidad);  // Evitar valores negativos.

        event.target.value = cantidad;  // Actualizamos el valor del input.

        carrito.actualizarUnidades(sku, cantidad);  // Actualizamos la cantidad en el carrito.

        actualizarResumen();  // Se actualiza el total individual y el resumen general.
    }
};

// Asignamos manejadores de eventos a los botones de `+` y `-`.
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-mas') || event.target.classList.contains('btn-menos')) {
        cantidadButtonClickHandler(event);
    }
});

// Asignamos manejador de eventos a los inputs de cantidad.
document.addEventListener('input', cantidadInputHandler);

