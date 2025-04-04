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
        }
        
        // Obtener todas las zonas
        const zonasResponse = await areaService.getAllAreas();
        
        // Verificar que los datos sean correctos
        if (!Array.isArray(zonasResponse.data)) {
          throw new Error("Los datos de zonas no son válidos");
        }
        
        // Transformar los datos y asegurar que los IDs sean únicos
        const zonas = zonasResponse.data.map(zona => ({
          id: zona.id_zona_trabajo,
          nombre: zona.nombre_zona_trabajo,
          ciudad: zona.ciudad,
          descripcion: zona.descripcion,
          selected: false,
          disabled: false
        }));
        
        // Verificar IDs únicos
        const ids = zonas.map(zona => zona.id);
        const uniqueIds = [...new Set(ids)];
        
        if (ids.length !== uniqueIds.length) {
          console.error("Advertencia: Hay IDs duplicados en las zonas", ids);
        }
        
        // Verificar zonas ya asignadas al usuario
        try {
          const zonasUsuarioResponse = await userService.getUserZonas(id);
          if (zonasUsuarioResponse.data && Array.isArray(zonasUsuarioResponse.data.zonas)) {
            const zonasAsignadas = zonasUsuarioResponse.data.zonas;
            const zonasAsignadasIds = zonasAsignadas.map(zona => zona.id_zona_de_trabajo);

            // Guardar las zonas ya asignadas
            setZonasYaAsignadas(zonasAsignadasIds);

            // Marcar zonas como seleccionadas y deshabilitadas
            const zonasConSeleccion = zonas.map(zona => {
              const yaAsignada = zonasAsignadasIds.includes(zona.id);
              return {
                ...zona,
                selected: yaAsignada,
                disabled: yaAsignada,
              };
            });

            // Establecer el estado completo una sola vez
            setSelectedZonas(zonasAsignadasIds);
            setZonasList(zonasConSeleccion);
          } else {
            setZonasList(zonas);
          }
        } catch (err) {
          console.error("Error al cargar zonas asignadas:", err);
          setZonasList(zonas);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar datos. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Función para manejar la selección de zona usando useCallback
  const handleSelectZona = useCallback((zonaId) => {
    setZonasList(prevZonas =>
      prevZonas.map(zona => {
        if (zona.id === zonaId) {
          if (zona.disabled) return zona; // no cambiar zonas deshabilitadas
          return { ...zona, selected: !zona.selected };
        }
        return zona;
      })
    );

    setSelectedZonas(prevSelected => {
      return prevSelected.includes(zonaId)
        ? prevSelected.filter(id => id !== zonaId)
        : [...prevSelected, zonaId];
    });
  }, []);

  const handleAsignar = async () => {
    if (selectedZonas.length === 0) {
      setError("Por favor seleccione al menos una zona");
      return;
    }

    try {
      setAsignando(true);
      // Usar la API correcta para asignar zonas al usuario
      await userService.assignZonasToUser(id, { zonas: selectedZonas });
      
      // Mostrar mensaje de éxito
      setSuccessMessage(`Zonas asignadas con éxito a ${nombreColaborador}`);
      setShowSuccessAlert(true);
    } catch (err) {
      console.error("Error al asignar zonas:", err);
      setError("Error al asignar zonas. Por favor, intenta de nuevo más tarde.");
    } finally {
      setAsignando(false);
    }
  };

  const closeSuccessAlert = () => {
    setShowSuccessAlert(false);
    // Redirigir al usuario después de cerrar la alerta de éxito
    navigate(`/zonas-asignadas/${id}`);
  };

  const clearError = () => {
    setError("");
  };

  if (loading) {
    return <Loading message="Cargando zonas..." />;
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <div className="fixed top-0 left-0 h-full w-14 sm:w-16 md:w-20 lg:w-20 z-10">
        <Sidebar />
      </div>
      
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
                  onClick={() => navigate(`/zonas-asignadas/${id}`)}
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
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <Tipografia className="text-orange-800 font-medium">
                    Este colaborador ya tiene {zonasYaAsignadas.length} zona{zonasYaAsignadas.length !== 1 ? 's' : ''} asignada{zonasYaAsignadas.length !== 1 ? 's' : ''}
                  </Tipografia>
                  <Tipografia className="text-orange-700 text-sm mt-1">
                    Las zonas ya asignadas aparecerán marcadas y no se pueden deseleccionar.
                  </Tipografia>
                </div>
              )}
            </div>

            {error && (
              <div className="mx-0 my-2 bg-red-100 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded-md flex justify-between items-center">
                <Tipografia className="text-red-700 text-sm">{error}</Tipografia>
                <button onClick={clearError} className="text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
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
                      zonasList.map((zona) => (
                        <label 
                          key={zona.id}
                          className={`bg-white border rounded-lg p-4 flex items-start space-x-4 hover:shadow-md transition-all cursor-pointer
                            ${zona.selected ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}
                            ${zona.disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={zona.selected}
                              disabled={zona.disabled}
                              onChange={() => handleSelectZona(zona.id)}
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
                              {zona.disabled && (
                                <Tipografia variant="body2" className="text-orange-600 font-medium">
                                  Ya asignada
                                </Tipografia>
                              )}
                            </div>
                          </div>
                        </label>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <Tipografia variant="body1" className="text-gray-500">
                          No se encontraron zonas disponibles.
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
                <Icono name="confirmar" size="65"/>
              </div>
              <Tipografia size="lg" className="font-bold mb-2">¡Operación exitosa!</Tipografia>
              <Tipografia className="text-gray-600 mb-4">
                {successMessage}
              </Tipografia>
              <Botones
                tipo="primario"
                label="Aceptar"
                size="large"
                onClick={closeSuccessAlert}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsignacionZonas; 