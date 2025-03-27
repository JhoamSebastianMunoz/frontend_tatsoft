import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { presaleService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Encabezado from "../../molecules/Encabezado";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import Sidebar from "../../organisms/Sidebar";
import Loading from "../../Loading/Loading";

const DetallesPreventa = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [detalles, setDetalles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        setLoading(true);
        setError("");
        console.log("Iniciando carga de detalles de preventa:", id);

        const response = await presaleService.getPresaleDetails(id);
        console.log("Respuesta del backend:", response);

        if (!response || !response.data) {
          throw new Error(
            "La respuesta del servidor no tiene el formato esperado"
          );
        }

        setDetalles(response.data);
      } catch (err) {
        console.error("Error al cargar detalles de la preventa:", err);

        if (err.response) {
          switch (err.response.status) {
            case 401:
              setError(
                "Su sesión ha expirado. Por favor, inicie sesión nuevamente."
              );
              break;
            case 403:
              setError(
                "No tiene permisos para ver los detalles de esta preventa."
              );
              break;
            case 404:
              setError("No se encontró la preventa solicitada.");
              break;
            case 500:
              setError(
                "Error interno del servidor. Por favor, intente nuevamente más tarde."
              );
              break;
            default:
              setError(
                err.response.data?.message ||
                  "Error al cargar los detalles de la preventa."
              );
          }
        } else if (err.request) {
          setError(
            "Error de conexión. Por favor, verifique su conexión a internet."
          );
        } else {
          setError(err.message || "Error al procesar la solicitud.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetalles();
    }
  }, [id]);

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

  const handleConfirmar = () => {
    navigate(`/preventa/confirmar/${id}`);
  };

  const handleCancelar = async () => {
    if (window.confirm("¿Está seguro que desea cancelar esta preventa?")) {
      try {
        setLoading(true);
        setError("");

        const response = await presaleService.cancelPresale(id);
        console.log("Respuesta de cancelación:", response);

        if (response.data?.message) {
          alert("Preventa cancelada con éxito");
          navigate("/preventa/historial");
        } else {
          throw new Error("No se recibió confirmación de la cancelación");
        }
      } catch (err) {
        console.error("Error al cancelar preventa:", err);

        if (err.response) {
          switch (err.response.status) {
            case 401:
              setError(
                "Su sesión ha expirado. Por favor, inicie sesión nuevamente."
              );
              break;
            case 403:
              setError("No tiene permisos para cancelar esta preventa.");
              break;
            case 404:
              setError("No se encontró la preventa solicitada.");
              break;
            case 500:
              setError(
                "Error interno del servidor. Por favor, intente nuevamente más tarde."
              );
              break;
            default:
              setError(
                err.response.data?.message || "Error al cancelar la preventa."
              );
          }
        } else if (err.request) {
          setError(
            "Error de conexión. Por favor, verifique su conexión a internet."
          );
        } else {
          setError(err.message || "Error al procesar la solicitud.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVolver = () => {
    navigate("/preventa/historial");
  };

  if (loading) {
    return <Loading message="Cargando detalles de la preventa..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      <Tipografia>
        <div className="container mx-auto md:pl-12 pl-14">
          <div className="md:pl-0 pl-4 py-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Detalles de Preventa
            </h1>
          </div>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <div className="flex items-center">
                <Icono name="eliminarAlert" size={20} />
                <span className="ml-2">{error}</span>
              </div>
            </div>
          )}

          {detalles && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Cliente */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-orange-600 mb-4">
                    Información Cliente
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Nombre:</span>
                      <span className="ml-2">
                        {detalles.cliente?.nombre ||
                          detalles.cliente?.razon_social}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Razón Social:</span>
                      <span className="ml-2">
                        {detalles.cliente?.razon_social || "No disponible"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Dirección:</span>
                      <span className="ml-2">
                        {detalles.cliente?.direccion || "No disponible"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Teléfono:</span>
                      <span className="ml-2">
                        {detalles.cliente?.telefono || "No disponible"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información de la Venta */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-orange-600 mb-4">
                    Información de la Venta
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Código:</span>
                      <span className="ml-2">#{detalles.id_preventa}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Colaborador:</span>
                      <span className="ml-2">
                        {detalles.colaborador?.nombre || "No disponible"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fecha:</span>
                      <span className="ml-2">
                        {formatearFecha(detalles.fecha_creacion)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Estado:</span>
                      <span
                        className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        detalles.estado === "Pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : detalles.estado === "Confirmada"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      >
                        {detalles.estado}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <h2 className="text-orange-600 text-lg font-medium flex-1">
                    Productos
                  </h2>
                  <button
                    onClick={() => window.print()}
                    className="text-orange-500 hover:text-orange-600 border border-orange-500 hover:border-orange-600 font-medium py-1 px-4 rounded-md transition-colors ml-auto"
                  >
                    Imprimir Recibo
                  </button>
                </div>
                {detalles.productos && detalles.productos.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            NOMBRE
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            PRECIO UNITARIO
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            CANTIDAD
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            SUBTOTAL
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {detalles.productos.map((producto, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {producto.nombre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              ${Number(producto.precio).toLocaleString("es-CO")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              {producto.cantidad}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              $
                              {Number(producto.subtotal).toLocaleString(
                                "es-CO"
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td
                            colSpan="3"
                            className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right"
                          >
                            Total:
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">
                            ${Number(detalles.total).toLocaleString("es-CO")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No hay productos registrados en esta preventa
                  </div>
                )}
              </div>

              {detalles.estado === "Pendiente" &&
                user.rol === "COLABORADOR" && (
                  <div className="flex justify-end space-x-4 mt-4">
                    <Boton
                      tipo="secundario"
                      label="Cancelar Preventa"
                      onClick={handleCancelar}
                    />
                    <Boton
                      tipo="primario"
                      label="Confirmar Preventa"
                      onClick={handleConfirmar}
                    />
                  </div>
                )}

              {/* Botón Volver */}
              <div className="flex justify-end mt-6 pb-4">
                <button
                  onClick={() => navigate('/preventa/historial')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Volver
                </button>
              </div>
            </div>
          )}
        </div>
      </Tipografia>
    </div>
  );
};

export default DetallesPreventa;
