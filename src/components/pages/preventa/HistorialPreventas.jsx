import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { presaleService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Encabezado from "../../molecules/Encabezado";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import SidebarAdm from "../../organisms/Sidebar";
import CampoTexto from "../../atoms/CamposTexto";
import Loading from "../../Loading/Loading";

const HistorialPreventas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [preventas, setPreventas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  useEffect(() => {
    const fetchPreventas = async () => {
      try {
        setLoading(true);
        const response = await presaleService.getAllPresales();
        const data = Array.isArray(response.data) ? response.data : response.data?.message || [];
        setPreventas(data);
      } catch (err) {
        console.error("Error al cargar preventas:", err);
        setError("Error al cargar el historial de preventas. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPreventas();
  }, []);

  // Aplicar filtros
  const preventasFiltradas = preventas.filter(preventa => {
    // Filtro por estado
    const cumpleFiltroEstado = filtroEstado === "Todos" || preventa.estado === filtroEstado;
    
    // Filtro por búsqueda - aquí depende de la estructura de datos, ajustar según corresponda
    const terminoBusqueda = filtroBusqueda.toLowerCase();
    const cumpleBusqueda = filtroBusqueda === "" || 
      (preventa.id_preventa && preventa.id_preventa.toString().includes(terminoBusqueda)) ||
      (preventa.fecha_creacion && new Date(preventa.fecha_creacion).toLocaleDateString().includes(terminoBusqueda));
    
    return cumpleFiltroEstado && cumpleBusqueda;
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

  // Ver detalles de preventa
  const verDetallesPreventa = (id) => {
    navigate(`/preventa/detalles/${id}`);
  };

  // Confirmar preventa (solo para administradores)
  const confirmarPreventa = (id) => {
    navigate(`/preventa/confirmar/${id}`);
  };

  // Cancelar preventa
  const handleCancelarPreventa = async (id) => {
    if (window.confirm("¿Está seguro que desea cancelar esta preventa?")) {
      try {
        setLoading(true);
        await presaleService.cancelPresale(id);
        
        // Actualizar la lista de preventas
        const response = await presaleService.getAllPresales();
        const data = Array.isArray(response.data) ? response.data : response.data?.message || [];
        setPreventas(data);
        
      } catch (err) {
        console.error("Error al cancelar preventa:", err);
        setError("Error al cancelar la preventa. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && preventas.length === 0) {
    return <Loading message="Cargando historial de preventas..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Encabezado 
        mensaje="Historial de Preventas" 
        onClick={() => navigate("/perfil")}
      />
      <SidebarAdm/>
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
                placeholder="Buscar por ID o fecha..." 
                value={filtroBusqueda}
                onChange={(e) => setFiltroBusqueda(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Tipografia className="whitespace-nowrap">Estado:</Tipografia>
              <select 
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
              
              <Boton 
                tipo="primario" 
                label="Nueva Preventa" 
                onClick={() => navigate("/preventa/nueva")}
              />
            </div>
          </div>
        </div>

        {/* Lista de preventas */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold mb-6">
            Preventas Registradas
          </Tipografia>

          {preventasFiltradas.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Creación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preventasFiltradas.map((preventa) => (
                    <tr key={preventa.id_preventa} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{preventa.id_preventa}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatearFecha(preventa.fecha_creacion)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${preventa.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                            preventa.estado === 'Confirmada' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {preventa.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${Number(preventa.total).toLocaleString('es-CO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => verDetallesPreventa(preventa.id_preventa)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Ver
                          </button>
                          
                          {preventa.estado === 'Pendiente' && (
                            <>
                              {user.rol === 'ADMINISTRADOR' && (
                                <button
                                  onClick={() => confirmarPreventa(preventa.id_preventa)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Confirmar
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleCancelarPreventa(preventa.id_preventa)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Cancelar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No se encontraron preventas con los criterios de búsqueda actuales
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialPreventas;
