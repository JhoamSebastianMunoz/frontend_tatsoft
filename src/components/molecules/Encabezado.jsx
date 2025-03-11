import React from "react";
import Tipografia from "../atoms/Tipografia";
import Icono from "../atoms/Iconos";

const Encabezado = ({ mensaje = "", icono = "volver", onClick, ruta = "", className = "" }) => {
  const handleClick = () => {
    if (ruta) {
      window.location.href = ruta;
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className={`flex items-center bg-gradient-to-r from-purple-900 to-purple-600 p-3 shadow-md ${className}`}>
      <Tipografia variant="h1" size="2xl" className="ml-auto m-1 text-white font-semibold">
        {mensaje}
      </Tipografia>
    </div>
  );
};

export default Encabezado;