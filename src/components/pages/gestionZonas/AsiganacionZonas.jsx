import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService, areaService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Sidebar from "../../organisms/Sidebar";
import Loading from "../../Loading/Loading";
import Botones from "../../atoms/Botones";

const AsignacionZonas = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID del colaborador
  const [selectedZonas, setSelectedZonas] = useState([]);
  const [zonasList, setZonasList] = useState([]);
  const [nombreColaborador, setNombreColaborador] = useState("Colaborador");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          selected: false
        }));
        
        // Verificar IDs únicos
        const ids = zonas.map(zona => zona.id);
        const uniqueIds = [...new Set(ids)];
        
        if (ids.length !== uniqueIds.length) {
          console.error("Advertencia: Hay IDs duplicados en las zonas", ids);
        }
        
        setZonasList(zonas);
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
    // Usando una función para actualizar el estado que recibe el estado anterior
    setZonasList(prevZonas => {
      return prevZonas.map(zona => 
        zona.id === zonaId
          ? { ...zona, selected: !zona.selected }
          : zona
      );
    });
    
    // Actualizar la lista de IDs seleccionados
    setSelectedZonas(prevSelectedIds => {
      const isSelected = prevSelectedIds.includes(zonaId);
      if (isSelected) {
        return prevSelectedIds.filter(id => id !== zonaId);
      } else {
        return [...prevSelectedIds, zonaId];
      }
    });
  }, []);

  const handleAsignar = async () => {
    if (selectedZonas.length === 0) {
      alert("Por favor seleccione al menos una zona");
      return;
    }

    try {
      setLoading(true);
      await userService.assignZonasToUser(id, selectedZonas);
      alert(`Zonas asignadas con éxito a ${nombreColaborador}`);
      navigate("/gestion/usuarios");
    } catch (err) {
      console.error("Error al asignar zonas:", err);
      setError("Error al asignar zonas. Por favor, intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando zonas..." />;
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
                  variant="outlined"
                  onClick={() => navigate("/gestion/usuarios")}
                  icon="back"
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
            </div>

            {error && (
              <div className="mx-0 my-2 bg-red-100 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded-md">
                <Tipografia className="text-red-700 text-sm">{error}</Tipografia>
              </div>
            )}

            <div className="flex flex-col space-y-3 w-full">
              <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 w-full">
                <div className="flex flex-col space-y-4">
                  {/* Botón de asignar */}
                  <div className="flex justify-end">
                    <Botones
                      label="Asignar Zonas"
                      variant="contained"
                      onClick={handleAsignar}
                      disabled={selectedZonas.length === 0}
                    />
                  </div>

                  {/* Lista de zonas - COMPLETAMENTE REDISEÑADA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {zonasList.length > 0 ? (
                      zonasList.map((zona) => (
                        <label 
                          key={zona.id}
                          className={`bg-white border rounded-lg p-4 flex items-start space-x-4 hover:shadow-md transition-all cursor-pointer
                            ${zona.selected ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                        >
                          <div className="flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={zona.selected}
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
                              <Tipografia variant="body2" className="text-gray-600">
                                Ciudad: {zona.ciudad}
                              </Tipografia>
                              <Tipografia variant="body2" className="text-gray-600">
                                {zona.descripcion}
                              </Tipografia>
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
      </Tipografia>
    </div>
  );
};

export default AsignacionZonas;