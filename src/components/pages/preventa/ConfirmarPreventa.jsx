import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { presaleService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import SidebarAdm from "../../organisms/Sidebar";
import Loading from "../../Loading/Loading";

const ConfirmarPreventa = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [detalles, setDetalles] = useState(null);
  const [productosDevueltos, setProductosDevueltos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Verificar si el usuario es administrador o colaborador
  useEffect(() => {
    if (!["ADMINISTRADOR", "COLABORADOR"].includes(user.rol)) {
      navigate("/unauthorized");
      return;
    }
  }, [user, navigate]);

  // Cargar detalles de la preventa
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

        const data = response.data;

        // Verificar si la preventa ya está confirmada o cancelada
        if (data.estado !== "Pendiente") {
          setError(`Esta preventa ya ha sido ${data.estado.toLowerCase()}.`);
          setTimeout(() => {
            navigate("/preventa/historial");
          }, 3000);
          return;
        }

        // Verificar que la preventa tenga productos
        if (!data.productos || data.productos.length === 0) {
          setError("Esta preventa no tiene productos asociados.");
          setTimeout(() => {
            navigate("/preventa/historial");
          }, 3000);
          return;
        }

        setDetalles(data);
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
  }, [id, navigate]);

  // Manejar selección de productos a devolver
  const toggleProductoDevuelto = (productoId) => {
    if (productosDevueltos.includes(productoId)) {
      setProductosDevueltos(
        productosDevueltos.filter((id) => id !== productoId)
      );
    } else {
      setProductosDevueltos([...productosDevueltos, productoId]);
    }
  };

  // Confirmar la preventa
  const handleConfirmar = async () => {
    try {
      setEnviando(true);
      setError("");

      // Validar que no se estén devolviendo todos los productos
      if (productosDevueltos.length === detalles.productos.length) {
        setError(
          "No se pueden devolver todos los productos. Por favor, seleccione al menos un producto para confirmar."
        );
        return;
      }

      // Validar que los productos a devolver existan en la preventa
      const productosInvalidos = productosDevueltos.filter(
        (id) => !detalles.productos.some((p) => p.idProducto === id)
      );

      if (productosInvalidos.length > 0) {
        setError("Algunos productos seleccionados no existen en la preventa.");
        return;
      }

      // Preparar los datos para la API según la documentación
      const requestData = {
        returnedProductos: productosDevueltos,
      };

      console.log("Enviando confirmación de preventa:", requestData);

      // Llamar al endpoint de confirmación según la documentación
      const response = await presaleService.confirmPresale(id, requestData);

      console.log("Respuesta de confirmación:", response);

      if (response.status === 200) {
        setSuccess(true);

        // Mostrar mensaje de éxito
        alert("Preventa confirmada exitosamente");

        // Redirigir al historial después de un breve delay
        setTimeout(() => {
          navigate("/preventa/historial");
        }, 2000);
      } else {
        throw new Error(
          response.data?.message || "No se recibió confirmación de la operación"
        );
      }
    } catch (err) {
      console.error("Error al confirmar preventa:", err);
      console.error("Detalles del error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      // Manejar errores según la documentación
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError(
              "Su sesión ha expirado. Por favor, inicie sesión nuevamente."
            );
            break;
          case 403:
            setError("No tiene permisos para confirmar esta preventa.");
            break;
          case 404:
            setError("La preventa no fue encontrada o ya ha sido confirmada.");
            break;
          case 500:
            setError(
              "Error interno del servidor. Por favor, intente nuevamente más tarde."
            );
            break;
          default:
            setError(
              err.response.data?.message || "Error al confirmar la preventa."
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
      setEnviando(false);
    }
  };

  // Volver a la página anterior
  const handleVolver = () => {
    navigate("/preventa/historial");
  };

  if (loading) {
    return <Loading message="Cargando detalles de la preventa..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 ml-10 pl-6">
      <Tipografia>
        <div className="w-full bg-white shadow-sm mb-4">
          <div className="px-2 sm:px-4 lg:px-8 py-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Confirmar Preventa
            </h1>
          </div>
        </div>

        <SidebarAdm />
        <div className="container mx-auto px-2 sm:px-4 py-2 w-full">
          {/* Alertas */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 sm:p-3 mb-2 rounded">
              <div className="flex items-center">
                <Icono name="eliminarAlert" size={20} />
                <span className="ml-2 text-sm sm:text-base">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-2 sm:p-3 mb-2 rounded">
              <div className="flex items-center">
                <Icono name="confirmar" size={20} />
                <span className="ml-2 text-sm sm:text-base">
                  Preventa confirmada con éxito. Redirigiendo...
                </span>
              </div>
            </div>
          )}

          {detalles && (
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
              <Tipografia
                variant="h2"
                size="lg"
                className="text-orange-700 font-bold mb-4 sm:mb-6 text-lg sm:text-xl"
              >
                Confirmar Preventa #{detalles.id_preventa}
              </Tipografia>

              <div className="mb-6">
                <Tipografia className="text-gray-700 mb-2 text-sm sm:text-base">
                  Seleccione los productos que serán devueltos (si aplica):
                </Tipografia>
                <Tipografia className="text-gray-500 text-xs sm:text-sm mb-4">
                  Los productos seleccionados no serán parte de la venta final y
                  serán devueltos al inventario.
                </Tipografia>
              </div>

              {/* Lista de productos */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Devolver
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio Unitario
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {detalles.productos.map((producto, index) => (
                      <tr
                        key={index}
                        className={`${
                          productosDevueltos.includes(producto.idProducto)
                            ? "bg-red-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`producto-${producto.idProducto}`}
                              checked={productosDevueltos.includes(
                                producto.idProducto
                              )}
                              onChange={() =>
                                toggleProductoDevuelto(producto.idProducto)
                              }
                              className="h-4 w-4 focus:ring-orange-500 border-gray-300 rounded"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {producto.nombre}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-500">
                            ${Number(producto.precio).toLocaleString("es-CO")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-500">
                            {producto.cantidad}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div
                            className={`text-sm font-medium ${
                              productosDevueltos.includes(producto.idProducto)
                                ? "line-through text-red-500"
                                : "text-gray-900"
                            }`}
                          >
                            ${Number(producto.subtotal).toLocaleString("es-CO")}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td
                        colSpan="4"
                        className="px-6 py-4 whitespace-nowrap text-right font-bold"
                      >
                        Total a Confirmar
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-orange-700">
                        ${calculateTotalConfirmado()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Resumen y botones */}
              <div className="mt-6 flex flex-col space-y-6">
                <div className="bg-slate-50 p-3 sm:p-4 rounded-lg">
                  <Tipografia className="text-gray-700 text-sm sm:text-base">
                    <strong>Resumen:</strong> De un total de{" "}
                    {detalles.productos.length} productos,
                    {productosDevueltos.length > 0
                      ? ` se devolverán ${
                          productosDevueltos.length
                        } y se confirmarán ${
                          detalles.productos.length - productosDevueltos.length
                        }.`
                      : ` se confirmarán todos los productos.`}
                  </Tipografia>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0 md:w-auto">
                  <Boton
                    tipo="secundario"
                    label="Cancelar"
                    onClick={handleVolver}
                    disabled={enviando || success}
                    className="w-full text-sm sm:text-base md:w-auto"
                  />
                  <Boton
                    tipo="primario"
                    label={enviando ? "Confirmando..." : "Confirmar Venta"}
                    onClick={handleConfirmar}
                    disabled={enviando || success}
                    className="w-full text-sm sm:text-base md:w-auto"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Tipografia>
    </div>
  );

  // Función para calcular el total a confirmar (excluyendo productos devueltos)
  function calculateTotalConfirmado() {
    if (!detalles || !detalles.productos) return 0;

    const total = detalles.productos.reduce((sum, producto) => {
      if (productosDevueltos.includes(producto.idProducto)) {
        return sum;
      }
      return sum + Number(producto.subtotal);
    }, 0);

    return total.toLocaleString("es-CO");
  }
};

export default ConfirmarPreventa;