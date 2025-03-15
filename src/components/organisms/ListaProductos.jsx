import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../context/services/ApiService";
import CampoTexto from "../atoms/CamposTexto";
import Botones from "../atoms/Botones";
import Tipografia from "../atoms/Tipografia";
import Loading from "../Loading/Loading";

const FormularioUsuario = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    numeroCelular: "",
    correoElectronico: "",
    rol: "",
    contrasena: "",
    confirmarContraseña: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (formData.contrasena !== formData.confirmarContraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validar que todos los campos obligatorios estén completos
    const requiredFields = ["nombre", "apellido", "cedula", "numeroCelular", "correoElectronico", "rol", "contrasena"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`El campo ${field} es obligatorio`);
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      // Preparar los datos en el formato esperado por la API
      const userData = {
        cedula: formData.cedula,
        nombreCompleto: `${formData.nombre} ${formData.apellido}`.trim(),
        celular: formData.numeroCelular,
        correo: formData.correoElectronico,
        contrasena: formData.contrasena,
        rol: formData.rol.toLowerCase()
      };

      // Realizar la petición al backend
      await userService.createUser(userData);
      
      setSuccess(true);
      
      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate("/gestion/usuarios");
      }, 2000);
      
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Error al registrar el usuario");
      } else {
        setError("Error de conexión. Por favor, intente nuevamente más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Procesando registro..." />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-5 bg-white rounded-lg shadow-md"
      >
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
            <p>Usuario registrado exitosamente. Redirigiendo...</p>
          </div>
        )}

        <Tipografia variant="p" className="text-[#000000]">
          <CampoTexto
            label="Nombre"
            id="nombre"
            type="text"
            placeholder="Ingrese el nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <CampoTexto
            label="Apellido"
            id="apellido"
            type="text"
            placeholder="Ingrese el apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
          <CampoTexto
            label="Cédula"
            id="cedula"
            type="text"
            placeholder="Ingrese la cédula"
            value={formData.cedula}
            onChange={handleChange}
            required
          />
          <CampoTexto
            label="Número de Celular"
            id="numeroCelular"
            type="text"
            placeholder="Ingrese el número de celular"
            value={formData.numeroCelular}
            onChange={handleChange}
            required
          />
          <CampoTexto
            label="Correo Electrónico"
            id="correoElectronico"
            type="email"
            placeholder="Ingrese el correo electrónico"
            value={formData.correoElectronico}
            onChange={handleChange}
            required
          />
          <div className="mb-3 w-full max-w-xs sm:max-w-sm md:max-w-md">
            <label
              htmlFor="rol"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Rol
            </label>
            <select
              id="rol"
              value={formData.rol}
              onChange={handleChange}
              className="bg-purple-50 border border-purple-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:border-purple-500 focus:ring-purple-500 block w-full p-1"
              required
            >
              <option value="">Seleccione un rol</option>
              <option value="administrador">Administrador</option>
              <option value="colaborador">Colaborador</option>
            </select>
          </div>
          <CampoTexto
            label="Contraseña"
            id="contrasena"
            type="password"
            placeholder="Ingrese la contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
          <CampoTexto
            label="Confirmar Contraseña"
            id="confirmarContraseña"
            type="password"
            placeholder="Ingrese la contraseña de confirmación"
            value={formData.confirmarContraseña}
            onChange={handleChange}
            required
          />
          <div className="flex justify-center mt-4">
            <Botones 
              label={loading ? "Registrando..." : "Registrar"} 
              tipo="primario" 
              type="submit"
              disabled={loading}
            />
          </div>
        </Tipografia>
      </form>
    </div>
  );
};

export default FormularioUsuario;