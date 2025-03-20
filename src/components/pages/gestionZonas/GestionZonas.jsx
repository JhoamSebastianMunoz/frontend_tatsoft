import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { areaService } from "../../../context/services/ApiService";
import Icono from "../../../components/atoms/Iconos";
import Tipografia from "../../../components/atoms/Tipografia";
import Loading from "../../../components/Loading/Loading";
import SidebarAdm from "../../organisms/SidebarAdm";
import Boton from "../../atoms/Botones";
import Encabezado from "../../molecules/Encabezado";

const GestionZonas = () => {
  const navigate = useNavigate();
  const [zonas, setZonas] = useState([]);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [eliminado, setEliminado] = useState(false);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar zonas al iniciar
  useEffect(() => {
    const fetchZonas = async () => {
      try {
        setLoading(true);
        const response = await areaService.getAllAreas();
        setZonas(response.data);
      } catch (error) {
        console.error("Error al cargar zonas:", error);
        setError(
          "Error al cargar las zonas. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchZonas();
  }, []);

  const handleEliminarClick = (zona) => {
    setZonaSeleccionada(zona);
    setMostrarAlerta(true);
  };

  const handleConfirmarEliminar = async () => {
    try {
      if (zonaSeleccionada) {
        await areaService.deleteArea(zonaSeleccionada.id_zona_de_trabajo);

        // Actualizar la lista de zonas
        setZonas(
          zonas.filter(
            (z) => z.id_zona_de_trabajo !== zonaSeleccionada.id_zona_de_trabajo
          )
        );

        setMostrarAlerta(false);
        setEliminado(true);
        setTimeout(() => setEliminado(false), 2000);
      }
    } catch (error) {
      console.error("Error al eliminar zona:", error);
      setError(
        "Error al eliminar la zona. Por favor, intenta de nuevo más tarde."
      );
      setMostrarAlerta(false);
    }
  };

  // Filtrar zonas por término de búsqueda
  const zonasFiltradas = searchTerm
    ? zonas.filter((zona) =>
        zona.nombre_zona_trabajo
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : zonas;

  if (loading) {
    return <Loading message="Cargando zonas..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white overflow-x-hidden">
      <div className="fixed top-0 w-full z-10">
        <Encabezado mensaje="Gestión de zonas" />
      </div>
      
      {/* Sidebar fijo */}
      <div className="fixed top-0 left-0 h-full z-10">
        <SidebarAdm />
      </div>
      
      {/* Contenido principal con padding-top para no solapar con el encabezado fijo */}
      <div className="w-full pt-16 m-1 p-4">
        <Tipografia>
          {/* Header con botón de retorno y registro */}
          <div className="bg-white rounded-lg shadow-md border-l-2 mb-4 p-4 flex justify-between items-center">
            <div className="flex items-center">
              {/* <button 
                onClick={() => navigate(-1)} 
                className="text-purple-600 mr-2 hover:text-purple-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button> */}
              <span className="font-medium text-lg">Gestión de Zonas</span>
            </div>
            <Link to="/registrar-zona">
              <Boton
                tipo="primario"
                label="Registrar zona"
              />
            </Link>
          </div>

          {/* Contador de zonas */}
          <div className="bg-white rounded-lg shadow-md border-l-2 border-purple-600 mb-4">
            <div className="p-3 flex flex-col sm:flex-row justify-between items-center">
              <div>
                <div className="flex items-center mt-1">
                  <span className="bg-green-200 text-green-800 text-xs font-medium px-3 py-0.5 rounded-full mr-3">
                    {zonas.length} Total
                  </span>
                  <span className="bg-purple-200 text-purple-800 text-xs font-medium px-3 py-0.5 rounded-full">
                    {zonasFiltradas.length} Filtrados
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Buscador */}
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <h2 className="text-lg font-medium mb-3 text-black">Filtros</h2>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar zona:
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre"
                className="w-full p-2 border border-purple-200 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {searchTerm && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors duration-150"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Limpiar filtro
                </button>
              </div>
            )}
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Contenedor de tarjetas */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="border-b pb-3 mb-4 flex justify-between items-center">
              <h3 className="font-medium text-black-900">
                Lista de zonas
                <span className="ml-2 text-sm font-normal text-black-700">
                  Mostrando {zonasFiltradas.length} de {zonas.length}
                </span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
              {zonasFiltradas.length > 0 ? (
                zonasFiltradas.map((zona) => (
                  <div
                    key={zona.id_zona_de_trabajo}
                    className="p-4 border rounded-lg shadow bg-gray-50 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-purple-700">{zona.nombre_zona_trabajo}</h3>
                    <p className="mt-2">
                      <strong>Ubicación:</strong> Coordenadas:{" "}
                      {zona.latitud || "23.6345"}, {zona.longitud || "-102.5528"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 mb-3">{zona.descripcion}</p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-between items-center">
                      <Link 
                        to={`/editar-zona/${zona.id_zona_de_trabajo}`}
                      >
                        <Boton tipo="secundario" label="Editar" />
                      </Link>
              
                      <Boton
                        onClick={() => handleEliminarClick(zona)}
                        label="Eliminar"
                        tipo="cancelar"
                      />
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
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    No se encontraron zonas.{" "}
                    {zonas.length > 0
                      ? "Intenta con otra búsqueda."
                      : "Añade una nueva zona."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Tipografia>
      </div>

      {/* Alerta de Confirmación */}
      {mostrarAlerta && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Icono name="eliminarAlert" size={50} className="mx-auto mb-4" />
            <Tipografia className="text-lg font-semibold mb-2">
              ¿Desea eliminar la zona?
            </Tipografia>
            <Tipografia className="text-sm text-gray-500 mb-4">
              Esta acción no se puede deshacer.
            </Tipografia>
            <div className="flex justify-center mt-4 gap-2">
              <Boton
                onClick={() => setMostrarAlerta(false)}
                label="Cancelar"
                tipo="cancelar"
              />
              <Boton
                onClick={handleConfirmarEliminar}
                label="Confirmar"
                tipo="secundario"
              />
            </div>
          </div>
        </div>
      )}

      {/* Alerta de Eliminación Exitosa */}
      {eliminado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Icono name="confirmar" size={50} className="mx-auto mb-4" />
            <Tipografia className="text-lg font-semibold">
              Zona eliminada
            </Tipografia>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionZonas;