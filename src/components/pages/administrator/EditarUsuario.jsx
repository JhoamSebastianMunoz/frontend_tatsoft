import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "../../../context/services/ApiService";
import AvatarTexto from "../../../components/molecules/AvatarTexto";
import CampoTextoProfile from "../../../components/atoms/CamposTextoProfile";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";
import CampoTexto from "../../../components/atoms/CamposTexto";
import AlertaEdicion from "./AlertaEdicion";
import Icono from "../../../components/atoms/Iconos";
import Loading from "../../../components/Loading/Loading";
import Sidebar from '../../organisms/Sidebar';

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  };

  const handleCancel = () => {
    setUserData({...originalData});
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (success) {
      navigate(`/ver/usuario/${id}`);
    }
  };

  const handleVolver = () => {
    navigate(`/gestion/usuarios`);
  };

  const nombreStr = userData.nombre || '';
  const apellidoStr = userData.apellido || '';
  const fullName = `${nombreStr} ${apellidoStr}`.trim();

  // Verificar si hay cambios no guardados
  const isDirty = JSON.stringify(userData) !== JSON.stringify(originalData);
  
  if (loading && !userData.nombre) {
    return <Loading message="Cargando información del usuario..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6"> 
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      <div className="w-full pl-16 sm:pl-20 md:pl-24 lg:pl-28">
        <div className="max-w-5xl mx-auto">
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-white border-b-2 border-[#F78220] p-6 relative shadow-sm">
              <div className="absolute top-4 left-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleVolver}>
                <Icono name="volver" size={45} color="#F78220" />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
                  <AvatarTexto nombre={fullName} size="large" />
                </div>
                {userData.rol && (
                  <div className="px-6 py-1.5 bg-[#F78220] rounded-full shadow-sm">
                    <Tipografia className="text-white font-medium text-sm">{userData.rol}</Tipografia>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 md:p-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md mb-4">
                  <Tipografia className="text-sm">{error}</Tipografia>
                </div>
              )}
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#F78220] rounded-full"></div>
                  <Tipografia size="xl" className="font-semibold text-gray-800">
                    Editando Usuario
                  </Tipografia>
                </div>
                {isDirty && (
                  <div className="bg-[#F78220]/10 px-3 py-1 rounded-full flex items-center">
                    <div className="w-2 h-2 bg-[#F78220] rounded-full mr-2"></div>
                    <span className="text-sm text-[#F78220] font-medium">Cambios sin guardar</span>
                  </div>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-[#F78220]/30 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <Tipografia className="text-[#F78220] font-medium">
                      Información Personal
                    </Tipografia>
                  </div>
                  <div className="space-y-5">
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
                    <CampoTexto
                      label="Documento de Identidad"
                      value={userData.cc}
                      disabled={true}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-[#F78220]/30 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <Tipografia className="text-[#F78220] font-medium">
                      Información de Contacto
                    </Tipografia>
                  </div>
                  <div className="space-y-5">
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
              
              <div className="mt-6 flex flex-col sm:flex-row justify-center w-full gap-3 pb-4">
                <Boton
                  tipo="primario"
                  label={loading ? "Guardando..." : "Guardar Cambios"}
                  onClick={handleSave}
                  className="w-full sm:w-auto px-6 py-2 bg-[#F78220] hover:bg-[#e67316] text-white shadow-sm"
                  disabled={loading || !isDirty}
                />
                <Boton
                  tipo="secundario"
                  label="Cancelar Cambios"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-6 py-2 border border-gray-200 hover:border-[#F78220] text-gray-700 hover:text-[#F78220]"
                  disabled={loading || !isDirty}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showAlert && (
        <AlertaEdicion
          success={success}
          message={success ? "Los cambios se guardaron correctamente" : "Error al guardar los cambios"}
          onClose={handleCloseAlert}
        />
      )}
    </div>
  );
};

export default EditarUsuario;
