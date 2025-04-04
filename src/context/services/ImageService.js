import axios from 'axios';
import { productService } from './ApiService';

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
  uploadImage: async (formData) => {
    try {
      console.log("FormData a enviar:");
      
      // Verificar que formData sea una instancia de FormData
      if (!(formData instanceof FormData)) {
        console.error("Error: El parámetro no es una instancia de FormData");
        
        // Si recibimos un File directamente, creamos un nuevo FormData
        if (formData instanceof File) {
          console.log("Recibido un objeto File directamente, creando FormData");
          const newFormData = new FormData();
          newFormData.append('image', formData);
          formData = newFormData;
        } else {
          throw new Error("El parámetro debe ser una instancia de FormData o File");
        }
      }
      
      // IMPORTANTE: NO establecer Content-Type en las solicitudes multipart/form-data
      // Axios lo configurará automáticamente con el boundary correcto
      const response = await imageApiClient.post('/upload-image', formData);
      
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
        // Si hay una propiedad message, podría contener la URL o información útil
        return response.data.message || null;
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
      console.log('Eliminando imagen:', fileName);
      const response = await imageApiClient.delete('/delete-image', {
        data: { fileName }
      });
      
      console.log('Respuesta eliminación de imagen:', response);
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