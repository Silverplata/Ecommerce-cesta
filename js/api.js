
//###############################################################
//ENDPOINT --> http://jsonblob.com/1333860688661241856
//API --> https://jsonblob.com/api/jsonBlob/1333863785684983808
// API DE EJEMPLO

// Función para obtener los datos de la API

const obtenerProductos = () => {
  return fetch('https://jsonblob.com/api/jsonBlob/1334128729072525312')
    .then(productosData => {
      if (!productosData.ok) {
        throw new Error(`Error HTTP: ${productosData.status}`);
      }
      return productosData.json();
    })
    .then(datos => {
      return datos; // Retorna el objeto con "currency" y "products"
    })
    .catch(error => {
      console.error("Error al obtener los productos:", error);
      return null; // O maneja el error como prefieras
    });
};


//###############################################################
/*
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
      },
      {
        "SKU": "T9UDFDSFAX2P",
        "title": "Soporte para coche",
        "price": "30.50"
      }
    ]
}
//esta función imita el comportamiento asíncrono de una llamada a una API o base de datos real, aunque en realidad está devolviendo datos locales inmediatamente
const obtenerProductos = () => {
    return Promise.resolve(productosData);
}
*/

