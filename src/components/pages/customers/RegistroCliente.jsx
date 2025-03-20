import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clientService, areaService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";
import Encabezado from "../../molecules/Encabezado";
import Boton from "../../atoms/Botones";
import Tipografia from "../../atoms/Tipografia";
import Icono from "../../atoms/Iconos";
import Loading from "../../Loading/Loading";
import CampoTexto from "../../atoms/CamposTexto";

const RegistroCliente = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Extraer la zona ID si viene como parámetro en la URL
  const queryParams = new URLSearchParams(location.search);
  const zonaIdFromQuery = queryParams.get('zona_id');
  
  const [returnPath, setReturnPath] = useState("/gestion/clientes");
  const [zonas, setZonas] = useState([]);
  const [loadingZonas, setLoadingZonas] = useState(false);

  const [formData, setFormData] = useState({
    razon_social: "",
    nombre_completo_cliente: "",
    rut_nit: "",
    telefono: "",
    direccion: "",
    correo: "",
    id_zona_de_trabajo: zonaIdFromQuery || ""
  });

  const [errores, setErrores] = useState({
    razon_social: "",
    nombre_completo_cliente: "",
    rut_nit: "",
    telefono: "",
    direccion: "",
    correo: "",
    id_zona_de_trabajo: ""
  });

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Cargar zonas de trabajo
  useEffect(() => {
    const fetchZonas = async () => {
      try {
        setLoadingZonas(true);
        const response = await areaService.getAllAreas();
        if (response && response.data) {
          setZonas(response.data);
        }
      } catch (error) {
        console.error("Error al cargar zonas:", error);
      } finally {
        setLoadingZonas(false);
      }
    };

    fetchZonas();
  }, []);

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
    
    // Limpiar error específico cuando se cambia un valor
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

    // Validación para nombre_completo_cliente (obligatorio)
    if (!formData.nombre_completo_cliente.trim()) {
      erroresTemp.nombre_completo_cliente = "El nombre completo es obligatorio";
      esValido = false;
    } else if (formData.nombre_completo_cliente.trim().length < 5) {
      erroresTemp.nombre_completo_cliente = "El nombre debe tener al menos 5 caracteres";
      esValido = false;
    }

    // Validación para dirección (obligatorio)
    if (!formData.direccion.trim()) {
      erroresTemp.direccion = "La dirección es obligatoria";
      esValido = false;
    } else if (formData.direccion.trim().length < 5) {
      erroresTemp.direccion = "La dirección debe tener al menos 5 caracteres";
      esValido = false;
    }

    // Validación para teléfono (obligatorio)
    if (!formData.telefono.trim()) {
      erroresTemp.telefono = "El teléfono es obligatorio";
      esValido = false;
    } else if (!/^\d{7,15}$/.test(formData.telefono.trim())) {
      erroresTemp.telefono = "Ingresa un número de teléfono válido (entre 7 y 15 dígitos)";
      esValido = false;
    }

    // Validación para NIT/RUT (opcional pero con formato si se proporciona)
    if (formData.rut_nit && !/^[0-9\-]+$/.test(formData.rut_nit.trim())) {
      erroresTemp.rut_nit = "El NIT/RUT debe contener solo números y guiones";
      esValido = false;
    }

    // Validación para correo (opcional pero con formato si se proporciona)
    if (formData.correo && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.correo.trim())) {
      erroresTemp.correo = "Ingresa un correo electrónico válido";
      esValido = false;
    }

    // Validación para zona de trabajo (obligatorio)
    if (!formData.id_zona_de_trabajo) {
      erroresTemp.id_zona_de_trabajo = "Selecciona una zona de trabajo";
      esValido = false;
    }

    setErrores((prevErrores) => ({
      ...prevErrores,
      ...erroresTemp,
    }));

    return esValido;
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    // Limpiar mensajes anteriores
    setErrorSubmit("");
    setSuccessMessage("");
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para envío (mapeo de nombres de campos)
      const clienteData = {
        razon_social: formData.razon_social,
        nombre_completo_cliente: formData.nombre_completo_cliente,
        direccion: formData.direccion,
        telefono: formData.telefono,
        rut_nit: formData.rut_nit,
        correo: formData.correo,
        id_zona_de_trabajo: formData.id_zona_de_trabajo,
        estado: "Activo"
      };

      // Determinar si usar el método normal o solicitud según el rol
      const isAdmin = user && user.rol === 'ADMINISTRADOR';

      // Llamar al servicio correspondiente
      let response;
      if (isAdmin) {
        response = await clientService.createClient(clienteData);
      } else {
        response = await clientService.requestCreateClient(clienteData);
      }

      console.log("Cliente registrado:", response);
      setSuccessMessage(isAdmin ? "Cliente registrado exitosamente" : "Solicitud de cliente enviada, pendiente de aprobación");
      setShowAlert(true);
    } catch (error) {
      console.error("Error al registrar cliente:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorSubmit(error.response.data.error);
      } else {
        setErrorSubmit("Ha ocurrido un error al registrar el cliente. Por favor, inténtalo de nuevo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    
    // Redireccionar a la ruta especificada después de un registro exitoso
    if (successMessage) {
      navigate(returnPath);
      sessionStorage.removeItem("returnPath");
    }
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
    if (!/[0-9\-]/.test(e.key)) {
      e.preventDefault();
    }
  };

  if (loadingZonas) {
    return <Loading message="Cargando datos..." />;
  }

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

                {errorSubmit && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p>{errorSubmit}</p>
                  </div>
                )}

                <form onSubmit={manejarEnvio} className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-black-900 mb-2">
                      Razón Social
                    </label>
                    <input
                      type="text"
                      name="razon_social"
                      value={formData.razon_social}
                      onChange={manejarCambio}
                      className={`block w-full bg-gray-100 rounded-md border ${
                        errores.razon_social
                          ? "border-red-500"
                          : "border-gray-300"
                      } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                    />
                    {errores.razon_social && (
                      <p className="mt-1 text-sm text-red-600">
                        {errores.razon_social}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-black-900 mb-2">
                      Nombre Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre_completo_cliente"
                      value={formData.nombre_completo_cliente}
                      onChange={manejarCambio}
                      className={`block w-full bg-gray-100 rounded-md border ${
                        errores.nombre_completo_cliente
                          ? "border-red-500"
                          : "border-gray-300"
                      } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                      required
                    />
                    {errores.nombre_completo_cliente && (
                      <p className="mt-1 text-sm text-red-600">
                        {errores.nombre_completo_cliente}
                      </p>
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
                      required
                    />
                    {errores.direccion && (
                      <p className="mt-1 text-sm text-red-600">
                        {errores.direccion}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-black-900 mb-2">
                      NIT/RUT
                    </label>
                    <input
                      type="text"
                      name="rut_nit"
                      value={formData.rut_nit}
                      onChange={manejarCambio}
                      onKeyPress={validarSoloNumeros}
                      placeholder="Ej: 900123456-7"
                      className={`block w-full bg-gray-100 rounded-md border ${
                        errores.rut_nit ? "border-red-500" : "border-gray-300"
                      } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                    />
                    {errores.rut_nit && (
                      <p className="mt-1 text-sm text-red-600">{errores.rut_nit}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-black-900 mb-2">
                        Teléfono celular <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={manejarCambio}
                        onKeyPress={validarSoloNumeros}
                        className={`block w-full bg-gray-100 rounded-md border ${
                          errores.telefono
                            ? "border-red-500"
                            : "border-gray-300"
                        } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                        required
                      />
                      {errores.telefono && (
                        <p className="mt-1 text-sm text-red-600">
                          {errores.telefono}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-black-900 mb-2">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={manejarCambio}
                        className={`block w-full bg-gray-100 rounded-md border ${
                          errores.correo ? "border-red-500" : "border-gray-300"
                        } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                      />
                      {errores.correo && (
                        <p className="mt-1 text-sm text-red-600">
                          {errores.correo}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-black-900 mb-2">
                      Zona de Trabajo <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="id_zona_de_trabajo"
                      value={formData.id_zona_de_trabajo}
                      onChange={manejarCambio}
                      className={`block w-full bg-gray-100 rounded-md border ${
                        errores.id_zona_de_trabajo ? "border-red-500" : "border-gray-300"
                      } shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 py-2 px-3 text-base`}
                      required
                    >
                      <option value="">Seleccionar zona de trabajo</option>
                      {zonas.map((zona) => (
                        <option key={zona.id_zona_de_trabajo} value={zona.id_zona_de_trabajo}>
                          {zona.nombre_zona_trabajo}
                        </option>
                      ))}
                    </select>
                    {errores.id_zona_de_trabajo && (
                      <p className="mt-1 text-sm text-red-600">{errores.id_zona_de_trabajo}</p>
                    )}
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
                        disabled={loading}
                      />
                      <Boton
                        tipo="secundario"
                        label={loading ? "Procesando..." : "Registrar Cliente"}
                        type="submit"
                        disabled={loading}
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
                {successMessage}
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