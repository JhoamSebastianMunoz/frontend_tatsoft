import React, { useState, useEffect, useCallback } from "react";
import Tipografia from "../../atoms/Tipografia";
import Loading from "../../Loading/Loading";
import Buscador from "../../molecules/Buscador";
import Sidebar from "../../organisms/Sidebar";
import { useNavigate } from "react-router-dom";

const VentasDevoluciones = () => {
  const navigate = useNavigate();

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [loading, setLoading] = useState(true);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Fijo para evitar cambios inesperados
  const [preventasFiltradas, setPreventasFiltradas] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // Datos de ejemplo para las preventas
  const preventas = [
    {
      fecha: "12/05/2024",
      numeroPreventa: "000123",
      cliente: "Tienda el galán",
      zona: "Zona 07",
      totalVentas: "250,000",
      totalDevolucion: "50,000",
    },
    {
      fecha: "12/05/2024",
      numeroPreventa: "000124",
      cliente: "Tienda el galán",
      zona: "Zona 07",
      totalVentas: "250,000",
      totalDevolucion: "50,000",
    },
    {
      fecha: "12/05/2024",
      numeroPreventa: "000125",
      cliente: "Tienda el galán",
      zona: "Zona 07",
      totalVentas: "250,000",
      totalDevolucion: "50,000",
    },
    {
      fecha: "12/05/2024",
      numeroPreventa: "000126",
      cliente: "Tienda el galán",
      zona: "Zona 07",
      totalVentas: "250,000",
      totalDevolucion: "50,000",
    },
    {
      fecha: "12/05/2024",
      numeroPreventa: "000127",
      cliente: "Tienda el galán",
      zona: "Zona 07",
      totalVentas: "250,000",
      totalDevolucion: "50,000",
    },
    {
      fecha: "12/05/2024",
      numeroPreventa: "000128",
      cliente: "Tienda el galán",
      zona: "Zona 07",
      totalVentas: "250,000",
      totalDevolucion: "50,000",
    },
    {
      fecha: "13/05/2024",
      numeroPreventa: "000129",
      cliente: "Tienda el grande",
      zona: "Zona 08",
      totalVentas: "350,000",
      totalDevolucion: "75,000",
    },
    {
      fecha: "13/05/2024",
      numeroPreventa: "000130",
      cliente: "Tienda el grande",
      zona: "Zona 08",
      totalVentas: "350,000",
      totalDevolucion: "75,000",
    },
    {
      fecha: "13/05/2024",
      numeroPreventa: "000131",
      cliente: "Tienda el grande",
      zona: "Zona 08",
      totalVentas: "350,000",
      totalDevolucion: "75,000",
    },
  ];

  // Simulación de carga de datos
  useEffect(() => {
    // Simular la carga de datos
    const timer = setTimeout(() => {
      setPreventasFiltradas(preventas);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filtrar preventas según búsqueda y fechas
  useEffect(() => {
    let resultados = [...preventas];
    
    if (busqueda) {
      const terminoBusqueda = busqueda.toLowerCase().trim();
      resultados = resultados.filter(
        preventa => preventa.cliente.toLowerCase().includes(terminoBusqueda) ||
                    preventa.numeroPreventa.includes(terminoBusqueda)
      );
    }
    
    setPreventasFiltradas(resultados);
    setCurrentPage(1); // Resetear a primera página cuando cambian los filtros
  }, [busqueda, fechaInicio, fechaFin]);

  // Función para actualizar los elementos actuales basados en la página actual
  const updateCurrentItems = useCallback(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(preventasFiltradas.slice(indexOfFirstItem, indexOfLastItem));
    setTotalPages(Math.ceil(preventasFiltradas.length / itemsPerPage));
  }, [currentPage, itemsPerPage, preventasFiltradas]);

  // Actualizar elementos mostrados cuando cambia la página o los filtros
  useEffect(() => {
    updateCurrentItems();
  }, [currentPage, preventasFiltradas, updateCurrentItems]);

  // Handlers para paginación - Usando funciones separadas para mayor claridad
  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }
  
  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }
  
  function goToPage(page) {
    setCurrentPage(page);
  }

  if (loading) {
    return <Loading message="Cargando ventas y devoluciones..." />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      <div className="w-full pt-16 m-1 p-4">
        <Tipografia>
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-1">
            <div className="bg-slate-100 rounded-lg shadow-sm w-full md:max-w-sm mx-auto md:mx-2 m-1">
              <div className="bg-slate-100 py-2 text-center border-b rounded-t-lg">
                <h3 className="text-orange-800 font-medium">Total ventas</h3>
              </div>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold mb-1">
                  {resumen.ventas.total}
                </div>
                <div className="flex justify-center mb-2">
                  <span className="inline-block px-3 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                    {resumen.ventas.unidades}
                  </span>
                </div>
                <div className="text-xs text-orange-700 font-medium flex justify-center">
                  Periodo: {resumen.ventas.periodo}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm w-full md:max-w-sm mx-auto md:mx-2 m-1">
              <div className="bg-slate-100 py-2 text-center border-b rounded-t-lg">
                <h3 className="text-orange-800 font-medium">
                  Total devoluciones
                </h3>
              </div>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold mb-1">
                  {resumen.devoluciones.total}
                </div>
                <div className="flex justify-center mb-2">
                  <span className="inline-block px-3 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                    {resumen.devoluciones.unidades}
                  </span>
                </div>
                <div className="text-xs text-orange-700 font-medium flex justify-center">
                  Periodo: {resumen.devoluciones.periodo}
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
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
                box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.25);
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
                      className="h-5 w-5 text-orange-500"
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
                    className="border border-orange-200 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 block w-full pl-10 pr-4 py-2 rounded-lg text-sm transition duration-150 ease-in-out"
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
                      className="h-5 w-5 text-orange-500"
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
                    className="border border-orange-200 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 block w-full pl-10 pr-4 py-2 rounded-lg text-sm transition duration-150 ease-in-out"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar:
                </label>
                <Buscador
                  placeholder="Buscar por colaborador"
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            {(fechaInicio || fechaFin || busqueda) && (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setFechaInicio("");
                    setFechaFin("");
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
          
          {/* Contador de resultados */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex flex-wrap justify-between items-center">
              <h3 className="text-lg font-medium text-orange-800">
                Lista de Preventas
              </h3>
              {preventasFiltradas.length > 0 && (
                <div className="px-2 py-1 bg-orange-100 rounded-full text-center min-w-[60px]">
                  <span className="text-xs text-orange-800">
                    {preventasFiltradas.length} {preventasFiltradas.length === 1 ? "resultado" : "resultados"}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-1 text-sm text-orange-500">Página {currentPage} de {totalPages}</div>
          </div>
          
          {/* Tarjetas de preventas con diseño responsivo mejorado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mx-auto px-1 sm:px-2 mb-6">
            {currentItems.map((preventa, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow overflow-hidden transform transition duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 w-full"
              >
                <div className="bg-orange-500 p-2 sm:p-3 text-white flex justify-between items-center">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-white mr-1 sm:mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium">
                      {preventa.fecha}
                    </span>
                  </div>
                  <div className="text-xs font-bold bg-white bg-opacity-25 px-2 py-1 rounded-full">
                    #{preventa.numeroPreventa}
                  </div>
                </div>
                
                <div className="px-3 py-2 sm:px-4 sm:py-3">
                  <div className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                    </svg>
                    <div className="min-w-0"> 
                      <span className="text-xs text-gray-500 block">Cliente</span>
                      <div className="text-sm font-semibold text-gray-800 truncate">
                        {preventa.cliente}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div className="min-w-0"> 
                      <span className="text-xs text-gray-500 block">Zona</span>
                      <div className="text-sm font-semibold text-gray-800 truncate">
                        {preventa.zona}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-0 border-t border-gray-100">
                  <div className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 flex flex-col border-r border-gray-100">
                    <span className="text-xs text-orange-900 mb-1">
                      Total ventas
                    </span>
                    <span className="text-base sm:text-lg font-bold text-emerald-600">
                      ${preventa.totalVentas}
                    </span>
                  </div>
                  <div className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 flex flex-col">
                    <span className="text-xs text-orange-900 mb-1">
                      Total Devolución
                    </span>
                    <span className="text-base sm:text-lg font-bold text-rose-600">
                      ${preventa.totalDevolucion}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Paginación mejorada */}
          {preventasFiltradas.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="text-sm text-gray-700 mb-3 sm:mb-0 text-center sm:text-left">
                  <p>
                    Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, preventasFiltradas.length)}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium">
                      {preventasFiltradas.length}
                    </span>{" "}
                    resultados
                  </p>
                </div>
                <div>
                  <div
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button 
                      type="button"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-orange-500 hover:bg-orange-50 cursor-pointer'
                      }`}
                    >
                      Anterior
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        type="button"
                        key={i + 1}
                        onClick={() => goToPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === i + 1
                            ? 'bg-orange-100 border-orange-500 text-orange-700 z-10 font-bold'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-orange-50'
                        } text-sm font-medium`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button 
                      type="button"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages 
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-orange-500 hover:bg-orange-50 cursor-pointer'
                      }`}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Tipografia>
      </div>
    </div>
  );
};

export default VentasDevoluciones;