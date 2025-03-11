import React, { useState, useEffect } from "react";
import AvatarTexto from "../../components/molecules/AvatarTexto";
import CampoTextoProfile from "../../components/atoms/CamposTextoProfile";
import Tipografia from "../../components/atoms/Tipografia";
import Boton from "../../components/atoms/Botones";
import CampoTexto from "../../components/atoms/CamposTexto";
import AlertaEdicion from "../../pages/administrator/AlertaEdicion";
import Icono from "../../components/atoms/Iconos";

const EditarUsuario = (props) => {
  const {
    nombre: propNombre,
    apellido: propApellido,
    celular: propCelular,
    cc: propCc,
    correo: propCorreo,
    rol: propRol,
    rutaOrigen, 
  } = props;
  
  const [userData, setUserData] = useState({
    nombre: propNombre || "",
    apellido: propApellido || "",
    celular: propCelular || "",
    cc: propCc || "",
    correo: propCorreo || "",
    rol: propRol || ""
  });

  const [originalData] = useState({...userData});
  const [showAlert, setShowAlert] = useState(false);
  const [origenRuta, setOrigenRuta] = useState("/ver/usuario");
  const [loading, setLoading] = useState(false);

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
          const urlParams = new URLSearchParams(window.location.search);
          const origen = urlParams.get('origen');
          
          if (origen === 'gestion') {
            setOrigenRuta("/gestion/usuarios");
            localStorage.setItem('rutaOrigenEdicion', "/gestion/usuarios");
          } else if (origen === 'ver') {
            setOrigenRuta("/ver/usuario");
            localStorage.setItem('rutaOrigenEdicion', "/ver/usuario");
          }
        }
      }
    } catch (error) {
      console.error("Error al detectar ruta de origen:", error);
    }
  }, [rutaOrigen]);

  const handleChange = (field, value) => {
    if (field === "cc") {
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
    
    setUserData(prev => ({
      ...prev,
      [field]: stringValue
    }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowAlert(true);
    }, 800);
  };

  const handleCancel = () => {
    setUserData({...originalData});
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    const rutaFinal = origenRuta;
    localStorage.removeItem('rutaOrigenEdicion');
    window.location.href = rutaFinal;
  };

  const handleVolver = () => {
    const rutaFinal = origenRuta;
    localStorage.removeItem('rutaOrigenEdicion');
    window.location.href = rutaFinal;
  };

  const nombreStr = userData.nombre || '';
  const apellidoStr = userData.apellido || '';
  const fullName = `${nombreStr} ${apellidoStr}`.trim();
  
  const isDirty = JSON.stringify(userData) !== JSON.stringify(originalData);
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 via-indigo-50 to-white p-4 md:p-6">  
      <div className="max-w-5xl mx-auto">
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Banner superior con avatar */}
          <div className="bg-gradient-to-r from-purple-800 to-indigo-700 p-8 md:p-12">
            <div className="flex flex-col items-center">
              <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
                <AvatarTexto nombre={fullName} size="large" />
              </div>
              {userData.rol && (
                <div className="px-6 py-1.5 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                  <Tipografia className="text-white font-medium">{userData.rol}</Tipografia>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <Tipografia size="2xl" className="font-bold text-gray-800">
                Editar Perfil de Usuario
              </Tipografia>
              {isDirty && (
                <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-yellow-700">Cambios sin guardar</span>
                </div>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="flex items-center mb-6">
                  <Tipografia className="text-lg font-semibold text-purple-800">
                    Información Personal
                  </Tipografia>
                </div>
                
                <div className="space-y-6">
                  <CampoTextoProfile 
                    label="Nombre" 
                    value={userData.nombre}
                    onChange={(e) => handleChange("nombre", e)}
                    onEdit={() => {}}
                  />
                  <CampoTextoProfile 
                    label="Apellido" 
                    value={userData.apellido}
                    onChange={(e) => handleChange("apellido", e)}
                    onEdit={() => {}}
                  />
                  <CampoTextoProfile
                    label="Documento de Identidad" 
                    value={userData.cc}
                    disabled={true}
                    className="bg-gray-100"
                  />
                </div>
              </div>

              <div className="bg-purple-100 p-6 rounded-xl">
                <div className="flex items-center mb-6">
    
                  <Tipografia className="text-lg font-semibold text-indigo-800">
                    Información de Contacto
                  </Tipografia>
                </div>
                
                <div className="space-y-6">
                  <CampoTextoProfile 
                    label="Celular" 
                    value={userData.celular}
                    onChange={(e) => handleChange("celular", e)}
                    onEdit={() => {}}
                    type="text"
                  />
                  <CampoTextoProfile 
                    label="Correo Electrónico" 
                    value={userData.correo}
                    onChange={(e) => handleChange("correo", e)}
                    onEdit={() => {}}
                    type="email"
                  />
                  <CampoTextoProfile 
                    label="Rol en la Empresa" 
                    value={userData.rol}
                    onChange={(e) => handleChange("rol", e)}
                    onEdit={() => {}}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Boton 
                tipo="secundario" 
                label={loading ? "Guardando..." : "Guardar Cambios"}
                onClick={handleSave}
                className="w-full sm:w-auto px-8 py-1 text-base"
                disabled={loading || !isDirty}
              />
              <Boton
                tipo="cancelar"
                label="Descartar Cambios"
                onClick={handleCancel}
                className="w-full sm:w-auto px-8 py-1 text-base"
                disabled={loading || !isDirty}
              />
            </div>
          </div>
        </div>
      </div>

      {showAlert && (
        <AlertaEdicion onClose={handleCloseAlert} />
      )}
    </div>
  );
};

export default EditarUsuario;