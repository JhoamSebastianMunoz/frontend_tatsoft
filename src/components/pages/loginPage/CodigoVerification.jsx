import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";
import Icono from "../../../components/atoms/Iconos";

const CodigoVerificacion = () => {
  const navigate = useNavigate();
  const { validateResetCode } = useAuth();
  const [codigo, setCodigo] = useState(["", "", "", ""]);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
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

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const nuevoCodigo = [...codigo];
    nuevoCodigo[index] = value;
    setCodigo(nuevoCodigo);

    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = codigo.join("");
    
    if (fullCode.length !== 4) {
      setError("Por favor, ingresa el código completo de 4 dígitos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const success = await validateResetCode(email, fullCode);
      if (success) {
        navigate("/restablecer");
      } else {
        setError("Código inválido. Por favor, verifica e intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al validar código:", error);
      setError("Ocurrió un error al validar el código. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    // Implementar lógica para reenviar el código
    alert("Funcionalidad de reenvío de código pendiente");
  };

  return (
    <Tipografia>
      <div className="flex flex-col items-center justify-center h-screen bg-white relative">
        <div className="absolute top-5 left-7">
          <Icono
            name="volver"
            customColor="black"
            size={40}
            className="cursor-pointer"
            onClick={() => navigate("/recuperar-password")}
          />
        </div>
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-6 p-3">
            Introduce tu código de verificación
          </h1>
          <p className="text-black-600 mb-7 p-3">
            Hemos enviado un código de verificación de <span className="font-semibold">4</span> dígitos a tu correo
            electrónico. Por favor, ingrésalo a continuación para continuar con
            la recuperación de tu contraseña.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-end w-full pr-3 mb-5">
            <p className="text-black-800 text-sm p-1">
              ¿No recibiste el código?{" "}
              <span 
                className="font-semibold cursor-pointer text-purple-800"
                onClick={handleResendCode}
              >
                Reenviar
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex space-x-6 justify-center mb-6">
              {codigo.map((num, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength="1"
                  value={num}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-xl border-2 border-purple-200 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ))}
            </div>

            <Boton 
              label={loading ? "Verificando..." : "Verificar código"}
              onClick={handleSubmit}
              disabled={loading}
              type="submit"
            />
          </form>
        </div>

        <footer className="absolute bottom-6 text-gray-500 text-sm">
          © TatSoft 2024 | Desarrollado por TatSoft
        </footer>
      </div>
    </Tipografia>
  );
};

export default CodigoVerificacion;