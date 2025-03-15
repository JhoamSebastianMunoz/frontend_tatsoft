import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saleService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Encabezado from "../../molecules/Encabezado";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import CampoTexto from "../../atoms/CamposTexto";
import Loading from "../../Loading/Loading";

const HistorialVentas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);
        const response = await saleService.getAllSales();
        const data = Array.isArray(response.data) ? response.data : response.data?.message || [];
        setVentas(data);
      } catch (err) {
        console.error("Error al cargar ventas:", err);
        setError("Error al cargar el historial de ventas. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  // Aplicar filtros
  const ventasFiltradas = ventas.filter(venta => {
    // Filtro por búsqueda
    const terminoBusqueda = filtroBusqueda.toLowerCase();
    const cumpleBusqueda = filtroBusqueda === "" || 
      (venta.id_preventa && venta.id_preventa.toString().includes(terminoBusqueda)) ||
      (venta.nombre_colaborador && venta.nombre_colaborador.toLowerCase().includes(terminoBusqueda));
    
    // Filtro por fecha
    let cumpleFecha = true;
    if (filtroFecha) {
      const fechaFiltro = new Date(filtroFecha);
      const fechaVenta = new Date(venta.fecha_confirmacion);
      cumpleFecha = fechaFiltro.toDateString() === fechaVenta.toDateString();
    }
    
    return cumpleBusqueda && cumpleFecha;
  });

  // Formatear fecha para mostrar
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

  // Ver detalles de venta
  const verDetallesVenta = (id) => {
    navigate(`/ventas/detalles/${id}`);
  };

  if (loading && ventas.length === 0) {
    return <Loading message="Cargando historial de ventas..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Encabezado 
        mensaje="Historial de Ventas" 
        onClick={() => navigate("/perfil")}
      />

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

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="w-full md:w-1/2">
              <CampoTexto 
                placeholder="Buscar por ID o colaborador..." 
                value={filtroBusqueda}
                onChange={(e) => setFiltroBusqueda(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Tipografia className="whitespace-nowrap">Fecha:</Tipografia>
                <input 
                  type="date" 
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                />
              </div>
              
              <Boton 
                tipo="primario" 
                label="Nueva Preventa" 
                onClick={() => navigate("/preventa/nueva")}
              />
            </div>
          </div>
        </div>

        {/* Lista de ventas */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold mb-6">
            Ventas Confirmadas
          </Tipografia>

          {ventasFiltradas.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Confirmación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Colaborador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Vendido
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ventasFiltradas.map((venta) => (
                    <tr key={venta.id_preventa} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{venta.id_preventa}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatearFecha(venta.fecha_confirmacion)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {venta.nombre_colaborador || "No disponible"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          ${Number(venta.total_vendido).toLocaleString('es-CO')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => verDetallesVenta(venta.id_preventa)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No se encontraron ventas con los criterios de búsqueda actuales
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialVentas;