import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { presaleService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Sidebar from "../../organisms/Sidebar";
import Tipografia from "../../atoms/Tipografia";
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
  
  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const devolucionesPorPagina = 10; // Número de devoluciones por página

  const aplicarFiltro = (tipoFiltro) => {
    setFiltro(tipoFiltro);
    setPaginaActual(1); // Resetear a la primera página al cambiar filtros
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
    const terminoBusqueda = filtroBusqueda.toLowerCase();
    const cumpleBusqueda =
      filtroBusqueda === "" ||
      (devolucion.nombre_colaborador &&
        devolucion.nombre_colaborador.toLowerCase().includes(terminoBusqueda)) ||
      (devolucion.razon_social &&
        devolucion.razon_social.toLowerCase().includes(terminoBusqueda)) ||
      (devolucion.id_preventa &&
        devolucion.id_preventa.toString().toLowerCase().includes(terminoBusqueda));

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
  
  // Cálculo para paginación
  const indexUltimaDevolucion = paginaActual * devolucionesPorPagina;
  const indexPrimeraDevolucion = indexUltimaDevolucion - devolucionesPorPagina;
  const devolucionesPaginaActual = devolucionesFiltradas.slice(indexPrimeraDevolucion, indexUltimaDevolucion);
  const totalPaginas = Math.ceil(devolucionesFiltradas.length / devolucionesPorPagina);

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
  
  // Cambiar de página
  const cambiarPagina = (numeroPagina) => {
    if (numeroPagina > 0 && numeroPagina <= totalPaginas) {
      setPaginaActual(numeroPagina);
    }
  };
  
  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroBusqueda("");
    setFechaInicio("");
    setFechaFin("");
    setFiltro("Todos");
    setPaginaActual(1);
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
          <div className="max-w-7xl mx-auto">
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

            {/* Total devoluciones */}
            <div className="rounded-lg w-64 shadow-md overflow-hidden mb-6 mx-auto">
              <div className="bg-red-500 p-3">
                <h2 className="text-white text-lg md:text-xl font-medium">
                  Total devoluciones
                </h2>
              </div>
              <div className="bg-white p-3 flex flex-col">
                <div className="text-2xl md:text-3xl font-bold text-gray-800 ">
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
                  {/* Círculo rojo a la derecha */}
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
                    placeholder="Buscar por cliente o número de devolución"
                    value={filtroBusqueda}
                    onChange={(e) => {
                      setFiltroBusqueda(e.target.value);
                      setPaginaActual(1); // Resetear a primera página al buscar
                    }}
                    className="w-full rounded-full border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={fechaInicio}
                    onChange={(e) => {
                      setFechaInicio(e.target.value);
                      setPaginaActual(1); // Resetear a primera página al cambiar filtro
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={fechaFin}
                    onChange={(e) => {
                      setFechaFin(e.target.value);
                      setPaginaActual(1); // Resetear a primera página al cambiar filtro
                    }}
                  />
                </div>
              </div>
              
              {/* Botón para limpiar filtros */}
              {(filtroBusqueda || fechaInicio || fechaFin || filtro !== "Todos") && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={limpiarFiltros}
                    className="text-sm text-orange-600 hover:text-orange-800 flex items-center transition-colors duration-150"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>

            {/* Lista de devoluciones */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="border-b pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h3 className="font-medium text-gray-900 mb-2 sm:mb-0">
                  Devoluciones Registradas
                  <span className="ml-2 text-sm font-normal text-gray-700">
                    Mostrando {devolucionesFiltradas.length > 0 ? indexPrimeraDevolucion + 1 : 0} a{" "}
                    {Math.min(indexUltimaDevolucion, devolucionesFiltradas.length)} de {devolucionesFiltradas.length}
                  </span>
                </h3>
                
                {devolucionesFiltradas.length > 0 && (
                  <div className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    {devolucionesFiltradas.length} {devolucionesFiltradas.length === 1 ? "devolución" : "devoluciones"}
                  </div>
                )}
              </div>

              {devolucionesFiltradas.length > 0 ? (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha de Devolución
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Colaborador
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Devuelto
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {devolucionesPaginaActual.map((devolucion) => (
                          <tr
                            key={devolucion.id_preventa}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                #{devolucion.id_preventa || "N/A"}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {formatearFecha(devolucion.fecha_confirmacion)}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                              <div className="text-sm text-gray-900">
                                {devolucion.nombre_colaborador}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <span className="text-sm text-gray-900">
                                  {devolucion.razon_social}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="text-sm px-2 py-1 inline-flex font-medium leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                ${devolucion.total_devuelto.toLocaleString("es-CO")}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Botones
                                tipo="primario"
                                label="Ver Detalles"
                                size="small"
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
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No se encontraron devoluciones con los criterios de búsqueda
                  actuales
                </div>
              )}
              
              {/* Paginación */}
              {devolucionesFiltradas.length > 0 && (
                <div className="border-t border-gray-200 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between mt-4">
                  <div className="text-sm text-gray-700 mb-2 sm:mb-0 text-center sm:text-left">
                    <p>
                      Mostrando <span className="font-medium">{devolucionesFiltradas.length > 0 ? indexPrimeraDevolucion + 1 : 0}</span> a{" "}
                      <span className="font-medium">
                        {Math.min(indexUltimaDevolucion, devolucionesFiltradas.length)}
                      </span>{" "}
                      de{" "}
                      <span className="font-medium">
                        {devolucionesFiltradas.length}
                      </span>{" "}
                      resultados
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Paginación"
                    >
                      <button 
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => cambiarPagina(paginaActual - 1)}
                        disabled={paginaActual === 1}
                      >
                        Anterior
                      </button>
                      
                      {/* Generar botones de página */}
                      {[...Array(totalPaginas).keys()].map(x => (
                        <button
                          key={x + 1}
                          onClick={() => cambiarPagina(x + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            paginaActual === x + 1
                              ? "bg-orange-100 text-orange-700 border-orange-300"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          } text-sm font-medium`}
                        >
                          {x + 1}
                        </button>
                      ))}
                      
                      <button 
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => cambiarPagina(paginaActual + 1)}
                        disabled={paginaActual === totalPaginas || totalPaginas === 0}
                      >
                        Siguiente
                      </button>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Tipografia>
      
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
};

export default HistorialDevoluciones;