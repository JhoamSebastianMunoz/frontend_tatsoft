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
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [origenRuta, setOrigenRuta] = useState("/ver/cliente"); 
  const [editMode, setEditMode] = useState(true);
  const [dataModified, setDataModified] = useState(false);

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
        return;
      }
    }
    
    setClienteData(prev => ({
      ...prev,
      [field]: stringValue
    }));
  };

  const handleSave = () => {
    console.log("Guardando cambios:", clienteData);
    setShowAlert(true);
    setEditMode(false);
    setOriginalData({...clienteData});
    setDataModified(false);
  };

  const handleCancel = () => {
    setClienteData({...originalData});
    setDataModified(false);
    redirigirInformacionClientes();
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setShowSuccessAlert(true);
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
    redirigirInformacionClientes();
  };

  const redirigirInformacionClientes = () => {
    const rutaFinal = origenRuta;
    localStorage.removeItem('rutaOrigenEdicion');
    navigate(rutaFinal);
  };

  const handleVolver = () => {
    if (dataModified) {
      if (window.confirm("Hay cambios sin guardar. ¿Desea salir sin guardar los cambios?")) {
        redirigirInformacionClientes();
      }
    } else {
      redirigirInformacionClientes();
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setClienteData({...originalData});
      setDataModified(false);
    }
  };

  const nombreStr = clienteData.nombre || '';
  const apellidoStr = clienteData.apellido || '';
  const fullName = clienteData.razonSocial || `${nombreStr} ${apellidoStr}`.trim();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">  
      <div className="max-w-4xl mx-auto px-10 py-3">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-700 p-6 relative">
            <div className="absolute top-5 left-3 cursor-pointer" onClick={handleVolver}>
              <Icono name="volver" size={45} color="white" />
            </div>
            
            <div className="flex flex-col items-center mt-2">
              {clienteData.razonSocial && (
                <div className="px-4 py-1 bg-white bg-opacity-20 rounded-full">
                  <Tipografia className="text-white">{clienteData.razonSocial}</Tipografia>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <Tipografia size="xl" className="font-semibold text-gray-600">
                {editMode ? "Editando Cliente" : "Información del Cliente"}
              </Tipografia>
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="shadow-md p-7 rounded-xl">
                <Tipografia className="text-purple-700 font-medium mb-4">
                  Información Básica
                </Tipografia>
                <div className="space-y-5">
                  <CampoTextoProfile 
                    label="Razón Social" 
                    value={clienteData.razonSocial}
                    editable={editMode}
                    onChange={(value) => handleChange("razonSocial", value)}
                  />
                  <CampoTextoProfile 
                    label="Nombre" 
                    value={clienteData.nombre}
                    editable={editMode}
                    onChange={(value) => handleChange("nombre", value)}
                  />
                  <CampoTextoProfile 
                    label="Apellido" 
                    value={clienteData.apellido}
                    editable={editMode}
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
                <Tipografia className="text-purple-700 font-medium mb-4">
                  Información de Contacto
                </Tipografia>
                <div className="space-y-5">
                  <CampoTextoProfile 
                    label="Dirección" 
                    value={clienteData.direccion}
                    editable={editMode}
                    onChange={(value) => handleChange("direccion", value)}
                    type="text"
                  />
                  <CampoTextoProfile 
                    label="Celular" 
                    value={clienteData.celular}
                    editable={editMode}
                    onChange={(value) => handleChange("celular", value)}
                    type="text"
                  />
                  <CampoTextoProfile 
                    label="Correo Electrónico" 
                    value={clienteData.correo}
                    editable={editMode}
                    onChange={(value) => handleChange("correo", value)}
                    type="text"
                  />
                </div>
              </div>
            </div>

            {editMode && (
              <div className="mt-6 flex flex-col sm:flex-row justify-center w-full gap-3 pb-4">
                <Boton 
                  tipo="secundario" 
                  label="Guardar Cambios" 
                  onClick={handleSave}
                  className="w-full sm:w-auto px-4 py-2"
                  disabled={!dataModified}
                />
                <Boton
                  tipo="cancelar"
                  label="Cancelar"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-4 py-2"
                  disabled={!dataModified}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {showAlert && (
        <AlertaEdicion onClose={handleCloseAlert} />
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
                onClick={handleCloseSuccessAlert}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarCliente;