import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { saleService } from "../../../context/services/ApiService";

// Componentes
import Sidebar from "../../organisms/Sidebar";
import Tipografia from "../../atoms/Tipografia";
import Loading from "../../Loading/Loading";

const DetallesVenta = () => {
  const { id } = useParams();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetallesVenta = async () => {
      try {
        setLoading(true);
        const response = await saleService.getSaleDetails(id);
        console.log('Respuesta del backend:', response.data); // Para debug
        setVenta(response.data);
      } catch (err) {
        console.error("Error al cargar los detalles de la venta:", err);
        setError("Error al cargar los detalles de la venta");
      } finally {
        setLoading(false);
      }
    };

    fetchDetallesVenta();
  }, [id]);

  if (loading) return <Loading message="Cargando detalles de la venta..." />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!venta) return <div>No se encontraron detalles de la venta</div>;

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      <main className="w-full md:pl-[100px] pt-[40px] pl-[80px] md:pt-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Detalles de la Venta
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Información del Cliente */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-orange-700 text-lg font-medium mb-4">
                Información Cliente
              </h2>
              <div className="space-y-3">
                <div>
                  <Tipografia className="text-sm text-gray-600">Nombre:</Tipografia>
                  <Tipografia className="text-gray-800">{venta.cliente?.nombre}</Tipografia>
                </div>
                <div>
                  <Tipografia className="text-sm text-gray-600">Razón Social:</Tipografia>
                  <Tipografia className="text-gray-800">{venta.cliente?.razon_social || 'No especificada'}</Tipografia>
                </div>
                <div>
                  <Tipografia className="text-sm text-gray-600">Dirección:</Tipografia>
                  <Tipografia className="text-gray-800">{venta.cliente?.direccion}</Tipografia>
                </div>
                <div>
                  <Tipografia className="text-sm text-gray-600">Teléfono:</Tipografia>
                  <Tipografia className="text-gray-800">{venta.cliente?.telefono}</Tipografia>
                </div>
              </div>
            </div>

            {/* Información de la Venta */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-orange-700 text-lg font-medium mb-4">
                Información de la Venta
              </h2>
              <div className="space-y-3">
                <div>
                  <Tipografia className="text-sm text-gray-600">Código:</Tipografia>
                  <Tipografia className="text-gray-800">#{venta.id_preventa}</Tipografia>
                </div>
                <div>
                  <Tipografia className="text-sm text-gray-600">Colaborador:</Tipografia>
                  <Tipografia className="text-gray-800">{venta.colaborador?.nombre}</Tipografia>
                </div>
                <div>
                  <Tipografia className="text-sm text-gray-600">Fecha:</Tipografia>
                  <Tipografia className="text-gray-800">
                    {venta.fecha_confirmacion || 'Fecha no disponible'}
                  </Tipografia>
                </div>
                <div>
                  <Tipografia className="text-sm text-gray-600">Estado:</Tipografia>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {venta.estado}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Productos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-orange-700 text-lg font-medium mb-4">
              Productos
            </h2>
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
                  {venta.productos?.map((producto, index) => (
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
                        ${parseFloat(producto.subtotal).toLocaleString('es-CO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right font-medium">
                      Total:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${parseFloat(venta.total).toLocaleString('es-CO')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetallesVenta;
