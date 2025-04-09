import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saleService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Sidebar from "../../organisms/Sidebar";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import CampoTexto from "../../atoms/CamposTexto";
import Loading from "../../Loading/Loading";

const HistorialVentas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const esAdministrador = user && user.rol === "ADMINISTRADOR";

  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const ventasPorPagina = 10; // Número de ventas por página

  const aplicarFiltro = (tipoFiltro) => {
    setFiltro(tipoFiltro);
    setPaginaActual(1); // Resetear a la primera página al cambiar filtros
    const hoy = new Date();
    let inicio = new Date();
    let fin = new Date();

    switch (tipoFiltro) {
      case "Semana":
        inicio.setDate(hoy.getDate() - 7);
        setFechaInicio(inicio.toISOString().split("T")[0]);
        setFechaFin(hoy.toISOString().split("T")[0]);
        break;
      case "Mes":
        inicio.setMonth(hoy.getMonth() - 1);
        setFechaInicio(inicio.toISOString().split("T")[0]);
        setFechaFin(hoy.toISOString().split("T")[0]);
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
    const fetchVentas = async () => {
      try {
        setLoading(true);
        const response = await saleService.getAllSales();
        console.log("Respuesta de la API:", response);

        // Asegurarse de que los datos sean un array y tengan la estructura correcta
        let ventasFormateadas = [];
        if (response && response.data) {
          // Si data es un array, lo usamos directamente
          if (Array.isArray(response.data)) {
            ventasFormateadas = response.data.map((venta) => {
              // Extraer el nombre del colaborador del objeto nombre_colaborador
              const nombreColaborador =
                venta.nombre_colaborador?.nombreCompleto || "No disponible";

              // Convertir total_vendido de string a número
              const total = parseFloat(venta.total_vendido) || 0;

              return {
                id_preventa: venta.id_preventa?.toString() || "N/A",
                fecha_confirmacion:
                  venta.fecha_confirmacion || new Date().toISOString(),
                nombre_colaborador: nombreColaborador,
                total_vendido: total,
                razon_social: venta.razon_social || "",
                nombre_zona: venta.nombre_zona || "",
              };
            });
          }
        }

        console.log("Ventas formateadas:", ventasFormateadas);
        setVentas(ventasFormateadas);
      } catch (err) {
        console.error("Error al cargar ventas:", err);
        setError(
          "Error al cargar el historial de ventas. Por favor, intente nuevamente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  // Aplicar filtros
  const ventasFiltradas = ventas.filter((venta) => {
    const terminoBusqueda = filtroBusqueda.toLowerCase();
    const idString = String(venta.id_preventa || "").toLowerCase();
    const nombreString = String(venta.nombre_colaborador || "").toLowerCase();
    const clienteString = String(venta.razon_social || "").toLowerCase();

    const cumpleBusqueda =
      filtroBusqueda === "" ||
      idString.includes(terminoBusqueda) ||
      nombreString.includes(terminoBusqueda) ||
      clienteString.includes(terminoBusqueda);

    let cumpleFecha = true;
    if (fechaInicio || fechaFin) {
      try {
        const fechaVenta = new Date(venta.fecha_confirmacion);
        const inicio = fechaInicio ? new Date(fechaInicio) : null;
        const fin = fechaFin ? new Date(fechaFin) : null;

        if (inicio && fin) {
          cumpleFecha = fechaVenta >= inicio && fechaVenta <= fin;
        } else if (inicio) {
          cumpleFecha = fechaVenta >= inicio;
        } else if (fin) {
          cumpleFecha = fechaVenta <= fin;
        }
      } catch (error) {
        cumpleFecha = false;
      }
    }

    return cumpleBusqueda && cumpleFecha;
  });

  // Paginación
  const indexUltimaVenta = paginaActual * ventasPorPagina;
  const indexPrimeraVenta = indexUltimaVenta - ventasPorPagina;
  const ventasPaginaActual = ventasFiltradas.slice(
    indexPrimeraVenta,
    indexUltimaVenta
  );
  const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Fecha no disponible";
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const verDetallesVenta = (id) => {
    if (id && id !== "N/A") {
      navigate(`/ventas/detalles/${id}`);
    }
  };

  const limpiarFiltros = () => {
    setFiltroBusqueda("");
    setFechaInicio("");
    setFechaFin("");
    setFiltro("Todos");
    setPaginaActual(1);
  };

  const cambiarPagina = (numeroPagina) => {
    if (numeroPagina > 0 && numeroPagina <= totalPaginas) {
      setPaginaActual(numeroPagina);
    }
  };

  if (loading) {
    return <Loading message="Cargando historial de ventas..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      <Tipografia>
        {/* Contenido principal */}
        <main className="w-full md:pl-[100px] pl-20 pr-2 pt-[80px] md:pt-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-2">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Historial de Ventas
              </h1>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                <div className="flex items-center">
                  <Icono name="eliminarAlert" size={20} />
                  <span className="ml-2 text-sm md:text-base">{error}</span>
                </div>
              </div>
            )}
            <div className="rounded-lg w-64 shadow-md overflow-hidden mb-6 mx-auto">
              <div className="bg-[#F78220] p-3">
                <h2 className="text-white text-lg md:text-xl font-medium">
                  Total ventas
                </h2>
              </div>

              <div className="bg-white p-3 flex flex-col">
                <div className="text-2xl md:text-3xl font-bold text-gray-800 ">
                  $
                  {ventasFiltradas
                    .reduce((total, venta) => total + venta.total_vendido, 0)
                    .toLocaleString("es-CO")}
                </div>

                <div className="flex items-center gap-2">
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
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Buscar
                  </label>
                  <CampoTexto
                    placeholder="Buscar por cliente o número de venta"
                    value={filtroBusqueda}
                    onChange={(e) => setFiltroBusqueda(e.target.value)}
                    className="w-full rounded-full border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={fechaInicio}
                    onChange={(e) => {
                      setFechaInicio(e.target.value);
                      setPaginaActual(1);
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={fechaFin}
                    onChange={(e) => {
                      setFechaFin(e.target.value);
                      setPaginaActual(1);
                    }}
                  />
                </div>
              </div>

              {(filtroBusqueda ||
                fechaInicio ||
                fechaFin ||
                filtro !== "Todos") && (
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

            {/* Lista de ventas */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="border-b pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h3 className="font-medium text-gray-900 mb-2 sm:mb-0">
                  Ventas Confirmadas
                  <span className="ml-2 text-sm font-normal text-gray-700">
                    Mostrando{" "}
                    {ventasFiltradas.length > 0 ? indexPrimeraVenta + 1 : 0} a{" "}
                    {Math.min(indexUltimaVenta, ventasFiltradas.length)} de{" "}
                    {ventasFiltradas.length}
                  </span>
                </h3>

                {ventasFiltradas.length > 0 && (
                  <div className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                    {ventasFiltradas.length}{" "}
                    {ventasFiltradas.length === 1 ? "venta" : "ventas"}
                  </div>
                )}
              </div>

              {ventasFiltradas.length > 0 ? (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha de Venta
                          </th>
                          {esAdministrador && (
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Colaborador
                            </th>
                          )}
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total de venta
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {ventasPaginaActual.map((venta, index) => (
                          <tr
                            key={`${venta.id_preventa}-${index}`}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">
                                #{venta.id_preventa}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-500">
                                {formatearFecha(venta.fecha_confirmacion)}
                              </span>
                            </td>
                            {esAdministrador && (
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">
                                  {venta.nombre_colaborador}
                                </span>
                              </td>
                            )}
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">
                                {venta.razon_social || "Cliente General"}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className="text-sm px-2 py-1 inline-flex font-medium leading-5 font-semibold rounded-full bg-green-100 text-green-700">
                                ${venta.total_vendido.toLocaleString("es-CO")}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                              {venta.id_preventa !== "N/A" && (
                                <Boton
                                  label="Ver Detalles"
                                  tipo="primario"
                                  size="small"
                                  onClick={() =>
                                    verDetallesVenta(venta.id_preventa)
                                  }
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No se encontraron ventas con los criterios de búsqueda
                  actuales
                </div>
              )}

              {/* Paginación */}
              {ventasFiltradas.length > 0 && (
                <div className="border-t border-gray-200 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between mt-4">
                  <div className="text-sm text-gray-700 mb-2 sm:mb-0 text-center sm:text-left">
                    <p>
                      Mostrando{" "}
                      <span className="font-medium">
                        {ventasFiltradas.length > 0 ? indexPrimeraVenta + 1 : 0}
                      </span>{" "}
                      a{" "}
                      <span className="font-medium">
                        {Math.min(indexUltimaVenta, ventasFiltradas.length)}
                      </span>{" "}
                      de{" "}
                      <span className="font-medium">
                        {ventasFiltradas.length}
                      </span>{" "}
                      resultados
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        onClick={() => cambiarPagina(paginaActual - 1)}
                        disabled={paginaActual === 1}
                      >
                        Anterior
                      </button>

                      {/* Generar botones de página */}
                      {[...Array(totalPaginas).keys()].map((x) => (
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
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        onClick={() => cambiarPagina(paginaActual + 1)}
                        disabled={paginaActual === totalPaginas}
                      >
                        Siguiente
                      </button>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </Tipografia>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
};

export default HistorialVentas;
