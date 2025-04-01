import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tipografia from "../../atoms/Tipografia";
import Icono from "../../atoms/Iconos";
import Botones from "../../atoms/Botones";
import Buscador from "../../molecules/Buscador";
import Sidebar from "../../organisms/Sidebar";
import { useAuth } from "../../../context/AuthContext";
// Importar el servicio productService que ya está configurado
import { productService } from "../../../context/services/ApiService";// Ajusta la ruta según la estructura de tu proyecto

const HistorialIngresos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estado para el sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return JSON.parse(localStorage.getItem("sidebarCollapsed") || "true");
  });

  // Estados para la búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [usuarioResponsable, setUsuarioResponsable] = useState("");

  // Estado para el detalle expandido
  const [expandedRow, setExpandedRow] = useState(null);
  
  // Estados para datos de la API
  const [historialIngresos, setHistorialIngresos] = useState([]);
  const [historialFiltrado, setHistorialFiltrado] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Guardar estado del sidebar en localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Cargar los datos del historial desde la API
  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        setLoading(true);
        const response = await productService.getHistoricalStock();
        
        // Obtener los datos del response (puede ser response.data o directamente response dependiendo de cómo esté implementado el servicio)
        const datos = response.data || response;
        
        // Transformar datos de la API al formato que espera el componente
        const historialFormateado = datos.map(item => ({
          id: item.id_registro,
          fecha: formatearFecha(item.fecha_ingreso),
          producto: item.nombre_producto,
          cantidad: item.cantidad_ingresada,
          usuarioResponsable: item.nombre_usuario,
          codigoIngreso: item.id_registro,
          stock: item.cantidad_ingresada, // Asumiendo que esta es la cantidad en stock
          porcentajeVenta: `${item.porcentaje_venta}%`,
          codigoFacturaProveedor: item.codigo_factura,
          costoTotal: formatearPrecio(item.costo_total),
          costoUnitario: formatearPrecio(item.costo_unitario),
          fechaVencimiento: formatearFecha(item.fecha_vencimiento)
        }));
        
        setHistorialIngresos(historialFormateado);
        setHistorialFiltrado(historialFormateado);
        
        // Extraer usuarios únicos para el filtro
        const usuariosUnicos = [...new Set(datos.map(item => item.nombre_usuario))];
        setUsuarios(usuariosUnicos);
        
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener historial:", err);
        setLoading(false);
      }
    };
    
    obtenerHistorial();
  }, []);

  // Función para formatear fechas (convertir de ISO a formato dd/mm/yyyy)
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para formatear precios (agregar separador de miles y símbolo $)
  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CO')}`;
  };

  // Aplicar filtros
  const handleSearch = () => {
    // Filtrar por término de búsqueda (nombre del producto)
    let filtrados = historialIngresos;
    
    if (searchTerm) {
      filtrados = filtrados.filter(item => 
        item.producto.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por fechas
    if (fechaDesde) {
      const fechaDesdeObj = new Date(fechaDesde);
      filtrados = filtrados.filter(item => {
        const fechaItem = new Date(convertirFechaEspanolAISO(item.fecha));
        return fechaItem >= fechaDesdeObj;
      });
    }
    
    if (fechaHasta) {
      const fechaHastaObj = new Date(fechaHasta);
      fechaHastaObj.setHours(23, 59, 59); // Ajustar al final del día
      filtrados = filtrados.filter(item => {
        const fechaItem = new Date(convertirFechaEspanolAISO(item.fecha));
        return fechaItem <= fechaHastaObj;
      });
    }
    
    // Filtrar por usuario responsable
    if (usuarioResponsable) {
      filtrados = filtrados.filter(item => 
        item.usuarioResponsable === usuarioResponsable
      );
    }
    
    setHistorialFiltrado(filtrados);
    console.log("Filtros aplicados:", { searchTerm, fechaDesde, fechaHasta, usuarioResponsable });
  };

  // Función para convertir fecha de formato español (dd/mm/yyyy) a ISO (yyyy-mm-dd)
  const convertirFechaEspanolAISO = (fechaEspanol) => {
    const partes = fechaEspanol.split('/');
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  };

  const toggleDetalles = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  const navigateToIngresoStock = () => {
    navigate("/ingreso-stock");
  };

  // Obtener la fecha de hoy en formato ISO para los inputs de fecha
  const hoy = new Date().toISOString().split("T")[0];

  // Si hay error, mostrar mensaje de error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>{error}</p>
          <button 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
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
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 ml-5">Historial Ingresos</h1>
          </div>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
          <div className="bg-white rounded-lg shadow-md border-l-2 border-orange-600 mb-4 ml-3">
            <div className="p-3 flex flex-col sm:flex-row justify-between items-center">
              <div>
                <div className="flex items-center mt-1">
                  <span className="bg-orange-200 text-orange-800 text-xs font-medium px-3 py-0.5 rounded-full mr-3">
                    {historialFiltrado.length} Registros
                  </span>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 flex w-full sm:w-auto justify-center sm:justify-end">
                <Botones
                  tipo="primario"
                  label="Nuevo Ingreso"
                  onClick={navigateToIngresoStock}
                  className="mr-2 w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producto
                </label>
                <Buscador
                  placeholder="Buscar por nombre"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  max={hoy}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  max={hoy}
                />
              </div>
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario Responsable
                </label>
                <select
                  value={usuarioResponsable}
                  onChange={(e) => setUsuarioResponsable(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="">Todos</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario} value={usuario}>
                      {usuario}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-1 flex items-end">
                <Botones
                  label="Aplicar Filtros"
                  tipo="secundario"
                  onClick={handleSearch}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="border-b pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h3 className="font-medium text-orange-600 mb-2 sm:mb-0">
                Detalles del ingreso
                <span className="ml-2 text-sm font-normal text-gray-700">
                  Mostrando {historialFiltrado.length} registros
                </span>
              </h3>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-orange-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cantidad
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Usuario
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Detalle
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {historialFiltrado.length > 0 ? (
                          historialFiltrado.map((ingreso) => (
                            <React.Fragment key={ingreso.id}>
                              <tr className={`hover:bg-gray-50 ${expandedRow === ingreso.id ? "bg-orange-50" : ""}`}>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                                  {ingreso.fecha}
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-[120px] sm:max-w-xs">
                                  {ingreso.producto}
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                                  {ingreso.cantidad}
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-[120px] sm:max-w-xs">
                                  {ingreso.usuarioResponsable}
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                  <button
                                    onClick={() => toggleDetalles(ingreso.id)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white rounded px-3 py-1 text-xs inline-flex items-center justify-center"
                                  >
                                    <Icono
                                      name={expandedRow === ingreso.id ? "eliminarAlert" : "despliegue"}
                                      size={14}
                                      className="mr-1"
                                      customColor="white"
                                    />
                                    {expandedRow === ingreso.id ? "Ocultar" : "Ver"}
                                  </button>
                                </td>
                              </tr>
                              {expandedRow === ingreso.id && (
                                <tr className="bg-orange-50">
                                  <td colSpan="5" className="px-3 sm:px-6 py-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                      <div className="bg-white p-3 rounded shadow-sm">
                                        <div className="font-bold text-orange-600 mb-2">Datos de ingreso</div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <div className="text-gray-600">Código:</div>
                                          <div className="font-medium">{ingreso.codigoIngreso}</div>
                                          <div className="text-gray-600">Factura:</div>
                                          <div className="font-medium">{ingreso.codigoFacturaProveedor}</div>
                                          <div className="text-gray-600">Vencimiento:</div>
                                          <div className="font-medium">{ingreso.fechaVencimiento}</div>
                                        </div>
                                      </div>
                                      <div className="bg-white p-3 rounded shadow-sm">
                                        <div className="font-bold text-orange-600 mb-2">Datos de costo</div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <div className="text-gray-600">Stock:</div>
                                          <div className="font-medium">{ingreso.stock}</div>
                                          <div className="text-gray-600">Total:</div>
                                          <div className="font-medium">{ingreso.costoTotal}</div>
                                          <div className="text-gray-600">Unitario:</div>
                                          <div className="font-medium">{ingreso.costoUnitario}</div>
                                        </div>
                                      </div>
                                      <div className="bg-white p-3 rounded shadow-sm">
                                        <div className="font-bold text-orange-600 mb-2">Datos de venta</div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <div className="text-gray-600">% Venta:</div>
                                          <div className="font-medium">{ingreso.porcentajeVenta}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-3 sm:px-6 py-4 text-center text-gray-500">
                              No se encontraron registros con los filtros aplicados
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between mt-4">
                  <div className="text-sm text-gray-700 mb-2 sm:mb-0 text-center sm:text-left">
                    <p>
                      Mostrando <span className="font-medium">1</span> a{" "}
                      <span className="font-medium">
                        {historialFiltrado.length}
                      </span>{" "}
                      de{" "}
                      <span className="font-medium">
                        {historialFiltrado.length}
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
              </>
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

export default HistorialIngresos;