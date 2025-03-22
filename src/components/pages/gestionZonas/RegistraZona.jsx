import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { areaService } from "../../../context/services/ApiService";
import Icono from "../../../components/atoms/Iconos";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";
import SidebarAdm from "../../organisms/Sidebar";
import Encabezado from "../../molecules/Encabezado";

const RegistrarZona = () => {
  const navigate = useNavigate();
  const [zona, setZona] = useState({
    nombre_zona_trabajo: "",
    descripcion: "",
    ubicacion: { lat: 23.6345, lng: -102.5528 },
  });
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setZona({ ...zona, [e.target.name]: e.target.value });
  };

  const handleMapClick = (event) => {
    // Simulación de clic en mapa, en una implementación real usaríamos el API de Google Maps
    const randomLat = 23.6345 + (Math.random() - 0.5) * 0.01;
    const randomLng = -102.5528 + (Math.random() - 0.5) * 0.01;
    
    setZona({
      ...zona,
      ubicacion: { lat: randomLat, lng: randomLng }
    });
  };

  const handleGuardarClick = (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!zona.nombre_zona_trabajo || !zona.descripcion) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }
    
    setMostrarAlerta(true);
  };

  const handleConfirmarGuardar = async () => {
    setMostrarAlerta(false);
    setLoading(true);
    setError("");
    
    try {
      // Preparar datos para la API
      const zonaData = {
        nombre_zona_trabajo: zona.nombre_zona_trabajo,
        descripcion: zona.descripcion,
        // Agregar coordenadas si se necesitan
        latitud: zona.ubicacion.lat,
        longitud: zona.ubicacion.lng
      };
      
      await areaService.createArea(zonaData);
      
      setGuardado(true);
      setTimeout(() => navigate("/gestion-zonas"), 2000);
    } catch (error) {
      console.error("Error al registrar zona:", error);
      setError("Error al registrar la zona. Por favor, intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white overflow-x-hidden">
      {/* Encabezado fijo */}
      <div className="fixed top-0 w-full z-10">
        <Encabezado mensaje="Registrar zona" />
      </div>
      
      {/* Sidebar fijo */}
      <div className="fixed top-0 left-0 h-full z-10">
        <SidebarAdm />
      </div>
      
      {/* Contenido principal con padding-top para no solapar con el encabezado fijo */}
      <div className="w-full pt-16 md:pt-20 px-4 md:px-6 lg:px-8">
        <Tipografia>
          {/* Header con botón de retorno */}
          <div className="bg-white rounded-lg shadow-md border-l-2 border-purple-600 mb-4 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-medium text-lg">Registrar Nueva Zona</span>
            </div>
          </div>
          
          {/* Formulario */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 max-w-4xl mx-auto">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleGuardarClick} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la zona:
                </label>
                <input
                  type="text"
                  name="nombre_zona_trabajo"
                  value={zona.nombre_zona_trabajo}
                  onChange={handleChange}
                  className="w-full p-2 border border-purple-200 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 rounded-lg"
                  required
                  placeholder="Ingrese el nombre de la zona"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación:
                </label>
                <div className="text-sm mb-2 text-gray-600">
                  Coordenadas: {zona.ubicacion.lat.toFixed(4)}, {zona.ubicacion.lng.toFixed(4)}
                </div>
                
                {/* Simulación de mapa */}
                <div
                  className="w-full h-48 md:h-56 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={handleMapClick}
                >
                  <div className="text-center text-gray-600 p-4">
                    <div className="text-3xl mb-2">📍</div>
                    <div className="text-sm md:text-base">Haz clic para simular selección de ubicación</div>
                    <div className="text-xs mt-1 text-gray-500">(Se requiere API key de Google Maps para mostrar el mapa real)</div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción:
                </label>
                <textarea
                  name="descripcion"
                  value={zona.descripcion}
                  onChange={handleChange}
                  className="w-full p-2 border border-purple-200 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 rounded-lg"
                  required
                  rows="4"
                  placeholder="Descripción de la zona y detalles relevantes"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 pt-4">
                <Boton
                  type="button"
                  label="Cancelar"
                  onClick={() => navigate("/gestion-zonas")}
                  tipo="cancelar"
                  className="w-full sm:w-auto"
                />
                <Boton
                  type="submit"
                  label={loading ? "Guardando..." : "Guardar"}
                  disabled={loading}
                  tipo="primario"
                  className="w-full sm:w-auto"
                />
              </div>
            </form>
          </div>
        </Tipografia>
      </div>
      
      {/* Alerta de Confirmación */}
      {mostrarAlerta && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg text-center max-w-xs sm:max-w-sm md:max-w-md w-full mx-auto">
            <Icono name="pregunta" size={50} className="mx-auto mb-4 text-purple-600" />
            <Tipografia className="text-lg font-semibold mb-2">
              ¿Desea registrar esta zona?
            </Tipografia>
            <Tipografia className="text-sm text-gray-500 mb-4">
              Confirme para guardar la información de la zona.
            </Tipografia>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
              <Boton
                onClick={() => setMostrarAlerta(false)}
                label="Cancelar"
                tipo="cancelar"
                className="w-full sm:w-auto"
              />
              <Boton
                onClick={handleConfirmarGuardar}
                label="Confirmar"
                tipo="primario"
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Alerta de Registro Exitoso */}
      {guardado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg text-center max-w-xs sm:max-w-sm md:max-w-md w-full mx-auto">
            <Icono name="confirmar" size={50} className="mx-auto mb-4 text-green-500" />
            <Tipografia className="text-lg font-semibold">
              Zona registrada con éxito
            </Tipografia>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarZona;