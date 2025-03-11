import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para el servicio de autenticación
      '/auth-api': {
        target: 'https://tatsoftmicroserviceauth-c6g4h4bbbcbvchhv.eastus-01.azurewebsites.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth-api/, ''),
      },
      // Proxy para el servicio de usuarios
      '/users-api': {
        target: 'https://tatsoftgestionusuarios-hufsaqe0emc6gsf4.eastus-01.azurewebsites.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/users-api/, ''),
      },
      // Proxy para el servicio de áreas y clientes
      '/areas-api': {
        target: 'https://backendareasandclients-apgba5dxbrbwb2ex.eastus2-01.azurewebsites.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/areas-api/, ''),
      },
      // Proxy para el servicio de productos
      '/products-api': {
        target: 'https://backendproducts-eefufaaeaahzauee.eastus-01.azurewebsites.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/products-api/, ''),
      },
      // Proxy para el servicio de preventas
      '/presales-api': {
        target: 'https://backendpresalessalereturns-g2cghudwf2emhnf4.eastus-01.azurewebsites.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/presales-api/, ''),
      },
    },
  },
});