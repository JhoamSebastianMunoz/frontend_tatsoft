import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Tipografia from "../../../components/atoms/Tipografia";
import Logo from "../../../components/atoms/Logo";
import CamposTexto from "../../../components/atoms/CamposTexto";
import Botones from "../../../components/atoms/Botones";
import { BallTriangle } from "react-loader-spinner";
import image from "../../../assets/pixelcut-export (1).jpg";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    cedula: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Validar campos requeridos
    if (!formData.cedula || !formData.password) {
      setError("Por favor completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      console.log('Intentando iniciar sesión con cédula:', formData.cedula);
      const success = await login(formData.cedula, formData.password);
      
      if (success) {
        console.log('Login exitoso, redirigiendo a /perfil');
        navigate("/perfil");
      } else {
        console.log('Login fallido');
        setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setError("Error en el servidor. Por favor, inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const CustomButton = () => (
    <button
      type="submit"
      disabled={loading}
      className={`flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full transition-colors ${loading ? 'opacity-90' : ''}`}
    >
      {loading && (
        <BallTriangle
          height={24}
          width={24}
          radius={3}
          color="#FFFFFF"
          ariaLabel="Cargando"
          visible={true}
        />
      )}
      <Tipografia className="text-white">
        {loading ? "Iniciando sesión" : "Iniciar sesión"}
      </Tipografia>
    </button>
  );

  return (
    <Tipografia>
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#842AF3] via-[#DA33E1] to-[#52307C]">
        <div className="w-full max-w-4xl bg-white md:rounded-3xl md:shadow-lg overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 relative">
            <img
              src={image}
              alt="Login Visual"
              className="w-full h-[53vh] md:h-full object-cover md:clip-path-[ellipse(100%_100%_at_0%_50%)]"
            />
          </div>
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center items-center">
            <Logo className="mb-4 md:mb-6" />
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-center">
              Bienvenidos a Tatsoft
            </h2>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              <CamposTexto
                label="Número de identificación"
                id="cedula"
                type="text"
                value={formData.cedula}
                onChange={handleChange}
                required
              />
              <CamposTexto
                label="Contraseña"
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="flex justify-end mt-3 md:mt-4">
                <p
                  className="text-purple-800 font-bold text-sm cursor-pointer"
                  onClick={() => navigate("/recuperar-password")}
                >
                  ¿Olvidaste la contraseña?
                </p>
              </div>
              <div className="mt-4 md:mt-5 flex justify-center">
                <CustomButton />
              </div>
              <footer className="text-center text-xs text-gray-500 mt-4">
                con ❤️ por Tatsoft - 2024
              </footer>
            </form>
          </div>
        </div>
      </div>
    </Tipografia>
  );
};

export default Login;
