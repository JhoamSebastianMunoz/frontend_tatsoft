import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CampoTextoProfile from "../../atoms/CamposTextoProfile";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import CampoTexto from "../../atoms/CamposTexto";
import AlertaEdicion from "../../pages/administrator/AlertaEdicion";
import Icono from "../../atoms/Iconos";

const EditarCliente = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const datosEjemplo = {
    razonSocial: "Empresa ABC S.A.S.",
    nombre: "Juan",
    apellido: "Pérez",
    celular: "3101234567",
    nit: "900123456-7",
    direccion: "Calle 123 # 45-67, Bogotá",
    correo: "info@empresaabc.com",
  };

  const {
    razonSocial: propRazonSocial,
    nombre: propNombre,
    apellido: propApellido,
    celular: propCelular,
    nit: propNit,
    direccion: propDireccion,
    correo: propCorreo,
    rutaOrigen, 
  } = props;
  
  const [clienteData, setClienteData] = useState({
    razonSocial: propRazonSocial || datosEjemplo.razonSocial,
    nombre: propNombre || datosEjemplo.nombre,
    apellido: propApellido || datosEjemplo.apellido,
    celular: propCelular || datosEjemplo.celular,
    nit: propNit || datosEjemplo.nit,
    direccion: propDireccion || datosEjemplo.direccion,
    correo: propCorreo || datosEjemplo.correo,
  });

  const [originalData, setOriginalData] = useState({});
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [origenRuta, setOrigenRuta] = useState("/gestion/clientes"); 
  const [dataModified, setDataModified] = useState(false);
  const [navigateAfterCancel, setNavigateAfterCancel] = useState(false);

  useEffect(() => {
    setOriginalData({...clienteData});
  }, []);

  useEffect(() => {
    try {
      if (rutaOrigen) {
        setOrigenRuta(rutaOrigen);
        localStorage.setItem('rutaOrigenEdicion', rutaOrigen);
      } else {
        const rutaGuardada = localStorage.getItem('rutaOrigenEdicion');
        if (rutaGuardada) {
          setOrigenRuta(rutaGuardada);
        } else {
          const urlParams = new URLSearchParams(location.search);
          const origen = urlParams.get('origen');
          
          if (origen === 'gestion') {
            setOrigenRuta("/gestion/clientes");
            localStorage.setItem('rutaOrigenEdicion', "/gestion/clientes");
          } else if (origen === 'ver') {
            setOrigenRuta("/ver/cliente");
            localStorage.setItem('rutaOrigenEdicion', "/ver/cliente");
          }
        }
      }
    } catch (error) {
      console.error("Error al detectar ruta de origen:", error);
    }
  }, [rutaOrigen, location]);

  useEffect(() => {
    const isModified = JSON.stringify(clienteData) !== JSON.stringify(originalData);
    setDataModified(isModified);
  }, [clienteData, originalData]);

  const handleChange = (field, value) => {
    if (field === "nit") {
      return;
    }
    
    let stringValue = '';
    if (value && typeof value === 'object' && value.target) {
      stringValue = value.target.value;
    } 
    else if (value === '' || value === null || value === undefined) {
      stringValue = '';
    } 
    else {
      stringValue = String(value);
    }
    
    if (field === "celular" && stringValue !== '') {
      if (!/^\d*$/.test(stringValue)) {
        return;
      }
    }
    
    if (field === "correo" && stringValue !== '') {
      if (stringValue.indexOf('@') === -1) {
        if (stringValue.indexOf('@') !== -1) {
        }
      }
    }
    
    setClienteData(prev => ({
      ...prev,
      [field]: stringValue
    }));
  };

  const handleSave = () => {
    console.log("Guardando cambios:", clienteData);
    setOriginalData({...clienteData});
    setDataModified(false);
    setShowSaveAlert(true);
  };

  const handleConfirmSave = () => {
    setShowSaveAlert(false);
    setShowSuccessAlert(true);
  };

  const handleCancel = () => {
    if (dataModified) {
      // Cuando se hace clic en el botón "Cancelar", queremos navegar después
      setNavigateAfterCancel(true);
      setShowCancelAlert(true);
    } else {
      navigate(origenRuta);
    }
  };

  const handleVolver = () => {
    if (dataModified) {
      // Cuando se hace clic en el ícono "Volver", queremos navegar después
      setNavigateAfterCancel(true);
      setShowCancelAlert(true);
    } else {
      navigate(origenRuta);
    }
  };

  const confirmCancel = () => {
    // Restablecer los datos a los valores originales
    setClienteData({...originalData});
    setDataModified(false);
    setShowCancelAlert(false);
    
    // Solo navegar si viene desde el botón Cancelar o el ícono Volver
    if (navigateAfterCancel) {
      navigate(origenRuta);
    }
    setNavigateAfterCancel(false);
  };

  const closeCancelAlert = () => {
    setShowCancelAlert(false);
    setNavigateAfterCancel(false);
  };

  const handleCloseAlert = () => {
    setShowSaveAlert(false);
    setShowSuccessAlert(true);
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
    navigate(origenRuta);
  };

  const nombreStr = clienteData.nombre || '';
  const apellidoStr = clienteData.apellido || '';
  const fullName = clienteData.razonSocial || `${nombreStr} ${apellidoStr}`.trim();
  
  return (
    <div className="min-h-screen bg-slate-50">  
      <div className="max-w-4xl mx-auto px-10 py-3">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-slate-100 p-6 relative">
            <div className="absolute top-5 left-3 cursor-pointer" onClick={handleVolver}>
              <Icono name="volver" size={45} color="white" />
            </div>
            
            <div className="flex flex-col items-center mt-2">
              {clienteData.razonSocial && (
                <div className="px-4 py-1 bg-orange-500 bg-opacity-70 rounded-full">
                  <Tipografia className="text-white">{clienteData.razonSocial}</Tipografia>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <Tipografia size="xl" className="font-semibold text-gray-600">
                Editando Cliente
              </Tipografia>
              {dataModified && (
                <div className="bg-orange-100 px-3 py-1 rounded-full">
                  <span className="text-sm text-orange-500 font-medium">Cambios sin guardar</span>
                </div>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="shadow-md p-7 rounded-xl">
                <Tipografia className="text-orange-700 font-medium mb-4">
                  Información Básica
                </Tipografia>
                <div className="space-y-5">
                  <CampoTextoProfile 
                    label="Razón Social" 
                    value={clienteData.razonSocial}
                    editable={true}
                    onChange={(value) => handleChange("razonSocial", value)}
                  />
                  <CampoTextoProfile 
                    label="Nombre" 
                    value={clienteData.nombre}
                    editable={true}
                    onChange={(value) => handleChange("nombre", value)}
                  />
                  <CampoTextoProfile 
                    label="Apellido" 
                    value={clienteData.apellido}
                    editable={true}
                    onChange={(value) => handleChange("apellido", value)}
                  />
                  <CampoTexto
                    label="NIT" 
                    value={clienteData.nit}
                    readOnly={true}
                    disabled={true}
                    type="text"
                  />
                </div>
              </div>

              <div className="p-7 shadow-md rounded-xl">
                <Tipografia className="text-orange-700 font-medium mb-4">
                  Información de Contacto
                </Tipografia>
                <div className="space-y-5">
                  <CampoTextoProfile 
                    label="Dirección" 
                    value={clienteData.direccion}
                    editable={true}
                    onChange={(value) => handleChange("direccion", value)}
                    type="text"
                  />
                  <CampoTextoProfile 
                    label="Celular" 
                    value={clienteData.celular}
                    editable={true}
                    onChange={(value) => handleChange("celular", value)}
                    type="text"
                  />
                  <CampoTextoProfile 
                    label="Correo Electrónico" 
                    value={clienteData.correo}
                    editable={true}
                    onChange={(value) => handleChange("correo", value)}
                    type="text"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-center w-full gap-3 pb-4">
              <Boton 
                tipo="primario" 
                label="Guardar Cambios" 
                onClick={handleSave}
                className="w-full sm:w-auto px-4 py-2"
              />
              <Boton
                tipo="cancelar"
                label="Cancelar"
                onClick={handleCancel}
                className="w-full sm:w-auto px-4 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {showSaveAlert && (
        <AlertaEdicion 
          onClose={() => setShowSaveAlert(false)} 
          onConfirm={handleConfirmSave} 
          onCancel={() => setShowSaveAlert(false)}
        />
      )}
      
      {showSuccessAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-4">
               <Icono name="confirmar" size="65"/>
              </div>
              <Tipografia size="lg" className="font-bold mb-2">¡Cambios guardados exitosamente!</Tipografia>
              <Boton
                tipo="primario"
                label="Aceptar"
                size="large"
                onClick={handleCloseSuccessAlert}
              />
            </div>
          </div>
        </div>
      )}

      {showCancelAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-4">
                <Icono name="eliminarAlert" size="80"/>
              </div>
              <Tipografia size="lg" className="font-bold mb-2">¿Estás seguro?</Tipografia>
              <Tipografia className="mb-4">Hay cambios sin guardar. Si continúas, perderás todos los cambios realizados.</Tipografia>
              <div className="flex flex-col sm:flex-row w-full gap-3">
                <Boton
                  tipo="primario"
                  label="Descartar cambios"
                  size="small"
                  onClick={() => {
                    // Restablecer datos a valores originales sin navegar
                    setClienteData({...originalData});
                    setDataModified(false);
                    setShowCancelAlert(false);
                    setNavigateAfterCancel(false);
                  }}
                  className="w-full"
                />
                <Boton
                  tipo="secundario"
                  label="Seguir editando"
                  size="small"
                  onClick={closeCancelAlert}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarCliente;