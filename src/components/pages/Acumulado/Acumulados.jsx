import React, { useState, useEffect } from "react";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Buscador from "../../molecules/Buscador";
import Sidebar from "../../organisms/Sidebar";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

// Asumiendo que tienes un servicio de API configurado o creando uno nuevo
import { presaleService } from "../../../context/services/ApiService";

const Acumulados = () => {
  const { user } = useAuth();
  const [filtro, setFiltro] = useState("Todos");
  
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [ventas, setVentas] = useState([]);
  const [devoluciones, setDevoluciones] = useState([]);
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
    total: 0,
    porcentaje: 0,
    periodo: "Total"
  });
  
  const [resumenDevoluciones, setResumenDevoluciones] = useState({
    total: 0,
    porcentaje: 0,
    periodo: "Total"
  });

  useEffect(() => {
    fetchDatos();
  }, []);
  
  useEffect(() => {
    filtrarAcumulados();
  }, [searchTerm, acumulados, periodoFiltro, fechaInicio, fechaFin, filtro]);
  
  // Función para formatear la fecha para display
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

  // Función para formatear moneda
  const formatearMoneda = (valor) => {
    if (!valor) return "$0";
    return `$${parseFloat(valor).toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };
  
  const fetchDatos = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Obtener ventas y devoluciones paralelamente
      const [ventasResponse, devolucionesResponse] = await Promise.all([
        presaleService.getAllSales(),
        presaleService.getAllRefund()
      ]);
      
      let ventasData = [];
      let devolucionesData = [];
      
      // Procesar ventas
      if (ventasResponse && ventasResponse.data) {
        ventasData = Array.isArray(ventasResponse.data) ? 
          ventasResponse.data : 
          (ventasResponse.data.message || []);
        
        // Transformar las ventas al formato esperado por el componente
        ventasData = ventasData.map(venta => ({
          id_venta: venta.id_preventa,
          numero_venta: `VTA-${venta.id_preventa.toString().padStart(3, '0')}`,
          nombre_cliente: venta.razon_social || "Cliente #" + venta.id_cliente,
          fecha_venta: venta.fecha_confirmacion,
          tipo_venta: "Venta",
          total_venta: parseFloat(venta.total_vendido || 0),
          id_colaborador: venta.id_colaborador,
          nombre_colaborador: venta.nombre_colaborador
        }));
        
        setVentas(ventasData);
      }
      
      // Procesar devoluciones
      if (devolucionesResponse && devolucionesResponse.data) {
        devolucionesData = Array.isArray(devolucionesResponse.data) ? 
          devolucionesResponse.data : 
          (devolucionesResponse.data.message || []);
        
        // Transformar las devoluciones al formato esperado
        devolucionesData = devolucionesData.map(devolucion => ({
          id_venta: devolucion.id_preventa,
          numero_venta: `DEV-${devolucion.id_preventa.toString().padStart(3, '0')}`,
          nombre_cliente: devolucion.razon_social || "Cliente #" + devolucion.id_cliente,
          fecha_venta: devolucion.fecha_confirmacion,
          tipo_venta: "Devolución",
          total_venta: parseFloat(devolucion.total_devuelto || 0) * -1, // Valor negativo para devoluciones
          id_colaborador: devolucion.id_colaborador,
          nombre_colaborador: devolucion.nombre_colaborador
        }));
        
        setDevoluciones(devolucionesData);
      }
      
      // Combinar ventas y devoluciones para el acumulado
      const acumuladosCombinados = [...ventasData, ...devolucionesData];
      
      // Ordenar por fecha (más recientes primero)
      acumuladosCombinados.sort((a, b) => 
        new Date(b.fecha_venta) - new Date(a.fecha_venta)
      );
      
      setAcumulados(acumuladosCombinados);
      setAcumuladosFiltrados(acumuladosCombinados);
      
      // Calcular y actualizar los resúmenes
      actualizarResumenTotal(acumuladosCombinados);
      
    } catch (err) {
      console.error("Error cargando datos acumulados:", err);
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            mostrarError("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
            break;
          case 403:
            mostrarError("No tiene permisos para acceder a esta información.");
            break;
          case 404:
            mostrarError("No se encontraron registros de ventas o devoluciones.");
            // Establecer datos vacíos
            setAcumulados([]);
            setAcumuladosFiltrados([]);
            break;
          case 500:
            mostrarError("Error interno del servidor. Por favor, intente nuevamente más tarde.");
            break;
          default:
            mostrarError("No se pudieron cargar los datos. Por favor, intente de nuevo más tarde.");
        }
      } else if (err.request) {
        mostrarError("Error de conexión. Por favor, verifique su conexión a internet.");
      } else {
        mostrarError("Error inesperado. Por favor, intente nuevamente más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  const actualizarResumenTotal = (datos) => {
    // Calcular totales para ventas (valores positivos)
    const ventasData = datos.filter(item => item.tipo_venta === "Venta");
    const totalVentas = ventasData.reduce((sum, item) => sum + Math.abs(item.total_venta), 0);
    
    // Calcular totales para devoluciones (valores negativos en el acumulado)
    const devolucionesData = datos.filter(item => item.tipo_venta === "Devolución");
    const totalDevoluciones = devolucionesData.reduce((sum, item) => sum + Math.abs(item.total_venta), 0);
    
    // Calcular porcentaje de devoluciones respecto a ventas
    const porcentajeDevoluciones = totalVentas > 0 
      ? Math.round((totalDevoluciones / totalVentas) * 100) 
      : 0;
    
    // Actualizar resúmenes
    setResumenVentas({
      total: totalVentas,
      porcentaje: 100,
      periodo: "Total"
    });
    
    setResumenDevoluciones({
      total: totalDevoluciones,
      porcentaje: porcentajeDevoluciones,
      periodo: "Total"
    });
  };
  
  const filtrarAcumulados = () => {
    if (!acumulados.length) return;
    
    // Aplicar filtros según el periodo seleccionado en botones
    let filtradosPorPeriodo = [...acumulados];
    
    // Filtrar por tipo (Todos, Ventas, Devoluciones)
    if (filtro === "Ventas") {
      filtradosPorPeriodo = filtradosPorPeriodo.filter(item => item.tipo_venta === "Venta");
    } else if (filtro === "Devoluciones") {
      filtradosPorPeriodo = filtradosPorPeriodo.filter(item => item.tipo_venta === "Devolución");
    }
    
    // Filtrar por periodo de tiempo (Todos, Semana, Mes)
    const hoy = new Date();
    
    if (periodoFiltro === "semana" || filtro === "Semana") {
      const inicioSemana = new Date(hoy);
      inicioSemana.setDate(hoy.getDate() - hoy.getDay());
      inicioSemana.setHours(0, 0, 0, 0);
      
      filtradosPorPeriodo = filtradosPorPeriodo.filter(item => 
        new Date(item.fecha_venta) >= inicioSemana
      );
      
      // Actualizar texto del periodo en las cards
      const periodo = "Semana";
      setResumenVentas(prev => ({...prev, periodo}));
      setResumenDevoluciones(prev => ({...prev, periodo}));
      
    } else if (periodoFiltro === "mes" || filtro === "Mes") {
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      inicioMes.setHours(0, 0, 0, 0);
      
      filtradosPorPeriodo = filtradosPorPeriodo.filter(item => 
        new Date(item.fecha_venta) >= inicioMes
      );
      
      // Actualizar texto del periodo en las cards
      const periodo = "Mes";
      setResumenVentas(prev => ({...prev, periodo}));
      setResumenDevoluciones(prev => ({...prev, periodo}));
    }
    
    // Filtrar por rango de fechas seleccionado manualmente
    if (fechaInicio) {
      const inicio = new Date(fechaInicio);
      inicio.setHours(0, 0, 0, 0);
      filtradosPorPeriodo = filtradosPorPeriodo.filter(item => 
        new Date(item.fecha_venta) >= inicio
      );
    }
    
    if (fechaFin) {
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);
      filtradosPorPeriodo = filtradosPorPeriodo.filter(item => 
        new Date(item.fecha_venta) <= fin
      );
    }
    
    // Filtrar por término de búsqueda (cliente, número de venta)
    if (searchTerm.trim() !== "") {
      filtradosPorPeriodo = filtradosPorPeriodo.filter(
        item => 
          item.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.numero_venta.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.nombre_colaborador && item.nombre_colaborador.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Actualizar el estado de filtrados
    setAcumuladosFiltrados(filtradosPorPeriodo);
    
    // Actualizar resumen con los datos filtrados
    actualizarResumen(filtradosPorPeriodo);
  };
  
  const actualizarResumen = (datos) => {
    // Calcular totales para ventas (valores positivos)
    const ventasData = datos.filter(item => item.tipo_venta === "Venta");
    const totalVentas = ventasData.reduce((sum, item) => sum + Math.abs(item.total_venta), 0);
    
    // Calcular totales para devoluciones (valores negativos en el acumulado)
    const devolucionesData = datos.filter(item => item.tipo_venta === "Devolución");
    const totalDevoluciones = devolucionesData.reduce((sum, item) => sum + Math.abs(item.total_venta), 0);
    
    // Calcular porcentaje de devoluciones respecto a ventas
    const porcentajeDevoluciones = totalVentas > 0 
      ? Math.round((totalDevoluciones / totalVentas) * 100) 
      : 0;
    
    // Actualizar resúmenes manteniendo el periodo actual
    setResumenVentas(prev => ({
      ...prev,
      total: totalVentas,
      porcentaje: 100,
    }));
    
    setResumenDevoluciones(prev => ({
      ...prev,
      total: totalDevoluciones,
      porcentaje: porcentajeDevoluciones,
    }));
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
    setFiltro("Todos");
  };

  // Aplicar filtro desde los botones superiores
  const aplicarFiltro = (nuevoFiltro) => {
    setFiltro(nuevoFiltro);
    
    // Si se selecciona un periodo, actualizar también el estado del periodo
    if (nuevoFiltro === "Semana") {
      setPeriodoFiltro("semana");
    } else if (nuevoFiltro === "Mes") {
      setPeriodoFiltro("mes");
    } else {
      setPeriodoFiltro("todos");
    }
  };
  

const verDetalles = (item) => {
  if (item.tipo_venta === "Venta") {
    window.location.href = `/ventas/detalles/${item.id_venta}`;
  } else if (item.tipo_venta === "Devolución") {
    window.location.href = `/devoluciones/detalles/${item.id_venta}`;
  }
  
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
                  <p className="text-2xl font-bold">{formatearMoneda(resumenVentas.total)}</p>
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
                  <p className="text-2xl font-bold">{formatearMoneda(resumenDevoluciones.total)}</p>
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
                onClick={() => aplicarFiltro("Todos")}
              >
                Todos
              </button>
              <button
                className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Semana"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => aplicarFiltro("Semana")}
              >
                Semana
              </button>
              <button 
                className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Mes"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => aplicarFiltro("Mes")}
              >
                Mes
              </button>
              <button 
                className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Ventas"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => aplicarFiltro("Ventas")}
              >
                Ventas
              </button>
              <button 
                className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Devoluciones"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => aplicarFiltro("Devoluciones")}
              >
                Devoluciones
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
              
              {/* Botón para limpiar filtros */}
              {(fechaInicio || fechaFin || searchTerm || filtro !== "Todos") && (
                <button 
                  onClick={limpiarFiltros}
                  className="text-orange-600 hover:text-orange-800 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Limpiar filtros
                </button>
              )}
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
                        <th className="px-3 sm:px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th></th>
      
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
                          <tr key={`${acumulado.id_venta}-${acumulado.tipo_venta}`} className="hover:bg-gray-50">
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-base">
                              {acumulado.numero_venta}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-base">
                              <div className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs">
                                {acumulado.nombre_cliente}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-base text-gray-500">
                              {formatearFecha(acumulado.fecha_venta)}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-base">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${acumulado.tipo_venta === 'Venta' 
                                  ? 'bg-orange-100 text-orange-800' 
                                  : 'bg-slate-100 text-slate-800'
                                }`}>
                                {acumulado.tipo_venta}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-base text-right font-medium">
                              <span className={acumulado.tipo_venta === 'Devolución' ? 'text-red-600' : 'text-green-600'}>
                                {formatearMoneda(Math.abs(acumulado.total_venta))}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-base">
                              <div className="flex justify-center gap-2">
                                <Botones 
                                  tipo="primario" 
                                  label="Ver" 
                                  size="medium"
                                  onClick={() => verDetalles(acumulado)}
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
            
            {/* Paginación - Se podría implementar con backend pagination en versiones futuras */}
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
                {/* Paginación básica - se podría mejorar con paginación real */}
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