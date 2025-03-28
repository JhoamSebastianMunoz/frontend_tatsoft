import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../organisms/Sidebar";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import Alerta from "../../molecules/Alertas";
import Loading from "../../Loading/Loading";

/**
 * Componente para mostrar los detalles de una solicitud de creación de cliente
 * @returns {JSX.Element} Componente DetalleSolicitud
 */
const DetalleSolicitud = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlerta, setShowAlerta] = useState(false);
  const [alertaConfig, setAlertaConfig] = useState({
    tipo: "informacion",
    mensaje: "",
    onAceptar: null,
    onCancelar: null
  });

  // Cargar los detalles de la solicitud
  useEffect(() => {
    const fetchSolicitudDetalle = async () => {
      try {
        setLoading(true);
        // Aquí irá la llamada real a tu API
        // const response = await fetch(`/api/solicitudes/${id}`);
        // const data = await response.json();

        // Datos de ejemplo
        const mockData = {
          id: parseInt(id),
          fecha: "2023-08-15T14:30:00",
          usuario: "Carlos Rodriguez",
          descripcion: "Solicitud de creación de cliente: Supermercado El Progreso",
          estado: "pendiente",
          datos: {
            razonSocial: "Supermercado El Progreso S.A.S",
            nombreCompleto: "Juan Carlos Mendez",
            direccion: "Calle 45 #12-34",
            telefono: "3105556677",
            nit: "900123456-7"
          }
        };

        setTimeout(() => {
          setSolicitud(mockData);
          setLoading(false);
        }, 1000);

      } catch (error) {
        console.error("Error al cargar los detalles:", error);
        setError("Ocurrió un error al cargar los detalles de la solicitud. Por favor, intente nuevamente.");
        setLoading(false);
      }
    };

    fetchSolicitudDetalle();
  }, [id]);

  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Manejar la acción de aceptar la solicitud
  const handleAceptar = () => {
    setAlertaConfig({
      tipo: "confirmacion",
      mensaje: "¿Está seguro que desea aceptar esta solicitud?",
      onAceptar: confirmarAceptarSolicitud,
      onCancelar: () => setShowAlerta(false)
    });
    setShowAlerta(true);
  };

  // Manejar la acción de rechazar la solicitud
  const handleRechazar = () => {
    setAlertaConfig({
      tipo: "eliminacion",
      mensaje: "¿Está seguro que desea rechazar esta solicitud?",
      onAceptar: confirmarRechazarSolicitud,
      onCancelar: () => setShowAlerta(false)
    });
    setShowAlerta(true);
  };

  // Confirmar aceptación de la solicitud
  const confirmarAceptarSolicitud = async () => {
    try {
      setLoading(true);
      // Aquí iría la llamada a la API para aceptar la solicitud
      // await solicitudesService.aceptarSolicitud(id);
      
      // Simular respuesta exitosa
      setTimeout(() => {
        setAlertaConfig({
          tipo: "informacion",
          mensaje: "La solicitud ha sido aceptada exitosamente.",
          onAceptar: () => {
            setShowAlerta(false);
            navigate("/solicitudes");
          }
        });
        setShowAlerta(true);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error("Error al aceptar solicitud:", err);
      setAlertaConfig({
        tipo: "informacion",
        mensaje: "Error al aceptar la solicitud. Por favor, intente nuevamente.",
        onAceptar: () => setShowAlerta(false)
      });
      setShowAlerta(true);
      setLoading(false);
    }
  };

  // Confirmar rechazo de la solicitud
  const confirmarRechazarSolicitud = async () => {
    try {
      setLoading(true);
      // Aquí iría la llamada a la API para rechazar la solicitud
      // await solicitudesService.rechazarSolicitud(id);
      
      // Simular respuesta exitosa
      setTimeout(() => {
        setAlertaConfig({
          tipo: "informacion",
          mensaje: "La solicitud ha sido rechazada.",
          onAceptar: () => {
            setShowAlerta(false);
            navigate("/solicitudes");
          }
        });
        setShowAlerta(true);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error("Error al rechazar solicitud:", err);
      setAlertaConfig({
        tipo: "informacion",
        mensaje: "Error al rechazar la solicitud. Por favor, intente nuevamente.",
        onAceptar: () => setShowAlerta(false)
      });
      setShowAlerta(true);
      setLoading(false);
    }
  };

  if (loading && !solicitud) {
    return (
      <div className="min-h-screen flex bg-slate-100">
        <div className="fixed top-0 left-0 h-full w-14 sm:w-16 md:w-20 lg:w-20 z-10">
          <Sidebar />
        </div>
        <div className="w-full flex-1 pl-[4.3rem] sm:pl-16 md:pl-20 lg:pl-20 xl:pl-20 px-2 sm:px-4 md:px-6 lg:px-2 py-4">
          <Loading message="Cargando detalles de la solicitud..." />
        </div>
      </div>
    );
  }

  if (error && !solicitud) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-16 p-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded">
            <p>{error}</p>
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
        <div className="max-w-3xl mx-auto">
          <div className="mt-2 mb-4 flex items-center justify-between">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
              Detalles de la Solicitud
            </h1>
            <Botones
              label="Volver"
              variant="outlined"
              onClick={() => navigate(-1)}
              icon="back"
              size="small"
            />
          </div>

          {solicitud && (
            <div className="space-y-6">
              {/* Tarjeta de información general */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="border-l-4 border-orange-500 pl-4 mb-4">
                  <Tipografia variant="h6" className="text-gray-800 font-medium">
                    {solicitud.descripcion}
                  </Tipografia>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <Icono name="correo" size={16} className="mr-2" />
                    <span>Solicitado por: {solicitud.usuario}</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-600">
                    <Icono name="calendar" size={16} className="mr-2" />
                    <span>{formatearFecha(solicitud.fecha)}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Datos del cliente */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-1 bg-orange-500 rounded-full mr-3"></div>
                      <Tipografia variant="h6" className="text-gray-800">
                        Información del Cliente
                      </Tipografia>
                    </div>
                    
                    <div className="grid gap-4 pl-4">
                      {Object.entries(solicitud.datos).map(([key, value]) => (
                        <div key={key} className="border-b border-gray-100 pb-3">
                          <Tipografia variant="body2" className="text-gray-500 text-sm mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Tipografia>
                          <Tipografia variant="body1" className="text-gray-800">
                            {value}
                          </Tipografia>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta de estado y acciones */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Tipografia variant="body2" className="text-gray-500">
                      Estado de la solicitud
                    </Tipografia>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        Pendiente de revisión
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Botones 
                      label="Rechazar" 
                      variant="danger"
                      onClick={handleRechazar} 
                      disabled={loading}
                      size="small"
                    />
                    <Botones 
                      label="Aceptar" 
                      variant="contained"
                      onClick={handleAceptar}
                      disabled={loading}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de alerta */}
          {showAlerta && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <Alerta
                tipo={alertaConfig.tipo}
                mensaje={alertaConfig.mensaje}
                onAceptar={alertaConfig.onAceptar}
                onCancelar={alertaConfig.onCancelar}
                className="bg-white rounded-lg shadow-xl"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleSolicitud;