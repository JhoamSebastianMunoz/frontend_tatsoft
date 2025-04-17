import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Sidebar from "../../organisms/Sidebar";
import AlertaInhabilitar from "../../pages/administrator/AlertaInhabilitar";
import { clientService } from "../../../context/services/ApiService";
import { IoArrowBack } from "react-icons/io5";

const VerCliente = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [clienteStatus, setClienteStatus] = useState("Activo");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
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
          colorClass: "bg-green-100 text-green-800"
        };
      case "Inactivo":
        return {
          tipo: "alerta",
          label: "Inactivo",
          colorClass: "bg-red-100 text-red-800"
        };
      case "Pendiente":
        return {
          tipo: "cancelar",
          label: "Pendiente",
          colorClass: "bg-yellow-100 text-yellow-800"
        };
      default:
        return {
          tipo: "secundario",
          label: "Estado",
          colorClass: "bg-slate-100 text-slate-800"
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

  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 ml-16 md:ml-64 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <Tipografia variant="h2" className="text-red-600 font-semibold mb-4">
            Error
          </Tipografia>
          <Tipografia className="text-gray-600 mb-6">{error}</Tipografia>
          <Botones
            tipo="primario"
            label="Volver a clientes"
            onClick={handleVolver}
          />
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
              <IoArrowBack className="text-gray-600 text-2xl hover:text-orange-500 transition-colors" />
            </button>
            <Tipografia className="text-2xl font-bold text-gray-800">
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
                  {clienteData.razonSocial || `${clienteData.nombre} ${clienteData.apellido}`.trim()}
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
        <AlertaInhabilitar
          onClose={handleCloseAlert}
          onConfirm={handleConfirmStatusChange}
          alertText={getAlertText()}
          isEnabling={clienteStatus !== "Activo"}
        />
      )}
    </div>
  );
};

export default VerCliente;