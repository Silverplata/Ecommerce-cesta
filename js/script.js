document.addEventListener("DOMContentLoaded", function () {
    function actualizarTotal() {
        let totalGeneral = 0;
        
        // Limpiar el resumen de productos
        let resumenProductos = document.querySelector(".resumen");
        resumenProductos.querySelectorAll(".resumen-producto").forEach(item => item.remove());
        
        // Iterar sobre cada producto
        document.querySelectorAll(".producto").forEach(producto => {
            let cantidadInput = producto.querySelector(".cantidad");
            if (!cantidadInput) return;  // Si no existe el input, salta este producto
            
            let cantidad = parseInt(cantidadInput.value);
            let precio = parseFloat(producto.querySelector(".precio").textContent);
            
            // Asegurarse de que la cantidad es un número válido y mayor o igual a 0
            cantidad = Math.max(0, cantidad);  // Esto evitará valores negativos
            let total = cantidad * precio;
            
            // Actualizar total individual de producto
            producto.querySelector(".total").textContent = total.toFixed(2) + " €";
            totalGeneral += total;
            
            // Si la cantidad es mayor que 0, agregar al resumen
            if (cantidad > 0) {
                let nombreProducto = producto.querySelector(".producto-info h3").textContent;
                let resumenProducto = document.createElement("div");
                resumenProducto.classList.add("resumen-producto");
                
                resumenProducto.innerHTML = `
                    <span>${nombreProducto}</span>
                    <span>${(cantidad * precio).toFixed(2)} €</span>
                `;
                resumenProductos.appendChild(resumenProducto);
            }
        });
        
        // Actualizar el total general
        document.querySelector(".total-suma").textContent = totalGeneral.toFixed(2) + " €";
    }

    // Evento para el botón de aumentar
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("btn-mas")) {
            let input = event.target.previousElementSibling;
            input.value = parseInt(input.value) + 1;
            actualizarTotal();
        }
    });

    // Evento para el botón de disminuir
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("btn-menos")) {
            let input = event.target.nextElementSibling;
            // Verifica si la cantidad es mayor que el mínimo para poder reducirla
            if (parseInt(input.value) > parseInt(input.min)) {
                input.value = parseInt(input.value) - 1;
                actualizarTotal();
            }
        }
    });

    // Evento para cuando se cambia manualmente la cantidad
    document.addEventListener("input", function (event) {
        if (event.target.classList.contains("cantidad")) {
            actualizarTotal();
        }
    });

    // Inicializa el total
    actualizarTotal();
});