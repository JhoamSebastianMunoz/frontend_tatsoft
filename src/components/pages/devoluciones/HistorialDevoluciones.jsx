import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { presaleService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Sidebar from "../../organisms/Sidebar";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import CampoTexto from "../../atoms/CamposTexto";
import Loading from "../../Loading/Loading";

const HistorialDevoluciones = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [devoluciones, setDevoluciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  useEffect(() => {
    const fetchDevoluciones = async () => {
      try {
        setLoading(true);
        console.log("Iniciando petición de devoluciones...");
        const response = await presaleService.getAllRefund();
        console.log("Respuesta del servidor:", response);
        
        // Asegurarnos de que tenemos un array de devoluciones
        let data = Array.isArray(response.data) ? response.data : [response.data];
        console.log("Datos sin procesar:", data);
        
        // Validar y transformar los datos según la estructura de la API
        data = data.map(devolucion => {
          console.log("Procesando devolución:", devolucion);
          
          // Calcular el total de la devolución
          const total = devolucion.total ? 
            parseFloat(devolucion.total) : 
            (devolucion.productos || []).reduce((sum, producto) => {
              return sum + (parseFloat(producto.subtotal) || 0);
            }, 0);

          return {
            id_preventa: devolucion.id_preventa || null,
            fecha_confirmacion: new Date().toISOString(), // Por ahora usamos fecha actual
            nombre_colaborador: devolucion.colaborador?.nombre || 'No disponible',
            nombre_zona: devolucion.cliente?.razon_social || 'No especificada',
            total_devuelto: total,
            cliente: {
              nombre: devolucion.cliente?.nombre || 'No disponible',
              razon_social: devolucion.cliente?.razon_social || 'No especificada'
            },
            productos: (devolucion.productos || []).map(producto => ({
              nombre: producto.nombre,
              precio: parseFloat(producto.precio) || 0,
              cantidad: parseInt(producto.cantidad) || 0,
              subtotal: parseFloat(producto.subtotal) || 0
            }))
          };
        });
        
        console.log('Datos procesados:', data);
        setDevoluciones(data);
      } catch (err) {
        console.error("Error detallado al cargar devoluciones:", err);
        setError(
          "Error al cargar el historial de devoluciones. Por favor, intente nuevamente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDevoluciones();
  }, []);

  // Aplicar filtros
  const devolucionesFiltradas = devoluciones.filter((devolucion) => {
    // Filtro por búsqueda
    const terminoBusqueda = filtroBusqueda.toLowerCase();
    const cumpleBusqueda =
      filtroBusqueda === "" ||
      (devolucion.id_preventa &&
        devolucion.id_preventa.toString().includes(terminoBusqueda)) ||
      (devolucion.nombre_colaborador &&
        devolucion.nombre_colaborador.toLowerCase().includes(terminoBusqueda));

    // Filtro por fecha
    let cumpleFecha = true;
    if (filtroFecha) {
      const fechaFiltro = new Date(filtroFecha);
      const fechaDevolucion = new Date(devolucion.fecha_confirmacion);
      cumpleFecha =
        fechaFiltro.toDateString() === fechaDevolucion.toDateString();
    }

    return cumpleBusqueda && cumpleFecha;
  });

  // Formatear fecha para mostrar
  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Fecha no disponible";
    const fecha = new Date(fechaString);
    return fecha.toLocaleString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Ver detalles de devolución
  const verDetallesDevolucion = (id) => {
    navigate(`/devoluciones/detalles/${id}`);
  };

  if (loading && devoluciones.length === 0) {
    return <Loading message="Cargando historial de devoluciones..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      <Tipografia>
        <div className="w-full md:pl-[100px] pl-20 pr-2 pt-[80px] md:pt-6 md:px-8">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Historial de Devoluciones
            </h1>
          </div>
          {/* Alertas */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <div className="flex items-center">
                <Icono name="eliminarAlert" size={20} />
                <span className="ml-2">{error}</span>
              </div>
            </div>
          )}

          {/* Total ventas */}
          <div className="rounded-lg w-64 shadow-md overflow-hidden mb-6 mx-auto">
            {/* Cabecera con fondo naranja */}
            <div className="bg-[#F78220] p-4">
              <h2 className="text-white text-lg md:text-xl font-medium">
                Total devoluciones
              </h2>
            </div>

            {/* Contenido con fondo blanco */}
            <div className="bg-white p-4 flex flex-col">
              {/* Valor grande */}
              <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                $
                {devolucionesFiltradas
                  .reduce(
                    (total, devolucion) => total + devolucion.total_devuelto,
                    0
                  )
                  .toLocaleString("es-CO")}
              </div>

              {/* Etiqueta de porcentaje y "Total" alineados a la izquierda */}
              <div className="flex items-center gap-2">
                {/* Círculo naranja a la derecha */}
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center ml-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

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
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                  />
                </div>

                <Boton
                  tipo="primario"
                  label="Volver a Ventas"
                  onClick={() => navigate("/ventas/historial")}
                />
              </div>
            </div>
          </div>

          {/* Lista de devoluciones */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <Tipografia
              variant="h2"
              size="lg"
              className="text-orange-700 font-bold mb-6"
            >
              Devoluciones Registradas
            </Tipografia>
            {devolucionesFiltradas.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de Devolución
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Colaborador
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zona
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Devuelto
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {devolucionesFiltradas.map((devolucion) => (
                      <tr key={devolucion.id_preventa} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{devolucion.id_preventa || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatearFecha(devolucion.fecha_confirmacion)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {devolucion.nombre_colaborador}
                          </div>
                          <div className="text-sm text-gray-500">
                            {devolucion.cliente?.nombre}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              {devolucion.cliente?.razon_social || 'No especificada'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-red-600">
                            ${Number(devolucion.total_devuelto).toLocaleString('es-CO')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {devolucion.productos?.length || 0} productos
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => verDetallesDevolucion(devolucion.id_preventa)}
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
                No se encontraron devoluciones con los criterios de búsqueda
                actuales
              </div>
            )}
          </div>
        </div>
      </Tipografia>
    </div>
  );
};

export default HistorialDevoluciones;
