import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { presaleService, saleService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Encabezado from "../../molecules/Encabezado";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import Loading from "../../Loading/Loading";
import SidebarAdm from "../../organisms/SidebarAdm";
import Buscador from "../../molecules/Buscador";

const ComparativaVentasDevoluciones = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados para datos
  const [ventas, setVentas] = useState([]);
  const [devoluciones, setDevoluciones] = useState([]);
  const [comparativaData, setComparativaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para filtros
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroZona, setFiltroZona] = useState("Todas");
  const [zonas, setZonas] = useState(["Todas"]);

  // Cargar datos de ventas y devoluciones
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar ventas
        const ventasResponse = await saleService.getAllSales();
        const ventasData = Array.isArray(ventasResponse.data) 
          ? ventasResponse.data 
          : ventasResponse.data?.message || [];
        setVentas(ventasData);
        
        // Cargar devoluciones
        const devolucionesResponse = await presaleService.getAllRefund();
        const devolucionesData = Array.isArray(devolucionesResponse.data) 
          ? devolucionesResponse.data 
          : devolucionesResponse.data?.message || [];
        setDevoluciones(devolucionesData);
        
        // Extraer zonas únicas para el filtro
        const zonasUnicas = new Set(["Todas"]);
        ventasData.forEach(venta => {
          if (venta.nombre_zona) zonasUnicas.add(venta.nombre_zona);
        });
        devolucionesData.forEach(devolucion => {
          if (devolucion.nombre_zona) zonasUnicas.add(devolucion.nombre_zona);
        });
        setZonas(Array.from(zonasUnicas));
        
        // Preparar datos comparativos
        prepararDatosComparativos(ventasData, devolucionesData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar la información de ventas y devoluciones. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Preparar datos comparativos por cliente
  const prepararDatosComparativos = (ventasData, devolucionesData) => {
    // Crear mapa de clientes
    const clientesMap = new Map();
    
    // Procesar ventas
    ventasData.forEach(venta => {
      const clienteId = venta.id_cliente;
      if (!clientesMap.has(clienteId)) {
        clientesMap.set(clienteId, {
          id_cliente: clienteId,
          razon_social: venta.razon_social || "",
          nombre_zona: venta.nombre_zona || "No especificada",
          total_ventas: 0,
          total_devoluciones: 0,
          fecha_ultima_transaccion: venta.fecha_confirmacion,
          preventas: []
        });
      }
      
      const cliente = clientesMap.get(clienteId);
      cliente.total_ventas += parseFloat(venta.total_vendido) || 0;
      cliente.preventas.push({
        id_preventa: venta.id_preventa,
        tipo: "Venta",
        fecha: venta.fecha_confirmacion,
        monto: parseFloat(venta.total_vendido) || 0
      });
      
      // Actualizar fecha última transacción si es más reciente
      if (new Date(venta.fecha_confirmacion) > new Date(cliente.fecha_ultima_transaccion)) {
        cliente.fecha_ultima_transaccion = venta.fecha_confirmacion;
      }
    });
    
    // Procesar devoluciones
    devolucionesData.forEach(devolucion => {
      const clienteId = devolucion.id_cliente;
      if (!clientesMap.has(clienteId)) {
        clientesMap.set(clienteId, {
          id_cliente: clienteId,
          razon_social: devolucion.razon_social || "",
          nombre_zona: devolucion.nombre_zona || "No especificada",
          total_ventas: 0,
          total_devoluciones: 0,
          fecha_ultima_transaccion: devolucion.fecha_confirmacion,
          preventas: []
        });
      }
      
      const cliente = clientesMap.get(clienteId);
      cliente.total_devoluciones += parseFloat(devolucion.total_devuelto) || 0;
      cliente.preventas.push({
        id_preventa: devolucion.id_preventa,
        tipo: "Devolución",
        fecha: devolucion.fecha_confirmacion,
        monto: parseFloat(devolucion.total_devuelto) || 0
      });
      
      // Actualizar fecha última transacción si es más reciente
      if (new Date(devolucion.fecha_confirmacion) > new Date(cliente.fecha_ultima_transaccion)) {
        cliente.fecha_ultima_transaccion = devolucion.fecha_confirmacion;
      }
    });
    
    // Convertir mapa a array y calcular porcentaje de devolución
    const comparativaArray = Array.from(clientesMap.values()).map(cliente => ({
      ...cliente,
      porcentaje_devolucion: cliente.total_ventas > 0 
        ? (cliente.total_devoluciones / cliente.total_ventas * 100).toFixed(2)
        : 0
    }));
    
    setComparativaData(comparativaArray);
  };

  // Aplicar filtros a los datos comparativos
  const datosFiltrados = comparativaData.filter(item => {
    // Filtro por búsqueda (razón social)
    const cumpleBusqueda = busqueda === "" || 
      (item.razon_social && item.razon_social.toLowerCase().includes(busqueda.toLowerCase()));
    
    // Filtro por zona
    const cumpleZona = filtroZona === "Todas" || item.nombre_zona === filtroZona;
    
    // Filtro por rango de fechas
    let cumpleFecha = true;
    if (fechaInicio && fechaFin) {
      const fechaItem = new Date(item.fecha_ultima_transaccion);
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59); // Incluir todo el día final
      
      cumpleFecha = fechaItem >= inicio && fechaItem <= fin;
    }
    
    return cumpleBusqueda && cumpleZona && cumpleFecha;
  });

  // Calcular totales para resumen
  const calcularTotales = () => {
    let totalVentas = 0;
    let totalDevoluciones = 0;
    let totalUnidadesVendidas = ventas.length;
    let totalUnidadesDevueltas = devoluciones.length;
    
    comparativaData.forEach(item => {
      totalVentas += item.total_ventas;
      totalDevoluciones += item.total_devoluciones;
    });
    
    return {
      totalVentas,
      totalDevoluciones,
      totalUnidadesVendidas,
      totalUnidadesDevueltas,
      porcentajeDevolucion: totalVentas > 0 ? (totalDevoluciones / totalVentas * 100).toFixed(2) : 0
    };
  };
  
  const totales = calcularTotales();

  // Formatear fecha para mostrar
  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Fecha no disponible";
    const fecha = new Date(fechaString);
    return fecha.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Navegación a detalles
  const verDetalles = (id, tipo) => {
    if (tipo === "Venta") {
      navigate(`/ventas/detalles/${id}`);
    } else {
      navigate(`/devoluciones/detalles/${id}`);
    }
  };

  if (loading) {
    return <Loading message="Cargando datos comparativos..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Encabezado
        mensaje="Comparativa de Ventas y Devoluciones"
        onClick={() => navigate("/perfil")}
      />
      <SidebarAdm />
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

        {/* Resumen de totales */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 flex-1">
            <Tipografia variant="h3" className="text-purple-700 font-bold mb-2">
              Ventas
            </Tipografia>
            <div className="text-2xl font-bold text-green-600 mb-1">
              ${totales.totalVentas.toLocaleString('es-CO')}
            </div>
            <div className="text-sm text-gray-600">
              {totales.totalUnidadesVendidas} operaciones
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 flex-1">
            <Tipografia variant="h3" className="text-purple-700 font-bold mb-2">
              Devoluciones
            </Tipografia>
            <div className="text-2xl font-bold text-red-600 mb-1">
              ${totales.totalDevoluciones.toLocaleString('es-CO')}
            </div>
            <div className="text-sm text-gray-600">
              {totales.totalUnidadesDevueltas} operaciones
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 flex-1">
            <Tipografia variant="h3" className="text-purple-700 font-bold mb-2">
              % Devoluciones
            </Tipografia>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {totales.porcentajeDevolucion}%
            </div>
            <div className="text-sm text-gray-600">
              del total de ventas
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <Tipografia variant="h3" className="text-gray-700 font-semibold mb-4">
            Filtros
          </Tipografia>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio:
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin:
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zona:
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={filtroZona}
                onChange={(e) => setFiltroZona(e.target.value)}
              >
                {zonas.map((zona, index) => (
                  <option key={index} value={zona}>
                    {zona}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar cliente:
              </label>
              <Buscador
                placeholder="Buscar cliente..."
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          
          {/* Botón para limpiar filtros */}
          {(fechaInicio || fechaFin || busqueda || filtroZona !== "Todas") && (
            <div className="flex justify-end mt-3">
              <button
                onClick={() => {
                  setFechaInicio("");
                  setFechaFin("");
                  setBusqueda("");
                  setFiltroZona("Todas");
                }}
                className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Tabla de datos comparativos */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold mb-4">
            Comparativa por Cliente
          </Tipografia>
          
          {datosFiltrados.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zona
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ventas
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Devoluciones
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % Devolución
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Transacción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {datosFiltrados.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.razon_social || `Cliente ${item.id_cliente}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {item.nombre_zona}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-green-600">
                          ${item.total_ventas.toLocaleString('es-CO')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-red-600">
                          ${item.total_devoluciones.toLocaleString('es-CO')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`text-sm font-medium ${
                          parseFloat(item.porcentaje_devolucion) > 30 ? 'text-red-600' : 
                          parseFloat(item.porcentaje_devolucion) > 10 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {item.porcentaje_devolucion}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-500">
                          {formatearFecha(item.fecha_ultima_transaccion)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No se encontraron datos que coincidan con los criterios de búsqueda
            </div>
          )}
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-end space-x-4 mt-6">
          <Boton
            tipo="secundario"
            label="Ver Ventas"
            onClick={() => navigate("/ventas/historial")}
          />
          <Boton
            tipo="primario"
            label="Ver Devoluciones"
            onClick={() => navigate("/devoluciones/historial")}
          />
        </div>
      </div>
    </div>
  );
};

export default ComparativaVentasDevoluciones;