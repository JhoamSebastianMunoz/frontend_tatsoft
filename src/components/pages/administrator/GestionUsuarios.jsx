import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../context/services/ApiService";
import Boton from "../../../components/atoms/Botones";
import Buscador from "../../../components/molecules/Buscador";
import Tipografia from "../../../components/atoms/Tipografia";
import Loading from "../../../components/Loading/Loading";
import Sidebar from '../../organisms/Sidebar';

const scrollStyle = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const GestionUsuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  
  useEffect(() => {
    let results = usuarios;
  
    if (filtro !== "Todos") {
      results = results.filter(usuario =>
        usuario.rol === filtro.toUpperCase());
    }
    
  
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

  if (loading) {
    return <Loading message="Cargando usuarios..." />;
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <style>{scrollStyle}</style>
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      
      <div className="w-full flex-1 pl-14 sm:pl-16 md:pl-20 lg:pl-20 xl:pl-20 px-2 sm:px-4 md:px-6 lg:px-2 py-4 overflow-x-hidden bg-slate-50">
        <div className="max-w-[1600px] mx-auto">
          <Tipografia>
            <div className="w-full">
              <div className="mt-2 mb-4">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">Gestión de usuarios</h1>
              </div>

              {error && (
                <div className="mx-0 my-2 bg-red-100 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded-md">
                  <Tipografia className="text-red-700 text-sm">{error}</Tipografia>
                </div>
              )}
              
              <div className="flex flex-col space-y-3 w-full">
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 w-full">
                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
                      <Tipografia variant="subtitle" className="text-black font-bold mb-2 sm:mb-0">
                        Gestión de Usuarios
                      </Tipografia>
                      <div className="flex justify-start w-full sm:w-auto">
                        <Boton
                          label="Registrar Usuario"
                          tipo="primario"
                          onClick={handleRegistrarUsuario}
                          size="small"
                          className="w-full sm:w-auto"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="w-full">
                        <Tipografia className="text-gray-800 mb-1 px-1 text-sm">
                          Filtrar por rol:
                        </Tipografia>
                        <div className="flex overflow-x-auto pb-2 no-scrollbar gap-2">
                          {["Todos", "COLABORADOR", "ADMINISTRADOR"].map((opcion) => (
                            <button
                              key={opcion}
                              onClick={() => handleFiltroChange(opcion)}
                              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                                filtro === opcion
                                  ? 'bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-md'
                                  : 'bg-white border border-orange-200 hover:border-orange-400 text-black hover:shadow-sm'
                              }`}
                            >
                              <Tipografia className={`${
                                filtro === opcion
                                  ? 'text-white'
                                  : 'text-orange-700'
                              } text-sm`}>
                                {opcion}
                              </Tipografia>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="w-full mt-1">
                        <Buscador
                          placeholder="Buscar Usuarios"
                          onChange={handleBusquedaChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                  <div className="flex justify-between items-center">
                    <Tipografia variant="subtitle" className="text-black font-medium text-sm sm:text-base">
                      Lista de Usuarios
                    </Tipografia>
                    {filteredUsuarios.length > 0 && (
                      <div className="px-2 py-1 bg-orange-200 rounded-full text-center min-w-[60px]">
                        <Tipografia className="text-xs text-orange-800">
                          {filteredUsuarios.length} {filteredUsuarios.length === 1 ? "usuario" : "usuarios"}
                        </Tipografia>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex-1 w-full">
                  <div className="w-full">
                    {filteredUsuarios.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredUsuarios.map((usuario) => (
                          <div key={usuario.id_usuario} className="rounded-lg overflow-hidden shadow-lg hover:shadow-md transition-all duration-200">
                            <div className="bg-gray-100 px-3 py-2">
                              <Tipografia className="text-gray-600 font-medium text-sm">
                                {usuario.nombreCompleto}
                              </Tipografia>
                            </div>
                            <div className="p-2">
                              <div className="bg-white rounded-lg p-2 mb-2">
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    <div className="flex items-center justify-center rounded-full w-7 h-7 mr-2">
                                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <Tipografia className="text-xs text-gray-600 mb-1">Teléfono:</Tipografia>
                                      <Tipografia className="text-black text-sm">{usuario.celular || "No disponible"}</Tipografia>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <div className="flex items-center justify-center rounded-full w-7 h-7 mr-2">
                                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <Tipografia className="text-gray-500 text-xs mb-1">Rol:</Tipografia>
                                      <div className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                        usuario.rol === 'ADMINISTRADOR' 
                                          ? 'text-orange-600 ' 
                                          : usuario.rol === 'COLABORADOR'
                                            ? 'text-green-500'
                                            : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        <Tipografia className="text-inherit text-xs">{usuario.rol}</Tipografia>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-center">
                                <Boton 
                                  label="Editar"
                                  size="small"
                                  tipo="primario"
                                  onClick={() => navigate(`/editar/usuario/${usuario.id_usuario}`)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-8">
                        <div className="bg-orange-50 p-4 rounded-full mb-3">
                          <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <Tipografia className="text-black mb-2 text-sm">
                          No se encontraron usuarios
                        </Tipografia>
                        <Tipografia className="text-gray-500 mb-3 text-xs">
                          Intenta cambiando los filtros o la búsqueda
                        </Tipografia>
                        <Boton
                          label="Registrar Usuario"
                          tipo="primario"
                          onClick={handleRegistrarUsuario}
                          size="small"
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Tipografia>
        </div>
      </div>
    </div>
  );
};

export default GestionUsuarios;