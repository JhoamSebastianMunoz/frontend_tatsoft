import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Botones from "../../../components/atoms/Botones";
import Encabezado from "../../../components/molecules/Encabezado";
import AvatarUsuario from "../../../components/atoms/AvatarUsuario";
import AlertaInhabilitar from "./AlertaInhabilitar";
import Loading from "../../../components/Loading/Loading";

const VerUsuarioAdm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [userStatus, setUserStatus] = useState("activo");
  const [userData, setUserData] = useState({
    nombreCompleto: "",
    cedula: "",
    celular: "",
    correo: "",
    rol: "",
    foto: null,
    estado: "activo",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await userService.getUserById(id);
        setUserData({
          ...response.data,
          estado: userStatus, // Estado debe implementarse en el backend
        });
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
  }, [id, userStatus]);

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleConfirmStatusChange = async () => {
    try {
      // Aquí implementaríamos la lógica para cambiar el estado del usuario
      // Esto dependerá de cómo se maneje en el backend
      // Por ahora solo cambiamos el estado local
      const newStatus = userStatus === "activo" ? "inactivo" : "activo";
      setUserStatus(newStatus);
      setShowAlert(false);
    } catch (error) {
      console.error("Error al cambiar el estado del usuario:", error);
      setError("Error al cambiar el estado del usuario. Por favor, intenta de nuevo más tarde.");
    }
  };

  // Actualizado para incluir el parámetro de origen
  const handleEditarUsuario = () => {
    navigate(`/editar/usuario/${id}`);
    console.log("Ruta de origen guardada en localStorage: /ver/usuario");
  };

  const buttonText = userStatus === "activo" ? "Inhabilitar" : "Habilitar";
  const alertText = userStatus === "activo"
    ? "¿Confirmas la inhabilitación del usuario?"
    : "¿Confirmas la habilitación del usuario?";

  if (loading) {
    return <Loading message="Cargando información del usuario..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full bg-white shadow-sm border-b border-[#F78220]/20">
        <Encabezado ruta="/admin" mensaje="Perfil de Usuario" />
      </div>
      
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <Tipografia className="text-sm text-red-700">{error}</Tipografia>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tarjeta de perfil */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#F78220] p-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm p-1">
                  {userData.foto ? (
                    <img
                      src={userData.foto}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <AvatarUsuario size="120" />
                  )}
                </div>
                <Tipografia
                  variant="h2"
                  className="mt-4 text-white text-xl font-semibold text-center"
                >
                  {userData.nombreCompleto}
                </Tipografia>
                <span className="mt-2 px-4 py-1 bg-white/20 rounded-full text-white text-sm">
                  {userData.rol}
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className={`text-sm inline-flex items-center rounded-full px-3 py-1 font-medium
                ${userData.estado === "activo" 
                  ? "bg-green-50 text-green-700" 
                  : "bg-red-50 text-red-700"}`}>
                <span className={`w-2 h-2 rounded-full mr-2
                  ${userData.estado === "activo" 
                    ? "bg-green-400" 
                    : "bg-red-400"}`}
                />
                {userData.estado === "activo" ? "Usuario Activo" : "Usuario Inactivo"}
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <Botones
                  label="Editar Usuario"
                  onClick={handleEditarUsuario}
                  className="w-full bg-[#F78220] hover:bg-[#F78220]/90 text-white"
                />
                <Botones
                  label={buttonText}
                  tipo={userStatus === "activo" ? "cancelar" : "alerta"}
                  onClick={handleShowAlert}
                  className="w-full border border-[#F78220] text-[#F78220] hover:bg-[#F78220]/5"
                />
              </div>
            </div>
          </div>

          {/* Información detallada */}
          <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-sm p-8">
            <Tipografia variant="h2" className="text-xl font-semibold mb-6 text-gray-900">
              Información Personal
            </Tipografia>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <Tipografia className="text-sm text-gray-500 mb-1">Nombre Completo</Tipografia>
                  <Tipografia className="text-base font-medium text-gray-900">{userData.nombreCompleto}</Tipografia>
                </div>
                
                <div>
                  <Tipografia className="text-sm text-gray-500 mb-1">Número de Documento</Tipografia>
                  <Tipografia className="text-base font-medium text-gray-900">{userData.cedula}</Tipografia>
                </div>
                
                <div>
                  <Tipografia className="text-sm text-gray-500 mb-1">Teléfono</Tipografia>
                  <Tipografia className="text-base font-medium text-gray-900">{userData.celular}</Tipografia>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Tipografia className="text-sm text-gray-500 mb-1">Correo Electrónico</Tipografia>
                  <Tipografia className="text-base font-medium text-gray-900">{userData.correo}</Tipografia>
                </div>
                
                <div>
                  <Tipografia className="text-sm text-gray-500 mb-1">Rol del Usuario</Tipografia>
                  <Tipografia className="text-base font-medium text-gray-900">{userData.rol}</Tipografia>
                </div>
                
                <div>
                  <Tipografia className="text-sm text-gray-500 mb-1">Fecha de Registro</Tipografia>
                  <Tipografia className="text-base font-medium text-gray-900">
                    {userData.fechaRegistro || "No disponible"}
                  </Tipografia>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertaInhabilitar
        isOpen={showAlert}
        onClose={handleCloseAlert}
        onConfirm={handleConfirmStatusChange}
        message={alertText}
      />

      {loading && <Loading message="Cargando información del usuario..." />}
    </div>
  );
};

export default VerUsuarioAdm;
