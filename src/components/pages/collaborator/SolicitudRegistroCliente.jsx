import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Boton from "../../atoms/Botones";
import Tipografia from "../../atoms/Tipografia";
import Icono from "../../atoms/Iconos";
import Sidebar from "../../organisms/Sidebar";
import { BallTriangle } from "react-loader-spinner";
import { areaService, clientService } from "../../../context/services/ApiService";

const SolicitudRegistroCliente = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [returnPath, setReturnPath] = useState("/home");
  const zonaId = location.state?.zonaId || "";

  const [formData, setFormData] = useState({
    razonSocial: "",
    nombre: "",
    apellido: "",
    nit: "",
    numeroCelular: "",
    direccion: "",
    correoElectronico: "",
    id_zona: zonaId,
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

  // Variables y funciones para el manejo de pasos en el formulario
  const [paso, setPaso] = useState(1);
  const pasosTotales = 2;

  const [cliente, setCliente] = useState({
    nombre_completo_cliente: "",
    email: "",
    telefono: "",
    rut_nit: "",
    razon_social: "",
    descripcion: "",
    activo: true,
    id_zona_de_trabajo: "",
  });
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const savedReturnPath = sessionStorage.getItem("returnPath");
    if (savedReturnPath) {
      setReturnPath(savedReturnPath);
    }
  }, []);

  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const response = await areaService.getAllAreas();
        if (!response.data) {
          throw new Error("Error al cargar las zonas");
        }
        setZonas(response.data);
      } catch (err) {
        console.error("Error al cargar las zonas:", err);
        setError("Error al cargar la lista de zonas");
      } finally {
        setLoading(false);
      }
    };

    fetchZonas();
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

  const validarFormularioPaso1 = () => {
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

    setErrores((prevErrores) => ({
      ...prevErrores,
      ...erroresTemp,
    }));

    return esValido;
  };

  const validarFormularioPaso2 = () => {
    let erroresTemp = {};
    let esValido = true;
    // Para números colombianos (10 dígitos, puede empezar con 3)
    if (!/^3\d{9}$/.test(formData.numeroCelular)) {
      erroresTemp.numeroCelular =
        "Ingrese un número celular colombiano válido (10 dígitos empezando con 3)";
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

    if (!formData.correoElectronico.trim()) {
      erroresTemp.correoElectronico = "El correo electrónico es obligatorio";
      esValido = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.correoElectronico)) {
      erroresTemp.correoElectronico = "Ingrese un correo electrónico válido";
      esValido = false;
    }

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
    setPaso(1);
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

    setEnviando(true);

    try {
      // Crear el objeto con el formato que espera el backend
      const clienteData = {
        cedula: formData.nit, // Asumiendo que el NIT se usa como cédula
        nombre_completo_cliente: `${formData.nombre} ${formData.apellido}`.trim(),
        direccion: formData.direccion,
        telefono: formData.numeroCelular,
        rut_nit: formData.nit,
        razon_social: formData.razonSocial,
        id_zona_de_trabajo: formData.id_zona
      };

      // Llamar al endpoint para solicitud de creación de cliente
      const response = await clientService.requestCreateClient(clienteData);
      console.log("Solicitud enviada:", response);
      setShowAlert(true);
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      setError("Error al enviar la solicitud. Por favor, intente nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate(returnPath);
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
    navigate(returnPath);
    sessionStorage.removeItem("returnPath");
  };

  const validarSoloNumeros = (e) => {
    if (!/[0-9]/.test(e.key) && e.key !== "-") {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden ">
      <div className="fixed top-0 left-0 h-full z-10 hidden md:block">
        <Sidebar />
      </div>
      <div className="md:hidden">
        <Sidebar />
      </div>
      <div className="px-2 sm:px-4 ml-10 pl-9 lg:px-8 py-2 ">
        <Tipografia>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Solicitud de Nuevo Cliente
          </h1>
        </Tipografia>
      </div>

      <div className="flex justify-center w-full md:pt-0 p-7 ">
        <Tipografia>
          <div className="container mx-auto px-3 py-5 max-w-2xl ml-8 md-ml-96 ">
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto md:ml-auto md:mr-auto md:pl-16 lg:pl-0 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 md:p-6 pb-0">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-orange-700">
                    Paso {paso} de {pasosTotales}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {paso === 1 ? "Información Básica" : "Contacto"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(paso / pasosTotales) * 100}%` }}
                  ></div>
                </div>
              </div>

              <form onSubmit={manejarEnvio} className="p-4 md:p-5">
                {paso === 1 ? (
                  <div className="space-y-4 md:space-y-6">
                    <div className="bg-orange-50 rounded-lg p-3 mb-3 md:mb-5">
                      <h2 className="text-orange-700 font-medium mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 md:h-6 md:w-6 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Información Básica del Cliente
                      </h2>
                      <p className="text-xs md:text-sm text-orange-700">
                        Complete la información básica para solicitar la creación del nuevo cliente
                      </p>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-800 mb-1 md:mb-2">
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
                        } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-sm md:text-base`}
                      />
                      {errores.razonSocial && (
                        <p className="mt-1 text-xs md:text-sm text-red-600">
                          {errores.razonSocial}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-800 mb-1 md:mb-2">
                          Nombre
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
                          } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-sm md:text-base`}
                        />
                        {errores.nombre && (
                          <p className="mt-1 text-xs md:text-sm text-red-600">
                            {errores.nombre}
                          </p>
                        )}
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-800 mb-1 md:mb-2">
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
                          } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-sm md:text-base`}
                        />
                        {errores.apellido && (
                          <p className="mt-1 text-xs md:text-sm text-red-600">
                            {errores.apellido}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-800 mb-1 md:mb-2">
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
                        } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-sm md:text-base`}
                      />
                      {errores.nit && (
                        <p className="mt-1 text-xs md:text-sm text-red-600">
                          {errores.nit}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-600 mb-1 md:mb-2">
                        Zona <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="id_zona"
                        value={formData.id_zona}
                        onChange={manejarCambio}
                        className="block w-full bg-gray-100 rounded-md border text-gray-500 border-gray-300 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-sm md:text-base"
                        required
                      >
                        <option value="">Seleccione una zona</option>
                        {zonas.map((zona) => (
                          <option
                            key={zona.id_zona_de_trabajo}
                            value={zona.id_zona_de_trabajo}
                          >
                            {zona.nombre_zona_trabajo}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    <div className="bg-orange-50 rounded-lg p-3 mb-3 md:mb-5">
                      <h2 className="text-orange-700 font-medium mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 md:h-6 md:w-6 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        Información de Contacto
                      </h2>
                      <p className="text-xs md:text-sm text-orange-700">
                        Complete los datos de contacto del cliente
                      </p>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-800 mb-1 md:mb-2">
                        Dirección <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={manejarCambio}
                        className={`block w-full bg-gray-100 rounded-md border ${
                          errores.direccion
                            ? "border-red-500"
                            : "border-gray-300"
                        } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-sm md:text-base`}
                      />
                      {errores.direccion && (
                        <p className="mt-1 text-xs md:text-sm text-red-600">
                          {errores.direccion}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-800 mb-1 md:mb-2">
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
                          } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-sm md:text-base`}
                        />
                        {errores.numeroCelular && (
                          <p className="mt-1 text-xs md:text-sm text-red-600">
                            {errores.numeroCelular}
                          </p>
                        )}
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-800 mb-1 md:mb-2">
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
                          } shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 py-2 px-3 text-sm md:text-base`}
                        />
                        {errores.correoElectronico && (
                          <p className="mt-1 text-xs md:text-sm text-red-600">
                            {errores.correoElectronico}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-3 md:p-4 bg-slate-100 rounded-lg border border-blue-100">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 md:h-6 md:w-6 text-blue-400"
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
                          <h3 className="text-xs md:text-sm font-medium text-slate-800">
                            Recordatorio
                          </h3>
                          <div className="mt-1 md:mt-2 text-xs md:text-sm text-slate-700">
                            <p>
                              Esta solicitud será revisada por un administrador antes de crear el cliente.
                              Asegúrese de verificar la información de contacto, ya que será utilizada para comunicaciones
                              importantes con el cliente.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 md:mt-6 border-t border-gray-200 pt-4 md:pt-5">
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 md:gap-10">
                    {paso === 1 ? (
                      <>
                        <Boton
                          tipo="secundario"
                          label="Cancelar"
                          onClick={manejarCancelar}
                          className="w-full sm:w-auto text-sm md:text-base"
                        />
                        <Boton
                          tipo="primario"
                          label="Siguiente"
                          onClick={manejarSiguiente}
                          className="w-full sm:w-auto text-sm md:text-base"
                        />
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="w-full sm:w-1/2 py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 text-sm md:text-base mb-2 sm:mb-0"
                          onClick={() => {
                            window.setTimeout(() => setPaso(1), 0);
                          }}
                        >
                          Atrás
                        </button>
                        <button
                          type="submit"
                          disabled={enviando}
                          className="w-full sm:w-1/2 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          {enviando ? (
                            <>
                              <BallTriangle
                                height={20}
                                width={20}
                                radius={3}
                                color="#FFFFFF"
                                ariaLabel="Cargando"
                                visible={true}
                              />
                              <span className="ml-2">Enviando solicitud...</span>
                            </>
                          ) : (
                            "Enviar Solicitud"
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Tipografia>
      </div>

      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-xs sm:max-w-sm md:max-w-md w-full mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <Icono
                  name="confirmar"
                  size="50"
                  className="text-green-500 md:text-6xl"
                />
              </div>
              <Tipografia
                size="lg"
                className="font-bold mb-3 md:mb-4 text-base md:text-lg"
              >
                ¡Solicitud enviada exitosamente!
              </Tipografia>
              <Tipografia className="mb-4 text-gray-600 text-sm md:text-base">
                La solicitud será revisada por un administrador.
              </Tipografia>
              <div className="w-full flex justify-center">
                <Boton
                  tipo="primario"
                  label="Aceptar"
                  onClick={handleCloseAlert}
                  className="w-full sm:w-auto text-sm md:text-base"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {showCancelAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-xs sm:max-w-sm md:max-w-md w-full mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <Icono name="alerta" size={24} customColor="#F59E0B" />
              </div>
              <Tipografia
                size="lg"
                className="font-bold mb-1 md:mb-2 text-base md:text-lg"
              >
                ¿Desea cancelar la solicitud?
              </Tipografia>
              <Tipografia className="mb-3 md:mb-6 text-gray-600 text-sm md:text-base">
                Si cancela, perderá toda la información ingresada.
              </Tipografia>
              <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                <Boton
                  tipo="secundario"
                  label="No, Continuar"
                  size="small"
                  onClick={cancelarCancelacion}
                  className="w-full sm:w-auto text-sm md:text-base"
                />
                <Boton
                  tipo="cancelar"
                  label="Sí, Cancelar"
                  size="small"
                  onClick={confirmarCancelacion}
                  className="w-full sm:w-auto text-sm md:text-base"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudRegistroCliente;