import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Botones from "../../../components/atoms/Botones";
import Encabezado from "../../../components/molecules/Encabezado";
import AvatarUsuario from "../../../components/atoms/AvatarUsuario";
import Loading from "../../../components/Loading/Loading";
import Sidebar from "../../organisms/Sidebar";

const VerUsuarioAdm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nombreCompleto: "",
    cedula: "",
    celular: "",
    correo: "",
    rol: "",
    foto: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await userService.getUserById(id);
        console.log("Datos del usuario recibidos:", response.data); // Para debugging
        
        // Asegurarse de que todos los datos estén presentes
        setUserData({
          nombreCompleto: response.data.nombreCompleto || 'No especificado',
          cedula: response.data.cedula || 'No especificado',
          celular: response.data.celular || 'No especificado',
          correo: response.data.correo || 'No especificado',
          rol: response.data.rol?.toUpperCase() || 'No especificado',
          foto: response.data.foto || null
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
  }, [id]);

  // Función para separar nombre y apellido
  const getNombreApellido = () => {
    const nombreCompleto = userData.nombreCompleto || '';
    const partes = nombreCompleto.split(' ');
    return {
      nombre: partes[0] || '',
      apellido: partes.slice(1).join(' ') || ''
    };
  };

  const { nombre, apellido } = getNombreApellido();

  const handleEditarUsuario = () => {
    navigate(`/editar/usuario/${id}`);
  };

  if (loading) {
    return <Loading message="Cargando información del usuario..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 h-full w-14 sm:w-16 md:w-20 lg:w-20 z-10">
        <Sidebar />
      </div>
      <Tipografia>
      <div className="md:pl-50 pl-14 pt-0 md:pt-4">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto">
            {/* Encabezado con título y botón */}
            <div className="flex flex-col mb-6">
              <h1 className="text-xl font-semibold text-gray-900 mb-4">
                Perfil del Usuario
              </h1>
            </div>

            {error && (
              <div className="mx-4 mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {/* Tarjeta de Usuario */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  {userData.foto ? (
                    <img
                      src={userData.foto}
                      alt="Foto de perfil"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                      <AvatarUsuario 
                        size="64" 
                        nombre={userData.nombreCompleto} 
                      />
                  )}
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
                    {userData.nombreCompleto}
                  </h2>
                  <p className="text-gray-600 mb-2">{userData.correo}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                      <span className="px-3 py-1 bg-[#F78220]/10 text-[#F78220] rounded-full text-sm font-medium">
                      {userData.rol}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                  <Botones
                    label="Editar"
                    onClick={handleEditarUsuario}
                    className="w-full sm:w-auto bg-[#F78220] hover:bg-[#F78220]/90 text-white px-4 py-2 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Información Personal */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Información Personal
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      <span className="text-gray-900">{nombre}</span>
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
                      <span className="text-gray-900">{apellido}</span>
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
      </div>
      </Tipografia>
    </div>
  );
};


export default VerUsuarioAdm;
