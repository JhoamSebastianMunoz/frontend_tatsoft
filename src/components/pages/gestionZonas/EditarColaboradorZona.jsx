import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { areaService } from "../../../context/services/ApiService";
import Tipografia from '../../../components/atoms/Tipografia';

const EditarColaboradorZona = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID de la zona
  const [zonaData, setZonaData] = useState({ nombre_zona_trabajo: "Zona" });
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar datos de la zona y sus colaboradores
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener detalles de la zona
        if (id) {
          const zonaResponse = await areaService.getAreaById(id);
          setZonaData(zonaResponse.data);
          
          // En una implementación real, aquí obtendríamos los colaboradores asignados a esta zona
          // Por ahora, usamos datos estáticos
          // Esto debería reemplazarse con una llamada a la API como:
          // const colaboradoresResponse = await areaService.getColaboradoresByZona(id);
          // setColaboradores(colaboradoresResponse.data);
          
          // Datos estáticos para demostración
          const colaboradoresEstaticos = [
            { id: 1, nombre: "María Camila Uribe", cel: "3133490202", rol: "Colaborador" },
            { id: 2, nombre: "Estefania Nieto Gonzalez", cel: "3133490202", rol: "Colaborador" },
            { id: 3, nombre: "Gisela Rivera Londoño", cel: "3133490202", rol: "Colaborador" },
            { id: 4, nombre: "Jhoan Sebastian Muñoz", cel: "3133490202", rol: "Colaborador" },
          ];
          
          setColaboradores(colaboradoresEstaticos);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar datos. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRemoveColaborador = async (colaboradorId) => {
    try {
      // En una implementación real, aquí llamaríamos a la API para eliminar la asignación
      // await areaService.removeColaboradorFromZona(id, colaboradorId);
      
      // Por ahora, solo actualizamos el estado local
      setColaboradores(prev => prev.filter(col => col.id !== colaboradorId));
      console.log(`Eliminar colaborador con ID: ${colaboradorId}`);
    } catch (err) {
      console.error("Error al eliminar colaborador:", err);
      setError("Error al eliminar colaborador. Por favor, intenta de nuevo más tarde.");
    }
  };

  const handleAgregarClick = () => {
    navigate(`/gestion-zonas/asignar/${id}`);
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white">
        <Tipografia>Cargando colaboradores...</Tipografia>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
        <button
          onClick={() => navigate(`/gestion-zonas/colaboradores/${id}`)}
          className="text-white flex items-center justify-center rounded-full bg-white bg-opacity-30 h-10 w-10"
        >
          <span className="text-2xl">&#8592;</span>
        </button>
        <Tipografia variant="h1" size="xl" className="text-white font-medium">
          {zonaData.nombre_zona_trabajo}
        </Tipografia>
        <div className="w-10"></div> {/* Espacio para equilibrar el header */}
      </div>
     
      {error && (
        <div className="px-6 py-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Editando título */}
      <div className="text-center my-4">
        <Tipografia variant="h2" size="lg" className="text-gray-700">
          Editando
        </Tipografia>
      </div>
      
      {/* Botón Agregar */}
      <div className="px-6 mb-4">
        <button
          onClick={handleAgregarClick}
          className="bg-purple-500 text-white py-2 px-6 rounded-md"
        >
          Agregar
        </button>
      </div>
     
      {/* Lista de colaboradores en dos columnas */}
      <div className="px-6 flex-grow overflow-auto">
        {colaboradores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {colaboradores.map((colaborador) => (
              <div
                key={colaborador.id}
                className="border rounded-lg p-4 relative"
              >
                <button
                  onClick={() => handleRemoveColaborador(colaborador.id)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                >
                  ✕
                </button>
                <Tipografia>
                  <div className="mb-1">
                    <span className="font-medium">Nombre:</span> {colaborador.nombre}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">Cel:</span> {colaborador.cel}
                  </div>
                  <div>
                    <span className="font-medium">Rol:</span> {colaborador.rol}
                  </div>
                </Tipografia>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Tipografia className="text-gray-500">
              No hay colaboradores asignados a esta zona.
            </Tipografia>
            <button
              onClick={handleAgregarClick}
              className="mt-4 bg-purple-500 text-white py-2 px-6 rounded-md"
            >
              Asignar Colaboradores
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditarColaboradorZona;