import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Encabezado from "../../molecules/Encabezado";
import Boton from "../../atoms/Botones";
import Tipografia from "../../atoms/Tipografia";
import Icono from "../../atoms/Iconos";

const RegistroCliente = () => {
  const navigate = useNavigate();
  const [returnPath, setReturnPath] = useState("/gestion/clientes");
  
  const [formData, setFormData] = useState({
    razonSocial: "",
    nombre: "",
    apellido: "",
    nit: "",
    numeroCelular: "",
    direccion: "",
    correoElectronico: "",
  });

  const [errores, setErrores] = useState({
    razonSocial: "",
    nombre: "",
    apellido: "",
    nit: "",
    numeroCelular: "",
    direccion: "",
    correoElectronico: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [showCancelAlert, setShowCancelAlert] = useState(false);

  // Check for return path when component mounts
  useEffect(() => {
    const savedReturnPath = sessionStorage.getItem("returnPath");
    if (savedReturnPath) {
      setReturnPath(savedReturnPath);
    }
  }, []);

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

  const validarFormulario = () => {
    let erroresTemp = {};
    let esValido = true;

    if (!formData.razonSocial.trim()) {
      erroresTemp.razonSocial = "La razón social es obligatoria";
      esValido = false;
    }

    if (!formData.nombre.trim() && !formData.razonSocial.trim()) {
      erroresTemp.nombre = "El nombre es obligatorio";
      esValido = false;
    } else if (
      formData.nombre.trim() &&
      !/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(formData.nombre)
    ) {
      erroresTemp.nombre = "El nombre solo debe contener letras";
      esValido = false;
    }

    if (!formData.apellido.trim() && !formData.razonSocial.trim()) {
      erroresTemp.apellido = "El apellido es obligatorio";
      esValido = false;
    } else if (
      formData.apellido.trim() &&
      !/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(formData.apellido)
    ) {
      erroresTemp.apellido = "El apellido solo debe contener letras";
      esValido = false;
    }

    if (!formData.nit.trim()) {
      erroresTemp.nit = "El NIT es obligatorio";
      esValido = false;
    } else if (!/^\d{1,9}-?\d?$/.test(formData.nit)) {
      erroresTemp.nit = "Ingrese un NIT válido (ej. 900123456-7)";
      esValido = false;
    }

    if (!formData.numeroCelular.trim()) {
      erroresTemp.numeroCelular = "El número de celular es obligatorio";
      esValido = false;
    } else if (!/^\d{10}$/.test(formData.numeroCelular)) {
      erroresTemp.numeroCelular = "Ingrese un número de 10 dígitos";
      esValido = false;
    }

    if (!formData.direccion.trim()) {
      erroresTemp.direccion = "La dirección es obligatoria";
      esValido = false;
    } else if (formData.direccion.trim().length < 5) {
      erroresTemp.direccion = "Ingrese una dirección válida";
      esValido = false;
    }

    setErrores((prevErrores) => ({
      ...prevErrores,
      ...erroresTemp,
    }));

    return esValido;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (validarFormulario()) {
      console.log("Datos de registro de cliente:", formData);
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    // Navigate back to the stored return path
    navigate(returnPath);
    // Clear the stored path after using it
    sessionStorage.removeItem("returnPath");
  };

  const manejarCancelar = () => {
    setShowCancelAlert(true);
  };

  const cancelarCancelacion = () => {
    setShowCancelAlert(false);
  };

  const confirmarCancelacion = () => {
    setShowCancelAlert(false);
    // Navigate back to the stored return path
    navigate(returnPath);
    // Clear the stored path after using it
    sessionStorage.removeItem("returnPath");
  };

  const validarSoloNumeros = (e) => {
    if (!/[0-9]/.test(e.key) && e.key !== "-") {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div>
        <Encabezado
          mensaje="Registro de Cliente"
          onClick={() => {
            navigate(returnPath);
            sessionStorage.removeItem("returnPath");
          }}
        />
        <Tipografia>
          <div className="container mx-auto px-3 py-5 max-w-2xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="bg-purple-50 rounded-lg p-3 mb-5">
                  <h2 className="text-purple-900 font-medium mb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Información del Cliente
                  </h2>
                  <p className="text-sm text-purple-900">
                    Complete los datos del nuevo cliente
                  </p>
                </div>

                <form onSubmit={manejarEnvio} className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-black-900 mb-2">
                      Razón Social <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="razonSocial"
                      value={formData.razonSocial}
                      onChange={manejarCambio}
                      className={`block w-full bg-gray-100 rounded-md border ${
                        errores.razonSocial
                          ? "border-red-500"
                          : "border-gray-300"
                      } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                    />
                    {errores.razonSocial && (
                      <p className="mt-1 text-sm text-red-600">
                        {errores.razonSocial}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-black-900 mb-2">
                        Nombre
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
                        <p className="mt-1 text-sm text-red-600">
                          {errores.nombre}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-black-900 mb-2">
                        Apellidos
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
                        } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                      />
                      {errores.apellido && (
                        <p className="mt-1 text-sm text-red-600">
                          {errores.apellido}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-black-900 mb-2">
                      NIT <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nit"
                      value={formData.nit}
                      onChange={manejarCambio}
                      onKeyPress={validarSoloNumeros}
                      placeholder="Ej: 900123456-7"
                      className={`block w-full bg-gray-100 rounded-md border ${
                        errores.nit ? "border-red-500" : "border-gray-300"
                      } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                    />
                    {errores.nit && (
                      <p className="mt-1 text-sm text-red-600">{errores.nit}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-black-900 mb-2">
                      Dirección <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={manejarCambio}
                      className={`block w-full bg-gray-100 rounded-md border ${
                        errores.direccion ? "border-red-500" : "border-gray-300"
                      } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                    />
                    {errores.direccion && (
                      <p className="mt-1 text-sm text-red-600">
                        {errores.direccion}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-black-900 mb-2">
                        Teléfono celular <span className="text-red-500">*</span>
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
                        } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                      />
                      {errores.numeroCelular && (
                        <p className="mt-1 text-sm text-red-600">
                          {errores.numeroCelular}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-black-900 mb-2">
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
                        } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                      />
                      {errores.correoElectronico && (
                        <p className="mt-1 text-sm text-red-600">
                          {errores.correoElectronico}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
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
                    <div className="form-buttons-container flex justify-center space-x-10">
                      <Boton
                        tipo="cancelar"
                        label="Cancelar"
                        onClick={manejarCancelar}
                      />
                      <Boton
                        tipo="secundario"
                        label="Registrar Cliente"
                        type="submit"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Tipografia>
      </div>
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-4">
                <Icono name="confirmar" size="65" />
              </div>
              <Tipografia size="lg" className="font-bold mb-2">
                ¡Cliente registrado exitosamente!
              </Tipografia>
              <div className="w-full flex justify-center">
                <Boton
                  tipo="secundario"
                  label="Aceptar"
                  onClick={handleCloseAlert}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {showCancelAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-2">
                <Icono name="eliminarAlert" size="80" />
              </div>
              <Tipografia size="lg" className="font-bold mb-2">
                ¿Desea cancelar el registro?
              </Tipografia>
              <Tipografia className="mb-6 text-gray-600">
                Si cancela, perderá toda la información ingresada.
              </Tipografia>
              <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-3">
                <Boton
                  tipo="cancelar"
                  label="No"
                  onClick={cancelarCancelacion}
                  
                />
                <Boton
                  tipo="secundario"
                  label="Sí, cancelar"
                  onClick={confirmarCancelacion}

                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroCliente;

