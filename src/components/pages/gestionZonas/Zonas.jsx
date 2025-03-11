import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { areaService, clientService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";
import BarraZona from "../../../components/molecules/BarraZonas";
import Encabezado from "../../../components/molecules/Encabezado";

const Zonas = () => {
  const navigate = useNavigate();
  const [zonas, setZonas] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar zonas al iniciar
  useEffect(() => {
    const fetchZonas = async () => {
      try {
        setLoading(true);
        const response = await areaService.getAllAreas();
        const zonasData = response.data;
        setZonas(zonasData);
        
        // Seleccionar la primera zona por defecto si hay zonas
        if (zonasData.length > 0) {
          setZonaSeleccionada(zonasData[0]);
        }
      } catch (error) {
        console.error("Error al cargar zonas:", error);
        setError("Error al cargar las zonas. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchZonas();
  }, []);

  // Cargar clientes cuando cambia la zona seleccionada
  useEffect(() => {
    const fetchClientes = async () => {
      if (!zonaSeleccionada) return;
      
      try {
        setLoading(true);
        const response = await areaService.getClientsInArea(zonaSeleccionada.id_zona_de_trabajo);
        setClientes(response.data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        setError("Error al cargar los clientes. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (zonaSeleccionada) {
      fetchClientes();
    }
  }, [zonaSeleccionada]);

  const handleZonaChange = (index) => {
    setZonaSeleccionada(zonas[index]);
  };

  const handleNuevoCliente = () => {
    // Redirigir a la página de creación de cliente
    navigate("/registrar-cliente");
  };

  const handleRealizarPreventa = (clienteId) => {
    // Redirigir a la página de preventa con el ID del cliente
    navigate(`/preventa/cliente/${clienteId}`);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Encabezado 
        mensaje="Zonas" 
        ruta="/perfil"
      />

      {/* Mensaje de error */}
      {error && (
        <div className="mx-4 my-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Sección de Zonas */}
      <div className="flex items-center justify-center gap-2 p-4 flex-wrap">
        {loading && !zonas.length ? (
          <Tipografia>Cargando zonas...</Tipografia>
        ) : zonas.length > 0 ? (
          <BarraZona 
            opciones={zonas.map(zona => zona.nombre_zona_trabajo)} 
            onSelect={handleZonaChange}
          />
        ) : (
          <Tipografia>No hay zonas disponibles.</Tipografia>
        )}
      </div>

      {/* Título y Botón Nuevo Cliente */}
      <div className="flex justify-between items-center px-6">
        <h3 className="text-2xl font-bold text-purple-700">
          {zonaSeleccionada ? zonaSeleccionada.nombre_zona_trabajo : "Selecciona una zona"}
        </h3>
        <Boton
          label="Nuevo Cliente"
          tipo="primario"
          onClick={handleNuevoCliente}
        />
      </div>

      {/* Lista de Clientes */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
        {loading && zonaSeleccionada ? (
          <div className="col-span-full text-center">
            <Tipografia>Cargando clientes...</Tipografia>
          </div>
        ) : clientes.length > 0 ? (
          clientes.map((cliente) => (
            <div key={cliente.id_cliente} className="bg-white p-4 shadow-lg rounded-lg">
              <p><strong>CC:</strong> {cliente.cedula}</p>
              <p><strong>Nombre:</strong> {cliente.nombre_completo_cliente}</p>
              <p><strong>Nit:</strong> {cliente.rut_nit}</p>
              <p><strong>Razón Social:</strong> {cliente.razon_social}</p>
              <p><strong>Teléfono:</strong> {cliente.telefono}</p>
              <button 
                className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg"
                onClick={() => handleRealizarPreventa(cliente.id_cliente)}
              >
                Realizar preventa
              </button>
            </div>
          ))
        ) : zonaSeleccionada ? (
          <div className="col-span-full text-center text-gray-500">
            No hay clientes en esta zona.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Zonas;