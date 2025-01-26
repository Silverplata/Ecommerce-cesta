/*async function obtenerProductos() {
    const response = await fetch('https://jsonblob.com/api/TU_ID_DE_JSON_BLOB');
    const data = await response.json();
    return data.products;
}*/

// API DE EJEMPLO

const productosData = {
    "currency": "€",
    "products": [
      {
        "SKU": "0K3QOSOV4V",
        "title": "iFhone 13 Pro",
        "price": "938.99"
      },
      {
        "SKU": "TGD5XORY1L",
        "title": "Cargador",
        "price": "49.99"
      },
      {
        "SKU": "IOKW9BQ9F3",
        "title": "Funda de piel",
        "price": "79.99"
      },
      {
        "SKU": "Z9FGHFU8Y6FX2P",
        "title": "Cable USB-C",
        "price": "20.99"
      },
      {
        "SKU": "ZDFGDF9UQ8Y6X2P",
        "title": "AirPods",
        "price": "220"
      },
      {
        "SKU": "Z9UDFGDFQ8Y6X2P",
        "title": "Cristal templado",
        "price": "10.50"
      }
    ]
};
//esta función imita el comportamiento asíncrono de una llamada a una API o base de datos real, aunque en realidad está devolviendo datos locales inmediatamente
const obtenerProductos = () => {
    return Promise.resolve(productosData.products);
}


