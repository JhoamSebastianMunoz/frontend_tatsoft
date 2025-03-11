import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { userService } from "../../../context/services/ApiService";
import AvatarTexto from "../../../components/molecules/AvatarTexto";
import CampoTextoProfile from "../../../components/atoms/CamposTextoProfile";
import Tipografia from "../../../components/atoms/Tipografia";
import Encabezado from "../../../components/molecules/Encabezado";
import NavegacionUsuario from "../../../components/organisms/NavegacionUsuario";

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
        
        // Si ya tenemos los datos del usuario en el contexto de autenticación, los usamos
        if (user) {
          setUserData(user);
          setLoading(false);
          return;
        }
        
        // Si no, los obtenemos del API
        if (token) {
          const response = await userService.getUserProfile();
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error al cargar datos del perfil:", error);
        setError("Error al cargar información del perfil. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, token]);

  // Dividir el nombre completo para mostrar nombre y apellido por separado
  const fullNameParts = userData.nombreCompleto ? userData.nombreCompleto.split(" ") : ["", ""];
  const nombre = fullNameParts[0] || "";
  const apellido = fullNameParts.slice(1).join(" ") || "";

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Tipografia>Cargando información del perfil...</Tipografia>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="relative z-50">
        <Encabezado 
          className="py-4 md:py-4"
          mensaje="Mi Perfil"
          icono="volver"
          ruta="/"
        />
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 bg-white shadow-sm">
          <div className="py-6 border-b border-gray-100 shadow-md flex items-center justify-center">
            <Tipografia size="xl" className="font-semibold text-gray-800">
              Mi cuenta
            </Tipografia>
          </div>
          <NavegacionUsuario />
        </div>

        <div className="flex-1 p-4 md:p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-purple-700 p-5 flex flex-col items-center">
                <div className="mb-1">
                  <AvatarTexto nombre={userData.nombreCompleto} size="medium" />
                </div>
                <Tipografia
                  size="2xl"
                  className="text-white font-semibold mb-1"
                >
                  {userData.nombreCompleto}
                </Tipografia>
                <Tipografia className="text-purple-200">{userData.rol}</Tipografia>
              </div>

              <div className="p-4 md:p-7">
                <div className="grid md:grid-cols-2 gap-7">
                  <div>
                    <div className="p-4 rounded-lg">
                      <Tipografia className="text-sm text-gray-500 mb-4 font-medium">
                        Información Personal
                        <div className="space-y-4 mt-1">
                          <CampoTextoProfile 
                            label="Nombre"
                            value={nombre}
                            readOnly={true}
                          />
                          <CampoTextoProfile 
                            label="Apellido"
                            value={apellido}
                            readOnly={true}
                          />
                          <CampoTextoProfile 
                            label="CC"
                            value={userData.cedula}
                            readOnly={true}
                          />
                        </div>
                      </Tipografia>
                    </div>
                  </div>

                  <div>
                    <div className="p-4 rounded-lg">
                      <Tipografia className="text-sm text-gray-500 mb-4 font-medium">
                        Información de Contacto
                        <div className="space-y-4 mt-1">
                          <CampoTextoProfile 
                            label="Celular"
                            value={userData.celular}
                            readOnly={true}
                          />
                          <CampoTextoProfile 
                            label="Correo"
                            value={userData.correo}
                            readOnly={true}
                          />
                          <CampoTextoProfile 
                            label="Rol"
                            value={userData.rol}
                            readOnly={true}
                          />
                        </div>
                      </Tipografia>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => navigate("/zonas")}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg"
                  >
                    Ir a Zonas de Trabajo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;