import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../../context/services/ApiService';
import Tipografia from '../../../components/atoms/Tipografia';
import Iconos from '../../../components/atoms/Iconos';
import Botones from '../../../components/atoms/Botones';
import Encabezado from '../../../components/molecules/Encabezado';
import Buscador from '../../../components/molecules/Buscador';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener la lista de productos al cargar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts();
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error('Error al obtener productos:', err);
        setError('Error al obtener los productos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar productos por término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product => 
      product.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddProduct = () => {
    navigate('/registrar-producto');
  };

  const handleViewProduct = (productId) => {
    // Esta funcionalidad se implementaría si hay una vista detallada del producto
    console.log('Ver producto', productId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Encabezado mensaje="Catálogo de Productos" ruta="/perfil" />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <Tipografia variant="h1" size="2xl" className="mb-4 sm:mb-0">
            Catálogo de Productos
          </Tipografia>
          
          <Botones 
            label="Agregar Producto" 
            tipo="primario" 
            onClick={handleAddProduct}
          />
        </div>
        
        <div className="mb-6">
          <Buscador 
            placeholder="Buscar producto..." 
            onChange={handleSearchChange}
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Tipografia>Cargando productos...</Tipografia>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id_producto}
                className="border rounded-lg p-4 shadow-md bg-white flex flex-col"
              >
                <div className="relative h-48 mb-4 bg-gray-200 rounded-lg overflow-hidden">
                  {product.id_imagen ? (
                    <img
                      src={product.id_imagen}
                      alt={product.nombre_producto}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Iconos name="gest-productos" size={48} />
                    </div>
                  )}
                </div>
                
                <Tipografia variant="h2" size="lg" className="mb-2 font-bold text-purple-900">
                  {product.nombre_producto}
                </Tipografia>
                
                <Tipografia className="text-lg font-semibold text-purple-700 mb-2">
                  ${product.precio?.toLocaleString('es-CO')}
                </Tipografia>
                
                <Tipografia className="text-gray-600 mb-4 flex-grow">
                  {product.descripcion?.length > 100 
                    ? `${product.descripcion.substring(0, 100)}...` 
                    : product.descripcion}
                </Tipografia>
                
                <div className="flex justify-between items-center mt-auto">
                  <Tipografia className="text-sm font-semibold text-gray-500">
                    Stock: {product.cantidad_ingreso}
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
