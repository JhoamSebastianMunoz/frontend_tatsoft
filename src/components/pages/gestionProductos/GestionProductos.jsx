import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../../context/services/ApiService";
import { imageService } from "../../../context/services/ImageService";
import { useAuth } from "../../../context/AuthContext";
import Tipografia from "../../../components/atoms/Tipografia";
import Icono from "../../../components/atoms/Iconos";
import Boton from "../../../components/atoms/Botones";
import Buscador from "../../molecules/Buscador";
import SidebarAdm from "../../organisms/Sidebar";
import Loading from "../../Loading/Loading";
import ProductoItem from "../../molecules/ProductoItem";
import Encabezado from "../../molecules/Encabezado";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  // Detectar el tamaño de la pantalla para modo responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMobileView(true);
        setSidebarOpen(false);
      } else {
        setMobileView(false);
        setSidebarOpen(true); 
      }
    };
    handleResize(); // Verificar tamaño inicial
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.addEventListener("resize", handleResize);
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
          setProductos(productosResponse.data);
          setProductosFiltrados(productosResponse.data);
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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

  // Clases consistentes
  const containerClass = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
  const cardClass = "bg-white rounded-lg shadow-sm p-6"; 
  const flexRowClass = "flex flex-row items-center";
  const flexColClass = "flex flex-col";
  const buttonContainerClass = "flex items-center gap-2";
  const selectClass = "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const gridClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";
  const modalBgClass = "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50";
  const modalClass = "bg-white rounded-lg p-6 shadow-lg w-80";
  const emptyStateClass = "text-center py-12";

  return (
    <div className="min-h-screen bg-gray-50">  
      <Encabezado mensaje="Gestión de productos" toggleSidebar={toggleSidebar} />
      
      <div className={flexRowClass}>
        {sidebarOpen && <SidebarAdm />}
        
        <div className="w-full">
          {/* Filtros y controles */}
          <div className="bg-white shadow-sm w-full mb-6">
            <div className={containerClass}>
              <div className="py-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center md:justify-between gap-4">
                  <div className="w-full md:w-1/2">
                    <Buscador
                      placeholder="Buscar productos"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                
                  <div className={buttonContainerClass}>
                    <div className="flex-1 md:flex-none">
                      <select
                        className={selectClass}
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
            </div>
          </div>
          
          {/* Mensajes de error */}
          {error && (
            <div className={containerClass}>
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {/* Lista de productos */}
          <div className={containerClass}>
            <div className="mb-8">
              {productosFiltrados.length === 0 ? (
                <div className={`${cardClass} ${emptyStateClass}`}>
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
                <div className={gridClass}>
                  {productosFiltrados.map(producto => (
                    <ProductoItem
                      key={producto.id_producto}
                      producto={producto}
                      onView={handleVerProducto}
                      onDelete={user && user.rol === "ADMINISTRADOR" ? handleEliminarProducto : null}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmación para eliminar producto */}
      {showDeleteModal && (
        <div className={modalBgClass}>
          <div className={modalClass}>
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