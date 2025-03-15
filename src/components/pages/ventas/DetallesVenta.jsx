import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { saleService } from "../../../context/services/ApiService";

// Componentes
import Encabezado from "../../molecules/Encabezado";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import Loading from "../../Loading/Loading";

const DetallesVenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detalles, setDetalles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        setLoading(true);
        const response = await saleService.getSaleDetails(id);
        const data = response.data;
        setDetalles(data);
      } catch (err) {
        console.error("Error al cargar detalles de la venta:", err);
        setError("No se pudieron cargar los detalles de la venta.");
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
    navigate("/ventas/historial");
  };

  const handleImprimirRecibo = () => {
    // Función para generar un PDF o abrir la ventana de impresión
    window.print();
  };

  if (loading) {
    return <Loading message="Cargando detalles de la venta..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Encabezado 
        mensaje="Detalles de Venta" 
        onClick={handleVolver}
      />

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

        {detalles ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Información General */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold mb-4">
                  Información de Venta
                </Tipografia>
                
                <div className="space-y-4">
                  <div>
                    <Tipografia className="text-gray-600 text-sm">Venta #</Tipografia>
                    <Tipografia className="font-medium">{detalles.id_preventa}</Tipografia>
                  </div>
                  
                  <div>
                    <Tipografia className="text-gray-600 text-sm">Estado</Tipografia>
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Confirmada
                    </span>
                  </div>
                  
                  <div>
                    <Tipografia className="text-gray-600 text-sm">Fecha de Confirmación</Tipografia>
                    <Tipografia className="font-medium">
                      {formatearFecha(detalles.fecha_confirmacion)}
                    </Tipografia>
                  </div>
                  
                  <div>
                    <Tipografia className="text-gray-600 text-sm">Total</Tipografia>
                    <Tipografia className="font-bold text-lg text-green-700">
                      ${Number(detalles.total || 0).toLocaleString('es-CO')}
                    </Tipografia>
                  </div>
                </div>
              </div>

              {/* Información del Cliente */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold mb-4">
                  Información del Cliente
                </Tipografia>
                
                <div className="space-y-4">
                  <div>
                    <Tipografia className="text-gray-600 text-sm">Nombre / Razón Social</Tipografia>
                    <Tipografia className="font-medium">
                      {detalles.cliente?.razon_social || detalles.cliente?.nombre || "No disponible"}
                    </Tipografia>
                  </div>
                  
                  <div>
                    <Tipografia className="text-gray-600 text-sm">Dirección</Tipografia>
                    <Tipografia className="font-medium">
                      {detalles.cliente?.direccion || "No disponible"}
                    </Tipografia>
                  </div>
                  
                  <div>
                    <Tipografia className="text-gray-600 text-sm">Teléfono</Tipografia>
                    <Tipografia className="font-medium">
                      {detalles.cliente?.telefono || "No disponible"}
                    </Tipografia>
                  </div>
                </div>
              </div>

              {/* Colaborador */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold mb-4">
                  Colaborador
                </Tipografia>
                
                <div>
                  <Tipografia className="text-gray-600 text-sm">Confirmado por</Tipografia>
                  <Tipografia className="font-medium">
                    {detalles.colaborador?.nombre || "No disponible"}
                  </Tipografia>
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold">
                    Productos Vendidos
                  </Tipografia>
                  
                  <Boton 
                    tipo="secundario" 
                    label="Imprimir Recibo" 
                    onClick={handleImprimirRecibo}
                    size="medium"
                  />
                </div>
                
                {detalles.productos && detalles.productos.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio Unitario
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cantidad
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {detalles.productos.map((producto, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {producto.nombre}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-sm text-gray-500">
                                ${Number(producto.precio).toLocaleString('es-CO')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-sm text-gray-500">
                                {producto.cantidad}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-sm font-medium text-gray-900">
                                ${Number(producto.subtotal || producto.precio * producto.cantidad).toLocaleString('es-CO')}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50">
                          <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-right font-bold">
                            Total
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-700">
                            ${Number(detalles.total || 0).toLocaleString('es-CO')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay productos registrados en esta venta
                  </div>
                )}
              </div>

              {/* Información para impresión (solo visible al imprimir) */}
              <div className="hidden print:block bg-white p-8">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold">Recibo de Venta</h1>
                  <p>TATSoft - Sistema de Gestión</p>
                  <p>Fecha de Impresión: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">Información de Venta</h2>
                  <p><strong>Venta #:</strong> {detalles.id_preventa}</p>
                  <p><strong>Fecha:</strong> {formatearFecha(detalles.fecha_confirmacion)}</p>
                  <p><strong>Colaborador:</strong> {detalles.colaborador?.nombre || "No disponible"}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">Cliente</h2>
                  <p><strong>Nombre/Razón Social:</strong> {detalles.cliente?.razon_social || detalles.cliente?.nombre || "No disponible"}</p>
                  <p><strong>Dirección:</strong> {detalles.cliente?.direccion || "No disponible"}</p>
                  <p><strong>Teléfono:</strong> {detalles.cliente?.telefono || "No disponible"}</p>
                </div>

                <h2 className="text-xl font-bold mb-2">Productos</h2>
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
                        <td className="py-2 text-right">${Number(producto.precio).toLocaleString('es-CO')}</td>
                        <td className="py-2 text-right">{producto.cantidad}</td>
                        <td className="py-2 text-right">${Number(producto.subtotal || producto.precio * producto.cantidad).toLocaleString('es-CO')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td colSpan="3" className="py-2 text-right">Total</td>
                      <td className="py-2 text-right">${Number(detalles.total || 0).toLocaleString('es-CO')}</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="mt-8 text-center text-sm">
                  <p>Gracias por su compra</p>
                  <p>Este documento no tiene validez fiscal</p>
                </div>
              </div>

              {/* Otras posibles secciones */}
              <div className="flex justify-end">
                <Boton 
                  tipo="primario" 
                  label="Volver al Historial" 
                  onClick={handleVolver}
                />
              </div>
            </div>
          </div>
        ) : !loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Icono name="eliminarAlert" size={50} className="mx-auto mb-4" />
            <Tipografia size="lg" className="text-gray-700 mb-4">
              No se encontró la venta solicitada
            </Tipografia>
            <Boton 
              tipo="primario" 
              label="Volver al Historial" 
              onClick={handleVolver}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DetallesVenta;