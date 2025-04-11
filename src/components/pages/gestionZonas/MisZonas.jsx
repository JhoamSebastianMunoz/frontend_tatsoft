import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { areaService, userService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";
import Sidebar from "../../organisms/Sidebar";
import { useAuth } from "../../../context/AuthContext";

const scrollStyle = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const MisZonas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { idZona } = useParams();
  const [zonas, setZonas] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchZonas = async () => {
      try {
        setLoading(true);
        // Importante: aquí faltaba ejecutar la función con ()
        const response = await userService.getUserOwnZonas();

        // La estructura de la respuesta es diferente, hay que acceder a response.data.zonas
        const zonasData = response.data.zonas || [];
        setZonas(zonasData);

        // Si hay un ID de zona en la URL, seleccionar esa zona
        if (idZona) {
          const zonaEncontrada = zonasData.find(
            (zona) => zona.id_zona_de_trabajo === parseInt(idZona)
          );
          if (zonaEncontrada) {
            setZonaSeleccionada(zonaEncontrada);
          }
        } else if (zonasData.length > 0) {
          // Si no hay ID en la URL, seleccionar la primera zona
          setZonaSeleccionada(zonasData[0]);
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

    fetchZonas();
  }, [idZona]);

  // Cargar clientes cuando cambia la zona seleccionada
  useEffect(() => {
    const fetchClientes = async () => {
      if (!zonaSeleccionada) return;

      try {
        setLoading(true);
        const response = await areaService.getClientsInArea(
          zonaSeleccionada.id_zona_de_trabajo
        );
        setClientes(response.data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        setError(
          "Error al cargar los clientes. Por favor, intenta de nuevo más tarde."
        );
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
    if (zonaSeleccionada) {
      sessionStorage.setItem("returnPath", "/mis-zonas");
      navigate("/registro/cliente", {
        state: {
          zonaId: zonaSeleccionada.id_zona_de_trabajo,
        },
      });
    } else {
      navigate("/registro/cliente");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <style>{scrollStyle}</style>
      <div className="w-20 flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="mt-4 mb-5">
          <Tipografia className="text-xl sm:text-2xl font-semibold text-gray-800 ml-5">
            Mis Zonas
          </Tipografia>
        </div>
        <div className="flex flex-col px-4 pt-2 pb-6 w-full">
          {error && (
            <div className="mx-4 my-2 bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md">
              <Tipografia className="text-red-700">{error}</Tipografia>
            </div>
          )}
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
                </div>
                <div className="rounded-lg">
                  {loading && !zonas.length ? (
                    <div className="flex justify-center">
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
                          key={zona.id_zona_de_trabajo || index}
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
                    <Tipografia className="text-center">
                      No hay zonas asignadas a tu usuario.
                    </Tipografia>
                  )}
                </div>
              </div>
            </div>
            {zonaSeleccionada && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center">
                  <Tipografia
                    variant="subtitle"
                    className="text-black font-medium"
                  >
                    Zona: {zonaSeleccionada.nombre_zona_trabajo}
                  </Tipografia>
                  {clientes.length > 0 && (
                    <div className="px-2 py-1 bg-orange-200 rounded-full text-center min-w-[60px] flex items-center justify-center">
                      <Tipografia className="text-xs text-orange-800 whitespace-nowrap">
                        {clientes.length}{" "}
                        {clientes.length === 1 ? "cliente" : "clientes"}
                      </Tipografia>
                    </div>
                  )}
                </div>
                {zonaSeleccionada.descripcion && (
                  <Tipografia className="text-gray-600 mt-2">
                    {zonaSeleccionada.descripcion}
                  </Tipografia>
                )}
              </div>
            )}
            <div className="bg-white rounded-lg shadow-md p-4 flex-1 w-full ">
              <Tipografia
                variant="subtitle"
                className="text-black font-bold mb-4 "
              >
                Clientes
              </Tipografia>
              <div className="w-full">
                {loading && zonaSeleccionada ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mb-4"></div>
                    <Tipografia>Cargando clientes</Tipografia>
                  </div>
                ) : clientes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clientes.map((cliente) => (
                      <div
                        key={cliente.id_cliente}
                        className="rounded-lg m-1.5 overflow-hidden border border-orange-100"
                      >
                        <div className="bg-gray-100 px-4 py-3">
                          <Tipografia className="text-black font-medium">
                            {cliente.nombre_completo_cliente}
                          </Tipografia>
                        </div>
                        <div className="p-4">
                          <div className="bg-white rounded-lg p-3 mb-3">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <Tipografia className="w-28 font-medium text-black">
                                  CC:
                                </Tipografia>
                                <Tipografia>{cliente.cedula}</Tipografia>
                              </div>
                              <div className="flex items-center">
                                <Tipografia className="w-28 font-medium text-black">
                                  Nit:
                                </Tipografia>
                                <Tipografia>
                                  {cliente.rut_nit || "No disponible"}
                                </Tipografia>
                              </div>
                              <div className="flex items-center">
                                <Tipografia className="w-28 font-medium text-black">
                                  Razón Social:
                                </Tipografia>
                                <Tipografia>
                                  {cliente.razon_social || "No disponible"}
                                </Tipografia>
                              </div>
                              <div className="flex items-center">
                                <Tipografia className="w-28 font-medium text-black">
                                  Teléfono:
                                </Tipografia>
                                <Tipografia>
                                  {cliente.telefono || "No disponible"}
                                </Tipografia>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : zonaSeleccionada ? (
                  <div className="flex flex-col items-center justify-center text-center py-10">
                    <div className="bg-orange-50 p-6 rounded-full mb-4">
                      <svg
                        className="w-16 h-16 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <Tipografia className="text-black mb-2">
                      No hay clientes registrados en esta zona.
                    </Tipografia>
                    <Tipografia className="text-gray-500 mb-4">
                      Puedes agregar un nuevo cliente para comenzar a trabajar
                      en esta zona.
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
                    <div className="bg-orange-50 p-6 rounded-full mb-4">
                      <svg
                        className="w-16 h-16 text-black"
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
                    <Tipografia className="text-black mb-2">
                      Por favor selecciona una zona
                    </Tipografia>
                    <Tipografia className="text-gray-500">
                      Selecciona una zona de trabajo para ver sus clientes
                      asociados.
                    </Tipografia>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisZonas;
