import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../context/services/ApiService";
import Encabezado from "../../../components/molecules/Encabezado";
import Tipografia from "../../atoms/Tipografia";
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

  const [errores, setErrores] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    numeroCelular: "",
    correoElectronico: "",
    rol: "",
    password: "",
    confirmarPassword: "",
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errores[name]) {
      setErrores((prevErrores) => ({
        ...prevErrores,
        [name]: "",
      }));
    }
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
        rol: formData.rol.toLowerCase(),
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

  // Función para permitir solo números en ciertos campos
  const validarSoloNumeros = (e) => {
    const keyCode = e.which || e.keyCode;
    if (keyCode < 48 || keyCode > 57) {
      e.preventDefault();
    }
  };

  // Variables y funciones para el manejo de pasos en el formulario (multi-step)
  const [paso, setPaso] = useState(1);
  const pasosTotales = 2;

  const manejarCancelar = () => {
    navigate("/gestion/usuarios");
  };

  const manejarSiguiente = () => {
    // Aquí podrías validar los campos del primer paso antes de avanzar
    setPaso(2);
  };

  const manejarAtras = () => {
    setPaso(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div>
        <Encabezado
          mensaje="Registro de usuario"
          onClick={() => navigate("/gestion/usuarios")}
        />
        <Tipografia>
          <div className="container mx-auto px-3 py-5 max-w-2xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 pb-0">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-purple-900">
                    Paso {paso} de {pasosTotales}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {paso === 1 ? "Información Personal" : "Credenciales"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-700 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(paso / pasosTotales) * 100}%` }}
                  ></div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-5">
                <div>
                  {paso === 1 ? (
                    <div className="space-y-6">
                      <div className="bg-purple-50 rounded-lg p-3 mb-5">
                        <h2 className="text-purple-900 font-medium mb-2 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Información Personal
                        </h2>
                        <p className="text-sm text-purple-900">
                          Complete los datos personales del nuevo usuario
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-800 mb-2">
                            Nombre <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={manejarCambio}
                            className={`block w-full bg-gray-100 rounded-md border ${
                              errores.nombre ? "border-red-500" : "border-gray-300"
                            } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                          />
                          {errores.nombre && (
                            <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
                          )}
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-800 mb-2">
                            Apellido <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={manejarCambio}
                            className={`block w-full bg-gray-100 rounded-md border ${
                              errores.apellido ? "border-red-500" : "border-gray-300"
                            } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                          />
                          {errores.apellido && (
                            <p className="mt-1 text-sm text-red-600">{errores.apellido}</p>
                          )}
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Número de identificación <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="cedula"
                          value={formData.cedula}
                          onChange={manejarCambio}
                          onKeyPress={validarSoloNumeros}
                          className={`block w-full bg-gray-100 rounded-md border ${
                            errores.cedula ? "border-red-500" : "border-gray-300"
                          } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                        />
                        {errores.cedula && (
                          <p className="mt-1 text-sm text-red-600">{errores.cedula}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-800 mb-2">
                            Teléfono celular <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="numeroCelular"
                            value={formData.numeroCelular}
                            onChange={manejarCambio}
                            onKeyPress={validarSoloNumeros}
                            className={`block w-full bg-gray-100 rounded-md border ${
                              errores.numeroCelular ? "border-red-500" : "border-gray-300"
                            } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                          />
                          {errores.numeroCelular && (
                            <p className="mt-1 text-sm text-red-600">{errores.numeroCelular}</p>
                          )}
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-800 mb-2">
                            Correo electrónico <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="correoElectronico"
                            value={formData.correoElectronico}
                            onChange={manejarCambio}
                            className={`block w-full bg-gray-100 rounded-md border ${
                              errores.correoElectronico ? "border-red-500" : "border-gray-300"
                            } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                          />
                          {errores.correoElectronico && (
                            <p className="mt-1 text-sm text-red-600">{errores.correoElectronico}</p>
                          )}
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Rol en el sistema <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            name="rol"
                            value={formData.rol}
                            onChange={manejarCambio}
                            className={`block w-full bg-gray-100 rounded-md border ${
                              errores.rol ? "border-red-500" : "border-gray-300"
                            } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 pl-2 pr-10 text-base`}
                          >
                            <option value="">Seleccionar rol</option>
                            <option value="colaborador">Colaborador</option>
                            <option value="administrador">Administrador</option>
                          </select>
                        </div>
                        {errores.rol && (
                          <p className="mt-1 text-sm text-red-600">{errores.rol}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                        <h2 className="text-indigo-800 font-medium mb-2 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Credenciales de Acceso
                        </h2>
                        <p className="text-sm text-indigo-700">
                          Establezca la contraseña para el nuevo usuario
                        </p>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Contraseña <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={manejarCambio}
                          className={`block w-full bg-gray-100 rounded-md border ${
                            errores.password ? "border-red-500" : "border-gray-300"
                          } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                        />
                        {errores.password && (
                          <p className="mt-1 text-sm text-red-600">{errores.password}</p>
                        )}
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Confirmar contraseña <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="confirmarPassword"
                          value={formData.confirmarPassword}
                          onChange={manejarCambio}
                          className={`block w-full bg-gray-100 rounded-md border ${
                            errores.confirmarPassword ? "border-red-500" : "border-gray-300"
                          } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                        />
                        {errores.confirmarPassword && (
                          <p className="mt-1 text-sm text-red-600">{errores.confirmarPassword}</p>
                        )}
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-yellow-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                              Recomendaciones de seguridad
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Use al menos 8 caracteres</li>
                                <li>Incluya letras mayúsculas y minúsculas</li>
                                <li>Incluya al menos un número</li>
                                <li>Incluya al menos un carácter especial</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 border-t border-gray-200 pt-5">
                  <style jsx>{`
                    @media (max-width: 640px) {
                      .form-buttons-container {
                        flex-direction: column;
                        align-items: center;
                        gap: 16px;
                        margin: 0;
                      }
                      .form-buttons-container > * {
                        margin: 0 !important;
                      }
                    }
                  `}</style>
                  <div className="form-buttons-container flex justify-center gap-10 md:gap-20">
                    {paso === 1 ? (
                      <>
                        <Boton
                          tipo="cancelar"
                          label="Cancelar"
                          onClick={manejarCancelar}
                          size="small"
                        />
                        <Boton
                          tipo="secundario"
                          label="Siguiente"
                          onClick={manejarSiguiente}
                          size="small"
                        />
                      </>
                    ) : (
                      <>
                        <Boton
                          tipo="cancelar"
                          label="Atrás"
                          onClick={manejarAtras}
                          size="small"
                        />
                        <Boton 
                          tipo="secundario"
                          label="Registrar Usuario"
                          type="submit"
                          size="small"
                        />
                      </>
                    )}
                  </div>
                </div>
              </form>
              <Tipografia />
            </div>
          </div>
        </Tipografia>
      </div>
    </div>
  );
};

export default RegistroUsuario;
