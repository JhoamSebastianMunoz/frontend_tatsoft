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

// Servicios de usuarios
export const userService = {
  getAllUsers: () => usersApi.get('/api/usuarios'),
  getUserById: (id) => usersApi.get(`/api/usuarios/${id}`),
  createUser: (userData) => usersApi.post('/api/usuarios', userData),
  updateUser: (id, userData) => usersApi.put(`/api/usuarios/${id}`, userData),
  deleteUser: (id) => usersApi.delete(`/api/usuarios/${id}`),
  getUserProfile: () => usersApi.get('/api/usuarios/perfil'),
  
  // Nuevos endpoints de asignación de zonas
  assignZonasToUser: (idZona, colaboradoresIds) =>
    usersApi.post(`/api/usuarios/asignar-zonas/${idZona}`, { zonas: colaboradoresIds }),
  
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
};

// Servicios de clientes
export const clientService = {
  getAllClients: () => areasApi.get('/get-clients'),
  getClientById: (id) => areasApi.get(`/get-client/${id}`),
  createClient: (clientData) => areasApi.post('/register-client', clientData),
  updateClient: (id, clientData) => areasApi.put(`/update-client/${id}`, clientData),
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
  createPresale: (presaleData) => presalesApi.post('/registerPresale', presaleData),
  addProductsToPresale: (id, products) => presalesApi.post(`/addProductsPresale/${id}`, products),
  getAllPresales: () => presalesApi.get('/getAllPresales'),
  getPresaleById: (id) => presalesApi.get(`/getPresaleById/${id}`),
  getPresaleDetails: (id) => presalesApi.get(`/detailsPresale/${id}`),
  cancelPresale: (id) => presalesApi.put(`/cancelPreventa/${id}`),
  confirmPresale: (id, returnedProducts) => presalesApi.put(`/confirmPresale/${id}`, { returnedProductos: returnedProducts }),
  updatePresale: (id, productData) => presalesApi.put(`/updatePresale/${id}`, productData),
  deletePresale: (id) => presalesApi.delete(`/deletePresale/${id}`),
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
