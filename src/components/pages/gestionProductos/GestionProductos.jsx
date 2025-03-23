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
  
  // Estado para el control de la barra de navegación
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : true;
  });
  
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

  // Guardar estado del sidebar en localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

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
  }, [searchTerm, categoriaSeleccionada, productos]);

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
    console.log(`Ver producto con ID ${id}`);
    setOpenMenuId(null);
  };

  const handleEditarProducto = (id) => {
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

  if (loading && productos.length === 0) {
    return <Loading message="Cargando productos..." />;
  }

  // Renderizamos un ProductoItem personalizado con menú desplegable
  const renderProductoItem = (producto) => {
    return (
      <div key={producto.id_producto} className="bg-white rounded-lg shadow-sm overflow-hidden relative">
        {/* Menú desplegable de opciones */}
        <div className="absolute top-2 right-2 z-10">
          <button 
            onClick={(e) => toggleMenu(producto.id_producto, e)}
            className="w-8 h-8 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 flex items-center justify-center shadow-sm transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {/* Menú desplegable */}
          {openMenuId === producto.id_producto && (
            <div 
              ref={menuRef}
              className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200"
            >
              <button
                onClick={() => handleVerProducto(producto.id_producto)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Ver detalle
              </button>
              
              {user && user.rol === "ADMINISTRADOR" && (
                <>
                  <button
                    onClick={() => handleEditarProducto(producto.id_producto)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Editar
                  </button>
                  
                  <button
                    onClick={() => handleEliminarProducto(producto.id_producto)}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Imagen del producto */}
        <div 
          className="cursor-pointer" 
          onClick={() => handleVerProducto(producto.id_producto)}
        >
          {producto.id_imagen && productImages[producto.id_producto] ? (
            <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
              <img
                src={productImages[producto.id_producto]}
                alt={producto.nombre_producto}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "ruta-a-imagen-placeholder";
                }}
              />
            </div>
          ) : (
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <Icono name="gest-productos" size={50} className="text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Información del producto */}
        <div 
          className="p-4 cursor-pointer" 
          onClick={() => handleVerProducto(producto.id_producto)}
        >
          <h3 className="font-literata text-base text-gray-800 mb-1 truncate">
            {producto.nombre_producto}
          </h3>
          
          <p className="font-literata text-lg text-orange-500 font-bold mb-2">
            ${parseFloat(producto.precio).toFixed(2)}
          </p>
          
          <p className="font-literata text-sm text-gray-600 mb-4 line-clamp-2">
            {producto.descripcion || "Sin descripción"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">  
      {/* Sidebar */}
      <Sidebar />
      
      <div className={`flex-1 transition-all duration-300 ${
        !collapsed ? "md:ml-70" : "md:ml-16"
      }`}>
        {/* Header */}
        <div className="text-black p-4 mb-4 ">
          <Tipografia 
            variant="h1" 
            size="2xl" 
            className="text-black font-medium pl-2 md:pl-4"
          >
            Gestión de Productos
          </Tipografia>
        </div>
        
        {/* Contenido principal */}
        <div className="p-6">
          {/* Filtros y controles */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row items-stretch md:items-center md:justify-between gap-4">
              <div className="w-full md:w-1/2">
                <Buscador
                  placeholder="Buscar productos"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            
              <div className="flex items-center gap-2">
                <div className="flex-1 md:flex-none">
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
              
                {user && user.rol === "ADMINISTRADOR" && (
                  <Boton
                    tipo="primario"
                    label="Agregar Producto"
                    onClick={handleAgregarProducto}
                    className="whitespace-nowrap"
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Mensajes de error */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          {/* Lista de productos */}
          <div className="mb-8">
            {productosFiltrados.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center py-12">
                <Icono name="gest-productos" size={60} className="mx-auto text-gray-400 mb-4" />
                <Tipografia variant="h2" size="xl" className="text-gray-600 mb-2">
                  No se encontraron productos
                </Tipografia>
                <Tipografia size="base" className="text-gray-500 mb-6">
                  {searchTerm || categoriaSeleccionada !== 'Todas'
                    ? "No hay productos que coincidan con tu búsqueda. Intenta con otros filtros."
                    : "Aún no hay productos registrados. Comienza agregando un nuevo producto."}
                </Tipografia>
                {user && user.rol === "ADMINISTRADOR" && (
                  <Boton
                    tipo="primario"
                    label="Agregar Producto"
                    onClick={handleAgregarProducto}
                  />
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productosFiltrados.map(producto => renderProductoItem(producto))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal de confirmación para eliminar producto */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <div className="flex justify-center mb-4">
              <Icono name="eliminarAlert" size={65} />
            </div>
            <Tipografia variant="h2" size="xl" className="text-center mb-4">
              ¿Estás seguro de que deseas eliminar este producto?
            </Tipografia>
            <Tipografia size="sm" className="text-center text-gray-500 mb-4">
              Esta acción no se puede deshacer.
            </Tipografia>
            <div className="flex justify-center space-x-3">
              <Boton
                tipo="cancelar"
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