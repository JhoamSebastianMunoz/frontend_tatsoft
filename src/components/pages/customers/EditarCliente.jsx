import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { clientService } from "../../../context/services/ApiService";
import CampoTextoProfile from "../../atoms/CamposTextoProfile";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import CampoTexto from "../../atoms/CamposTexto";
import AlertaEdicion from "../../pages/administrator/AlertaEdicion";
import Icono from "../../atoms/Iconos";

const EditarCliente = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    razonSocial: propRazonSocial,
    nombre: propNombre,
    apellido: propApellido,
    celular: propCelular,
    nit: propNit,
    direccion: propDireccion,
    correo: propCorreo,
    rutaOrigen, 
  } = props;
  
  const [clienteData, setClienteData] = useState({
    razonSocial: "",
    nombre: "",
    apellido: "",
    celular: "",
    nit: "",
    direccion: "",
    correo: "",
    cedula: "",
    estado: "Activo",
    id_zona_de_trabajo: 1
  });

  const [originalData, setOriginalData] = useState({});
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [origenRuta, setOrigenRuta] = useState("/gestion/clientes"); 
  const [dataModified, setDataModified] = useState(false);
  const [navigateAfterCancel, setNavigateAfterCancel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const response = await clientService.getClientById(id);
        console.log("Datos del cliente recibidos:", response.data);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const cliente = response.data[0];
          console.log("Cliente extraído:", cliente);
          
          const nombreCompleto = cliente.nombre_completo_cliente ? cliente.nombre_completo_cliente.split(' ') : ['', ''];
          
          const mappedData = {
            razonSocial: cliente.razon_social || '',
            nombre: nombreCompleto[0] || '',
            apellido: nombreCompleto.slice(1).join(' ') || '',
            celular: cliente.telefono || '',
            nit: cliente.rut_nit || '',
            direccion: cliente.direccion || '',
            correo: cliente.email || '',
            cedula: cliente.cedula || '',
            estado: cliente.estado || 'Activo',
            id_zona_de_trabajo: cliente.id_zona_de_trabajo || 1
          };
          
          console.log("Datos mapeados:", mappedData);
          setClienteData(mappedData);
          setOriginalData(mappedData);
        } else {
          console.error("No se encontraron datos de cliente válidos");
          setError("No se pudieron encontrar los datos del cliente");
        }
      } catch (err) {
        console.error("Error al cargar datos del cliente:", err);
        setError("Error al cargar los datos del cliente: " + (err.message || "Error desconocido"));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClientData();
    }
  }, [id]);

  useEffect(() => {
    try {
      if (rutaOrigen) {
        setOrigenRuta(rutaOrigen);
        localStorage.setItem('rutaOrigenEdicion', rutaOrigen);
      } else {
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
  }, [rutaOrigen, location]);

  useEffect(() => {
    const isModified = JSON.stringify(clienteData) !== JSON.stringify(originalData);
    setDataModified(isModified);
  }, [clienteData, originalData]);

  const handleChange = (field, value) => {
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
    
    if (field === "celular" && stringValue !== '') {
      if (!/^\d*$/.test(stringValue)) {
        return;
      }
    }
    
    if (field === "correo" && stringValue !== '') {
      if (stringValue.indexOf('@') === -1) {
        if (stringValue.indexOf('@') !== -1) {
        }
      }
    }
    
    if (field === "cedula" && stringValue !== '') {
      if (!/^\d*$/.test(stringValue)) {
        return;
      }
    }
    
    setClienteData(prev => ({
      ...prev,
      [field]: stringValue
    }));
  };

  const handleSave = async () => {
    try {
      const clienteToUpdate = {
        cedula: clienteData.cedula,
        nombre_completo_cliente: `${clienteData.nombre} ${clienteData.apellido}`.trim(),
        direccion: clienteData.direccion,
        telefono: clienteData.celular,
        rut_nit: clienteData.nit || "",
        razon_social: clienteData.razonSocial || "",
        email: clienteData.correo || "",
        id_zona_de_trabajo: clienteData.id_zona_de_trabajo || 1,
        estado: "Activo"
      };

      console.log("Enviando datos al servidor:", clienteToUpdate);

      const token = localStorage.getItem('token');
      
      const response = await fetch(`https://backendareasandclients-apgba5dxbrbwb2ex.eastus2-01.azurewebsites.net/update-client/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clienteToUpdate)
      });
      
      const responseText = await response.text();
      console.log("Respuesta completa (texto):", responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log("Respuesta parseada:", responseData);
      } catch (e) {
        console.log("No se pudo parsear la respuesta como JSON");
      }
      
      if (!response.ok) {
        if (responseData && responseData.errors) {
          console.log("Errores detallados:", responseData.errors);
          
          responseData.errors.forEach((error, index) => {
            console.log(`Error ${index + 1}:`, error);
            console.log("  - Ruta:", error.path || error.param);
            console.log("  - Mensaje:", error.msg);
            console.log("  - Valor:", error.value);
          });
          
          const errorMessages = responseData.errors
            .map(e => `${e.path || e.param || 'campo'}: ${e.msg}`)
            .join(", ");
          
          throw new Error(`Validación fallida: ${errorMessages}`);
        }
        
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      console.log("Cliente actualizado correctamente");
      setOriginalData({...clienteData});
      setDataModified(false);
      
      setShowSuccessAlert(true);
      
      setTimeout(() => {
        console.log("Redirigiendo automáticamente después de la actualización exitosa");
        navigate("/gestion/clientes", { replace: true });
      }, 2000);
      
    } catch (err) {
      console.error("Error completo:", err);
      setError(err.message || "Error al actualizar cliente");
    }
  };

  const handleConfirmSave = () => {
    setShowSaveAlert(false);
    setShowSuccessAlert(true);
  };

  const handleCancel = () => {
    navigate("/gestion/clientes", { replace: true });
  };

  const handleVolver = () => {
    if (dataModified) {
      setNavigateAfterCancel(true);
      setShowCancelAlert(true);
    } else {
      navigate(origenRuta);
    }
  };

  const confirmCancel = () => {
    setClienteData({...originalData});
    setDataModified(false);
    setShowCancelAlert(false);
    
    setTimeout(() => {
      console.log("Redirigiendo a la ruta de gestión de clientes después de descartar cambios");
      navigate("/gestion/clientes", { replace: true });
    }, 100);
  };

  const closeCancelAlert = () => {
    setShowCancelAlert(false);
    setNavigateAfterCancel(false);
  };

  const handleCloseAlert = () => {
    setShowSaveAlert(false);
    setShowSuccessAlert(true);
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
    console.log("Redirigiendo después de cerrar alerta de éxito");
    navigate("/gestion/clientes", { replace: true });
  };

  const nombreStr = clienteData.nombre || '';
  const apellidoStr = clienteData.apellido || '';
  const fullName = clienteData.razonSocial || `${nombreStr} ${apellidoStr}`.trim();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Tipografia>Cargando datos del cliente...</Tipografia>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <Tipografia>{error}</Tipografia>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">  
      <div className="max-w-4xl mx-auto px-10 py-3">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-slate-100 p-6 relative">
            <div className="absolute top-5 left-3 cursor-pointer" onClick={handleVolver}>
              <Icono name="volver" size={45} color="white" />
            </div>
            
            <div className="flex flex-col items-center mt-2">
              {clienteData.razonSocial && (
                <div className="px-4 py-1 bg-orange-500 bg-opacity-70 rounded-full">
                  <Tipografia className="text-white">{clienteData.razonSocial}</Tipografia>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <Tipografia size="xl" className="font-semibold text-gray-600">
                Editando Cliente
              </Tipografia>
              {dataModified && (
                <div className="bg-orange-100 px-3 py-1 rounded-full">
                  <span className="text-sm text-orange-500 font-medium">Cambios sin guardar</span>
                </div>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="shadow-md p-7 rounded-xl">
                <Tipografia className="text-orange-700 font-medium mb-4">
                  Información Básica
                </Tipografia>
                <div className="space-y-5">
                  <CampoTextoProfile 
                    label="Cédula" 
                    value={clienteData.cedula}
                    editable={true}
                    onChange={(value) => handleChange("cedula", value)}
                  />
                  <CampoTextoProfile 
                    label="Razón Social" 
                    value={clienteData.razonSocial}
                    editable={true}
                    onChange={(value) => handleChange("razonSocial", value)}
                  />
                  <CampoTextoProfile 
                    label="Nombre" 
                    value={clienteData.nombre}
                    editable={true}
                    onChange={(value) => handleChange("nombre", value)}
                  />
                  <CampoTextoProfile 
                    label="Apellido" 
                    value={clienteData.apellido}
                    editable={true}
                    onChange={(value) => handleChange("apellido", value)}
                  />
                  <CampoTextoProfile
                    label="NIT" 
                    value={clienteData.nit}
                    editable={true}
                    onChange={(value) => handleChange("nit", value)}
                  />
                </div>
              </div>

              <div className="p-7 shadow-md rounded-xl">
                <Tipografia className="text-orange-700 font-medium mb-4">
                  Información de Contacto
                </Tipografia>
                <div className="space-y-5">
                  <CampoTextoProfile 
                    label="Dirección" 
                    value={clienteData.direccion}
                    editable={true}
                    onChange={(value) => handleChange("direccion", value)}
                    type="text"
                  />
                  <CampoTextoProfile 
                    label="Celular" 
                    value={clienteData.celular}
                    editable={true}
                    onChange={(value) => handleChange("celular", value)}
                    type="text"
                  />
                  <CampoTextoProfile 
                    label="Correo Electrónico" 
                    value={clienteData.correo}
                    editable={true}
                    onChange={(value) => handleChange("correo", value)}
                    type="text"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-center w-full gap-3 pb-4">
              <Boton 
                tipo="primario" 
                label="Guardar Cambios" 
                onClick={handleSave}
                className="w-full sm:w-auto px-4 py-2"
              />
              <Boton
                tipo="cancelar"
                label="Cancelar"
                onClick={handleCancel}
                className="w-full sm:w-auto px-4 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {showSaveAlert && (
        <AlertaEdicion 
          onClose={() => setShowSaveAlert(false)} 
          onConfirm={handleConfirmSave} 
          onCancel={() => setShowSaveAlert(false)}
        />
      )}
      
      {showSuccessAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-4">
               <Icono name="confirmar" size="65"/>
              </div>
              <Tipografia size="lg" className="font-bold mb-2">¡Cliente actualizado exitosamente!</Tipografia>
              <Tipografia className="text-gray-600 mb-4">
                Los cambios se han guardado correctamente. Serás redirigido a la lista de clientes.
              </Tipografia>
              <Boton
                tipo="primario"
                label="Aceptar"
                size="large"
                onClick={handleCloseSuccessAlert}
              />
            </div>
          </div>
        </div>
      )}

      {showCancelAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-4">
                <Icono name="eliminarAlert" size="80"/>
              </div>
              <Tipografia size="lg" className="font-bold mb-2">¿Estás seguro?</Tipografia>
              <Tipografia className="mb-4">Hay cambios sin guardar. Si continúas, perderás todos los cambios realizados.</Tipografia>
              <div className="flex flex-col sm:flex-row w-full gap-3">
                <Boton
                  tipo="primario"
                  label="Descartar cambios"
                  size="small"
                  onClick={confirmCancel}
                  className="w-full"
                />
                <Boton
                  tipo="secundario"
                  label="Seguir editando"
                  size="small"
                  onClick={closeCancelAlert}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarCliente;