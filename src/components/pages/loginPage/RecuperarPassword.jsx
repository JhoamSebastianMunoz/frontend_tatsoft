import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";
import CampoTexto from "../../../components/atoms/CamposTexto";
import Icono from "../../../components/atoms/Iconos";

const OlvidarPassword = () => {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor, ingresa tu correo electrónico");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const success = await requestPasswordReset(email);
      if (success) {
        setSuccess(true);
        // Guardar el correo en sessionStorage para usarlo en los siguientes pasos
        sessionStorage.setItem("resetEmail", email);
        setTimeout(() => navigate("/codigo-verificacion"), 1500);
      } else {
        setError("No pudimos encontrar una cuenta con ese correo electrónico");
      }
    } catch (error) {
      console.error("Error al solicitar recuperación:", error);
      setError("Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tipografia>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white relative px-6 sm:px-10">
        <div className="absolute top-5 left-5 sm:left-7">
          <Icono
            name="volver"
            customColor="black"
            size={40}
            className="cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 p-2">Recuperar Contraseña</h1>
          <p className="text-gray-600 text-sm sm:text-base mb-5">
            ¿Oops! <span className="font-semibold">¿Olvidaste la contraseña?</span>
            <br />
            Por favor, introduce tu dirección de correo electrónico y te
            enviaremos un código de verificación.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              ¡Código enviado! Redirigiendo...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="relative w-full flex items-center">
              <Icono
                name="correo"
                className="absolute left-3 sm:left-3 top-5 transform -translate-y-1/2 text-gray-400"
              />
              <CampoTexto
                type="email"
                id="email"
                placeholder="Correo electrónico"
                className="w-full pl-11 pr-4 py-2 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Boton
              label={loading ? "Enviando..." : "Continuar"}
              onClick={handleSubmit}
              className="mt-4 w-full"
              disabled={loading}
              type="submit"
            />
          </form>
        </div>

        <footer className="absolute bottom-4 text-gray-500 text-xs sm:text-sm">
          © TatSoft 2025 
        </footer>
      </div>
    </Tipografia>
  );
};

export default OlvidarPassword;
