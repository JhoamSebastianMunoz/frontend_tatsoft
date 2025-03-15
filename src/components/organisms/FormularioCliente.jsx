import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CampoTexto from "../atoms/CamposTexto";
import Botones from "../atoms/Botones";
import Tipografia from "../atoms/Tipografia";
import { clientService } from "../../context/services/ApiService";
import { useAuth } from "../../context/AuthContext";

/**
 * Componente para el formulario de registro de clientes
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSubmitSuccess - Función a llamar cuando el formulario es enviado exitosamente (opcional)
 * @param {Object} props.initialData - Datos iniciales para el formulario (opcional)
 * @param {number} props.zonaId - ID de la zona a la que pertenece el cliente (opcional)
 */
const FormularioCliente = ({ onSubmitSuccess, initialData, zonaId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    razonSocial: "",
    nombre_completo_cliente: "",
    direccion: "",
    telefono: "",
    rut_nit: "",
    correo: "",
    id_zona_de_trabajo: zonaId || ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Si hay datos iniciales, actualizar el formulario
  useEffect(() => {
    if (initialData) {
      setFormData(prevState => ({
        ...prevState,
        ...initialData
      }));
    }
  }, [initialData]);

  /**
   * Manejar cambios en los campos del formulario
   * @param {Object} e - Evento de cambio
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  /**
   * Enviar el formulario
   * @param {Object} e - Evento de formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      let response;
      const clientData = {
        ...formData,
        estado: "Activo" // Por defecto, los clientes se crean activos
      };
      
      // Determinar si es un colaborador o administrador
      if (user && user.rol === "COLABORADOR") {
        // Los colaboradores envían solicitudes que deben ser aprobadas
        response = await clientService.requestCreateClient(clientData);
      } else {
        // Los administradores crean clientes directamente
        response = await clientService.createClient(clientData);
      }
      
      setSuccess(true);
      
      // Llamar a la función de éxito si existe
      if (onSubmitSuccess) {
        onSubmitSuccess(response.data);
      }
      
      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate("/gestion/clientes");
      }, 2000);
      
    } catch (err) {
      console.error("Error al registrar cliente:", err);
      
      // Manejar errores específicos
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Error al registrar el cliente");
      } else {
        setError("Error de conexión. Por favor, intente nuevamente más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

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
            <p>Cliente registrado exitosamente. Redirigiendo...</p>
          </div>
        )}
        
        <Tipografia variant="p" className="text-[#000000]">
          <CampoTexto
            label="Razón Social"
            id="razonSocial"
            type="text"
            placeholder="Ejemplo: ABC S.A.S"
            value={formData.razonSocial}
            onChange={handleChange}
          />
          
          <CampoTexto
            label="Nombre Completo"
            id="nombre_completo_cliente"
            type="text"
            placeholder="Ingrese el nombre completo del cliente"
            value={formData.nombre_completo_cliente}
            onChange={handleChange}
            required
          />
          
          <CampoTexto
            label="Dirección"
            id="direccion"
            type="text"
            placeholder="Ingrese la dirección del cliente"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
          
          <CampoTexto
            label="Teléfono"
            id="telefono"
            type="text"
            placeholder="Ingrese el número de teléfono del cliente"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
          
          <CampoTexto
            label="NIT/RUT"
            id="rut_nit"
            type="text"
            placeholder="Ingrese el NIT o RUT del cliente"
            value={formData.rut_nit}
            onChange={handleChange}
          />
          
          <CampoTexto
            label="Correo Electrónico"
            id="correo"
            type="email"
            placeholder="Ingrese el correo electrónico del cliente"
            value={formData.correo}
            onChange={handleChange}
          />
          
          {/* Campo oculto para la zona si se proporcionó */}
          {zonaId && (
            <input 
              type="hidden" 
              id="id_zona_de_trabajo" 
              value={zonaId}
            />
          )}
          
          {/* Mostrar selector de zona solo si no se proporcionó una zona */}
          {!zonaId && (
            <CampoTexto
              label="Zona de Trabajo"
              id="id_zona_de_trabajo"
              type="text"
              placeholder="Ingrese el ID de la zona de trabajo"
              value={formData.id_zona_de_trabajo}
              onChange={handleChange}
            />
          )}
        </Tipografia>
        
        <div className="flex justify-center mt-3">
          <Botones 
            label={loading ? "Registrando..." : "Registrar"} 
            tipo="primario" 
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default FormularioCliente;