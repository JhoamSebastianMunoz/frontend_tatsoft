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

  useEffect(() => {
    // Recuperar el correo electrónico de sessionStorage
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      navigate("/recuperar-password");
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
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
          <div className="relative mb-6">
            <Icono
              name="candado"
              className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-400"
            />
            <CampoTexto
              type="password"
              id="confirmPassword"
              label="Confirmar contraseña"
              className="pl-10 pr-4 py-2 border rounded-lg w-full text-sm sm:text-base"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-center">
            <Boton
              label={loading ? "Guardando..." : "Guardar"}
              className="w-full max-w-xs sm:max-w-sm"
              onClick={handleSubmit}
              disabled={loading}
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