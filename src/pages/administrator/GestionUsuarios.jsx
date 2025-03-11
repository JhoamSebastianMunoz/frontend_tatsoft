import React, { useState } from "react";
import Encabezado from "../../components/molecules/Encabezado";
import Boton from "../../components/atoms/Botones";
import Buscador from "../../components/molecules/Buscador";
import Tipografia from "../../components/atoms/Tipografia";
import { useNavigate } from "react-router-dom";

const GestionUsuarios = () => {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([
    { nombre: "María Camila Uribe", celular: "3758460232", Rol: "Colaborador" },
    { nombre: "Juan Pérez", celular: "3142567890", Rol: "Administrador" },
    { nombre: "Ana Gómez", celular: "3004567890", Rol: "Colaborador" },
    { nombre: "Carlos Ramírez", celular: "3216549870", Rol: "Administrador" },
    { nombre: "Laura Méndez", celular: "3001234567", Rol: "Colaborador" },
    { nombre: "Sofía Herrera", celular: "3127654321", Rol: "Administrador" },
  ]);

  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [verTarjetas, setVerTarjetas] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(null);

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      (filtro === "Todos" || usuario.Rol === filtro) &&
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleVerUsuario = () => {
    navigate("/ver/usuario");
  };

  const handleEditarUsuario = (usuario) => {
    localStorage.setItem("rutaOrigenEdicion", "/gestion/usuarios");
    console.log("Ruta de origen guardada en localStorage: /gestion/usuarios");

    navigate("/editar/usuario?origen=gestion");
    console.log("Redirigiendo a editar desde gestión");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Encabezado
        mensaje="Gestión de usuarios"
        className="p-4"
        onClick={() => navigate("/")}
      />
      <div className="bg-white rounded-lg shadow-md border-l-2 border-purple-600 mb-1">
        <div className="p-2 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <div className="flex items-center mt-1">
              <span className="bg-green-200 text-green-800 text-xs font-medium px-3 py-0.5 rounded-full mr-3">
                {usuarios.length} Total
              </span>
              <span className="bg-purple-200 text-blue-800 text-xs font-medium px-3 py-0.5 rounded-full">
                {usuariosFiltrados.length} Filtrados
              </span>
            </div>
          </div>
          <div className="mt-3 sm:mt-0 flex">
            <Boton
              tipo="secundario"
              label="Registrar Usuario"
              onClick={() => navigate("/registro/usuario")}
            />
            <button
              onClick={() => setVerTarjetas(!verTarjetas)}
              className="mr-4 bg-gray-200 hover:bg-gray-200 text-gray-600 p-2 rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                {verTarjetas ? (
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Buscador
              placeholder="Buscar usuarios por nombre"
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="flex">
            {busqueda || filtro !== "Todos" ? (
              <button
                onClick={() => {
                  setBusqueda("");
                  setFiltro("Todos");
                }}
                className="ml-2 p-2 rounded text-gray-600"
                title="Limpiar filtros"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <Tipografia>
        <div className="flex overflow-x-auto space-x-2 p-4 bg-white rounded-lg">
          <button
            className={`px-4 py-2 whitespace-nowrap rounded-md ${
              filtro === "Todos"
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setFiltro("Todos")}
          >
            Todos los usuarios
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap rounded-md ${
              filtro === "Administrador"
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setFiltro("Administrador")}
          >
            Administradores
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap rounded-md ${
              filtro === "Colaborador"
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setFiltro("Colaborador")}
          >
            Colaboradores
          </button>
          <button className="px-4 py-2 whitespace-nowrap rounded-md text-gray-600 hover:bg-gray-100 ">
            Inactivos
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="border-b pb-3 mb-4 flex justify-between items-center">
            <h3 className="font-medium text-black-900">
              Lista de usuarios
              <span className="ml-2 text-sm font-normal text-black-700">
                Mostrando {usuariosFiltrados.length} de {usuarios.length}
              </span>
            </h3>
          </div>
          {verTarjetas ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((usuario, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 relative"
                  >
                    <div
                      className={`h-2 ${
                        usuario.Rol === "Administrador"
                          ? "bg-purple-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={() =>
                          setMenuAbierto(menuAbierto === index ? null : index)
                        }
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                        </svg>
                      </button>

                      {menuAbierto === index && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                          <ul className="py-1 text-sm text-gray-700">
                            <li
                              className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
                              onClick={() => {
                                handleVerUsuario();
                                setMenuAbierto(null);
                              }}
                            >
                              Ver
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium text-lg text-gray-900">
                        {usuario.nombre}
                      </h3>
                      <p className="text-gray-600">
                        Celular: {usuario.celular}
                      </p>
                      <p className="mt-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            usuario.Rol === "Administrador"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {usuario.Rol}
                        </span>
                      </p>
                    </div>
                    <div className="px-0 py-1 bg-gray-50 border-t border-gray-100">
                      <style jsx>{`
                        @media (max-width: 640px) {
                          .card-buttons-container {
                            flex-direction: column;
                            align-items: center;
                            gap: 8px;
                            padding: 8px 0;
                          }
                        }
                      `}</style>
                      <div className="card-buttons-container flex justify-between items-center px-1">
                        <Boton 
                          label="Eliminar" 
                          tipo="cancelar" 
                          size="small" 
                        />
                        <Boton
                          label="Editar"
                          tipo="secundario"
                          size="small"
                          onClick={() => handleEditarUsuario(usuario)}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    No se encontraron usuarios que coincidan con los criterios
                    de búsqueda.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Celular
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuariosFiltrados.length > 0 ? (
                    usuariosFiltrados.map((usuario, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {usuario.nombre}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {usuario.celular}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              usuario.Rol === "Administrador"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {usuario.Rol}
                          </span>
                        </td>
                        <td className="px-5 py-4 bg-gray-50 whitespace-nowrap text-right text-center">
                          <style jsx>{`
                            @media (max-width: 640px) {
                              .table-buttons-container {
                                flex-direction: column;
                                align-items: flex-end;
                                gap: 8px;
                                padding: 8px 0;
                              }
                            }
                          `}</style>
                          <div className="card-buttons-container flex justify-beetew items-center px-1">
                            <Boton
                              onClick={() => handleEditarUsuario(usuario)}
                              label="Editar"
                              tipo="secundario"
                              size="small"
                            />
                            <Boton 
                              tipo="cancelar" 
                              label="Eliminar" 
                              size="small"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No se encontraron usuarios que coincidan con los
                        criterios de búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {usuariosFiltrados.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between mt-4">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">1</span> a{" "}
                    <span className="font-medium">
                      {usuariosFiltrados.length}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium">
                      {usuariosFiltrados.length}
                    </span>{" "}
                    resultados
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Anterior
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Siguiente
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </Tipografia>
    </div>
  );
};

export default GestionUsuarios;