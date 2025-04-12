import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { areaService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Icono from "../../../components/atoms/Iconos";
import Boton from "../../../components/atoms/Botones";
import Sidebar from "../../organisms/Sidebar";

const RegistrarZona = () => {
  const navigate = useNavigate();
  const [zona, setZona] = useState({
    nombre_zona_trabajo: "",
    descripcion: ""
  });
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [error, setError] = useState("");
  
  // Función para manejar los cambios en los inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setZona(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardarClick = (e) => {
    e.preventDefault();
    
    // Verificar si los campos necesarios están completos
    if (!zona.nombre_zona_trabajo || !zona.descripcion) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }
    
    setMostrarAlerta(true);
  };

  const handleConfirmarGuardar = async () => {
    setMostrarAlerta(false);
    setError("");
    
    try {
      const zonaData = {
        nombre_zona_trabajo: zona.nombre_zona_trabajo,
        descripcion: zona.descripcion
      };
      
      const respuesta = await areaService.createArea(zonaData);
      navigate("/gestion-zonas");
    } catch (error) {
      console.error("Error al crear zona:", error);
      setError("Error al crear la zona. Por favor, intenta de nuevo más tarde.");
    }
  };

  const handleCancelar = () => {
    navigate("/gestion-zonas");
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Sidebar para móvil */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200">
        <Sidebar />
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden md:block fixed top-0 left-0 h-full z-20">
        <Sidebar />
      </div>

      {/* Contenido principal */}
      <main className="w-full mx-4 p-4">
        <div className="px-4 md:px-6 lg:px-8">
          <Tipografia>
            <div className="py-3 px-8 md:px-44">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Registrar Zona</h1>
            </div>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            <div className="max-w-4xl ml-6 md:mx-auto">
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8 mb-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Información de la Zona
                  </h2>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black block">
                        Nombre de la zona
                      </label>
                      <input
                        type="text"
                        name="nombre_zona_trabajo"
                        value={zona.nombre_zona_trabajo}
                        onChange={handleChange}
                        placeholder="Ingrese el nombre de la zona"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150"
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
                        placeholder="Descripción de la zona y detalles relevantes"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150 ease-in-out h-32"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end pt-6 border-t border-gray-100">
                  <Boton
                    onClick={handleCancelar}
                    label="Cancelar"
                    tipo="cancelar"
                    className="w-full sm:w-auto"
                  />
                  <Boton
                    onClick={handleGuardarClick}
                    label="Guardar"
                    tipo="primario"
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>
            </div>
          </Tipografia>
        </div>
      </main>

      {/* Modal de confirmación */}
      {mostrarAlerta && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 transition-opacity p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-5">
              <div className="text-center">
                <Tipografia>
                  <Icono name="confirmar" size="50" />
                  <h3 className="text-lg font-medium text-black mb-3">
                    ¿Desea guardar la zona?
                  </h3>
                  <p className="text-sm text-black mb-4">
                    Esta acción registrará una nueva zona. ¿Estás seguro de continuar?
                  </p>
                </Tipografia>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-col gap-3">
              <Boton
                onClick={handleConfirmarGuardar}
                label="Confirmar"
                tipo="secundario"
                className="w-full"
              />
              <Boton
                onClick={() => setMostrarAlerta(false)}
                label="Cancelar"
                tipo="cancelar"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarZona;