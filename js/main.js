//
let carrito;
let productos;

// Función para obtener los productos
document.addEventListener("DOMContentLoaded", async () => {
    //inicializa el carrito y carga los productos cuando el DOM está listo
    carrito = new Carrito();
    productos = await obtenerProductos();

    //console.log("Productos cargados:", productos); //Comprobaciones

    //Muestra los productos en la página.
    if (!productos || productos.length === 0) {
        console.warn("No hay productos disponibles.");
        return;
    }

    mostrarProductos();
  
    productos.forEach(producto => {
        carrito.actualizarUnidades(producto.SKU, 0); // Agregar productos al carrito con cantidad 0
    });

    actualizarResumen();
});

// Muestra los productos en la página, creando elementos HTML para cada uno.
const mostrarProductos = () => {
    const listaProductos = document.querySelector('.lista-productos');
    productos.forEach(producto => {
        const productoElement = crearElementoProducto(producto);
        listaProductos.appendChild(productoElement);
    });
};

// Función para crear un elemento de producto
const crearElementoProducto = (producto) => {
    const div = document.createElement('div');
    div.classList.add('producto');
    
    // Crear la sección de información del producto
    const productoInfo = document.createElement('div');
    productoInfo.classList.add('producto-info');
    const h3Title = document.createElement('h3');
    h3Title.textContent = producto.title;
    const h3Ref = document.createElement('h3');
    h3Ref.classList.add('ref');
    h3Ref.textContent = `Ref: ${producto.SKU}`;
    productoInfo.appendChild(h3Title);
    productoInfo.appendChild(h3Ref);
    
    // Crear la sección de cantidad
    const cantidadContainer = document.createElement('div');
    cantidadContainer.classList.add('cantidad-container');
    const btnMenos = document.createElement('button');
    btnMenos.classList.add('btn-menos');
    btnMenos.dataset.sku = producto.SKU;
    btnMenos.textContent = '−';
    const inputCantidad = document.createElement('input');
    inputCantidad.type = 'number';
    inputCantidad.min = 0;
    inputCantidad.value = 0;
    inputCantidad.classList.add('cantidad');
    inputCantidad.dataset.sku = producto.SKU;
    const btnMas = document.createElement('button');
    btnMas.classList.add('btn-mas');
    btnMas.dataset.sku = producto.SKU;
    btnMas.textContent = '+';
    cantidadContainer.appendChild(btnMenos);
    cantidadContainer.appendChild(inputCantidad);
    cantidadContainer.appendChild(btnMas);
    
    // Crear los elementos de precio y total
    const spanPrecio = document.createElement('span');
    spanPrecio.classList.add('precio');
    spanPrecio.textContent = parseFloat(producto.price).toFixed(2); // Convertir precio a número
    const spanTotal = document.createElement('span');
    spanTotal.classList.add('total');
    spanTotal.textContent = '0';

    // Añadir todo al div principal
    div.appendChild(productoInfo);
    div.appendChild(cantidadContainer);
    div.appendChild(spanPrecio);
    div.appendChild(spanTotal);

    return div;
}

// Función para actualizar el resumen del carrito
const actualizarResumen = () => {
    const resumenElement = document.querySelector('.resumen');
    const carritoInfo = carrito.obtenerCarrito();

    // Limpiar el contenido previo del resumen
    while (resumenElement.firstChild) {
        resumenElement.removeChild(resumenElement.firstChild);
    }

    // Crear título "Resumen"
    const h2 = document.createElement('h2');
    h2.textContent = 'Resumen';
    resumenElement.appendChild(h2);

    let totalGeneral = 0;

    carritoInfo.products.forEach(producto => {
        if (producto.quantity > 0) {
            // Verificación del precio y cantidad antes de calcular el total
            //console.log(`Producto: ${producto.title}, Precio: ${producto.price}, Cantidad: ${producto.quantity}`);

            const totalProducto = (parseFloat(producto.price) * producto.quantity).toFixed(2); // Asegurarse de calcular con float
            //console.log(`Total del producto: ${totalProducto}`);

            // Crear el contenedor del producto en el resumen
            const divResumenProducto = document.createElement('div');
            divResumenProducto.classList.add('resumen-producto');

            // Crear el nombre del producto
            const spanProducto = document.createElement('span');
            spanProducto.classList.add('producto-resumen');
            spanProducto.textContent = producto.title;

            // Crear el total del producto
            const spanTotalProducto = document.createElement('span');
            spanTotalProducto.classList.add('total-resumen');
            spanTotalProducto.textContent = `${totalProducto} ${carritoInfo.currency}`;

            divResumenProducto.appendChild(spanProducto);
            divResumenProducto.appendChild(spanTotalProducto);
            resumenElement.appendChild(divResumenProducto);

            // Acumulando el total general
            totalGeneral += parseFloat(totalProducto);
        }
    });

    // Crear el total general al final
    const divTotalGeneral = document.createElement('div');
    divTotalGeneral.classList.add('total-general');
    divTotalGeneral.style.borderTop = '1px solid #000';
    divTotalGeneral.style.marginTop = '10px';
    divTotalGeneral.style.paddingTop = '10px';

    const spanTextoTotal = document.createElement('span');
    spanTextoTotal.classList.add('texto-total');
    spanTextoTotal.textContent = 'TOTAL';

    const spanTotalSuma = document.createElement('span');
    spanTotalSuma.classList.add('total-suma');
    spanTotalSuma.textContent = `${totalGeneral.toFixed(2)} ${carritoInfo.currency}`;

    divTotalGeneral.appendChild(spanTextoTotal);
    divTotalGeneral.appendChild(spanTotalSuma);
    resumenElement.appendChild(divTotalGeneral);

    // Crear el botón de reiniciar cantidades
    const botonReiniciar = document.createElement('button');
    botonReiniciar.textContent = 'Vaciar carrito';
    botonReiniciar.classList.add('btn-reiniciar');
    botonReiniciar.addEventListener('click', reiniciarCantidades);
    resumenElement.appendChild(botonReiniciar);

    // Actualizar los totales individuales en la lista de productos
    document.querySelectorAll('.producto').forEach(productoElement => {
        // Para cada producto, verifica si contiene un elemento con la clase 'cantidad'. Si no lo tiene, ignora ese producto y pasa al siguiente.
        if (!productoElement.querySelector('.cantidad')) {

            return;
        }

        const sku = productoElement.querySelector('.cantidad').dataset.sku; // Usa el SKU para obtener la información del producto del carrito.
        const producto = carrito.obtenerInformacionProducto(sku);
        //Si se encuentra el producto en el carrito, busca el elemento con la clase 'total' dentro del producto actual.
        if (producto) {
            const totalElement = productoElement.querySelector('.total');
            //Si existe el elemento 'total', actualiza su contenido con el nuevo total calculado
            if (totalElement) {
                totalElement.textContent = 
                    (parseFloat(producto.price) * producto.quantity).toFixed(2) + ' ' + carritoInfo.currency;
            }
        }
    });
}

// Función que reinicia las cantidades de los productos
const reiniciarCantidades =() => {
    // Reiniciar las cantidades de los productos en el carrito
    carrito.obtenerCarrito().products.forEach(producto => {
        producto.quantity = 0;  // Establecer la cantidad a cero
    });
    carrito.carrito.total = "0.00";  // Establecer el total a cero

    // Guardar el carrito actualizado
    carrito.guardarCarrito();  

    // Actualizar los inputs de cantidad en el DOM
    document.querySelectorAll('.cantidad').forEach(input => {
        input.value = 0;  // Poner todos los inputs de cantidad a cero
    });

    // Actualizar el resumen con los valores reiniciados
    actualizarResumen();  
}

// Eventos para los botones de cantidad
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-mas') || event.target.classList.contains('btn-menos')) {
        const sku = event.target.dataset.sku;
        const input = document.querySelector(`.cantidad[data-sku="${sku}"]`);

        if (!input) {
            console.error(`No se encontró el input con data-sku="${sku}"`);
            return;
        }

        let cantidad = parseInt(input.value) || 0;
        
        if (event.target.classList.contains('btn-mas')) {
            cantidad++;
        } else if (cantidad > 0) {
            cantidad--;
        }

        input.value = cantidad;
        carrito.actualizarUnidades(sku, cantidad);

        //console.log(carrito.obtenerCarrito()); // Comprobaciones

        actualizarResumen();  // Aseguramos que el resumen se actualice
    }
});

// Evento para los inputs de cantidad
document.addEventListener('input', (event) => {
    if (event.target.classList.contains('cantidad')) {
        const sku = event.target.dataset.sku;
        let cantidad = parseInt(event.target.value);
        cantidad = isNaN(cantidad) ? 0 : Math.max(0, cantidad);  // Evitar valores negativos
        event.target.value = cantidad;
        carrito.actualizarUnidades(sku, cantidad);
        actualizarResumen();  // Aseguramos que el resumen se actualice
    }
});
