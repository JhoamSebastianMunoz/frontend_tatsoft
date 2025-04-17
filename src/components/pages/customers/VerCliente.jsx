import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Sidebar from "../../organisms/Sidebar";
import Icono from "../../../components/atoms/Iconos";
import AlertaInhabilitar from "../../pages/administrator/AlertaInhabilitar";
import { clientService } from "../../../context/services/ApiService";
import { IoArrowBack } from "react-icons/io5";

const VerCliente = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [clienteStatus, setClienteStatus] = useState("Activo");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [clienteData, setClienteData] = useState({
    razonSocial: "",
    nombre: "",
    apellido: "",
    celular: "",
    nit: "",
    direccion: "",
    estado: "Activo",
    email: "",
    fechaCreacion: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  // Efectos para gestionar los mensajes de éxito y error
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    // Obtener datos del cliente desde la API
    const fetchCliente = async () => {
      try {
        setLoading(true);
        const response = await clientService.getClientById(id);
        console.log("Datos del cliente recibidos:", response.data);

        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const cliente = response.data[0];
          console.log("Cliente extraído:", cliente);

          // Extraer nombre y apellido del nombre completo
          const nombreCompleto = cliente.nombre_completo_cliente
            ? cliente.nombre_completo_cliente.split(" ")
            : ["", ""];

          // Normalizar el estado para que siempre tenga la primera letra en mayúscula
          let estadoNormalizado = "Activo"; // Valor por defecto
          if (cliente.estado) {
            // Convertir el estado a minúsculas para normalizar
            const estadoLower = cliente.estado.toLowerCase();

            if (estadoLower.includes("activ")) {
              estadoNormalizado = "Activo";
            } else if (estadoLower.includes("inactiv")) {
              estadoNormalizado = "Inactivo";
            } else if (estadoLower.includes("pendient")) {
              estadoNormalizado = "Pendiente";
            }
          }

          console.log("Estado normalizado:", estadoNormalizado);

          // Mapear los datos del cliente al formato esperado por el componente
          const formattedData = {
            id_cliente: cliente.id_cliente,
            razonSocial: cliente.razon_social || "",
            nombre: nombreCompleto[0] || "",
            apellido: nombreCompleto.slice(1).join(" ") || "",
            celular: cliente.telefono || "",
            nit: cliente.rut_nit || "",
            direccion: cliente.direccion || "",
            estado: estadoNormalizado,
            fechaCreacion: formatearFecha(cliente.created_at) || "",
            email: cliente.email || "",
            // Añadir más campos que puedan estar presentes en la API para asegurarnos de tener todos los necesarios
            cedula: cliente.cedula || "",
            id_zona_de_trabajo: cliente.id_zona_de_trabajo || 1,
          };

          console.log("Datos mapeados:", formattedData);
          setClienteData(formattedData);
          setClienteStatus(estadoNormalizado);
        } else {
          console.error("No se encontraron datos de cliente válidos");
          setError("No se pudieron encontrar los datos del cliente");
        }
      } catch (err) {
        console.error("Error al cargar datos del cliente:", err);
        setError(
          "Error al cargar los datos del cliente: " +
            (err.message || "Error desconocido")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id]);

  // Función para formatear la fecha en formato DD/MM/YYYY
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    try {
      const fecha = new Date(fechaStr);
      return `${fecha.getDate().toString().padStart(2, "0")}/${(
        fecha.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${fecha.getFullYear()}`;
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return fechaStr;
    }
  };

  const handleShowAlert = () => {
    console.log("Mostrando alerta de confirmación");
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    console.log("Cerrando alerta de confirmación");
    setShowAlert(false);
  };

  const handleConfirmStatusChange = async () => {
    console.log("Iniciando cambio de estado...");
    try {
      setLoading(true);

      // Determinar el nuevo estado según el estado actual
      let nuevoEstado;
      if (clienteStatus === "Activo") {
        nuevoEstado = "Inactivo";
      } else {
        // Tanto para "Inactivo" como para "Pendiente", el nuevo estado será "Activo"
        nuevoEstado = "Activo";
      }

      console.log(`Cambiando estado de ${clienteStatus} a ${nuevoEstado}`);

      // Obtener el ID real del cliente
      if (!clienteData.id_cliente) {
        throw new Error("No se pudo obtener el ID del cliente para actualizar");
      }

      const clienteIdReal = clienteData.id_cliente;
      console.log("ID del cliente para actualización:", clienteIdReal);

      // Preparar los datos para actualizar
      const clienteToUpdate = {
        cedula: clienteData.cedula || "",
        nombre_completo_cliente:
          `${clienteData.nombre} ${clienteData.apellido}`.trim(),
        direccion: clienteData.direccion || "",
        telefono: clienteData.celular || "",
        rut_nit: clienteData.nit || "",
        razon_social: clienteData.razonSocial || "",
        estado: nuevoEstado,
        id_zona_de_trabajo: clienteData.id_zona_de_trabajo || 1,
      };

      console.log("Datos a enviar para actualización:", clienteToUpdate);

      // Llamar directamente a clientService para actualizar
      try {
        console.log("Llamando a clientService.updateClient...");
        const updateResponse = await clientService.updateClient(
          clienteIdReal,
          clienteToUpdate
        );
        console.log(
          "Respuesta de actualización (clientService):",
          updateResponse
        );

        // Si llegamos aquí, la actualización fue exitosa
        console.log(
          `Cliente ${
            nuevoEstado === "Activo" ? "habilitado" : "inhabilitado"
          } correctamente`
        );

        // Actualizar el estado local
        setClienteStatus(nuevoEstado);
        setClienteData((prev) => ({
          ...prev,
          estado: nuevoEstado,
        }));

        // Mostrar mensaje de éxito
        setSuccessMessage(
          `Cliente ${
            nuevoEstado === "Activo" ? "activado" : "desactivado"
          } correctamente.`
        );
      } catch (serviceError) {
        console.error(
          "Error al usar clientService.updateClient:",
          serviceError
        );

        // Intentar como método alternativo usando fetch directamente
        console.log("Intentando actualización con fetch directo...");
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await fetch(
          `https://backendareasandclients-apgba5dxbrbwb2ex.eastus2-01.azurewebsites.net/update-client/${clienteIdReal}`,
          {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(clienteToUpdate),
          }
        );

        const responseText = await response.text();
        console.log("Respuesta de actualización (fetch):", responseText);

        if (response.ok) {
          console.log(
            `Cliente ${
              nuevoEstado === "Activo" ? "habilitado" : "inhabilitado"
            } correctamente`
          );

          // Actualizar el estado local
          setClienteStatus(nuevoEstado);
          setClienteData((prev) => ({
            ...prev,
            estado: nuevoEstado,
          }));

          // Mostrar mensaje de éxito
          setSuccessMessage(
            `Cliente ${
              nuevoEstado === "Activo" ? "activado" : "desactivado"
            } correctamente.`
          );
        } else {
          try {
            const errorData = JSON.parse(responseText);
            throw new Error(
              `Error ${response.status}: ${
                errorData.error || response.statusText
              }`
            );
          } catch (e) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
        }
      }
    } catch (err) {
      console.error("Error al cambiar estado del cliente:", err);
      setError(
        "Error al cambiar el estado del cliente: " +
          (err.message || "Error desconocido")
      );
    } finally {
      setLoading(false);
      setShowAlert(false);
    }
  };

  const handleEditarCliente = () => {
    // Guardar la ruta de origen en localStorage
    localStorage.setItem("rutaOrigenEdicion", `/ver/cliente/${id}`);
    // Navegar a la página de edición con el ID del cliente
    navigate(`/editar-cliente/${id}`);
  };

  const handleVolver = () => {
    navigate("/gestion/clientes");
  };

  // Determinar texto y color del botón según el estado
  const getButtonConfig = () => {
    switch (clienteStatus) {
      case "Activo":
        return {
          tipo: "secundario",
          label: "Activo",
          colorClass: "bg-green-100 text-green-800",
        };
      case "Inactivo":
        return {
          tipo: "cancelar",
          label: "Inactivo",
          colorClass: "bg-red-100 text-red-800",
        };
      case "Pendiente":
        return {
          tipo: "cancelar",
          label: "Pendiente",
          colorClass: "bg-yellow-100 text-yellow-800",
        };
      default:
        return {
          tipo: "secundario",
          label: "Estado",
          colorClass: "bg-slate-100 text-slate-800",
        };
    }
  };

  const buttonConfig = getButtonConfig();

  // Determinar el mensaje para el diálogo de confirmación
  const getAlertText = () => {
    if (clienteStatus === "Activo") {
      return "¿Confirmas la inhabilitación del cliente?";
    } else if (clienteStatus === "Inactivo") {
      return "¿Confirmas la habilitación del cliente?";
    } else if (clienteStatus === "Pendiente") {
      return "¿Confirmas la activación del cliente?";
    } else {
      return "¿Deseas cambiar el estado del cliente?";
    }
  };

  if (loading && !clienteData.id_cliente) {
    return (
      <div className="min-h-screen bg-slate-100 ml-16 md:ml-64 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <Tipografia className="mt-4 text-gray-600">
            Cargando información del cliente...
          </Tipografia>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-16 pl-1 md:ml-20 py-8 px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <button onClick={handleVolver} className="mr-4">
              <Icono name="volver" size={45} color="#F78220" />
            </button>
            <Tipografia size="xl" className="font-semibold text-gray-800">
              Detalles del Cliente
            </Tipografia>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mr-2 ml-2">
            <Botones
              tipo="primario"
              label="Editar Cliente"
              onClick={handleEditarCliente}
              className="sm:order-2"
            />
            <Botones
              tipo={buttonConfig.tipo}
              label={buttonConfig.label}
              onClick={handleShowAlert}
              className="sm:order-1"
            />
          </div>
        </div>

        {/* Mensajes de éxito */}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
            <div className="flex items-center">
              <svg
                className="h-6 w-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <div className="flex items-center">
              <svg
                className="h-6 w-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tarjeta de información principal */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-1">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-5 px-2">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3 shadow-md">
                  <span className="text-2xl font-bold text-orange-500">
                    {clienteData.nombre.charAt(0)}
                    {clienteData.apellido.charAt(0)}
                  </span>
                </div>
                <Tipografia
                  variant="h2"
                  className="text-white text-center text-xl font-semibold"
                >
                  {clienteData.razonSocial ||
                    `${clienteData.nombre} ${clienteData.apellido}`.trim()}
                </Tipografia>
                <div
                  className={`mt-3 px-4 py-1 rounded-full shadow-sm ${buttonConfig.colorClass}`}
                >
                  <span className="text-sm font-medium">
                    {clienteData.estado}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="text-center py-3 px-4 rounded-lg border border-orange-200">
                <Tipografia
                  variant="label"
                  className="text-orange-700 text-xs uppercase font-semibold block mb-1"
                >
                  NIT
                </Tipografia>
                <Tipografia className="font-bold text-gray-800">
                  {clienteData.nit}
                </Tipografia>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-100">
                  <Tipografia
                    variant="label"
                    className="text-gray-500 text-xs uppercase font-semibold block mb-1"
                  >
                    Teléfono
                  </Tipografia>
                  <Tipografia className="font-medium">
                    {clienteData.celular}
                  </Tipografia>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-100">
                  <Tipografia
                    variant="label"
                    className="text-gray-500 text-xs uppercase font-semibold block mb-1"
                  >
                    Registro
                  </Tipografia>
                  <Tipografia className="font-medium">
                    {clienteData.fechaCreacion}
                  </Tipografia>
                </div>
              </div>
            </div>
          </div>

          {/* Información detallada */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <Tipografia
              variant="h2"
              className="text-xl font-semibold mb-5 text-orange-500 border-b pb-2"
            >
              Información Detallada
            </Tipografia>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Tipografia
                  variant="label"
                  className="text-gray-600 text-xs uppercase font-semibold block mb-1"
                >
                  Razón Social
                </Tipografia>
                <div className="border border-orange-200 rounded-lg p-3 shadow-sm">
                  <Tipografia className="font-medium">
                    {clienteData.razonSocial || "No especificada"}
                  </Tipografia>
                </div>
              </div>
              <div>
                <Tipografia
                  variant="label"
                  className="text-gray-600 text-xs uppercase font-semibold block mb-1"
                >
                  Nombre
                </Tipografia>
                <div className="border border-orange-200 rounded-lg p-3 shadow-sm">
                  <Tipografia className="font-medium">
                    {clienteData.nombre}
                  </Tipografia>
                </div>
              </div>
              <div>
                <Tipografia
                  variant="label"
                  className="text-gray-600 text-xs uppercase font-semibold block mb-1"
                >
                  Apellido
                </Tipografia>
                <div className="border border-orange-200 rounded-lg p-3 shadow-sm">
                  <Tipografia className="font-medium">
                    {clienteData.apellido}
                  </Tipografia>
                </div>
              </div>
              <div>
                <Tipografia
                  variant="label"
                  className="text-gray-600 text-xs uppercase font-semibold block mb-1"
                >
                  Teléfono Celular
                </Tipografia>
                <div className="border border-orange-200 rounded-lg p-3 shadow-sm">
                  <Tipografia className="font-medium">
                    {clienteData.celular}
                  </Tipografia>
                </div>
              </div>
              <div>
                <Tipografia
                  variant="label"
                  className="text-gray-600 text-xs uppercase font-semibold block mb-1"
                >
                  NIT
                </Tipografia>
                <div className="border border-orange-200 rounded-lg p-3 shadow-sm">
                  <Tipografia className="font-medium">
                    {clienteData.nit}
                  </Tipografia>
                </div>
              </div>
              <div className="md:col-span-2">
                <Tipografia
                  variant="label"
                  className="text-gray-600 text-xs uppercase font-semibold block mb-1"
                >
                  Dirección
                </Tipografia>
                <div className="border border-orange-200 rounded-lg p-3 shadow-sm">
                  <Tipografia className="font-medium">
                    {clienteData.direccion}
                  </Tipografia>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-xs sm:max-w-sm md:max-w-md w-full mx-auto">
            <div className="flex items-center justify-center mb-4">
              {clienteStatus !== "Activo" ? (
                <Icono
                  name="confirmar"
                  size="50"
                  className="text-green-500 md:text-6xl"
                />
              ) : (
                <Icono
                  name="eliminarAlert"
                  size="50"
                  className="text-red-500 md:text-6xl"
                />
              )}
            </div>
            <Tipografia className="font-bold mb-4 text-base md:text-lg">
              {getAlertText()}
            </Tipografia>
            <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-3">
              <Botones
                onClick={() => setShowAlert(false)}
                label="Cancelar"
                tipo="cancelar"
                className="w-full sm:w-auto text-sm md:text-base"
              />
              <Botones
                onClick={() => {
                  console.log("Botón de confirmación presionado");
                  handleConfirmStatusChange();
                }}
                label="Confirmar"
                tipo={clienteStatus !== "Activo" ? "primario" : "alerta"}
                className="w-full sm:w-auto text-sm md:text-base"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerCliente;
