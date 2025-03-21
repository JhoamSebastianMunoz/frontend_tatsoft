import React, { useState, useEffect } from "react";
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

  // Estados para UI
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  
  // Estado para el control de la barra de navegación
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : true;
  });

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
            // Esto permitirá que ProductoItem use esta propiedad para el color
            colorPrecio: 'text-orange-500'
          }));
          setProductos(productosConColorPrecio);
          setProductosFiltrados(productosConColorPrecio);
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
  };

  const handleEditarProducto = (id) => {
    navigate(`/editar-producto/${id}`);
  };

  const handleEliminarProducto = (id) => {
    setProductoAEliminar(id);
    setShowDeleteModal(true);
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

  // Renderizamos un ProductoItem personalizado con los colores ajustados y sin iconos
  const renderProductoItem = (producto) => {
    return (
      <div key={producto.id_producto} className="bg-white rounded-lg shadow-sm overflow-hidden">
        {producto.id_imagen ? (
          <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
            <img
              src={`ruta-a-la-imagen/${producto.id_imagen}`}
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
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1 truncate">
            {producto.nombre_producto}
          </h3>
          
          <p className="text-orange-500 font-bold text-lg mb-2">
            ${parseFloat(producto.precio).toFixed(2)}
          </p>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {producto.descripcion || "Sin descripción"}
          </p>
          
          <div className="flex justify-between">
            <button
              onClick={() => handleVerProducto(producto.id_producto)}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Ver
            </button>
            
            {user && user.rol === "ADMINISTRADOR" && (
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEditarProducto(producto.id_producto)}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  Editar
                </button>
                
                <button
                  onClick={() => handleEliminarProducto(producto.id_producto)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
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
        <div className="text-black p-4 shadow-md">
          <Tipografia variant="h1" size="xl" className="text-black font-medium">
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
                <Tipografia size="lg" className="text-gray-600 mb-2">
                  No se encontraron productos
                </Tipografia>
                <Tipografia className="text-gray-500 mb-6">
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
            <Tipografia className="text-center mb-4">
              ¿Estás seguro de que deseas eliminar este producto?
            </Tipografia>
            <Tipografia className="text-center text-gray-500 text-sm mb-4">
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