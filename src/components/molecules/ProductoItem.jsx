import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tipografia from '../atoms/Tipografia';
import Icono from '../atoms/Iconos';
import { imageService } from '../../context/services/ImageService';
import placeholderImage from '../../assets/placeholder-product.jfif';

const ProductoItem = ({ producto, onView, onDelete }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar la imagen del producto si existe
    const fetchImage = async () => {
      if (producto.id_imagen) {
        setLoading(true);
        try {
          const url = await imageService.getImageUrl(producto.id_imagen);
          if (url) {
            setImageUrl(url);
          }
        } catch (error) {
          console.error('Error cargando imagen:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchImage();
  }, [producto.id_imagen]);

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleEdit = () => {
    navigate(`/editar-producto/${producto.id_producto}`);
    setMenuOpen(false);
  };

  const handleView = () => {
    if (onView) {
      onView(producto.id_producto);
    }
    setMenuOpen(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(producto.id_producto);
    }
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Formatear el precio con separador de miles
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
      {/* Menú de opciones */}
      <div className="absolute top-2 right-2 z-10">
        <button
          className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full text-gray-600"
          onClick={handleToggleMenu}
        >
          <Icono name="menu-dots" size={18} />
        </button>
        
        {menuOpen && (
          <>
            <div 
              className="fixed inset-0 z-10"
              onClick={closeMenu}
            ></div>
            <div className="absolute right-0 mt-1 w-32 bg-white border rounded-md shadow-lg z-20">
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                onClick={handleView}
              >
                Ver
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                onClick={handleEdit}
              >
                Editar
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Imagen del producto */}
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {loading ? (
          <div className="animate-pulse w-full h-full bg-gray-200"></div>
        ) : (
          <img
            src={imageUrl || placeholderImage}
            alt={producto.nombre_producto}
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImage;
            }}
          />
        )}
      </div>
      
      {/* Información del producto */}
      <div className="p-4">
        <Tipografia 
          variant="h3" 
          className="text-gray-800 font-medium line-clamp-2 h-12 mb-1"
          title={producto.nombre_producto}
        >
          {producto.nombre_producto}
        </Tipografia>
        
        <Tipografia className="text-gray-500 text-sm mb-2">
          Stock: {producto.cantidad_ingreso || 0}
        </Tipografia>
        
        <Tipografia className="text-lg font-bold text-purple-700">
          ${formatPrice(producto.precio || 0)}
        </Tipografia>
        
        <button
          onClick={handleEdit}
          className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-3 rounded text-sm transition-colors"
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default ProductoItem;