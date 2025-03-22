import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Botones from "../../../components/atoms/Botones";
import Encabezado from "../../../components/molecules/Encabezado";
import AvatarUsuario from "../../../components/atoms/AvatarUsuario";
import AlertaInhabilitar from "./AlertaInhabilitar";
import Loading from "../../../components/Loading/Loading";
import Sidebar from "../../organisms/Sidebar";

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
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 h-full">
        <Sidebar />
      </div>

      <div className="pl-[280px] pr-8 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Tarjeta de Usuario */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {userData.foto ? (
                  <img
                    src={userData.foto}
                    alt="Foto de perfil"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <AvatarUsuario size="64" />
                )}
              </div>
              
              <div className="flex-grow">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                  {userData.nombreCompleto}
                </h2>
                <p className="text-gray-600 mb-2">{userData.correo}</p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {userData.rol}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userData.estado === "activo" 
                      ? "bg-green-50 text-green-700" 
                      : "bg-red-50 text-red-700"
                  }`}>
                    {userData.estado === "activo" ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Botones
                  label="Editar"
                  onClick={handleEditarUsuario}
                  className="bg-[#F78220] hover:bg-[#F78220]/90 text-white px-4 py-2 rounded-lg"
                />
                <Botones
                  label={buttonText}
                  tipo={userStatus === "activo" ? "secundario" : "alerta"}
                  onClick={handleShowAlert}
                  className="border border-[#F78220] text-[#F78220] hover:bg-[#F78220]/5 px-4 py-2 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Información Personal
            </h3>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Nombre
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5">
                  <span className="text-gray-400 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <span className="text-gray-900">{userData.nombreCompleto?.split(' ')[0]}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Apellido
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5">
                  <span className="text-gray-400 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <span className="text-gray-900">{userData.nombreCompleto?.split(' ')[1]}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Documento de Identidad
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5">
                  <span className="text-gray-400 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </span>
                  <span className="text-gray-900">{userData.cedula}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Teléfono Móvil
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5">
                  <span className="text-gray-400 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span className="text-gray-900">{userData.celular}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Correo Electrónico
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5">
                  <span className="text-gray-400 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className="text-gray-900">{userData.correo}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Rol en el Sistema
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5">
                  <span className="text-gray-400 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </span>
                  <span className="text-gray-900">{userData.rol}</span>
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
