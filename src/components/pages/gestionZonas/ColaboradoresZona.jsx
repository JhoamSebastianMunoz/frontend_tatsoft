import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { areaService, userService } from "../../../context/services/ApiService";
import Tipografia from '../../../components/atoms/Tipografia';


const ColaboradoresZona = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID de la zona
  const [zonaData, setZonaData] = useState({
    nombre_zona_trabajo: "",
    latitud: 0,
    longitud: 0,
    descripcion: ""
  });
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar datos de la zona y los usuarios asignados a ella
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener detalles de la zona
        if (id) {
          const zonaResponse = await areaService.getAreaById(id);
          setZonaData(zonaResponse.data);
          
          // Para obtener los colaboradores asignados a esta zona, necesitaríamos
          // una API específica que devuelva los usuarios de una zona
          // Como alternativa, podemos obtener todos los usuarios y filtrar
          // los que tienen esta zona asignada
          const usersResponse = await userService.getAllUsers();
          
          // Ahora para cada usuario, revisamos si tiene asignada esta zona
          const colaboradoresAsignados = [];
          
          for (const user of usersResponse.data) {
            if (user.rol === "COLABORADOR") {
              try {
                // Obtener las zonas asignadas a este usuario
                const zonasResponse = await userService.getUserZonas(user.id_usuario);
                
                // Verificar si esta zona está entre las asignadas al usuario
                const zonaAsignada = zonasResponse.data.zonas.some(
                  zona => zona.id_zona_de_trabajo === parseInt(id)
                );
                
                if (zonaAsignada) {
                  colaboradoresAsignados.push({
                    id: user.id_usuario,
                    nombre: user.nombreCompleto,
                    cel: user.celular,
                    rol: user.rol
                  });
                }
              } catch (error) {
                console.log(`Error al obtener zonas para usuario ${user.id_usuario}:`, error);
              }
            }
          }
          
          setColaboradores(colaboradoresAsignados);
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

  const handleEditarClick = () => {
    navigate(`/editar-zona/${id}`);
  };
  
  const handleEditarColaboradores = () => {
    navigate(`/gestion-zonas/editar-colaboradores/${id}`);
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white">
        <Tipografia>Cargando información de la zona...</Tipografia>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/gestion-zonas")}
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

      {/* Información de la zona */}
      <div className="px-6 py-4">
        <div className="border rounded-lg p-4 mb-4">
          <Tipografia>
            <div className="mb-3">
              <span className="font-medium">Ubicación:</span> Coordenadas: {zonaData.latitud || 0}, {zonaData.longitud || 0}
            </div>
            <div>
              <span className="font-medium">Descripción:</span> {zonaData.descripcion}
            </div>
          </Tipografia>
          <div className="flex justify-end mt-2">
            <button
              onClick={handleEditarClick}
              className="bg-purple-500 text-white py-1 px-6 rounded-md text-sm"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
     
      {/* Título y botón de editar colaboradores */}
      <div className="px-6 py-2 flex justify-between items-center">
        <Tipografia variant="h2" size="lg" className="text-gray-700">
          Colaboradores Asignados
        </Tipografia>
        <button
          onClick={handleEditarColaboradores}
          className="bg-purple-500 text-white py-1 px-6 rounded-md text-sm"
        >
          Editar Colaboradores
        </button>
      </div>
     
      {/* Lista de colaboradores */}
      <div className="px-6 flex-grow overflow-auto">
        {colaboradores.length > 0 ? (
          colaboradores.map((colaborador) => (
            <div
              key={colaborador.id}
              className="border rounded-lg p-4 mb-4"
            >
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
          ))
        ) : (
          <div className="text-center py-8">
            <Tipografia className="text-gray-500">
              No hay colaboradores asignados a esta zona.
            </Tipografia>
            <button
              onClick={() => navigate(`/gestion-zonas/asignar/${id}`)}
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

export default ColaboradoresZona;