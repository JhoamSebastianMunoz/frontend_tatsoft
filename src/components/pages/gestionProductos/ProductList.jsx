import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../../context/services/ApiService';
import { imageService } from '../../../context/services/ImageService';
import Tipografia from '../../../components/atoms/Tipografia';
import Iconos from '../../../components/atoms/Iconos';
import Botones from '../../../components/atoms/Botones';
import Encabezado from '../../../components/molecules/Encabezado';
import Buscador from '../../../components/molecules/Buscador';
import Loading from '../../../components/Loading/Loading';

const ProductList = () => {
  const navigate = useNavigate();
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
    // Navegar a detalles de producto o solo mostrar más información
    console.log('Ver producto', productId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Encabezado mensaje="Catálogo de Productos" ruta="/perfil" />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <Tipografia variant="h1" size="2xl" className="mb-4 sm:mb-0 text-gray-800">
            Catálogo de Productos
          </Tipografia>
          
          <Botones
            label="Agregar Producto"
            tipo="primario"
            onClick={handleAddProduct}
          />
        </div>
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <Buscador
              placeholder="Buscar producto..."
              onChange={handleSearchChange}
              value={searchTerm}
            />
          </div>
          
          <div className="md:col-span-4">
            <select
              className="w-full p-2 border rounded-md"
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
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loading message="Cargando productos..." />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id_producto}
                className="border rounded-lg p-4 shadow-md bg-white flex flex-col"
              >
                <div className="relative h-48 mb-4 bg-gray-200 rounded-lg overflow-hidden">
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
                
                <Tipografia variant="h2" size="lg" className="mb-2 font-bold text-purple-900 line-clamp-2 h-14">
                  {product.nombre_producto}
                </Tipografia>
                
                <Tipografia className="text-lg font-semibold text-purple-700 mb-2">
                  ${parseFloat(product.precio || 0).toLocaleString('es-CO')}
                </Tipografia>
                
                <Tipografia className="text-gray-600 mb-4 flex-grow line-clamp-3">
                  {product.descripcion?.length > 100
                    ? `${product.descripcion.substring(0, 100)}...`
                    : product.descripcion || "Sin descripción disponible"}
                </Tipografia>
                
                <div className="flex justify-between items-center mt-auto">
                  <Tipografia className="text-sm font-semibold text-gray-500">
                    Stock: {product.cantidad_ingreso || 0}
                  </Tipografia>
                  
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
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow p-6">
            <Tipografia size="lg" className="text-gray-500">
              No se encontraron productos{searchTerm ? ' con la búsqueda actual' : ''}.
              {searchTerm ? ' Intenta con otros términos.' : ' Agrega nuevos productos al catálogo.'}
            </Tipografia>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;