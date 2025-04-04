import axios from 'axios';

// URLs base de los microservicios
const AUTH_API_URL = '/auth-api';
const USERS_API_URL = '/users-api';
const AREAS_API_URL = '/areas-api';
const PRODUCTS_API_URL = '/products-api';
const PRESALES_API_URL = '/presales-api';

// Para desarrollo directo sin proxy (si es necesario)
const AUTH_DIRECT_URL = 'https://tatsoftmicroserviceauth-c6g4h4bbbcbvchhv.eastus-01.azurewebsites.net';
const USERS_DIRECT_URL = 'https://tatsoftgestionusuarios-hufsaqe0emc6gsf4.eastus-01.azurewebsites.net';
const AREAS_DIRECT_URL = 'https://backendareasandclients-apgba5dxbrbwb2ex.eastus2-01.azurewebsites.net';
const PRODUCTS_DIRECT_URL = 'https://backendproducts-eefufaaeaahzauee.eastus-01.azurewebsites.net';
const PRESALES_DIRECT_URL = 'https://backendpresalessalereturns-g2cghudwf2emhnf4.eastus-01.azurewebsites.net';

// Determinar si usar proxy o URL directa según entorno
const useProxy = process.env.NODE_ENV === 'development';

// Configuración de URLs
const apiUrls = {
  auth: useProxy ? AUTH_API_URL : AUTH_DIRECT_URL,
  users: useProxy ? USERS_API_URL : USERS_DIRECT_URL,
  areas: useProxy ? AREAS_API_URL : AREAS_DIRECT_URL,
  products: useProxy ? PRODUCTS_API_URL : PRODUCTS_DIRECT_URL,
  presales: useProxy ? PRESALES_API_URL : PRESALES_DIRECT_URL
};

// Crear instancia de axios con interceptor para agregar token
const createApiClient = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
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

// Crear clientes para cada microservicio
const authApi = createApiClient(apiUrls.auth);
const usersApi = createApiClient(apiUrls.users);
const areasApi = createApiClient(apiUrls.areas);
const productsApi = createApiClient(apiUrls.products);
const presalesApi = createApiClient(apiUrls.presales);

// Interceptor para manejar errores de autenticación
areasApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si recibimos un 403 o 401 y no hemos intentado renovar el token
    if ((error.response.status === 403 || error.response.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Aquí podrías implementar una renovación de token si tu API lo soporta
      console.log("Intentando renovar token...");
      
      // Por ahora, simplemente mostrar información de depuración
      const token = localStorage.getItem('token');
      console.log("Token actual:", token ? token.substring(0, 15) + "..." : "No hay token");
      
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

// Servicios de usuarios
export const userService = {
  getAllUsers: () => usersApi.get('/api/usuarios'),
  getUserById: (id) => usersApi.get(`/api/usuarios/${id}`),
  createUser: (userData) => usersApi.post('/api/usuarios', userData),
  updateUser: (id, userData) => usersApi.put(`/api/usuarios/${id}`, userData),
  deleteUser: (id) => usersApi.delete(`/api/usuarios/${id}`),
  getUserProfile: () => usersApi.get('/api/usuarios/perfil'),
  
  // Endpoints de asignación de zonas
  assignZonasToUser: (idUsuario, zonasIds) =>
    usersApi.post(`/api/usuarios/asignar-zonas/${idUsuario}`, { zonas: zonasIds }),
  
  getUserZonas: (idUsuario) =>
    usersApi.get(`/api/usuarios/zonas/${idUsuario}`),
  
  getUserOwnZonas: () =>
    usersApi.get('/api/usuarios/mis-zonas'),
  
  getClientesZona: (idZona) =>
    usersApi.get(`/api/usuarios/getclientes-zonas/${idZona}`),
  
  removeZonaFromUser: (idUsuario, idZona) =>
    usersApi.delete(`/api/usuarios/eliminar-zona/${idUsuario}/${idZona}`),
  
  removeAllZonasFromUser: (idUsuario) =>
    usersApi.delete(`/api/usuarios/eliminar-zonas/${idUsuario}`)
};

// Servicios de áreas/zonas
export const areaService = {
  getAllAreas: () => areasApi.get('/get-areas'),
  getAreaById: (id) => areasApi.get(`/get-area/${id}`),
  createArea: (areaData) => areasApi.post('/register-area', areaData),
  updateArea: (id, areaData) => areasApi.put(`/update-area/${id}`, areaData),
  deleteArea: (id) => areasApi.delete(`/delete-area/${id}`),
  getClientsInArea: (id) => areasApi.get(`/get_clientArea/${id}`),
  getAreasByColaborador: async (colaboradorId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/areas/colaborador/${colaboradorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response;
    } catch (error) {
      console.error("Error al obtener áreas del colaborador:", error);
      throw error;
    }
  },
};

// Servicios de clientes
export const clientService = {
  getAllClients: () => areasApi.get('/get-clients'),
  getClientById: (id) => {
    console.log(`Obteniendo cliente con ID: ${id}`);
    return areasApi.get(`/get-client/${id}`);
  },
  createClient: (clientData) => areasApi.post('/register-client', clientData),
  updateClient: (id, clientData) => {
    console.log(`Actualizando cliente ${id} con datos:`, clientData);
    
    // Usar directamente la URL completa sin pasar por el proxy
    const token = localStorage.getItem('token');
    
    // Usar la URL directa en lugar del proxy
    return axios({
      method: 'put',
      url: `${AREAS_DIRECT_URL}/update-client/${id}`,
      data: clientData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  },
  deleteClient: (id) => areasApi.delete(`/delete-client/${id}`),
  requestCreateClient: (clientData) => areasApi.post('/request-create-cliente', clientData),
  getPendingRequests: () => areasApi.get('/get-Pending-Request'),
  processClientRequest: (id, action) => areasApi.put(`/accept-Reject-Request/${id}`, { action }),
};

// Servicios de productos
export const productService = {
  getAllProducts: () => productsApi.get('/get-products'),
  getProductById: (id) => productsApi.get(`/get-product/${id}`),
  createProduct: (productData) => productsApi.post('/register-product', productData),
  updateProduct: (id, productData) => productsApi.put(`/update-product/${id}`, productData),
  deleteProduct: (id) => productsApi.delete(`/delete-product/${id}`),
  uploadImage: (formData) => productsApi.post('/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAllCategories: () => productsApi.get('/getAll-category'),
  getCategoryById: (id) => productsApi.get(`/getById-category/${id}`),
  createCategory: (categoryData) => productsApi.post('/register-category', categoryData),
  updateCategory: (id, categoryData) => productsApi.put(`/update-category/${id}`, categoryData),
  deleteCategory: (id) => productsApi.delete(`/delete_category/${id}`),
  registerStock: (id, stockData) => productsApi.post(`/register-stock/${id}`, stockData),
  getHistoricalStock: () => productsApi.get('/get-hitoricalStock'),
  getStockDetails: (id) => productsApi.get(`/get-detailsStock/${id}`)
};

// Servicios de preventas
export const presaleService = {
  createPresale: async (data) => {
    try {
      const response = await axios.post(`${PRESALES_DIRECT_URL}/registerPresale`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  getAllPresales: async () => {
    try {
      const response = await axios.get(`${PRESALES_DIRECT_URL}/getAllPresales`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  getPresaleDetails: async (id) => {
    try {
      const response = await axios.get(`${PRESALES_DIRECT_URL}/detailsPresale/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  confirmPresale: async (id, data) => {
    try {
      const response = await axios.put(`${PRESALES_DIRECT_URL}/confirmPresale/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  cancelPresale: async (id) => {
    try {
      const response = await axios.put(`${PRESALES_DIRECT_URL}/cancelPreventa/${id}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Ventas
  getAllSales: async () => {
    try {
      const response = await axios.get(`${PRESALES_DIRECT_URL}/getAllSales`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  getSaleDetails: async (id) => {
    try {
      const response = await axios.get(`${PRESALES_DIRECT_URL}/getSaleDetails/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Devoluciones
  getAllRefund: async () => {
    try {
      const response = await axios.get(`${PRESALES_DIRECT_URL}/getAllRefund`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  getRefundDetails: async (id) => {
    try {
      const response = await axios.get(`${PRESALES_DIRECT_URL}/getRefundDetails/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener top 10 clientes que más compran
  getTopClientes: async (fechaInicio, fechaFin) => {
    try {
      const response = await axios.get(`${PRESALES_DIRECT_URL}/top-clientes`, {
        params: {
          fechaInicio,
          fechaFin
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener top 10 productos más vendidos
  getTopProductosVendidos: async (fechaInicio, fechaFin) => {
    try {
      const response = await axios.get(`${PRESALES_DIRECT_URL}/top-productos-vendidos`, {
        params: {
          fechaInicio,
          fechaFin
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener top 10 productos menos vendidos
  getTopProductosMenosVendidos: async (fechaInicio, fechaFin) => {
    try {
      const response = await axios.get(`${PRESALES_DIRECT_URL}/top-productos-menos-vendidos`, {
        params: {
          fechaInicio,
          fechaFin
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Servicios de ventas
export const saleService = {
  getAllSales: () => presalesApi.get('/getAllSales'),
  getSaleById: (id) => presalesApi.get(`/getByIdSale/${id}`),
  getSaleDetails: (id) => presalesApi.get(`/getSaleDetails/${id}`),
};

// Servicio de autenticación directa (para login)
export const authService = {
  login: (cedula, password) => {
    return authApi.post('/api/auth/login', { cedula, password });
  },
  requestPasswordReset: (email) => {
    return authApi.post('/api/reset/request-reset-code', { email });
  },
  validateResetCode: (email, code) => {
    return authApi.post('/api/reset/validate-reset-code', { email, code });
  },
  resetPassword: (email, newPassword) => {
    return authApi.post('/api/reset/reset-password', { email, newPassword });
  }
};

// Servicios para la gestión de stock
export const stockService = {
  // Obtener todos los ingresos de stock
  getAllStockEntries: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${PRODUCTS_DIRECT_URL}/get-hitoricalStock`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        return response.data.entries || [];
      }
      return [];
    } catch (error) {
      console.error("Error al obtener ingresos de stock:", error);
      throw error;
    }
  },
  
  // Crear un nuevo ingreso de stock
  createStockEntry: async (entryData) => {
    try {
      const token = localStorage.getItem('token');
      const url = `${PRODUCTS_DIRECT_URL}/register-stock/${entryData.productoId}`;
      console.log('URL de la petición:', url);
      console.log('Datos a enviar:', {
        cantidad_ingresada: entryData.cantidad,
        fecha_vencimiento: entryData.fechaVencimiento,
        codigo_factura: entryData.codigoFactura,
        costo_total: entryData.costoTotal,
        costo_unitario: entryData.costoUnitario,
        porcentaje_venta: entryData.porcentajeVenta
      });

      const response = await axios.post(
        url,
        {
          cantidad_ingresada: entryData.cantidad,
          fecha_vencimiento: entryData.fechaVencimiento,
          codigo_factura: entryData.codigoFactura,
          costo_total: entryData.costoTotal,
          costo_unitario: entryData.costoUnitario,
          porcentaje_venta: entryData.porcentajeVenta
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error al crear ingreso de stock:", error);
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
        console.error("Estado de la respuesta:", error.response.status);
      }
      throw error;
    }
  },
  
  // Obtener detalles de un ingreso específico
  getStockEntryDetails: async (entryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${PRODUCTS_DIRECT_URL}/get-detailsStock/${entryId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        return response.data.entry || null;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener detalles del ingreso:", error);
      throw error;
    }
  }
};