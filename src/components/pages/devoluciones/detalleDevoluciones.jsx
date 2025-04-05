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
  const [imprimiendo, setImprimiendo] = useState(false);

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
    if (!detalles) return;
    
    setImprimiendo(true);
    
    // Crear una nueva ventana para la impresión
    const ventanaImpresion = window.open('', '_blank', 'height=600,width=800');
    
    // Calcular el total como suma de subtotales
    const totalCalculado = detalles.productos?.reduce((sum, producto) => {
      const subtotal = producto.subtotal || (producto.precio * producto.cantidad);
      return sum + parseFloat(subtotal);
    }, 0);
    
    // Construir el HTML para la impresión
    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recibo de Devolución #${detalles.id_preventa}</title>
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
            <h1>RECIBO DE DEVOLUCIÓN</h1>
            <h2>#${detalles.id_preventa}</h2>
          </div>
          
          <div class="info-empresa">
            <h3>INFORMACIÓN DE LA EMPRESA</h3>
            <p>TAT-SOFT</p>
            <p>Sistema de Gestión para Ventas</p>
          </div>
          
          <div class="info-cliente">
            <h3>INFORMACIÓN DEL CLIENTE</h3>
            <p><strong>Cliente:</strong> ${detalles.cliente?.razon_social || detalles.cliente?.nombre || "No especificado"}</p>
            <p><strong>Dirección:</strong> ${detalles.cliente?.direccion || "No especificada"}</p>
            <p><strong>Teléfono:</strong> ${detalles.cliente?.telefono || "No especificado"}</p>
          </div>
          
          <div class="detalles">
            <div class="detalles-titulo">DETALLES DE LA DEVOLUCIÓN</div>
            <p><strong>Fecha de Emisión:</strong> ${formatearFecha(detalles.fecha_confirmacion)}</p>
            <p><strong>Estado:</strong> Devuelto</p>
            <p><strong>Colaborador:</strong> ${detalles.colaborador?.nombre || "No especificado"}</p>
          </div>
          
          <div class="productos">
            <div class="detalles-titulo">PRODUCTOS DEVUELTOS</div>
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
                ${detalles.productos && detalles.productos.map(producto => `
                  <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${parseFloat(producto.precio).toLocaleString('es-CO')}</td>
                    <td>$${parseFloat(producto.subtotal || producto.precio * producto.cantidad).toLocaleString('es-CO')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total">
              TOTAL DEVUELTO: <span>$${parseFloat(totalCalculado || detalles.total).toLocaleString('es-CO')}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Este documento confirma la devolución de los productos listados.</p>
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
                    label={imprimiendo ? "Preparando..." : "Imprimir Recibo"}
                    onClick={handleImprimirRecibo}
                    disabled={imprimiendo}
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
              <div className="mt-6 flex justify-end pb-4">
                <Boton
                  tipo="primario"
                  label="Volver"
                  onClick={handleVolver}
                />
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