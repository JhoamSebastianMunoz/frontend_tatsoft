import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../context/services/ApiService";
import Encabezado from "../../../components/molecules/Encabezado";
import Boton from "../../../components/atoms/Botones";
import Buscador from "../../../components/molecules/Buscador";
import FiltroOpciones from "../../../components/molecules/FiltroOpciones";
import Card from "../../../components/organisms/Card";
import Tipografia from "../../../components/atoms/Tipografia";

const GestionUsuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar usuarios al iniciar
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const response = await userService.getAllUsers();
        setUsuarios(response.data);
        setFilteredUsuarios(response.data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setError("Error al cargar la lista de usuarios. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Filtrar usuarios cuando cambia el filtro o la búsqueda
  useEffect(() => {
    let results = usuarios;
    
    // Filtrar por rol
    if (filtro !== "Todos") {
      results = results.filter(usuario => 
        usuario.rol === filtro.toUpperCase());
    }
    
    // Filtrar por término de búsqueda
    if (busqueda) {
      const searchTerm = busqueda.toLowerCase();
      results = results.filter(
        usuario => usuario.nombreCompleto.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredUsuarios(results);
  }, [usuarios, filtro, busqueda]);

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const handleFiltroChange = (opcion) => {
    setFiltro(opcion);
  };

  const handleRegistrarUsuario = () => {
    navigate("/registrar/usuario");
  };

  return (
    <div className="min-h-screen">
      <div className="mb-2">
        <Encabezado mensaje="Gestión de usuario" />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div>
        <Buscador
          placeholder="Buscar Usuario"
          onChange={handleBusquedaChange}
        />
      </div>

      <div className="m-1 p-2 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <FiltroOpciones
          opciones={["Todos", "COLABORADOR", "ADMINISTRADOR"]}
          onChange={handleFiltroChange}
          className="w-full sm:w-auto"
        />
        <Boton
          label="Registrar Usuario"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg sm:ml-4"
          onClick={handleRegistrarUsuario}
        />
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Tipografia>
            <p className="text-lg">Cargando usuarios...</p>
          </Tipografia>
        </div>
      ) : (
        <div className="flex justify-center mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-3 px-4 md:px-10 lg:px-20 w-full justify-items-center">
            {filteredUsuarios.length > 0 ? (
              filteredUsuarios.map((usuario) => (
                <Card
                  key={usuario.id_usuario}
                  nombre={usuario.nombreCompleto}
                  celular={usuario.celular}
                  Rol={usuario.rol}
                  onView={() => navigate(`/ver/usuario/${usuario.id_usuario}`)}
                  onEdit={() => navigate(`/editar/usuario/${usuario.id_usuario}`)}
                  onDisable={() => console.log("Inhabilitar usuario", usuario.id_usuario)}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">
                No se encontraron usuarios.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;
