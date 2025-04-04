import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { saleService } from "../../../context/services/ApiService";

// Componentes
import Sidebar from "../../organisms/Sidebar";
import Tipografia from "../../atoms/Tipografia";
import Loading from "../../Loading/Loading";

const DetallesVenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imprimiendo, setImprimiendo] = useState(false);

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

  // Función para formatear fecha
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

  // Función para imprimir solo el recibo
  const imprimirRecibo = () => {
    if (!venta) return;
    
    setImprimiendo(true);
    
    // Crear una nueva ventana para la impresión
    const ventanaImpresion = window.open('', '_blank', 'height=600,width=800');
    
    // Calcular el total como suma de subtotales
    const totalCalculado = venta.productos?.reduce((sum, producto) => {
      return sum + parseFloat(producto.subtotal || 0);
    }, 0);
    
    // Construir el HTML para la impresión
    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recibo de Venta #${venta.id_preventa}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .recibo {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
          }
          .encabezado {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #ED6C02;
            padding-bottom: 10px;
          }
          .info-empresa {
            margin-bottom: 20px;
          }
          .info-cliente {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #eee;
            background-color: #f9f9f9;
          }
          .detalles {
            margin-bottom: 20px;
          }
          .detalles-titulo {
            font-weight: bold;
            margin-bottom: 10px;
            color: #ED6C02;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
          }
          .total {
            text-align: right;
            font-weight: bold;
            font-size: 16px;
            margin-top: 20px;
          }
          .total span {
            color: #ED6C02;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="recibo">
          <div class="encabezado">
            <h1>RECIBO DE VENTA</h1>
            <h2>#${venta.id_preventa}</h2>
          </div>
          
          <div class="info-empresa">
            <h3>INFORMACIÓN DE LA EMPRESA</h3>
            <p>TAT-SOFT</p>
            <p>Sistema de Gestión para Ventas</p>
          </div>
          
          <div class="info-cliente">
            <h3>INFORMACIÓN DEL CLIENTE</h3>
            <p><strong>Cliente:</strong> ${venta.cliente?.razon_social || venta.cliente?.nombre || "No especificado"}</p>
            <p><strong>Dirección:</strong> ${venta.cliente?.direccion || "No especificada"}</p>
            <p><strong>Teléfono:</strong> ${venta.cliente?.telefono || "No especificado"}</p>
          </div>
          
          <div class="detalles">
            <div class="detalles-titulo">DETALLES DE LA VENTA</div>
            <p><strong>Fecha de Emisión:</strong> ${formatearFecha(venta.fecha_confirmacion)}</p>
            <p><strong>Estado:</strong> ${venta.estado}</p>
            <p><strong>Colaborador:</strong> ${venta.colaborador?.nombre || "No especificado"}</p>
          </div>
          
          <div class="productos">
            <div class="detalles-titulo">PRODUCTOS</div>
            <table>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${venta.productos && venta.productos.map(producto => `
                  <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${parseFloat(producto.precio).toLocaleString('es-CO')}</td>
                    <td>$${parseFloat(producto.subtotal).toLocaleString('es-CO')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total">
              TOTAL: <span>$${parseFloat(totalCalculado || venta.total).toLocaleString('es-CO')}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Gracias por su compra</p>
            <p>Fecha de impresión: ${new Date().toLocaleString()}</p>
          </div>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background-color: #ED6C02; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Imprimir Recibo
          </button>
          <button onclick="window.close();" style="padding: 10px 20px; background-color: #ccc; color: black; border: none; border-radius: 4px; margin-left: 10px; cursor: pointer;">
            Cerrar
          </button>
        </div>
      </body>
      </html>
    `);
    
    ventanaImpresion.document.close();
    
    // Esperar a que se cargue el contenido antes de mostrar la ventana de impresión
    ventanaImpresion.onload = function() {
      // Para navegadores modernos
      if (ventanaImpresion.window.matchMedia) {
        let mediaQueryList = ventanaImpresion.window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
          if (!mql.matches) {
            // Se ha terminado la impresión o se ha cancelado
            console.log("Impresión finalizada o cancelada");
            setImprimiendo(false);
          }
        });
      }
      
      // Dar tiempo para que se carguen los estilos
      setTimeout(() => {
        ventanaImpresion.focus(); // Enfocar la ventana para preparar la impresión
        setImprimiendo(false);
      }, 500);
    };
  };

  if (loading) return <Loading message="Cargando detalles de la venta..." />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!venta) return <div>No se encontraron detalles de la venta</div>;

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      <Tipografia>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-orange-600 text-lg font-medium">
                Productos
              </h2>
              <button
                onClick={imprimirRecibo}
                disabled={imprimiendo}
                className="text-orange-500 hover:text-orange-600 border border-orange-500 hover:border-orange-600 font-medium py-1 px-4 rounded-md transition-colors"
              >
                {imprimiendo ? "Preparando..." : "Imprimir Recibo"}
              </button>
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

          {/* Botón Volver */}
          <div className="flex justify-end mt-6 pb-4">
            <button
              onClick={() => navigate('/ventas/historial')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </main>
      </Tipografia>
    </div>
  );
};

export default DetallesVenta;
