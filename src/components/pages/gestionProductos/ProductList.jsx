import { useNavigate } from 'react-router-dom';
import { productService } from '../../../context/services/ApiService';
import { imageService } from '../../../context/services/ImageService';
import { useAuth } from '../../../context/AuthContext';
import Tipografia from '../../../components/atoms/Tipografia';
import Iconos from '../../../components/atoms/Iconos';
import Botones from '../../../components/atoms/Botones';
import Buscador from '../../../components/molecules/Buscador';
import Loading from '../../../components/Loading/Loading';
import SidebarAdm from '../../organisms/Sidebar';

const ProductList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [productImages, setProductImages] = useState({});

  // Obtener la lista de productos al cargar el componente
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
        const response = await productService.getAllProducts();
        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
          setFilteredProducts(response.data);
         
          // Cargar imágenes para los productos
          const imagePromises = response.data.map(async (product) => {
            if (product.id_imagen) {
              try {
                const imageUrl = await imageService.getImageUrl(product.id_imagen);
                if (imageUrl) {
                  return { id: product.id_producto, url: imageUrl };
                }
              } catch (error) {
                console.error('Error cargando imagen para producto', product.id_producto, error);
              }
            }
            return { id: product.id_producto, url: null };
          });
         
          const productImagesResults = await Promise.all(imagePromises);
          const imagesMap = {};
          productImagesResults.forEach(({ id, url }) => {
            imagesMap[id] = url;
          });
         
          setProductImages(imagesMap);
        }
      } catch (err) {
        console.error('Error al obtener productos:', err);
        setError('Error al obtener los productos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrar productos por término de búsqueda y categoría
  useEffect(() => {
    let filtered = [...products];
   
    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(product =>
        product.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
   
    // Filtrar por categoría
    if (categoriaSeleccionada !== 'Todas') {
      filtered = filtered.filter(product =>
        product.id_categoria === parseInt(categoriaSeleccionada)
      );
    }
   
    setFilteredProducts(filtered);
  }, [searchTerm, categoriaSeleccionada, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
 
  const handleCategoriaChange = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

  const handleAddProduct = () => {
    navigate('/registrar-producto');
  };

  const handleViewProduct = (productId) => {
    navigate(`/producto/${productId}`);
  };

  if (loading && products.length === 0) {
    return <Loading message="Cargando productos..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 ml-10 pl-6">
      <SidebarAdm />
      
      <Tipografia>
        <div className="w-full bg-white shadow-sm mb-4">
          <div className="px-2 sm:px-4 lg:px-8 py-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Catálogo de Productos</h1>
          </div>
        </div>
        
        <div className="container mx-auto px-2 sm:px-4 py-2 w-full">
          {/* Contador de productos */}
          <div className="bg-white rounded-lg shadow-md border-l-2 border-orange-600 mb-4">
            <div className="p-3 flex flex-col sm:flex-row justify-between items-center">
              <div>
                <div className="flex items-center mt-1">
                  <span className="bg-orange-200 text-orange-800 text-xs font-medium px-3 py-0.5 rounded-full mr-3">
                    {products.length} Total
                  </span>
                  <span className="bg-transparent border border-orange-600 text-orange-800 text-xs font-medium px-3 py-0.5 rounded-full">
                    {filteredProducts.length} Filtrados
                  </span>
                </div>
              </div>
              
              {user && user.rol === "ADMINISTRADOR" && (
                <Botones
                  label="Agregar Producto"
                  tipo="primario"
                  onClick={handleAddProduct}
                  className="mt-3 sm:mt-0"
                />
              )}
            </div>
          </div>
          
          {/* Filtros */}
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <h2 className="text-lg font-medium mb-3 text-gray-800">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar:
                </label>
                <Buscador
                  placeholder="Buscar producto"
                  onChange={handleSearchChange}
                  value={searchTerm}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría:
                </label>
                <select
                  className="w-full p-2 border border-gray-300 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 rounded-lg"
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
            </div>
            
            {(searchTerm || categoriaSeleccionada !== 'Todas') && (
              <div className="mt-3 flex justify-end">
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
          
          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <div className="flex items-center">
                <Iconos name="eliminarAlert" size={20} />
                <span className="ml-2 text-sm sm:text-base">{error}</span>
              </div>
            </div>
          )}
          
          {/* Lista de productos */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="border-b pb-3 mb-4 flex justify-between items-center">
              <h3 className="font-medium text-orange-700 text-lg sm:text-xl">
                Productos Disponibles
                <span className="ml-2 text-sm font-normal text-gray-700">
                  Mostrando {filteredProducts.length} de {products.length}
                </span>
              </h3>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loading message="Cargando productos..." />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id_producto}
                    className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="relative h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                      {productImages[product.id_producto] ? (
                        <img
                          src={productImages[product.id_producto]}
                          alt={product.nombre_producto}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.target.onerror = null;
                            const imgMap = {...productImages};
                            imgMap[product.id_producto] = null;
                            setProductImages(imgMap);
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <Iconos name="gest-productos" size={48} />
                        </div>
                      )}
                    </div>
                   
                    <h3 className="mb-2 font-bold text-gray-900 line-clamp-2 h-14 text-lg">
                      {product.nombre_producto}
                    </h3>
                   
                    <p className="text-lg font-semibold text-orange-700 mb-2">
                      ${parseFloat(product.precio || 0).toLocaleString('es-CO')}
                    </p>
                   
                    <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                      {product.descripcion?.length > 100
                        ? `${product.descripcion.substring(0, 100)}...`
                        : product.descripcion || "Sin descripción disponible"}
                    </p>
                   
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-sm font-semibold text-gray-500">
                        Stock: {product.cantidad_ingreso || 0}
                      </span>
                     
                      <Botones
                        label="Ver Detalles"
                        tipo="secundario"
                        size="small"
                        onClick={() => handleViewProduct(product.id_producto)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-3">
                  <Iconos name="gest-productos" size={40} className="text-gray-400" />
                </div>
                <p className="text-gray-500">
                  No se encontraron productos{searchTerm || categoriaSeleccionada !== 'Todas' ? ' con los filtros actuales' : ''}.
                  {searchTerm || categoriaSeleccionada !== 'Todas' ? ' Intenta con otros filtros.' : ' Agrega nuevos productos al catálogo.'}
                </p>
              </div>
            )}
            
            {/* Paginación */}
            {filteredProducts.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between mt-4">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">1</span> a{" "}
                      <span className="font-medium">
                        {filteredProducts.length > 10 ? 10 : filteredProducts.length}
                      </span>{" "}
                      de{" "}
                      <span className="font-medium">
                        {filteredProducts.length}
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
        </div>
      </Tipografia>
    </div>
  );
};

export default ProductList;