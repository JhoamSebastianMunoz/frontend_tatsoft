import React, { useState } from "react";
import Encabezado from "../../components/molecules/Encabezado";
import Boton from "../../components/atoms/Botones";
import Buscador from "../../components/molecules/Buscador";
import Tipografia from "../../components/atoms/Tipografia";
import { useNavigate } from "react-router-dom";

const GestionClientes = () => {
  const navigate = useNavigate();

  const [tiendas, setTiendas] = useState([
    {
      razonSocial: "Minimarket La Esquina",
      nombre: "Laura Jiménez",
      telefono: "3158460232",
      tipo: "Minorista",
    },
    {
      razonSocial: "Supermercado El Ahorro",
      nombre: "Carlos Rodríguez",
      telefono: "3002567890",
      tipo: "Mayorista",
    },
    {
      razonSocial: "Tienda Don José",
      nombre: "José Martínez",
      telefono: "3114567890",
      tipo: "Minorista",
    },
    {
      razonSocial: "Distribuidora Torres",
      nombre: "Alejandro Torres",
      telefono: "3506549870",
      tipo: "Mayorista",
    },
    {
      razonSocial: "Abarrotes López",
      nombre: "Valentina López",
      telefono: "3211234567",
      tipo: "Minorista",
    },
    {
      razonSocial: "Comercial Sánchez",
      nombre: "Mateo Sánchez",
      telefono: "3167654321",
      tipo: "Mayorista",
    },
  ]);

  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [verTarjetas, setVerTarjetas] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(null);

  const tiendasFiltradas = tiendas.filter(
    (tienda) =>
      (filtro === "Todos" || tienda.tipo === filtro) &&
      (tienda.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
        tienda.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const handleVerCliente = () => {
    navigate("/ver/cliente");
  };

  const handleEditarTienda = (tienda) => {
    localStorage.setItem("rutaOrigenEdicion", "/gestion/clientes");
    console.log("Ruta de origen guardada en localStorage: /gestion/clientes");

    window.location.href = "/editar/cliente?origen=gestion";
    console.log("Redirigiendo a editar desde gestión");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white ">
      <Encabezado
        mensaje="Gestión de clientes"
        className="p-4"
        onClick={() => navigate("/")}
      />
      <div className="bg-white rounded-lg shadow-md border-l-2 border-purple-600 mb-1">
        <div className="p-2 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <div className="flex items-center mt-1">
              <span className="bg-green-200 text-green-800 text-xs font-medium px-3 py-0.5 rounded-full mr-3">
                {tiendas.length} Total
              </span>
              <span className="bg-purple-200 text-blue-800 text-xs font-medium px-3 py-0.5 rounded-full">
                {tiendasFiltradas.length} Filtrados
              </span>
            </div>
          </div>
          <div className="mt-3 sm:mt-0 flex">
            <Boton
              tipo="secundario"
              label="Registrar Cliente"
              onClick={() => navigate("/registro/cliente")}
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
      <div className="bg-white rounded-lg p-2 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Buscador
              placeholder="Buscar cliente"
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
        <div className="flex overflow-x-auto space-x-2 p-4 bg-white rounded-lg ">
          <button
            className={`px-4 py-2 whitespace-nowrap rounded-md ${
              filtro === "Todos"
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setFiltro("Todos")}
          >
            Todos los clientes
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap rounded-md ${
              filtro === "Mayorista"
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setFiltro("Mayorista")}
          >
            Mayoristas
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap rounded-md ${
              filtro === "Minorista"
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setFiltro("Minorista")}
          >
            Minoristas
          </button>
          <button className="px-4 py-2 whitespace-nowrap rounded-md text-gray-600 hover:bg-gray-100">
            Inactivos
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="border-b pb-3 mb-4 flex justify-between items-center">
            <h3 className="font-medium text-black-900">
              Lista de clientes
              <span className="ml-2 text-sm font-normal text-black-700">
                Mostrando {tiendasFiltradas.length} de {tiendas.length}
              </span>
            </h3>
          </div>
          {verTarjetas ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tiendasFiltradas.length > 0 ? (
                tiendasFiltradas.map((tienda, index) => (
                  <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 relative"
                >
                  <div
                    className={`h-2 ${
                      tienda.tipo === "Mayorista"
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
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        <ul className="py-1 text-sm text-gray-600">
                          <li
                            className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
                            onClick={() => {
                              handleVerCliente();
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
                        {tienda.razonSocial}
                      </h3>
                      <p className="text-gray-600">Dueño: {tienda.nombre}</p>
                      <p className="text-gray-600">
                        Teléfono: {tienda.telefono}
                      </p>
                      <p className="mt-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            tienda.tipo === "Mayorista"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {tienda.tipo}
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
                        <Boton tipo="cancelar" label="Eliminar" size="small" />
                        <Boton
                          onClick={() => handleEditarTienda(tienda)}
                          label="Editar"
                          size="small"
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    No se encontraron tiendas que coincidan con los criterios de
                    búsqueda.
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
                      Razón Social
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dueño
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tiendasFiltradas.length > 0 ? (
                    tiendasFiltradas.map((tienda, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {tienda.razonSocial}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {tienda.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {tienda.telefono}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              tienda.tipo === "Mayorista"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {tienda.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end gap-2">
                            <Boton
                              onClick={() => handleEditarTienda(tienda)}
                              label="Editar"
                              size="small"
                            />
                            <Boton tipo="cancelar" label="Eliminar" size="small" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No se encontraron tiendas que coincidan con los
                        criterios de búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {tiendasFiltradas.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between mt-4">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">1</span> a{" "}
                    <span className="font-medium">
                      {tiendasFiltradas.length}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium">
                      {tiendasFiltradas.length}
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

export default GestionClientes;