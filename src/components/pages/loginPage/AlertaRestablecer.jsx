import React from "react";
import { useNavigate } from "react-router-dom";
import Icono from "../../../components/atoms/Iconos";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";

const AlertaRestablecer = ({ onClose }) => {
  const navigate = useNavigate();

  const handleAceptar = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center w-80">
        <Tipografia>
          <Icono name="confirmar" size={55} />
          <p className="mt-4">Contraseña modificada correctamente</p>
          <div className="mt-4">
            <Boton label="Aceptar" onClick={handleAceptar} />
          </div>
        </Tipografia>
      </div>
    </div>
  );
};

export default AlertaRestablecer;