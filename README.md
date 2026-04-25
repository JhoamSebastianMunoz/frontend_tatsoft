# TATSoft - Sistema de Gestión Empresarial

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5.4.10-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-3.4.14-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Node-ES%20Modules-green?style=for-the-badge&logo=node.js&logoColor=white" />
</p>

## Descripción del Proyecto

**TATSoft** es una aplicación web empresarial diseñada para la gestión integral de operaciones comerciales. El sistema permite administrar preventas, ventas, devoluciones, inventario, zonas geográficas, clientes, productos y usuarios a través de una interfaz moderna y responsive.

La arquitectura sigue el patrón **Atomic Design** para componentes y está construida sobre una infraestructura de **microservicios** que comunican diferentes dominios de negocio.

---

## Stack Tecnológico

### Core Framework
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.3.1 | Biblioteca UI principal |
| React DOM | 18.3.1 | Renderizado del DOM |
| Vite | 5.4.10 | Build tool y dev server |

### Routing & State
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React Router DOM | 7.1.5 | Navegación SPA |
| Axios | 1.7.9 | Cliente HTTP para API calls |

### Styling & UI
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Tailwind CSS | 3.4.14 | Framework CSS utilitario |
| PostCSS | 8.4.49 | Procesamiento CSS |
| Autoprefixer | 10.4.20 | Prefijos automáticos CSS |
| Lucide React | 0.475.0 | Iconos vectoriales |
| React Icons | 5.4.0 | Biblioteca de iconos |
| FontAwesome | 6.7.1 | Iconos adicionales |

### Mapas y Geolocalización
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Leaflet | 1.9.4 | Mapas interactivos |
| React-Leaflet | 4.2.1 | Integración Leaflet-React |
| React-Leaflet-Draw | 0.20.4 | Dibujo de polígonos en mapas |
| Google Maps API | 2.20.6 | Servicios de Google Maps |

### Visualización de Datos
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Recharts | 2.15.1 | Gráficos y estadísticas |
| React DatePicker | 8.2.1 | Selector de fechas |
| React Loader Spinner | 6.1.6 | Indicadores de carga |

### Development Tools
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| ESLint | 9.13.0 | Linter de código |
| @vitejs/plugin-react | 4.3.3 | Plugin React para Vite |
| Globals | 15.11.0 | Variables globales para ESLint |

---

## Arquitectura de la Aplicación

### Estructura de Carpetas

```
frontend_tatsoft/
├── public/                 # Assets estáticos
├── src/
│   ├── components/         # Componentes React
│   │   ├── atoms/         # Componentes atómicos (botones, inputs)
│   │   ├── molecules/     # Componentes moleculares (formularios)
│   │   ├── organisms/     # Componentes organismos (headers, cards)
│   │   ├── pages/         # Páginas completas
│   │   └── Loading/       # Componentes de carga
│   ├── context/           # Context API
│   │   ├── AuthContext.jsx    # Contexto de autenticación
│   │   ├── services/          # Servicios API
│   │   │   ├── ApiService.js  # Lógica de llamadas HTTP
│   │   │   └── ImageService.js # Gestión de imágenes
│   │   ├── feature/           # Features por dominio
│   │   ├── hooks/             # Custom hooks
│   │   ├── style/             # Estilos compartidos
│   │   └── utils/             # Utilidades
│   ├── assets/            # Recursos estáticos
│   ├── App.jsx            # Componente raíz con rutas
│   ├── main.jsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── index.html             # HTML template
├── vite.config.js         # Configuración Vite + Proxies
├── tailwind.config.js     # Configuración Tailwind
├── postcss.config.cjs     # Configuración PostCSS
├── eslint.config.js       # Configuración ESLint
├── staticwebapp.config.json  # Config Azure Static Web Apps
└── package.json           # Dependencias
```

### Módulos Funcionales

| Módulo | Descripción | Componentes Principales |
|--------|-------------|---------------------------|
| **Autenticación** | Login, recuperación de contraseña | Login, RecuperarPassword, CodigoVerificacion, Restablecer |
| **Administrador** | Gestión de usuarios y solicitudes | GestionUsuarios, RegistroUsuario, EditarUsuario, VerUsuarioAdm, ListaSolicitudes, DetalleSolicitud |
| **Zonas** | Gestión geográfica de territorios | Zonas, MisZonas, GestionZonas, RegistrarZona, EditarZona, ColaboradoresZona, AsignacionZonas |
| **Clientes** | CRM y registro de clientes | GestionClientes, RegistroCliente, EditarCliente, VerCliente, SolicitudRegistroCliente |
| **Productos** | Catálogo y categorías | GestionProductos, ProductList, RegistrarProducto, EditarProducto, GestionCategorias |
| **Inventario** | Control de stock | IngresoStock, HistorialIngresos |
| **Preventas** | Gestión de pedidos anticipados | NuevaPreventa, HistorialPreventas, DetallesPreventa, ConfirmarPreventa, Preventa |
| **Ventas** | Registro y historial de ventas | HistorialVentas, DetallesVenta |
| **Devoluciones** | Gestión de retornos y créditos | HistorialDevoluciones, DetallesDevolucion, ComparativaVentasDevoluciones, ResumenDevoluciones |
| **Estadísticas** | Dashboards y reportes | EstadisticasVentas, EstadisticasColaborador, RolBasedStats |
| **Colaborador** | Perfil de usuario | Profile, EditarPerfil, Acumulados |

### Flujo de Datos

```
Componente (UI)
    ↓
AuthContext (Estado de sesión)
    ↓
ApiService (HTTP Client)
    ↓
Vite Proxy (Redirección de rutas)
    ↓
Microservicios Azure (Backend)
```

---

## Microservicios Integrados

La aplicación se comunica con 5 microservicios independientes desplegados en **Azure App Services**:

| Microservicio | Ruta Local | URL Azure | Dominio |
|--------------|------------|-----------|---------|
| **Auth Service** | `/auth-api/*` | `tatsoftmicroserviceauth-*.azurewebsites.net` | Autenticación y autorización |
| **Users Service** | `/users-api/*` | `tatsoftgestionusuarios-*.azurewebsites.net` | Gestión de usuarios y roles |
| **Areas Service** | `/areas-api/*` | `backendareasandclients-*.azurewebsites.net` | Zonas geográficas y clientes |
| **Products Service** | `/products-api/*` | `backendproducts-*.azurewebsites.net` | Catálogo de productos |
| **Presales Service** | `/presales-api/*` | `backendpresalessalereturns-*.azurewebsites.net` | Preventas, ventas y devoluciones |

### Configuración de Proxy (vite.config.js)

```javascript
proxy: {
  '/auth-api': {
    target: 'https://tatsoftmicroserviceauth-...azurewebsites.net',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/auth-api/, ''),
  },
  '/users-api': { ... },
  '/areas-api': { ... },
  '/products-api': { ... },
  '/presales-api': { ... },
}
```

---

## Instrucciones de Instalación y Uso

### Prerrequisitos

- Node.js 18.x o superior
- npm 9.x o superior

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/JhoamSebastianMunoz/frontend_tatsoft.git
cd frontend_tatsoft

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con Vite |
| `npm run build` | Genera el bundle de producción |
| `npm run preview` | Previsualiza la build de producción localmente |
| `npm run lint` | Ejecuta ESLint para análisis de código |

### Configuración de Desarrollo Local

El servidor de desarrollo se inicia por defecto en `http://localhost:5173`. Los proxies configurados en `vite.config.js` redirigirán automáticamente las llamadas API a los microservicios correspondientes.

---

## Estado Actual y Despliegue 

### Integración de Microservicios

**Funcional**: La integración de los diferentes microservicios (Auth, Users, Areas, Products, Presales) es completamente funcional y ha sido validada en entornos de desarrollo y producción.

### Estado de Despliegue

**Temporalmente Fuera de Línea**: Aunque el código base del frontend y el backend es completamente funcional, **el despliegue tanto del frontend como de los microservicios backend se encuentra temporalmente offline**.

**Causa**: Expiración de los créditos de la suscripción de Microsoft Azure.

**Impacto**:
- Las URLs de Azure Static Web Apps (frontend) no están accesibles
- Los microservicios en Azure App Services están suspendidos
- Las APIs retornan errores de conexión

### Roadmap / Versión v2 

Para la próxima fase del proyecto (v2), se planea una **migración completa de infraestructura**:

- **Se mantiene**: La lógica de negocio y arquitectura de microservicios
- **Se mantiene**: El código del frontend React + Vite
- **Se sustituye**: Los servicios de Azure por nuevos proveedores de despliegue (por determinar: AWS, Google Cloud, Railway, Render, etc.)
- **Objetivo**: Optimizar costos operativos y garantizar alta disponibilidad

**Estado de migración**: En fase de evaluación de proveedores alternativos.

---

## Seguridad y Autenticación

- **Protección de Rutas**: Sistema de rutas protegidas con `ProtectedRoute` basado en roles
- **Contexto de Autenticación**: `AuthContext` centraliza el estado de sesión
- **Roles Soportados**: La aplicación implementa control de acceso basado en roles (RBAC)

---

## Contribución

Este proyecto es parte del ecosistema TATSoft. Para contribuir:

1. Realizar fork del repositorio
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

---

## Licencia

Proyecto propietario - TATSoft. Todos los derechos reservados.

---

## Contacto

Para más información sobre el proyecto o la migración de infraestructura:

- **Repositorio**: [GitHub - frontend_tatsoft](https://github.com/JhoamSebastianMunoz/frontend_tatsoft)
- **Estado del Despliegue**: Ver sección "Estado Actual y Despliegue" arriba

---

<p align="center">
  <strong>TATSoft</strong> - Gestión Empresarial Inteligente
</p>
