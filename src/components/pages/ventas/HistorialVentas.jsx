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

  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

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

    const cumpleBusqueda =
      filtroBusqueda === "" ||
      idString.includes(terminoBusqueda) ||
      nombreString.includes(terminoBusqueda);

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
            <div className="mb-6">
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

            {/* Total ventas */}
            <div className="rounded-lg w-64 shadow-md overflow-hidden mb-6 mx-auto">
              {/* Cabecera con fondo naranja */}
              <div className="bg-[#F78220] p-4">
                <h2 className="text-white text-lg md:text-xl font-medium">
                  Total ventas
                </h2>
              </div>

              {/* Contenido con fondo blanco */}
              <div className="bg-white p-4 flex flex-col">
                {/* Valor grande */}
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  $
                  {ventasFiltradas
                    .reduce((total, venta) => total + venta.total_vendido, 0)
                    .toLocaleString("es-CO")}
                </div>

                {/* Etiqueta de porcentaje y "Total" alineados a la izquierda */}
                <div className="flex items-center gap-2">

                  {/* Círculo naranja a la derecha */}
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                </div>
              </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
              <div className="mb-4">
                <Tipografia variant="h3" className="text-gray-700 font-medium">
                  Filtros
                </Tipografia>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  {/* Filtros de fecha */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <div className="w-full sm:w-auto">
                        <Tipografia className="text-sm mb-1 sm:mb-0">
                          Fecha Inicio:{" "}
                        </Tipografia>
                        <input
                          type="date"
                          className="w-full sm:w-auto p-2 border border-[#F78220] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F78220] focus:border-[#F78220] text-gray-700"
                          value={fechaInicio}
                          onChange={(e) => setFechaInicio(e.target.value)}
                        />
                      </div>
                      <div className="w-full sm:w-auto">
                        <Tipografia className="text-sm mb-1 sm:mb-0">
                          Fecha Fin:{" "}
                        </Tipografia>
                        <input
                          type="date"
                          className="w-full sm:w-auto p-2 border border-[#F78220] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F78220] focus:border-[#F78220] text-gray-700"
                          value={fechaFin}
                          onChange={(e) => setFechaFin(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Búsqueda */}
                  <div className="w-full md:w-[320px]">
                    <CampoTexto
                      placeholder="Buscar por colaborador"
                      value={filtroBusqueda}
                      onChange={(e) => setFiltroBusqueda(e.target.value)}
                    />
                  </div>
                </div>

                {/* Botón Nueva Preventa */}
                {user?.rol !== "ADMINISTRADOR" && (
                  <div className="flex justify-end">
                    <Boton
                      tipo="primario"
                      label="Nueva Preventa"
                      onClick={() => navigate("/preventa/nueva")}
                      className="w-full sm:w-auto whitespace-nowrap"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Lista de ventas */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <Tipografia
                  variant="h2"
                  className="text-lg md:text-xl font-semibold text-gray-900"
                >
                  Ventas Confirmadas
                </Tipografia>
                {ventasFiltradas.length > 0 && (
                  <div className="px-3 py-1 bg-[#F78220]/10 rounded-full">
                    <span className="text-sm text-[#F78220]">
                      {ventasFiltradas.length}{" "}
                      {ventasFiltradas.length === 1 ? "venta" : "ventas"}
                    </span>
                  </div>
                )}
              </div>

              {ventasFiltradas.length > 0 ? (
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <div className="min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ID
                            </th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fecha
                            </th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Colaborador
                            </th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cliente
                            </th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Zona
                            </th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {ventasFiltradas.map((venta, index) => (
                            <tr
                              key={`${venta.id_preventa}-${index}`}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                <span className="text-xs md:text-sm font-medium text-gray-900">
                                  #{venta.id_preventa}
                                </span>
                              </td>
                              <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                <span className="text-xs md:text-sm text-gray-500">
                                  {formatearFecha(venta.fecha_confirmacion)}
                                </span>
                              </td>
                              <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                <span className="text-xs md:text-sm text-gray-500">
                                  {venta.nombre_colaborador}
                                </span>
                              </td>
                              <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                <span className="text-xs md:text-sm text-gray-500">
                                  {venta.razon_social || "Cliente General"}
                                </span>
                              </td>
                              <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                <span className="text-xs md:text-sm text-gray-500">
                                  Zona {venta.nombre_zona}
                                </span>
                              </td>
                              <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                <span className="text-xs md:text-sm font-medium text-green-600">
                                  ${venta.total_vendido.toLocaleString("es-CO")}
                                </span>
                              </td>
                              <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right text-xs md:text-sm font-medium">
                                {venta.id_preventa !== "N/A" && (
                                  <button
                                    onClick={() =>
                                      verDetallesVenta(venta.id_preventa)
                                    }
                                    className="text-[#F78220] hover:text-[#F78220]/80"
                                  >
                                    Ver Detalles
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Tipografia className="text-gray-500 text-sm md:text-base">
                    No se encontraron ventas con los criterios de búsqueda
                    actuales
                  </Tipografia>
                </div>
              )}
            </div>
          </div>
        </main>
      </Tipografia>
    </div>
  );
};

export default HistorialVentas;
