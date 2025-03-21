import React from "react";
import Tipografia from "../atoms/Tipografia";
import Icono from "../atoms/Iconos";

const Encabezado = ({
  mensaje = "",
  icono = "volver",
  onClick,
  ruta = "",
  className = "",
  colorFondo = "bg-indigo-500",
  colorTexto = "text-white",
  mostrarIcono = true,
  alineacion = "center", // "left", "center", "right"
  alturaPx = "64px", // altura personalizable
}) => {
  const handleClick = () => {
    if (ruta) {
      window.location.href = ruta;
    } else if (onClick) {
      onClick();
    }
  };

  // Determinar la clase de alineación
  let alineacionClase = "justify-center"; // por defecto
  if (alineacion === "left") {
    alineacionClase = "justify-start";
  } else if (alineacion === "right") {
    alineacionClase = "justify-end";
  }

  return (
    <div
      className={`flex items-center ${colorFondo} shadow-md ${className}`}
      style={{ height: alturaPx }}
    >
      {/* Icono del lado izquierdo (solo si mostrarIcono es true) */}
      {mostrarIcono && (
        <button
          onClick={handleClick}
          className="p-2 hover:bg-opacity-20 hover:bg-black rounded-full transition-colors duration-200 ml-3"
        >
          <Icono
            nombre={icono}
            className={`${colorTexto}`}
            tamano="md"
          />
        </button>
      )}

      {/* Contenedor para el título con alineación configurable */}
      <div className={`flex flex-1 ${alineacionClase} px-4`}>
        <Tipografia
          variant="h1"
          size="2xl"
          className={`${colorTexto} font-semibold`}
        >
          {mensaje}
        </Tipografia>
      </div>
    </div>
  );
};

export default Encabezado;