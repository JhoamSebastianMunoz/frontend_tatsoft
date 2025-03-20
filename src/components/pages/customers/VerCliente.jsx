import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientService, areaService } from "../../../context/services/ApiService";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Encabezado from "../../molecules/Encabezado";
import AlertaInhabilitar from "../../pages/administrator/AlertaInhabilitar";
import Loading from "../../Loading/Loading";

const VerCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [showAlert, setShowAlert] = useState(false);
  const [clienteData, setClienteData] = useState(null);
  const [zonaNombre, setZonaNombre] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Cargar datos del cliente cuando se monta el componente
  useEffect(() => {
    const fetchClienteData = async () => {
      if (!id) {
        setError("ID de cliente no proporcionado");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("Realizando petición para cliente con ID:", id);
        
        const response = await clientService.getClientById(id);
        
        console.log("Respuesta del servidor:", response);
        
        if (response && response.data) {
          console.log("Datos del cliente recibidos:", response.data);
          setClienteData(response.data);
          
          // Obtener información de la zona
          if (response.data.id_zona_de_trabajo) {
            try {
              const zonaResponse = await areaService.getAreaById(response.data.id_zona_de_trabajo);
              console.log("Respuesta de zona:", zonaResponse);
              
              if (zonaResponse && zonaResponse.data) {
                setZonaNombre(zonaResponse.data.nombre_zona_trabajo || "No disponible");
              }
            } catch (zonaError) {
              console.error("Error al cargar zona:", zonaError);
              setZonaNombre("No disponible");
            }
          }
        } else {
          throw new Error("No se pudo obtener la información del cliente");
        }
      } catch (err) {
        console.error("Error al cargar datos del cliente:", err);
        setError("No se pudieron cargar los datos del cliente. Por favor, intente nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchClienteData();
  }, [id]);

  const handleShowAlert = () => {
    setShowAlert(true);
    setActionError("");
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleConfirmStatusChange = async () => {
    if (!clienteData) return;

    try {
      setLoadingAction(true);
      setActionError("");
      
      const nuevoEstado = clienteData.estado === "Activo" ? "Inactivo" : "Activo";
      
      console.log("Cambiando estado de cliente a:", nuevoEstado);
      
      // Solo actualizamos el campo estado, no modificamos el resto de campos
      await clientService.updateClient(id, { 
        estado: nuevoEstado 
      });
      
      console.log("Estado actualizado exitosamente");
      
      // Actualizar solo el estado en el objeto local
      setClienteData(prevData => ({
        ...prevData,
        estado: nuevoEstado
      }));
      
      setSuccessMessage(`Cliente ${nuevoEstado === "Activo" ? "habilitado" : "inhabilitado"} exitosamente`);
      
      // Cerrar el diálogo de confirmación
      setShowAlert(false);
      
      // Mostrar mensaje de éxito brevemente
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
    } catch (err) {
      console.error("Error al cambiar el estado del cliente:", err);
      setActionError("No se pudo actualizar el estado del cliente. Por favor, intente nuevamente más tarde.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEditarCliente = () => {
    // Guardar la ruta de origen en localStorage
    localStorage.setItem('rutaOrigenEdicion', '/ver/cliente');
    
    // Navegar a la página de edición
    navigate(`/editar/cliente/${id}`);
  };

  if (loading) {
    return <Loading message="Cargando información del cliente..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Encabezado ruta="/gestion/clientes" mensaje="Error" />
        <div className="container mx-auto p-4">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <Botones
              tipo="primario"
              label="Volver a Clientes"
              onClick={() => navigate('/gestion/clientes')}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!clienteData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Encabezado ruta="/gestion/clientes" mensaje="Cliente no encontrado" />
        <div className="container mx-auto p-4 text-center">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
            <p className="font-bold">Cliente no encontrado</p>
            <p>No se encontró información para el cliente solicitado.</p>
          </div>
          <Botones
            tipo="primario"
            label="Volver a Clientes"
            onClick={() => navigate('/gestion/clientes')}
          />
        </div>
      </div>
    );
  }

  const buttonText = clienteData.estado === "Activo" ? "Inhabilitar" : "Habilitar";
  const alertText = clienteData.estado === "Activo"
    ? "¿Confirmas la inhabilitación del cliente?"
    : "¿Confirmas la habilitación del cliente?";

  return (
    <div className="min-h-screen bg-gray-100">
      <Encabezado ruta="/gestion/clientes" mensaje="Detalle de cliente" />
      
      <div className="container mx-auto p-4">
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-4 transition-all duration-500 animate-fadeIn">
            <p>{successMessage}</p>
          </div>
        )}
        
        {actionError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
            <p>{actionError}</p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:gap-6">
          {/* Vista móvil */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 md:hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-4 relative">
              <div className="flex flex-col items-center pt-5 pb-4">
                <Tipografia
                  variant="h2"
                  className="text-white text-center font-semibold my-2"
                >
                  {clienteData.razon_social || clienteData.nombre_completo_cliente}
                </Tipografia>
                <div className="mt-2 w-full flex flex-col sm:flex-row gap-2">
                  <Botones
                    tipo={clienteData.estado === "Activo" ? "cancelar" : "alerta"}
                    label={loadingAction ? "Procesando..." : buttonText}
                    onClick={handleShowAlert}
                    className="w-full py-2"
                    disabled={loadingAction}
                  />
                  <Botones
                    variant="primary"
                    label="Editar Cliente"
                    onClick={handleEditarCliente}
                    className="w-full py-2"
                    disabled={loadingAction}
                  />
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {clienteData.razon_social && (
                <div>
                  <Tipografia variant="label" className="text-gray-700 text-base">
                    Razón social:
                  </Tipografia>
                  <Tipografia className="font-medium p-1">
                    {clienteData.razon_social}
                  </Tipografia>
                </div>
              )}
              <div>
                <Tipografia variant="label" className="text-gray-700 text-base">
                  Nombre:
                </Tipografia>
                <Tipografia className="font-medium p-1">
                  {clienteData.nombre_completo_cliente}
                </Tipografia>
              </div>
              {clienteData.cedula && (
                <div>
                  <Tipografia variant="label" className="text-gray-700 text-base">
                    Cédula:
                  </Tipografia>
                  <Tipografia className="font-medium p-1">
                    {clienteData.cedula}
                  </Tipografia>
                </div>
              )}
              {clienteData.rut_nit && (
                <div>
                  <Tipografia variant="label" className="text-gray-700 text-base">
                    NIT/RUT:
                  </Tipografia>
                  <Tipografia className="font-medium p-1">
                    {clienteData.rut_nit}
                  </Tipografia>
                </div>
              )}
              <div>
                <Tipografia variant="label" className="text-gray-700 text-base">
                  Teléfono:
                </Tipografia>
                <Tipografia className="font-medium p-1">
                  {clienteData.telefono}
                </Tipografia>
              </div>
              <div>
                <Tipografia variant="label" className="text-gray-700 text-base">
                  Dirección:
                </Tipografia>
                <Tipografia className="font-medium p-1">
                  {clienteData.direccion}
                </Tipografia>
              </div>
              {clienteData.correo && (
                <div>
                  <Tipografia variant="label" className="text-gray-700 text-base">
                    Correo:
                  </Tipografia>
                  <Tipografia className="font-medium p-1">
                    {clienteData.correo}
                  </Tipografia>
                </div>
              )}
              <div>
                <Tipografia variant="label" className="text-gray-700 text-base">
                  Zona:
                </Tipografia>
                <Tipografia className="font-medium p-1">
                  {zonaNombre || "No asignada"}
                </Tipografia>
              </div>
              {clienteData.fecha_registro && (
                <div>
                  <Tipografia variant="label" className="text-gray-700 text-base">
                    Fecha de registro:
                  </Tipografia>
                  <Tipografia className="font-medium p-1">
                    {new Date(clienteData.fecha_registro).toLocaleDateString()}
                  </Tipografia>
                </div>
              )}
              <div>
                <Tipografia variant="label" className="text-gray-700 text-base">
                  Estado:
                </Tipografia>
                <Tipografia className={`font-medium p-1 ${clienteData.estado === "Activo" ? "text-green-600" : "text-red-600"}`}>
                  {clienteData.estado}
                </Tipografia>
              </div>
            </div>
          </div>
          
          {/* Vista desktop */}
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden md:w-1/3 lg:w-1/4">
            <div className="bg-gradient-to-r from-purple-600 to-purple-900 p-8">
              <div className="flex flex-col items-center">
                <Tipografia
                  variant="h2"
                  className="text-white text-center text-xl lg:text-2xl font-semibold"
                >
                  {clienteData.razon_social || clienteData.nombre_completo_cliente}
                </Tipografia>
                <Tipografia
                  variant="body"
                  className="text-purple-200 mt-2 text-center"
                >
                  {clienteData.rut_nit && `NIT/RUT: ${clienteData.rut_nit}`}
                </Tipografia>
              </div>
            </div>
            <div className="p-5 flex flex-col items-center">
              <Botones
                tipo="secundario"
                label="Editar Cliente"
                onClick={handleEditarCliente}
                className="w-full py-2 mb-3"
                disabled={loadingAction}
              />
              <Botones
                label={loadingAction ? "Procesando..." : buttonText}
                tipo={clienteData.estado === "Activo" ? "cancelar" : "alerta"}
                className="w-full py-2"
                onClick={handleShowAlert}
                disabled={loadingAction}
              />
            </div>
          </div>
          
          <div className="hidden md:block md:w-2/3 lg:w-3/4 bg-white rounded-xl shadow-lg p-6 lg:p-7">
            <Tipografia
              variant="h2"
              className="text-xl font-semibold mb-5 text-purple-900"
            >
              Información del cliente
            </Tipografia>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
              {clienteData.razon_social && (
                <div>
                  <Tipografia
                    variant="label"
                    className="text-gray-500 text-sm block mb-1"
                  >
                    Razón Social
                  </Tipografia>
                  <div className="border border-gray-300 rounded-lg p-2 lg:p-3 bg-gray-50">
                    <Tipografia className="font-medium">
                      {clienteData.razon_social}
                    </Tipografia>
                  </div>
                </div>
              )}
              
              <div>
                <Tipografia
                  variant="label"
                  className="text-gray-500 text-sm block mb-1"
                >
                  Nombre Completo
                </Tipografia>
                <div className="border border-gray-300 rounded-lg p-2 lg:p-3 bg-gray-50">
                  <Tipografia className="font-medium">
                    {clienteData.nombre_completo_cliente}
                  </Tipografia>
                </div>
              </div>
              
              {clienteData.cedula && (
                <div>
                  <Tipografia
                    variant="label"
                    className="text-gray-500 text-sm block mb-1"
                  >
                    Cédula
                  </Tipografia>
                  <div className="border border-gray-300 rounded-lg p-2 lg:p-3 bg-gray-50">
                    <Tipografia className="font-medium">
                      {clienteData.cedula}
                    </Tipografia>
                  </div>
                </div>
              )}
              
              {clienteData.rut_nit && (
                <div>
                  <Tipografia
                    variant="label"
                    className="text-gray-500 text-sm block mb-1"
                  >
                    NIT/RUT
                  </Tipografia>
                  <div className="border border-gray-300 rounded-lg p-2 lg:p-3 bg-gray-50">
                    <Tipografia className="font-medium">
                      {clienteData.rut_nit}
                    </Tipografia>
                  </div>
                </div>
              )}
              
              <div>
                <Tipografia
                  variant="label"
                  className="text-gray-500 text-sm block mb-1"
                >
                  Teléfono
                </Tipografia>
                <div className="border border-gray-300 rounded-lg p-2 lg:p-3 bg-gray-50">
                  <Tipografia className="font-medium">
                    {clienteData.telefono}
                  </Tipografia>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <Tipografia
                  variant="label"
                  className="text-gray-500 text-sm block mb-1"
                >
                  Dirección
                </Tipografia>
                <div className="border border-gray-300 rounded-lg p-2 lg:p-3 bg-gray-50">
                  <Tipografia className="font-medium">
                    {clienteData.direccion}
                  </Tipografia>
                </div>
              </div>
              
              {clienteData.correo && (
                <div className="lg:col-span-2">
                  <Tipografia
                    variant="label"
                    className="text-gray-500 text-sm block mb-1"
                  >
                    Correo Electrónico
                  </Tipografia>
                  <div className="border border-gray-300 rounded-lg p-2 lg:p-3 bg-gray-50">
                    <Tipografia className="font-medium">
                      {clienteData.correo}
                    </Tipografia>
                  </div>
                </div>
              )}
              
              <div>
                <Tipografia
                  variant="label"
                  className="text-gray-500 text-sm block mb-1"
                >
                  Zona de Trabajo
                </Tipografia>
                <div className="border border-gray-300 rounded-lg p-2 lg:p-3 bg-gray-50">
                  <Tipografia className="font-medium">
                    {zonaNombre || "No asignada"}
                  </Tipografia>
                </div>
              </div>
              
              {clienteData.fecha_registro && (
                <div>
                  <Tipografia
                    variant="label"
                    className="text-gray-500 text-sm block mb-1"
                  >
                    Fecha de Registro
                  </Tipografia>
                  <div className="border border-gray-300 rounded-lg p-2 lg:p-3 bg-gray-50">
                    <Tipografia className="font-medium">
                      {new Date(clienteData.fecha_registro).toLocaleDateString()}
                    </Tipografia>
                  </div>
                </div>
              )}
              
              <div>
                <Tipografia
                  variant="label"
                  className="text-gray-500 text-sm block mb-1"
                >
                  Estado
                </Tipografia>
                <div
                  className={`border rounded-lg p-2 lg:p-3 ${
                    clienteData.estado === "Activo"
                      ? "border-green-400 bg-green-100"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  <Tipografia
                    className={`font-medium ${
                      clienteData.estado === "Activo"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {clienteData.estado}
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
          isEnabling={clienteData.estado !== "Activo"}
        />
      )}
    </div>
  );
};

export default VerCliente;