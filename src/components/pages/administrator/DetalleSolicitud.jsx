import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../organisms/Sidebar";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import Alerta from "../../molecules/Alertas";

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
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-16 p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
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
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-16 transition-all duration-300">
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <Tipografia variant="h1" className="text-primary font-bold">
              Detalles de la Solicitud
            </Tipografia>
            <Botones
              label="Volver"
              variant="outlined"
              onClick={() => navigate(-1)}
              icon="back"
            />
          </div>

          {solicitud && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid gap-6">
                <div>
                  <Tipografia variant="h6" className="text-primary mb-2">
                    Información General
                  </Tipografia>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Tipografia variant="body2" className="text-gray-600">
                        Solicitante
                      </Tipografia>
                      <Tipografia variant="body1">
                        {solicitud.usuario}
                      </Tipografia>
                    </div>
                    <div>
                      <Tipografia variant="body2" className="text-gray-600">
                        Fecha de Solicitud
                      </Tipografia>
                      <Tipografia variant="body1">
                        {formatearFecha(solicitud.fecha)}
                      </Tipografia>
                    </div>
                  </div>
                </div>

                <div>
                  <Tipografia variant="h6" className="text-primary mb-2">
                    Detalles de la Solicitud
                  </Tipografia>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(solicitud.datos).map(([key, value]) => (
                      <div key={key}>
                        <Tipografia variant="body2" className="text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Tipografia>
                        <Tipografia variant="body1">
                          {value}
                        </Tipografia>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <Botones 
              label="Rechazar Solicitud" 
              variant="danger"
              onClick={handleRechazar} 
              disabled={loading}
            />
            <Botones 
              label="Aceptar Solicitud" 
              variant="contained"
              onClick={handleAceptar}
              disabled={loading}
            />
          </div>
          
          {/* Modal de alerta */}
          {showAlerta && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Alerta
                tipo={alertaConfig.tipo}
                mensaje={alertaConfig.mensaje}
                onAceptar={alertaConfig.onAceptar}
                onCancelar={alertaConfig.onCancelar}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleSolicitud;