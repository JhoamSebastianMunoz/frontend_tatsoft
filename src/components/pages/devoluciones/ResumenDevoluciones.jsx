import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { presaleService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Encabezado from "../../molecules/Encabezado";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import Loading from "../../Loading/Loading";
import SidebarAdm from "../../organisms/Sidebar";

const ResumenDevoluciones = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [devoluciones, setDevoluciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resumenPorZona, setResumenPorZona] = useState([]);
  const [periodoActual, setPeriodoActual] = useState("");

  useEffect(() => {
    const fetchDevoluciones = async () => {
      try {
        setLoading(true);
        const response = await presaleService.getAllRefund();
        const data = Array.isArray(response.data) ? response.data : response.data?.message || [];
        setDevoluciones(data);
        
        // Determinar el mes y año actuales para el título
        const fecha = new Date();
        const mes = fecha.toLocaleString('es-CO', { month: 'long' });
        const anio = fecha.getFullYear();
        setPeriodoActual(`${mes} ${anio}`);
        
        // Generar resumen por zona
        generarResumenPorZona(data);
      } catch (err) {
        console.error("Error al cargar devoluciones:", err);
        setError("Error al cargar el resumen de devoluciones. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchDevoluciones();
  }, []);

  // Generar resumen por zona
  const generarResumenPorZona = (data) => {
    const resumen = {};
    
    // Agrupar por zona
    data.forEach(devolucion => {
      const nombreZona = devolucion.nombre_zona || "Sin zona asignada";
      const montoDevolucion = parseFloat(devolucion.total_devuelto) || 0;
      
      if (!resumen[nombreZona]) {
        resumen[nombreZona] = {
          nombre: nombreZona,
          total: 0,
          cantidad: 0
        };
      }
      
      resumen[nombreZona].total += montoDevolucion;
      resumen[nombreZona].cantidad += 1;
    });
    
    // Convertir a array y ordenar por monto total (descendente)
    const resumenArray = Object.values(resumen).sort((a, b) => b.total - a.total);
    setResumenPorZona(resumenArray);
  };

  // Calcular estadísticas generales
  const calcularEstadisticas = () => {
    let totalDevuelto = 0;
    let cantidadDevoluciones = devoluciones.length;
    let montoMayor = 0;
    
    devoluciones.forEach(devolucion => {
      const monto = parseFloat(devolucion.total_devuelto) || 0;
      totalDevuelto += monto;
      if (monto > montoMayor) {
        montoMayor = monto;
      }
    });
    
    const promedioDevolucion = cantidadDevoluciones > 0 ? totalDevuelto / cantidadDevoluciones : 0;
    
    return {
      totalDevuelto,
      cantidadDevoluciones,
      montoMayor,
      promedioDevolucion
    };
  };
  
  const estadisticas = calcularEstadisticas();

  // Formatear número a moneda
  const formatearMoneda = (valor) => {
    return `$${valor.toLocaleString('es-CO')}`;
  };

  if (loading) {
    return <Loading message="Cargando resumen de devoluciones..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Encabezado
        mensaje="Resumen de Devoluciones"
        onClick={() => navigate("/devoluciones/historial")}
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

        {/* Encabezado */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <Tipografia variant="h2" size="xl" className="text-purple-700 font-bold mb-2">
            Resumen del periodo: {periodoActual}
          </Tipografia>
          <Tipografia className="text-gray-600">
            Análisis de devoluciones por zona y estadísticas generales.
          </Tipografia>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-500">
            <Tipografia className="text-gray-500 text-sm">Total devuelto</Tipografia>
            <Tipografia variant="h3" size="xl" className="text-red-600 font-bold">
              {formatearMoneda(estadisticas.totalDevuelto)}
            </Tipografia>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
            <Tipografia className="text-gray-500 text-sm">Cantidad de devoluciones</Tipografia>
            <Tipografia variant="h3" size="xl" className="text-blue-600 font-bold">
              {estadisticas.cantidadDevoluciones}
            </Tipografia>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500">
            <Tipografia className="text-gray-500 text-sm">Devolución promedio</Tipografia>
            <Tipografia variant="h3" size="xl" className="text-purple-600 font-bold">
              {formatearMoneda(estadisticas.promedioDevolucion)}
            </Tipografia>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-orange-500">
            <Tipografia className="text-gray-500 text-sm">Devolución mayor</Tipografia>
            <Tipografia variant="h3" size="xl" className="text-orange-600 font-bold">
              {formatearMoneda(estadisticas.montoMayor)}
            </Tipografia>
          </div>
        </div>

        {/* Resumen por zona */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <Tipografia variant="h3" size="lg" className="text-purple-700 font-bold mb-4">
            Devoluciones por Zona
          </Tipografia>
          
          {resumenPorZona.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zona
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número de Devoluciones
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Promedio por Devolución
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resumenPorZona.map((zona, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {zona.nombre}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-blue-600">
                          {zona.cantidad}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-red-600">
                          {formatearMoneda(zona.total)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-700">
                          {formatearMoneda(zona.cantidad > 0 ? zona.total / zona.cantidad : 0)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No hay datos de devoluciones para mostrar
            </div>
          )}
        </div>

        {/* Gráfico simplificado de barras para zonas (implementado con CSS) */}
        {resumenPorZona.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <Tipografia variant="h3" size="lg" className="text-purple-700 font-bold mb-4">
              Distribución de Devoluciones por Zona
            </Tipografia>
            
            <div className="space-y-4">
              {resumenPorZona.map((zona, index) => {
                // Calcular el porcentaje respecto al total
                const porcentaje = (zona.total / estadisticas.totalDevuelto) * 100;
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{zona.nombre}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {formatearMoneda(zona.total)} ({porcentaje.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-red-600 h-2.5 rounded-full"
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex justify-end space-x-4">
          <Boton
            tipo="secundario"
            label="Ver Historial"
            onClick={() => navigate("/devoluciones/historial")}
          />
          <Boton
            tipo="primario"
            label="Comparativa"
            onClick={() => navigate("/ventas/devoluciones")}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumenDevoluciones;