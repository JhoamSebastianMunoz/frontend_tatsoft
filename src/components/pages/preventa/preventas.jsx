import React, { useState, useEffect } from "react";
import Encabezado from "../../molecules/Encabezado";
import SidebarAdm from "../../organisms/SidebarAdm";
import Boton from "../../atoms/Botones";
import Buscador from "../../molecules/Buscador";
import Tipografia from "../../atoms/Tipografia";
import { useNavigate } from "react-router-dom";

const Preventa = () => {
  const navigate = useNavigate();

  const [preventas, setPreventas] = useState([
    {
      fecha: "10-11-2024",
      numeroPreventa: "000123",
      cliente: "Tienda el galán",
      zona: "Zona 07",
      total: "504,900",
    },
    {
      fecha: "10-11-2024",
      numeroPreventa: "000123",
      cliente: "Tienda el galán",
      zona: "Zona 07",
      total: "504,900",
    },
    {
      fecha: "10-11-2024",
      numeroPreventa: "000123",
      cliente: "Tienda el galán",
      zona: "Zona 07",
      total: "504,900",
    },
    {
      fecha: "10-11-2024",
      numeroPreventa: "000123",
      cliente: "Tienda el galán",
      zona: "Zona 07",
      total: "504,900",
    },
    {
      fecha: "10-11-2024",
      numeroPreventa: "000123",
      cliente: "Tienda el galán",
      zona: "Zona 07",
      total: "504,900",
    },
    {
      fecha: "10-11-2024",
      numeroPreventa: "000123",
      cliente: "Tienda el galán",
      zona: "Zona 07",
      total: "504,900",
    },
  ]);

  // Estados para filtros y búsqueda
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [verTarjetas, setVerTarjetas] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(null);

  // Efecto para cerrar el menú al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (menuAbierto !== null) {
        setMenuAbierto(null);
      }
    };

    // Añadir el evento de scroll al contenedor principal
    window.addEventListener('scroll', handleScroll, true);
    
    // Limpieza del evento cuando el componente se desmonte
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [menuAbierto]);

  // Efecto para cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuAbierto !== null && !event.target.closest('.menu-container')) {
        setMenuAbierto(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuAbierto]);

  // Filtrar preventas según los criterios
  const preventasFiltradas = preventas.filter((preventa) => {
    return (
      (filtro === "Todos" || preventa.zona === filtro) &&
      (preventa.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
        preventa.numeroPreventa.includes(busqueda))
    );
  });

 
  const handleEditar = (preventa) => {
    console.log("Editando preventa:", preventa);
    
  };

  const handleEliminar = (preventa) => {
    console.log("Eliminando preventa:", preventa);
    
  };

  const handleVer = (preventa) => {
    console.log("Viendo preventa:", preventa);
 
  };

  const handleNuevaPreventa = () => {
    navigate("/nueva-preventa");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white overflow-x-hidden">
      <div className="fixed top-0 w-full z-10">
        <Encabezado mensaje="Preventas" />
      </div>
      <div className="fixed top-0 left-0 h-full z-10">
        <SidebarAdm />
      </div>

      <div className="w-full pt-16 m-1 p-4">
        <Tipografia>
          <div className="bg-white rounded-lg shadow-md border-l-2 border-purple-600 mb-4">
            <div className="p-3 flex flex-col sm:flex-row justify-between items-center">
              <div>
                <div className="flex items-center mt-1">
                  <span className="bg-green-200 text-green-800 text-xs font-medium px-3 py-0.5 rounded-full mr-3">
                    {preventas.length} Total
                  </span>
                  <span className="bg-purple-200 text-blue-800 text-xs font-medium px-3 py-0.5 rounded-full">
                    {preventasFiltradas.length} Filtrados
                  </span>
                </div>
              </div>
              <div className="mt-3 sm:mt-0 flex">
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

          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <style jsx>{`
              input[type="date"]::-webkit-calendar-picker-indicator {
                cursor: pointer;
                opacity: 0.8;
                scale: var(--calendarSize);
                transform-origin: right;
              }

              input[type="date"]:focus {
                outline: none !important;
                box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.25);
              }
            `}</style>
            <h2 className="text-lg font-medium mb-3 text-black">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-purple-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="date"
                    className="border border-purple-200 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 block w-full pl-10 pr-4 py-2 rounded-lg text-sm transition duration-150 ease-in-out"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    style={{
                      colorScheme: "light",
                      fontSize: "15px",
                      "--calendarSize": "1.25em",
                    }}
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-purple-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="date"
                    className="border border-purple-200 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 block w-full pl-10 pr-4 py-2 rounded-lg text-sm transition duration-150 ease-in-out"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    style={{
                      colorScheme: "light",
                      fontSize: "15px",
                      "--calendarSize": "1.25em",
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ">
                  Buscar:
                </label>
                <Buscador
                  placeholder="Buscar por cliente o colaborador"
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            {(fechaInicio || fechaFin || busqueda) && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    setFechaInicio("");
                    setFechaFin("");
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

          <div className="flex flex-wrap gap-2 p-3 bg-white rounded-lg mb-1">
            <button
              className={`px-4 py-2 whitespace-nowrap rounded-md ${
                filtro === "Todos"
                  ? "bg-purple-100 text-purple-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setFiltro("Todos")}
            >
              Todas las zonas
            </button>
            <button
              className={`px-4 py-2 whitespace-nowrap rounded-md ${
                filtro === "Zona 07"
                  ? "bg-purple-100 text-purple-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setFiltro("Zona 07")}
            >
              Zona 07
            </button>
            <button
              className={`px-4 py-2 whitespace-nowrap rounded-md ${
                filtro === "Zona 05"
                  ? "bg-purple-100 text-purple-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setFiltro("Zona 05")}
            >
              Zona 05
            </button>
            <button
              className={`px-4 py-2 whitespace-nowrap rounded-md ${
                filtro === "Zona 03"
                  ? "bg-purple-100 text-purple-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setFiltro("Zona 03")}
            >
              Zona 03
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="border-b pb-3 mb-4 flex justify-between items-center">
              <h3 className="font-medium text-black-900">
                Lista de preventas
                <span className="ml-2 text-sm font-normal text-black-700">
                  Mostrando {preventasFiltradas.length} de {preventas.length}
                </span>
              </h3>
            </div>

            {verTarjetas ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
                {preventasFiltradas.length > 0 ? (
                  preventasFiltradas.map((preventa, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 relative w-full"
                    >
                      <div className="h-2 bg-green-400"></div>
                      <div className="bg-gray-100 flex items-center justify-between px-3 py-1 ">
                        <div className="flex items-center space-x-1">
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-xs">{preventa.fecha}</span>
                        </div>
                        <div className="relative menu-container">
                          <button
                            onClick={() =>
                              setMenuAbierto(
                                menuAbierto === index ? null : index
                              )
                            }
                            className="text-gray-400 focus:outline-none"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          {menuAbierto === index && (
                            <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-md z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    handleVer(preventa);
                                    setMenuAbierto(null);
                                  }}
                                  className="block w-full text-left px-10 py-2 text-sm text-gray-700 hover:bg-purple-100"
                                >
                                  Ver
                                </button>
                                <button
                                  onClick={() => {
                                    handleEliminar(preventa)
                                    setMenuAbierto(null);
                                  }}
                                  className="block w-full text-left px-8 py-2 text-sm text-red-500 hover:bg-purple-100"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="mb-2">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">
                              Número de preventa:
                            </p>
                            <p className="text-sm  text-semibold text-purple-800">
                              {preventa.numeroPreventa}
                            </p>
                          </div>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm font-medium">Cliente:</p>
                          <p className="text-sm">{preventa.cliente}</p>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm font-medium">Zona:</p>
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            {preventa.zona}
                          </span>
                        </div>
                        <div className="mb-1">
                          <p className="text-sm font-medium">Total:</p>
                          <p className="text-sm font-medium">
                            ${preventa.total}
                          </p>
                        </div>
                      </div>
                      <div className="px-0 bg-gray-50 border-t border-gray-100">
                        <style jsx>{`
                          @media (max-width: 640px) {
                            .card-buttons-container {
                              flex-direction: column;
                              align-items: center;
                              gap: 1px;
                              padding: 1px 0;
                            }
                          }
                        `}</style>
                        <div className="card-buttons-container flex justify-end items-center px-1">
                          <Boton
                            onClick={() => handleEditar(preventa)}
                            label="Editar"
                            tipo="secundario"
                            size="small"
                          />
                        </div>
                      </div>
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
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      No se encontraron preventas que coincidan con los
                      criterios de búsqueda.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        # Preventa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zona
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preventasFiltradas.length > 0 ? (
                      preventasFiltradas.map((preventa, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {preventa.fecha}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">
                              {preventa.numeroPreventa}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {preventa.cliente}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              {preventa.zona}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            ${preventa.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex justify-end gap-2">
                              <Boton
                                onClick={() => handleEditar(preventa)}
                                label="Editar"
                                size="small"
                                tipo="secundario"
                              />
                              <Boton
                                onClick={() => handleEliminar(preventa)}
                                label="Eliminar"
                                tipo="cancelar"
                                size="small"
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No se encontraron preventas que coincidan con los
                          criterios de búsqueda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {/* Paginación */}
            {preventasFiltradas.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between mt-4">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">1</span> a{" "}
                      <span className="font-medium">
                        {preventasFiltradas.length}
                      </span>{" "}
                      de{" "}
                      <span className="font-medium">
                        {preventasFiltradas.length}
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

export default Preventa;