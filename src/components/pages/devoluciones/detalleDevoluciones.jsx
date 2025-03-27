import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { presaleService } from "../../../context/services/ApiService";

// Componentes
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import Loading from "../../Loading/Loading";
import Sidebar from "../../organisms/Sidebar";

const DetallesDevolucion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detalles, setDetalles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        setLoading(true);
        const response = await presaleService.getRefundDetails(id);
        const data = response.data;
        setDetalles(data);
      } catch (err) {
        console.error("Error al cargar detalles de la devolución:", err);
        setError("No se pudieron cargar los detalles de la devolución.");
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
    return fecha.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleVolver = () => {
    navigate("/devoluciones/historial");
  };

  const handleImprimirRecibo = () => {
    window.print();
  };

  if (loading) {
    return <Loading message="Cargando detalles de la devolución..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      <main className="w-full md:pl-[100px] pt-[40px] pl-[80px] md:pt-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Detalles de la Devolución
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

        {detalles ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Información del Cliente */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-orange-700 text-lg font-medium mb-4">
                    Información Cliente
                  </h2>
                  <div className="space-y-3">
                  <div>
                      <Tipografia className="text-sm text-gray-600">Nombre:</Tipografia>
                      <Tipografia className="text-gray-800">{detalles.cliente?.nombre}</Tipografia>
                  </div>
                  <div>
                      <Tipografia className="text-sm text-gray-600">Razón Social:</Tipografia>
                      <Tipografia className="text-gray-800">{detalles.cliente?.razon_social || 'No especificada'}</Tipografia>
                  </div>
                  <div>
                      <Tipografia className="text-sm text-gray-600">Dirección:</Tipografia>
                      <Tipografia className="text-gray-800">{detalles.cliente?.direccion}</Tipografia>
                  </div>
                  <div>
                      <Tipografia className="text-sm text-gray-600">Teléfono:</Tipografia>
                      <Tipografia className="text-gray-800">{detalles.cliente?.telefono}</Tipografia>
                  </div>
                </div>
              </div>

                {/* Información de la Devolución */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-orange-700 text-lg font-medium mb-4">
                    Información de la Devolución
                  </h2>
                  <div className="space-y-3">
                  <div>
                      <Tipografia className="text-sm text-gray-600">Código:</Tipografia>
                      <Tipografia className="text-gray-800">#{detalles.id_preventa}</Tipografia>
                  </div>
                  <div>
                      <Tipografia className="text-sm text-gray-600">Colaborador:</Tipografia>
                      <Tipografia className="text-gray-800">{detalles.colaborador?.nombre}</Tipografia>
                  </div>
                  <div>
                      <Tipografia className="text-sm text-gray-600">Fecha:</Tipografia>
                      <Tipografia className="text-gray-800">
                        {formatearFecha(detalles.fecha_confirmacion) || 'Fecha no disponible'}
                    </Tipografia>
                  </div>
                <div>
                      <Tipografia className="text-sm text-gray-600">Estado:</Tipografia>
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Devuelto
                      </span>
                </div>
              </div>
            </div>
              </div>

              {/* Tabla de Productos */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-orange-700 text-lg font-medium">
                    Productos Devueltos
                  </h2>
                  <Boton
                    tipo="secundario"
                    label="Imprimir Recibo"
                    onClick={handleImprimirRecibo}
                    size="small"
                  />
                </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                          </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio Unitario
                          </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cantidad
                          </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                      {detalles.productos?.map((producto, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {producto.nombre}
                            </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${parseFloat(producto.precio).toLocaleString('es-CO')}
                            </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {producto.cantidad}
                            </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${parseFloat(producto.subtotal || producto.precio * producto.cantidad).toLocaleString('es-CO')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-right font-medium">
                          Total Devuelto:
                          </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                          ${parseFloat(detalles.total || 0).toLocaleString('es-CO')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  </div>

              {/* Botones de acción */}
              <div className="mt-6 flex justify-end">
                <Boton
                  tipo="primario"
                  label="Volver"
                  onClick={handleVolver}
                />
              </div>
              
              {/* Información para impresión (solo visible al imprimir) */}
              <div className="hidden print:block bg-white p-8">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold">Recibo de Devolución</h1>
                  <p>TATSoft - Sistema de Gestión</p>
                  <p>Fecha de Impresión: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">Información de Devolución</h2>
                  <p><strong>Devolución #:</strong> {detalles.id_preventa}</p>
                  <p><strong>Fecha:</strong> {formatearFecha(detalles.fecha_confirmacion)}</p>
                  <p><strong>Colaborador:</strong> {detalles.colaborador?.nombre || "No disponible"}</p>
                </div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">Cliente</h2>
                  <p><strong>Nombre/Razón Social:</strong> {detalles.cliente?.razon_social || detalles.cliente?.nombre || "No disponible"}</p>
                  <p><strong>Dirección:</strong> {detalles.cliente?.direccion || "No disponible"}</p>
                  <p><strong>Teléfono:</strong> {detalles.cliente?.telefono || "No disponible"}</p>
                </div>
                <h2 className="text-xl font-bold mb-2">Productos Devueltos</h2>
                <table className="w-full mb-6 border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-400">
                      <th className="py-2 text-left">Producto</th>
                      <th className="py-2 text-right">Precio Unit.</th>
                      <th className="py-2 text-right">Cantidad</th>
                      <th className="py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.productos && detalles.productos.map((producto, index) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="py-2 text-left">{producto.nombre}</td>
                        <td className="py-2 text-right">${parseFloat(producto.precio).toLocaleString('es-CO')}</td>
                        <td className="py-2 text-right">{producto.cantidad}</td>
                        <td className="py-2 text-right">${parseFloat(producto.subtotal || producto.precio * producto.cantidad).toLocaleString('es-CO')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td colSpan="3" className="py-2 text-right">Total Devuelto</td>
                      <td className="py-2 text-right">${parseFloat(detalles.total || 0).toLocaleString('es-CO')}</td>
                    </tr>
                  </tfoot>
                </table>
                <div className="mt-8 text-center text-sm">
                  <p>Este documento confirma la devolución de los productos listados</p>
                  <p>Este documento no tiene validez fiscal</p>
                </div>
              </div>
            </>
        ) : !loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Icono name="eliminarAlert" size={50} className="mx-auto mb-4" />
            <Tipografia size="lg" className="text-gray-700 mb-4">
              No se encontró la devolución solicitada
            </Tipografia>
            <Boton
              tipo="primario"
              label="Volver al Historial"
              onClick={handleVolver}
            />
          </div>
        )}
      </div>
      </main>
    </div>
  );
};

export default DetallesDevolucion;