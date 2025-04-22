import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { userService } from "../../../context/services/ApiService";
import AvatarTexto from "../../../components/molecules/AvatarTexto";
import CamposTexto from "../../../components/atoms/CamposTexto";
import Tipografia from "../../../components/atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Loading from "../../Loading/Loading";
import Sidebar from "../../organisms/Sidebar";

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

  const [userZonas, setUserZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const esAdministrador = user && user.rol === "ADMINISTRADOR";

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        if (user && Object.keys(user).length > 0) {
          setUserData(user);

          if (user.rol === "COLABORADOR") {
            try {
              const zonasResponse = await userService.getUserOwnZonas();
              if (
                zonasResponse &&
                zonasResponse.data &&
                zonasResponse.data.zonas
              ) {
                setUserZonas(zonasResponse.data.zonas);
              }
            } catch (zonasError) {
              console.error("Error al cargar zonas del usuario:", zonasError);
            }
          }

          setLoading(false);
          return;
        }

        if (token) {
          const response = await userService.getUserProfile();
          if (response && response.data) {
            setUserData(response.data);

            if (response.data.rol === "COLABORADOR") {
              try {
                const zonasResponse = await userService.getUserOwnZonas();
                if (
                  zonasResponse &&
                  zonasResponse.data &&
                  zonasResponse.data.zonas
                ) {
                  setUserZonas(zonasResponse.data.zonas);
                }
              } catch (zonasError) {
                console.error("Error al cargar zonas del usuario:", zonasError);
              }
            }
          } else {
            throw new Error("No se pudo obtener la información del perfil");
          }
        } else {
          navigate("/", { replace: true });
          return;
        }
      } catch (error) {
        console.error("Error al cargar datos del perfil:", error);
        setError(
          "Error al cargar información del perfil. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, token, navigate]);

  const parseFullName = (fullName) => {
    if (!fullName) return { nombre: "", apellido: "" };
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return { nombre: parts[0], apellido: "" };
    const nombre = parts[0];
    const apellido = parts.slice(1).join(" ");
    return { nombre, apellido };
  };

  const { nombre, apellido } = parseFullName(userData.nombreCompleto);
  const [isEditing, setIsEditing] = useState(false);

  const handleZonasClick = () => {
    // Redirección basada en el rol del usuario
    if (userData.rol === "COLABORADOR") {
      navigate("/mis-zonas");
    } else {
      // Por defecto o para ADMINISTRADOR
      navigate("/zonas");
    }
  };

  const handleActualizarClick = () => {
    // Aquí puedes agregar la lógica para actualizar el perfil
    alert("Actualizar información del perfil");
  };

  if (loading) {
    return <Loading message="Cargando información del perfil..." />;
  }

  return (
    <div className="min-h-screen bg-slate-100 overflow-x-hidden">
      <Tipografia>
        <div className="fixed top-0 left-0 z-50 h-full ml-64">
          <Sidebar />
        </div>
        <div className="flex justify-center px-4 py-6 pt-5 transition-all duration-300 ml-16">
          <div className="w-full max-w-4xl">
            {error && (
              <div
                className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded mb-6"
                role="alert"
              >
                <div className="flex items-center">
                  <Icono className="mr-2" name="eliminarAlert" size={20} />
                  <p>{error}</p>
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
              <div className="p-4 md:p-6 flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 flex justify-center">
                  <AvatarTexto
                    nombre={userData.nombreCompleto || "Usuario"}
                    size="large"
                    showEditButton={true}
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                    {userData.nombreCompleto || "Usuario"}
                  </h1>
                  <p className="text-sm md:text-base text-gray-500 mb-2">
                    {userData.correo || "Sin correo"}
                  </p>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs md:text-sm font-medium bg-blue-100 text-blue-800">
                    {userData.rol || "Sin rol asignado"}
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  {esAdministrador && (
                    <Botones
                      label="Editar Perfil"
                      onClick={() => navigate("/editar/perfil")}
                      className="w-full sm:w-auto"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="border-b border-gray-200">
                  <div className="px-4 md:px-6 py-3 md:py-4">
                    <h2 className="text-base md:text-lg font-medium text-gray-800">
                      Información Personal
                    </h2>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <CamposTexto
                        label="Nombre"
                        value={nombre}
                        readOnly={!isEditing}
                        icon="user"
                      />
                    </div>
                    <div>
                      <CamposTexto
                        label="Apellido"
                        value={apellido}
                        readOnly={!isEditing}
                        icon="user"
                      />
                    </div>
                    <div>
                      <CamposTexto
                        label="Documento de Identidad"
                        value={userData.cedula || "No disponible"}
                        readOnly={!isEditing}
                        icon="id-card"
                      />
                    </div>
                    <div>
                      <CamposTexto
                        label="Teléfono Móvil"
                        value={userData.celular || "No disponible"}
                        readOnly={!isEditing}
                        icon="phone"
                      />
                    </div>
                    <div>
                      <CamposTexto
                        label="Correo Electrónico"
                        value={userData.correo || "No disponible"}
                        readOnly={!isEditing}
                        icon="mail"
                      />
                    </div>
                    <div>
                      <CamposTexto
                        label="Rol en el Sistema"
                        value={userData.rol || "No disponible"}
                        readOnly={true}
                        icon="badge"
                      />
                    </div>
                  </div>
                  <div className="mt-4 md:mt-6 flex flex-col items-center justify-center">
                    <div className="w-full sm:w-64">
                      <Botones
                        onClick={handleZonasClick}
                        tipo="primario"
                        label="Ir a Zonas de Trabajo"
                        size="small"
                        fullWidth={true}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {userData.rol === "COLABORADOR" && userZonas.length > 0 && (
                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="border-b border-gray-200">
                    <div className="px-4 md:px-6 py-3 md:py-4">
                      <h2 className="text-base md:text-lg font-medium text-gray-800">
                        Zonas Asignadas
                      </h2>
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {userZonas.map((zona, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 md:p-3 border border-gray-200 rounded-lg bg-gray-50"
                        >
                          <svg
                            className="h-4 w-4 md:h-5 md:w-5 text-[#F78220] mr-2 flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="text-sm md:text-base text-gray-700 truncate">
                            {zona.nombre_zona_trabajo}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Tipografia>
    </div>
  );
};

export default Profile;
