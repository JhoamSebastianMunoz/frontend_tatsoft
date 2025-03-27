import React, { useState, useEffect } from "react";
import { saleService } from "../../../context/services/ApiService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Sidebar from "../../organisms/Sidebar";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import Loading from "../../Loading/Loading";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EstadisticasVentas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ventasPorSemana, setVentasPorSemana] = useState([]);
  const [ventasPorColaborador, setVentasPorColaborador] = useState([]);
  const [ventasPorZona, setVentasPorZona] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  
  // Estado para el filtro de tiempo
  const [filtroTiempo, setFiltroTiempo] = useState("todo");
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());

  // Obtener lista de años disponibles (desde los datos)
  const [aniosDisponibles, setAniosDisponibles] = useState([]);
  
  // Nombres de los meses para el filtro
  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Función para obtener el nombre de la semana
  const formatearSemana = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const options = { month: 'short', day: 'numeric' };
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaFin.getDate() + 6);
    
    return `${fechaInicio.toLocaleDateString('es-CO', options)} - ${fechaFin.toLocaleDateString('es-CO', options)}`;
  };

  // Colores para los colaboradores
  const coloresColaborador = [
    '#F78220', // Naranja (color principal)
    '#3B82F6', // Azul
    '#10B981', // Verde
    '#8B5CF6', // Morado
    '#F43F5E', // Rojo
  ];

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);
        const response = await saleService.getAllSales();
        
        // Asegurarse de que los datos sean un array
        let ventasFormateadas = [];
        if (response && response.data) {
          if (Array.isArray(response.data)) {
            ventasFormateadas = response.data.map((venta) => {
              const nombreColaborador = venta.nombre_colaborador?.nombreCompleto || "No disponible";
              const total = parseFloat(venta.total_vendido) || 0;

              return {
                id_preventa: venta.id_preventa?.toString() || "N/A",
                fecha_confirmacion: venta.fecha_confirmacion || new Date().toISOString(),
                id_colaborador: venta.id_colaborador,
                nombre_colaborador: nombreColaborador,
                total_vendido: total,
                razon_social: venta.razon_social || "",
                nombre_zona: venta.nombre_zona || "",
              };
            });
          }
        }

        setVentas(ventasFormateadas);
        setVentasFiltradas(ventasFormateadas);
        
        // Extraer años únicos de las fechas
        const años = [...new Set(ventasFormateadas.map(venta => {
          const fecha = new Date(venta.fecha_confirmacion);
          return fecha.getFullYear();
        }))].sort((a, b) => b - a); // Ordenar de más reciente a más antiguo
        
        setAniosDisponibles(años.length > 0 ? años : [new Date().getFullYear()]);
        
        // Establecer año seleccionado al más reciente disponible
        if (años.length > 0) {
          setAnioSeleccionado(años[0]);
        }
        
        procesarDatos(ventasFormateadas);
      } catch (err) {
        console.error("Error al cargar ventas:", err);
        setError("Error al cargar las estadísticas de ventas. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  // Efecto para aplicar filtros cuando cambia el filtro de tiempo
  useEffect(() => {
    if (ventas.length === 0) return;
    
    let ventasFiltradas = [...ventas];
    
    if (filtroTiempo === "mes") {
      ventasFiltradas = ventas.filter(venta => {
        const fecha = new Date(venta.fecha_confirmacion);
        return fecha.getMonth() === mesSeleccionado && 
               fecha.getFullYear() === anioSeleccionado;
      });
    } else if (filtroTiempo === "anio") {
      ventasFiltradas = ventas.filter(venta => {
        const fecha = new Date(venta.fecha_confirmacion);
        return fecha.getFullYear() === anioSeleccionado;
      });
    }
    
    setVentasFiltradas(ventasFiltradas);
    procesarDatos(ventasFiltradas);
  }, [filtroTiempo, mesSeleccionado, anioSeleccionado, ventas]);

  const procesarDatos = (ventasData) => {
    // Calcular total de ventas
    const total = ventasData.reduce((sum, venta) => sum + venta.total_vendido, 0);
    setTotalVentas(total);

    // Procesar ventas por semana
    const ventasSemana = {};
    ventasData.forEach(venta => {
      const fecha = new Date(venta.fecha_confirmacion);
      // Obtener el inicio de la semana (domingo)
      const inicioSemana = new Date(fecha);
      inicioSemana.setDate(fecha.getDate() - fecha.getDay());
      const key = inicioSemana.toISOString().split('T')[0];
      
      if (!ventasSemana[key]) {
        ventasSemana[key] = {
          total: 0,
          cantidad: 0
        };
      }
      
      ventasSemana[key].total += venta.total_vendido;
      ventasSemana[key].cantidad += 1;
    });

    // Convertir a formato para gráfico
    const datosGrafico = Object.keys(ventasSemana)
      .sort() // Ordenar cronológicamente
      .map(semana => ({
        semana: formatearSemana(semana),
        fechaOriginal: semana,
        cantidad: ventasSemana[semana].cantidad,
        total: ventasSemana[semana].total
      }));

    setVentasPorSemana(datosGrafico);

    // Procesar ventas por colaborador
    const colaboradores = {};
    ventasData.forEach(venta => {
      const nombre = venta.nombre_colaborador;
      const id = venta.id_colaborador;
      
      if (!colaboradores[id]) {
        colaboradores[id] = {
          id,
          nombre,
          total: 0,
          cantidad: 0
        };
      }
      
      colaboradores[id].total += venta.total_vendido;
      colaboradores[id].cantidad += 1;
    });

    // Calcular porcentajes y convertir a array
    const datosColaboradores = Object.values(colaboradores).map((colab, index) => ({
      ...colab,
      porcentaje: total > 0 ? (colab.total / total * 100).toFixed(1) : "0.0",
      color: coloresColaborador[index % coloresColaborador.length]
    }));

    // Ordenar por total de ventas (mayor primero)
    datosColaboradores.sort((a, b) => b.total - a.total);
    setVentasPorColaborador(datosColaboradores);

    // Procesar ventas por zona
    const zonas = {};
    ventasData.forEach(venta => {
      const zona = venta.nombre_zona;
      
      if (!zonas[zona]) {
        zonas[zona] = {
          zona,
          total: 0,
          cantidad: 0
        };
      }
      
      zonas[zona].total += venta.total_vendido;
      zonas[zona].cantidad += 1;
    });

    // Convertir a array
    const datosZonas = Object.values(zonas).map(zona => ({
      ...zona,
      porcentaje: total > 0 ? (zona.total / total * 100).toFixed(1) : "0.0"
    }));

    setVentasPorZona(datosZonas);
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  if (loading) {
    return <Loading message="Cargando estadísticas de ventas..." />;
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
              Estadísticas de Ventas
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
              {ventasFiltradas.length} {ventasFiltradas.length === 1 ? 'venta' : 'ventas'} encontradas en el periodo seleccionado
            </div>
          </div>

          {/* Resumen de ventas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Total ventas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-600">Total de ventas</h2>
                <div className="w-10 h-10 rounded-full bg-[#F78220]/10 flex items-center justify-center">
                  <Icono name="money" size={20} customColor="#F78220" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800">
                {formatearMoneda(totalVentas)}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {ventasFiltradas.length > 0 ? 
                  `Total de ${ventasFiltradas.length} transacciones` : 
                  "No hay ventas en este periodo"
                }
              </div>
            </div>

            {/* Promedio de venta */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-600">Promedio por venta</h2>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Icono name="chart" size={20} customColor="#3B82F6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800">
                {formatearMoneda(ventasFiltradas.length > 0 ? totalVentas / ventasFiltradas.length : 0)}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Valor promedio por transacción
              </div>
            </div>

            {/* Venta más alta */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-600">Venta más alta</h2>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Icono name="arrowUp" size={20} customColor="#10B981" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800">
                {formatearMoneda(Math.max(...ventasFiltradas.map(v => v.total_vendido), 0))}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Transacción de mayor valor
              </div>
            </div>
          </div>

          {/* Gráfico de ventas por semana */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              {filtroTiempo === "todo" ? "Ventas por Semana" : 
               filtroTiempo === "mes" ? `Ventas de ${nombresMeses[mesSeleccionado]} ${anioSeleccionado}` :
               `Ventas de ${anioSeleccionado}`}
            </h2>
            
            <div className="h-80">
              {ventasPorSemana.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={ventasPorSemana}
                    margin={{ top: 10, right: 60, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="semana" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      yAxisId="left"
                      orientation="left" 
                      tickFormatter={(value) => value}
                      label={{ value: 'Cantidad', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      tickFormatter={(value) => formatearMoneda(value).replace('$', '')}
                      label={{ value: 'Valor Total', angle: 90, position: 'insideRight' }}
                      width={50}
                    />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'total') return [formatearMoneda(value), 'Total'];
                        return [value, 'Cantidad'];
                      }}
                      labelFormatter={(label) => `Semana: ${label}`}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="cantidad" 
                      name="Cantidad"
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="total" 
                      name="Total"
                      stroke="#F78220"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No hay suficientes datos para mostrar el gráfico en el periodo seleccionado
                </div>
              )}
            </div>
          </div>

          {/* Cards de Colaboradores */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Rendimiento por Colaborador</h2>
            
            {ventasPorColaborador.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ventasPorColaborador.map((colaborador, index) => (
                  <div 
                    key={colaborador.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-800">{colaborador.nombre}</h3>
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${colaborador.color}20` }}
                        >
                          <Icono name="user" size={20} style={{ color: colaborador.color }} />
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Ventas totales</span>
                          <span className="text-sm font-medium">{colaborador.porcentaje}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${colaborador.porcentaje}%`,
                              backgroundColor: colaborador.color
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <div>
                          <div className="text-sm text-gray-500">Cantidad</div>
                          <div className="text-lg font-semibold">{colaborador.cantidad}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Total</div>
                          <div className="text-lg font-semibold">{formatearMoneda(colaborador.total)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-md text-gray-500">
                No hay datos de colaboradores en el periodo seleccionado
              </div>
            )}
          </div>

          {/* Distribución por zona */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ventas por Zona</h2>
            
            {ventasPorZona.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ventasPorZona.map((zona, index) => (
                  <div key={zona.zona} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Zona {zona.zona}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {zona.porcentaje}%
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm">
                      {zona.cantidad} {zona.cantidad === 1 ? 'venta' : 'ventas'}
                    </div>
                    <div className="mt-2 font-semibold">
                      {formatearMoneda(zona.total)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay datos de zonas en el periodo seleccionado
              </div>
            )}
          </div>

          <div className="flex justify-center mt-8 mb-8">
            <Boton
              label="Ver Historial de Ventas"
              onClick={() => navigate('/ventas/historial')}
              className="mr-4"
            />
          </div>
        </div>
      </main>
      </Tipografia>
    </div>
  );
};

export default EstadisticasVentas;