import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { presaleService, userService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Encabezado from "../../molecules/Encabezado";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import SidebarAdm from "../../organisms/Sidebar";
import CampoTexto from "../../atoms/CamposTexto";
import Loading from "../../Loading/Loading";

const HistorialPreventas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [preventas, setPreventas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroColaborador, setFiltroColaborador] = useState("Todos");
  const [colaboradores, setColaboradores] = useState([]);

  // Cargar colaboradores si el usuario es administrador
  useEffect(() => {
    const fetchColaboradores = async () => {
      if (user.rol === "ADMINISTRADOR") {
        try {
          const response = await userService.getAllUsers();
          const colaboradoresData = response.data.filter(u => u.rol === "COLABORADOR");
          setColaboradores(colaboradoresData);
        } catch (err) {
          console.error("Error al cargar colaboradores:", err);
        }
      }
    };

    fetchColaboradores();
  }, [user.rol]);

  useEffect(() => {
    const fetchPreventas = async () => {
      try {
        setLoading(true);
        setError("");
        console.log("Iniciando carga de preventas...");
        console.log("Rol del usuario:", user.rol);
        console.log("Datos completos del usuario:", user);
        
        // Validación más robusta del usuario
        if (!user) {
          throw new Error("No se encontró información del usuario");
        }

        if (!user.rol) {
          throw new Error("El usuario no tiene un rol definido");
        }

        // Obtener el ID del usuario de manera más robusta
        const userId = user.id || user.id_usuario;
        if (!userId && user.rol !== "ADMINISTRADOR") {
          throw new Error("No se pudo obtener el ID del usuario");
        }

        let response;
        if (user.rol === "ADMINISTRADOR") {
          console.log("Intentando cargar todas las preventas...");
          response = await presaleService.getAllPresales();
        } else {
          console.log("Intentando cargar preventas del usuario:", userId);
          response = await presaleService.getPresalesByUser(userId);
        }
        
        console.log("Respuesta completa del backend:", response);
        console.log("Tipo de respuesta:", typeof response);
        console.log("Tipo de response.data:", typeof response.data);
        console.log("Estructura de response.data:", JSON.stringify(response.data, null, 2));
        
        // Validación más robusta de la respuesta
        if (!response || !response.data) {
          throw new Error("La respuesta del servidor no tiene el formato esperado");
        }

        // Procesar los datos de manera más estructurada
        let data = [];
        const responseData = response.data;

        // Intentar obtener el array de datos de diferentes estructuras posibles
        if (Array.isArray(responseData)) {
          data = responseData;
        } else if (Array.isArray(responseData.message)) {
          data = responseData.message;
        } else if (Array.isArray(responseData.data)) {
          data = responseData.data;
        } else if (Array.isArray(responseData.preventas)) {
          data = responseData.preventas;
        } else if (Array.isArray(responseData.presales)) {
          data = responseData.presales;
        } else if (typeof responseData === 'object' && responseData !== null) {
          // Si es un objeto, intentar extraer el array de datos
          const possibleArrays = Object.values(responseData).filter(value => Array.isArray(value));
          if (possibleArrays.length > 0) {
            data = possibleArrays[0];
          } else {
            console.warn("Estructura de respuesta inesperada:", responseData);
            throw new Error("No se encontró un array de datos en la respuesta");
          }
        } else {
          console.warn("Estructura de respuesta inesperada:", responseData);
          throw new Error("El formato de la respuesta no es válido");
        }

        console.log("Datos extraídos:", data);

        // Validar que los datos tienen la estructura esperada
        if (!data.every(preventa => 
          typeof preventa.id_preventa !== 'undefined' && 
          typeof preventa.estado !== 'undefined'
        )) {
          console.warn("Datos de preventas incompletos:", data);
          throw new Error("Los datos de las preventas están incompletos");
        }

        console.log("Datos procesados:", data);
        setPreventas(data);
        
      } catch (err) {
        console.error("Error completo al cargar preventas:", err);
        console.error("Respuesta de error:", err.response);
        
        if (err.response) {
          console.error("Estado del error:", err.response.status);
          console.error("Datos del error:", err.response.data);
          
          switch (err.response.status) {
            case 401:
              setError("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
              break;
            case 403:
              setError("No tiene permisos para ver el historial de preventas.");
              break;
            case 404:
              setError("No se encontraron preventas para este usuario.");
              break;
            case 500:
              setError("Error interno del servidor. Por favor, intente nuevamente más tarde.");
              break;
            default:
              setError(err.response.data?.message || "Error al cargar el historial de preventas.");
          }
        } else if (err.request) {
          console.error("Error de red:", err.request);
          setError("Error de conexión. Por favor, verifique su conexión a internet.");
        } else {
          console.error("Error en la configuración de la petición:", err.message);
          setError(err.message || "Error al procesar la solicitud. Por favor, intente nuevamente.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPreventas();
  }, [user]);

  // Aplicar filtros
  const preventasFiltradas = preventas.filter(preventa => {
    // Filtro por estado
    const cumpleFiltroEstado = filtroEstado === "Todos" || 
      (preventa.estado && preventa.estado.toLowerCase() === filtroEstado.toLowerCase());
    
    // Filtro por colaborador (solo para administradores)
    const cumpleFiltroColaborador = filtroColaborador === "Todos" || 
      (user.rol === "ADMINISTRADOR" && 
       preventa.id_usuario && 
       preventa.id_usuario.toString() === filtroColaborador);
    
    // Filtro por búsqueda
    const terminoBusqueda = filtroBusqueda.toLowerCase().trim();
    const cumpleBusqueda = terminoBusqueda === "" || 
      (preventa.id_preventa && preventa.id_preventa.toString().includes(terminoBusqueda)) ||
      (preventa.fecha_creacion && formatearFecha(preventa.fecha_creacion).toLowerCase().includes(terminoBusqueda)) ||
      (preventa.total && preventa.total.toString().includes(terminoBusqueda)) ||
      (preventa.nombre_colaborador && preventa.nombre_colaborador.toLowerCase().includes(terminoBusqueda)) ||
      (preventa.estado && preventa.estado.toLowerCase().includes(terminoBusqueda));

    // Log para debugging
    console.log('Filtrado preventa:', {
      id: preventa.id_preventa,
      estado: preventa.estado,
      cumpleFiltroEstado,
      cumpleFiltroColaborador,
      cumpleBusqueda,
      terminoBusqueda
    });
    
    return cumpleFiltroEstado && cumpleFiltroColaborador && cumpleBusqueda;
  });

  // Log para debugging de filtros
  useEffect(() => {
    console.log('Estado de los filtros:', {
      filtroEstado,
      filtroColaborador,
      filtroBusqueda,
      totalPreventas: preventas.length,
      totalFiltradas: preventasFiltradas.length
    });
  }, [filtroEstado, filtroColaborador, filtroBusqueda, preventas]);

  // Formatear fecha para mostrar
  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Fecha no disponible";
    const fecha = new Date(fechaString);
    return fecha.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Ver detalles de preventa
  const verDetallesPreventa = (id) => {
    navigate(`/preventa/detalles/${id}`);
  };

  // Confirmar preventa (solo para administradores)
  const confirmarPreventa = (id) => {
    navigate(`/preventa/confirmar/${id}`);
  };

  // Cancelar preventa
  const handleCancelarPreventa = async (id) => {
    if (window.confirm("¿Está seguro que desea cancelar esta preventa?")) {
      try {
        setLoading(true);
        await presaleService.cancelPresale(id);
        
        // Actualizar la lista de preventas
        const response = await presaleService.getAllPresales();
        const data = Array.isArray(response.data) ? response.data : response.data?.message || [];
        setPreventas(data);
        
      } catch (err) {
        console.error("Error al cancelar preventa:", err);
        if (err.response) {
          switch (err.response.status) {
            case 401:
              setError("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
              break;
            case 403:
              setError("No tiene permisos para cancelar preventas.");
              break;
            case 404:
              setError("La preventa no fue encontrada.");
              break;
            case 500:
              setError("Error interno del servidor. Por favor, intente nuevamente más tarde.");
              break;
            default:
              setError(err.response.data?.message || "Error al cancelar la preventa.");
          }
        } else {
          setError("Error de conexión. Por favor, verifique su conexión a internet.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && preventas.length === 0) {
    return <Loading message="Cargando historial de preventas..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Encabezado 
        mensaje="Historial de Preventas" 
        onClick={() => navigate("/perfil")}
      />
      <SidebarAdm/>
      <div className="container mx-auto px-4 py-6">
        {/* Alertas */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <div className="flex items-center">
              <Icono name="eliminarAlert" size={20} />
              <span className="ml-2">{error}</span>
            </div>
          </div>
        )}

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="w-full md:w-1/2">
              <CampoTexto 
                placeholder="Buscar por ID, fecha, total o colaborador..." 
                value={filtroBusqueda}
                onChange={(e) => setFiltroBusqueda(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Tipografia className="whitespace-nowrap">Estado:</Tipografia>
              <select 
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Cancelada">Cancelada</option>
              </select>

              {user.rol === "ADMINISTRADOR" && (
                <>
                  <Tipografia className="whitespace-nowrap">Colaborador:</Tipografia>
                  <select 
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto"
                    value={filtroColaborador}
                    onChange={(e) => setFiltroColaborador(e.target.value)}
                  >
                    <option value="Todos">Todos</option>
                    {colaboradores.map(colaborador => (
                      <option key={colaborador.id} value={colaborador.id}>
                        {colaborador.nombre_completo}
                      </option>
                    ))}
                  </select>
                </>
              )}
              
              {user.rol === "COLABORADOR" && (
                <Boton 
                  tipo="primario" 
                  label="Nueva Preventa" 
                  onClick={() => navigate("/preventa/nueva")}
                  className="w-full sm:w-auto"
                />
              )}
            </div>
          </div>
        </div>

        {/* Lista de preventas */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold mb-6">
            Preventas Registradas
          </Tipografia>

          {preventasFiltradas.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="min-w-full divide-y divide-gray-200">
                {/* Encabezados de tabla */}
                <div className="hidden md:grid md:grid-cols-6 bg-gray-50 px-6 py-3">
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Creación
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </div>
                  {user.rol === "ADMINISTRADOR" && (
                    <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Colaborador
                    </div>
                  )}
                  <div className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </div>
                </div>

                {/* Lista de preventas */}
                <div className="divide-y divide-gray-200">
                  {preventasFiltradas.map((preventa) => (
                    <div key={preventa.id_preventa} className="hover:bg-gray-50">
                      {/* Vista móvil */}
                      <div className="md:hidden p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              #{preventa.id_preventa}
                            </span>
                            <div className="text-sm text-gray-500">
                              {formatearFecha(preventa.fecha_creacion)}
                            </div>
                            {user.rol === "ADMINISTRADOR" && (
                              <div className="text-sm text-gray-500">
                                Colaborador: {preventa.nombre_colaborador}
                              </div>
                            )}
                          </div>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${preventa.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                              preventa.estado === 'Confirmada' ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {preventa.estado}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          Total: ${Number(preventa.total).toLocaleString('es-CO')}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => verDetallesPreventa(preventa.id_preventa)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                          >
                            Ver
                          </button>
                          
                          {preventa.estado === 'Pendiente' && (
                            <>
                              {user.rol === 'ADMINISTRADOR' && (
                                <button
                                  onClick={() => confirmarPreventa(preventa.id_preventa)}
                                  className="text-green-600 hover:text-green-900 text-sm"
                                >
                                  Confirmar
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleCancelarPreventa(preventa.id_preventa)}
                                className="text-red-600 hover:text-red-900 text-sm"
                              >
                                Cancelar
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Vista desktop */}
                      <div className="hidden md:grid md:grid-cols-6 px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{preventa.id_preventa}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatearFecha(preventa.fecha_creacion)}
                        </div>
                        <div>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${preventa.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                              preventa.estado === 'Confirmada' ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {preventa.estado}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          ${Number(preventa.total).toLocaleString('es-CO')}
                        </div>
                        {user.rol === "ADMINISTRADOR" && (
                          <div className="text-sm text-gray-500">
                            {preventa.nombre_colaborador}
                          </div>
                        )}
                        <div className="text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => verDetallesPreventa(preventa.id_preventa)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Ver
                            </button>
                            
                            {preventa.estado === 'Pendiente' && (
                              <>
                                {user.rol === 'ADMINISTRADOR' && (
                                  <button
                                    onClick={() => confirmarPreventa(preventa.id_preventa)}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    Confirmar
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => handleCancelarPreventa(preventa.id_preventa)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No se encontraron preventas con los criterios de búsqueda actuales
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialPreventas;
