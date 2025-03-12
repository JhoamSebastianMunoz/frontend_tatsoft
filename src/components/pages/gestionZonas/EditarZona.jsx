import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { areaService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Icono from "../../../components/atoms/Iconos";
import Boton from "../../../components/atoms/Botones";
import Encabezado from "../../../components/molecules/Encabezado";
import CamposTexto from "../../../components/atoms/CamposTexto";

const EditarZona = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zona, setZona] = useState({
    nombre_zona_trabajo: "",
    ubicacion: { lat: 23.6345, lng: -102.5528 },
    descripcion: "",
  });
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar datos de la zona al iniciar
  useEffect(() => {
    const fetchZona = async () => {
      try {
        setLoading(true);
        const response = await areaService.getAreaById(id);
        
        // Formatear datos recibidos
        setZona({
          nombre_zona_trabajo: response.data.nombre_zona_trabajo,
          descripcion: response.data.descripcion,
          ubicacion: { 
            lat: response.data.latitud || 23.6345, 
            lng: response.data.longitud || -102.5528
          }
        });
      } catch (error) {
        console.error("Error al cargar datos de la zona:", error);
        setError("Error al cargar los datos de la zona. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchZona();
    }
  }, [id]);

  const handleChange = (e) => {
    setZona({ ...zona, [e.target.name]: e.target.value });
  };

  const handleMapClick = (event) => {
    // Simulación de clic en mapa
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
      
      await areaService.updateArea(id, zonaData);
      
      setGuardado(true);
      setTimeout(() => navigate("/gestion-zonas"), 2000);
    } catch (error) {
      console.error("Error al actualizar zona:", error);
      setError("Error al actualizar la zona. Por favor, intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !zona.nombre_zona_trabajo) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Tipografia>Cargando información de la zona...</Tipografia>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 flex items-center">
        <button onClick={() => navigate("/gestion-zonas")} className="text-white mr-4 flex items-center justify-center rounded-full bg-white bg-opacity-30 h-8 w-8">
          <span>&#8592;</span>
        </button>
        <span className="text-xl font-medium">Editar Zona</span>
      </div>
     
      <div className="p-6 flex flex-col space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div>
          <label className="font-medium">Nombre:</label>
          <input
            type="text"
            name="nombre_zona_trabajo"
            value={zona.nombre_zona_trabajo}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1 text-sm"
            required
          />
        </div>
  
        <div>
          <label className="font-medium">Ubicación:</label>
          <div className="text-sm mt-1 mb-2">
            Coordenadas: {zona.ubicacion.lat.toFixed(4)}, {zona.ubicacion.lng.toFixed(4)}
          </div>
        
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
          <label className="font-medium">Descripción:</label>
          <textarea
            name="descripcion"
            value={zona.descripcion}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1 text-sm h-24"
            required
          />
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleGuardarClick}
            disabled={loading}
            className="bg-purple-500 text-white py-2 px-4 rounded-md w-full max-w-xs"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Icono name="confirmar" size={50} className="mx-auto mb-4" />
            <p className="text-lg font-semibold">Cambios guardados con éxito</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarZona;
