import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";
import Icono from "../../../components/atoms/Iconos";
import CampoTexto from "../../../components/atoms/CamposTexto";
import AlertaRestablecer from "./AlertaRestablecer";

const Restablecer = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);

  useEffect(() => {
    // Recuperar el correo electrónico de sessionStorage
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      navigate("/recuperar-password");
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  // Función para validar la contraseña
  const validatePassword = (password) => {
    const errors = [];
    
    // Validar longitud mínima (8 caracteres)
    if (password.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres");
    }
    
    // Validar que contenga al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
      errors.push("Al menos una letra mayúscula");
    }
    
    // Validar que contenga al menos una letra minúscula
    if (!/[a-z]/.test(password)) {
      errors.push("Al menos una letra minúscula");
    }
    
    // Validar que contenga al menos un número
    if (!/\d/.test(password)) {
      errors.push("Al menos un número");
    }
    
    // Validar que contenga al menos un carácter especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Al menos un carácter especial");
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    // Validar contraseña en tiempo real
    if (id === "password") {
      const validation = validatePassword(value);
      setPasswordErrors(validation.errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validar la complejidad de la contraseña
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError("La contraseña no cumple con los requisitos de seguridad");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const success = await resetPassword(email, formData.password);
      if (success) {
        setMostrarAlerta(true);
      } else {
        setError("No se pudo restablecer la contraseña. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      setError("Ocurrió un error al restablecer la contraseña. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Verificar si la confirmación de contraseña coincide
  const passwordsMatch = formData.confirmPassword ? 
    formData.password === formData.confirmPassword : 
    true;

  // Determinar si el botón de guardar debe estar deshabilitado
  const isSubmitDisabled = loading || 
    passwordErrors.length > 0 || 
    !formData.password || 
    !formData.confirmPassword || 
    !passwordsMatch;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 sm:px-10">
      <Tipografia>
        <div className="absolute top-5 left-7 sm:left-10">
          <Icono
            name="volver"
            customColor="black"
            size={40}
            className="cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            Restablecer contraseña
          </h1>
          <p className="text-gray-600 mb-5 text-sm sm:text-base">
            Crea una nueva contraseña para tu cuenta. Asegúrate de que sea
            segura y distinta a contraseñas usadas antes.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="relative mb-4">
            <div className="relative mb-4">
            <Icono
              name="candado"
              className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-400"
            />
            <CampoTexto
              type="password"
              id="password"
              label="Nueva contraseña"
              className="pl-10 pr-4 py-2 border rounded-lg w-full text-sm sm:text-base"
              value={formData.password}
              onChange={handleChange}
              required
            />
            </div>
            
            
            {formData.password && passwordErrors.length > 0 && (
              <div className="mt-2 bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-700 font-medium">La contraseña debe contener:</p>
                <ul className="mt-1 text-xs text-gray-600 space-y-1">
                  {passwordErrors.map((error, index) => (
                    <li key={index} className="flex items-center text-red-600">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="relative mb-6">
            <Icono
              name="candado"
              className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-400"
            />
            <CampoTexto
              type="password"
              id="confirmPassword"
              label="Confirmar contraseña"
              className={`pl-10 pr-4 py-2 border rounded-lg w-full text-sm sm:text-base ${
                !passwordsMatch && formData.confirmPassword ? "border-red-500" : ""
              }`}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {!passwordsMatch && formData.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">Las contraseñas no coinciden</p>
            )}
          </div>

          <div className="flex justify-center">
            <Boton
              label={loading ? "Guardando..." : "Guardar"}
              className="w-full max-w-xs sm:max-w-sm"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              type="submit"
            />
          </div>
        </form>
      </Tipografia>

      {mostrarAlerta && <AlertaRestablecer onClose={() => {
        setMostrarAlerta(false);
        sessionStorage.removeItem("resetEmail");
        navigate("/");
      }} />}
    </div>
  );
};

export default Restablecer;