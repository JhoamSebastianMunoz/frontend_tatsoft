import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { clientService, areaService } from "../../../context/services/ApiService";
import CampoTextoProfile from "../../atoms/CamposTextoProfile";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import AlertaEdicion from "../../pages/administrator/AlertaEdicion";
import Icono from "../../atoms/Iconos";
import Loading from "../../Loading/Loading";

const EditarCliente = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [clienteData, setClienteData] = useState({
    razon_social: "",
    nombre_completo_cliente: "",
    telefono: "",
    rut_nit: "",
    direccion: "",
    correo: "",
    id_zona_de_trabajo: "",
    estado: "Activo"
  });
  
  const [originalData, setOriginalData] = useState({});
  const [zonas, setZonas] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [origenRuta, setOrigenRuta] = useState("/ver/cliente");
  const [editMode, setEditMode] = useState(true);
  const [dataModified, setDataModified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar datos del cliente
  useEffect(() => {
    const fetchClienteData = async () => {
      if (!id) {
        setError("ID de cliente no proporcionado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Obteniendo datos del cliente con ID:", id);
        
        // Cargar cliente
        const response = await clientService.getClientById(id);
        console.log("Respuesta de datos del cliente:", response);
        
        if (response && response.data) {
          const clienteInfo = response.data;
          console.log("Datos del cliente cargados:", clienteInfo);
          
          // Actualizar los estados con los datos obtenidos
          setClienteData(clienteInfo);
          setOriginalData({...clienteInfo});
        } else {
          throw new Error("No se pudieron obtener los datos del cliente");
        }
      } catch (err) {
        console.error("Error al cargar datos del cliente:", err);
        setError("Error al cargar los datos del cliente. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchClienteData();
  }, [id]);

  // Cargar zonas disponibles
  useEffect(() => {
    const fetchZonas = async () => {
      try {
        setLoading(true);
        const response = await areaService.getAllAreas();
        console.log("Respuesta de zonas:", response);
        
        if (response && response.data) {
          setZonas(response.data);
        }
      } catch (error) {
        console.error("Error al cargar zonas:", error);
        setError("Error al cargar las zonas disponibles");
      } finally {
        setLoading(false);
      }
    };

    fetchZonas();
  }, []);

  // Detectar la ruta de origen para saber dónde volver
  useEffect(() => {
    try {
      if (id) {
        const rutaGuardada = localStorage.getItem('rutaOrigenEdicion');
        if (rutaGuardada) {
          setOrigenRuta(rutaGuardada);
        } else {
          const urlParams = new URLSearchParams(location.search);
          const origen = urlParams.get('origen');
          
          if (origen === 'gestion') {
            setOrigenRuta("/gestion/clientes");
            localStorage.setItem('rutaOrigenEdicion', "/gestion/clientes");
          } else if (origen === 'ver') {
            setOrigenRuta("/ver/cliente");
            localStorage.setItem('rutaOrigenEdicion', "/ver/cliente");
          }
        }
      }
    } catch (error) {
      console.error("Error al detectar ruta de origen:", error);
    }
  }, [id, location]);

  // Detectar si los datos han sido modificados
  useEffect(() => {
    const isModified = JSON.stringify(clienteData) !== JSON.stringify(originalData);
    setDataModified(isModified);
  }, [clienteData, originalData]);

  const handleChange = (field, value) => {
    console.log(`Cambiando campo ${field} a:`, value);
    
    let stringValue = '';
    if (value && typeof value === 'object' && value.target) {
      stringValue = value.target.value;
    }
    else if (value === '' || value === null || value === undefined) {
      stringValue = '';
    }
    else {
      stringValue = String(value);
    }
    
    // Validaciones específicas para algunos campos
    if (field === "telefono" && stringValue !== '') {
      if (!/^\d*$/.test(stringValue)) {
        return;
      }
    }
    
    setClienteData(prev => {
      const newData = {
        ...prev,
        [field]: stringValue
      };
      console.log("Nuevo estado de clienteData:", newData);
      return newData;
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log("Guardando cambios, datos a enviar:", clienteData);
      
      // Preparar datos para la actualización
      const clienteToUpdate = {
        razon_social: clienteData.razon_social,
        nombre_completo_cliente: clienteData.nombre_completo_cliente,
        direccion: clienteData.direccion,
        telefono: clienteData.telefono,
        rut_nit: clienteData.rut_nit,
        correo: clienteData.correo,
        id_zona_de_trabajo: clienteData.id_zona_de_trabajo,
        estado: clienteData.estado
      };
      
      // Actualizar cliente en el backend
      const response = await clientService.updateClient(id, clienteToUpdate);
      console.log("Respuesta de actualización:", response);
      
      // Actualizar estado local
      setShowAlert(true);
      setEditMode(false);
      setOriginalData({...clienteData});
      setDataModified(false);
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      setError("Error al guardar los cambios. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Cancelando edición, restaurando datos originales");
    setClienteData({...originalData});
    setDataModified(false);
    redirigirInformacionClientes();
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setShowSuccessAlert(true);
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
    redirigirInformacionClientes();
  };

  const redirigirInformacionClientes = () => {
    const rutaFinal = origenRuta.includes("/ver/cliente") 
      ? `/ver/cliente/${id}` 
      : origenRuta;
    
    console.log("Redirigiendo a:", rutaFinal);
    localStorage.removeItem('rutaOrigenEdicion');
    navigate(rutaFinal);
  };

  const handleVolver = () => {
    if (dataModified) {
      if (window.confirm("Hay cambios sin guardar. ¿Desea salir sin guardar los cambios?")) {
        redirigirInformacionClientes();
      }
    } else {
      redirigirInformacionClientes();
    }
  };

  if (loading) {
    return <Loading message="Cargando datos del cliente..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <Boton
            tipo="primario"
            label="Volver a Clientes"
            onClick={() => navigate('/gestion/clientes')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">  
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-700 p-6 relative">
            <div className="absolute top-5 left-3 cursor-pointer" onClick={handleVolver}>
              <Icono name="volver" size={45} color="white" />
            </div>
            
            <div className="flex flex-col items-center mt-2">
              {clienteData.razon_social && (
                <div className="px-4 py-1 bg-white bg-opacity-20 rounded-full">
                  <Tipografia className="text-white">{clienteData.razon_social}</Tipografia>
                </div>
              )}
              <div className="mt-2 text-white">
                <Tipografia>{clienteData.nombre_completo_cliente}</Tipografia>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <Tipografia size="xl" className="font-semibold text-gray-600">
                {editMode ? "Editando Cliente" : "Información del Cliente"}
              </Tipografia>
              
              {dataModified && (
                <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-yellow-700">Cambios sin guardar</span>
                </div>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="shadow-md p-5 md:p-7 rounded-xl">
                <Tipografia className="text-purple-700 font-medium mb-4">
                  Información Básica
                </Tipografia>
                <div className="space-y-5">
                  <CampoTextoProfile
                    label="Razón Social"
                    value={clienteData.razon_social || ""}
                    onChange={(e) => handleChange("razon_social", e)}
                    disabled={!editMode}
                  />
                  <CampoTextoProfile
                    label="Nombre Completo"
                    value={clienteData.nombre_completo_cliente || ""}
                    onChange={(e) => handleChange("nombre_completo_cliente", e)}
                    disabled={!editMode}
                    required={true}
                  />
                  <CampoTextoProfile
                    label="NIT/RUT"
                    value={clienteData.rut_nit || ""}
                    onChange={(e) => handleChange("rut_nit", e)}
                    disabled={!editMode}
                  />
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zona de Trabajo
                    </label>
                    <select
                      className={`bg-purple-50 border border-purple-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 block w-full p-1.5 ${!editMode ? "opacity-70 cursor-not-allowed" : ""}`}
                      value={clienteData.id_zona_de_trabajo || ""}
                      onChange={(e) => handleChange("id_zona_de_trabajo", e)}
                      disabled={!editMode}
                    >
                      <option value="">Seleccionar zona</option>
                      {zonas.map(zona => (
                        <option key={zona.id_zona_de_trabajo} value={zona.id_zona_de_trabajo}>
                          {zona.nombre_zona_trabajo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="p-5 md:p-7 shadow-md rounded-xl">
                <Tipografia className="text-purple-700 font-medium mb-4">
                  Información de Contacto
                </Tipografia>
                <div className="space-y-5">
                  <CampoTextoProfile
                    label="Dirección"
                    value={clienteData.direccion || ""}
                    onChange={(e) => handleChange("direccion", e)}
                    disabled={!editMode}
                    required={true}
                  />
                  <CampoTextoProfile
                    label="Teléfono"
                    value={clienteData.telefono || ""}
                    onChange={(e) => handleChange("telefono", e)}
                    disabled={!editMode}
                    required={true}
                  />
                  <CampoTextoProfile
                    label="Correo Electrónico"
                    value={clienteData.correo || ""}
                    onChange={(e) => handleChange("correo", e)}
                    disabled={!editMode}
                  />
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      className={`bg-purple-50 border border-purple-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 block w-full p-1.5 ${!editMode ? "opacity-70 cursor-not-allowed" : ""}`}
                      value={clienteData.estado || "Activo"}
                      onChange={(e) => handleChange("estado", e)}
                      disabled={!editMode}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {editMode && (
              <div className="mt-6 flex flex-col sm:flex-row justify-center w-full gap-3 pb-4">
                <Boton
                  tipo="secundario"
                  label={loading ? "Guardando..." : "Guardar Cambios"}
                  onClick={handleSave}
                  className="w-full sm:w-auto px-4 py-2"
                  disabled={loading || !dataModified}
                />
                <Boton
                  tipo="cancelar"
                  label="Cancelar"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-4 py-2"
                  disabled={loading || !dataModified}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showAlert && (
        <AlertaEdicion 
          onClose={handleCloseAlert}
          onConfirm={handleCloseAlert}
          onCancel={() => setShowAlert(false)}
        />
      )}
      
      {showSuccessAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-4">
                <Icono name="confirmar" size="65"/>
              </div>
              <Tipografia size="lg" className="font-bold mb-2">¡Cambios guardados exitosamente!</Tipografia>
              <Boton
                tipo="primario"
                label="Aceptar"
                onClick={handleCloseSuccessAlert}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarCliente;