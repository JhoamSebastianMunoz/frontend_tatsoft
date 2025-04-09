import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { userService } from "../../../context/services/ApiService";
import AvatarTexto from "../../../components/molecules/AvatarTexto";
import CamposTexto from "../../../components/atoms/CamposTexto";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Loading from "../../Loading/Loading";
import Sidebar from "../../organisms/Sidebar";
import { IoArrowBack } from "react-icons/io5";

const EditarPerfil = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener la ruta anterior desde el state o usar una ruta predeterminada
  const prevPath = location.state?.from || "/perfil";
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombreCompleto: "",
    nombre: "",
    apellido: "",
    cedula: "",
    celular: "",
    correo: "",
    rol: "",
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        if (user && Object.keys(user).length > 0) {
          // Prepare the formData from user object
          const { nombre, apellido } = parseFullName(user.nombreCompleto || "");

          setFormData({
            nombreCompleto: user.nombreCompleto || "",
            nombre: nombre,
            apellido: apellido,
            cedula: user.cedula || "",
            celular: user.celular || "",
            correo: user.correo || "",
            rol: user.rol || "",
          });

          setLoading(false);
          return;
        }

        if (token) {
          const response = await userService.getUserProfile();
          if (response && response.data) {
            const userData = response.data;
            const { nombre, apellido } = parseFullName(
              userData.nombreCompleto || ""
            );

            setFormData({
              nombreCompleto: userData.nombreCompleto || "",
              nombre: nombre,
              apellido: apellido,
              cedula: userData.cedula || "",
              celular: userData.celular || "",
              correo: userData.correo || "",
              rol: userData.rol || "",
            });
          } else {
            throw new Error("No se pudo obtener la información del perfil");
          }
        } else {
          navigate("/", { replace: true });
          return;
        }
      } catch (err) {
        console.error("Error al cargar datos del perfil:", err);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      // Prepare data for submission
      const updatedUserData = {
        ...formData,
        nombreCompleto: `${formData.nombre} ${formData.apellido}`.trim(),
      };

      // Aquí iría la llamada a la API para actualizar el perfil
      // const response = await userService.updateProfile(updatedUserData);

      // Simulando una respuesta exitosa
      console.log("Datos a enviar:", updatedUserData);

      setSuccessMessage("Perfil actualizado exitosamente");
      setShowSuccessAlert(true);

      setTimeout(() => {
        setShowSuccessAlert(false);
        // Redirigir al usuario a la página anterior después de actualizar
        navigate(prevPath);
      }, 3000);
    } catch (err) {
      setError(err.message || "Error al actualizar el perfil");
      setShowErrorAlert(true);

      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  // Función para volver a la página anterior
  const handleGoBack = () => {
    navigate(prevPath);
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
            <div className="flex items-center mb-6">
              <button onClick={handleGoBack} className="mr-4">
                <IoArrowBack className="text-gray-600 text-2xl hover:text-orange-500 transition-colors" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">
                Editar Perfil
              </h1>
            </div>

            {showErrorAlert && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
                role="alert"
              >
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}

            {showSuccessAlert && (
              <div
                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded"
                role="alert"
              >
                <p className="font-medium">¡Operación exitosa!</p>
                <p>{successMessage}</p>
              </div>
            )}

            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
              <div className="p-4 md:p-6 flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 flex justify-center">
                  <AvatarTexto
                    nombre={
                      formData.nombreCompleto ||
                      `${formData.nombre} ${formData.apellido}`.trim() ||
                      "Usuario"
                    }
                    size="large"
                    showEditButton={true}
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    {formData.nombreCompleto ||
                      `${formData.nombre} ${formData.apellido}`.trim() ||
                      "Usuario"}
                  </h2>
                  <p className="text-sm md:text-base text-gray-500 mb-2">
                    {formData.correo || "Sin correo"}
                  </p>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs md:text-sm font-medium bg-blue-100 text-blue-800">
                    {formData.rol || "Sin rol asignado"}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido
                      </label>
                      <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Documento de Identidad
                      </label>
                      <input
                        type="text"
                        name="cedula"
                        value={formData.cedula}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono Móvil
                      </label>
                      <input
                        type="tel"
                        name="celular"
                        value={formData.celular}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol en el Sistema
                      </label>
                      <input
                        type="text"
                        name="rol"
                        value={formData.rol}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Botones
                      tipo="secundario"
                      label="Cancelar"
                      size="medium"
                      onClick={handleGoBack}
                      className="w-full sm:w-auto"
                    />
                    <Botones
                      tipo="primario"
                      label={submitting ? "Guardando..." : "Guardar"}
                      disabled={submitting}
                      type="submit"
                      size="medium"
                      className="w-full sm:w-auto"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Tipografia>
    </div>
  );
};

export default EditarPerfil;