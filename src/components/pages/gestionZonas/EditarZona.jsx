import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { areaService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Icono from "../../../components/atoms/Iconos";

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
