import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { userService } from "../../../context/services/ApiService";
import AvatarTexto from "../../../components/molecules/AvatarTexto";
import CampoTextoProfile from "../../../components/atoms/CamposTextoProfile";
import Tipografia from "../../../components/atoms/Tipografia";
import Encabezado from "../../../components/molecules/Encabezado";
import Boton from "../../atoms/Botones";
import Sidebar from "../../organisms/SidebarAdm";

const Profile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nombreCompleto: "",
    cedula: "",
    celular: "",
    correo: "",
    rol: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Verificamos si tenemos datos de usuario en el contexto
        if (user && Object.keys(user).length > 0) {
          setUserData(user);
          setLoading(false);
          return;
        }
        
        // Si no hay datos en contexto pero hay token, consultamos la API
        if (token) {
          const response = await userService.getUserProfile();
          if (response && response.data) {
            setUserData(response.data);
          } else {
            throw new Error("No se pudo obtener la información del perfil");
          }
        } else {
          // Redirección a login si no hay token
          navigate("/login", { replace: true });
          return;
        }
      } catch (error) {
        console.error("Error al cargar datos del perfil:", error);
        setError("Error al cargar información del perfil. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, token, navigate]);

  // Función para dividir el nombre correctamente
  const parseFullName = (fullName) => {
    if (!fullName) return { nombre: "", apellido: "" };
    
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return { nombre: parts[0], apellido: "" };
    
    // Asumimos que el primer nombre es el primer elemento y el resto son apellidos
    const nombre = parts[0];
    const apellido = parts.slice(1).join(" ");
    
    return { nombre, apellido };
  };

  const { nombre, apellido } = parseFullName(userData.nombreCompleto);

  // Estados para la funcionalidad de edición (preparación para futuras implementaciones)
  const [isEditing, setIsEditing] = useState(false);
  
  // Función para manejar el click en el avatar - este es un placeholder
  const handleEditAvatar = () => {
    console.log("Editar avatar");
    // Implementar lógica para editar avatar
  };

  // Componente de carga
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-3"></div>
          <Tipografia>Cargando información del perfil...</Tipografia>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="fixed top-0 left-0 z-50">
        <Sidebar  />
      </div>
      <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
        <Encabezado 
          className="py-4 md:py-3"
          mensaje="Mi Perfil"
        />
      </div>

      {/* Contenedor principal centrado sin respetar el sidebar */}
      <div className="flex justify-center px-4 py-6 pt-20 transition-all duration-300">
        <div className="w-full max-w-3xl">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">

            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5">
              <div className="flex justify-center mb-6">
                <AvatarTexto 
                  nombre={userData.nombreCompleto || "Usuario"} 
                  size="large" 
                  
                  showEditButton={true}
                  onEditClick={handleEditAvatar} 
                />
              </div>
            
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <div className="inline-flex items-center bg-purple-800 bg-opacity-50 px-4 py-2 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    <Tipografia className="text-white">{userData.rol || "Sin rol asignado"}</Tipografia>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center"
                    disabled={true} // Deshabilitado temporalmente hasta implementar la funcionalidad de edición
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Editar Perfil
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div>
                  <div className="bg-purple-50 p-4 md:p-5 rounded-lg">
                    <Tipografia className="text-purple-800 font-semibold mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Información Personal
                    </Tipografia>
                    <div className="space-y-4">
                      <CampoTextoProfile 
                        label="Nombre"
                        value={nombre}
                        readOnly={!isEditing}
                        icon="user"
                      />
                      <CampoTextoProfile 
                        label="Apellido"
                        value={apellido}
                        readOnly={!isEditing}
                        icon="user"
                      />
                      <CampoTextoProfile 
                        label="Documento de Identidad"
                        value={userData.cedula || "No disponible"}
                        readOnly={!isEditing}
                        icon="id-card"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-100 p-4 md:p-5 rounded-lg">
                    <Tipografia className="text-indigo-800 font-semibold mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Información de Contacto
                    </Tipografia>
                    <div className="space-y-4">
                      <CampoTextoProfile 
                        label="Teléfono Móvil"
                        value={userData.celular || "No disponible"}
                        readOnly={!isEditing}
                        icon="phone"
                      />
                      <CampoTextoProfile 
                        label="Correo Electrónico"
                        value={userData.correo || "No disponible"}
                        readOnly={!isEditing}
                        icon="mail"
                      />
                      <CampoTextoProfile 
                        label="Rol en el Sistema"
                        value={userData.rol || "No disponible"}
                        readOnly={true}
                        icon="badge"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Boton
                  onClick={() => navigate("/zonas")}
                  tipo="secundario"
                  label="Ir a Zonas de Trabajo"
                  size="large"
                  iconName="location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;