import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService, areaService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Sidebar from "../../organisms/Sidebar";
import Loading from "../../Loading/Loading";
import Botones from "../../atoms/Botones";
import Icono from "../../../components/atoms/Iconos";

const AsignacionZonas = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID del colaborador
  const [selectedZonas, setSelectedZonas] = useState([]);
  const [zonasList, setZonasList] = useState([]);
  const [nombreColaborador, setNombreColaborador] = useState("Colaborador");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [asignando, setAsignando] = useState(false);
  const [zonasYaAsignadas, setZonasYaAsignadas] = useState([]);

  // Cargar datos del colaborador y zonas disponibles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener detalles del colaborador
        if (id) {
          const colaboradorResponse = await userService.getUserById(id);
          setNombreColaborador(colaboradorResponse.data.nombreCompleto || "Colaborador");
          console.log("Respuesta del perfil de usuario:", colaboradorResponse);
          console.log("ID del colaborador:", id);
        }
        
        // Primero obtener zonas ya asignadas al usuario
        let zonasAsignadasIds = [];
        try {
          const zonasUsuarioResponse = await userService.getUserZonas(id);
          console.log("Respuesta de zonas del usuario:", zonasUsuarioResponse);
          
          if (zonasUsuarioResponse.data && Array.isArray(zonasUsuarioResponse.data.zonas)) {
            const zonasAsignadas = zonasUsuarioResponse.data.zonas;
            console.log("Zonas asignadas:", zonasAsignadas);
            
            // Extraer los IDs
            zonasAsignadasIds = zonasAsignadas.map(zona => {
              // Puede venir en diferentes formatos según la API
              return zona.id_zona_de_trabajo || zona.id_zona_trabajo || zona.id || zona.zona_id;
            }).filter(id => id !== undefined);
            
            console.log("IDs de zonas asignadas:", zonasAsignadasIds);
            setZonasYaAsignadas(zonasAsignadasIds);
          }
        } catch (err) {
          console.error("Error al cargar zonas asignadas:", err);
        }
        
        // Obtener todas las zonas
        const zonasResponse = await areaService.getAllAreas();
        console.log("Todas las zonas disponibles:", zonasResponse);
        
        // Verificar que los datos sean correctos
        if (!Array.isArray(zonasResponse.data)) {
          throw new Error("Los datos de zonas no son válidos");
        }
        
        // Crear un mapa para zonasAsignadasIds para búsqueda más eficiente
        const zonasAsignadasMap = new Map();
        zonasAsignadasIds.forEach(id => {
          console.log(`Agregando ID asignada al mapa: ${id} (tipo: ${typeof id})`);
          zonasAsignadasMap.set(String(id), true);
        });
        
        console.log("Mapa de zonas asignadas:", [...zonasAsignadasMap.keys()]);
        console.log("Cantidad de zonas totales antes de filtrado:", zonasResponse.data.length);
        
        // Filtrar las zonas que ya están asignadas
        const zonasDisponibles = zonasResponse.data.filter(zona => {
          // Obtener el ID de la zona - CORREGIDO con el nombre exacto de la propiedad
          const zonaId = zona.id_zona_de_trabajo || zona.id_zona_trabajo || zona.id;
          const zonaIdStr = String(zonaId);
          
          // Verificar si esta zona ya está asignada al usuario
          const estaAsignada = zonasAsignadasMap.has(zonaIdStr);
          
          console.log(`Zona ID: ${zonaIdStr}, Nombre: ${zona.nombre_zona_trabajo || 'Sin nombre'}, ¿Ya asignada?: ${estaAsignada}`);
          
          return !estaAsignada;
        });

        // Transformar los datos filtrados
        const zonas = zonasDisponibles.map((zona, index) => {
          // Corregido para usar la propiedad correcta
          const zonaId = zona.id_zona_de_trabajo || zona.id_zona_trabajo || zona.id || `fallback_${index}`;
          console.log(`Transformando zona: ID=${zonaId}, Nombre=${zona.nombre_zona_trabajo || 'Sin nombre'}`);
          
          return {
            id: zonaId,
            nombre: zona.nombre_zona_trabajo || `Zona ${zonaId}`,
            ciudad: zona.ciudad,
            descripcion: zona.descripcion,
            selected: false // Inicialmente no seleccionada
          };
        });
        
        // Verificar IDs únicos y corregir si hay duplicados
        const idsMap = new Map();
        const zonasConIdsUnicos = zonas.map((zona, index) => {
          const idStr = String(zona.id);
          if (idsMap.has(idStr)) {
            // Si hay un ID duplicado, crear un ID único
            const nuevoId = `${zona.id}_${index}`;
            console.log(`ID duplicado encontrado: ${zona.id}, asignando nuevo ID: ${nuevoId}`);
            return { ...zona, id: nuevoId };
          } else {
            idsMap.set(idStr, true);
            return zona;
          }
        });
        
        setSelectedZonas([]);
        setZonasList(zonasConIdsUnicos);
        
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar datos. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Función para manejar la selección de zona
  const handleSelectZona = useCallback((zonaId) => {
    // Actualizar el estado de la lista de zonas
    setZonasList(prevZonas => 
      prevZonas.map(zona => 
        zona.id === zonaId ? { ...zona, selected: !zona.selected } : zona
      )
    );
    
    // Actualizar el array de zonas seleccionadas
    setSelectedZonas(prevSelected => {
      const isCurrentlySelected = prevSelected.includes(zonaId);
      if (isCurrentlySelected) {
        return prevSelected.filter(id => id !== zonaId);
      } else {
        return [...prevSelected, zonaId];
      }
    });
  }, []);

  const handleAsignar = async () => {
    if (selectedZonas.length === 0) {
      setError("Por favor seleccione al menos una zona");
      return;
    }

    try {
      setAsignando(true);
      console.log("Enviando al servidor los siguientes IDs de zonas:", selectedZonas);
      console.log("ID del usuario:", id);
      
      await userService.assignZonasToUser(id, selectedZonas);
      
      // Mostrar mensaje de éxito
      setSuccessMessage(`Zonas asignadas con éxito a ${nombreColaborador}`);
      setShowSuccessAlert(true);
    } catch (err) {
      console.error("Error al asignar zonas:", err);
      setError(`Error al asignar zonas: ${err.message}. Por favor, intenta de nuevo más tarde.`);
    } finally {
      setAsignando(false);
    }
  };

  const closeSuccessAlert = () => {
    setShowSuccessAlert(false);
    // Redirigir al usuario después de cerrar la alerta de éxito
    navigate(`/gestion-zonas/colaboradores/${id}`);
  };

  const clearError = () => {
    setError("");
  };

  if (loading) {
    return <Loading message="Cargando zonas" />;
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <div className="fixed top-0 left-0 h-full w-14 sm:w-16 md:w-20 lg:w-20 z-10">
        <Sidebar />
      </div>
      
      <Tipografia>
      <div className="w-full flex-1 pl-[4.3rem] sm:pl-16 md:pl-20 lg:pl-20 xl:pl-20 px-2 sm:px-4 md:px-6 lg:px-2 py-4 overflow-x-hidden bg-slate-50">
        <div className="max-w-[1600px] mx-auto">
          <div className="w-full">
            {/* Header */}
            <div className="mt-2 mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                  Asignación de Zonas
                </h1>
                <Botones
                  label="Volver"
                  tipo="secundario"
                  onClick={() => navigate(`/gestion-zonas/colaboradores/${id}`)}
                  size="small"
                />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <Tipografia 
                  variant="h5" 
                  className="text-gray-700 font-medium"
                >
                  Colaborador:
                </Tipografia>
                <Tipografia 
                  variant="h4" 
                  className="text-orange-600 font-semibold mt-1"
                >
                  {nombreColaborador}
                </Tipografia>
              </div>

              {zonasYaAsignadas.length > 0 && (
                <div className="flex flex-col bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <Tipografia className="text-orange-800 font-medium">
                    Este colaborador ya tiene {zonasYaAsignadas.length} zona{zonasYaAsignadas.length !== 1 ? 's' : ''} asignada{zonasYaAsignadas.length !== 1 ? 's' : ''}
                  </Tipografia>
                  <Tipografia className="text-orange-700 text-sm mt-1">
                    Solo se muestran las zonas que aún no han sido asignadas a este colaborador.
                  </Tipografia>
                </div>
              )}
            </div>

            {error && (
              <div className="mx-0 my-2 bg-red-100 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded-md flex items-center">
                <Icono className="mr-2" name="eliminarAlert" size={20} />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex flex-col space-y-3 w-full">
              <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 w-full">
                <div className="flex flex-col space-y-4">
                  {/* Botón de asignar */}
                  <div className="flex justify-end">
                    <Botones
                      label="Asignar Zonas"
                      tipo="primario"
                      onClick={handleAsignar}
                      disabled={selectedZonas.length === 0 || asignando}
                    />
                  </div>

                  {/* Lista de zonas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {zonasList.length > 0 ? (
                      zonasList.map((zona, index) => (
                        <div 
                          key={`zona-${zona.id}-${index}`}
                          className={`bg-white border rounded-lg p-4 flex items-start space-x-4 hover:shadow-md transition-all cursor-pointer
                            ${zona.selected ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                          onClick={() => handleSelectZona(zona.id)}
                        >
                          <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={zona.selected}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSelectZona(zona.id);
                              }}
                              className="w-5 h-5 rounded border-orange-500 text-orange-600 focus:ring-orange-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Tipografia 
                              variant="h6" 
                              className={`font-medium truncate ${zona.selected ? 'text-orange-700' : 'text-gray-900'}`}
                            >
                              {zona.nombre}
                            </Tipografia>
                            <div className="mt-1 space-y-1">
                              {zona.ciudad && (
                                <Tipografia variant="body2" className="text-gray-600">
                                  Ciudad: {zona.ciudad}
                                </Tipografia>
                              )}
                              {zona.descripcion && (
                                <Tipografia variant="body2" className="text-gray-600">
                                  {zona.descripcion}
                                </Tipografia>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <Tipografia variant="body1" className="text-gray-500">
                          No se encontraron zonas disponibles para asignar.
                        </Tipografia>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de Éxito */}
{showSuccessAlert && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-md w-full">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center mb-4">
          <Icono name="confirmar" size="50"/>
        </div>
        <Tipografia size="lg" className="font-bold mb-2">¡Operación exitosa!</Tipografia>
        <Tipografia className="text-gray-600 mb-4">
          {successMessage}
        </Tipografia>
        <Botones
          label="Aceptar"
          tipo="primario"
          onClick={() => {
            setShowSuccessAlert(false);
            navigate(`/gestion-zonas/colaboradores/${id}`);
          }}
        />
      </div>
    </div>
  </div>
)}
      </Tipografia>
    </div>
  );
};

export default AsignacionZonas;