import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService, areaService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Icono from "../../../components/atoms/Iconos";

const AsignacionZonas = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID de la zona
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColaboradores, setSelectedColaboradores] = useState([]);
  const [colaboradoresList, setColaboradoresList] = useState([]);
  const [zonaNombre, setZonaNombre] = useState("Zona");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar datos de la zona y colaboradores disponibles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener detalles de la zona
        if (id) {
          const zonaResponse = await areaService.getAreaById(id);
          setZonaNombre(zonaResponse.data.nombre_zona_trabajo || "Zona");
        }
        
        // Obtener todos los colaboradores
        const colaboradoresResponse = await userService.getAllUsers();
        const colaboradores = colaboradoresResponse.data
          .filter(user => user.rol === "COLABORADOR") // Solo mostrar colaboradores
          .map(user => ({
            id: user.id_usuario,
            nombre: user.nombreCompleto,
            cel: user.celular,
            rol: user.rol,
            selected: false
          }));
        
        setColaboradoresList(colaboradores);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar datos. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
   
    if (value.trim() === "") {
      // Restaurar la lista completa sin filtrar
      setColaboradoresList(prev => 
        prev.map(col => ({...col, selected: selectedColaboradores.includes(col.id)}))
      );
    } else {
      // Filtrar colaboradores por nombre, manteniendo el estado de selección
      const filteredColaboradores = colaboradoresList
        .map(col => ({...col}))
        .filter(colaborador =>
          colaborador.nombre.toLowerCase().includes(value.toLowerCase())
        );
      
      setColaboradoresList(filteredColaboradores);
    }
  };

  const handleSelectColaborador = (id) => {
    setColaboradoresList(prev => prev.map(colaborador => {
      if (colaborador.id === id) {
        return { ...colaborador, selected: !colaborador.selected };
      }
      return colaborador;
    }));
   
    setSelectedColaboradores(prev => {
      if (prev.includes(id)) {
        return prev.filter(colId => colId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleAsignar = async () => {
    if (selectedColaboradores.length === 0) {
      alert("Por favor seleccione al menos un colaborador");
      return;
    }

    try {
      setLoading(true);
      
      // Llamada a la API para asignar zonas a los colaboradores seleccionados
      await userService.assignZonasToUser(id, selectedColaboradores);
      
      alert(`Colaboradores asignados con éxito a ${zonaNombre}`);
      navigate(`/gestion-zonas/colaboradores/${id}`);
    } catch (err) {
      console.error("Error al asignar colaboradores:", err);
      setError("Error al asignar colaboradores. Por favor, intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Función para agrupar colaboradores en filas de 3
  const chunkedColaboradores = () => {
    const result = [];
    for (let i = 0; i < colaboradoresList.length; i += 3) {
      result.push(colaboradoresList.slice(i, i + 3));
    }
    return result;
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
      <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
        <button
          onClick={() => navigate(`/gestion-zonas/colaboradores/${id}`)}
          className="text-white flex items-center justify-center rounded-full bg-white bg-opacity-30 h-10 w-10 hover:bg-opacity-40 transition-all duration-200"
        >
          <Icono name="flecha-izquierda" size={24} />
        </button>
        <span className="text-xl font-medium">{zonaNombre}</span>
        <div className="w-10"></div> {/* Espacio para equilibrar el header */}
      </div>
     
      {error && (
        <div className="px-6 py-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="px-6 pt-4 pb-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar colaborador"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 pl-4 pr-10 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icono name="buscar" size={20} />
          </div>
        </div>
      </div>
      
      {/* Asignar button */}
      <div className="px-6 py-2">
        <button
          onClick={handleAsignar}
          className="bg-orange-500 text-white py-1.5 px-6 rounded-full text-sm hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedColaboradores.length === 0}
        >
          Asignar
        </button>
      </div>
     
      {/* Colaboradores list */}
      <div className="p-4 flex-grow overflow-auto">
        {colaboradoresList.length > 0 ? (
          chunkedColaboradores().map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row gap-4 mb-4">
              {row.map((colaborador) => (
                <div
                  key={colaborador.id}
                  className="flex-1 border rounded-lg p-4 flex flex-row items-start hover:shadow-md transition-shadow duration-200"
                >
                  <div className="mr-2 mt-1">
                    <input
                      type="checkbox"
                      checked={colaborador.selected}
                      onChange={() => handleSelectColaborador(colaborador.id)}
                      className="w-4 h-4 rounded-sm border-orange-500 text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">
                      <span className="font-medium text-sm text-gray-700">Nombre:</span> {colaborador.nombre}
                    </div>
                    <div className="mb-1">
                      <span className="font-medium text-sm text-gray-700">Cel:</span> {colaborador.cel}
                    </div>
                    <div>
                      <span className="font-medium text-sm text-gray-700">Rol:</span> {colaborador.rol}
                    </div>
                  </div>
                  <div className="h-full flex items-center">
                    <div className="w-6 h-6 bg-orange-800 rounded-md"></div>
                  </div>
                </div>
              ))}
              {/* Añadir divs vacíos para mantener la alineación en filas incompletas */}
              {row.length < 3 && Array(3 - row.length).fill().map((_, i) => (
                <div key={`empty-${i}`} className="flex-1"></div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Tipografia className="text-gray-500">
              No se encontraron colaboradores disponibles.
            </Tipografia>
          </div>
        )}
      </div>
    </div>
  );
};

export default AsignacionZonas;