//Aquí se define la clase Carrito.  
class Carrito {
    #productos = [];  // El #productos es un array privado que almacenará los productos.

    //El constructor llama al método cargarCarrito() al crear una instancia.
    constructor() {
        this.cargarCarrito(); 
    }

    //Este método carga los datos del carrito desde el localStorage. Si no hay datos, usa valores por defecto. 
    cargarCarrito() {
        const carritoData = JSON.parse(localStorage.getItem('carrito')) || {
            total: "0.00",
            currency: "€",
            products: []
        };
        //Asigna los productos al array privado y crea el objeto carrito con el total y la moneda.
        this.#productos = carritoData.products;
        this.carrito = {
            total: carritoData.total,
            currency: carritoData.currency
        };
    }

    //guardarCarrito() guarda el estado actual del carrito en el localStorage.
    guardarCarrito() {
        const carritoData = {
            total: this.carrito.total,
            currency: this.carrito.currency,
            products: this.#productos  // Usamos el array privado para guardar
        };
        localStorage.setItem('carrito', JSON.stringify(carritoData));
    }

    //Este método devuelve un objeto con la información actual del carrito.
    obtenerCarrito() {
        return {
            total: this.carrito.total,
            currency: this.carrito.currency,
            products: this.#productos  // Devolvemos los productos del array privado
        };
    }

    actualizarUnidades(sku, cantidad) {
        //Busca el producto en el carrito.
        const producto = this.#productos.find(p => p.SKU === sku);

        //Si existe, actualiza su cantidad.
        if (producto) {
            producto.quantity = cantidad;
        //Si no existe y la cantidad es > 0, lo añade al carrito.
        } else if (cantidad > 0) {
            const productoInfo = productos.find(p => p.SKU === sku);
            if (productoInfo) {
                this.#productos.push({ 
                    ...productoInfo, 
                    quantity: cantidad 
                });
            }
        }

        // Recalcula el total del carrito.
        this.carrito.total = this.#productos
            .reduce((sum, p) => sum + (parseFloat(p.price) * p.quantity), 0)  // Convierte el precio a número
            .toFixed(2);

        this.guardarCarrito(); //Guarda los cambios.
    }

    obtenerInformacionProducto(sku) {
        return this.#productos.find(producto => producto.SKU === sku);  // Busca y devuelve la información de un producto específico en el carrito.
    }
}


