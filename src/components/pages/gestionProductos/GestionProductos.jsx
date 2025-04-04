import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../../context/services/ApiService";
import { imageService } from "../../../context/services/ImageService";
import { useAuth } from "../../../context/AuthContext";
import Tipografia from "../../../components/atoms/Tipografia";
import Icono from "../../../components/atoms/Iconos";
import Boton from "../../../components/atoms/Botones";
import Buscador from "../../molecules/Buscador";
import Sidebar from "../../organisms/Sidebar";
import Loading from "../../Loading/Loading";
import ProductoItem from "../../molecules/ProductoItem";

const scrollStyle = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const GestionProductos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados para datos
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [productImages, setProductImages] = useState({});

  // Estados para UI
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [verTarjetas, setVerTarjetas] = useState(true);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // Ajustado para mostrar 3x2 en vista de tarjetas
  
  // Ref para cerrar el menú al hacer clic fuera
  const menuRef = useRef(null);

  // Cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
       
        // Cargar categorías
        const categoriasResponse = await productService.getAllCategories();
        if (categoriasResponse.data && Array.isArray(categoriasResponse.data)) {
          setCategorias(categoriasResponse.data);
        }
       
        // Cargar productos
        const productosResponse = await productService.getAllProducts();
        if (productosResponse.data && Array.isArray(productosResponse.data)) {
          // Modificamos los productos para añadir color a los precios
          const productosConColorPrecio = productosResponse.data.map(producto => ({
            ...producto,
            colorPrecio: 'text-orange-500'
          }));
          setProductos(productosConColorPrecio);
          setProductosFiltrados(productosConColorPrecio);

          // Cargar imágenes para los productos
          const imagePromises = productosResponse.data.map(async (producto) => {
            if (producto.id_imagen) {
              try {
                const imageUrl = await imageService.getImageUrl(producto.id_imagen);
                if (imageUrl) {
                  return { id: producto.id_producto, url: imageUrl };
                }
              } catch (error) {
                console.error('Error cargando imagen para producto', producto.id_producto, error);
              }
            }
            return { id: producto.id_producto, url: null };
          });
          
          const productImagesResults = await Promise.all(imagePromises);
          const imagesMap = {};
          productImagesResults.forEach(({ id, url }) => {
            imagesMap[id] = url;
          });
          
          setProductImages(imagesMap);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
   
    fetchData();
  }, []);

  // Filtrar productos según búsqueda y categoría
  useEffect(() => {
    let resultado = [...productos];
   
    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      resultado = resultado.filter(producto =>
        producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
   
    // Filtrar por categoría seleccionada
    if (categoriaSeleccionada !== 'Todas') {
      resultado = resultado.filter(producto =>
        producto.id_categoria === parseInt(categoriaSeleccionada)
      );
    }
   
    setProductosFiltrados(resultado);
    setCurrentPage(1); // Resetear a primera página cuando cambian los filtros
  }, [searchTerm, categoriaSeleccionada, productos]);

  // Cálculos para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoriaChange = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

  const handleAgregarProducto = () => {
    navigate("/registrar-producto");
  };

  const handleVerProducto = (id) => {
    navigate(`/ver-producto/${id}`);
    setOpenMenuId(null);
  };

  const handleStock = (id) => {
    navigate(`/editar-producto/${id}`);
    setOpenMenuId(null);
  };

  const handleEliminarProducto = (id) => {
    setProductoAEliminar(id);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };
  
  const toggleMenu = (id, e) => {
    e.stopPropagation(); // Evitar que el evento se propague
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const confirmarEliminacion = async () => {
    if (!productoAEliminar) return;
   
    try {
      setLoading(true);
     
      // Primero, obtenemos el producto para saber si tiene imagen
      const productoResponse = await productService.getProductById(productoAEliminar);
      const imageId = productoResponse.data?.id_imagen;
     
      // Eliminar el producto
      await productService.deleteProduct(productoAEliminar);
     
      // Después de eliminar el producto, eliminar su imagen si existe
      if (imageId) {
        try {
          await imageService.deleteImage(imageId);
        } catch (imageError) {
          console.error("Error eliminando imagen:", imageError);
          // No interrumpimos el flujo si falla la eliminación de la imagen
        }
      }
     
      // Actualizar la lista de productos
      setProductos(productos.filter(p => p.id_producto !== productoAEliminar));
      setShowDeleteModal(false);
      setProductoAEliminar(null);
     
    } catch (error) {
      console.error("Error eliminando producto:", error);
      setError("Ocurrió un error al eliminar el producto.");
    } finally {
      setLoading(false);
    }
  };

  const cancelarEliminacion = () => {
    setShowDeleteModal(false);
    setProductoAEliminar(null);
  };
  
  // Handlers para paginación
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  if (loading && productos.length === 0) {
    return <Loading message="Cargando productos..." />;
  }

  // Renderizamos un ProductoItem personalizado con menú desplegable
  const renderProductoItem = (producto) => {
    return (
      <div key={producto.id_producto} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 relative">
        <div></div>
        <div className="absolute top-3 right-3 z-10">
          <button 
            onClick={(e) => toggleMenu(producto.id_producto, e)}
            className="text-gray-700 hover:text-gray-700 focus:outline-none"
          >
            <div className="bg-white bg-opacity-50 rounded-full p-1 hover:shadow-lg hover:bg-opacity-80 transition-all duration-200 mr-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM8 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM8 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
              </svg>
            </div>
          </button>
          
          {openMenuId === producto.id_producto && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <ul className="py-1 text-sm text-gray-600">
                <li
                  className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                  onClick={() => handleStock(producto.id_producto)}
                >
                  Agregar Stock
                </li>
                <li
                  className="px-3 py-2 hover:bg-red-50 cursor-pointer text-red-600"
                  onClick={() => handleEliminarProducto(producto.id_producto)}
                >
                  Eliminar
                </li>
              </ul>
            </div>
          )}
        </div>
        
        {/* Imagen del producto */}
        <div 
          className="cursor-pointer h-48" 
          onClick={() => handleVerProducto(producto.id_producto)}
        >
          {producto.id_imagen && productImages[producto.id_producto] ? (
            <div className="h-full bg-white-200 flex items-center justify-center overflow-hidden">
              <img
                src={productImages[producto.id_producto]}
                alt={producto.nombre_producto}
                className="w-full h-full object-container px-3 "
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "ruta-a-imagen-placeholder";
                }}
              />
            </div>
          ) : (
            <div className="h-full bg-gray-100 flex items-center justify-center">
              <Icono name="gest-productos" size={50} className="text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Información del producto */}
        <div 
          className="p-4 flex-grow cursor-pointer" 
          onClick={() => handleVerProducto(producto.id_producto)}
        >
          <h3 className="font-medium text-lg text-gray-900 break-words mb-2 truncate">
            {producto.nombre_producto}
          </h3>
          
          <p className="text-gray-600 break-words text-sm mb-2">
            <strong>Precio:</strong> <span className="text-orange-600 font-medium">${parseFloat(producto.precio).toFixed(2)}</span>
          </p>
          
          <p className="text-gray-600 break-words text-sm mb-2">
            <strong>Categoría:</strong> {categorias.find(c => c.id_categoria === producto.id_categoria)?.nombre_categoria || "Sin categoría"}
          </p>
          
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {producto.descripcion || "Sin descripción"}
          </p>
          
          <p className="mt-2">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800`}>
              {producto.estado || "Activo"}
            </span>
          </p>
        </div>
        
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 mt-auto">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => handleEditarProducto(producto.id_producto)}
              className="w-full"
            >
              <Boton 
                tipo="primario" 
                label="Editar" 
                size="small" 
                className="w-full" 
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col md:flex-row bg-slate-50">
      <style>{scrollStyle}</style>
      <div className="w-full md:w-auto md:fixed md:top-0 md:left-0 md:h-full z-10">
        <div className="block md:hidden">
          <Sidebar />
        </div>
        <div className="hidden md:block">
          <Sidebar />
        </div>
      </div>
      
      <div className="bg-slate-50 flex-1 pl-8 md:pl-20 w-full lg:pl-[60px] px-3 sm:px-4 md:px-6 lg:px-8 ml-6 pl-4">
        <Tipografia>
          <div className="mt-4 mb-5">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 ml-5">Gestión de productos</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-md border-l-2 border-orange-600 mb-4 ml-3">
            <div className="p-3 flex flex-col sm:flex-row justify-between items-center">
              <div>
                <div className="flex items-center mt-1">
                  <span className="bg-orange-200 text-orange-800 text-xs font-medium px-3 py-0.5 rounded-full mr-3">
                    {productos.length} Total
                  </span>
                  <span className="bg-transparent border border-orange-500 text-orange-800 text-xs font-medium px-3 py-0.5 rounded-full">
                    {productosFiltrados.length} Filtrados
                  </span>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 flex w-full sm:w-auto justify-center sm:justify-end">
                {user && user.rol === "ADMINISTRADOR" && (
                  <Boton
                    tipo="primario"
                    label="Registrar Producto"
                    size="small"
                    onClick={handleAgregarProducto}
                    className="mr-2 w-full sm:w-auto"
                  />
                )}
                <button
                  onClick={() => setVerTarjetas(!verTarjetas)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-lg transition-colors flex-shrink-0"
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
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <Buscador
                  placeholder="Buscar producto "
                  onChange={handleSearchChange}
                  value={searchTerm}
                />
              </div>
              
              <div className="flex flex-col justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={categoriaSeleccionada}
                  onChange={handleCategoriaChange}
                >
                  <option value="Todas">Todas las categorías</option>
                  {categorias.map(cat => (
                    <option
                      key={cat.id_categoria}
                      value={cat.id_categoria}
                    >
                      {cat.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>
              
              {(searchTerm || categoriaSeleccionada !== 'Todas') && (
                <div className="mt-1 flex justify-end md:col-span-3">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCategoriaSeleccionada("Todas");
                    }}
                    className="text-sm text-orange-600 hover:text-orange-800 flex items-center transition-colors duration-150"
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
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Lista de productos */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="border-b pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h3 className="font-medium text-black-900 mb-2 sm:mb-0">
                Lista de productos
                <span className="ml-2 text-sm font-normal text-black-700">
                  Mostrando {productosFiltrados.length} de {productos.length}
                </span>
              </h3>
            </div>
            
            {/* Mensaje de no resultados */}
            {productosFiltrados.length === 0 ? (
              <div className="col-span-full py-8 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-3">
                  <Icono name="gest-productos" size={60} className="text-gray-400" />
                </div>
                <p className="text-gray-500">
                  {searchTerm || categoriaSeleccionada !== 'Todas'
                    ? "No hay productos que coincidan con tu búsqueda. Intenta con otros filtros."
                    : "Aún no hay productos registrados. Comienza agregando un nuevo producto."}
                </p>
                {user && user.rol === "ADMINISTRADOR" && (
                  <Boton
                    tipo="primario"
                    label="Registrar Producto"
                    onClick={handleAgregarProducto}
                    className="mt-4"
                  />
                )}
              </div>
            ) : verTarjetas ? (
              // Vista de tarjetas
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentItems.map(producto => renderProductoItem(producto))}
              </div>
            ) : (
           
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precio
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoría
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((producto) => (
                        <tr key={producto.id_producto} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs flex items-center">
                              {producto.id_imagen && productImages[producto.id_producto] ? (
                                <img 
                                  src={productImages[producto.id_producto]} 
                                  alt={producto.nombre_producto}
                                  className="w-10 h-10 object-cover rounded-md mr-2" 
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-2">
                                  <Icono name="gest-productos" size={20} className="text-gray-400" />
                                </div>
                              )}
                              {producto.nombre_producto}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className="text-orange-600 font-medium">
                              ${parseFloat(producto.precio).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-500 truncate max-w-[120px] sm:max-w-xs">
                            {categorias.find(c => c.id_categoria === producto.id_categoria)?.nombre_categoria || "Sin categoría"}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                              {producto.estado || "Activo"}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleEditarProducto(producto.id_producto)}>
                                <Boton tipo="primario" label="Editar" size="small" />
                              </button>
                              <button onClick={() => handleEliminarProducto(producto.id_producto)}>
                                <Boton tipo="cancelar" label="Eliminar" size="small" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {productosFiltrados.length > 0 && (
              <div className="border-t border-gray-200 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between mt-4">
                <div className="text-sm text-gray-700 mb-2 sm:mb-0 text-center sm:text-left">
                  <p>
                    Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, productosFiltrados.length)}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium">
                      {productosFiltrados.length}
                    </span>{" "}
                    resultados
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button 
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 
                          ? "text-gray-500 cursor-not-allowed" 
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      Anterior
                    </button>
                  
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === pageNum
                              ? 'text-gray-700 z-10'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                          } text-sm font-medium`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button 
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages 
                          ? "text-gray-300 cursor-not-allowed" 
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </Tipografia>
      </div>
      
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <div className="flex justify-center mb-4">
              <Icono name="eliminarAlert" size={65} />
            </div>
            <Tipografia variant="h2" size="xl" className="text-center mb-4">
              ¿Estás seguro de que deseas eliminar este producto?
            </Tipografia>
            <Tipografia size="base" className="text-center text-gray-600 ml-5">
              Esta acción no se puede deshacer.
            </Tipografia>
            <div className="flex justify-center space-x-3 mt-2">
              <Boton
                tipo="secundario"
                label="Cancelar"
                onClick={cancelarEliminacion}
              />
              <Boton
                tipo="primario"
                label="Eliminar"
                onClick={confirmarEliminacion}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProductos;