import React, { useState } from "react";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Sidebar from "../../organisms/Sidebar"
import AlertaInhabilitar from "../../pages/administrator/AlertaInhabilitar";

const VerCliente = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [clienteStatus, setClienteStatus] = useState("activo");

  const clienteData = {
    RazonSocial: "Tienda el galán",
    nombre: "Carlos Alberto",
    apellido: "Muñoz",
    celular: "3097735678",
    nit: "12345678",
    dirrecion: "B/El galan calle 30 #20",
    estado: clienteStatus, 
  };

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleConfirmStatusChange = () => {
    setClienteStatus(clienteStatus === "activo" ? "inactivo" : "activo");
    setShowAlert(false);
  };

  // Actualizado para incluir el parámetro de origen
  const handleEditarCliente = () => {
    // Guardar la ruta de origen en localStorage
    localStorage.setItem('rutaOrigenEdicion', '/ver/cliente');
    console.log("Ruta de origen guardada en localStorage: /ver/cliente");
    
    // También pasamos el parámetro por URL como respaldo
    window.location.href = "/editar/cliente?origen=ver";
    console.log("Redirigiendo a editar desde ver cliente");
  };

  const buttonText = clienteStatus === "activo" ? "Inhabilitar" : "Habilitar";
  const alertText = clienteStatus === "activo" 
    ? "¿Confirmas la inhabilitación del cliente?" 
    : "¿Confirmas la habilitación del cliente?";

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:gap-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 md:hidden">
            <div className="bg-gradient-to-r from-orange-600 to-orange-800 p-4 relative">
              <div className="flex flex-col items-center pt-5 pb-4">
                <Tipografia
                  variant="h2"
                  className="text-white text-center font-semibold my-2"
                >
                  {clienteData.RazonSocial} {clienteData.nombre}
                </Tipografia>
                <div className="mt-2 w-full flex flex-col sm:flex-row gap-2">
                  <Botones 
                    tipo={clienteStatus === "activo" ? "cancelar" : "secundario"}
                    label={buttonText} 
                    onClick={handleShowAlert}
                    className="w-full py-2"
                  />
                  <Botones
                    tipo="primario"
                    label="Editar Cliente"
                    onClick={handleEditarCliente}
                    className="w-full py-2"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <Tipografia variant="label" className="text-gray-700 text-base">
                  Razón social:
                </Tipografia>
                <Tipografia className="font-medium p-1">
                  {clienteData.RazonSocial}
                </Tipografia>
              </div>
              <div>
                <Tipografia variant="label" className="text-gray-700 text-base">
                  Nombre:
                </Tipografia>
                <Tipografia className="font-medium p-1">
                  {clienteData.nombre}
                </Tipografia>
              </div>
              <div>
                <Tipografia variant="label" className="text-gray-700 text-base">
                  Apellido:
                </Tipografia>
                <Tipografia className="font-medium p-1">{clienteData.apellido}</Tipografia>
              </div>
              <div>
                <Tipografia variant="label" className="text-gray-700 text-base">
                  Celular:
                </Tipografia>
                <Tipografia className="font-medium p-1">
                  {clienteData.celular}
                </Tipografia>
              </div>
              <div>
                <Tipografia variant="label" className="text-gray-700 text-base">
                  Nit:
                </Tipografia>
                <Tipografia className="font-medium p-1">
                  {clienteData.nit}
                </Tipografia>
              </div>
              <div>
                <Tipografia variant="label" className="text-gray-700 text-base">
                  Dirreción:
                </Tipografia>
                <Tipografia className="font-medium p-1">
                  {clienteData.dirrecion}
                </Tipografia>
              </div>
              <div>
                <Tipografia variant="label" className="text-gray-700 text-base">
                  Estado:
                </Tipografia>
                <Tipografia className={`font-medium p-1 ${clienteData.estado === "activo" ? "text-green-600" : "text-red-600"}`}>
                  {clienteData.estado === "activo" ? "Activo" : "Inactivo"}
                </Tipografia>
              </div>
            </div>
          </div>
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden md:w-1/3 lg:w-1/4">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8">
              <div className="flex flex-col items-center">
                <Tipografia
                  variant="h2"
                  className="text-white text-center text-xl lg:text-2xl font-semibold"
                >
                {clienteData.RazonSocial}
                </Tipografia>
                <Tipografia
                  variant="body"
                  className="text-orange-200 mt-5 text-center"
                >
                  {clienteData.rol}
                </Tipografia>
              </div>
            </div>
            <div className="p-5 flex flex-col items-center">
              <Botones 
                tipo="primario"
                label="Editar Cliente"
                onClick={handleEditarCliente}
                className="w-full py-2"
              />
              <Botones
                label={buttonText}
                tipo={clienteStatus === "activo" ? "cancelar" : "alerta"}
                className="w-full py-2"
                onClick={handleShowAlert}
              />
            </div>
          </div>

          <div className="hidden md:block md:w-2/3 lg:w-3/4 bg-white rounded-xl shadow-lg p-6 lg:p-7">
            <Tipografia
              variant="h2"
              className="text-xl font-semibold mb-5 text-orange-500"
            >
              Información del cliente
            </Tipografia>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
              <div>
                <Tipografia
                  variant="label"
                  className="text-gray-500 text-sm block mb-1"
                >
                  Razon Social
                </Tipografia>
                <div className="border border-orange-300 rounded-lg p-2 lg:p-3 bg-gray-50">
                  <Tipografia className="font-medium">
                    {clienteData.RazonSocial}
                  </Tipografia>
                </div>
              </div>

              <div>
                <Tipografia
                  variant="label"
                  className="text-gray-500 text-sm block mb-1"
                >
                  Nombre
                </Tipografia>
                <div className="border border-orange-300 rounded-lg p-2 lg:p-3 bg-gray-50">
                  <Tipografia className="font-medium">
                    {clienteData.nombre}
                  </Tipografia>
                </div>
              </div>

              <div>
                <Tipografia
                  variant="label"
                  className="text-gray-500 text-sm block mb-1"
                >
                  Apellidos
                </Tipografia>
                <div className="border border-orange-300 rounded-lg p-2 lg:p-3 bg-gray-50">
                  <Tipografia className="font-medium">{clienteData.apellido}</Tipografia>
                </div>
              </div>

              <div>
                <Tipografia
                  variant="label"
                  className="text-gray-500 text-sm block mb-1"
                >
                  Teléfono Celular
                </Tipografia>
                <div className="border border-orange-300 rounded-lg p-2 lg:p-3 bg-gray-50">
                  <Tipografia className="font-medium">
                    {clienteData.celular}
                  </Tipografia>
                </div>
              </div>

              <div className="lg:col-span-2">
                <Tipografia
                  variant="label"
                  className="text-gray-500 text-sm block mb-1"
                >
                  Nit
                </Tipografia>
                <div className="border border-orange-300 rounded-lg p-2 lg:p-3 bg-gray-50">
                  <Tipografia className="font-medium">
                    {clienteData.nit}
                  </Tipografia>
                </div>
              </div>

              <div className="lg:col-span-2">
                <Tipografia
                  variant="label"
                  className="text-gray-500 text-sm block mb-1"
                >
                  Estado
                </Tipografia>
                <div
                  className={`border rounded-lg p-2 lg:p-3 ${
                    clienteData.estado === "activo"
                      ? "border-slate-400 bg-slate-100"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  <Tipografia
                    className={`font-medium ${
                      clienteData.estado === "activo"
                        ? "text-gray-800"
                        : "text-red-700"
                    }`}
                  >
                    {clienteData.estado === "activo" ? "Activo" : "Inactivo"}
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
          isEnabling={clienteStatus.Status !== "activo"}
        />
      )}
    </div>
  );
};

export default VerCliente;

