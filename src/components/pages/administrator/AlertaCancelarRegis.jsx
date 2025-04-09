import React from "react";
import Tipografia from "../../atoms/Tipografia";
import Icono from "../../atoms/Iconos";
import Boton from "../../atoms/Botones";

const AlertaCancelar = ({ onClose, onConfirm, onCancel }) => {
    const handleConfirmar = () => {
        if (typeof onConfirm === 'function') {
          onConfirm();
        }
        if (typeof onClose === 'function') {
          onClose();
        }
      };
    
      const handleCancelar = () => {
        if (typeof onCancel === 'function') {
          onCancel();
        }
        if (typeof onClose === 'function') {
          onClose();
        }
      };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-3 sm:p-5 rounded-xl shadow-lg text-center w-full max-w-xs sm:max-w-sm">
        <div className="flex flex-col items-center">
          <Icono
            name="cancelar"
            size={70}
            color="red"
            className="sm:w-16 sm:h-16"
          />
          <Tipografia className="mt-3 mb-4 sm:mb-5 text-sm sm:text-base">
            ¿Deseas cancelar el registro?
          </Tipografia>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center w-full">
          <Boton
              label="Cancelar"
              tipo="cancelar"
              onClick={handleCancelar}
              className="w-full sm:flex-1 text-sm sm:text-base py-2"
            />
            <Boton
              tipo="alerta"
              label="Aceptar"
              onClick={handleConfirmar}
              className="w-full sm:flex-1 text-sm sm:text-base py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertaCancelar;
