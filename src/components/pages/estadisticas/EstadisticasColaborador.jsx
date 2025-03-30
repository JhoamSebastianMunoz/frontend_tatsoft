import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { saleService } from "../../../context/services/ApiService";

// Componentes
import Sidebar from "../../organisms/Sidebar";
import Loading from "../../Loading/Loading";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";

const EstadisticasColaborador = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topClientes, setTopClientes] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [menosVendidos, setMenosVendidos] = useState([]);
  
  // Estado para el filtro de tiempo
  const [filtroTiempo, setFiltroTiempo] = useState("todo");
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());

  // Obtener lista de años disponibles
  const [aniosDisponibles, setAniosDisponibles] = useState([]);
  
  // Nombres de los meses para el filtro
  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Datos quemados para demostración
  const datosQuemadosClientes = [
    {
      id_cliente: 1,
      nombre_cliente: "Juan Pérez Martínez",
      total_compras: 5824.5,
      cantidad_compras: 12,
      razon_social: "Distribuidora El Sol S.A.",
    },
    {
      id_cliente: 2,
      nombre_cliente: "María Rodríguez López",
      total_compras: 4389.75,
      cantidad_compras: 7,
      razon_social: "Comercial Rodríguez S.A.S",
    },
    {
      id_cliente: 3,
      nombre_cliente: "Carlos Gómez Díaz",
      total_compras: 3957.2,
      cantidad_compras: 9,
      razon_social: "Importaciones Gómez Ltda.",
    },
    {
      id_cliente: 4,
      nombre_cliente: "Ana Fernández Ruiz",
      total_compras: 3245.0,
      cantidad_compras: 5,
      razon_social: "Tiendas Ana S.A.",
    },
    {
      id_cliente: 5,
      nombre_cliente: "Roberto Sánchez",
      total_compras: 2980.3,
      cantidad_compras: 8,
      razon_social: "Comercializadora RBS",
    },
    {
      id_cliente: 6,
      nombre_cliente: "Laura Torres Vega",
      total_compras: 2650.45,
      cantidad_compras: 6,
      razon_social: "Almacenes Torres",
    },
    {
      id_cliente: 7,
      nombre_cliente: "Miguel Ángel Rivas",
      total_compras: 2345.8,
      cantidad_compras: 5,
      razon_social: "Distribuciones Rivas",
    },
    {
      id_cliente: 8,
      nombre_cliente: "Patricia Mendoza",
      total_compras: 2100.0,
      cantidad_compras: 4,
      razon_social: "Comercializadora PM",
    },
    {
      id_cliente: 9,
      nombre_cliente: "Fernando López",
      total_compras: 1870.25,
      cantidad_compras: 3,
      razon_social: "Tiendas FL Express",
    },
    {
      id_cliente: 10,
      nombre_cliente: "Claudia Morales",
      total_compras: 1540.6,
      cantidad_compras: 3,
      razon_social: "CM Distribuciones",
    },
  ];

  const datosQuemadosProductosMasVendidos = [
    {
      id_producto: 1,
      nombre_producto: "Laptop Gamer XTreme",
      cantidad_vendida: 42,
      monto_total: 38500,
    },
    {
      id_producto: 2,
      nombre_producto: "Smartphone Galaxy S22",
      cantidad_vendida: 38,
      monto_total: 25650,
    },
    {
      id_producto: 3,
      nombre_producto: "Smart TV 55 pulgadas",
      cantidad_vendida: 25,
      monto_total: 18750,
    },
    {
      id_producto: 4,
      nombre_producto: "Auriculares Bluetooth",
      cantidad_vendida: 60,
      monto_total: 6000,
    },
    {
      id_producto: 5,
      nombre_producto: "Tablet Pro 12",
      cantidad_vendida: 22,
      monto_total: 13200,
    },
    {
      id_producto: 6,
      nombre_producto: "Monitor Curvo 32",
      cantidad_vendida: 18,
      monto_total: 7920,
    },
    {
      id_producto: 7,
      nombre_producto: "Cámara Digital HD",
      cantidad_vendida: 15,
      monto_total: 7500,
    },
    {
      id_producto: 8,
      nombre_producto: "Impresora Multifuncional",
      cantidad_vendida: 12,
      monto_total: 4200,
    },
    {
      id_producto: 9,
      nombre_producto: "Router WiFi 6",
      cantidad_vendida: 20,
      monto_total: 3980,
    },
    {
      id_producto: 10,
      nombre_producto: "Disco Duro Externo 2TB",
      cantidad_vendida: 28,
      monto_total: 3920,
    },
  ];

  const datosQuemadosProductosMenosVendidos = [
    {
      id_producto: 11,
      nombre_producto: "Teclado Mecánico Gamer",
      cantidad_vendida: 3,
      monto_total: 450,
    },
    {
      id_producto: 12,
      nombre_producto: "Adaptador HDMI a VGA",
      cantidad_vendida: 4,
      monto_total: 120,
    },
    {
      id_producto: 13,
      nombre_producto: "Cargador Portátil",
      cantidad_vendida: 5,
      monto_total: 250,
    },
    {
      id_producto: 14,
      nombre_producto: "Cable USB tipo C",
      cantidad_vendida: 6,
      monto_total: 90,
    },
    {
      id_producto: 15,
      nombre_producto: "Soporte para Laptop",
      cantidad_vendida: 4,
      monto_total: 200,
    },
    {
      id_producto: 16,
      nombre_producto: "Funda para Tablet",
      cantidad_vendida: 7,
      monto_total: 175,
    },
    {
      id_producto: 17,
      nombre_producto: "Lector de Tarjetas",
      cantidad_vendida: 3,
      monto_total: 75,
    },
    {
      id_producto: 18,
      nombre_producto: "Batería de Reemplazo",
      cantidad_vendida: 2,
      monto_total: 180,
    },
    {
      id_producto: 19,
      nombre_producto: "Pasta Térmica Premium",
      cantidad_vendida: 5,
      monto_total: 100,
    },
    {
      id_producto: 20,
      nombre_producto: "Hub USB 4 puertos",
      cantidad_vendida: 4,
      monto_total: 120,
    },
  ];

  // Función para formatear moneda
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  // Cargar datos (usando datos quemados)
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulación de carga de datos
      setTimeout(() => {
        const clientesFiltrados = aplicarFiltros(datosQuemadosClientes);
        const productosFiltrados = aplicarFiltros(datosQuemadosProductosMasVendidos);
        const menosVendidosFiltrados = aplicarFiltros(datosQuemadosProductosMenosVendidos);
        
        setTopClientes(clientesFiltrados);
        setTopProductos(productosFiltrados);
        setMenosVendidos(menosVendidosFiltrados);
        
        // Extraer años de los datos (en un caso real, esto vendría de los datos)
        const años = [2023, 2024, 2025];
        setAniosDisponibles(años);
        
        setLoading(false);
      }, 800);
    } catch (err) {
      setError("Error al cargar los datos: " + (err.message || "Error desconocido"));
      console.error(err);
      setLoading(false);
    }
  };

  // Aplicar filtros a los datos según el periodo seleccionado
  const aplicarFiltros = (datos) => {
    // Esto es una simulación. En un caso real, se filtrarían los datos
    // según la fecha de cada transacción
    if (filtroTiempo === "mes") {
      // Simular filtro por mes
      return datos.slice(0, Math.ceil(datos.length * 0.7));
    } else if (filtroTiempo === "anio") {
      // Simular filtro por año
      return datos.slice(0, Math.ceil(datos.length * 0.9));
    }
    
    return datos;
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Efecto para aplicar filtros cuando cambia el filtro de tiempo
  useEffect(() => {
    cargarDatos();
  }, [filtroTiempo, mesSeleccionado, anioSeleccionado]);

  // Formatear datos para los gráficos de clientes
  const formatClientesData = () => {
    return topClientes.map((cliente) => {
      // Obtener solo el primer nombre
      const nombreCompleto = cliente.nombre_cliente;
      const primerNombre = nombreCompleto.split(' ')[0];
      
      return {
        name: primerNombre,
        total: cliente.total_compras,
        tooltipName: cliente.nombre_cliente,
        razonSocial: cliente.razon_social,
        cantidadCompras: cliente.cantidad_compras,
      };
    });
  };

  // Formatear datos para los gráficos de productos
  const formatProductosData = (productos) => {
    return productos.map((producto) => {
      // Obtener solo el primer nombre del producto
      const nombreCompleto = producto.nombre_producto;
      const primerNombre = nombreCompleto.split(' ')[0];
      
      return {
        name: primerNombre,
        cantidad: producto.cantidad_vendida,
        monto: producto.monto_total,
        tooltipName: producto.nombre_producto,
      };
    });
  };

  // Personalizar tooltip para clientes
  const CustomTooltipClientes = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-lg">
          <p className="font-semibold text-gray-800">Nombre: {data.tooltipName}</p>
          <p className="text-sm text-gray-600">Razón Social: {data.razonSocial}</p>
          <p className="text-sm text-gray-600">Total compras: {formatearMoneda(data.total)}</p>
          <p className="text-sm text-gray-600">Cantidad de compras: {data.cantidadCompras}</p>
        </div>
      );
    }
    return null;
  };

  // Personalizar tooltip para productos
  const CustomTooltipProductos = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-lg">
          <p className="font-semibold text-gray-800">Producto: {data.tooltipName}</p>
          <p className="text-sm text-gray-600">Cantidad vendida: {data.cantidad}</p>
          <p className="text-sm text-gray-600">Monto total: {formatearMoneda(data.monto)}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <Loading message="Cargando estadísticas..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      
      <Tipografia>
        <main className="w-full md:pl-[100px] pl-20 pr-2 pt-[80px] md:pt-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <Tipografia variant="h1" className="text-xl md:text-2xl font-semibold text-gray-900">
                Estadísticas por Colaborador
              </Tipografia>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                <div className="flex items-center">
                  <Icono name="eliminarAlert" size={20} />
                  <span className="ml-2 text-sm md:text-base">{error}</span>
                </div>
              </div>
            )}
            
            {/* Filtros de tiempo */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtrar por periodo</h2>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filtroTiempo === "todo" ? "bg-[#F78220] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setFiltroTiempo("todo")}
                >
                  Todos los periodos
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filtroTiempo === "mes" ? "bg-[#F78220] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setFiltroTiempo("mes")}
                >
                  Por mes
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filtroTiempo === "anio" ? "bg-[#F78220] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setFiltroTiempo("anio")}
                >
                  Por año
                </button>
              </div>
              
              {filtroTiempo !== "todo" && (
                <div className="flex flex-wrap gap-4 mb-2">
                  {/* Selector de año */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Año</label>
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F78220] focus:border-transparent"
                      value={anioSeleccionado}
                      onChange={(e) => setAnioSeleccionado(parseInt(e.target.value, 10))}
                    >
                      {aniosDisponibles.map(anio => (
                        <option key={anio} value={anio}>{anio}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Selector de mes (solo visible cuando el filtro es por mes) */}
                  {filtroTiempo === "mes" && (
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">Mes</label>
                      <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F78220] focus:border-transparent"
                        value={mesSeleccionado}
                        onChange={(e) => setMesSeleccionado(parseInt(e.target.value, 10))}
                      >
                        {nombresMeses.map((nombre, index) => (
                          <option key={index} value={index}>{nombre}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-sm text-gray-500 mt-2">
                {topClientes.length} datos de clientes encontrados en el periodo seleccionado
              </div>
            </div>

            {/* Top 10 Clientes */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Top 10 Clientes que Más Compran
                {filtroTiempo === "mes" && ` - ${nombresMeses[mesSeleccionado]} ${anioSeleccionado}`}
                {filtroTiempo === "anio" && ` - ${anioSeleccionado}`}
              </h2>
              
              <div className="h-[450px]">
                {topClientes.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formatClientesData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-75}
                        textAnchor="end"
                        height={110}
                        interval={0}
                        tick={{ fontSize: 13 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => formatearMoneda(value).replace('$', '')}
                      />
                      <Tooltip content={<CustomTooltipClientes />} />
                      <Legend />
                      <Bar
                        dataKey="total"
                        name="Total de Compras"
                        fill="#F78220"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No hay suficientes datos para mostrar el gráfico en el periodo seleccionado
                  </div>
                )}
              </div>
            </div>

            {/* Top 10 Productos Más Vendidos */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Top 10 Productos Más Vendidos
                {filtroTiempo === "mes" && ` - ${nombresMeses[mesSeleccionado]} ${anioSeleccionado}`}
                {filtroTiempo === "anio" && ` - ${anioSeleccionado}`}
              </h2>
              
              <div className="h-96">
                {topProductos.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formatProductosData(topProductos)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-75}
                        textAnchor="end"
                        height={110}
                        interval={0}
                        tick={{ fontSize: 13 }}
                      />
                      <YAxis yAxisId="left" orientation="left" stroke="#F78220" />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#3B82F6" 
                        tickFormatter={(value) => formatearMoneda(value).replace('$', '')}
                      />
                      <Tooltip content={<CustomTooltipProductos />} />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="cantidad"
                        name="Cantidad Vendida"
                        fill="#F78220"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="monto"
                        name="Monto Total"
                        fill="#3B82F6"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No hay suficientes datos para mostrar el gráfico en el periodo seleccionado
                  </div>
                )}
              </div>
            </div>

            {/* Top 10 Productos Menos Vendidos */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Top 10 Productos Menos Vendidos
                {filtroTiempo === "mes" && ` - ${nombresMeses[mesSeleccionado]} ${anioSeleccionado}`}
                {filtroTiempo === "anio" && ` - ${anioSeleccionado}`}
              </h2>
              
              <div className="h-96">
                {menosVendidos.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formatProductosData(menosVendidos)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-75}
                        textAnchor="end"
                        height={110}
                        interval={0}
                        tick={{ fontSize: 13 }}
                      />
                      <YAxis yAxisId="left" orientation="left" stroke="#10B981" />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#8B5CF6"
                        tickFormatter={(value) => formatearMoneda(value).replace('$', '')}
                      />
                      <Tooltip content={<CustomTooltipProductos />} />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="cantidad"
                        name="Cantidad Vendida"
                        fill="#10B981"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="monto"
                        name="Monto Total"
                        fill="#8B5CF6"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No hay suficientes datos para mostrar el gráfico en el periodo seleccionado
                  </div>
                )}
              </div>
            </div>

            {/* Botones de navegación */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 mb-8">
              <Boton
                label="Ver Historial de Ventas"
                onClick={() => navigate('/ventas/historial')}
                className="w-full sm:w-auto"
              />
              <Boton
                label="Volver a Estadísticas de Ventas"
                onClick={() => navigate('/ventas/estadisticas')}
                variant="secondary"
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </main>
      </Tipografia>
    </div>
  );
};

export default EstadisticasColaborador;