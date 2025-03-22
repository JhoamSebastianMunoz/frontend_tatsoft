import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tipografia from "../../atoms/Tipografia";
import Icono from "../../atoms/Iconos";
import Botones from "../../atoms/Botones";
import Buscador from "../../molecules/Buscador";
import Alerta from "../../molecules/Alertas";
import Sidebar from "../../organisms/Sidebar";
import { useAuth } from "../../../context/AuthContext";
import { productService } from "../../../context/services/ApiService";

const GestionCategorias = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estados para alertas
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  
  // Estados para modales
  const [showNuevaCategoriaModal, setShowNuevaCategoriaModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [categoriaEliminar, setCategoriaEliminar] = useState(null);
  const [categoriaEnEdicion, setCategoriaEnEdicion] = useState(null);
  
  // Estados para la búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para formulario de nueva categoría
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion: ""
  });

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, []);
  
  // Filtrar categorías según búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setCategoriasFiltradas(categorias);
    } else {
      const filtered = categorias.filter(
        categoria => categoria.nombre_categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCategoriasFiltradas(filtered);
    }
  }, [searchTerm, categorias]);
  
  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllCategories();
      if (response.data && Array.isArray(response.data)) {
        setCategorias(response.data);
        setCategoriasFiltradas(response.data);
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);
      mostrarError("No se pudieron cargar las categorías. Por favor, intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearch = () => {
    // Filtrado ya se maneja en el useEffect
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria({
      ...nuevaCategoria,
      [name]: value
    });
  };
  
  // Función para mostrar errores
  const mostrarError = (mensaje) => {
    setError(mensaje);
    setShowErrorAlert(true);
    setTimeout(() => {
      setShowErrorAlert(false);
    }, 3000);
  };
  
  // Función para mostrar mensajes de éxito
  const mostrarExito = (mensaje) => {
    setSuccessMessage(mensaje);
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };
  
  const handleAgregarCategoria = () => {
    setNuevaCategoria({
      nombre_categoria: "",
      descripcion: "Categoría para productos"
    });
    setShowNuevaCategoriaModal(true);
  };
  
  // Iniciar edición en línea
  const handleEditarCategoria = (id) => {
    setCategoriaEnEdicion(id);
    // Pre-cargar los datos para edición
    const categoria = categorias.find(cat => cat.id_categoria === id);
    if (categoria) {
      setCategorias(prevCategorias => 
        prevCategorias.map(cat => 
          cat.id_categoria === id 
            ? { ...cat, editingNombre: cat.nombre_categoria, editingDescripcion: cat.descripcion || "Categoría para productos" } 
            : cat
        )
      );
    }
  };
  
  // Manejar cambios en los campos editables
  const handleEditInputChange = (e, id) => {
    const { name, value } = e.target;
    setCategorias(prevCategorias => 
      prevCategorias.map(cat => 
        cat.id_categoria === id 
          ? { ...cat, [name === 'nombre_categoria' ? 'editingNombre' : 'editingDescripcion']: value } 
          : cat
      )
    );
    
    // Actualizar también categorías filtradas
    setCategoriasFiltradas(prevCategorias => 
      prevCategorias.map(cat => 
        cat.id_categoria === id 
          ? { ...cat, [name === 'nombre_categoria' ? 'editingNombre' : 'editingDescripcion']: value } 
          : cat
      )
    );
  };
  
  // Guardar cambios de edición
  const handleGuardarEdicion = async (id) => {
    const categoria = categorias.find(cat => cat.id_categoria === id);
    
    if (!categoria.editingNombre.trim()) {
      mostrarError("El nombre de la categoría es obligatorio");
      return;
    }
    
    try {
      setLoading(true);
      const response = await productService.updateCategory(
        id, 
        { 
          nombre_categoria: categoria.editingNombre,
          descripcion: categoria.editingDescripcion 
        }
      );
      
      if (response && response.data) {
        // Actualizar la categoría en ambas listas
        const actualizarCategoria = (prevCategorias) => 
          prevCategorias.map(cat => 
            cat.id_categoria === id 
              ? { 
                  ...cat, 
                  nombre_categoria: categoria.editingNombre,
                  descripcion: categoria.editingDescripcion,
                  editingNombre: undefined,
                  editingDescripcion: undefined
                } 
              : cat
          );
        
        setCategorias(actualizarCategoria);
        setCategoriasFiltradas(actualizarCategoria);
        setCategoriaEnEdicion(null);
        
        // Mostrar alerta de éxito
        mostrarExito("Categoría actualizada correctamente");
      }
    } catch (error) {
      console.error("Error actualizando categoría:", error);
      mostrarError("No se pudo actualizar la categoría. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  // Cancelar edición
  const handleCancelarEdicion = (id) => {
    setCategoriaEnEdicion(null);
    // Eliminar los datos temporales de edición
    setCategorias(prevCategorias => 
      prevCategorias.map(cat => ({
        ...cat,
        editingNombre: undefined,
        editingDescripcion: undefined
      }))
    );
    setCategoriasFiltradas(prevCategorias => 
      prevCategorias.map(cat => ({
        ...cat,
        editingNombre: undefined,
        editingDescripcion: undefined
      }))
    );
  };
  
  const handleEliminarCategoria = (id) => {
    const categoria = categorias.find(cat => cat.id_categoria === id);
    setCategoriaEliminar(categoria);
    setShowEliminarModal(true);
  };
  
  const confirmarEliminarCategoria = async () => {
    if (!categoriaEliminar) return;
    
    try {
      setLoading(true);
      const response = await productService.deleteCategory(categoriaEliminar.id_categoria);
      
      // Si la eliminación fue exitosa
      setCategorias(categorias.filter(cat => cat.id_categoria !== categoriaEliminar.id_categoria));
      setCategoriasFiltradas(categoriasFiltradas.filter(cat => cat.id_categoria !== categoriaEliminar.id_categoria));
      setShowEliminarModal(false);
      setCategoriaEliminar(null);
      
      // Mostrar mensaje de éxito
      mostrarExito(`La categoría ${categoriaEliminar.nombre_categoria} ha sido eliminada correctamente`);
    } catch (error) {
      console.error("Error eliminando categoría:", error);
      setShowEliminarModal(false);
      
      // Mostrar alerta de error específica
      if (error.response && error.response.status === 409) {
        mostrarError("No se puede eliminar la categoría porque tiene productos asociados");
      } else {
        mostrarError("Error al eliminar la categoría. Por favor, intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmitNuevaCategoria = async (e) => {
    e.preventDefault();
    
    if (!nuevaCategoria.nombre_categoria.trim()) {
      mostrarError("El nombre de la categoría es obligatorio");
      return;
    }
    
    try {
      setLoading(true);
      const response = await productService.createCategory(nuevaCategoria);
      if (response && response.data) {
        // Añadir la nueva categoría a la lista
        setCategorias([...categorias, response.data]);
        setCategoriasFiltradas([...categoriasFiltradas, response.data]);
        setShowNuevaCategoriaModal(false);
        
        // Mostrar alerta de éxito
        mostrarExito("Categoría creada correctamente");
      }
    } catch (error) {
      console.error("Error creando categoría:", error);
      mostrarError("No se pudo crear la categoría. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 pl-20">
        {/* Header */}
        <div className="text-black p-4 shadow-md">
          <Tipografia variant="h1" size="xl" className="text-black font-medium">
            Categorías
          </Tipografia>
        </div>

        {/* Contenido de categorías */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Buscador y botón agregar */}
            <div className="flex gap-4 items-center mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar Categoría"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full p-2 pl-4 pr-10 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <Icono name="buscar" size={18} />
                </button>
              </div>
              
              <Botones
                label="Agregar"
                tipo="primario"
                onClick={handleAgregarCategoria}
                className="flex items-center"
              />
            </div>
            
            {/* Alertas de error */}
            {showErrorAlert && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded transition-opacity duration-300">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}
            
            {/* Alertas de éxito */}
            {showSuccessAlert && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded transition-opacity duration-300">
                <p className="font-medium">¡Operación exitosa!</p>
                <p>{successMessage}</p>
              </div>
            )}
            
            {/* Tabla de categorías */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando categorías...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr className="text-left">
                      <th className="py-3 px-4 font-medium text-gray-800">Código</th>
                      <th className="py-3 px-4 font-medium text-gray-800">Nombre Categoría</th>
                      <th className="py-3 px-4 font-medium text-gray-800">Descripción</th>
                      <th className="py-3 px-4 font-medium text-gray-800">Fecha de Creación</th>
                      <th className="py-3 px-4 font-medium text-gray-800 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriasFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-500">
                          No se encontraron categorías. 
                          {searchTerm ? " Prueba con otro término de búsqueda." : " Agrega una nueva categoría para comenzar."}
                        </td>
                      </tr>
                    ) : (
                      categoriasFiltradas.map((categoria) => (
                        <tr key={categoria.id_categoria} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{categoria.id_categoria}</td>
                          <td className="py-3 px-4">
                            {categoriaEnEdicion === categoria.id_categoria ? (
                              <input
                                type="text"
                                name="nombre_categoria"
                                value={categoria.editingNombre || ""}
                                onChange={(e) => handleEditInputChange(e, categoria.id_categoria)}
                                className="w-full p-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                              />
                            ) : (
                              categoria.nombre_categoria
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {categoriaEnEdicion === categoria.id_categoria ? (
                              <input
                                type="text"
                                name="descripcion"
                                value={categoria.editingDescripcion || ""}
                                onChange={(e) => handleEditInputChange(e, categoria.id_categoria)}
                                className="w-full p-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                              />
                            ) : (
                              categoria.descripcion || "-"
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {new Date(categoria.fecha_creacion || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center space-x-2">
                              {categoriaEnEdicion === categoria.id_categoria ? (
                                <>
                                  <button
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                    onClick={() => handleGuardarEdicion(categoria.id_categoria)}
                                  >
                                    Guardar
                                  </button>
                                  <button
                                    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                                    onClick={() => handleCancelarEdicion(categoria.id_categoria)}
                                  >
                                    Cancelar
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                                    onClick={() => handleEditarCategoria(categoria.id_categoria)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    onClick={() => handleEliminarCategoria(categoria.id_categoria)}
                                  >
                                    Eliminar
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal para agregar nueva categoría */}
      {showNuevaCategoriaModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              Agregar nueva categoría
            </h3>
            
            <form onSubmit={handleSubmitNuevaCategoria}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la categoría*
                </label>
                <input
                  type="text"
                  name="nombre_categoria"
                  value={nuevaCategoria.nombre_categoria}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 rounded-lg"
                  placeholder="Ingrese el nombre de la categoría"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={nuevaCategoria.descripcion}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 rounded-lg"
                  rows="3"
                  placeholder="Describa la categoría"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Botones
                  label="Cancelar"
                  tipo="cancelar"
                  onClick={() => setShowNuevaCategoriaModal(false)}
                />
                <Botones
                  label="Agregar"
                  tipo="primario"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal para confirmar eliminación */}
      {showEliminarModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <div className="flex justify-center mb-4">
              <Icono name="eliminarAlert" size={65} />
            </div>
            <p className="text-center mb-2 font-medium">
              ¿Eliminar categoría?
            </p>
            <p className="text-center mb-4 text-gray-600 text-sm">
              {categoriaEliminar ? categoriaEliminar.nombre_categoria : ""} 
            </p>
            <p className="text-center text-gray-500 text-sm mb-4">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center space-x-3">
              <Botones
                tipo="cancelar"
                label="Cancelar"
                onClick={() => setShowEliminarModal(false)}
              />
              <Botones
                tipo="primario"
                label="Eliminar"
                onClick={confirmarEliminarCategoria}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCategorias;