import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tipografia from "../../components/atoms/Tipografia";
import Boton from "../../components/atoms/Botones";
import Encabezado from "../../components/molecules/Encabezado";
import CamposTexto from "../../components/atoms/CamposTexto";
import Icono from "../../components/atoms/Iconos";

const EditarZona = () => {
  const navigate = useNavigate();

  const [zona, setZona] = useState({
    nombre: "Zona Norte Armenia",
    descripcion:
      "Área asignada para operaciones en la región norte de la ciudad de Armenia abarcado desde el parque fundadores hasta el portal del Quindío",
  });

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const handleChange = (e) => {
    setZona({ ...zona, [e.target.name]: e.target.value });
  };

  const handleGuardarClick = (e) => {
    e.preventDefault();
    setMostrarAlerta(true);
  };

  const handleConfirmarGuardar = () => {
    setMostrarAlerta(false);
    setGuardado(true);
    console.log("Zona actualizada", zona);
    setTimeout(() => navigate("/gestion-zonas"), 2000);
  };

  const handleCancelar = () => {
    navigate("/gestion-zonas");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Encabezado mensaje="Editar Zona" />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          <Tipografia>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Información de la Zona
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black block">
                    Nombre de la Zona
                  </label>
                  <CamposTexto
                    type="text"
                    name="nombre"
                    value={zona.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150 ease-in-out"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={zona.descripcion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150 ease-in-out h-32"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-6 border-t border-gray-100">
              <Boton
                onClick={handleCancelar}
                label="Cancelar"
                tipo="cancelar"
              />

              <Boton
                onClick={handleGuardarClick}
                label="Guardar Cambios"
                tipo="secundario"
              />
            </div>
          </Tipografia>
        </div>
      </div>

      {mostrarAlerta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-5">
              <div className="text-center">
                <Tipografia>
                  <Icono name="confirmar" size="50" />
                  <h3 className="text-lg font-medium text-black mb-3">
                    ¿Desea guardar los cambios?
                  </h3>
                  <p className="text-sm text-black">
                    Esta acción actualizará la información de la zona. ¿Estás
                    seguro de continuar?
                  </p>
                </Tipografia>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-between">
              <Boton
                onClick={() => setMostrarAlerta(false)}
                label="cancelar"
                tipo="cancelar"
              />

              <Boton
                onClick={handleConfirmarGuardar}
                label="Confirmar"
                tipo="secundario"
              />
            </div>
          </div>
        </div>
      )}

      {guardado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-5">
              <div className="text-center">
                <Tipografia>
                  <Icono name="confirmar" size="50" />
                  <h3 className="text-lg font-medium text-black mb-3">
                    ¡Cambios guardados con éxito!
                  </h3>
                  <p className="text-sm text-black">
                    Serás redirigido en unos segundos
                  </p>
                </Tipografia>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarZona;