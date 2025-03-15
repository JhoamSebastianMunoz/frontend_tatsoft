import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { areaService, clientService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";
import BarraZona from "../../../components/molecules/BarraZonas";
import Encabezado from "../../../components/molecules/Encabezado";
import SidebarAdm from "../../organisms/SidebarAdm";

const Zonas = () => {
  const navigate = useNavigate();
  const [zonas, setZonas] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar zonas al iniciar
  useEffect(() => {
    const fetchZonas = async () => {
      try {
        setLoading(true);
        const response = await areaService.getAllAreas();
        const zonasData = response.data;
        setZonas(zonasData);
        
        // Seleccionar la primera zona por defecto si hay zonas
        if (zonasData.length > 0) {
          setZonaSeleccionada(zonasData[0]);
        }
      } catch (error) {
        console.error("Error al cargar zonas:", error);
        setError("Error al cargar las zonas. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchZonas();
  }, []);

  // Cargar clientes cuando cambia la zona seleccionada
  useEffect(() => {
    const fetchClientes = async () => {
      if (!zonaSeleccionada) return;
      
      try {
        setLoading(true);
        const response = await areaService.getClientsInArea(zonaSeleccionada.id_zona_de_trabajo);
        setClientes(response.data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        setError("Error al cargar los clientes. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (zonaSeleccionada) {
      fetchClientes();
    }
  }, [zonaSeleccionada]);

  const handleZonaChange = (index) => {
    setZonaSeleccionada(zonas[index]);
  };

  const handleNuevoCliente = () => {
    // Redirigir a la página de creación de cliente
    navigate("/registrar-cliente");
  };

  const handleRealizarPreventa = (clienteId) => {
    // Redirigir a la página de preventa con el ID del cliente
    navigate(`/preventa/cliente/${clienteId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="fixed top-0 left-0 z-50 h-full">
        <SidebarAdm />
      </div>
      <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
        <Encabezado 
          className="py-4 md:py-5"
          mensaje="Zonas de Trabajo"
        />
      </div>

      {/* Contenedor principal que ocupa todo el ancho de pantalla */}
      <div className="flex flex-col px-4 pt-20 w-full pb-6">
        {error && (
          <div className="mx-4 my-2 bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md">
            <Tipografia className="text-red-700">{error}</Tipografia>
          </div>
        )}

        {/* Contenido principal */}
        <div className="flex flex-col space-y-4 w-full">
          <div className="bg-white rounded-lg shadow-md p-4 w-full">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <Tipografia variant="subtitle" className="text-purple-700 font-bold">
                  Selección de Zona
                </Tipografia>
                <Boton
                  label="Nuevo Cliente"
                  tipo="primario"
                  onClick={handleNuevoCliente}
                  size="medium"
                  iconName="user-plus"
                />
              </div>
              <div className="rounded-lg">
                {loading && !zonas.length ? (
                  <div className="flex justify-center">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-purple-200 h-8 w-8"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-purple-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ) : zonas.length > 0 ? (
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {zonas.map((zona, index) => (
                      <button
                        key={zona.id_zona_de_trabajo || index}
                        onClick={() => handleZonaChange(index)}
                        className={`px-4 py-2 rounded-full transition-all duration-200 ${
                          zonaSeleccionada && zona.id_zona_de_trabajo === zonaSeleccionada.id_zona_de_trabajo
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                            : 'bg-white border border-purple-200 hover:border-purple-400 text-purple-700 hover:shadow-sm'
                        }`}
                      >
                        <Tipografia className={`${
                          zonaSeleccionada && zona.id_zona_de_trabajo === zonaSeleccionada.id_zona_de_trabajo
                            ? 'text-white'
                            : 'text-purple-700'
                        }`}>
                          {zona.nombre_zona_trabajo}
                        </Tipografia>
                      </button>
                    ))}
                  </div>
                ) : (
                  <Tipografia className="text-center">No hay zonas disponibles.</Tipografia>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center">
              <Tipografia variant="subtitle" className="text-purple-700 font-bold">
                {zonaSeleccionada ? zonaSeleccionada.nombre_zona_trabajo : "Selecciona una zona"}
              </Tipografia>
              {clientes.length > 0 && (
                <div className="px-3 py-1 bg-green-200 rounded-full">
                  <Tipografia className="text-xs text-green-600">
                    {clientes.length} {clientes.length === 1 ? "cliente" : "clientes"}
                  </Tipografia>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 flex-1 w-full">
            <Tipografia variant="subtitle" className="text-purple-700 font-bold mb-4">
              Clientes
            </Tipografia>
            
            <div className="w-full">
              {loading && zonaSeleccionada ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mb-4"></div>
                  <Tipografia>Cargando clientes</Tipografia>
                </div>
              ) : clientes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clientes.map((cliente) => (
                    <div key={cliente.id_cliente} className="rounded-lg overflow-hidden border border-purple-100">
                      <div className="bg-gray-100 px-4 py-3">
                        <Tipografia className="text-purple-800 font-medium">
                          {cliente.nombre_completo_cliente}
                        </Tipografia>
                      </div>
                      <div className="p-4">
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Tipografia className="w-28 font-medium text-purple-700">CC:</Tipografia>
                              <Tipografia>{cliente.cedula}</Tipografia>
                            </div>
                            <div className="flex items-center">
                              <Tipografia className="w-28 font-medium text-purple-700">Nit:</Tipografia>
                              <Tipografia>{cliente.rut_nit || "No disponible"}</Tipografia>
                            </div>
                            <div className="flex items-center">
                              <Tipografia className="w-28 font-medium text-purple-700">Razón Social:</Tipografia>
                              <Tipografia>{cliente.razon_social || "No disponible"}</Tipografia>
                            </div>
                            <div className="flex items-center">
                              <Tipografia className="w-28 font-medium text-purple-700">Teléfono:</Tipografia>
                              <Tipografia>{cliente.telefono || "No disponible"}</Tipografia>
                            </div>
                          </div>
                        </div>
                        <button 
                          className="w-full bg-purple-600 to-indigo-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center"
                          onClick={() => handleRealizarPreventa(cliente.id_cliente)}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <Tipografia className="text-white">Realizar preventa</Tipografia>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : zonaSeleccionada ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <div className="bg-purple-50 p-6 rounded-full mb-4">
                    <svg className="w-16 h-16 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <Tipografia className="text-purple-700 mb-2">
                    No hay clientes registrados en esta zona.
                  </Tipografia>
                  <Tipografia className="text-gray-500 mb-4">
                    Puedes agregar un nuevo cliente para comenzar a trabajar en esta zona.
                  </Tipografia>
                  <Boton
                    label="Agregar cliente"
                    tipo="primario"
                    onClick={handleNuevoCliente}
                    size="medium"
                    iconName="user-plus"
                    className="mt-2"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <div className="bg-indigo-50 p-6 rounded-full mb-4">
                    <svg className="w-16 h-16 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <Tipografia className="text-indigo-700 mb-2">
                    Por favor selecciona una zona
                  </Tipografia>
                  <Tipografia className="text-gray-500">
                    Selecciona una zona de trabajo para ver sus clientes asociados.
                  </Tipografia>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Zonas;