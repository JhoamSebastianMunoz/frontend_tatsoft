import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { areaService } from "../../../context/services/ApiService";
import Icono from "../../../components/atoms/Iconos";
import Tipografia from "../../../components/atoms/Tipografia";

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
        setError("Error al cargar las zonas. Por favor, intenta de nuevo más tarde.");
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
        setZonas(zonas.filter(z => z.id_zona_de_trabajo !== zonaSeleccionada.id_zona_de_trabajo));
        
        setMostrarAlerta(false);
        setEliminado(true);
        setTimeout(() => setEliminado(false), 2000);
      }
    } catch (error) {
      console.error("Error al eliminar zona:", error);
      setError("Error al eliminar la zona. Por favor, intenta de nuevo más tarde.");
      setMostrarAlerta(false);
    }
  };

  // Filtrar zonas por término de búsqueda
  const zonasFiltradas = searchTerm
    ? zonas.filter(zona => 
        zona.nombre_zona_trabajo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : zonas;

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 text-xl font-bold flex items-center justify-between w-full">
        <button onClick={() => navigate(-1)} className="text-white text-2xl">&#8592;</button>
        <span>Gestión de Zonas</span>
        <Link to="/registrar-zona" className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-bold">
          Registrar zona
        </Link>
      </div>

      {/* Buscador */}
      <div className="w-full flex justify-center p-4">
        <input 
          type="text" 
          placeholder="Buscar Zona" 
          className="w-1/2 p-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mx-4 my-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Contenedor de tarjetas */}
      {loading ? (
        <div className="flex justify-center items-center flex-grow">
          <Tipografia>Cargando zonas...</Tipografia>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-auto flex-grow">
          {zonasFiltradas.length > 0 ? (
            zonasFiltradas.map((zona) => (
              <div key={zona.id_zona_de_trabajo} className="p-4 border rounded-lg shadow bg-gray-50">
                <h3 className="font-bold">{zona.nombre_zona_trabajo}</h3>
                <p><strong>Ubicación:</strong> Coordenadas: {zona.latitud || '23.6345'}, {zona.longitud || '-102.5528'}</p>
                <p className="text-sm text-gray-600">{zona.descripcion}</p>
                <div className="flex justify-between mt-2">
                  <div className="flex space-x-2">
                    <Link to={`/editar-zona/${zona.id_zona_de_trabajo}`} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                      Editar
                    </Link>
                    <Link to={`/gestion-zonas/colaboradores/${zona.id_zona_de_trabajo}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                      Colaboradores
                    </Link>
                  </div>
                  <button 
                    onClick={() => handleEliminarClick(zona)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-500">
              No se encontraron zonas. {zonas.length > 0 ? 'Intenta con otra búsqueda.' : 'Añade una nueva zona.'}
            </div>
          )}
        </div>
      )}

      {/* Alerta de Confirmación */}
      {mostrarAlerta && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Icono name="eliminarAlert" size={50} className="mx-auto mb-4" />
            <p className="text-lg font-semibold">¿Desea eliminar la zona?</p>
            <div className="flex justify-center mt-4">
              <button 
                onClick={() => setMostrarAlerta(false)} 
                className="bg-red-400 text-white px-4 py-2 rounded-lg mx-2"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmarEliminar}
                className="bg-green-400 text-white px-4 py-2 rounded-lg mx-2"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de Eliminación Exitosa */}
      {eliminado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Icono name="confirmar" size={50} className="mx-auto mb-4" />
            <p className="text-lg font-semibold">Zona eliminada</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionZonas;