import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { areaService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Icono from "../../../components/atoms/Iconos";
import Boton from "../../../components/atoms/Botones";
import Sidebar from "../../organisms/Sidebar";
// Importamos la biblioteca de Leaflet para el mapa
import L from 'leaflet';
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// Coordenadas centrales del departamento del Quindío, Colombia
const QUINDIO_CENTER = [4.5339, -75.6803]; // Armenia, Quindío
const QUINDIO_ZOOM = 11; // Zoom apropiado para ver el departamento

// Arreglo para los iconos de Leaflet
// Esto es necesario porque Leaflet espera que las imágenes estén en la ruta del servidor
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// DEPURACIÓN: Monkey patch para areaService.createArea
const originalCreateArea = areaService.createArea;
areaService.createArea = async (data) => {
  console.log('DEPURACIÓN - Datos antes de enviar al servicio:', JSON.stringify(data));
  
  // Eliminamos explícitamente cualquier referencia a la coordenada problemática
  if (typeof data.coordenadas === 'string' && data.coordenadas.includes('23.6345, -102.5528')) {
    console.log('DEPURACIÓN - Se encontró la coordenada problemática en formato string');
    data.coordenadas = [];
  }
  
  if (typeof data.descripcion === 'string' && data.descripcion.includes('23.6345, -102.5528')) {
    console.log('DEPURACIÓN - Se encontró la coordenada problemática en la descripción');
    data.descripcion = data.descripcion.replace(/23\.6345,\s*-102\.5528/g, '').trim();
  }
  
  console.log('DEPURACIÓN - Datos después de limpiar:', JSON.stringify(data));
  return originalCreateArea(data);
};

const RegistrarZona = () => {
  console.log('DEPURACIÓN - Componente RegistrarZona inicializándose');
  
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [zona, setZona] = useState({
    nombre_zona_trabajo: "",
    descripcion: "",
    coordenadas: []
  });
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [error, setError] = useState("");
  const [areaSeleccionada, setAreaSeleccionada] = useState(false);
  const [mapaListo, setMapaListo] = useState(false);
  
  // DEPURACIÓN: Monitoreo del estado de zona
  useEffect(() => {
    console.log('DEPURACIÓN - Estado zona actualizado:', JSON.stringify(zona));
    
    // Verificar si hay coordenadas problemáticas en el estado
    if (JSON.stringify(zona).includes('23.6345') || JSON.stringify(zona).includes('-102.5528')) {
      console.warn('DEPURACIÓN - ALERTA: Coordenada problemática detectada en el estado');
    }
  }, [zona]);
  
  // Configuración para el componente Draw de Leaflet
  const drawOptions = {
    rectangle: {
      shapeOptions: {
        color: '#3388ff',
        weight: 3
      },
      showArea: false, // Desactivar cálculo de área para evitar error
      metric: false // Desactivar métricas para evitar error
    },
    polygon: {
      shapeOptions: {
        color: '#3388ff',
        weight: 3
      },
      showArea: false, // Desactivar cálculo de área para evitar error
      metric: false, // Desactivar métricas para evitar error
      allowIntersection: false // Evitar auto-intersección
    },
    circle: false,
    circlemarker: false,
    marker: false,
    polyline: false
  };
  
  // Aseguramos que el mapa se cargue solo después del renderizado completo
  useEffect(() => {
    console.log('DEPURACIÓN - Componente montado, estableciendo mapaListo=true');
    setMapaListo(true);
    
    // Verificar si hay elementos globales que puedan estar inyectando las coordenadas
    console.log('DEPURACIÓN - Verificando variables globales');
    if (window.defaultCoordinates) {
      console.warn('DEPURACIÓN - Encontrada variable global window.defaultCoordinates:', window.defaultCoordinates);
    }
    
    // Interceptar cualquier modificación a la API antes de la destrucción del componente
    return () => {
      console.log('DEPURACIÓN - Componente desmontándose');
    };
  }, []);

  // Función para manejar los cambios en los inputs de texto
  const handleChange = (e) => {
    console.log(`DEPURACIÓN - handleChange para campo ${e.target.name}:`, e.target.value);
    
    const { name, value } = e.target;
    // Prevenir que se añada "23.6345, -102.5528" si viene de alguna automatización
    if (value.includes("23.6345, -102.5528")) {
      console.warn('DEPURACIÓN - Valor problemático detectado en input, bloqueando cambio');
      return;
    }
    
    setZona(prev => {
      const nuevoEstado = {
        ...prev,
        [name]: value
      };
      console.log(`DEPURACIÓN - Nuevo estado después de handleChange:`, nuevoEstado);
      return nuevoEstado;
    });
  };

  // Función para manejar cuando se dibuja un área en el mapa
  const handleAreaCreated = (e) => {
    console.log('DEPURACIÓN - handleAreaCreated:', e.layerType);
    
    const { layerType, layer } = e;
    
    if (layerType === 'polygon' || layerType === 'rectangle') {
      // Obtener las coordenadas del polígono dibujado
      const coordenadas = layer.getLatLngs()[0].map(latlng => ({
        lat: latlng.lat,
        lng: latlng.lng
      }));
      
      console.log('DEPURACIÓN - Coordenadas dibujadas:', coordenadas);
      
      // Guardar las coordenadas en el estado
      setZona(prev => {
        const nuevoEstado = {
          ...prev,
          coordenadas: coordenadas
        };
        console.log('DEPURACIÓN - Nuevo estado con coordenadas:', nuevoEstado);
        return nuevoEstado;
      });
      
      setAreaSeleccionada(true);
    }
  };

  // Función para manejar la edición de un área
  const handleAreaEdited = (e) => {
    console.log('DEPURACIÓN - handleAreaEdited');
    
    const layers = e.layers;
    layers.eachLayer((layer) => {
      const coordenadas = layer.getLatLngs()[0].map(latlng => ({
        lat: latlng.lat,
        lng: latlng.lng
      }));
      
      console.log('DEPURACIÓN - Coordenadas editadas:', coordenadas);
      
      setZona(prev => {
        const nuevoEstado = {
          ...prev,
          coordenadas: coordenadas
        };
        console.log('DEPURACIÓN - Nuevo estado después de edición:', nuevoEstado);
        return nuevoEstado;
      });
    });
  };

  // Función para manejar la eliminación de un área
  const handleAreaDeleted = () => {
    console.log('DEPURACIÓN - handleAreaDeleted');
    
    setZona(prev => {
      const nuevoEstado = {
        ...prev,
        coordenadas: []
      };
      console.log('DEPURACIÓN - Nuevo estado después de eliminar área:', nuevoEstado);
      return nuevoEstado;
    });
    
    setAreaSeleccionada(false);
  };

  const handleGuardarClick = (e) => {
    console.log('DEPURACIÓN - handleGuardarClick');
    e.preventDefault();
    
    console.log('DEPURACIÓN - Estado zona antes de validar:', JSON.stringify(zona));
    
    // Verificar si los campos necesarios están completos
    if (!zona.nombre_zona_trabajo || !zona.descripcion) {
      console.log('DEPURACIÓN - Error: campos incompletos');
      setError("Por favor completa todos los campos requeridos");
      return;
    }
    
    // Verificar si se han seleccionado coordenadas en el mapa
    if (!zona.coordenadas || zona.coordenadas.length === 0) {
      console.log('DEPURACIÓN - Error: no hay coordenadas');
      setError("Por favor selecciona un área en el mapa");
      return;
    }
    
    // Verificar que no haya datos incorrectos
    let zonaLimpia = {...zona};
    
    if (typeof zonaLimpia.descripcion === 'string' && zonaLimpia.descripcion.includes("23.6345, -102.5528")) {
      console.warn('DEPURACIÓN - Limpiando coordenada problemática de la descripción');
      zonaLimpia.descripcion = zonaLimpia.descripcion.replace(/23\.6345,\s*-102\.5528/g, "").trim();
      setZona(zonaLimpia);
    }
    
    // Verificar el tipo de coordenadas
    if (typeof zonaLimpia.coordenadas === 'string') {
      console.warn('DEPURACIÓN - ALERTA: coordenadas en formato string en lugar de array:', zonaLimpia.coordenadas);
      
      if (zonaLimpia.coordenadas.includes("23.6345, -102.5528")) {
        console.warn('DEPURACIÓN - Reemplazando coordenadas problemáticas con array vacío');
        zonaLimpia.coordenadas = [];
        setZona(zonaLimpia);
        setError("Por favor selecciona un área en el mapa");
        return;
      }
    }
    
    console.log('DEPURACIÓN - Datos a guardar después de limpieza:', JSON.stringify(zonaLimpia));
    setMostrarAlerta(true);
  };

  const handleConfirmarGuardar = async () => {
    console.log('DEPURACIÓN - handleConfirmarGuardar');
    setMostrarAlerta(false);
    setError("");
    
    try {
      // Aseguramos que se guarden las coordenadas exactas seleccionadas en el mapa
      const zonaData = {
        nombre_zona_trabajo: zona.nombre_zona_trabajo,
        descripcion: zona.descripcion,
        coordenadas: zona.coordenadas // Aquí están las coordenadas reales del área seleccionada
      };
      
      // Verificación final antes de enviar
      if (JSON.stringify(zonaData).includes("23.6345") || JSON.stringify(zonaData).includes("-102.5528")) {
        console.error('DEPURACIÓN - ALERTA CRÍTICA: Coordenadas problemáticas aún presentes antes de enviar');
        
        // Limpieza final forzada
        if (typeof zonaData.coordenadas === 'string' && zonaData.coordenadas.includes("23.6345")) {
          console.warn('DEPURACIÓN - Limpieza final: Reemplazando string de coordenadas con array');
          zonaData.coordenadas = [];
        }
        
        if (typeof zonaData.descripcion === 'string' && zonaData.descripcion.includes("23.6345")) {
          console.warn('DEPURACIÓN - Limpieza final: Eliminando coordenadas de la descripción');
          zonaData.descripcion = zonaData.descripcion.replace(/23\.6345,\s*-102\.5528/g, "").trim();
        }
      }
      
      console.log("DEPURACIÓN - Guardando zona con coordenadas:", JSON.stringify(zonaData.coordenadas));
      const respuesta = await areaService.createArea(zonaData);
      console.log("DEPURACIÓN - Respuesta del servidor:", respuesta);
      navigate("/gestion-zonas");
    } catch (error) {
      console.error("DEPURACIÓN - Error al crear zona:", error);
      setError("Error al crear la zona. Por favor, intenta de nuevo más tarde.");
    }
  };

  const handleCancelar = () => {
    console.log('DEPURACIÓN - handleCancelar');
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
      <main className="w-full md:pl-[280px] pt-[64px] md:pt-4 pl-10">
        <div className="px-4 md:px-6 lg:px-8">
          <Tipografia>
            <div className="py-4">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Registrar Zona</h1>
            </div>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            <div className="max-w-4xl mx-auto">
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

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">
                        Ubicación
                      </label>
                      <div className="border border-gray-300 rounded-lg overflow-hidden h-[300px] sm:h-[400px]" id="map-container">
                        {/* Implementación del mapa con Leaflet usando efecto de renderizado condicional */}
                        {mapaListo && (
                          <MapContainer 
                            center={QUINDIO_CENTER} // Centrado en Quindío, Colombia
                            zoom={QUINDIO_ZOOM} 
                            style={{ width: '100%', height: '100%' }}
                            ref={mapRef}
                          >
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            <FeatureGroup>
                              <EditControl
                                position="topright"
                                onCreated={handleAreaCreated}
                                onEdited={handleAreaEdited}
                                onDeleted={handleAreaDeleted}
                                draw={drawOptions}
                              />
                            </FeatureGroup>
                          </MapContainer>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {areaSeleccionada 
                          ? `Área seleccionada con ${zona.coordenadas.length} puntos. Puedes editar o eliminar el área dibujada.`
                          : "Dibuja un polígono o rectángulo para seleccionar el área de la zona."}
                      </p>
                      {areaSeleccionada && (
                        <div className="mt-2 text-xs text-gray-600">
                          <p>Las coordenadas se guardarán automáticamente, no es necesario copiarlas a la descripción.</p>
                        </div>
                      )}
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
                    tipo="secundario"
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
                    Esta acción registrará una nueva zona con el área seleccionada. ¿Estás seguro de continuar?
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