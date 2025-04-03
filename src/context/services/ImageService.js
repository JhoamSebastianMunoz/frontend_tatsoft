import axios from 'axios';

// URLs base según el entorno
const PRODUCTS_API_URL = '/products-api';
const PRODUCTS_DIRECT_URL = 'https://backendproducts-eefufaaeaahzauee.eastus-01.azurewebsites.net';

// Determinar si usar proxy o URL directa según entorno
const useProxy = process.env.NODE_ENV === 'development';
const baseURL = useProxy ? PRODUCTS_API_URL : PRODUCTS_DIRECT_URL;

// Crear instancia de axios con interceptor para agregar token
const createApiClient = () => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Accept': 'application/json'
    }
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

const imageApiClient = createApiClient();

// Servicio para manejar las imágenes de productos
export const imageService = {
  // Subir una imagen al servidor
  uploadImage: async (imageFormData) => {
    try {
      // Verificación para depuración
      console.log("FormData a enviar:");
      for (let [key, value] of imageFormData.entries()) {
        console.log(`${key}: ${value instanceof File ? `File(${value.name}, ${value.type}, ${value.size})` : value}`);
      }
      
      // IMPORTANTE: No establecer manualmente Content-Type, deja que el navegador lo configure con el boundary
      const response = await imageApiClient.post('/upload-image', imageFormData);
      
      console.log('Respuesta del servidor al subir imagen:', response);
      return response;
    } catch (error) {
      console.error('Error subiendo la imagen:', error);
      throw error;
    }
  },

  // Obtener URL de una imagen por su nombre de archivo
  getImageUrl: async (fileName) => {
    if (!fileName) return null;
    
    try {
      console.log('Obteniendo URL para imagen:', fileName);
      const response = await imageApiClient.get(`/get-image/${fileName}`);
      
      if (response.data && response.data.url) {
        console.log('URL de imagen obtenida:', response.data.url);
        return response.data.url;
      } else {
        console.warn('Respuesta sin URL válida:', response.data);
        // Intentar recuperar la URL de otra forma si la respuesta tiene un formato diferente
        return response.data.message || response.data || null;
      }
    } catch (error) {
      console.error('Error obteniendo URL de imagen:', error);
      return null;
    }
  },

  // Eliminar una imagen por su nombre de archivo
  deleteImage: async (fileName) => {
    if (!fileName) return false;
    
    try {
      await imageApiClient.delete('/delete-image', {
        data: { fileName }
      });
      return true;
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      return false;
    }
  },

  // Obtener imagen para un producto específico
  getProductImage: async (productId) => {
    try {
      // Obtener detalles del producto para encontrar el ID de imagen
      const productResponse = await productService.getProductById(productId);
      const imageId = productResponse.data.id_imagen;
      
      if (!imageId) return null;
      
      // Obtener URL de la imagen usando el ID
      return await imageService.getImageUrl(imageId);
    } catch (error) {
      console.error('Error obteniendo imagen del producto:', error);
      return null;
    }
  }
};

export default imageService;