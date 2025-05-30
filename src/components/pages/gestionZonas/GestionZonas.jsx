import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { areaService, userService } from "../../../context/services/ApiService";
import Icono from "../../../components/atoms/Iconos";
import Tipografia from "../../../components/atoms/Tipografia";
import Loading from "../../../components/Loading/Loading";
import Sidebar from "../../organisms/Sidebar";
import Boton from "../../atoms/Botones";
import CampoTexto from "../../atoms/CamposTexto";
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

const GestionZonas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isColaborador = user && user.rol === "COLABORADOR";

  const [zonas, setZonas] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [zonasFiltradas, setZonasFiltradas] = useState([]);
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [usuariosConZonas, setUsuariosConZonas] = useState([]);
  const [todosUsuarios, setTodosUsuarios] = useState([]);

  // Función para verificar si una zona está asignada a algún usuario
  const verificarZonaAsignada = (idZona) => {
    // Verificamos si la zona está en nuestro mapa de zonas asignadas
    return usuariosConZonas.has(idZona);
  };

  // Efectos para gestionar los mensajes de éxito y error
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Obtener todos los usuarios y sus zonas asignadas
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener todos los usuarios
        const responseUsuarios = await userService.getAllUsers();
        if (responseUsuarios && responseUsuarios.data) {
          setTodosUsuarios(responseUsuarios.data);
        } else {
          console.error("No se pudieron obtener los usuarios");
        }

        // Obtener las zonas asignadas a usuarios
        // Vamos a crear un mapa para registrar qué zonas están asignadas
        const zonasAsignadas = new Map();

        // Recorremos todos los usuarios conocidos
        for (const usuario of responseUsuarios.data) {
          try {
            // Obtener zonas asignadas a este usuario
            const responseZonas = await userService.getUserZonas(
              usuario.id_usuario
            );

            if (responseZonas && responseZonas.data) {
              // Si la respuesta es un array, procesamos cada zona
              if (Array.isArray(responseZonas.data)) {
                responseZonas.data.forEach((zona) => {
                  if (zona.id_zona_de_trabajo) {
                    zonasAsignadas.set(zona.id_zona_de_trabajo, true);
                  }
                });
              }
              // A veces la API puede devolver un objeto con una propiedad que contiene el array
              else if (
                responseZonas.data.zonas &&
                Array.isArray(responseZonas.data.zonas)
              ) {
                responseZonas.data.zonas.forEach((zona) => {
                  if (zona.id_zona_de_trabajo) {
                    zonasAsignadas.set(zona.id_zona_de_trabajo, true);
                  }
                });
              }
              // Si es un objeto simple con id_zona_de_trabajo
              else if (responseZonas.data.id_zona_de_trabajo) {
                zonasAsignadas.set(responseZonas.data.id_zona_de_trabajo, true);
              }
            }
          } catch (error) {
            console.error(
              `Error al obtener zonas para usuario ${usuario.id_usuario}:`,
              error
            );
            // Continuamos con el siguiente usuario
          }
        }

        // Guardamos el mapa de zonas asignadas para usarlo después
        setUsuariosConZonas(zonasAsignadas);
      } catch (error) {
        console.error("Error al obtener usuarios y zonas:", error);
      }
    };

    if (user && user.id_usuario) {
      fetchData();
    }
  }, [user]);

  const fetchZonas = async () => {
    try {
      setLoading(true);
      setError("");
      let response;

      if (isColaborador) {
        response = await areaService.getAreasByColaborador(user?.id_usuario);
      } else {
        response = await areaService.getAllAreas();
      }

      if (response && response.data) {
        // Si ya tenemos el mapa de zonas asignadas, añadimos el estado de asignación real a cada zona
        let zonasConEstado;

        if (usuariosConZonas.size > 0) {
          zonasConEstado = response.data.map((zona) => ({
            ...zona,
            asignado: verificarZonaAsignada(zona.id_zona_de_trabajo),
          }));
        } else {
          // Si no tenemos el mapa de zonas asignadas, marcamos todas como no asignadas
          zonasConEstado = response.data.map((zona) => ({
            ...zona,
            asignado: false,
          }));
        }

        setZonas(zonasConEstado);
        setZonasFiltradas(zonasConEstado);
      } else {
        console.error("Respuesta inválida:", response);
        setError("Error en el formato de datos recibidos");
        setZonas([]);
        setZonasFiltradas([]);
      }
    } catch (error) {
      console.error("Error al cargar zonas:", error);
      setError(
        "Error al cargar las zonas. Por favor, intenta de nuevo más tarde."
      );
      setZonas([]);
      setZonasFiltradas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id_usuario) {
      fetchZonas();
    } else {
      console.log("No hay usuario autenticado o falta id_usuario");
      setLoading(false);
      setError("No se pudo autenticar el usuario");
    }
  }, [user, isColaborador, usuariosConZonas]);

  useEffect(() => {
    // Aplicar filtros
    const aplicarFiltros = () => {
      let resultados = zonas;

      // Filtro por estado de asignación
      if (!isColaborador) {
        if (filtro === "Asignados") {
          resultados = resultados.filter((zona) => zona.asignado === true);
        } else if (filtro === "Por asignar") {
          resultados = resultados.filter((zona) => !zona.asignado);
        }
      }

      // Filtro por término de búsqueda
      if (searchTerm) {
        const terminoBusqueda = searchTerm.toLowerCase();

        resultados = resultados.filter((zona) => {
          const nombreString = String(
            zona.nombre_zona_trabajo || ""
          ).toLowerCase();
          const descripcionString = String(
            zona.descripcion || ""
          ).toLowerCase();

          return (
            nombreString.includes(terminoBusqueda) ||
            descripcionString.includes(terminoBusqueda)
          );
        });

        console.log(
          `Resultados después de búsqueda: ${resultados.length} zonas`
        );
      }

      setZonasFiltradas(resultados);
    };

    aplicarFiltros();
  }, [zonas, filtro, searchTerm, isColaborador]);

  const handleEliminarClick = (zona) => {
    setZonaSeleccionada(zona);
    setShowConfirmDelete(true);
    setMenuAbierto(null);
  };

  const confirmarEliminacion = async () => {
    if (!zonaSeleccionada) return;

    try {
      setLoading(true);
      await areaService.deleteArea(zonaSeleccionada.id_zona_de_trabajo);

      setSuccessMessage(
        `La zona ${zonaSeleccionada.nombre_zona_trabajo} ha sido eliminada con éxito.`
      );
      // Actualizar la lista de zonas después de eliminar
      fetchZonas();
    } catch (error) {
      console.error("Error al eliminar zona:", error);
      setError(
        `No se pudo eliminar la zona. ${
          error.message || "Intente nuevamente más tarde"
        }`
      );
    } finally {
      setLoading(false);
      setShowConfirmDelete(false);
      setZonaSeleccionada(null);
    }
  };

  const cancelarEliminacion = () => {
    setShowConfirmDelete(false);
    setZonaSeleccionada(null);
  };

  const limpiarFiltros = () => {
    setSearchTerm("");
    setFiltro("Todos");
  };

  // Función para mostrar las coordenadas en formato adecuado
  const formatCoordenadas = (zona) => {
    // Verificar si hay coordenadas en el formato esperado
    if (
      zona.coordenadas &&
      Array.isArray(zona.coordenadas) &&
      zona.coordenadas.length > 0
    ) {
      // Si hay coordenadas en el array, usar la primera (como un punto central)
      return `${zona.coordenadas[0].lat?.toFixed(4) || "N/A"}, ${
        zona.coordenadas[0].lng?.toFixed(4) || "N/A"
      }`;
    }
    // Si hay latitud/longitud en el objeto de la zona
    else if (zona.latitud && zona.longitud) {
      return `${zona.latitud.toFixed(4)}, ${zona.longitud.toFixed(4)}`;
    }
    // Si hay coordenadas pero como string
    else if (
      typeof zona.coordenadas === "string" &&
      zona.coordenadas !== "23.6345, -102.5528"
    ) {
      return zona.coordenadas;
    }
    // Si no hay coordenadas definidas
    return "Coordenadas no disponibles";
  };

  const handleVerZona = (id) => {
    navigate(`/ver-zona/${id}`);
    setMenuAbierto(null);
  };

  if (loading && zonas.length === 0) {
    return <Loading message="Cargando zonas..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden flex flex-col md:flex-row">
      <style>{scrollStyle}</style>
      <div className="w-full md:w-auto md:fixed md:top-0 md:left-0 md:h-full z-10">
        <div className="block md:hidden">
          <Sidebar />
        </div>
        <div className="hidden md:block">
          <Sidebar />
        </div>
      </div>
      <div className="flex-1 w-full sm:pl-16 md:pl-20 md:px-6 lg:ml-2 pl-16 pr-2">
        <Tipografia>
          <div className="mt-4 mb-5">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 ml-2">
              Gestión de Zonas
            </h1>
          </div>

          {/* Mensajes de éxito */}
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          {/* Mensajes de error */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <div className="flex items-center">
                <Icono className="mr-2" name="eliminarAlert" size={20} />
                <p>{error}</p>
              </div>
            </div>
          )}

          {!isColaborador && (
            <div className="bg-white rounded-lg shadow-md border-l-2 border-orange-600 mb-4">
              <div className="p-4 flex flex-col md:flex-row justify-between items-center">
                <div className="w-full md:w-auto mb-4 md:mb-0">
                  <div className="flex items-center justify-center md:justify-start">
                    <span className="bg-orange-200 text-orange-800 text-xs font-medium px-3 py-0.5 rounded-full mr-3">
                      {zonas.length} Total
                    </span>
                    <span className="bg-trasparente text-orange-800 border border-orange-500 text-xs font-medium px-3 py-0.5 rounded-full">
                      {zonasFiltradas.length} Filtrados
                    </span>
                  </div>
                </div>

                <div className="w-[200px] md:w-auto flex justify-end md:justify-start">
                  <Link to="/registrar-zona" className="w-full md:w-auto">
                    <Boton
                      tipo="primario"
                      label="Registrar zona"
                      className="w-full text-sm md:text-base px-4 md:px-6 py-2"
                    />
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-3 mb-3 sm:p-4 w-full">
            <div className="flex flex-col space-y-1">
              {/* Contenedor flex para tener filtro y buscador en la misma línea */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                {/* Filtro por asignación (a la izquierda) */}
                <div className="w-full md:w-auto">
                  <h2 className="text-lg font-medium mb-3 text-black">
                    Filtros
                  </h2>
                  <div className="flex overflow-x-auto pb-2 no-scrollbar gap-2 mt-2">
                    {["Todos", "Asignados", "Por asignar"].map((opcion) => (
                      <button
                        key={opcion}
                        onClick={() => setFiltro(opcion)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                          filtro === opcion
                            ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-md"
                            : "bg-white border border-orange-200 hover:border-orange-400 text-black hover:shadow-sm"
                        }`}
                      >
                        <Tipografia
                          className={`${
                            filtro === opcion ? "text-white" : "text-orange-700"
                          } text-sm`}
                        >
                          {opcion}
                        </Tipografia>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buscador (a la derecha) */}
                <div className="w-full md:w-72 lg:w-96">
                  <Tipografia className="text-gray-800 mb-1 px-1 text-base">
                    Buscar
                  </Tipografia>
                  <CampoTexto
                    placeholder="Buscar zona"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                  />
                </div>
              </div>

              {/* Tag de filtro activo (debajo de ambos) */}
              {searchTerm && (
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-gray-500 mr-2">
                    Filtrando por:
                  </span>
                  <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <span>{searchTerm}</span>
                    <button
                      onClick={limpiarFiltros}
                      className="ml-1 text-orange-600 hover:text-orange-800"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="border-b pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h3 className="font-medium text-black-900 mb-2 sm:mb-0 text-center sm:text-left w-full sm:w-auto">
                Lista de zonas
                {!isColaborador && (
                  <span className="ml-2 text-sm font-normal text-black-700">
                    Mostrando {zonasFiltradas.length} de {zonas.length}
                  </span>
                )}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[500px] mx-auto sm:max-w-none -ml-2 sm:ml-0">
              {zonasFiltradas.length > 0 ? (
                zonasFiltradas.map((zona) => (
                  <div
                    key={zona.id_zona_de_trabajo}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 relative flex flex-col h-full"
                  >
                    <div className={`h-2 bg-gray-100`}></div>

                    {!isColaborador && (
                      <div className="absolute top-3 right-3 z-10 mr-3">
                        <button
                          onClick={() =>
                            setMenuAbierto(
                              menuAbierto === zona.id_zona_de_trabajo
                                ? null
                                : zona.id_zona_de_trabajo
                            )
                          }
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM8 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM8 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                          </svg>
                        </button>

                        {menuAbierto === zona.id_zona_de_trabajo && (
                          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                            <ul className="py-1 text-sm text-gray-600">
                              <li
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => {
                                  navigate(`/zonas/${zona.id_zona_de_trabajo}`);
                                  setMenuAbierto(null);
                                }}
                              >
                                Ver Clientes
                              </li>
                              <li
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                                onClick={() => {
                                  handleEliminarClick(zona);
                                  setMenuAbierto(null);
                                }}
                              >
                                Eliminar
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4 flex-grow">
                      <h3 className="font-medium text-lg text-gray-900 break-words mb-2">
                        {zona.nombre_zona_trabajo}
                      </h3>
                      <p className="text-gray-600 break-words text-sm mb-2">
                        <strong>Descripción:</strong>
                      </p>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {zona.descripcion}
                      </p>
                      <p className="mt-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            zona.asignado
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-200 text-orange-800"
                          }`}
                        >
                          {zona.asignado ? "Asignado" : "Por asignar"}
                        </span>
                      </p>
                    </div>

                    {!isColaborador && (
                      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 mt-auto">
                        <div className="flex justify-between items-center">
                          <Link
                            to={`/editar-zona/${zona.id_zona_de_trabajo}`}
                            className="w-full"
                          >
                            <Boton
                              tipo="primario"
                              label="Editar"
                              size="small"
                              className="w-full"
                            />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    No se encontraron zonas.{" "}
                    {zonas.length > 0
                      ? "Intenta con otra búsqueda."
                      : isColaborador
                      ? "No tienes zonas asignadas."
                      : "Añade una nueva zona."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Tipografia>
      </div>

      {/* Modal de confirmación para eliminar zona */}
      {showConfirmDelete && zonaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <Icono name="eliminar" size="50" className="md:text-6xl" />
              </div>
              <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
              <p className="mb-6">
                ¿Estás seguro de que deseas eliminar la zona{" "}
                <span className="font-semibold">
                  {zonaSeleccionada.nombre_zona_trabajo}
                </span>
                ? Esta acción no se puede deshacer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Boton
                  tipo="cancelar"
                  label="Cancelar"
                  onClick={cancelarEliminacion}
                  className="w-full"
                />
                <Boton
                  tipo="alerta"
                  label="Eliminar"
                  onClick={confirmarEliminacion}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionZonas;
