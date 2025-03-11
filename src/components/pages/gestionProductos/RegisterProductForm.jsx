import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../../context/services/ApiService';
import CampoTexto from '../../../components/atoms/CamposTexto';
import Botones from '../../../components/atoms/Botones';
import Tipografia from '../../../components/atoms/Tipografia';
import Encabezado from '../../../components/molecules/Encabezado';

const RegisterProductForm = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    nombre_producto: '',
    precio: '',
    descripcion: '',
    cantidad_ingreso: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Cleanup de la URL de vista previa cuando cambia la imagen
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      setError('Por favor seleccione una imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      setUploading(true);
      setError('');
      
      const response = await productService.uploadImage(formData);
      const { url } = response.data;
      
      setUploadedImageUrl(url);
      alert('Imagen subida correctamente.');
    } catch (err) {
      console.error('Error al subir la imagen:', err);
      setError('Error al subir la imagen. Por favor, intenta de nuevo más tarde.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos
    if (!productData.nombre_producto || !productData.precio) {
      setError('Los campos Nombre del Producto y Precio son obligatorios.');
      return;
    }
    
    // Se permite registrar sin imagen, aunque es recomendable tenerla
    if (!uploadedImageUrl) {
      const confirmSinImagen = window.confirm('¿Desea continuar sin subir una imagen para el producto?');
      if (!confirmSinImagen) {
        return;
      }
    }

    try {
      setLoading(true);
      setError('');
      
      const dataToSend = {
        nombre_producto: productData.nombre_producto,
        precio: parseFloat(productData.precio),
        descripcion: productData.descripcion,
        cantidad_ingreso: parseInt(productData.cantidad_ingreso, 10) || 0,
        id_imagen: uploadedImageUrl || null,
      };
      
      await productService.createProduct(dataToSend);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/productos');
      }, 2000);
    } catch (err) {
      console.error('Error registrando producto:', err);
      setError('Error al registrar el producto. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Encabezado mensaje="Registro de Producto" ruta="/productos" />
      
      <div className="flex flex-col items-center p-4 max-w-3xl mx-auto w-full">
        <Tipografia variant="h1" size="2xl" className="mb-6 text-center">
          Registro de Producto
        </Tipografia>

        {error && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Producto registrado con éxito. Redirigiendo...
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full bg-white p-6 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <CampoTexto
                label="Nombre del Producto"
                id="nombre_producto"
                placeholder="Ingrese el nombre del producto"
                value={productData.nombre_producto}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <CampoTexto
                label="Precio"
                id="precio"
                type="number"
                placeholder="Ingrese el precio"
                value={productData.precio}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <CampoTexto
                label="Cantidad Ingreso"
                id="cantidad_ingreso"
                type="number"
                placeholder="Ingrese la cantidad"
                value={productData.cantidad_ingreso}
                onChange={handleChange}
              />
            </div>
            
            <div className="md:col-span-2">
              <label
                htmlFor="descripcion"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Descripción
              </label>
              <textarea
                id="descripcion"
                placeholder="Ingrese la descripción del producto"
                value={productData.descripcion}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                rows="4"
              />
            </div>
            
            <div className="md:col-span-2">
              <label
                htmlFor="image"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Imagen del Producto
              </label>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  
                  <button
                    type="button"
                    onClick={handleUploadImage}
                    className="mt-2 w-full py-2 rounded-lg bg-purple-500 text-white font-bold hover:bg-purple-600 disabled:bg-purple-300"
                    disabled={uploading || !imageFile}
                  >
                    {uploading ? 'Subiendo...' : 'Subir Imagen'}
                  </button>
                </div>
                
                {previewImage && (
                  <div className="flex-shrink-0">
                    <div className="border rounded-lg overflow-hidden w-32 h-32">
                      <img
                        src={previewImage}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {uploadedImageUrl && (
                      <div className="mt-2 text-xs text-green-600 font-semibold">
                        ¡Imagen subida correctamente!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Botones 
              label={loading ? "Registrando..." : "Registrar Producto"} 
              tipo="primario" 
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterProductForm;