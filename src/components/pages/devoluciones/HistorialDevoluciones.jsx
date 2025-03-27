import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { presaleService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Sidebar from "../../organisms/Sidebar";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Botones from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import CampoTexto from "../../atoms/CamposTexto";
import Loading from "../../Loading/Loading";

const HistorialDevoluciones = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [devoluciones, setDevoluciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  const aplicarFiltro = (tipoFiltro) => {
    setFiltro(tipoFiltro);
    const hoy = new Date();
    let inicio = new Date();
    let fin = new Date();

    switch (tipoFiltro) {
      case "Semana":
        inicio.setDate(hoy.getDate() - 7);
        setFechaInicio(inicio.toISOString().split('T')[0]);
        setFechaFin(hoy.toISOString().split('T')[0]);
        break;
      case "Mes":
        inicio.setMonth(hoy.getMonth() - 1);
        setFechaInicio(inicio.toISOString().split('T')[0]);
        setFechaFin(hoy.toISOString().split('T')[0]);
        break;
      case "Todos":
        setFechaInicio("");
        setFechaFin("");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchDevoluciones = async () => {
      try {
        setLoading(true);
        console.log("Iniciando petición de devoluciones...");
        const response = await presaleService.getAllRefund();
        console.log("Respuesta del servidor:", response);

        // Asegurarnos de que tenemos un array de devoluciones
        let data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        console.log("Datos sin procesar:", data);

        // Validar y transformar los datos según la estructura de la API
        data = data.map((devolucion) => {
          console.log("Procesando devolución:", devolucion);
          return {
            id_preventa: devolucion.id_preventa || null,
            fecha_confirmacion:
              devolucion.fecha_confirmacion || new Date().toISOString(),
            nombre_colaborador:
              devolucion.nombre_colaborador?.nombreCompleto || "No disponible",
            nombre_zona: devolucion.nombre_zona || "No especificada",
            total_devuelto: parseFloat(devolucion.total_devuelto) || 0,
            razon_social: devolucion.razon_social || "No especificada",
          };
        });

        console.log("Datos procesados:", data);
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
    // Filtro por búsqueda de colaborador
    const terminoBusqueda = filtroBusqueda.toLowerCase();
    const cumpleBusqueda =
      filtroBusqueda === "" ||
      (devolucion.nombre_colaborador &&
        devolucion.nombre_colaborador.toLowerCase().includes(terminoBusqueda));

    // Filtro por rango de fechas
    let cumpleFechas = true;
    if (fechaInicio || fechaFin) {
      const fechaDevolucion = new Date(devolucion.fecha_confirmacion);
      
      if (fechaInicio) {
        const inicio = new Date(fechaInicio);
        inicio.setHours(0, 0, 0, 0);
        cumpleFechas = cumpleFechas && fechaDevolucion >= inicio;
      }
      
      if (fechaFin) {
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59, 999);
        cumpleFechas = cumpleFechas && fechaDevolucion <= fin;
      }
    }

    return cumpleBusqueda && cumpleFechas;
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
            {/* Cabecera con fondo naranjo */}
            <div className="bg-red-500 p-4">
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
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros de periodo */}
          <div className="flex overflow-x-auto pb-1 no-scrollbar p-3 bg-white rounded-lg mb-4">
            <div className="flex gap-2 min-w-max px-1">
              <button
                className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Todos"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => aplicarFiltro("Todos")}
              >
                Todas
              </button>
              <button
                className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Semana"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => aplicarFiltro("Semana")}
              >
                Última Semana
              </button>
              <button 
                className={`px-4 py-2 whitespace-nowrap rounded-md ${
                  filtro === "Mes"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => aplicarFiltro("Mes")}
              >
                Último Mes
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Buscar</label>
                <CampoTexto
                  placeholder="Buscar por cliente o número de venta"
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                  className="w-full rounded-full border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Fecha Fin</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Lista de devoluciones */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <Tipografia
                variant="h2"
                size="lg"
                className="text-lg md:text-xl font-semibold text-gray-900"
              >
                Devoluciones Registradas
              </Tipografia>
              {devolucionesFiltradas.length > 0 && (
                <div className="px-3 py-1 bg-[#F78220]/10 rounded-full">
                  <span className="text-sm text-[#F78220]">
                    {devolucionesFiltradas.length}{" "}
                    {devolucionesFiltradas.length === 1 ? "devolución" : "devoluciones"}
                  </span>
                </div>
              )}
            </div>

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
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Devuelto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {devolucionesFiltradas.map((devolucion) => (
                      <tr
                        key={devolucion.id_preventa}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{devolucion.id_preventa || "N/A"}
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <span className="text-sm text-gray-900">
                              {devolucion.razon_social}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm px-2 py-1 inline-flex font-medium leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            ${devolucion.total_devuelto.toLocaleString("es-CO")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Botones
                            tipo="primario"
                            label="Ver Detalles"
                            size="medium"
                            onClick={() =>
                              verDetallesDevolucion(devolucion.id_preventa)
                            }
                          />
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
