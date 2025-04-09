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
  AreaChart,
  Area,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { presaleService } from "../../../context/services/ApiService";

// Componentes
import Sidebar from "../../organisms/Sidebar";
import Loading from "../../Loading/Loading";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";

const CHART_COLORS = {
  clientes: "#5E60CE",
  productosMasVendidos: {
    cantidad: "#008B74",
    monto: "#5390D9",
  },
  productosMenosVendidos: {
    cantidad: "#06D6A0",
    monto: "#118AB2",
  },
};

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
  const [anioSeleccionado, setAnioSeleccionado] = useState(
    new Date().getFullYear()
  );

  // Obtener lista de años disponibles (últimos 3 años)
  const [aniosDisponibles, setAniosDisponibles] = useState([]);

  // Nombres de los meses para el filtro
  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Función para formatear moneda
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);
  };

  // Función para calcular las fechas según el filtro seleccionado
  const calcularFechasFiltro = () => {
    const fechaActual = new Date();
    let fechaInicio, fechaFin;

    if (filtroTiempo === "todo") {
      // Para "todo", consideramos los últimos 5 años hasta hoy
      fechaInicio = new Date(fechaActual.getFullYear() - 5, 0, 1);
      fechaFin = new Date();
    } else if (filtroTiempo === "mes") {
      // Para filtro por mes
      fechaInicio = new Date(anioSeleccionado, mesSeleccionado, 1);
      if (mesSeleccionado === 11) {
        fechaFin = new Date(anioSeleccionado + 1, 0, 0);
      } else {
        fechaFin = new Date(anioSeleccionado, mesSeleccionado + 1, 0);
      }
    } else if (filtroTiempo === "anio") {
      // Para filtro por año
      fechaInicio = new Date(anioSeleccionado, 0, 1);
      fechaFin = new Date(anioSeleccionado, 11, 31);
    }

    // Formatear fechas para la API (YYYY-MM-DD)
    const formatearFecha = (fecha) => {
      return fecha.toISOString().split("T")[0];
    };

    return {
      fechaInicio: formatearFecha(fechaInicio),
      fechaFin: formatearFecha(fechaFin),
    };
  };

  // Cargar datos desde la API
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    
    // Limpiar datos anteriores
    setTopClientes([]);
    setTopProductos([]);
    setMenosVendidos([]);

    try {
      const { fechaInicio, fechaFin } = calcularFechasFiltro();

      // Intentar cargar datos en paralelo
      try {
        // Usamos Promise.allSettled para que si falla una solicitud, las otras continúen
        const [clientesResp, prodMasVendidosResp, prodMenosVendidosResp] = await Promise.allSettled([
          presaleService.getTopClientes(fechaInicio, fechaFin),
          presaleService.getTopProductosVendidos(fechaInicio, fechaFin),
          presaleService.getTopProductosMenosVendidos(fechaInicio, fechaFin)
        ]);

        // Procesar resultados de clientes
        if (clientesResp.status === 'fulfilled' && clientesResp.value.data) {
          setTopClientes(clientesResp.value.data);
        }

        // Procesar resultados de productos más vendidos
        if (prodMasVendidosResp.status === 'fulfilled' && prodMasVendidosResp.value.data) {
          setTopProductos(prodMasVendidosResp.value.data);
        }

        // Procesar resultados de productos menos vendidos
        if (prodMenosVendidosResp.status === 'fulfilled' && prodMenosVendidosResp.value.data) {
          setMenosVendidos(prodMenosVendidosResp.value.data);
        }

        // Si todas las solicitudes fallaron con 404 o no hay datos, mostrar mensaje informativo
        if (
          (clientesResp.status === 'rejected' && clientesResp.reason?.response?.status === 404) &&
          (prodMasVendidosResp.status === 'rejected' && prodMasVendidosResp.reason?.response?.status === 404) &&
          (prodMenosVendidosResp.status === 'rejected' && prodMenosVendidosResp.reason?.response?.status === 404)
        ) {
          setError("No hay información disponible para el periodo seleccionado.");
        }
        
      } catch (err) {
        // Este bloque solo se ejecutará si hay un error al intentar hacer las peticiones
        console.error("Error al intentar hacer las solicitudes:", err);
        setError("No hay información disponible para el periodo seleccionado.");
      }

      // Generar años disponibles (año actual y los 2 anteriores)
      const anioActual = new Date().getFullYear();
      setAniosDisponibles([anioActual - 2, anioActual - 1, anioActual]);

      setLoading(false);
    } catch (err) {
      console.error("Error general cargando estadísticas:", err);
      setError("No hay información disponible para el periodo seleccionado.");
      setLoading(false);
    }
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
      const primerNombre = nombreCompleto.split(" ")[0];

      return {
        name: primerNombre,
        total: parseFloat(cliente.monto_total),
        tooltipName: cliente.nombre_cliente,
        cantidadCompras: cliente.total_compras,
      };
    });
  };

  // Formatear datos para los gráficos de productos
  const formatProductosData = (productos) => {
    return productos.map((producto) => {
      // Obtener solo el primer nombre del producto
      const nombreCompleto = producto.nombre_producto;
      const primerNombre = nombreCompleto.split(" ")[0];

      return {
        name: primerNombre,
        cantidad: producto.cantidad_vendida,
        monto: parseFloat(producto.monto_total),
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
          <p className="font-semibold text-gray-800">
            Nombre: {data.tooltipName}
          </p>
          <p className="text-sm text-gray-600">
            Total compras: {formatearMoneda(data.total)}
          </p>
          <p className="text-sm text-gray-600">
            Cantidad de compras: {data.cantidadCompras}
          </p>
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
          <p className="font-semibold text-gray-800">
            Producto: {data.tooltipName}
          </p>
          <p className="text-sm text-gray-700">
            Cantidad vendida: {data.cantidad}
          </p>
          <p className="text-sm text-gray-700">
            Monto total: {formatearMoneda(data.monto)}
          </p>
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
              <Tipografia
                variant="h1"
                className="text-xl md:text-2xl font-semibold text-gray-900"
              >
                Estadísticas
              </Tipografia>
            </div>

            {error && (
              <div className="bg-amber-50 border-l-4 border-amber-400 text-amber-700 p-4 mb-4 rounded">
                <div className="flex items-center">
                  <Icono name="warning" size={20} />
                  <span className="ml-2 text-sm md:text-base">{error}</span>
                </div>
              </div>
            )}

            {/* Filtros de tiempo */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Filtrar por periodo
              </h2>

              <div className="flex flex-wrap gap-4 mb-4">
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filtroTiempo === "todo"
                      ? "bg-orange-400 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setFiltroTiempo("todo")}
                >
                  Todos los periodos
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filtroTiempo === "mes"
                      ? "bg-orange-400 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setFiltroTiempo("mes")}
                >
                  Por mes
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filtroTiempo === "anio"
                      ? "bg-orange-400 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setFiltroTiempo("anio")}
                >
                  Por año
                </button>
              </div>

              {filtroTiempo !== "todo" && (
                <div className="flex flex-wrap gap-4 mb-2">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                      Año
                    </label>
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98DDCA] focus:border-transparent"
                      value={anioSeleccionado}
                      onChange={(e) =>
                        setAnioSeleccionado(parseInt(e.target.value, 10))
                      }
                    >
                      {aniosDisponibles.map((anio) => (
                        <option key={anio} value={anio}>
                          {anio}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selector de mes (solo visible cuando el filtro es por mes) */}
                  {filtroTiempo === "mes" && (
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">
                        Mes
                      </label>
                      <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98DDCA] focus:border-transparent"
                        value={mesSeleccionado}
                        onChange={(e) =>
                          setMesSeleccionado(parseInt(e.target.value, 10))
                        }
                      >
                        {nombresMeses.map((nombre, index) => (
                          <option key={index} value={index}>
                            {nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="text-sm text-gray-500 mt-2">
                {topClientes.length} datos de clientes encontrados en el periodo
                seleccionado
              </div>
            </div>

            {!error && (
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
                <h2 className="text-lg font-semibold text-black mb-4">
                  Top 10 Clientes que Más Compran
                  {filtroTiempo === "mes" &&
                    ` - ${nombresMeses[mesSeleccionado]} ${anioSeleccionado}`}
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
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                          tick={{ fontSize: 13 }}
                        />
                        <YAxis
                          tickFormatter={(value) =>
                            formatearMoneda(value).replace("$", "")
                          }
                        />
                        <Tooltip content={<CustomTooltipClientes />} />
                        <Legend />
                        <Bar
                          dataKey="total"
                          name="Total de Compras"
                          fill={CHART_COLORS.clientes}
                          radius={[8, 8, 0, 0]}
                          stroke="#FFFFFF"
                          strokeWidth={1}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No hay datos para mostrar en el periodo seleccionado
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Top 10 Productos Más Vendidos - ESTILO GRADIENTE */}
            {!error && (
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Top 10 Productos Más Vendidos
                  {filtroTiempo === "mes" &&
                    ` - ${nombresMeses[mesSeleccionado]} ${anioSeleccionado}`}
                  {filtroTiempo === "anio" && ` - ${anioSeleccionado}`}
                </h2>

                <div className="h-96">
                  {topProductos.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={formatProductosData(topProductos)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorCantidad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#98DDCA"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#98DDCA"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorMonto"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={CHART_COLORS.productosMasVendidos.monto}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={CHART_COLORS.productosMasVendidos.monto}
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                          tick={{ fontSize: 13 }}
                        />
                        <YAxis
                          yAxisId="left"
                          orientation="left"
                          stroke="#98DDCA"
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke={CHART_COLORS.productosMasVendidos.monto}
                          tickFormatter={(value) =>
                            formatearMoneda(value).replace("$", "")
                          }
                        />
                        <Tooltip content={<CustomTooltipProductos />} />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="cantidad"
                          name="Cantidad Vendida"
                          stroke="#98DDCA"
                          fillOpacity={1}
                          fill="url(#colorCantidad)"
                        />
                        <Area
                          yAxisId="right"
                          type="monotone"
                          dataKey="monto"
                          name="Monto Total"
                          stroke={CHART_COLORS.productosMasVendidos.monto}
                          fillOpacity={1}
                          fill="url(#colorMonto)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No hay datos para mostrar en el periodo seleccionado
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Top 10 Productos Menos Vendidos - ESTILO GRADIENTE */}
            {!error && (
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Top 10 Productos Menos Vendidos
                  {filtroTiempo === "mes" &&
                    ` - ${nombresMeses[mesSeleccionado]} ${anioSeleccionado}`}
                  {filtroTiempo === "anio" && ` - ${anioSeleccionado}`}
                </h2>

                <div className="h-96">
                  {menosVendidos.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={formatProductosData(menosVendidos)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorMenosCantidad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={
                                CHART_COLORS.productosMenosVendidos.cantidad
                              }
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={
                                CHART_COLORS.productosMenosVendidos.cantidad
                              }
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorMenosMonto"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={
                                CHART_COLORS.productosMenosVendidos.monto
                              }
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={
                                CHART_COLORS.productosMenosVendidos.monto
                              }
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                          tick={{ fontSize: 13 }}
                        />
                        <YAxis
                          yAxisId="left"
                          orientation="left"
                          stroke={CHART_COLORS.productosMenosVendidos.cantidad}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke={CHART_COLORS.productosMenosVendidos.monto}
                          tickFormatter={(value) =>
                            formatearMoneda(value).replace("$", "")
                          }
                        />
                        <Tooltip content={<CustomTooltipProductos />} />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="cantidad"
                          name="Cantidad Vendida"
                          stroke={CHART_COLORS.productosMenosVendidos.cantidad}
                          fillOpacity={1}
                          fill="url(#colorMenosCantidad)"
                        />
                        <Area
                          yAxisId="right"
                          type="monotone"
                          dataKey="monto"
                          name="Monto Total"
                          stroke={CHART_COLORS.productosMenosVendidos.monto}
                          fillOpacity={1}
                          fill="url(#colorMenosMonto)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No hay datos para mostrar en el periodo seleccionado
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mensaje cuando no hay datos pero hay error */}
            {error && (
              <div className="bg-white rounded-lg shadow-md p-12 mb-6 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Icono name="dataNotFound" size={80} className="text-amber-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay información disponible</h3>
                  <p className="text-gray-600 mb-6">
                    No se encontraron datos estadísticos para el periodo seleccionado.
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    Prueba seleccionando un periodo diferente donde haya ventas registradas.
                  </p>
                </div>
              </div>
            )}
            
            {/* Botones de navegación */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 mb-8">
              <Boton
                label="Ver Historial de Ventas"
                onClick={() => navigate("/ventas/historial")}
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