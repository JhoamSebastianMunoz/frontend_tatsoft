import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { areaService } from "../../../context/services/ApiService";
import Icono from "../../../components/atoms/Iconos";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";

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
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 text-xl font-bold flex items-center">
          <button onClick={() => navigate("/gestion-zonas")} className="text-white text-2xl mr-4">
            &#8592;
          </button>
          Registrar Zona
        </div>
        
        {error && (
          <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleGuardarClick} className="p-6 space-y-4">
          <div>
            <label className="font-bold">Nombre:</label>
            <input
              type="text"
              name="nombre_zona_trabajo"
              value={zona.nombre_zona_trabajo}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          
          <div>
            <label className="font-bold">Ubicación:</label>
            <div className="text-sm mt-1 mb-2">
              Coordenadas: {zona.ubicacion.lat.toFixed(4)}, {zona.ubicacion.lng.toFixed(4)}
            </div>
            
            {/* Simulación de mapa */}
            <div
              className="w-full h-48 bg-gray-200 rounded flex items-center justify-center cursor-pointer"
              onClick={handleMapClick}
            >
              <div className="text-center text-gray-600">
                <div className="text-3xl mb-2">📍</div>
                <div>Haz clic para simular selección de ubicación</div>
                <div className="text-xs mt-1">(Se requiere API key de Google Maps para mostrar el mapa real)</div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="font-bold">Descripción:</label>
            <textarea
              name="descripcion"
              value={zona.descripcion}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
              rows="4"
            />
          </div>
          
          <div className="flex justify-center">
            <Boton
              type="submit"
              label={loading ? "Guardando..." : "Guardar"}
              disabled={loading}
              tipo="secundario"
            />
          </div>
        </form>
      </div>
      
      {/* Alerta de Confirmación */}
      {mostrarAlerta && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold">¿Desea registrar esta zona?</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setMostrarAlerta(false)}
                className="bg-red-400 text-white px-4 py-2 rounded-lg mx-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarGuardar}
                className="bg-green-400 text-white px-4 py-2 rounded-lg mx-2"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Alerta de Registro Exitoso */}
      {guardado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Icono name="confirmar" size={50} className="mx-auto mb-4" />
            <p className="text-lg font-semibold">Zona registrada con éxito</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarZona;