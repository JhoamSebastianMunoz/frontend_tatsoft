import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../context/services/ApiService";
import Encabezado from "../../../components/molecules/Encabezado";
import Tipografia from "../../../components/atoms/Tipografia";
import CampoTexto from "../../../components/atoms/CamposTexto";
import Boton from "../../../components/atoms/Botones";

const RegistroUsuario = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    numeroCelular: "",
    correoElectronico: "",
    rol: "",
    password: "",
    confirmarPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validar la complejidad de la contraseña
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Formato de los datos para la API
      const userData = {
        cedula: formData.cedula,
        nombreCompleto: `${formData.nombre} ${formData.apellido}`.trim(),
        celular: formData.numeroCelular,
        correo: formData.correoElectronico,
        contrasena: formData.password,
        rol: formData.rol.toLowerCase()
      };
      
      // Llamada a la API para crear el usuario
      await userService.createUser(userData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Error al registrar el usuario. Por favor, inténtalo de nuevo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="w-full max-w-md">
        <div className="w-screen absolute left-0 right-0">
          <Encabezado mensaje="Registro de usuario" />
        </div>
        <div className="p-5 pt-20">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Usuario registrado con éxito. Redirigiendo...
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tipografia>
              <CampoTexto
                type="text"
                name="nombre"
                label="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                required
              />
              <CampoTexto
                type="text"
                name="apellido"
                label="Apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                required
              />
              <CampoTexto
                type="text"
                name="cedula"
                label="Número de identificación"
                value={formData.cedula}
                onChange={handleChange}
                className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                required
              />
              <CampoTexto
                type="tel"
                name="numeroCelular"
                label="Teléfono celular"
                value={formData.numeroCelular}
                onChange={handleChange}
                className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                required
              />
              <CampoTexto
                type="email"
                name="correoElectronico"
                label="Correo electrónico"
                value={formData.correoElectronico}
                onChange={handleChange}
                className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                required
              />
              <div className="relative">
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 pb-2 appearance-none focus:border-purple-500 focus:outline-none"
                  required
                >
                  <option value="">Seleccionar rol</option>
                  <option value="COLABORADOR">Colaborador</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <CampoTexto
                type="password"
                name="password"
                label="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                required
              />
              <CampoTexto
                label="Confirmar contraseña"
                type="password"
                name="confirmarPassword"
                value={formData.confirmarPassword}
                onChange={handleChange}
                className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                required
              />
            </Tipografia>
            <div className="flex justify-center">
              <Boton 
                tipo="secundario" 
                label={loading ? "Registrando..." : "Registrar"} 
                type="submit"
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroUsuario;