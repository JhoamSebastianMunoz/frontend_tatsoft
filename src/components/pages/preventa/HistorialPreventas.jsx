import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { presaleService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Encabezado from "../../molecules/Encabezado";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import SidebarAdm from "../../organisms/SidebarAdm";
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
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");

  // Cargar datos de preventas
  useEffect(() => {
    const fetchPreventas = async () => {
      try {
        setLoading(true);
        const response = await presaleService.getAllPresales();
        
        // Verificar si los datos vienen en un campo message o directamente
        const data = response.data?.message || response.data || [];
        setPreventas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar preventas:", err);
        
        // Mensaje de error amigable para el usuario
        setError("Error al cargar el historial de preventas. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPreventas();
  }, []);

  // Aplicar filtros a las preventas
  const preventasFiltradas = preventas.filter(preventa => {
    // Filtro por estado
    const cumpleFiltroEstado = filtroEstado === "Todos" || preventa.estado === filtroEstado;
    
    // Filtro por búsqueda - por ID, cliente o por zona si está disponible
    const terminoBusqueda = filtroBusqueda.toLowerCase();
    const cumpleBusqueda = filtroBusqueda === "" || 
      (preventa.id_preventa && preventa.id_preventa.toString().includes(terminoBusqueda)) || 
      (preventa.cliente && preventa.cliente.toLowerCase().includes(terminoBusqueda)) ||
      (preventa.razon_social && preventa.razon_social.toLowerCase().includes(terminoBusqueda)) ||
      (preventa.nombre_zona && preventa.nombre_zona.toLowerCase().includes(terminoBusqueda));
    
    // Filtro por rango de fechas
    let cumpleFechaInicio = true;
    let cumpleFechaFin = true;
    
    if (filtroFechaInicio) {
      const fechaInicio = new Date(filtroFechaInicio);
      const fechaPreventa = new Date(preventa.fecha_creacion);
      cumpleFechaInicio = fechaPreventa >= fechaInicio;
    }
    
    if (filtroFechaFin) {
      const fechaFin = new Date(filtroFechaFin);
      fechaFin.setHours(23, 59, 59); // Incluir todo el día
      const fechaPreventa = new Date(preventa.fecha_creacion);
      cumpleFechaFin = fechaPreventa <= fechaFin;
    }
    
    return cumpleFiltroEstado && cumpleBusqueda && cumpleFechaInicio && cumpleFechaFin;
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
    if (window.confirm("¿Está seguro que desea cancelar esta preventa? Esta acción no se puede deshacer.")) {
      try {
        setLoading(true);
        await presaleService.cancelPresale(id);
        
        // Actualizar la lista de preventas después de cancelar
        const response = await presaleService.getAllPresales();
        const data = response.data?.message || response.data || [];
        setPreventas(Array.isArray(data) ? data : []);
        
        // Mostrar mensaje temporal de éxito
        setError("");
        const successDiv = document.createElement('div');
        successDiv.className = 'bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded';
        successDiv.innerHTML = 'Preventa cancelada exitosamente';
        document.querySelector('.container').prepend(successDiv);
        
        setTimeout(() => {
          successDiv.remove();
        }, 3000);
      } catch (err) {
        console.error("Error al cancelar preventa:", err);
        setError("Error al cancelar la preventa. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltroBusqueda("");
    setFiltroEstado("Todos");
    setFiltroFechaInicio("");
    setFiltroFechaFin("");
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
      <SidebarAdm />
      <div className="container mx-auto px-4 py-6 pt-20 md:ml-64">
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
          <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold mb-4">
            Filtros de Búsqueda
          </Tipografia>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Tipografia className="text-sm text-gray-700 mb-1">Buscar:</Tipografia>
              <CampoTexto
                placeholder="Buscar por ID, cliente o zona..."
                value={filtroBusqueda}
                onChange={(e) => setFiltroBusqueda(e.target.value)}
              />
            </div>
            
            <div>
              <Tipografia className="text-sm text-gray-700 mb-1">Estado:</Tipografia>
              <select
                className="w-full p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
            
            <div>
              <Tipografia className="text-sm text-gray-700 mb-1">Fecha Inicio:</Tipografia>
              <input
                type="date"
                className="w-full p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filtroFechaInicio}
                onChange={(e) => setFiltroFechaInicio(e.target.value)}
              />
            </div>
            
            <div>
              <Tipografia className="text-sm text-gray-700 mb-1">Fecha Fin:</Tipografia>
              <input
                type="date"
                className="w-full p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filtroFechaFin}
                onChange={(e) => setFiltroFechaFin(e.target.value)}
              />
            </div>
          </div>
          
          {/* Botones */}
          <div className="flex flex-wrap justify-between mt-4">
            <div>
              {(filtroBusqueda || filtroEstado !== "Todos" || filtroFechaInicio || filtroFechaFin) && (
                <button
                  onClick={limpiarFiltros}
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Limpiar filtros
                </button>
              )}
            </div>
            
            <Boton
              tipo="primario"
              label="Nueva Preventa"
              onClick={() => navigate("/preventa/nueva")}
            />
          </div>
        </div>
        
        {/* Lista de preventas */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold">
              Preventas Registradas
            </Tipografia>
            <Tipografia className="text-gray-600">
              Mostrando {preventasFiltradas.length} de {preventas.length} preventas
            </Tipografia>
          </div>
          
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
                      Cliente
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
                        <div className="text-sm text-gray-500">
                          {preventa.cliente || preventa.razon_social || "Cliente no especificado"}
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
                        ${typeof preventa.total === 'number' 
                          ? preventa.total.toLocaleString('es-CO') 
                          : parseFloat(preventa.total || 0).toLocaleString('es-CO')}
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
              {preventas.length > 0 ? (
                "No se encontraron preventas con los criterios de búsqueda actuales"
              ) : (
                "No hay preventas registradas en el sistema"
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialPreventas;