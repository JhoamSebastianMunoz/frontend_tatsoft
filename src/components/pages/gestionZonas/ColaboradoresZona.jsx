import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";
import Sidebar from "../../organisms/Sidebar";
import Icono from "../../../components/atoms/Iconos";

const scrollStyle = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const ColaboradoresZona = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [zonas, setZonas] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [error, setError] = useState("");
  const [usuarioInfo, setUsuarioInfo] = useState({
    nombreCompleto: "",
    cantidadClientes: 0
  });
  const [showEliminarAlert, setShowEliminarAlert] = useState(false);
  const [zonaParaEliminar, setZonaParaEliminar] = useState(null);
  const [eliminandoZona, setEliminandoZona] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showEliminarTodasAlert, setShowEliminarTodasAlert] = useState(false);
  const [eliminandoTodasZonas, setEliminandoTodasZonas] = useState(false);

  // Cargar información del usuario al inicio
  useEffect(() => {
    const fetchUsuarioInfo = async () => {
      if (!id) return;
      
      try {
        const response = await userService.getUserById(id);
        if (response && response.data) {
          setUsuarioInfo({
            nombreCompleto: response.data.nombreCompleto || "Colaborador",
            cantidadClientes: response.data.cantidadClientes || 0
          });
        }
      } catch (error) {
        console.error("Error al cargar información del usuario:", error);
      }
    };
    
    fetchUsuarioInfo();
  }, [id]);

  // Cargar zonas al inicio
  useEffect(() => {
    const fetchZonas = async () => {
      try {
        setLoading(true);
        console.log("Obteniendo zonas para usuario:", id);
        const response = await userService.getUserZonas(id);
        console.log("Respuesta de zonas:", response.data);

        if (response.data && response.data.zonas) {
          const zonasData = response.data.zonas;
          setZonas(zonasData);

          // Seleccionar la primera zona por defecto si hay zonas
          if (zonasData.length > 0) {
            setZonaSeleccionada(zonasData[0]);
          }
        } else {
          console.error("Formato de respuesta inesperado:", response);
          setError("La respuesta del servidor no tiene el formato esperado.");
        }
      } catch (error) {
        console.error("Error al cargar zonas:", error);
        setError(
          "Error al cargar las zonas. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchZonas();
    }
  }, [id]);

  // Cargar clientes cuando cambia la zona seleccionada
  useEffect(() => {
    const fetchClientes = async () => {
      if (!zonaSeleccionada) return;

      try {
        setLoadingClientes(true);
        console.log(
          "Obteniendo clientes para zona:",
          zonaSeleccionada.id_zona_de_trabajo
        );
        const response = await userService.getClientesZona(
          zonaSeleccionada.id_zona_de_trabajo
        );
        console.log("Respuesta de clientes:", response.data);

        if (response.data && response.data.clientes) {
          setClientes(response.data.clientes);
        } else {
          console.error("Formato de respuesta inesperado:", response);
          setError(
            "La respuesta del servidor no tiene el formato esperado para clientes."
          );
          setClientes([]);
        }
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        setError(
          "Error al cargar los clientes. Por favor, intenta de nuevo más tarde."
        );
        setClientes([]);
      } finally {
        setLoadingClientes(false);
      }
    };

    if (zonaSeleccionada) {
      fetchClientes();
    }
  }, [zonaSeleccionada]);

  const handleZonaChange = (index) => {
    setZonaSeleccionada(zonas[index]);
  };

  const handleAsignarZona = () => {
    navigate(`/gestion-zonas/asignar/${id}`);
  };

  const handleEliminarZona = () => {
    if (!zonaSeleccionada) return;

    setZonaParaEliminar(zonaSeleccionada);
    setShowEliminarAlert(true);
  };

  const confirmarEliminarZona = async () => {
    if (!zonaParaEliminar || !id) return;

    try {
      setEliminandoZona(true);

      // Llamar a la API para eliminar la asignación de la zona
      await userService.removeZonaFromUser(
        id,
        zonaParaEliminar.id_zona_de_trabajo
      );

      // Actualizar el estado local
      const nuevasZonas = zonas.filter(
        (zona) =>
          zona.id_zona_de_trabajo !== zonaParaEliminar.id_zona_de_trabajo
      );

      setZonas(nuevasZonas);

      // Si la zona eliminada era la seleccionada, seleccionar otra
      if (
        zonaSeleccionada &&
        zonaSeleccionada.id_zona_de_trabajo ===
          zonaParaEliminar.id_zona_de_trabajo
      ) {
        if (nuevasZonas.length > 0) {
          setZonaSeleccionada(nuevasZonas[0]);
        } else {
          setZonaSeleccionada(null);
          setClientes([]);
        }
      }

      // Mostrar mensaje de éxito
      setSuccessMessage(
        `La zona "${zonaParaEliminar.nombre_zona_trabajo}" ha sido eliminada correctamente.`
      );
      setShowEliminarAlert(false);
      setShowSuccessAlert(true);
      
      // Auto-cerrar la alerta después de 1.5 segundos
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 1500);
    } catch (error) {
      console.error("Error al eliminar zona:", error);
      setError(
        "Error al eliminar la zona. Por favor, intenta de nuevo más tarde."
      );
    } finally {
      setEliminandoZona(false);
      setZonaParaEliminar(null);
    }
  };

  const cancelarEliminarZona = () => {
    setShowEliminarAlert(false);
    setZonaParaEliminar(null);
  };

  const closeSuccessAlert = () => {
    setShowSuccessAlert(false);
  };

  const clearError = () => {
    setError("");
  };

  const handleEliminarTodasZonas = () => {
    setShowEliminarTodasAlert(true);
  };

  const confirmarEliminarTodasZonas = async () => {
    if (!id) return;

    try {
      setEliminandoTodasZonas(true);

      // Llamar a la API para eliminar todas las zonas del usuario
      await userService.removeAllZonasFromUser(id);

      // Actualizar el estado local
      setZonas([]);
      setZonaSeleccionada(null);
      setClientes([]);

      // Mostrar mensaje de éxito
      setSuccessMessage("Todas las zonas han sido eliminadas correctamente.");
      setShowEliminarTodasAlert(false);
      setShowSuccessAlert(true);
      
      // Auto-cerrar la alerta después de 1.5 segundos
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 1500);
    } catch (error) {
      console.error("Error al eliminar todas las zonas:", error);
      setError("Error al eliminar las zonas. Por favor, intenta de nuevo más tarde.");
    } finally {
      setEliminandoTodasZonas(false);
    }
  };

  const cancelarEliminarTodasZonas = () => {
    setShowEliminarTodasAlert(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <style>{scrollStyle}</style>
      <div className="w-20 flex-shrink-0">
        <Sidebar />
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="mt-4 ml-4">
            <Tipografia className="text-xl sm:text-2xl font-semibold text-gray-800">Zonas</Tipografia>
        </div>
        <div className="flex flex-col px-4 pt-5 pb-6 w-full">
          {error && (
            <div className="mx-4 my-2 bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md flex items-center">
              <Icono className="mr-2" name="eliminarAlert" size={20} />
              <Tipografia className="text-red-700">{error}</Tipografia>
            </div>
          )}

          {/* Tarjeta del colaborador */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center">
              <Tipografia 
                variant="h5" 
                className="text-gray-700 font-bold"
              >
                Colaborador: {usuarioInfo.nombreCompleto}
              </Tipografia>
              {usuarioInfo.cantidadClientes > 0 && (
                <div className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium ml-3">
                  {usuarioInfo.cantidadClientes} cliente
                  {usuarioInfo.cantidadClientes !== 1 ? "s" : ""}
                </div>
              )}
            </div>
            {zonas.length > 0 && (
              <Boton
                label="Eliminar todas las zonas"
                tipo="cancelar"
                onClick={handleEliminarTodasZonas}
                size="small"
                className="whitespace-nowrap"
              />
            )}
          </div>

          <div className="flex flex-col space-y-4 w-full">
            <div className="bg-white rounded-lg shadow-md p-4 w-full">
              <div className="flex flex-col space-y-1">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <Tipografia
                    variant="subtitle"
                    className="text-black font-bold mb-3 sm:mb-0"
                  >
                    Zonas Asignadas
                  </Tipografia>
                  <div className="flex flex-wrap justify-center gap-2 mb-7 sm:mb-0 w-full sm:w-auto">
                    <Boton
                      label="Asignar nueva zona"
                      tipo="primario"
                      onClick={handleAsignarZona}
                      size="small"
                      className="w-full sm:w-auto"
                    />
                    <Boton
                      label="Eliminar Zona"
                      tipo="cancelar"
                      onClick={handleEliminarZona}
                      size="small"
                      className="w-full sm:w-auto"
                      disabled={!zonaSeleccionada}
                    />
                  </div>
                </div>
                <div className="rounded-lg">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-orange-200 h-8 w-8"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-orange-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ) : zonas.length > 0 ? (
                    <div className="flex overflow-x-auto pb-2 no-scrollbar gap-2 md:flex-wrap md:justify-start">
                      {zonas.map((zona, index) => (
                        <button
                          key={zona.id_zona_de_trabajo}
                          onClick={() => handleZonaChange(index)}
                          className={`flex-shrink-0 px-4 py-2 rounded-full transition-all duration-200 ${
                            zonaSeleccionada &&
                            zona.id_zona_de_trabajo ===
                              zonaSeleccionada.id_zona_de_trabajo
                              ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-md"
                              : "bg-white border border-orange-200 hover:border-orange-400 text-black hover:shadow-sm"
                          }`}
                        >
                          <Tipografia
                            className={`${
                              zonaSeleccionada &&
                              zona.id_zona_de_trabajo ===
                                zonaSeleccionada.id_zona_de_trabajo
                                ? "text-white"
                                : "text-orange-700"
                            }`}
                          >
                            {zona.nombre_zona_trabajo}
                          </Tipografia>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <Tipografia className="text-gray-600">
                        No hay zonas asignadas.
                      </Tipografia>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {zonaSeleccionada && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-8">
                  <Tipografia
                    variant="subtitle"
                    className="text-black font-medium"
                  >
                    Zona {zonaSeleccionada.nombre_zona_trabajo}
                  </Tipografia>
                  <div className="px-2 py-1 bg-orange-200 rounded-full text-center min-w-[60px] flex items-center justify-center">
                    <Tipografia className="text-xs text-orange-800 whitespace-nowrap">
                      {clientes.length}{" "}
                      {clientes.length === 1 ? "cliente" : "clientes"}
                    </Tipografia>
                  </div>
                </div>
                {zonaSeleccionada.descripcion && (
                  <Tipografia className="text-sm text-gray-600 mt-2 bg-orange-50 p-3 rounded-md border border-orange-100">
                    {zonaSeleccionada.descripcion}
                  </Tipografia>
                )}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-4 flex-1 w-full">
              <div className="flex justify-between items-center mb-4">
                <Tipografia variant="subtitle" className="text-black font-bold">
                  Clientes de la Zona
                </Tipografia>
              </div>
              <div className="w-full">
                {loadingClientes ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mb-4"></div>
                    <Tipografia>Cargando clientes</Tipografia>
                  </div>
                ) : clientes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clientes.map((cliente) => (
                      <div
                        key={cliente.id_cliente}
                        className="rounded-lg overflow-hidden border border-orange-100 hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="bg-gradient-to-r from-orange-100 to-orange-50 px-4 py-3">
                          <Tipografia className="text-orange-800 font-medium">
                            {cliente.nombre_completo_cliente}
                          </Tipografia>
                        </div>
                        <div className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-start">
                              <Tipografia className="w-28 font-medium text-gray-700">
                                CC:
                              </Tipografia>
                              <Tipografia className="text-gray-900">
                                {cliente.cedula}
                              </Tipografia>
                            </div>
                            <div className="flex items-start">
                              <Tipografia className="w-28 font-medium text-gray-700">
                                Nit:
                              </Tipografia>
                              <Tipografia className="text-gray-900">
                                {cliente.rut_nit || "No disponible"}
                              </Tipografia>
                            </div>
                            <div className="flex items-start">
                              <Tipografia className="w-28 font-medium text-gray-700">
                                Razón Social:
                              </Tipografia>
                              <Tipografia className="text-gray-900">
                                {cliente.razon_social || "No disponible"}
                              </Tipografia>
                            </div>
                            <div className="flex items-start">
                              <Tipografia className="w-28 font-medium text-gray-700">
                                Teléfono:
                              </Tipografia>
                              <Tipografia className="text-gray-900">
                                {cliente.telefono || "No disponible"}
                              </Tipografia>
                            </div>
                            <div className="flex items-start">
                              <Tipografia className="w-28 font-medium text-gray-700">
                                Dirección:
                              </Tipografia>
                              <Tipografia className="text-gray-900 flex-1">
                                {cliente.direccion || "No disponible"}
                              </Tipografia>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : zonaSeleccionada ? (
                  <div className="flex flex-col items-center justify-center text-center py-10">
                    <div className="bg-grey-50 p-6 rounded-full mb-2">
                      <Icono name="gest-clientes" size={60}  />
                    </div>
                    <Tipografia className="text-gray font-medium mb-2">
                      No hay clientes registrados en esta zona.
                    </Tipografia>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-10">
                    <div className="bg-orange-50 p-6 rounded-full mb-4">
                      <svg
                        className="w-16 h-16 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                    </div>
                    <Tipografia className="text-black font-medium mb-2">
                      Selecciona una zona
                    </Tipografia>
                    <Tipografia className="text-gray-500">
                      Para ver los clientes, primero selecciona una zona de
                      trabajo.
                    </Tipografia>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de Confirmación para Eliminar Zona */}
      {showEliminarAlert && zonaParaEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-4">
                <Icono name="alerta" size={24} customColor="#F59E0B"  />
              </div>
              <Tipografia size="lg" className="font-bold mb-2">
                ¿Eliminar esta zona?
              </Tipografia>
              <Tipografia className="mb-4">
                Estás a punto de eliminar la zona{" "}
                <b>{zonaParaEliminar.nombre_zona_trabajo}</b>. Esta acción no se
                puede deshacer.
              </Tipografia>
              <div className="flex flex-col sm:flex-row w-full gap-3">
                <Boton
                  tipo="cancelar"
                  label="Eliminar Zona"
                  size="small"
                  onClick={confirmarEliminarZona}
                  className="w-full"
                  disabled={eliminandoZona}
                />
                <Boton
                  tipo="secundario"
                  label="Cancelar"
                  size="small"
                  onClick={cancelarEliminarZona}
                  className="w-full"
                  disabled={eliminandoZona}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de Éxito */}
      {showSuccessAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="flex bg-grey-50 p-6 rounded-full items-center justify-center mb-4">
                <Icono name="confirmar" size="50"/>
              </div>
              <Tipografia size="lg" className="font-bold mb-2">¡Operación exitosa!</Tipografia>
              <Tipografia className="text-gray-600 mb-4">
                {successMessage}
              </Tipografia>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Eliminar Todas las Zonas */}
      {showEliminarTodasAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-4">
                <Icono name="eliminarAlert" size="80" />
              </div>
              <Tipografia size="lg" className="font-bold mb-2">
                ¿Eliminar todas las zonas?
              </Tipografia>
              <Tipografia className="mb-4">
                Estás a punto de eliminar <b>todas las zonas asignadas</b> a este colaborador. Esta acción no se puede deshacer.
              </Tipografia>
              <div className="flex flex-col sm:flex-row w-full gap-3">
                <Boton
                  tipo="cancelar"
                  label="Eliminar Todas"
                  size="small"
                  onClick={confirmarEliminarTodasZonas}
                  className="w-full"
                  disabled={eliminandoTodasZonas}
                />
                <Boton
                  tipo="secundario"
                  label="Cancelar"
                  size="small"
                  onClick={cancelarEliminarTodasZonas}
                  className="w-full"
                  disabled={eliminandoTodasZonas}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColaboradoresZona;
