import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Tipografia from "../../../components/atoms/Tipografia";
import Logo from "../../../components/atoms/Logo";
import CamposTexto from "../../../components/atoms/CamposTexto";
import Botones from "../../../components/atoms/Botones";
import { BallTriangle } from "react-loader-spinner";
import imagen from "../../../assets/nuevo imagen login.jpg";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    cedula: "",
    password: "",
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
      console.log("Intentando iniciar sesión con cédula:", formData.cedula);
      const success = await login(formData.cedula, formData.password);

      if (success) {
        console.log("Login exitoso, redirigiendo a /perfil");
        navigate("/perfil");
      } else {
        console.log("Login fallido");
        setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setError("Error en el servidor. Por favor, inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tipografia>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-xl">
          <div className="w-full md:w-1/2 bg-gray-900 relative h-60 md:h-auto">
            <img
              src={imagen}
              alt="Login Visual"
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0"></div>

            <div className="absolute inset-0 flex items-center justify-center p-10">
              <div className="max-w-sm">
                <h2 className="text-white text-4xl font-bold mb-3">
                  Tatsoft
                </h2>
                <p className="text-white text-lg">
                  Soluciones integrales para la gestión y optimización de
                  procesos de preventa
                </p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 bg-white p-8 lg:p-10">
            <div className="max-w-md mx-auto">
              <div className="flex justify-center mb-6">
                <Logo className="h-12 w-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Iniciar sesión
              </h2>
              <p className="mt-2 text-gray-600 text-sm text-center">
                Ingresa tus credenciales para acceder a la plataforma
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="cedula"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Número de identificación
                  </label>
                  <div className="mt-1">
                    <input
                      id="cedula"
                      type="text"
                      value={formData.cedula}
                      onChange={handleChange}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      placeholder="Ingresa tu número de identificación"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contraseña
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      placeholder="Ingresa tu contraseña"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <div className="text-sm">
                    <p
                      onClick={() => navigate("/recuperar-password")}
                      className="font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </p>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#F78220] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    {loading ? (
                      <>
                        <BallTriangle
                          height={20}
                          width={20}
                          radius={3}
                          color="#FFFFFF"
                          ariaLabel="Cargando"
                          visible={true}
                        />
                        <span className="ml-2">Iniciando sesión</span>
                      </>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </button>
                </div>
              </form>
              <p className="mt-4 text-center text-xs text-gray-500">
                &copy; 2024 Tatsoft. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Tipografia>
  );
};

export default Login;