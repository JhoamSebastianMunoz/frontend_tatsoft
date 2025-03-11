import React from "react";
import Icono from "../../../components/atoms/Iconos";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";

const AlertaEdicion = ({ onClose, onConfirm, onCancel }) => {
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
          <Icono name="confirmar" size={65} color="green" className="sm:w-16 sm:h-16" />
          <Tipografia className="mt-2 mb-4 sm:mb-5 text-sm sm:text-base">
            ¿Deseas guardar los cambios?
          </Tipografia>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center w-full">
            <Boton
              label="Cancelar"
              tipo="cancelar"
              onClick={handleCancelar}
              className="w-full sm:flex-1 text-sm sm:text-base py-2"
            />
            <Boton
              label="Confirmar"
              onClick={handleConfirmar}
              className="w-full sm:flex-1 text-sm sm:text-base py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertaEdicion;