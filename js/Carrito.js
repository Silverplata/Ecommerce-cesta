// Aquí se define la clase Carrito, que gestiona los productos del carrito de compras.
class Carrito {
    #productos = [];  // Array privado para almacenar productos con sus propiedades.

    // El constructor inicializa la clase con un array de productos. Los productos se mapean
    // para añadir una propiedad quantity con valor inicial 0.
    constructor(productos) {
        this.#productos = productos.map(p => ({ ...p, quantity: 0 }));  // Inicializa productos con quantity = 0
        this.carrito = {
            total: "0.00",  // Total inicial del carrito.
            currency: "€"  // Moneda por defecto.
        };
        this.cargarCarrito();  // Carga los datos del carrito desde localStorage si existen.
    }

    // Método para cargar el carrito desde localStorage (si hay datos guardados).
    cargarCarrito() {
        // Intentamos obtener los datos del carrito almacenados en localStorage. Si no existen,
        // se utiliza un objeto por defecto con un total de "0.00" y moneda en euros.
        const carritoData = JSON.parse(localStorage.getItem('carrito')) || {
            total: "0.00",
            currency: "€",
            products: []  // Si no hay productos guardados, inicializa un array vacío.
        };

        // Actualizamos la información del carrito con los datos almacenados.
        this.carrito = {
            total: carritoData.total,
            currency: carritoData.currency || "€"  // Si no se encuentra moneda, se usa "€" como por defecto.
        };

        // Restauramos las cantidades de los productos desde los datos guardados en localStorage.
        this.#productos.forEach(prod => {
            // Buscamos si hay un producto con el mismo SKU en el carrito guardado.
            const prodGuardado = carritoData.products.find(p => p.SKU === prod.SKU);
            if (prodGuardado) {
                prod.quantity = prodGuardado.quantity;  // Restauramos la cantidad del producto.
            }
        });
    }

    // Método para guardar el carrito actualizado en localStorage.
    guardarCarrito() {
        // Guardamos el estado completo del carrito, incluyendo total, moneda y productos.
        localStorage.setItem('carrito', JSON.stringify({
            total: this.carrito.total,
            currency: this.carrito.currency,
            products: this.#productos
        }));
    }

    // Método para obtener la información completa del carrito, incluyendo los productos.
    obtenerCarrito() {
        return {
            total: this.carrito.total,
            currency: this.carrito.currency,
            products: this.#productos
        };
    }

    // Método para actualizar la cantidad de un producto en el carrito. Si el SKU no se encuentra,
    // muestra una advertencia.
    actualizarUnidades(sku, cantidad) {
        const producto = this.#productos.find(p => p.SKU === sku);
        if (producto) {
            producto.quantity = cantidad;  // Actualiza la cantidad del producto encontrado.
        } else if (cantidad > 0) {
            // Si el producto no se encuentra, muestra una advertencia.
            console.warn(`Producto con SKU ${sku} no encontrado en la lista de productos`);
            return;
        }

        // Recalcula el total del carrito después de actualizar la cantidad del producto.
        this.recalcularTotal();
        // Guarda los cambios en el carrito.
        this.guardarCarrito();
    }

    // Método para recalcular el total del carrito basado en las cantidades y precios de los productos.
    recalcularTotal() {
        this.carrito.total = this.#productos
            .reduce((sum, p) => sum + (parseFloat(p.price) * p.quantity), 0)  // Calcula el total sumando los precios por cantidad.
            .toFixed(2);  // Redondea el total a dos decimales.
    }

    // Método para obtener la información completa de un producto por su SKU.
    obtenerInformacionProducto(sku) {
        const producto = this.#productos.find(p => p.SKU === sku);
        return producto ? { ...producto } : null;  // Devuelve una copia del producto si lo encuentra, o null si no.
    }

    // Método para reiniciar las cantidades de todos los productos a 0 y resetear el total.
    reiniciarCantidades() {
        this.#productos.forEach(p => p.quantity = 0);  // Restablece la cantidad de cada producto a 0.
        this.carrito.total = "0.00";  // Resetea el total del carrito a 0.
        this.guardarCarrito();  // Guarda los cambios en el localStorage.
    }
}

