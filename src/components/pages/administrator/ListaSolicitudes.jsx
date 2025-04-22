import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../organisms/Sidebar";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import Alerta from "../../molecules/Alertas";
import Loading from "../../Loading/Loading";
import { clientService } from "../../../context/services/ApiService";

/**
 * Componente para mostrar y gestionar la lista de solicitudes pendientes
 */
const ListaSolicitudes = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlerta, setShowAlerta] = useState(false);
  const [alertaConfig, setAlertaConfig] = useState({
    tipo: "informacion",
    mensaje: "",
    onAceptar: null,
    onCancelar: null
  });
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Cargar solicitudes desde la API
  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        setLoading(true);
        const response = await clientService.getPendingRequests();
        
        if (response && response.data) {
          setSolicitudes(response.data);
          setFilteredSolicitudes(response.data);
        } else {
          throw new Error("No se recibieron datos de solicitudes");
        }
      } catch (err) {
        console.error("Error al cargar solicitudes:", err);
        setError("Ocurrió un error al cargar las solicitudes. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  // Filtrado de solicitudes
  useEffect(() => {
    let filtered = [...solicitudes];
    
    // Aplicar búsqueda por término
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(sol => 
        (sol.razon_social && sol.razon_social.toLowerCase().includes(term)) ||
        (sol.nombre_completo_cliente && sol.nombre_completo_cliente.toLowerCase().includes(term))
      );
    }
    
    setFilteredSolicitudes(filtered);
  }, [searchTerm, solicitudes]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleExpandDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAceptarSolicitud = (id) => {
    setSelectedSolicitudId(id);
    setAlertaConfig({
      tipo: "confirmacion",
      mensaje: "¿Está seguro que desea aceptar esta solicitud?",
      onAceptar: () => confirmarAceptarSolicitud(id),
      onCancelar: () => setShowAlerta(false)
    });
    setShowAlerta(true);
  };

  const handleRechazarSolicitud = (id) => {
    setSelectedSolicitudId(id);
    setAlertaConfig({
      tipo: "eliminacion",
      mensaje: "¿Está seguro que desea rechazar esta solicitud?",
      onAceptar: () => confirmarRechazarSolicitud(id),
      onCancelar: () => setShowAlerta(false)
    });
    setShowAlerta(true);
  };

  const confirmarAceptarSolicitud = async (id) => {
    try {
      setProcessingRequest(true);
      // Llamada a la API para aceptar la solicitud
      const response = await clientService.processClientRequest(id, 'accept');
      
      if (response && response.data) {
        // Actualizar la lista eliminando la solicitud aceptada
        const updatedSolicitudes = solicitudes.filter(sol => sol.id_cliente !== id);
        setSolicitudes(updatedSolicitudes);
        setFilteredSolicitudes(updatedSolicitudes.filter(sol => {
          if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            return (sol.razon_social && sol.razon_social.toLowerCase().includes(term)) ||
                   (sol.nombre_completo_cliente && sol.nombre_completo_cliente.toLowerCase().includes(term));
          }
          return true;
        }));
        
        setAlertaConfig({
          tipo: "informacion",
          mensaje: "La solicitud ha sido aceptada exitosamente.",
          onAceptar: () => setShowAlerta(false)
        });
      } else {
        throw new Error("Error al procesar la solicitud");
      }
    } catch (err) {
      console.error("Error al aceptar solicitud:", err);
      setAlertaConfig({
        tipo: "informacion",
        mensaje: "Error al aceptar la solicitud. Por favor, intente nuevamente.",
        onAceptar: () => setShowAlerta(false)
      });
    } finally {
      setProcessingRequest(false);
      setShowAlerta(true);
    }
  };

  const confirmarRechazarSolicitud = async (id) => {
    try {
      setProcessingRequest(true);
      // Llamada a la API para rechazar la solicitud
      const response = await clientService.processClientRequest(id, 'reject');
      
      if (response && response.data) {
        // Actualizar la lista eliminando la solicitud rechazada
        const updatedSolicitudes = solicitudes.filter(sol => sol.id_cliente !== id);
        setSolicitudes(updatedSolicitudes);
        setFilteredSolicitudes(updatedSolicitudes.filter(sol => {
          if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            return (sol.razon_social && sol.razon_social.toLowerCase().includes(term)) ||
                   (sol.nombre_completo_cliente && sol.nombre_completo_cliente.toLowerCase().includes(term));
          }
          return true;
        }));
        
        setAlertaConfig({
          tipo: "informacion",
          mensaje: "La solicitud ha sido rechazada.",
          onAceptar: () => setShowAlerta(false)
        });
      } else {
        throw new Error("Error al procesar la solicitud");
      }
    } catch (err) {
      console.error("Error al rechazar solicitud:", err);
      setAlertaConfig({
        tipo: "informacion",
        mensaje: "Error al rechazar la solicitud. Por favor, intente nuevamente.",
        onAceptar: () => setShowAlerta(false)
      });
    } finally {
      setProcessingRequest(false);
      setShowAlerta(true);
    }
  };

  // Función para formatear la fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Fecha no disponible';
    
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && solicitudes.length === 0) {
    return <Loading message="Cargando solicitudes..." />;
  }

  if (error && solicitudes.length === 0) {
    return (
      <div className="min-h-screen flex bg-slate-100">
        <div className="fixed top-0 left-0 h-full w-14 sm:w-16 md:w-20 lg:w-20 z-10">
          <Sidebar />
        </div>
        <div className="w-full flex-1 pl-[4.3rem] sm:pl-16 md:pl-20 lg:pl-20 xl:pl-20 px-2 sm:px-4 md:px-6 lg:px-2 py-4">
          <div className="flex mx-0 my-2 bg-red-100 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded-md">
            <Icono className="mr-2" name="eliminarAlert" size={20} />
            <Tipografia className="text-red-700 text-sm">{error}</Tipografia>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <div className="fixed top-0 left-0 h-full w-14 sm:w-16 md:w-20 lg:w-20 z-10">
        <Sidebar />
      </div>
      
      <div className="w-full flex-1 pl-[4.3rem] sm:pl-16 md:pl-20 lg:pl-20 xl:pl-20 px-2 sm:px-4 md:px-6 lg:px-2 py-4 overflow-x-hidden bg-slate-50">
        <div className="max-w-[1600px] mx-auto">
          <Tipografia>
            <div className="w-full">
              <div className="mt-2 mb-4">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                  Solicitudes de Clientes
                </h1>
              </div>

              <div className="flex flex-col space-y-3 w-full">
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 w-full">

                  {processingRequest && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                      <div className="bg-white p-5 rounded-lg flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mb-4"></div>
                        <Tipografia>Procesando solicitud...</Tipografia>
                      </div>
                    </div>
                  )}

                  {filteredSolicitudes.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <Tipografia variant="body1" className="text-gray-500">
                        No se encontraron solicitudes pendientes.
                      </Tipografia>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredSolicitudes.map((solicitud) => (
                        <div 
                          key={solicitud.id_cliente} 
                          className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div className="flex items-start space-x-3 mb-3 sm:mb-0">
                              <div>
                                <Tipografia variant="h6" className="font-semibold text-gray-800">
                                  Solicitud de nuevo cliente: {solicitud.razon_social}
                                </Tipografia>
                                <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                  <Tipografia variant="body2" className="text-gray-600">
                                    <span className="flex items-center">
                                      <Icono name="user" size={14} className="mr-1" />
                                      {solicitud.nombre_completo_cliente}
                                    </span>
                                  </Tipografia>
                                  <Tipografia variant="body2" className="text-gray-600">
                                    {formatearFecha(solicitud.fecha_registro)}
                                  </Tipografia>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 ml-auto">
                              <Botones 
                                label={expandedId === solicitud.id_cliente ? "Ocultar" : "Ver detalles"} 
                                tipo="secundario"
                                onClick={() => toggleExpandDetails(solicitud.id_cliente)} 
                                size="small"
                              />
                              <Botones 
                                label="Aceptar" 
                                tipo="primario"
                                onClick={() => handleAceptarSolicitud(solicitud.id_cliente)} 
                                size="small"
                              />
                              <Botones 
                                label="Rechazar" 
                                tipo="cancelar"
                                onClick={() => handleRechazarSolicitud(solicitud.id_cliente)} 
                                size="small"
                              />
                            </div>
                          </div>

                          {/* Panel desplegable con detalles */}
                          {expandedId === solicitud.id_cliente && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300">
                              <h3 className="text-md font-semibold text-gray-700 mb-3">Información del Cliente</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white rounded-md p-3 shadow-sm">
                                  <div className="mb-2">
                                    <p className="text-sm font-medium text-gray-500">Razón Social</p>
                                    <p className="text-gray-800">{solicitud.razon_social || "No disponible"}</p>
                                  </div>
                                  <div className="mb-2">
                                    <p className="text-sm font-medium text-gray-500">NIT/RUT</p>
                                    <p className="text-gray-800">{solicitud.rut_nit || "No disponible"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                                    <p className="text-gray-800">{solicitud.nombre_completo_cliente || "No disponible"}</p>
                                  </div>
                                </div>
                                <div className="bg-white rounded-md p-3 shadow-sm">
                                  <div className="mb-2">
                                    <p className="text-sm font-medium text-gray-500">Dirección</p>
                                    <p className="text-gray-800">{solicitud.direccion || "No disponible"}</p>
                                  </div>
                                  <div className="mb-2">
                                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                                    <p className="text-gray-800">{solicitud.telefono || "No disponible"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">ID Zona</p>
                                    <p className="text-gray-800">{solicitud.id_zona_de_trabajo || "No asignada"}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showAlerta && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                      <div className="fixed inset-0 bg-black bg-opacity-50"></div>
                      <div className="bg-white rounded-lg p-6 shadow-2xl relative z-10 w-full max-w-md mx-4">
                        <div className="flex flex-col items-center text-center">
                          {alertaConfig.tipo === "eliminacion" && (
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                              <Icono name="eliminarAlert" size={40} className="text-red-500" />
                            </div>
                          )}
                          {alertaConfig.tipo === "confirmacion" && (
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                              <Icono name="confirmar" size={40} className="text-blue-500" />
                            </div>
                          )}
                          {alertaConfig.tipo === "informacion" && (
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                              <Icono name="confirmar" size={40} className="text-green-500" />
                            </div>
                          )}
                          
                          <Tipografia variant="subtitle1" className="font-bold text-lg mb-3">
                            {alertaConfig.mensaje}
                          </Tipografia>
                          
                          <div className="w-full flex flex-col sm:flex-row justify-center gap-4 mt-2">
                            {alertaConfig.onCancelar && (
                              <Botones
                                tipo="secundario"
                                label="Cancelar"
                                onClick={alertaConfig.onCancelar}
                                className="w-full sm:w-auto"
                              />
                            )}
                            <Botones
                              tipo={alertaConfig.tipo === "eliminacion" ? "cancelar" : "primario"}
                              label={alertaConfig.tipo === "informacion" ? "Aceptar" : (alertaConfig.tipo === "eliminacion" ? "Rechazar" : "Aceptar")}
                              onClick={alertaConfig.onAceptar}
                              className="w-full sm:w-auto"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tipografia>
        </div>
      </div>
    </div>
  );
};

export default ListaSolicitudes;