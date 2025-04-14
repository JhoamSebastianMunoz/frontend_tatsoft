import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";
import CampoTexto from "../../../components/atoms/CamposTexto";
import AlertaRegistro from "./AlertaRegistro";
import Sidebar from "../../organisms/Sidebar";
import AlertaCancelarRegis from "./AlertaCancelarRegis";

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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showCancelAlert, setShowCancelAlert] = useState(false);

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

  // Variables y funciones para el manejo de pasos en el formulario
  const [paso, setPaso] = useState(1);
  const pasosTotales = 2;

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    // Actualiza el estado del formulario
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Realiza validación inmediata para algunos campos específicos
    let mensajeError = "";

    // Validaciones específicas en tiempo real
    switch (name) {
      case "nombre":
      case "apellido":
        // Rechazar números inmediatamente mientras el usuario escribe
        if (value && /\d/.test(value)) {
          mensajeError = `El ${
            name === "nombre" ? "nombre" : "apellido"
          } no debe contener números`;
        } else if (value && !/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(value)) {
          mensajeError = `El ${
            name === "nombre" ? "nombre" : "apellido"
          } solo debe contener letras`;
        } else if (value && value.trim().length === 1) {
          mensajeError = `El ${
            name === "nombre" ? "nombre" : "apellido"
          } debe tener al menos 2 caracteres`;
        }
        break;

      case "cedula":
        if (value && !/^\d+$/.test(value)) {
          mensajeError = "La cédula debe contener solo números";
        } else if (value && value.length > 10) {
          mensajeError = "La cédula debe tener exactamente 10 dígitos";
        }
        break;

      case "numeroCelular":
        if (value && !/^\d+$/.test(value)) {
          mensajeError = "El número debe contener solo dígitos";
        } else if (value && value.length > 10) {
          mensajeError = "El número debe tener 10 dígitos";
        }
        break;

      case "correoElectronico":
        if (value && value.includes("@") && !/^\S+@\S+\.\S+$/.test(value)) {
          mensajeError = "Formato de correo electrónico inválido";
        }
        break;

      case "password":
        // Validar la contraseña en tiempo real
        if (value) {
          // Verificar todos los criterios de la contraseña
          const longitud = value.length >= 8;
          const tieneMayuscula = /[A-Z]/.test(value);
          const tieneMinuscula = /[a-z]/.test(value);
          const tieneNumero = /\d/.test(value);
          const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
          const noTieneEspacios = !/\s/.test(value);

          // Determinar el primer criterio que falla para mostrar ese mensaje
          if (!longitud) {
            mensajeError = "La contraseña debe tener al menos 8 caracteres";
          } else if (!tieneMayuscula) {
            mensajeError =
              "La contraseña debe contener al menos una letra mayúscula";
          } else if (!tieneMinuscula) {
            mensajeError =
              "La contraseña debe contener al menos una letra minúscula";
          } else if (!tieneNumero) {
            mensajeError = "La contraseña debe contener al menos un número";
          } else if (!tieneEspecial) {
            mensajeError =
              'La contraseña debe contener al menos un carácter especial (!@#$%^&*(),.?":{}|<>)';
          } else if (!noTieneEspacios) {
            mensajeError = "La contraseña no debe contener espacios en blanco";
          }

          // Actualizar el estado de errores para la contraseña
          setErrores((prev) => ({
            ...prev,
            [name]: mensajeError,
          }));

          // Si cambia la contraseña, validar también la confirmación de contraseña
          if (
            formData.confirmarPassword &&
            formData.confirmarPassword !== value
          ) {
            setErrores((prev) => ({
              ...prev,
              confirmarPassword: "Las contraseñas no coinciden",
            }));
          } else if (formData.confirmarPassword) {
            setErrores((prev) => ({
              ...prev,
              confirmarPassword: "",
            }));
          }
        }
        return; // Importante: return para evitar la actualización duplicada

      case "confirmarPassword":
        if (value && formData.password && value !== formData.password) {
          mensajeError = "Las contraseñas no coinciden";
        }
        break;
    }

    // Actualiza el estado de errores - si hay un nuevo error, lo muestra, si no, lo limpia
    setErrores((prevErrores) => ({
      ...prevErrores,
      [name]: mensajeError,
    }));
  };

  const validarFormularioPaso1 = () => {
    let erroresTemp = {};
    let esValido = true;

    // Validación nombre
    if (!formData.nombre.trim()) {
      erroresTemp.nombre = "El nombre es obligatorio";
      esValido = false;
    } else if (/\d/.test(formData.nombre)) {
      erroresTemp.nombre = "El nombre no debe contener números";
      esValido = false;
    } else if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(formData.nombre)) {
      erroresTemp.nombre = "El nombre solo debe contener letras";
      esValido = false;
    } else if (formData.nombre.trim().length < 2) {
      erroresTemp.nombre = "El nombre debe tener al menos 2 caracteres";
      esValido = false;
    }

    // Validación apellido
    if (!formData.apellido.trim()) {
      erroresTemp.apellido = "El apellido es obligatorio";
      esValido = false;
    } else if (/\d/.test(formData.apellido)) {
      erroresTemp.apellido = "El apellido no debe contener números";
      esValido = false;
    } else if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(formData.apellido)) {
      erroresTemp.apellido = "El apellido solo debe contener letras";
      esValido = false;
    } else if (formData.apellido.trim().length < 2) {
      erroresTemp.apellido = "El apellido debe tener al menos 2 caracteres";
      esValido = false;
    }

    // Validación cédula
    if (!formData.cedula.trim()) {
      erroresTemp.cedula = "El número de identificación es obligatorio";
      esValido = false;
    } else if (!/^\d+$/.test(formData.cedula)) {
      erroresTemp.cedula = "La cédula debe contener solo números";
      esValido = false;
    } else if (formData.cedula.length !== 10) {
      erroresTemp.cedula = "La cédula debe tener exactamente 10 dígitos";
      esValido = false;
    }

    // Validación número celular
    if (!formData.numeroCelular.trim()) {
      erroresTemp.numeroCelular = "El número de celular es obligatorio";
      esValido = false;
    } else if (!/^\d{10}$/.test(formData.numeroCelular)) {
      erroresTemp.numeroCelular = "Ingrese un número válido de 10 dígitos";
      esValido = false;
    }

    // Validación correo electrónico
    if (!formData.correoElectronico.trim()) {
      erroresTemp.correoElectronico = "El correo electrónico es obligatorio";
      esValido = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.correoElectronico)) {
      erroresTemp.correoElectronico = "Ingrese un correo electrónico válido";
      esValido = false;
    }

    // Validación rol
    if (!formData.rol) {
      erroresTemp.rol = "Seleccione un rol";
      esValido = false;
    }

    // Actualiza todos los errores de una vez
    setErrores((prevErrores) => ({
      ...prevErrores,
      ...erroresTemp,
    }));

    return esValido;
  };

  const validarFormularioPaso2 = () => {
    let erroresTemp = {};
    let esValido = true;

    // Validaciones para contraseña
    if (!formData.password) {
      erroresTemp.password = "La contraseña es obligatoria";
      esValido = false;
    } else {
      // Validar todos los criterios de la contraseña
      const criterios = [
        {
          condicion: formData.password.length < 8,
          mensaje: "La contraseña debe tener al menos 8 caracteres",
        },
        {
          condicion: !/[A-Z]/.test(formData.password),
          mensaje: "La contraseña debe contener al menos una letra mayúscula",
        },
        {
          condicion: !/[a-z]/.test(formData.password),
          mensaje: "La contraseña debe contener al menos una letra minúscula",
        },
        {
          condicion: !/\d/.test(formData.password),
          mensaje: "La contraseña debe contener al menos un número",
        },
        {
          condicion: !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
          mensaje:
            'La contraseña debe contener al menos un carácter especial (!@#$%^&*(),.?":{}|<>)',
        },
        {
          condicion: /\s/.test(formData.password),
          mensaje: "La contraseña no debe contener espacios en blanco",
        },
      ];

      // Aplicar la primera validación que falle
      for (const criterio of criterios) {
        if (criterio.condicion) {
          erroresTemp.password = criterio.mensaje;
          esValido = false;
          break;
        }
      }
    }

    // Validación para confirmar contraseña
    if (!formData.confirmarPassword) {
      erroresTemp.confirmarPassword = "Debe confirmar la contraseña";
      esValido = false;
    } else if (formData.password !== formData.confirmarPassword) {
      erroresTemp.confirmarPassword = "Las contraseñas no coinciden";
      esValido = false;
    }

    // Actualiza todos los errores de una vez
    setErrores((prevErrores) => ({
      ...prevErrores,
      ...erroresTemp,
    }));

    return esValido;
  };

  const manejarSiguiente = () => {
    if (validarFormularioPaso1()) {
      setPaso(2);
    }
  };

  const manejarAtras = () => {
    console.log("Volviendo al paso 1...");
    setPaso(1);
    // Limpiar los errores de contraseña al volver atrás
    setErrores((prevErrores) => ({
      ...prevErrores,
      password: "",
      confirmarPassword: "",
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (paso === 1) {
      if (validarFormularioPaso1()) {
        setPaso(2);
      }
      return;
    }

    if (!validarFormularioPaso2()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userData = {
        cedula: formData.cedula,
        nombreCompleto: `${formData.nombre} ${formData.apellido}`.trim(),
        celular: formData.numeroCelular,
        correo: formData.correoElectronico,
        contrasena: formData.password,
        rol: formData.rol.toLowerCase(),
      };

      const response = await userService.createUser(userData);

      setShowSuccessAlert(true);

      setFormData({
        nombre: "",
        apellido: "",
        cedula: "",
        numeroCelular: "",
        correoElectronico: "",
        rol: "",
        password: "",
        confirmarPassword: "",
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError(
          "Error al registrar el usuario. Por favor, inténtalo de nuevo más tarde."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const manejarCancelar = () => {
    setShowCancelAlert(true);
  };

  const confirmarCancelacion = () => {
    navigate("/gestion/usuarios");
  };

  const cancelarCancelacion = () => {
    setShowCancelAlert(false);
  };

  const handleSuccessAlertClose = () => {
    setShowSuccessAlert(false);
    navigate("/gestion/usuarios");
  };

  const validarSoloNumeros = (e) => {
    const keyCode = e.which || e.keyCode;
    // Permitir teclas numéricas (48-57) y de control (Backspace, Tab, flechas, etc.)
    const isNumericKey = keyCode >= 48 && keyCode <= 57; // 0-9
    const isControlKey = [8, 9, 35, 36, 37, 39, 46].includes(keyCode); // Backspace, Tab, Home, End, flechas, Delete

    if (!isNumericKey && !isControlKey) {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      <div className="w-full m-1 p-4">
        <Tipografia>
          <div className="container mx-auto px-3 py-5 max-w-2xl ml-6  md:ml-96">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 pb-0">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-orange-900">
                    Paso {paso} de {pasosTotales}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {paso === 1 ? "Información Personal" : "Credenciales"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(paso / pasosTotales) * 100}%` }}
                  ></div>
                </div>
              </div>

              <form onSubmit={manejarEnvio} className="p-5">
                <div>
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}

                  {paso === 1 ? (
                    <div className="space-y-6">
                      <div className="bg-orange-100 rounded-lg p-3 mb-5">
                        <h2 className="text-orange-900 font-medium mb-2 flex items-center">
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
                        <p className="text-sm text-orange-800">
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
                              errores.nombre
                                ? "border-red-500"
                                : "border-gray-300"
                            } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-base`}
                          />
                          {errores.nombre && (
                            <p className="mt-1 text-sm text-red-600">
                              {errores.nombre}
                            </p>
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
                              errores.apellido
                                ? "border-red-500"
                                : "border-gray-300"
                            } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-base`}
                          />
                          {errores.apellido && (
                            <p className="mt-1 text-sm text-red-600">
                              {errores.apellido}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Número de identificación{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="cedula"
                          value={formData.cedula}
                          onChange={manejarCambio}
                          onKeyPress={validarSoloNumeros}
                          className={`block w-full bg-gray-100 rounded-md border ${
                            errores.cedula
                              ? "border-red-500"
                              : "border-gray-300"
                          } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-base`}
                        />
                        {errores.cedula && (
                          <p className="mt-1 text-sm text-red-600">
                            {errores.cedula}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-800 mb-2">
                            Teléfono celular{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="numeroCelular"
                            value={formData.numeroCelular}
                            onChange={manejarCambio}
                            onKeyPress={validarSoloNumeros}
                            className={`block w-full bg-gray-100 rounded-md border ${
                              errores.numeroCelular
                                ? "border-red-500"
                                : "border-gray-300"
                            } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-base`}
                          />
                          {errores.numeroCelular && (
                            <p className="mt-1 text-sm text-red-600">
                              {errores.numeroCelular}
                            </p>
                          )}
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-800 mb-2">
                            Correo electrónico{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="correoElectronico"
                            value={formData.correoElectronico}
                            onChange={manejarCambio}
                            className={`block w-full bg-gray-100 rounded-md border ${
                              errores.correoElectronico
                                ? "border-red-500"
                                : "border-gray-300"
                            } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-base`}
                          />
                          {errores.correoElectronico && (
                            <p className="mt-1 text-sm text-red-600">
                              {errores.correoElectronico}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Rol en el sistema{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            name="rol"
                            value={formData.rol}
                            onChange={manejarCambio}
                            className={`block w-full bg-gray-100 rounded-md border ${
                              errores.rol ? "border-red-500" : "border-gray-300"
                            } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 pl-2 pr-10 text-base`}
                          >
                            <option value="">Seleccionar rol</option>
                            <option value="colaborador">Colaborador</option>
                            <option value="administrador">Administrador</option>
                          </select>
                        </div>
                        {errores.rol && (
                          <p className="mt-1 text-sm text-red-600">
                            {errores.rol}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-slate-50 rounded-lg p-4 mb-6">
                        <h2 className="text-slate-600 font-medium mb-2 flex items-center">
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
                        <p className="text-sm text-slate-600">
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
                            errores.password
                              ? "border-red-500"
                              : "border-gray-300"
                          } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-base`}
                        />
                        {errores.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {errores.password}
                          </p>
                        )}

                        {/* Indicadores visuales de requisitos de contraseña */}
                        {formData.password && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              La contraseña debe cumplir con:
                            </p>
                            <ul className="space-y-1 text-xs">
                              <li
                                className={`flex items-center ${
                                  formData.password.length >= 8
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                <svg
                                  className={`h-4 w-4 mr-1 ${
                                    formData.password.length >= 8
                                      ? "text-green-500"
                                      : "text-gray-400"
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  {formData.password.length >= 8 ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  ) : (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  )}
                                </svg>
                                Al menos 8 caracteres
                              </li>
                              <li
                                className={`flex items-center ${
                                  /[A-Z]/.test(formData.password)
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                <svg
                                  className={`h-4 w-4 mr-1 ${
                                    /[A-Z]/.test(formData.password)
                                      ? "text-green-500"
                                      : "text-gray-400"
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  {/[A-Z]/.test(formData.password) ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  ) : (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  )}
                                </svg>
                                Al menos una letra mayúscula
                              </li>
                              <li
                                className={`flex items-center ${
                                  /[a-z]/.test(formData.password)
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                <svg
                                  className={`h-4 w-4 mr-1 ${
                                    /[a-z]/.test(formData.password)
                                      ? "text-green-500"
                                      : "text-gray-400"
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  {/[a-z]/.test(formData.password) ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  ) : (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  )}
                                </svg>
                                Al menos una letra minúscula
                              </li>
                              <li
                                className={`flex items-center ${
                                  /\d/.test(formData.password)
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                <svg
                                  className={`h-4 w-4 mr-1 ${
                                    /\d/.test(formData.password)
                                      ? "text-green-500"
                                      : "text-gray-400"
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  {/\d/.test(formData.password) ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  ) : (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  )}
                                </svg>
                                Al menos un número
                              </li>
                              <li
                                className={`flex items-center ${
                                  /[!@#$%^&*(),.?":{}|<>]/.test(
                                    formData.password
                                  )
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                <svg
                                  className={`h-4 w-4 mr-1 ${
                                    /[!@#$%^&*(),.?":{}|<>]/.test(
                                      formData.password
                                    )
                                      ? "text-green-500"
                                      : "text-gray-400"
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  {/[!@#$%^&*(),.?":{}|<>]/.test(
                                    formData.password
                                  ) ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  ) : (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  )}
                                </svg>
                                Al menos un carácter especial
                                (!@#$%^&amp;*(),.?&quot;:{}|&lt;&gt;)
                              </li>
                              <li
                                className={`flex items-center ${
                                  !/\s/.test(formData.password)
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                <svg
                                  className={`h-4 w-4 mr-1 ${
                                    !/\s/.test(formData.password)
                                      ? "text-green-500"
                                      : "text-gray-400"
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  {!/\s/.test(formData.password) ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  ) : (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  )}
                                </svg>
                                Sin espacios en blanco
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Confirmar contraseña{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="confirmarPassword"
                          value={formData.confirmarPassword}
                          onChange={manejarCambio}
                          className={`block w-full bg-gray-100 rounded-md border ${
                            errores.confirmarPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-base`}
                        />
                        {errores.confirmarPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {errores.confirmarPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-gray-200 pt-5">
                  <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 sm:gap-10 md:gap-20 px-3 sm:px-0">
                    {paso === 1 ? (
                      <>
                        <Boton
                          tipo="secundario"
                          label="Cancelar"
                          onClick={manejarCancelar}
                          size="medium"
                          className="w-full min-w-[200px] sm:w-auto sm:min-w-0"
                        />
                        <Boton
                          tipo="primario"
                          label="Siguiente"
                          onClick={manejarSiguiente}
                          size="medium"
                          className="w-full min-w-[200px] sm:w-auto sm:min-w-0"
                        />
                      </>
                    ) : (
                      <>
                        <Boton
                          tipo="secundario"
                          label="Atrás"
                          onClick={(e) => {
                            e.preventDefault();
                            manejarAtras();
                          }}
                          size="medium"
                          className="w-full min-w-[200px] sm:w-auto sm:min-w-0"
                        />
                        <Boton
                          tipo="primario"
                          label={loading ? "Registrando" : "Registrar"}
                          type="submit"
                          size="medium"
                          disabled={loading}
                          className="w-full min-w-[200px] sm:w-auto sm:min-w-0"
                        />
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Tipografia>
      </div>

      {showSuccessAlert && <AlertaRegistro onClose={handleSuccessAlertClose} />}

      {showCancelAlert && (
        <AlertaCancelarRegis
          onClose={() => setShowCancelAlert(false)}
          onConfirm={confirmarCancelacion}
          onCancel={cancelarCancelacion}
        />
      )}
    </div>
  );
};

export default RegistroUsuario;
