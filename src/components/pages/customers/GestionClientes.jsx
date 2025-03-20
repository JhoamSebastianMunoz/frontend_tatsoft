import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clientService } from "../../../context/services/ApiService";
import Encabezado from "../../molecules/Encabezado";
import Boton from "../../atoms/Botones";
import Buscador from "../../molecules/Buscador";
import Tipografia from "../../atoms/Tipografia";
import Loading from "../../Loading/Loading";
import SidebarAdm from "../../organisms/SidebarAdm"

const GestionClientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [verTarjetas, setVerTarjetas] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const response = await clientService.getAllClients();
        setClientes(response.data);
      } catch (err) {
        console.error("Error al cargar clientes:", err);
        setError("Error al cargar la lista de clientes. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // Filtrar clientes según búsqueda y filtro
  const clientesFiltrados = clientes.filter(
    (cliente) => {
      // Filtrar por tipo (si aplicable)
      const tipoMatch = filtro === "Todos" || cliente.tipo === filtro;
      
      // Filtrar por término de búsqueda
      const searchMatch = !busqueda ||
        cliente.razon_social?.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.nombre_completo_cliente?.toLowerCase().includes(busqueda.toLowerCase());
      
      return tipoMatch && searchMatch;
    }
  );

  const handleVerCliente = (clienteId) => {
    navigate(`/ver/cliente/${clienteId}`);
  };

  const handleEditarCliente = (cliente) => {
    localStorage.setItem("rutaOrigenEdicion", "/gestion/clientes");
    navigate(`/editar/cliente/${cliente.id_cliente}`);
  };

  if (loading) {
    return <Loading message="Cargando clientes..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white overflow-x-hidden">
      {/* Encabezado fijo */}
      <div className="fixed top-0 w-full z-10">
        <Encabezado
          mensaje="Gestión de clientes"
          onClick={() => navigate("/")}
        />
      </div>
      
      {/* Sidebar fijo */}
      <div className="fixed top-0 left-0 h-full z-10">
        <SidebarAdm />
      </div>
      
      {/* Contenido principal con padding-top para no solapar con el encabezado fijo */}
      <div className="w-full pt-16 m-1 p-4">
        <Tipografia>
          <div className="bg-white rounded-lg shadow-md border-l-2 border-purple-600 mb-4">
            <div className="p-3 flex flex-col sm:flex-row justify-between items-center">
              <div>
                <div className="flex items-center mt-1">
                  <span className="bg-green-200 text-green-800 text-xs font-medium px-3 py-0.5 rounded-full mr-3">
                    {clientes.length} Total
                  </span>
                  <span className="bg-purple-200 text-purple-800 text-xs font-medium px-3 py-0.5 rounded-full">
                    {clientesFiltrados.length} Filtrados
                  </span>
                </div>
              </div>
              
              <div className="mt-3 sm:mt-0 flex">
                <Boton
                  tipo="primario"
                  label="Registrar Cliente"
                  onClick={() => navigate("/registro/cliente")}
                  className="mr-2"
                />
                <button
                  onClick={() => setVerTarjetas(!verTarjetas)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-lg transition-colors"
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
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <h2 className="text-lg font-medium mb-3 text-black">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar:
                </label>
                <Buscador
                  placeholder="Buscar cliente por nombre o razón social"
                  onChange={(e) => setBusqueda(e.target.value)}
                  value={busqueda}
                />
              </div>
              
              {(busqueda || filtro !== "Todos") && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      setBusqueda("");
                      setFiltro("Todos");
                    }}
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors duration-150"
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
          
          <div className="flex flex-wrap gap-2 p-3 bg-white rounded-lg mb-4">
            <button
              className={`px-4 py-2 whitespace-nowrap rounded-md ${
                filtro === "Todos"
                  ? "bg-purple-100 text-purple-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setFiltro("Todos")}
            >
              Todos los clientes
            </button>
            <button
              className={`px-4 py-2 whitespace-nowrap rounded-md ${
                filtro === "Mayorista"
                  ? "bg-purple-100 text-purple-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setFiltro("Mayorista")}
            >
              Mayoristas
            </button>
            <button
              className={`px-4 py-2 whitespace-nowrap rounded-md ${
                filtro === "Minorista"
                  ? "bg-purple-100 text-purple-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setFiltro("Minorista")}
            >
              Minoristas
            </button>
            <button className="px-4 py-2 whitespace-nowrap rounded-md text-gray-600 hover:bg-gray-100">
              Inactivos
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="border-b pb-3 mb-4 flex justify-between items-center">
              <h3 className="font-medium text-black-900">
                Lista de clientes
                <span className="ml-2 text-sm font-normal text-black-700">
                  Mostrando {clientesFiltrados.length} de {clientes.length}
                </span>
              </h3>
            </div>
            
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientesFiltrados.map((cliente, index) => (
                  <div
                    key={cliente.id_cliente || index}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 relative"
                  >
                    <div
                      className={`h-2 ${
                        cliente.tipo === "Mayorista"
                          ? "bg-purple-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={() =>
                          setMenuAbierto(menuAbierto === cliente.id_cliente ? null : cliente.id_cliente)
                        }
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                        </svg>
                      </button>
                      
                      {menuAbierto === cliente.id_cliente && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                          <ul className="py-1 text-sm text-gray-600">
                            <li
                              className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
                              onClick={() => {
                                handleVerCliente(cliente.id_cliente);
                                setMenuAbierto(null);
                              }}
                            >
                              Ver
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-lg text-gray-900">
                        {cliente.razon_social || cliente.nombre_completo_cliente}
                      </h3>
                      <p className="text-gray-600">Dueño: {cliente.nombre_completo_cliente}</p>
                      <p className="text-gray-600">
                        Teléfono: {cliente.telefono}
                      </p>
                      <p className="mt-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            cliente.tipo === "Mayorista"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {cliente.tipo || "Cliente"}
                        </span>
                      </p>
                    </div>
                    
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <Boton tipo="cancelar" label="Eliminar" size="small" />
                        <Boton
                          onClick={() => handleEditarCliente(cliente)}
                          label="Editar"
                          tipo="secundario"
                          size="small"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Razón Social
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dueño
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teléfono
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clientesFiltrados.map((cliente) => (
                      <tr key={cliente.id_cliente} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {cliente.razon_social || cliente.nombre_completo_cliente}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {cliente.nombre_completo_cliente}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {cliente.telefono}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              cliente.tipo === "Mayorista"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {cliente.tipo || "Cliente"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end gap-2">
                            <Boton
                              onClick={() => handleEditarCliente(cliente)}
                              label="Editar"
                              tipo="secundario"
                              size="small"
                            />
                            <Boton tipo="cancelar" label="Eliminar" size="small" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {clientesFiltrados.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between mt-4">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
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
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Anterior
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Siguiente
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Tipografia>
      </div>
    </div>
  );
};

export default GestionClientes;
