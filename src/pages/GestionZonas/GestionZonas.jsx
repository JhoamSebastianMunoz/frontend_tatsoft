import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Encabezado from "../../components/molecules/Encabezado";
import Tipografia from "../../components/atoms/Tipografia";
import Boton from "../../components/atoms/Botones";
import Buscador from "../../components/molecules/Buscador";
import Iconos from "../../components/atoms/Iconos";

const GestionZonas = () => {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [eliminado, setEliminado] = useState(false);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [verTarjetas, setVerTarjetas] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleEliminarClick = (zonaId) => {
    setZonaSeleccionada(zonaId);
    setMostrarAlerta(true);
  };

  const handleConfirmarEliminar = () => {
    setMostrarAlerta(false);
    setEliminado(true);
    setTimeout(() => setEliminado(false), 2000);
  };

  const menuItems = [
    {
      name: "gest-usuarios",
      label: "Gestión de Usuarios",
      subItems: ["Crear Usuario", "Modificar Usuario", "Eliminar Usuario"],
    },
    {
      name: "gest-clientes",
      label: "Gestión de Clientes",
      subItems: ["Lista de Clientes", "Nuevo Cliente"],
    },
    {
      name: "gest-productos",
      label: "Gestión de Productos",
      subItems: ["Agregar Producto", "Categoria"],
    },
    {
      name: "inventario",
      label: "Gestión de Inventario",
      subItems: ["Ver Inventario","Ingreso de stock", "Historial de ingreso"],
    },
    {
      name: "gest-zonas",
      label: "Gestión de Zonas",
      subItems: ["Zonas Activas", "Añadir Zona"],
    },
    {
      name: "gest-acumulados",
      label: "Acumulados",
      subItems: ["Reporte Acumulado"],
    },
    {
      name: "preventa",
      label: "Gestión de Preventa",
      subItems: ["Nueva Preventa", "Historial de Preventas"],
    },
    {
      name: "catalogo",
      label: "Gestión de Catálogo",
      subItems: ["Ver Catálogo", "Añadir Producto"],
    },
  ];

  const zonas = [
    {
      id: 1,
      nombre: "Zona Norte Armenia",
      coordenadas: "23.6345, -102.5528",
      descripcion: "Área asignada para operaciones en la región norte de la ciudad de Armenia.",
      estado: "Asignado"
    },
    {
      id: 2,
      nombre: "Zona Sur Armenia",
      coordenadas: "23.5245, -102.4328",
      descripcion: "Área asignada para operaciones en la región sur de la ciudad de Armenia.",
      estado: "Por asignar"
    },
    {
      id: 3,
      nombre: "Zona Este Armenia",
      coordenadas: "23.7145, -102.3128",
      descripcion: "Área asignada para operaciones en la región este de la ciudad de Armenia.",
      estado: "Asignado"
    },
    {
      id: 4,
      nombre: "Zona Oeste Armenia",
      coordenadas: "23.5845, -102.6728",
      descripcion: "Área asignada para operaciones en la región oeste de la ciudad de Armenia.",
      estado: "Por asignar"
    }
  ];

  const zonasFiltradas = zonas.filter(
    (zona) =>
      (filtro === "Todos" || zona.estado === filtro) &&
      zona.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white">
      <button
        className="fixed top-3 left-4 z-30 p-2 bg-purple-900 text-white rounded-md "
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              sidebarOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>
      <div 
        id="sidebar"
        className={`fixed left-0 top-0 z-20 w-64 h-full bg-white border-r shadow-lg border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-center items-center">
          <h2 className="text-purple-800 font-bold text-xl">Menu</h2>
        </div>
        <div className="flex-grow overflow-y-auto py-2">
          <Tipografia>
            <div className="flex flex-col items-start space-y-2 font-medium">
              {menuItems.map((item) => (
                <div key={item.name} className="w-full">
                  <button
                    type="button"
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                      openMenu === item.name ? "bg-gray-100" : "bg-transparent"
                    } ${
                      item.name === "gest-zonas"
                        ? "text-purple-700 font-semibold"
                        : "text-black"
                    }`}
                    onClick={() => toggleMenu(item.name)}
                  >
                    <div className="flex items-center space-x-3">
                      <Iconos name={item.name} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.subItems && (
                      <Iconos
                        name="despliegue"
                        className={`ml-3 transform transition-transform ${
                          openMenu === item.name ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    )}
                  </button>

                  {openMenu === item.name && (
                    <div className="ml-8 mt-1 space-y-2">
                      {item.subItems.map((subItem, index) => (
                        <button
                          key={index}
                          className="flex items-center text-black hover:text-purple-600 text-sm py-1"
                        >
                          <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                          {subItem}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Tipografia>
        </div>
        <div className="p-4 flex-shrink-0">
          <button
            className="flex items-center justify-between w-full px-5 py-4 bg-gradient-to-r from-purple-500 to-purple-900 hover:from-purple-600 hover:to-purple-900 text-white rounded-lg"
            onClick={handleLogout}
          >
            <div className="flex items-center space-x-6">
              <Iconos name="cerrar-sesion" className="text-white" />
              <span className="text-base">
                <Tipografia>Cerrar sesión</Tipografia>
              </span>
            </div>
          </button>
        </div>
      </div>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      <div className="w-full flex flex-col">
        <div className="sticky top-0 z-10 bg-purple-900 flex items-center">
          <div className="flex-grow">
            <Encabezado mensaje="Gestión de zonas" />
          </div>
        </div>

        <Tipografia>
          <div className="container mx-auto px-4 py-3">
            <div className="bg-white rounded-lg shadow-md border-l-2 border-purple-600 mb-1">
              <div className="p-2 flex flex-col sm:flex-row justify-between items-center">
                <div>
                  <div className="flex items-center mt-1">
                    <span className="bg-green-200 text-green-800 text-xs font-medium px-3 py-0.5 rounded-full mr-3">
                      {zonas.length} Total
                    </span>
                    <span className="bg-purple-200 text-blue-800 text-xs font-medium px-3 py-0.5 rounded-full">
                      {zonasFiltradas.length} Filtrados
                    </span>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0 flex">
                  <Boton
                    tipo="secundario"
                    label="Registrar zona"
                    onClick={() => navigate("/registrar-zona")}
                  />
                  <button
                    onClick={() => setVerTarjetas(!verTarjetas)}
                    className="ml-2 bg-gray-200 hover:bg-gray-200 text-gray-600 p-2 rounded-lg"
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

            <div className="bg-white rounded-lg p-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <Buscador
                    placeholder="Buscar zona"
                    onChange={(e) => setBusqueda(e.target.value)}
                    value={busqueda}
                  />
                </div>
                <div className="flex">
                  {busqueda || filtro !== "Todos" ? (
                    <button
                      onClick={() => {
                        setBusqueda("");
                        setFiltro("Todos");
                      }}
                      className="ml-2 p-2 rounded text-gray-600"
                      title="Limpiar filtros"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex overflow-x-auto space-x-2 p-4 bg-white rounded-lg">
              <button
                className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Todos"
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setFiltro("Todos")}
              >
                Todos las zonas
              </button>
              <button
                className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Asignado"
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setFiltro("Asignado")}
              >
                Asignados
              </button>
              
              <button
                className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Por asignar"
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setFiltro("Por asignar")}
              >
                Por asignar
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mt-4">
              <div className="border-b pb-3 mb-4 flex justify-between items-center">
                <h3 className="font-medium text-black-900">
                  Registro de zonas
                  <span className="ml-2 text-sm font-normal text-black-700">
                    Mostrando {zonasFiltradas.length} de {zonas.length}
                  </span>
                </h3>
              </div>

              {verTarjetas ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {zonasFiltradas.length > 0 ? (
                    zonasFiltradas.map((zona) => (
                      <div
                        key={zona.id}
                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                      >
                        <div className={`h-2 ${zona.estado === "Asignado" ? "bg-green-500" : "bg-purple-700"}`}></div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{zona.nombre}</h3>
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                zona.estado === "Asignado"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {zona.estado}
                            </span>
                          </div>
                          <div className="space-y-2 mb-5">
                            <p className="flex items-start">
                              <span className="font-semibold text-gray-700 mr-2">Ubicación:</span>
                              <span className="text-gray-600">{zona.coordenadas}</span>
                            </p>
                            <p className="text-gray-600 text-sm">{zona.descripcion}</p>
                          </div>
                          <div className="flex justify-between pt-3 border-t border-gray-100">
                            <Boton
                              tipo="secundario"
                              onClick={() => navigate("/editar-zona")}
                              label="Editar"
                            />
                            <Boton
                              tipo="cancelar"
                              onClick={() => handleEliminarClick(zona.id)}
                              label="Eliminar"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 flex flex-col items-center justify-center text-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <Icono name="mapa" size={36} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500">No hay zonas que coincidan con los criterios de búsqueda.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ubicación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {zonasFiltradas.length > 0 ? (
                        zonasFiltradas.map((zona) => (
                          <tr key={zona.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{zona.nombre}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {zona.coordenadas}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  zona.estado === "Asignado"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {zona.estado}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <div className="flex justify-end gap-2">
                                <Boton
                                  onClick={() => navigate("/editar-zona")}
                                  label="Editar"
                                  size="small"
                                />
                                <Boton
                                  tipo="cancelar"
                                  onClick={() => handleEliminarClick(zona.id)}
                                  label="Eliminar"
                                  size="small"
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            No hay zonas que coincidan con los criterios de búsqueda.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {zonasFiltradas.length > 0 && (
                <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between mt-4">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">1</span> a{" "}
                        <span className="font-medium">{zonasFiltradas.length}</span>{" "}
                        de <span className="font-medium">{zonasFiltradas.length}</span>{" "}
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
          </div>

          {mostrarAlerta && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-md">
                <div className="text-center">
                  <Icono name="eliminarAlert" size={60} className="mx-auto mb-4 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Eliminar zona</h3>
                  <p className="text-gray-600 mb-6">¿Está seguro que desea eliminar esta zona?</p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => setMostrarAlerta(false)}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmarEliminar}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {eliminado && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <Icono name="confirmar" size={60} className="mx-auto mb-2 text-green-500" />
                <p className="text-lg font-semibold text-gray-900">Zona eliminada con éxito</p>
              </div>
            </div>
          )}
        </Tipografia>
      </div>
    </div>
  );
};

export default GestionZonas;