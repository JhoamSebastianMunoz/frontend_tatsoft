import React, { useState, useEffect } from "react";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Buscador from "../../molecules/Buscador";
import Sidebar from "../../organisms/Sidebar";
import { useAuth } from "../../../context/AuthContext";

const Acumulados = () => {
  const { user } = useAuth();
  const [filtro, setFiltro] = useState("Todos");
  
 
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  

  const [searchTerm, setSearchTerm] = useState("");
  const [acumulados, setAcumulados] = useState([]);
  const [acumuladosFiltrados, setAcumuladosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros de fecha
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  
  // Estado para filtro temporal
  const [periodoFiltro, setPeriodoFiltro] = useState("todos");

  // Datos de resumen para las cards
  const [resumenVentas, setResumenVentas] = useState({
    total: 1000000,
    porcentaje: 100,
    periodo: "Diciembre"
  });
  
  const [resumenDevoluciones, setResumenDevoluciones] = useState({
    total: 500000,
    porcentaje: 50,
    periodo: "Diciembre"
  });

  useEffect(() => {
    fetchAcumulados();
  }, []);
  
  useEffect(() => {
    filtrarAcumulados();
  }, [searchTerm, acumulados, periodoFiltro, fechaInicio, fechaFin]);
  
  const fetchAcumulados = async () => {
    try {
      setLoading(true);
     
      // Datos de ejemplo
      const datosEjemplo = [
        {
          id_venta: 1,
          numero_venta: "VTA-001",
          nombre_cliente: "Distribuidora XYZ",
          fecha_venta: "2025-03-20T10:30:00",
          tipo_venta: "Mayorista",
          total_venta: 15000.50
        },
        {
          id_venta: 2,
          numero_venta: "VTA-002",
          nombre_cliente: "Tienda ABC",
          fecha_venta: "2025-03-21T14:45:00",
          tipo_venta: "Minorista",
          total_venta: 3500.25
        },
        {
          id_venta: 3,
          numero_venta: "VTA-003",
          nombre_cliente: "Supermercado El Grande",
          fecha_venta: "2025-03-18T09:15:00",
          tipo_venta: "Mayorista",
          total_venta: 42750.00
        },
        {
          id_venta: 4,
          numero_venta: "VTA-004",
          nombre_cliente: "Abarrotes La Esquina",
          fecha_venta: "2025-03-15T16:20:00",
          tipo_venta: "Minorista",
          total_venta: 1250.75
        },
        {
          id_venta: 5,
          numero_venta: "VTA-005",
          nombre_cliente: "Comercial Los Hermanos",
          fecha_venta: "2025-03-22T11:00:00",
          tipo_venta: "Mayorista",
          total_venta: 28500.00
        }
      ];
      
      setTimeout(() => {
        setAcumulados(datosEjemplo);
        setAcumuladosFiltrados(datosEjemplo);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error cargando acumulados:", error);
      mostrarError("No se pudieron cargar los acumulados. Por favor, intenta de nuevo más tarde.");
      setLoading(false);
    }
  };
  
  const filtrarAcumulados = () => {
    let filtrados = [...acumulados];
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      filtrados = filtrados.filter(
        acumulado => 
          acumulado.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          acumulado.numero_venta.toString().includes(searchTerm)
      );
    }
    
    // Filtrar por periodo
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    
    if (periodoFiltro === "semana") {
      filtrados = filtrados.filter(acumulado => 
        new Date(acumulado.fecha_venta) >= inicioSemana
      );
    } else if (periodoFiltro === "mes") {
      filtrados = filtrados.filter(acumulado => 
        new Date(acumulado.fecha_venta) >= inicioMes
      );
    }
    
    // Filtrar por rango de fechas seleccionado
    if (fechaInicio) {
      const inicio = new Date(fechaInicio);
      inicio.setHours(0, 0, 0, 0);
      filtrados = filtrados.filter(acumulado => 
        new Date(acumulado.fecha_venta) >= inicio
      );
    }
    
    if (fechaFin) {
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);
      filtrados = filtrados.filter(acumulado => 
        new Date(acumulado.fecha_venta) <= fin
      );
    }
    
    setAcumuladosFiltrados(filtrados);
    
    // Actualizar resumen cuando cambian los filtros
    actualizarResumen(filtrados);
  };
  
  const actualizarResumen = (datos) => {
    // Calcular el total de ventas para los datos filtrados
    const totalVentas = datos.reduce((sum, acumulado) => sum + acumulado.total_venta, 0);
    
    // Calcular porcentajes (asumiendo que 1,000,000 es el 100%)
    const porcentajeVentas = Math.round((totalVentas / 1000000) * 100);
    
    // Actualizar el estado de resumen
    setResumenVentas({
      total: totalVentas,
      porcentaje: porcentajeVentas > 100 ? 100 : porcentajeVentas,
      periodo: getPeriodoTexto()
    });
    
    // Para devoluciones podríamos tener otro cálculo similar
    // Aquí solo actualizamos el período para mantener coherencia
    setResumenDevoluciones({
      ...resumenDevoluciones,
      periodo: getPeriodoTexto()
    });
  };
  
  const getPeriodoTexto = () => {
    switch(periodoFiltro) {
      case "semana":
        return "Semana";
      case "mes":
        return "Mes";
      default:
        return "Total";
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const mostrarError = (mensaje) => {
    setError(mensaje);
    setShowErrorAlert(true);
    setTimeout(() => {
      setShowErrorAlert(false);
    }, 3000);
  };
  
  const mostrarExito = (mensaje) => {
    setSuccessMessage(mensaje);
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };
  
  // Función para limpiar los filtros
  const limpiarFiltros = () => {
    setSearchTerm("");
    setFechaInicio("");
    setFechaFin("");
    setPeriodoFiltro("todos");
  };
  
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
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 ml-4">Acumulados</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 px-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-orange-400 p-4 text-white">
                <h2 className="font-medium">Total ventas</h2>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{resumenVentas.total.toLocaleString()}</p>
                  <div className="mt-2 flex items-center">
                    <div className="bg-orange-200 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {resumenVentas.porcentaje}%
                    </div>
                    <span className="ml-2 text-base text-gray-500">{resumenVentas.periodo}</span>
                  </div>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
  
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-red-500 p-4 text-white">
                <h2 className="font-medium">Total devoluciones</h2>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{resumenDevoluciones.total.toLocaleString()}</p>
                  <div className="mt-2 flex items-center">
                    <div className="bg-red-200 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {resumenDevoluciones.porcentaje}%
                    </div>
                    <span className="ml-2 text-base text-gray-500">{resumenDevoluciones.periodo}</span>
                  </div>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filtros de periodo (Todo, Semana, Mes) */}
          <div className="flex overflow-x-auto pb-1 no-scrollbar p-3 bg-white rounded-lg mb-4 ml-3">
             <div className="flex gap-2 min-w-max px-1">
              <button
                className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Todos"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setFiltro("Todos")}
              >
                Todos
              </button>
              <button
                className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Semana"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setFiltro("Semana")}
              >
                Semana
              </button>
              <button className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Mes"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setFiltro("Mes")}>
                Mes
              </button>
            </div>
          </div>
          
          {/* Panel de búsqueda y filtros */}
          <div className="bg-white rounded-lg shadow-md border-l-2 border-orange-600 mb-4 ml-3">
            <div className="p-3 flex flex-col sm:flex-row justify-between items-center">
              <div>
                <div className="flex items-center mt-1">
                  <span className="bg-orange-200 text-orange-800 text-xs font-medium px-3 py-0.5 rounded-full mr-3">
                    {acumulados.length} Total
                  </span>
                  <span className="bg-transparent border border-orange-600 text-orange-800 text-xs font-medium px-3 py-0.5 rounded-full">
                    {acumuladosFiltrados.length} Filtrados
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filtros de búsqueda y fechas */}
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm ml-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <Buscador
                  placeholder="Buscar por cliente o número de venta"
                  onChange={handleSearchChange}
                  value={searchTerm}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Alertas */}
          {showErrorAlert && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded ml-3">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          {showSuccessAlert && (
            <div className="bg-orange-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded ml-3">
              <p className="font-medium">¡Operación exitosa!</p>
              <p>{successMessage}</p>
            </div>
          )}
   
          <div className="bg-white rounded-lg shadow-md p-4 ml-3">
            <div className="border-b pb-3 text-base mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h3 className="font-medium text-black-900 mb-2 sm:mb-0">
                Lista de acumulados
                <span className="ml-2 text-base font-normal text-black-700">
                  Mostrando {acumuladosFiltrados.length} de {acumulados.length}
                </span>
              </h3>
            </div>
            
            {/* Contenido de la tabla */}
            {loading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando acumulados</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                          N° Venta
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>

                        <th className="px-3 sm:px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {acumuladosFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-8">
                            <div className="bg-gray-100 p-4 rounded-full mb-3 mx-auto w-16 h-16 flex items-center justify-center">
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
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <p className="text-gray-500">
                              No se encontraron acumulados que coincidan con los criterios de
                              búsqueda.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        acumuladosFiltrados.map((acumulado) => (
                          <tr key={acumulado.id_venta} className="hover:bg-gray-50">
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-base">
                              {acumulado.numero_venta}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-base">
                              <div className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs">
                                {acumulado.nombre_cliente}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-base text-gray-500">
                              {new Date(acumulado.fecha_venta).toLocaleDateString()}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-base text-right font-medium">
                              ${acumulado.total_venta.toFixed(2)}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-base">
                              <div className="flex justify-center gap-2">
                                <Botones 
                                  tipo="primario" 
                                  label="Ver" 
                                  size="medium"
                                />
                                <Botones 
                                  tipo="secundario" 
                                  label="Imprimir" 
                                  size="small"
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Paginación */}
            {acumuladosFiltrados.length > 0 && (
              <div className="border-t border-gray-200 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between mt-4">
                <div className="text-sm text-gray-700 mb-2 sm:mb-0 text-center sm:text-left">
                  <p>
                    Mostrando <span className="font-medium">1</span> a{" "}
                    <span className="font-medium">
                      {acumuladosFiltrados.length}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium">
                      {acumuladosFiltrados.length}
                    </span>{" "}
                    resultados
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-base font-medium text-gray-500 hover:bg-gray-50">
                      Anterior
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-base font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-base font-medium text-gray-500 hover:bg-gray-50">
                      Siguiente
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </Tipografia>
      </div>
      
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

export default Acumulados; 