import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clientService } from "../../../context/services/ApiService";
import Boton from "../../atoms/Botones";
import Buscador from "../../molecules/Buscador";
import Tipografia from "../../atoms/Tipografia";
import Loading from "../../Loading/Loading";
import Sidebar from "../../organisms/Sidebar";
import Icono from "../../atoms/Iconos";

const GestionClientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [verTarjetas, setVerTarjetas] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Llamada directa a la API sin procesamiento intermedio
      const response = await fetch('https://backendareasandclients-apgba5dxbrbwb2ex.eastus2-01.azurewebsites.net/get-clients', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Datos completos de clientes recibidos:", data);
      
      if (Array.isArray(data)) {
        // Log detallado para debugging
        console.log("Estados de los clientes recibidos:", 
          data.map(c => ({
            id: c.id_cliente,
            nombre: c.nombre_completo_cliente || c.razon_social,
            estado: c.estado
          }))
        );
        
        // Conteo de clientes por estado
        const conteoEstados = data.reduce((acc, c) => {
          const estado = c.estado || "Sin estado";
          acc[estado] = (acc[estado] || 0) + 1;
          return acc;
        }, {});
        console.log("Distribución de estados:", conteoEstados);
        
        // No transformamos los datos, los usamos como vienen directamente de la API
        setClientes(data);
      } else {
        console.error("Respuesta de la API no es un array:", data);
        setClientes([]);
        setError("El formato de datos recibido no es válido. Contacta al administrador.");
      }
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      setError(`Error al cargar la lista de clientes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar si un cliente tiene el estado buscado
  const clientesFiltrados = clientes.filter(
    (cliente) => {
      // Registro detallado para debugging
      console.log(`Cliente ID ${cliente.id_cliente} - Estado: "${cliente.estado}" - Filtro: "${filtro}"`);
      
      // Filtrado por estado (Activo, Inactivo, Pendiente) - Más flexible para manejar variaciones
      let estadoMatch = false;
      
      if (filtro === "Todos") {
        // Si el filtro es "Todos", mostramos todos los clientes sin importar su estado
        estadoMatch = true;
      } else if (filtro === "Activos" && cliente.estado && String(cliente.estado).toLowerCase().includes("activ")) {
        // Para clientes activos
        estadoMatch = true;
      } else if (filtro === "Inactivos" && cliente.estado && String(cliente.estado).toLowerCase().includes("inactiv")) {
        // Para clientes inactivos
        estadoMatch = true;
      } else if (filtro === "Pendientes" && cliente.estado && String(cliente.estado).toLowerCase().includes("pendient")) {
        // Para clientes pendientes
        estadoMatch = true;
      }
      
      // Buscar por nombre o razón social
      const searchMatch = !busqueda ||
        (cliente.razon_social && cliente.razon_social.toLowerCase().includes(busqueda.toLowerCase())) ||
        (cliente.nombre_completo_cliente && cliente.nombre_completo_cliente.toLowerCase().includes(busqueda.toLowerCase()));
      
      // Registramos el resultado del filtrado
      console.log(`  Resultado filtrado para cliente ${cliente.id_cliente}: ${estadoMatch && searchMatch ? "INCLUIDO" : "EXCLUIDO"}`);
      
      return estadoMatch && searchMatch;
    }
  );

  const handleVerCliente = (clienteId) => {
    navigate(`/ver/cliente/${clienteId}`);
  };

  const handleEditarCliente = (cliente) => {
    localStorage.setItem("rutaOrigenEdicion", "/gestion/clientes");
    navigate(`/editar-cliente/${cliente.id_cliente}`);
  };

  const handleEliminarClick = (cliente) => {
    setClienteAEliminar(cliente);
    setShowConfirmDelete(true);
  };

  const confirmarEliminacion = async () => {
    if (!clienteAEliminar) return;
    
    try {
      setLoading(true);
      // Realizar la llamada directa a la API para eliminar el cliente
      const token = localStorage.getItem('token');
      const url = `https://backendareasandclients-apgba5dxbrbwb2ex.eastus2-01.azurewebsites.net/delete-client/${clienteAEliminar.id_cliente}`;
      
      console.log(`Intentando eliminar cliente con ID: ${clienteAEliminar.id_cliente}`);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}. ${errorData}`);
      }
      
      const data = await response.json();
      console.log("Respuesta de eliminación:", data);
      
      setSuccessMessage(`El cliente ${clienteAEliminar.nombre_completo_cliente || clienteAEliminar.razon_social} ha sido eliminado con éxito.`);
      // Actualizar la lista de clientes después de eliminar
      fetchClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      setError(`No se pudo eliminar el cliente. ${error.message}`);
    } finally {
      setLoading(false);
      setShowConfirmDelete(false);
      setClienteAEliminar(null);
    }
  };

  const cancelarEliminacion = () => {
    setShowConfirmDelete(false);
    setClienteAEliminar(null);
  };

  // Manejo de mensajes de éxito y error
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

  if (loading && clientes.length === 0) {
    return <Loading message="Cargando clientes..." />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-auto md:fixed md:top-0 md:left-0 md:h-full z-10">
        <div className="block md:hidden">
          <Sidebar />
        </div>
        <div className="hidden md:block">
          <Sidebar />
        </div>
      </div>
   
      <div className="bg-slate-50 flex-1 pl-8 md:pl-20 w-full lg:pl-[60px] px-3 sm:px-4 md:px-6 lg:px-8 ml-6 pl-4">
        <Tipografia>
          <div className="mt-4 mb-5">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 ml-5">Gestión de clientes</h1>
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

          <div className="bg-white rounded-lg shadow-md border-l-2 border-orange-600 mb-4 ml-3">
            <div className="p-3 flex flex-col sm:flex-row justify-between items-center">
              <div>
                <div className="flex items-center mt-1">
                  <span className="bg-orange-200 text-orange-800 text-xs font-medium px-3 py-0.5 rounded-full mr-3">
                    {clientes.length} Total
                  </span>
                  <span className="bg-transparent text-orange-800 border border-orange-400 text-xs font-medium px-3 py-0.5 rounded-full">
                    {clientesFiltrados.length} Filtrados
                  </span>
                </div>
              </div>
             
              <div className="mt-4 sm:mt-0 flex w-full sm:w-auto justify-center sm:justify-end">
                <Boton
                  tipo="primario"
                  label="Registrar Cliente"
                  onClick={() => navigate("/registro/cliente")}
                  className="mr-2 w-full sm:w-auto"
                />
                <button
                  onClick={() => setVerTarjetas(!verTarjetas)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    {verTarjetas ? (
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    ) : (
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
         
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-base font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <Buscador
                  placeholder="Buscar cliente por nombre o razón social"
                  onChange={(e) => setBusqueda(e.target.value)}
                  value={busqueda}
                />
              </div>
             
              {(busqueda || filtro !== "Todos") && (
                <div className="mt-1 flex justify-end">
                  <button
                    onClick={() => {
                      setBusqueda("");
                      setFiltro("Todos");
                    }}
                    className="text-sm text-orange-600 hover:text-orange-800 flex items-center transition-colors duration-150"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
         
          <div className="flex overflow-x-auto pb-1 no-scrollbar p-3 bg-white rounded-lg mb-4">
            <div className="flex gap-2 min-w-max px-1">
              <button
                className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Todos"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setFiltro("Todos")}
              >
                Todos los clientes
              </button>
              <button
                className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Activos"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setFiltro("Activos")}
              >
                Activos
              </button>
              <button className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Inactivos"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setFiltro("Inactivos")}>
                Inactivos
              </button>
              <button className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Pendientes"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setFiltro("Pendientes")}>
                Pendientes
              </button>
            </div>
          </div>
   
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="border-b pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h3 className="font-medium text-black-900 mb-2 sm:mb-0">
                Lista de clientes
                <span className="ml-2 text-sm font-normal text-black-700">
                  Mostrando {clientesFiltrados.length} de {clientes.length}
                </span>
              </h3>
            </div>
           
            {/* Mensaje de no resultados */}
            {clientesFiltrados.length === 0 ? (
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">
                  No se encontraron clientes que coincidan con los criterios de
                  búsqueda.
                </p>
              </div>
            ) : verTarjetas ? (
              // Vista de tarjetas
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientesFiltrados.map((cliente, index) => (
                  <div
                    key={cliente.id_cliente || index}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 relative"
                  >
                    <div
                      className={`h-2 ${
                        cliente.estado === "Activo"
                          ? "bg-green-500"
                          : cliente.estado === "Inactivo"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={() => setMenuAbierto(menuAbierto === cliente.id_cliente ? null : cliente.id_cliente)}
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
                     
                      {menuAbierto === cliente.id_cliente && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                          <ul className="py-1 text-sm text-gray-600">
                            <li
                              className="px-3 py-2 hover:bg-orange-100 cursor-pointer"
                              onClick={() => {
                                navigate(`/ver/cliente/${cliente.id_cliente}`);
                                setMenuAbierto(null);
                              }}
                            >
                              Ver
                            </li>
                            <li
                              className="px-3 py-2 hover:bg-orange-100 cursor-pointer"
                              onClick={() => {
                                handleEliminarClick(cliente);
                                setMenuAbierto(null);
                              }}
                            >
                              Eliminar
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                   
                    <div className="p-4 flex-grow">
                      <h3 className="font-medium text-lg text-gray-900 break-words mb-2">
                        {cliente.razon_social || cliente.nombre_completo_cliente}
                      </h3>
                      <div className="flex mb-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            cliente.estado === "Activo"
                              ? "bg-green-100 text-green-800"
                              : cliente.estado === "Inactivo"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {cliente.estado}
                        </span>
                      </div>
                      <p className="text-gray-600 break-words text-sm mb-2">
                        <strong>Contacto:</strong> {cliente.nombre_completo_cliente}
                      </p>
                      <p className="text-gray-600 break-words text-sm mb-2">
                        <strong>Teléfono:</strong> {cliente.telefono}
                      </p>
                      <p className="text-gray-600 text-sm mb-2">
                        <strong>Dirección:</strong> {cliente.direccion}
                      </p>
                    </div>
                   
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 mt-auto">
                      <div className="flex justify-center">
                        <Link
                          to={`/editar-cliente/${cliente.id_cliente}`}
                          className="w-full"
                        >
                          <Boton tipo="primario" label="Editar" className="w-full" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Vista de tabla con scroll horizontal
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Razón Social/Nombre
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contacto
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Teléfono
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clientesFiltrados.map((cliente) => (
                        <tr key={cliente.id_cliente} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs">
                              {cliente.razon_social || cliente.nombre_completo_cliente}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-500 truncate max-w-[120px] sm:max-w-xs">
                            {cliente.nombre_completo_cliente}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-500">
                            {cliente.telefono}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                cliente.estado === "Activo"
                                  ? "bg-green-100 text-green-800"
                                  : cliente.estado === "Inactivo"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {cliente.estado}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex justify-end gap-2">
                              <Boton
                                tipo="secundario"
                                label="Ver"
                                size="small"
                                onClick={() => handleVerCliente(cliente.id_cliente)}
                              />
                              <Boton 
                                tipo="primario" 
                                label="Editar" 
                                size="small" 
                                onClick={() => handleEditarCliente(cliente)}
                              />
                              <Boton 
                                tipo="cancelar" 
                                label="Eliminar" 
                                size="small" 
                                onClick={() => handleEliminarClick(cliente)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
           
         
            {clientesFiltrados.length > 0 && (
              <div className="border-t border-gray-200 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between mt-4">
                <div className="text-sm text-gray-700 mb-2 sm:mb-0 text-center sm:text-left">
                  <p>
                    Mostrando <span className="font-medium">1</span> a{" "}
                    <span className="font-medium">
                      {clientesFiltrados.length}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium">
                      {clientesFiltrados.length}
                    </span>{" "}
                    resultados
                  </p>
                </div>
              </div>
            )}
          </div>
        </Tipografia>
      </div>
     
      {/* Modal de confirmación para eliminar cliente */}
      {showConfirmDelete && clienteAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="text-red-500 text-5xl mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
              <p className="mb-6">
                ¿Estás seguro de que deseas eliminar al cliente{" "}
                <span className="font-semibold">
                  {clienteAEliminar.razon_social || clienteAEliminar.nombre_completo_cliente}
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

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
};

export default GestionClientes;