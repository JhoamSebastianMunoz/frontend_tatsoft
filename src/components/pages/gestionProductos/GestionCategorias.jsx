import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tipografia from "../../atoms/Tipografia";
import Icono from "../../atoms/Iconos";
import Botones from "../../atoms/Botones";
import CampoTexto from "../../atoms/CamposTexto";
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
      const filtered = categorias.filter((categoria) =>
        categoria.nombre_categoria
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
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
      mostrarError(
        "No se pudieron cargar las categorías. Por favor, intenta de nuevo más tarde."
      );
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
      [name]: value,
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
    });
    setShowNuevaCategoriaModal(true);
  };

  // Iniciar edición en línea
  const handleEditarCategoria = (id) => {
    setCategoriaEnEdicion(id);
    // Pre-cargar los datos para edición
    const categoria = categorias.find((cat) => cat.id_categoria === id);
    if (categoria) {
      setCategorias((prevCategorias) =>
        prevCategorias.map((cat) =>
          cat.id_categoria === id
            ? { ...cat, editingNombre: cat.nombre_categoria }
            : cat
        )
      );
    }
  };

  // Manejar cambios en los campos editables
  const handleEditInputChange = (e, id) => {
    const { name, value } = e.target;
    setCategorias((prevCategorias) =>
      prevCategorias.map((cat) =>
        cat.id_categoria === id ? { ...cat, editingNombre: value } : cat
      )
    );

    // Actualizar también categorías filtradas
    setCategoriasFiltradas((prevCategorias) =>
      prevCategorias.map((cat) =>
        cat.id_categoria === id ? { ...cat, editingNombre: value } : cat
      )
    );
  };

  // Guardar cambios de edición
  const handleGuardarEdicion = async (id) => {
    const categoria = categorias.find((cat) => cat.id_categoria === id);

    if (!categoria.editingNombre.trim()) {
      mostrarError("El nombre de la categoría es obligatorio");
      return;
    }

    try {
      setLoading(true);
      const response = await productService.updateCategory(id, {
        nombre_categoria: categoria.editingNombre,
        descripcion: "Categoría para productos", // Mantener descripción genérica
      });

      if (response && response.data) {
        // Actualizar la categoría en ambas listas
        const actualizarCategoria = (prevCategorias) =>
          prevCategorias.map((cat) =>
            cat.id_categoria === id
              ? {
                  ...cat,
                  nombre_categoria: categoria.editingNombre,
                  editingNombre: undefined,
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
      mostrarError(
        "No se pudo actualizar la categoría. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  // Cancelar edición
  const handleCancelarEdicion = (id) => {
    setCategoriaEnEdicion(null);
    // Eliminar los datos temporales de edición
    setCategorias((prevCategorias) =>
      prevCategorias.map((cat) => ({
        ...cat,
        editingNombre: undefined,
      }))
    );
    setCategoriasFiltradas((prevCategorias) =>
      prevCategorias.map((cat) => ({
        ...cat,
        editingNombre: undefined,
      }))
    );
  };

  const handleEliminarCategoria = (id) => {
    const categoria = categorias.find((cat) => cat.id_categoria === id);
    setCategoriaEliminar(categoria);
    setShowEliminarModal(true);
  };

  const confirmarEliminarCategoria = async () => {
    if (!categoriaEliminar) return;

    try {
      setLoading(true);
      const response = await productService.deleteCategory(
        categoriaEliminar.id_categoria
      );

      // Si la eliminación fue exitosa
      setCategorias(
        categorias.filter(
          (cat) => cat.id_categoria !== categoriaEliminar.id_categoria
        )
      );
      setCategoriasFiltradas(
        categoriasFiltradas.filter(
          (cat) => cat.id_categoria !== categoriaEliminar.id_categoria
        )
      );
      setShowEliminarModal(false);
      setCategoriaEliminar(null);

      // Mostrar mensaje de éxito
      mostrarExito(
        `La categoría ${categoriaEliminar.nombre_categoria} ha sido eliminada correctamente`
      );
    } catch (error) {
      console.error("Error eliminando categoría:", error);
      setShowEliminarModal(false);

      // Mostrar alerta de error específica
      if (error.response && error.response.status === 409) {
        mostrarError(
          "No se puede eliminar la categoría porque tiene productos asociados"
        );
      } else {
        mostrarError(
          "Error al eliminar la categoría. Por favor, intente nuevamente."
        );
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
      const response = await productService.createCategory({
        nombre_categoria: nuevaCategoria.nombre_categoria,
        descripcion: "Categoría para productos", // Descripción genérica
      });

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
      mostrarError(
        "No se pudo crear la categoría. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex ">
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      <div className="flex-1 w-full sm:pl-10 md:pl-10 lg:pl-10 transition-all ">
        <div className="md:p-2  mx-auto max-w-full ml-10 pl-5">
          <div className="p-2 md:mb-3">
            <Tipografia
              variant="h1"
              size="2xl"
              className="text-black font-medium "
            >
              Categorías
            </Tipografia>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 pl-4 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 mb-4 sm:mb-6">
              <div className="w-full md:w-72 lg:w-96">
                <Tipografia className="text-gray-800 mb-1 px-1 text-base">
                  Buscar
                </Tipografia>
                <CampoTexto
                  className="md:w-96 sm:w-full"
                  placeholder="Buscar Categoría"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              <Botones
                label="Agregar"
                tipo="primario"
                onClick={handleAgregarCategoria}
                className="w-full sm:w-auto mt-2 sm:mt-0 flex items-center justify-center"
              />
            </div>

            {showErrorAlert && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded transition-opacity duration-300">
                <Icono className="mr-2" name="eliminarAlert" size={20} />
                <Tipografia size="base">{error}</Tipografia>
              </div>
            )}

            {/* Alertas de éxito */}
            {showSuccessAlert && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded transition-opacity duration-300">
                <Tipografia size="base" className="font-medium">
                  ¡Operación exitosa!
                </Tipografia>
                <Tipografia size="base">{successMessage}</Tipografia>
              </div>
            )}

            {/* Tabla de categorías - Mejorada para responsive */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                <Tipografia size="base" className="mt-4 text-gray-600">
                  Cargando categorías...
                </Tipografia>
              </div>
            ) : (
              <div className="overflow-x-auto w-full -mx-3 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-3 sm:px-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                          <Tipografia
                            size="sm"
                            className="font-medium text-gray-800"
                          >
                            Código
                          </Tipografia>
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[45%]">
                          <Tipografia
                            size="sm"
                            className="font-medium text-gray-800"
                          >
                            Nombre Categoría
                          </Tipografia>
                        </th>
                        <th className="hidden sm:table-cell px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                          <Tipografia
                            size="sm"
                            className="font-medium text-gray-800"
                          >
                            Fecha de Creación
                          </Tipografia>
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                          <Tipografia
                            size="sm"
                            className="font-medium text-gray-800"
                          >
                            Acciones
                          </Tipografia>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categoriasFiltradas.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-8">
                            <Tipografia size="base" className="text-gray-500">
                              No se encontraron categorías.
                              {searchTerm
                                ? " Prueba con otro término de búsqueda."
                                : " Agrega una nueva categoría para comenzar."}
                            </Tipografia>
                          </td>
                        </tr>
                      ) : (
                        categoriasFiltradas.map((categoria) => (
                          <tr
                            key={categoria.id_categoria}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                              <Tipografia size="base">
                                {categoria.id_categoria}
                              </Tipografia>
                            </td>
                            <td className="px-2 sm:px-4 py-3 sm:py-4">
                              {categoriaEnEdicion === categoria.id_categoria ? (
                                <input
                                  type="text"
                                  name="nombre_categoria"
                                  value={categoria.editingNombre || ""}
                                  onChange={(e) =>
                                    handleEditInputChange(
                                      e,
                                      categoria.id_categoria
                                    )
                                  }
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                                />
                              ) : (
                                <Tipografia size="base" className="truncate">
                                  {categoria.nombre_categoria}
                                </Tipografia>
                              )}
                            </td>
                            <td className="hidden sm:table-cell px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                              <Tipografia size="base">
                                {new Date(
                                  categoria.fecha_creacion || Date.now()
                                ).toLocaleDateString()}
                              </Tipografia>
                            </td>
                            <td className="px-2 sm:px-4 py-3 sm:py-4">
                              <div className="flex flex-col sm:flex-row justify-center gap-2">
                                {categoriaEnEdicion ===
                                categoria.id_categoria ? (
                                  <>
                                    <Botones
                                      label="Guardar"
                                      tipo="primario"
                                      size="small"
                                      className="w-full sm:w-auto px-2 sm:px-4 py-1 sm:py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                                      onClick={() =>
                                        handleGuardarEdicion(
                                          categoria.id_categoria
                                        )
                                      }
                                    />
                                    <Botones
                                      label="Cancelar"
                                      tipo="secundario"
                                      className="w-full sm:w-auto px-2 sm:px-4 py-1 sm:py-1.5  rounded hover:bg-gray-500 transition-colors text-sm"
                                      onClick={() =>
                                        handleCancelarEdicion(
                                          categoria.id_categoria
                                        )
                                      }
                                    />
                                  </>
                                ) : (
                                  <>
                                    <Botones
                                      label="Editar"
                                      tipo="primario"
                                      className="w-full sm:w-auto px-2 sm:px-4 py-1 sm:py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-xs sm:text-sm"
                                      onClick={() =>
                                        handleEditarCategoria(
                                          categoria.id_categoria
                                        )
                                      }
                                    />

                                    <Botones
                                      label="Eliminar"
                                      tipo="eliminar"
                                      className="w-full sm:w-auto px-2 sm:px-4 py-1 sm:py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs sm:text-sm"
                                      onClick={() =>
                                        handleEliminarCategoria(
                                          categoria.id_categoria
                                        )
                                      }
                                    />
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para agregar nueva categoría */}
      {showNuevaCategoriaModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto shadow-xl">
            <Tipografia variant="h2" size="xl" className="mb-4">
              Agregar nueva categoría
            </Tipografia>

            <form onSubmit={handleSubmitNuevaCategoria}>
              <div className="mb-4">
                <Tipografia size="sm" className="block text-gray-700 mb-1">
                  Nombre de la categoría*
                </Tipografia>
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

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <Botones
                  label="Cancelar"
                  tipo="secundario"
                  onClick={() => setShowNuevaCategoriaModal(false)}
                  className="w-full sm:w-auto order-2 sm:order-1"
                />
                <Botones
                  label="Agregar"
                  tipo="primario"
                  type="submit"
                  className="w-full sm:w-auto order-1 sm:order-2"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para confirmar eliminación */}
      {showEliminarModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-auto shadow-xl">
            <div className="flex justify-center mb-4">
              <Icono name="eliminarAlert" size={65} />
            </div>
            <Tipografia variant="h2" size="xl" className="text-center mb-2">
              ¿Eliminar categoría?
            </Tipografia>
            <Tipografia size="base" className="text-center text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar la categoría "
              {categoriaEliminar?.nombre_categoria}"? Esta acción no se puede
              deshacer.
            </Tipografia>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <Botones
                label="Cancelar"
                tipo="secundario"
                onClick={() => setShowEliminarModal(false)}
                className="w-full sm:w-auto order-2 sm:order-1"
              />
              <Botones
                label="Sí, eliminar"
                tipo="cancelar"
                onClick={confirmarEliminarCategoria}
                className="w-full sm:w-auto order-1 sm:order-2"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCategorias;
