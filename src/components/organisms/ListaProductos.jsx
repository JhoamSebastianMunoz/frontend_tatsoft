import React, { useState } from "react";
import Tipografia from "../atoms/Tipografia";
import Botones from "../atoms/Botones";
import Iconos from "../atoms/Iconos";
import Encabezado from "../molecules/Encabezado";

const ListaProductos = () => {
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  const productos = [
    { id: 1, nombre: "Arroz Diana 500 gr", precio: 5200 },
    { id: 2, nombre: "Leche Colanta Uht Deslactosada 1000 ML", precio: 5200 },
    { id: 3, nombre: "Sal Refisal 1000 gr", precio: 5200 },
  ];

  const toggleSeleccion = (id) => {
    if (productosSeleccionados.includes(id)) {
      setProductosSeleccionados(
        productosSeleccionados.filter((prod) => prod !== id)
      );
    } else {
      setProductosSeleccionados([...productosSeleccionados, id]);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-x-hidden">
      <Encabezado mensaje="Carrito" icono="volver" onClick={() => console.log("Volver clicado")} />
      <div className="p-3 max-w-md mx-auto flex flex-col flex-2
      ">
        <Tipografia>
          <div className="space-y-4">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="flex flex-col border rounded-lg p-6 shadow-md bg-white relative"
              >
                <div className="flex items-center justify-between">
                  <img
                    src={`/images/product${producto.id}.png`}
                    alt={producto.nombre}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 ml-4">
                    <p className="font-semibold text-gray-700 text-sm sm:text-base">
                      {producto.nombre}
                    </p>
                    <p className="text-sm text-gray-500">${producto.precio}</p>
                  </div>
                  <Iconos name="eliminar" className="cursor-pointer absolute top-2 right-3" />
                </div>
                <div className="flex flex-col items-center justify-center space-y-4 mt-4">
                  <div className="absolute bottom-4 right-3 transform -translate-x-1/2 flex items-center space-x-4">
                    <button className="text-black bg-gray-100 w-6 h-6 flex items-center justify-center rounded-full hover:bg-purple-500 shadow-md">
                      -
                    </button>
                    <span className="px-1 text-lg font-bold">7</span>
                    <button className="text-black bg-gray-100 w-6 h-6 flex items-center justify-center rounded-full hover:bg-purple-500 shadow-md">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 border-t pt-4 bg-white sticky bottom-0">
            <div className="flex justify-between text-gray-800">
              <span>Subtotal</span>
              <span>$15.600</span>
            </div>
            <div className="flex justify-between text-gray-700 mt-2">
              <span>Total de cada producto</span>
              <span>$5.200</span>
            </div>
            <div className="flex justify-between text-gray-700 mt-2 font-bold">
              <span>Total</span>
              <span>$15.600</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-5 mt-6">
              <Botones label="Cancelar" tipo="cancelar" />
              <Botones label="Realizar Preventa" tipo="primario" />
            </div>
          </div>
        </Tipografia>
      </div>
    </div>
  );
};

export default ListaProductos;
