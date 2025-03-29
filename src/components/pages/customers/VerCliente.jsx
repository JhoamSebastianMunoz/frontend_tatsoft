import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Sidebar from "../../organisms/Sidebar";
import AlertaInhabilitar from "../../pages/administrator/AlertaInhabilitar";

const VerCliente = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [clienteStatus, setClienteStatus] = useState("activo");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();


  const clienteData = {
    razonSocial: "Tienda el galán",
    nombre: "Carlos Alberto",
    apellido: "Muñoz",
    celular: "3097735678",
    nit: "12345678",
    direccion: "B/El galan calle 30 #20",
    estado: clienteStatus,
    email: "carlosalberto@gmail.com",
    fechaCreacion: "15/02/2023"
  };

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener los datos del cliente
    setLoading(true);
    
    // Simulación de llamada a API
    const fetchCliente = async () => {
      try {
        // Aquí iría una llamada real a la API
        // const response = await clienteService.getClienteById(id);
        // setClienteData(response.data);
        // setClienteStatus(response.data.estado);
        
        // Simulamos un tiempo de carga
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error al cargar datos del cliente:", error);
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id]);

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleConfirmStatusChange = () => {
    // Aquí iría la llamada a la API para cambiar el estado del cliente
    setClienteStatus(clienteStatus === "activo" ? "inactivo" : "activo");
    setShowAlert(false);
  };

  const handleEditarCliente = () => {
    // Navegar a la página de edición con el ID del cliente
    navigate(`/editar/cliente/${id}`, { 
      state: { origen: 'ver' } 
    });
  };

  const handleVolver = () => {
    navigate('/gestion/clientes');
  };

  const buttonText = clienteStatus === "activo" ? "Inhabilitar" : "Habilitar";
  const alertText = clienteStatus === "activo" 
    ? "¿Confirmas la inhabilitación del cliente?" 
    : "¿Confirmas la habilitación del cliente?";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 ml-16 md:ml-64 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <Tipografia className="mt-4 text-gray-600">Cargando información del cliente...</Tipografia>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-16 pl-1 md:ml-20 py-8 px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <button 
              onClick={handleVolver}
              className="mr-3 p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Volver"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <Tipografia variant="h1" className="text-2xl font-bold text-gray-800">
              Detalles del Cliente
            </Tipografia>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mr-2 ml-2">
            <Botones
              tipo="primario"
              label="Editar Cliente"
              onClick={handleEditarCliente}
              className="sm:order-2"
            />
            <Botones 
              tipo={clienteStatus === "activo" ? "secundario" : "alerta"}
              label={buttonText} 
              onClick={handleShowAlert}
              className="sm:order-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tarjeta de información principal */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-1">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-5 px-2">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3 shadow-md">
                  <span className="text-2xl font-bold text-orange-500">
                    {clienteData.nombre.charAt(0)}{clienteData.apellido.charAt(0)}
                  </span>
                </div>
                <Tipografia
                  variant="h2"
                  className="text-white text-center text-xl font-semibold"
                >
                  {clienteData.razonSocial}
                </Tipografia>
                <div className={`mt-3 px-4 py-1 rounded-full shadow-sm
                  ${clienteData.estado === "activo" 
                    ? "bg-slate-100 text-slate-800" 
                    : "bg-red-100 text-red-800"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {clienteData.estado === "activo" ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="text-center py-3 px-4 rounded-lg border border-orange-200">
                <Tipografia variant="label" className="text-orange-700 text-xs uppercase font-semibold block mb-1">
                  NIT
                </Tipografia>
                <Tipografia className="font-bold text-gray-800">{clienteData.nit}</Tipografia>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-100">
                  <Tipografia variant="label" className="text-gray-500 text-xs uppercase font-semibold block mb-1">
                    Teléfono
                  </Tipografia>
                  <Tipografia className="font-medium">{clienteData.celular}</Tipografia>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-100">
                  <Tipografia variant="label" className="text-gray-500 text-xs uppercase font-semibold block mb-1">
                    Registro
                  </Tipografia>
                  <Tipografia className="font-medium">{clienteData.fechaCreacion}</Tipografia>
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-gray-100">
                <Tipografia variant="label" className="text-gray-500 text-xs uppercase font-semibold block mb-1">
                  Email
                </Tipografia>
                <Tipografia className="font-medium truncate">{clienteData.email}</Tipografia>
              </div>
            </div>
          </div>

          {/* Información detallada */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <Tipografia
              variant="h2"
              className="text-xl font-semibold mb-5 text-orange-500 border-b pb-2"
            >
              Información Detallada
            </Tipografia>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Tipografia variant="label" className="text-gray-600 text-xs uppercase font-semibold block mb-1">
                  Razón Social
                </Tipografia>
                <div className="border border-orange-200 rounded-lg p-3 shadow-sm">
                  <Tipografia className="font-medium">
                    {clienteData.razonSocial}
                  </Tipografia>
                </div>
              </div>

              <div>
                <Tipografia variant="label" className="text-gray-600 text-xs uppercase font-semibold block mb-1">
                  Nombre
                </Tipografia>
                <div className="border border-orange-200 rounded-lg p-3  shadow-sm">
                  <Tipografia className="font-medium">
                    {clienteData.nombre}
                  </Tipografia>
                </div>
              </div>

              <div>
                <Tipografia variant="label" className="text-gray-600 text-xs uppercase font-semibold block mb-1">
                  Apellido
                </Tipografia>
                <div className="border border-orange-200 rounded-lg p-3 shadow-sm">
                  <Tipografia className="font-medium">
                    {clienteData.apellido}
                  </Tipografia>
                </div>
              </div>

              <div>
                <Tipografia variant="label" className="text-gray-600 text-xs uppercase font-semibold block mb-1">
                  Teléfono Celular
                </Tipografia>
                <div className="border border-orange-200 rounded-lg p-3  shadow-sm">
                  <Tipografia className="font-medium">
                    {clienteData.celular}
                  </Tipografia>
                </div>
              </div>

              <div>
                <Tipografia variant="label" className="text-gray-600 text-xs uppercase font-semibold block mb-1">
                  NIT
                </Tipografia>
                <div className="border border-orange-200 rounded-lg p-3  shadow-sm">
                  <Tipografia className="font-medium">
                    {clienteData.nit}
                  </Tipografia>
                </div>
              </div>

              <div>
                <Tipografia variant="label" className="text-gray-600 text-xs uppercase font-semibold block mb-1">
                  Email
                </Tipografia>
                <div className="border border-orange-200 rounded-lg p-3  shadow-sm">
                  <Tipografia className="font-medium">
                    {clienteData.email}
                  </Tipografia>
                </div>
              </div>

              <div className="md:col-span-2">
                <Tipografia variant="label" className="text-gray-600 text-xs uppercase font-semibold block mb-1">
                  Dirección
                </Tipografia>
                <div className="border border-orange-200 rounded-lg p-3 shadow-sm">
                  <Tipografia className="font-medium">
                    {clienteData.direccion}
                  </Tipografia>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {showAlert && (
        <AlertaInhabilitar 
          onClose={handleCloseAlert} 
          onConfirm={handleConfirmStatusChange}
          alertText={alertText}
          isEnabling={clienteStatus !== "activo"}
        />
      )}
    </div>
  );
};

export default VerCliente;