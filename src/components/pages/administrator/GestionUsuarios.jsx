import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { userService } from "../../../context/services/ApiService";
import Boton from "../../../components/atoms/Botones";
import Icono from "../../../components/atoms/Iconos";
import CampoTexto from "../../atoms/CamposTexto";
import Tipografia from "../../../components/atoms/Tipografia";
import Loading from "../../../components/Loading/Loading";
import Sidebar from "../../organisms/Sidebar";

const scrollStyle = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const GestionUsuarios = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [asignarZona, setAsignarZona] = useState(false);
  const [zonaId, setZonaId] = useState(null);
  const [zonaNombre, setZonaNombre] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(null);
  // Estados adicionales para manejo de eliminación y mensajes
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Agregar estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  useEffect(() => {
    if (location.state?.asignarZona) {
      setAsignarZona(true);
      setZonaId(location.state.zonaId);
      setZonaNombre(location.state.zonaNombre);
    }
  }, [location.state]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsuarios(response.data);
      setFilteredUsuarios(response.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setError(
        "Error al cargar la lista de usuarios. Por favor, intenta de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    let results = usuarios;

    if (filtro !== "Todos") {
      results = results.filter(
        (usuario) => usuario.rol === filtro.toUpperCase()
      );
    }

    if (busqueda) {
      const searchTerm = busqueda.toLowerCase().trim();
      results = results.filter((usuario) =>
        usuario.nombreCompleto?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredUsuarios(results);
    setCurrentPage(1); // Resetear a primera página cuando cambian los filtros
  }, [usuarios, filtro, busqueda]);

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

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const handleFiltroChange = (opcion) => {
    setFiltro(opcion);
  };

  const handleRegistrarUsuario = () => {
    navigate("/registrar/usuario");
  };

  const toggleMenu = (id) => {
    setMenuAbierto(menuAbierto === id ? null : id);
  };

  // Cálculos para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsuarios.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

  // Handlers para paginación
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleAsignarZona = async () => {
    try {
      // Aquí iría la lógica para asignar la zona a los usuarios seleccionados
      console.log("Asignando zona", zonaId, "a usuarios:", selectedUsers);
      // Después de asignar, volver a la vista de zonas
      navigate("/zonas");
    } catch (error) {
      console.error("Error al asignar zona:", error);
      setError("Error al asignar la zona a los usuarios");
    }
  };

  // Función para editar usuario con navegación mejorada
  const handleEditarUsuario = (userId) => {
    navigate(`/editar/usuario/${userId}`, {
      state: { from: location.pathname },
    });
  };

  // Funciones para gestionar la eliminación de usuarios
  const handleEliminarClick = (usuario) => {
    setUsuarioAEliminar(usuario);
    setShowConfirmDelete(true);
    setMenuAbierto(null); // Cerramos el menú al abrir el modal
  };

  const confirmarEliminacion = async () => {
    if (!usuarioAEliminar) return;
    
    try {
      setLoading(true);
      await userService.deleteUser(usuarioAEliminar.id_usuario);
      
      setSuccessMessage(`El usuario ${usuarioAEliminar.nombreCompleto} ha sido eliminado con éxito.`);
      // Actualizar la lista de usuarios después de eliminar
      fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      setError(`No se pudo eliminar el usuario. ${error.message || 'Intente nuevamente más tarde'}`);
    } finally {
      setLoading(false);
      setShowConfirmDelete(false);
      setUsuarioAEliminar(null);
    }
  };

  const cancelarEliminacion = () => {
    setShowConfirmDelete(false);
    setUsuarioAEliminar(null);
  };

  if (loading && usuarios.length === 0) {
    return <Loading message="Cargando usuarios..." />;
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <style>{scrollStyle}</style>
      <div className="fixed top-0 left-0 h-full w-14 sm:w-16 md:w-20 lg:w-20 z-10">
        <Sidebar />
      </div>

      <div className="w-full flex-1 pl-[4.3rem] sm:pl-16 md:pl-20 lg:pl-20 xl:pl-20 px-2 sm:px-4 md:px-6 lg:px-2 py-4 overflow-x-hidden bg-slate-50">
        <div className="max-w-[1600px] mx-auto">
          <Tipografia>
            <div className="w-full">
              <div className="mt-2 mb-4">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                  {asignarZona
                    ? `Asignar Zona: ${zonaNombre}`
                    : "Gestión de usuarios"}
                </h1>
              </div>

              {/* Mensajes de éxito */}
              {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <p>{successMessage}</p>
                  </div>
                </div>
              )}

              {/* Mensajes de error */}
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {/* Nuevo bloque con contador de usuarios totales y filtrados */}
              <div className="bg-white rounded-lg shadow-md border-l-2 border-orange-600 mb-4">
                <div className="p-4 flex flex-col md:flex-row justify-between items-center">
                  <div className="w-full md:w-auto mb-4 md:mb-0">
                    <div className="flex items-center justify-center md:justify-start">
                      <span className="bg-orange-200 text-orange-800 text-xs font-medium px-3 py-0.5 rounded-full mr-3">
                        {usuarios.length} Total
                      </span>
                      <span className="bg-transparent text-orange-800 border border-orange-500 text-xs font-medium px-3 py-0.5 rounded-full">
                        {filteredUsuarios.length} Filtrados
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-[200px] md:w-auto flex justify-end md:justify-start">
                    <Boton
                      tipo="primario"
                      label="Registrar Usuario"
                      onClick={handleRegistrarUsuario}
                      className="w-full text-sm md:text-base px-4 md:px-6 py-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3 w-full">
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 w-full">
                  <div className="flex flex-col space-y-1">
                    {/* Contenedor flex para tener filtro y buscador en la misma línea */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      {/* Filtro por rol (a la izquierda) */}
                      <div className="w-full md:w-auto">
                        <h2 className="text-lg font-medium mb-3 text-black">
                          Filtros
                        </h2>
                        <div className="flex overflow-x-auto pb-2 no-scrollbar gap-2 mt-2">
                          {["Todos", "COLABORADOR", "ADMINISTRADOR"].map(
                            (opcion) => (
                              <button
                                key={opcion}
                                onClick={() => handleFiltroChange(opcion)}
                                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                                  filtro === opcion
                                    ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-md"
                                    : "bg-white border border-orange-200 hover:border-orange-400 text-black hover:shadow-sm"
                                }`}
                              >
                                <Tipografia
                                  className={`${
                                    filtro === opcion
                                      ? "text-white"
                                      : "text-orange-700"
                                  } text-sm`}
                                >
                                  {opcion}
                                </Tipografia>
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Buscador (a la derecha) */}
                      <div className="w-full md:w-72 lg:w-96">
                        <Tipografia className="text-gray-800 mb-1 px-1 text-base">
                          Buscar
                        </Tipografia>
                        <CampoTexto
                          placeholder="Buscar usuarios por nombre"
                          onChange={handleBusquedaChange}
                          value={busqueda}
                        />
                      </div>
                    </div>

                    {/* Tag de filtro activo (debajo de ambos) */}
                    {busqueda && (
                      <div className="mt-2 flex items-center">
                        <span className="text-xs text-gray-500 mr-2">
                          Filtrando por:
                        </span>
                        <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <span>{busqueda}</span>
                          <button
                            onClick={() => setBusqueda("")}
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

                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                  <div className="flex justify-between items-center">
                    <Tipografia
                      variant="subtitle"
                      className="text-black font-medium text-sm sm:text-base"
                    >
                      Lista de Usuarios
                    </Tipografia>
                    {filteredUsuarios.length > 0 && (
                      <div className="px-2 py-1 bg-orange-200 rounded-full text-center min-w-[60px]">
                        <Tipografia className="text-xs text-orange-800">
                          {filteredUsuarios.length}{" "}
                          {filteredUsuarios.length === 1
                            ? "usuario"
                            : "usuarios"}
                        </Tipografia>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex-1 w-full">
                  <div className="w-full">
                    {filteredUsuarios.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {currentItems.map((usuario) => (
                          <div
                            key={usuario.id_usuario}
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                          >
                            <div className="h-1 w-full bg-gray-200"></div>
                            <div className="p-4 relative">
                              {asignarZona ? (
                                <div className="absolute top-0 right-0 p-1">
                                  <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(
                                      usuario.id_usuario
                                    )}
                                    onChange={() =>
                                      handleUserSelect(usuario.id_usuario)
                                    }
                                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                  />
                                </div>
                              ) : (
                                <button
                                  className="absolute top-0 right-0 p-1 text-gray-400 hover:text-gray-600"
                                  onClick={() => toggleMenu(usuario.id_usuario)}
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                  </svg>
                                </button>
                              )}
                              {menuAbierto === usuario.id_usuario && (
                                <div className="absolute top-6 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/ver/usuario/${usuario.id_usuario}`
                                      )
                                    }
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    Ver usuario
                                  </button>
                                  {usuario.rol !== "ADMINISTRADOR" && (
                                    <>
                                      <button
                                        onClick={() =>
                                          navigate(
                                            `/gestion-zonas/asignar/${usuario.id_usuario}`
                                          )
                                        }
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                      >
                                        Asignar zona
                                      </button>
                                      <button
                                        onClick={() =>
                                          navigate(
                                            `/gestion-zonas/colaboradores/${usuario.id_usuario}`
                                          )
                                        }
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        Ver Zonas{" "}
                                      </button>
                                      <button
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100"
                                        onClick={() => handleEliminarClick(usuario)}
                                      >
                                        Eliminar
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}

                              <div className="space-y-3">
                                <div className="mb-4">
                                  <Tipografia className="text-xl font-medium text-gray-800">
                                    {usuario.nombreCompleto}
                                  </Tipografia>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Tipografia className="text-gray-600 text-sm">
                                      Usuario: {usuario.nombreCompleto}
                                    </Tipografia>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Tipografia className="text-gray-600 text-sm">
                                      Teléfono:{" "}
                                      {usuario.celular || "No disponible"}
                                    </Tipografia>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Tipografia className="text-gray-600 text-sm">
                                      Email: {usuario.correo || "No disponible"}
                                    </Tipografia>
                                  </div>

                                  {usuario.estado === "INACTIVO" && (
                                    <div className="inline-block bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
                                      Inactivo
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="mt-4">
                                <Boton
                                  label="Editar"
                                  size="small"
                                  tipo="primario"
                                  onClick={() =>
                                    handleEditarUsuario(usuario.id_usuario)
                                  }
                                  className="w-full bg-[#F78220] hover:bg-[#e67316] text-white py-2 rounded-md"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-8">
                        <div className="bg-orange-50 p-4 rounded-full mb-3">
                          <svg
                            className="w-12 h-12 text-black"
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
                        <Tipografia className="text-black mb-2 text-sm">
                          No se encontraron usuarios
                        </Tipografia>
                        <Tipografia className="text-gray-500 mb-3 text-xs">
                          Intenta cambiando los filtros o la búsqueda
                        </Tipografia>
                        <Boton
                          label="Registrar Usuario"
                          tipo="primario"
                          onClick={handleRegistrarUsuario}
                          size="small"
                          className="mt-2"
                        />
                      </div>
                    )}

                    {filteredUsuarios.length > 0 && (
                      <div className="border-t border-gray-200 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between mt-4">
                        <div className="text-sm text-gray-700 mb-2 sm:mb-0 text-center sm:text-left">
                          <p>
                            Mostrando{" "}
                            <span className="font-medium">
                              {indexOfFirstItem + 1}
                            </span>{" "}
                            a{" "}
                            <span className="font-medium">
                              {Math.min(
                                indexOfLastItem,
                                filteredUsuarios.length
                              )}
                            </span>{" "}
                            de{" "}
                            <span className="font-medium">
                              {filteredUsuarios.length}
                            </span>{" "}
                            resultados
                          </p>
                        </div>
                        <div>
                          <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Pagination"
                          >
                            <button
                              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                currentPage === 1
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                              }`}
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                            >
                              Anterior
                            </button>

                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`relative inline-flex items-center px-4 py-2 border ${
                                  currentPage === page
                                    ? "text-gray-700 z-10"
                                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                } text-sm font-medium`}
                              >
                                {page}
                              </button>
                            ))}

                            <button
                              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                currentPage === totalPages
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                              }`}
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                            >
                              Siguiente
                            </button>
                          </nav>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </Tipografia>
        </div>
      </div>

      {asignarZona && selectedUsers.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-[1600px] mx-auto flex justify-between items-center ml-10 px-5">
            <span className="text-sm text-gray-700">
              {selectedUsers.length}{" "}
              {selectedUsers.length === 1
                ? "usuario seleccionado"
                : "usuarios seleccionados"}
            </span>
            <Boton
              label="Asignar Zona"
              tipo="primario"
              onClick={handleAsignarZona}
              size="small"
            />
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar usuario */}
      {showConfirmDelete && usuarioAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <Icono name="eliminar" size="50" className="md:text-6xl" />
              </div>
              <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
              <p className="mb-6">
                ¿Estás seguro de que deseas eliminar al usuario{" "}
                <span className="font-semibold">
                  {usuarioAEliminar.nombreCompleto}
                </span>? 
                Esta acción no se puede deshacer.
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

export default GestionUsuarios;