import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../organisms/Sidebar";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import Alerta from "../../molecules/Alertas";
import Buscador from "../../molecules/Buscador";
import FiltroOpciones from "../../molecules/FiltroOpciones";

/**
 * Componente para mostrar y gestionar la lista de solicitudes pendientes
 */
const ListaSolicitudes = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Simular carga de solicitudes de la API
  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        setLoading(true);
        // Datos de ejemplo simplificados
        const mockData = [
          {
            id: 1,
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
          },
          {
            id: 2,
            fecha: "2023-08-14T09:15:00",
            usuario: "Maria Lopez",
            descripcion: "Solicitud de creación de cliente: Tienda Naturista Vida Sana",
            estado: "pendiente",
            datos: {
              razonSocial: "Vida Sana Ltda",
              nombreCompleto: "Luis Alberto Garces",
              direccion: "Carrera 23 #56-78",
              telefono: "3158889900",
              nit: "800987654-3"
            }
          },
          {
            id: 3,
            fecha: "2023-08-13T16:45:00",
            usuario: "Pedro Gomez",
            descripcion: "Solicitud de creación de producto: Galletas Integrales 500g",
            estado: "pendiente",
            datos: {
              nombre: "Galletas Integrales",
              marca: "NutriSnacks",
              precio: 12500,
              descripcion: "Galletas integrales con semillas, caja de 500g",
              categoria: "Alimentos"
            }
          },
          {
            id: 4,
            fecha: "2023-08-12T10:30:00",
            usuario: "Ana Martinez",
            descripcion: "Solicitud de creación de zona: Sector Suroccidental",
            estado: "pendiente",
            datos: {
              nombre: "Sector Suroccidental",
              ciudad: "Medellín",
              descripcion: "Zona que comprende los barrios El Poblado, Envigado y Sabaneta"
            }
          }
        ];
        
        setTimeout(() => {
          setSolicitudes(mockData);
          setFilteredSolicitudes(mockData);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error("Error al cargar solicitudes:", err);
        setError("Ocurrió un error al cargar las solicitudes. Por favor, intente nuevamente.");
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  // Simplificar el useEffect de filtrado
  useEffect(() => {
    let filtered = [...solicitudes];
    
    // Solo aplicar búsqueda por término
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(sol => 
        sol.descripcion.toLowerCase().includes(term) ||
        sol.usuario.toLowerCase().includes(term)
      );
    }
    
    setFilteredSolicitudes(filtered);
  }, [searchTerm, solicitudes]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleVerDetalles = (id) => {
    navigate(`/solicitudes/detalle/${id}`);
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
      setLoading(true);
      // Aquí iría la llamada a la API para aceptar la solicitud
      // await solicitudesService.aceptarSolicitud(id);
      
      // Simular respuesta exitosa
      setTimeout(() => {
        // Actualizar la lista eliminando la solicitud aceptada
        const updatedSolicitudes = solicitudes.filter(sol => sol.id !== id);
        setSolicitudes(updatedSolicitudes);
        setFilteredSolicitudes(updatedSolicitudes.filter(sol => {
          if (searchTerm.trim() !== "") {
            return sol.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   sol.usuario.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return true;
        }));
        
        setAlertaConfig({
          tipo: "informacion",
          mensaje: "La solicitud ha sido aceptada exitosamente.",
          onAceptar: () => setShowAlerta(false)
        });
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error("Error al aceptar solicitud:", err);
      setAlertaConfig({
        tipo: "informacion",
        mensaje: "Error al aceptar la solicitud. Por favor, intente nuevamente.",
        onAceptar: () => setShowAlerta(false)
      });
      setLoading(false);
    }
  };

  const confirmarRechazarSolicitud = async (id) => {
    try {
      setLoading(true);
      // Aquí iría la llamada a la API para rechazar la solicitud
      // await solicitudesService.rechazarSolicitud(id);
      
      // Simular respuesta exitosa
      setTimeout(() => {
        // Actualizar la lista eliminando la solicitud rechazada
        const updatedSolicitudes = solicitudes.filter(sol => sol.id !== id);
        setSolicitudes(updatedSolicitudes);
        setFilteredSolicitudes(updatedSolicitudes.filter(sol => {
          if (searchTerm.trim() !== "") {
            return sol.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   sol.usuario.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return true;
        }));
        
        setAlertaConfig({
          tipo: "informacion",
          mensaje: "La solicitud ha sido rechazada.",
          onAceptar: () => setShowAlerta(false)
        });
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error("Error al rechazar solicitud:", err);
      setAlertaConfig({
        tipo: "informacion",
        mensaje: "Error al rechazar la solicitud. Por favor, intente nuevamente.",
        onAceptar: () => setShowAlerta(false)
      });
      setLoading(false);
    }
  };

  // Función para formatear la fecha
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

  // Obtener icono según el tipo de solicitud
  const getIconoTipo = (tipo) => {
    switch (tipo.toLowerCase()) {
      case 'cliente':
        return "gest-clientes";
      case 'producto':
        return "gest-productos";
      case 'zona':
        return "gest-zonas";
      default:
        return "opciones";
    }
  };

  if (loading && solicitudes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error && solicitudes.length === 0) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded">
        <p>{error}</p>
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
                  Solicitud de Clientes
                </h1>
              </div>

              <div className="flex flex-col space-y-3 w-full">
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 w-full">
                  <div className="mb-6">
                    <Buscador 
                      placeholder="Buscar solicitudes..." 
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>

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
                          key={solicitud.id} 
                          className="bg-white rounded-lg shadow-md p-4 border-l-4 border-primary"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div className="flex items-start space-x-3 mb-3 sm:mb-0">
                              <div>
                                <Tipografia variant="h6" className="font-semibold text-primary">
                                  {solicitud.descripcion}
                                </Tipografia>
                                <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                  <Tipografia variant="body2" className="text-gray-600">
                                    <span className="flex items-center">
                                      <Icono name="correo" size={14} className="mr-1" />
                                      {solicitud.usuario}
                                    </span>
                                  </Tipografia>
                                  <Tipografia variant="body2" className="text-gray-600">
                                    {formatearFecha(solicitud.fecha)}
                                  </Tipografia>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 ml-auto">
                              <Botones 
                                label="Ver detalles" 
                                variant="outlined"
                                onClick={() => handleVerDetalles(solicitud.id)} 
                              />
                              <Botones 
                                label="Aceptar" 
                                variant="contained"
                                onClick={() => handleAceptarSolicitud(solicitud.id)} 
                              />
                              <Botones 
                                label="Rechazar" 
                                variant="danger"
                                onClick={() => handleRechazarSolicitud(solicitud.id)} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
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
          </Tipografia>
        </div>
      </div>
    </div>
  );
};

export default ListaSolicitudes;