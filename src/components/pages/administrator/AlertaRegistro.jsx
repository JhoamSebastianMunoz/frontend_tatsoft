import React from "react";
import Tipografia from "../../atoms/Tipografia";
import Icono from "../../atoms/Iconos";
import Boton from "../../atoms/Botones";

const AlertaRegistro = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-3 sm:p-5 rounded-xl shadow-lg text-center w-full max-w-xs sm:max-w-sm">
        <div className="flex flex-col items-center">
          <Icono
            name="confirmar"
            size={65}
            color="green"
            className="sm:w-16 sm:h-16"
          />
          <Tipografia className="mt-2 mb-4 sm:mb-5 text-sm sm:text-base">
            Usuario registrado exitosamente
          </Tipografia>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center w-full">
            <Boton
              label="Confirmar"
              tipo="alerta"
              onClick={onClose}
              className="w-full sm:flex-1 text-sm sm:text-base py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertaRegistro;
