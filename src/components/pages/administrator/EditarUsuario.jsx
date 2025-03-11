import React, { useState, useEffect } from "react";
<<<<<<< HEAD:src/pages/administrator/EditarUsuario.jsx
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
  
=======
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "../../../context/services/ApiService";
import AvatarTexto from "../../../components/molecules/AvatarTexto";
import CampoTextoProfile from "../../../components/atoms/CamposTextoProfile";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";
import CampoTexto from "../../../components/atoms/CamposTexto";
import AlertaEdicion from "./AlertaEdicion";
import Icono from "../../../components/atoms/Iconos";

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
>>>>>>> 2b29aaa072bfa5b81ea401657c84a67b85c5fddc:src/components/pages/administrator/EditarUsuario.jsx
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    celular: "",
    cc: "",
    correo: "",
    rol: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
<<<<<<< HEAD:src/pages/administrator/EditarUsuario.jsx
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
=======
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await userService.getUserById(id);
        const user = response.data;
        
        // Dividir el nombre completo en nombre y apellido
        const fullNameParts = user.nombreCompleto.split(" ");
        const nombre = fullNameParts[0] || "";
        const apellido = fullNameParts.slice(1).join(" ") || "";
        
        const formattedData = {
          nombre,
          apellido,
          celular: user.celular,
          cc: user.cedula,
          correo: user.correo,
          rol: user.rol,
        };
        
        setUserData(formattedData);
        setOriginalData(formattedData);
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
        setError("Error al cargar los datos del usuario. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);
>>>>>>> 2b29aaa072bfa5b81ea401657c84a67b85c5fddc:src/components/pages/administrator/EditarUsuario.jsx

  const handleChange = (field, value) => {
    if (field === "cc") {
      return; // No se permite editar el número de cédula
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

<<<<<<< HEAD:src/pages/administrator/EditarUsuario.jsx
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowAlert(true);
    }, 800);
=======
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Formato de los datos para la API
      const updatedUser = {
        cedula: userData.cc,
        nombreCompleto: `${userData.nombre} ${userData.apellido}`.trim(),
        celular: userData.celular,
        correo: userData.correo,
        rol: userData.rol.toLowerCase()
      };
      
      // Llamada a la API para actualizar el usuario
      await userService.updateUser(id, updatedUser);
      
      setSuccess(true);
      setShowAlert(true);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      setError("Error al guardar los cambios. Por favor, inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
>>>>>>> 2b29aaa072bfa5b81ea401657c84a67b85c5fddc:src/components/pages/administrator/EditarUsuario.jsx
  };

  const handleCancel = () => {
    setUserData({...originalData});
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
<<<<<<< HEAD:src/pages/administrator/EditarUsuario.jsx
    const rutaFinal = origenRuta;
    localStorage.removeItem('rutaOrigenEdicion');
    window.location.href = rutaFinal;
  };

  const handleVolver = () => {
    const rutaFinal = origenRuta;
    localStorage.removeItem('rutaOrigenEdicion');
    window.location.href = rutaFinal;
=======
    if (success) {
      navigate(`/ver/usuario/${id}`);
    }
  };

  const handleVolver = () => {
    navigate(`/ver/usuario/${id}`);
>>>>>>> 2b29aaa072bfa5b81ea401657c84a67b85c5fddc:src/components/pages/administrator/EditarUsuario.jsx
  };

  const nombreStr = userData.nombre || '';
  const apellidoStr = userData.apellido || '';
  const fullName = `${nombreStr} ${apellidoStr}`.trim();
<<<<<<< HEAD:src/pages/administrator/EditarUsuario.jsx
  
  const isDirty = JSON.stringify(userData) !== JSON.stringify(originalData);
  
=======

  if (loading && !userData.nombre) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Tipografia>Cargando información del usuario...</Tipografia>
      </div>
    );
  }

>>>>>>> 2b29aaa072bfa5b81ea401657c84a67b85c5fddc:src/components/pages/administrator/EditarUsuario.jsx
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 via-indigo-50 to-white p-4 md:p-6">  
      <div className="max-w-5xl mx-auto">
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
<<<<<<< HEAD:src/pages/administrator/EditarUsuario.jsx
          {/* Banner superior con avatar */}
          <div className="bg-gradient-to-r from-purple-800 to-indigo-700 p-8 md:p-12">
=======
          <div className="bg-gradient-to-r from-purple-900 to-indigo-700 p-6 relative">
            <div className="absolute top-4 left-4 cursor-pointer" onClick={handleVolver}>
              <Icono name="volver" size={45} color="white" />
            </div>
           
>>>>>>> 2b29aaa072bfa5b81ea401657c84a67b85c5fddc:src/components/pages/administrator/EditarUsuario.jsx
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

<<<<<<< HEAD:src/pages/administrator/EditarUsuario.jsx
          <div className="p-6 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <Tipografia size="2xl" className="font-bold text-gray-800">
                Editar Perfil de Usuario
=======
          <div className="p-4 md:p-1">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="flex justify-between items-center ">
              <Tipografia size="xl" className="font-semibold text-gray-600 px-4 mb-1">
                Editando Usuario
>>>>>>> 2b29aaa072bfa5b81ea401657c84a67b85c5fddc:src/components/pages/administrator/EditarUsuario.jsx
              </Tipografia>
              {isDirty && (
                <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-yellow-700">Cambios sin guardar</span>
                </div>
              )}
            </div>
<<<<<<< HEAD:src/pages/administrator/EditarUsuario.jsx
            
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
=======
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="shadow-md p-7 rounded-xl">
                <Tipografia className="text-purple-700 font-medium mb-4">
                  Información Personal
                </Tipografia>
                <div className="space-y-5">
                  <CampoTextoProfile
                    label="Nombre"
>>>>>>> 2b29aaa072bfa5b81ea401657c84a67b85c5fddc:src/components/pages/administrator/EditarUsuario.jsx
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
<<<<<<< HEAD:src/pages/administrator/EditarUsuario.jsx
                  <CampoTextoProfile
                    label="Documento de Identidad" 
=======
                  <CampoTexto
                    label="Documento de Identidad"
>>>>>>> 2b29aaa072bfa5b81ea401657c84a67b85c5fddc:src/components/pages/administrator/EditarUsuario.jsx
                    value={userData.cc}
                    disabled={true}
                    className="bg-gray-100"
                  />
                </div>
              </div>
<<<<<<< HEAD:src/pages/administrator/EditarUsuario.jsx

              <div className="bg-purple-100 p-6 rounded-xl">
                <div className="flex items-center mb-6">
    
                  <Tipografia className="text-lg font-semibold text-indigo-800">
                    Información de Contacto
                  </Tipografia>
                </div>
                
                <div className="space-y-6">
                  <CampoTextoProfile 
                    label="Celular" 
=======
              <div className="p-7 shadow-md rounded-xl">
                <Tipografia className="text-purple-700 font-medium mb-4">
                  Información de Contacto
                </Tipografia>
                <div className="space-y-5">
                  <CampoTextoProfile
                    label="Celular"
>>>>>>> 2b29aaa072bfa5b81ea401657c84a67b85c5fddc:src/components/pages/administrator/EditarUsuario.jsx
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
<<<<<<< HEAD:src/pages/administrator/EditarUsuario.jsx

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Boton 
                tipo="secundario" 
                label={loading ? "Guardando..." : "Guardar Cambios"}
                onClick={handleSave}
                className="w-full sm:w-auto px-8 py-1 text-base"
                disabled={loading || !isDirty}
=======
            <div className="mt-4 flex flex-col sm:flex-row justify-center w-full gap-3 pb-4">
              <Boton
                tipo="primario"
                label={loading ? "Guardando..." : "Guardar Cambios"}
                onClick={handleSave}
                className="w-full sm:w-auto px-4 py-2"
                disabled={loading}
>>>>>>> 2b29aaa072bfa5b81ea401657c84a67b85c5fddc:src/components/pages/administrator/EditarUsuario.jsx
              />
              <Boton
                tipo="cancelar"
                label="Descartar Cambios"
                onClick={handleCancel}
<<<<<<< HEAD:src/pages/administrator/EditarUsuario.jsx
                className="w-full sm:w-auto px-8 py-1 text-base"
                disabled={loading || !isDirty}
=======
                className="w-full sm:w-auto px-4 py-2"
                disabled={loading}
>>>>>>> 2b29aaa072bfa5b81ea401657c84a67b85c5fddc:src/components/pages/administrator/EditarUsuario.jsx
              />
            </div>
          </div>
        </div>
      </div>

      {showAlert && (
        <AlertaEdicion 
          onClose={handleCloseAlert}
          onConfirm={handleCloseAlert}
          onCancel={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default EditarUsuario;
