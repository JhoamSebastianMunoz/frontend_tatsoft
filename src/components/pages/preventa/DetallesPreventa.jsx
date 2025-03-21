import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { presaleService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Encabezado from "../../molecules/Encabezado";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import SidebarAdm from "../../organisms/SidebarAdm";
import Loading from "../../Loading/Loading";

const DetallesPreventa = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [detalles, setDetalles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accionEnProceso, setAccionEnProceso] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState({ show: false, message: "", type: "" });

  // Cargar detalles de la preventa
  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        setLoading(true);
        const response = await presaleService.getPresaleDetails(id);
        
        if (response.data) {
          setDetalles(response.data);
        } else {
          setError("No se pudo obtener la información de esta preventa");
        }
      } catch (err) {
        console.error("Error al cargar detalles de la preventa:", err);
        
        if (err.response?.status === 404) {
          setError("La preventa solicitada no existe o ha sido eliminada");
        } else {
          setError("No se pudieron cargar los detalles de la preventa. Por favor, intente nuevamente.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetalles();
    }
  }, [id]);

  // Formatear fecha para mostrar
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

  // Manejar confirmación de preventa
  const handleConfirmar = () => {
    navigate(`/preventa/confirmar/${id}`);
  };

  // Manejar cancelación de preventa
  const handleCancelar = async () => {
    const confirmar = window.confirm("¿Está seguro que desea cancelar esta preventa? Esta acción no se puede deshacer.");
    
    if (confirmar) {
      try {
        setAccionEnProceso(true);
        await presaleService.cancelPresale(id);
        
        setMostrarAlerta({
          show: true,
          message: "Preventa cancelada con éxito",
          type: "success"
        });
        
        // Actualizar estado de la preventa en la vista
        setDetalles(prevDetalles => ({
          ...prevDetalles,
          estado: "Cancelada"
        }));
        
        // Redireccionar después de 2 segundos
        setTimeout(() => {
          navigate("/preventa/historial");
        }, 2000);
        
      } catch (err) {
        console.error("Error al cancelar preventa:", err);
        
        setMostrarAlerta({
          show: true,
          message: "Error al cancelar la preventa. Por favor, intente nuevamente.",
          type: "error"
        });
      } finally {
        setAccionEnProceso(false);
      }
    }
  };

  // Volver al historial de preventas
  const handleVolver = () => {
    navigate("/preventa/historial");
  };

  // Calcular subtotal
  const calcularTotalProductos = () => {
    if (!detalles || !detalles.productos || !Array.isArray(detalles.productos)) {
      return 0;
    }
    
    return detalles.productos.reduce((total, producto) => {
      const subtotal = parseFloat(producto.subtotal || (producto.precio * producto.cantidad)) || 0;
      return total + subtotal;
    }, 0);
  };

  if (loading) {
    return <Loading message="Cargando detalles de la preventa..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Encabezado
        mensaje="Detalles de Preventa"
        onClick={handleVolver}
      />
      <SidebarAdm />
      <div className="container mx-auto px-4 py-6 pt-20 md:ml-64">
        {/* Alertas */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <div className="flex items-center">
              <Icono name="eliminarAlert" size={20} />
              <span className="ml-2">{error}</span>
            </div>
          </div>
        )}
        
        {mostrarAlerta.show && (
          <div className={`${mostrarAlerta.type === "success" ? "bg-green-100 border-green-500 text-green-700" : "bg-red-100 border-red-500 text-red-700"} border-l-4 p-4 mb-4 rounded`}>
            <div className="flex items-center">
              <Icono name={mostrarAlerta.type === "success" ? "confirmar" : "eliminarAlert"} size={20} />
              <span className="ml-2">{mostrarAlerta.message}</span>
            </div>
          </div>
        )}

        {detalles ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Información General */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold mb-4">
                  Información General
                </Tipografia>
               
                <div className="space-y-4">
                  <div>
                    <Tipografia className="text-gray-600 text-sm">Preventa #</Tipografia>
                    <Tipografia className="font-medium">{detalles.id_preventa}</Tipografia>
                  </div>
                 
                  <div>
                    <Tipografia className="text-gray-600 text-sm">Estado</Tipografia>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${detalles.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        detalles.estado === 'Confirmada' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'}`}>
                      {detalles.estado}
                    </span>
                  </div>
                 
                  <div>
                    <Tipografia className="text-gray-600 text-sm">Fecha de Creación</Tipografia>
                    <Tipografia className="font-medium">
                      {formatearFecha(detalles.fecha_creacion)}
                    </Tipografia>
                  </div>
                 
                  {detalles.fecha_confirmacion && (
                    <div>
                      <Tipografia className="text-gray-600 text-sm">Fecha de Confirmación</Tipografia>
                      <Tipografia className="font-medium">
                        {formatearFecha(detalles.fecha_confirmacion)}
                      </Tipografia>
                    </div>
                  )}
                 
                  <div>
                    <Tipografia className="text-gray-600 text-sm">Total</Tipografia>
                    <Tipografia className="font-bold text-lg text-purple-700">
                      ${typeof detalles.total === 'number' 
                          ? detalles.total.toLocaleString('es-CO') 
                          : parseFloat(detalles.total || 0).toLocaleString('es-CO')}
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
                  <Tipografia className="text-gray-600 text-sm">Registrado por</Tipografia>
                  <Tipografia className="font-medium">
                    {detalles.colaborador?.nombre || "No disponible"}
                  </Tipografia>
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold mb-4">
                  Productos
                </Tipografia>
               
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
                                ${typeof producto.precio === 'number' 
                                    ? producto.precio.toLocaleString('es-CO') 
                                    : parseFloat(producto.precio || 0).toLocaleString('es-CO')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-sm text-gray-500">
                                {producto.cantidad}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-sm font-medium text-gray-900">
                                ${typeof producto.subtotal === 'number' 
                                    ? producto.subtotal.toLocaleString('es-CO') 
                                    : parseFloat(producto.subtotal || (producto.precio * producto.cantidad) || 0).toLocaleString('es-CO')}
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
                          <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-purple-700">
                            ${typeof detalles.total === 'number' 
                                ? detalles.total.toLocaleString('es-CO') 
                                : parseFloat(detalles.total || calcularTotalProductos() || 0).toLocaleString('es-CO')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay productos registrados en esta preventa
                  </div>
                )}
              </div>

              {/* Acciones */}
              {detalles.estado === 'Pendiente' && (
                <div className="flex justify-end space-x-4">
                  <Boton
                    tipo="cancelar"
                    label={accionEnProceso ? "Procesando..." : "Cancelar Preventa"}
                    onClick={handleCancelar}
                    disabled={accionEnProceso}
                  />
                 
                  {user.rol === 'ADMINISTRADOR' && (
                    <Boton
                      tipo="primario"
                      label="Confirmar Preventa"
                      onClick={handleConfirmar}
                      disabled={accionEnProceso}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ) : !loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Icono name="eliminarAlert" size={50} className="mx-auto mb-4" />
            <Tipografia size="lg" className="text-gray-700 mb-4">
              No se encontró la preventa solicitada
            </Tipografia>
            <Boton
              tipo="secundario"
              label="Volver al Historial"
              onClick={handleVolver}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DetallesPreventa;