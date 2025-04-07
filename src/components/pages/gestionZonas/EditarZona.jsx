import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { areaService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Icono from "../../../components/atoms/Iconos";
import Boton from "../../../components/atoms/Botones";
import Sidebar from "../../organisms/Sidebar";
// Importamos la biblioteca de Leaflet para el mapa
import L from 'leaflet';
import { MapContainer, TileLayer, FeatureGroup, Polygon } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// Coordenadas centrales del departamento del Quindío, Colombia
const QUINDIO_CENTER = [4.5339, -75.6803]; // Armenia, Quindío
const QUINDIO_ZOOM = 11; // Zoom apropiado para ver el departamento

// Arreglo para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const EditarZona = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const featureGroupRef = useRef(null);
  
  const [zona, setZona] = useState({
    nombre_zona_trabajo: "",
    descripcion: "",
    coordenadas: []
  });
  
  const [zonaOriginal, setZonaOriginal] = useState(null);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mostrarAlertaCancelar, setMostrarAlertaCancelar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mapaListo, setMapaListo] = useState(false);
  
  // Configuración para el componente Draw de Leaflet
  const drawOptions = {
    rectangle: {
      shapeOptions: {
        color: '#3388ff',
        weight: 3
      },
      showArea: false,
      metric: false
    },
    polygon: {
      shapeOptions: {
        color: '#3388ff',
        weight: 3
      },
      showArea: false,
      metric: false,
      allowIntersection: false
    },
    circle: false,
    circlemarker: false,
    marker: false,
    polyline: false
  };
  
  // Aseguramos que el mapa se cargue solo después del renderizado completo
  useEffect(() => {
    setMapaListo(true);
  }, []);

  useEffect(() => {
    console.log("Estado modoEdicion:", modoEdicion);
  }, [modoEdicion]);
  
  // Cargar datos de la zona al iniciar
  useEffect(() => {
    const fetchZona = async () => {
      try {
        setLoading(true);
        const response = await areaService.getAreaById(id);
        
        if (response && response.data) {
          const zonaData = Array.isArray(response.data) ? response.data[0] : response.data;
          
          if (zonaData && zonaData.nombre_zona_trabajo) {
            // Procesar las coordenadas desde el formato que viene de la API
            let coordenadas = [];
            if (zonaData.coordenadas) {
              // Si las coordenadas ya vienen como array de objetos {lat, lng}
              coordenadas = zonaData.coordenadas;
            } else if (zonaData.latitud && zonaData.longitud) {
              // Si solo viene un punto como latitud/longitud 
              coordenadas = [{ lat: zonaData.latitud, lng: zonaData.longitud }];
            }
            
            const datosZona = {
              nombre_zona_trabajo: zonaData.nombre_zona_trabajo || "",
              descripcion: zonaData.descripcion || "",
              coordenadas: coordenadas
            };
            
            setZona(datosZona);
            setZonaOriginal(datosZona); // Guardamos los datos originales
          } else {
            setError("Los datos de la zona están incompletos o en un formato incorrecto");
          }
        } else {
          setError("No se encontraron datos de la zona");
        }
      } catch (error) {
        console.error("Error al cargar datos de la zona:", error);
        setError("Error al cargar los datos de la zona. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
        setModoEdicion(false);
      }
    };

    if (id) {
      fetchZona();
    } else {
      setError("No se proporcionó ID de zona");
    }
  }, [id]);

  // Función para verificar si hay cambios sin guardar
  const hayCambiosSinGuardar = () => {
    if (!zonaOriginal) return false;
    return zona.nombre_zona_trabajo !== zonaOriginal.nombre_zona_trabajo ||
           zona.descripcion !== zonaOriginal.descripcion ||
           JSON.stringify(zona.coordenadas) !== JSON.stringify(zonaOriginal.coordenadas);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setZona(prevZona => ({
      ...prevZona,
      [name]: value
    }));
  };

  // Función para manejar cuando se dibuja un área en el mapa
  const handleAreaCreated = (e) => {
    const { layerType, layer } = e;
    
    if (layerType === 'polygon' || layerType === 'rectangle') {
      // Obtener las coordenadas del polígono dibujado
      const coordenadas = layer.getLatLngs()[0].map(latlng => ({
        lat: latlng.lat,
        lng: latlng.lng
      }));
      
      // Guardar las coordenadas en el estado
      setZona(prev => ({
        ...prev,
        coordenadas: coordenadas
      }));
    }
  };

  // Función para manejar la edición de un área
  const handleAreaEdited = (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      const coordenadas = layer.getLatLngs()[0].map(latlng => ({
        lat: latlng.lat,
        lng: latlng.lng
      }));
      
      setZona(prev => ({
        ...prev,
        coordenadas: coordenadas
      }));
    });
  };

  // Función para manejar la eliminación de un área
  const handleAreaDeleted = () => {
    setZona(prev => ({
      ...prev,
      coordenadas: []
    }));
  };

  const handleEditarClick = () => {
    setModoEdicion(true);
  };
  
  const handleGuardarClick = (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!zona.nombre_zona_trabajo || !zona.descripcion) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }
    
    // Verificar si se han seleccionado coordenadas en el mapa (si se está editando)
    if (modoEdicion && (!zona.coordenadas || zona.coordenadas.length === 0)) {
      setError("Por favor selecciona un área en el mapa");
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
        coordenadas: zona.coordenadas
      };
      
      await areaService.updateArea(id, zonaData);
      
      // Actualizar el estado original con los nuevos datos guardados
      setZonaOriginal({...zona});
      setGuardado(true);
      setModoEdicion(false);
      
      setTimeout(() => {
        setGuardado(false);
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar zona:", error);
      setError("Error al actualizar la zona. Por favor, intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    if (hayCambiosSinGuardar()) {
      setMostrarAlertaCancelar(true);
    } else {
      // Si no hay cambios, simplemente volver al modo vista
      if (modoEdicion) {
        setModoEdicion(false);
        // Restaurar datos originales
        setZona({...zonaOriginal});
      } else {
        navigate("/gestion-zonas");
      }
    }
  };

  const handleConfirmarCancelar = () => {
    setMostrarAlertaCancelar(false);
    
    if (modoEdicion) {
      // Si estamos en modo edición, volver al modo vista y restaurar datos originales
      setModoEdicion(false);
      setZona({...zonaOriginal});
    } else {
      // Si estamos en modo vista, volver a la lista de zonas
      navigate("/gestion-zonas");
    }
  };

  const handleVolverClick = () => {
    navigate("/gestion-zonas");
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-auto md:fixed md:top-0 md:left-0 md:h-full z-10">
        <div className="block md:hidden">
          <Sidebar />
        </div>
        <div className="hidden md:block">
          <Sidebar />
        </div>
      </div>
      <div className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 pl-2 pr-10 ml-10">
        <Tipografia>
          <div className="mt-4 mb-5">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 ml-8">
              {modoEdicion ? "Editar Zona" : "Información de la Zona"}
            </h1>
          </div>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg ml-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          <div className="max-w-4xl mx-auto pl-6 pr-3">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
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
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150 ease-in-out ${!modoEdicion ? 'bg-gray-100' : ''}`}
                      disabled={!modoEdicion}
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
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150 ease-in-out h-32 ${!modoEdicion ? 'bg-gray-100' : ''}`}
                      disabled={!modoEdicion}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Ubicación
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden h-[300px] sm:h-[400px]" id="map-container">
                      {mapaListo && (
                        <MapContainer 
                          center={QUINDIO_CENTER} 
                          zoom={QUINDIO_ZOOM} 
                          style={{ width: '100%', height: '100%' }}
                          ref={mapRef}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          />
                          
                          {/* Si estamos en modo vista, mostrar el polígono sin controles de edición */}
                          {!modoEdicion && zona.coordenadas && zona.coordenadas.length > 0 && (
                            <Polygon 
                              positions={zona.coordenadas.map(coord => [coord.lat, coord.lng])}
                              pathOptions={{ color: '#3388ff', weight: 3 }}
                            />
                          )}
                          
                          {/* Si estamos en modo edición, mostrar los controles de dibujo */}
                          {modoEdicion && (
                            <FeatureGroup ref={featureGroupRef}>
                              <EditControl
                                position="topright"
                                onCreated={handleAreaCreated}
                                onEdited={handleAreaEdited}
                                onDeleted={handleAreaDeleted}
                                draw={drawOptions}
                              />
                              
                              {/* Si ya hay coordenadas, mostrarlas como un polígono editable */}
                              {zona.coordenadas && zona.coordenadas.length > 0 && (
                                <Polygon 
                                  positions={zona.coordenadas.map(coord => [coord.lat, coord.lng])}
                                  pathOptions={{ color: '#3388ff', weight: 3 }}
                                />
                              )}
                            </FeatureGroup>
                          )}
                        </MapContainer>
                      )}
                    </div>
                    {modoEdicion && (
                      <p className="text-sm text-gray-500">
                        {zona.coordenadas && zona.coordenadas.length > 0 
                          ? `Área seleccionada con ${zona.coordenadas.length} puntos. Puedes editar o eliminar el área dibujada.`
                          : "Dibuja un polígono o rectángulo para seleccionar el área de la zona."}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end pt-6 border-t border-gray-100">
                {!modoEdicion ? (
                  <>
                    <Boton
                      onClick={handleVolverClick}
                      label="Volver"
                      tipo="secundario"
                      className="w-full sm:w-auto"
                    />
                    <Boton
                      onClick={handleEditarClick}
                      label="Editar"
                      tipo="primario"
                      className="w-full sm:w-auto"
                    />
                  </>
                ) : (
                  <>
                    <Boton
                      onClick={handleCancelar}
                      label="Cancelar"
                      tipo="secundario"
                      className="w-full sm:w-auto"
                    />
                    <Boton
                      onClick={handleGuardarClick}
                      label="Guardar cambios"
                      tipo="primario"
                      className="w-full sm:w-auto"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </Tipografia>
      </div>

      {/* Modal de confirmación de guardar */}
      {mostrarAlerta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-5">
              <div className="text-center">
                <Tipografia>
                  <Icono name="confirmar" size="70" />
                  <h3 className="text-xl font-medium text-black mb-2">
                    ¿Desea guardar los cambios?
                  </h3>
                  <p className="text-base text-black">
                    Esta acción actualizará la información de la zona. ¿Estás
                    seguro de continuar?
                  </p>
                </Tipografia>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <Boton
                onClick={handleConfirmarGuardar}
                label="Confirmar"
                tipo="primario"
                className="w-full"
              />
              <Boton
                onClick={() => setMostrarAlerta(false)}
                label="Cancelar"
                tipo="secundario"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación exitosa */}
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
                </Tipografia>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de cancelar */}
      {mostrarAlertaCancelar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-5">
              <div className="text-center">
                <Tipografia>
                  <Icono name="cancelar" size="50" color="#F87171" />
                  <h3 className="text-lg font-medium text-black mb-3">
                    ¿Desea salir sin guardar?
                  </h3>
                  <p className="text-sm text-black mb-4">
                    Hay cambios sin guardar. Si sales ahora, perderás los cambios realizados.
                  </p>
                </Tipografia>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-col gap-3">
              <Boton
                onClick={handleConfirmarCancelar}
                label={modoEdicion ? "Descartar cambios" : "Salir sin guardar"}
                tipo="cancelar"
                className="w-full"
              />
              <Boton
                onClick={() => setMostrarAlertaCancelar(false)}
                label={modoEdicion ? "Continuar editando" : "Continuar"}
                tipo="secundario"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarZona;