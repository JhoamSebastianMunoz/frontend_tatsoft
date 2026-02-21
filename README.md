
```markdown name=README.md
# 🛍️ TatSoft Frontend - Gestor de Preventa "Tienda a Tienda"

## Descripción del Proyecto

**TatSoft Frontend** es una aplicación web moderna desarrollada en React y Vite que funciona como un sistema integral de gestión de preventas para distribución directa "Tienda a Tienda". La plataforma está diseñada para optimizar los procesos comerciales, desde la gestión de usuarios y zonas, hasta la administración completa de productos, inventario, ventas y devoluciones.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Características Principales](#características-principales)
- [Tecnología Stack](#-tecnología-stack)
  - [Frontend](#frontend)
  - [Librerías Complementarias](#librerías-complementarias)
  - [Herramientas de Desarrollo](#herramientas-de-desarrollo)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Sistema de Roles y Permisos](#-sistema-de-roles-y-permisos)
- [Enrutamiento Principal](#-enrutamiento-principal)
- [Integración con APIs Externas](#-integración-con-apis-externas)
- [Customización de Estilos](#-customización-de-estilos)
- [Características Destacadas](#-características-destacadas)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)
- [Guía de Componentes](#-guía-de-componentes)
- [Reportar Problemas](#-reportar-problemas)
- [Licencia](#-licencia)
- [Autor](#-autor)
- [Soporte](#-soporte)

---
### Características Principales

- **Autenticación y Autorización**: Sistema robusto de login con recuperación de contraseña y asignación de roles
- **Gestión de Usuarios**: Creación, edición y administración de usuarios con diferentes niveles de permiso
- **Administración de Zonas**: Gestión geográfica de territorios y asignación de colaboradores
- **Catálogo de Productos**: Gestión completa de productos, categorías e inventario
- **Sistema de Preventas**: Creación, seguimiento y confirmación de preventas
- **Historial de Ventas**: Registro detallado de todas las transacciones
- **Gestión de Devoluciones**: Control de devoluciones con comparativas y resúmenes
- **Dashboard Estadístico**: Visualización de métricas diferenciadas por rol
- **Geolocalización**: Integración de mapas con Leaflet y Google Maps
- **Gestión de Perfiles**: Acceso para que colaboradores y administradores actualicen su información

---

## 🚀 Tecnología Stack

### Frontend
- **React 18.3.1** - Librería de interfaz de usuario
- **Vite 5.4.10** - Build tool y servidor de desarrollo
- **React Router DOM 7.1.5** - Enrutamiento de aplicación
- **TailwindCSS 3.4.14** - Framework CSS utilitario

### Librerías Complementarias
- **Leaflet 1.9.4** - Mapas interactivos
- **React Leaflet 4.2.1** - Integración React para Leaflet
- **React Leaflet Draw 0.20.4** - Herramienta de dibujo en mapas
- **Google Maps API** - Integración de Google Maps
- **Axios 1.7.9** - Cliente HTTP para APIs
- **Recharts 2.15.1** - Gráficos y estadísticas
- **React DatePicker 8.2.1** - Selector de fechas
- **React Icons 5.4.0** - Conjunto de iconos
- **Lucide React 0.475.0** - Iconos modernos
- **FontAwesome 6.7.1** - Iconos adicionales
- **React Loader Spinner 6.1.6** - Indicadores de carga

### Herramientas de Desarrollo
- **ESLint 9.13.0** - Linter de código
- **Autoprefixer 10.4.20** - Prefijos CSS automáticos
- **PostCSS 8.4.49** - Procesador CSS

---

## 📋 Requisitos Previos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn** como gestor de paquetes
- Acceso a una API backend (configurar según sea necesario)

---

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/JhoamSebastianMunoz/frontend_tatsoft.git
cd frontend_tatsoft
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📦 Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Inicia el servidor de desarrollo con HMR
```

### Construcción
```bash
npm run build        # Compila la aplicación para producción
```

### Vista Previa de Producción
```bash
npm run preview      # Visualiza la compilación de producción localmente
```

### Linting
```bash
npm run lint         # Ejecuta ESLint para validar la calidad del código
```

---

## 📁 Estructura del Proyecto

```
frontend_tatsoft/
├── public/                          # Archivos estáticos
├── src/
│   ├── components/
│   │   ├── atoms/                  # Componentes atómicos (Button, Input, etc.)
│   │   ├── molecules/              # Componentes compuestos
│   │   ├── organisms/              # Componentes complejos
│   │   ├── pages/                  # Páginas principales
│   │   │   ├── loginPage/          # Autenticación
│   │   │   ├── administrator/      # Panel administrador
│   │   │   ├── gestionZonas/       # Gestión de zonas
│   │   │   ├── customers/          # Gestión de clientes
│   │   │   ├── gestionProductos/   # Gestión de productos
│   │   │   ├── stock/              # Gestión de inventario
│   │   │   ├── preventa/           # Sistema de preventas
│   │   │   ├── ventas/             # Historial de ventas
│   │   │   ├── devoluciones/       # Gestión de devoluciones
│   │   │   ├── estadisticas/       # Dashboards y reportes
│   │   │   ├── collaborator/       # Funcionalidades del colaborador
│   │   │   └── Unauthorized/       # Página de acceso denegado
│   │   └── Loading/                # Componente de carga
│   ├── context/
│   │   ├── AuthContext.js          # Contexto de autenticación
│   │   ├── services/
│   │   │   ├── ApiService.js       # Servicios de API
│   │   │   └── ImageService.js     # Manejo de imágenes
│   │   └── [otros contextos]/      # Otros contextos globales
│   ├── assets/                      # Imágenes, fuentes y recursos
│   ├── App.jsx                      # Componente principal y enrutamiento
│   ├── main.jsx                     # Punto de entrada
│   ├── index.css                    # Estilos globales
│   └── Uso.tx                       # Guía de uso de componentes
├── index.html                       # HTML principal
├── vite.config.js                   # Configuración de Vite
├── tailwind.config.js               # Configuración de TailwindCSS
├── postcss.config.cjs               # Configuración de PostCSS
├── eslint.config.js                 # Configuración de ESLint
├── staticwebapp.config.json         # Configuración para Azure Static Web Apps
├── package.json                     # Dependencias del proyecto
└── README.md                        # Este archivo
```

---

## 🔐 Sistema de Roles y Permisos

La aplicación implementa un sistema basado en dos roles principales:

### 👨‍💼 Administrador
- Acceso completo a todas las funcionalidades
- Gestión de usuarios y asignación de permisos
- Configuración de zonas y colaboradores
- Administración de productos y categorías
- Gestión de inventario
- Visualización de estadísticas globales
- Aprobación de solicitudes de registro de clientes

### 👤 Colaborador
- Acceso a su zona asignada
- Gestión de clientes en su territorio
- Creación de preventas y registro de ventas
- Visualización de sus estadísticas personales
- Solicitud de registro de nuevos clientes

---

## 🗺️ Enrutamiento Principal

| Ruta | Descripción | Roles |
|------|-------------|-------|
| `/` | Login | Público |
| `/home` | Dashboard principal | Admin, Colaborador |
| `/gestion/usuarios` | Gestión de usuarios | Admin |
| `/gestion-zonas` | Gestión de zonas | Admin, Colaborador |
| `/gestion-productos` | Gestión de productos | Admin, Colaborador |
| `/preventa` | Sistema de preventas | Admin, Colaborador |
| `/ventas/historial` | Historial de ventas | Admin, Colaborador |
| `/devoluciones/historial` | Historial de devoluciones | Admin, Colaborador |
| `/perfil` | Perfil del usuario | Admin, Colaborador |

---

## 🌐 Integración con APIs Externas

### Google Maps
- Integración para visualización de zonas geográficas
- Herramientas de dibujo en mapas

### Leaflet Maps
- Mapas interactivos alternativos
- Gestión de capas y marcadores

### API Backend
- Comunicación mediante Axios
- Endpoints para:
  - Autenticación de usuarios
  - Gestión de productos y stock
  - Transacciones de ventas y devoluciones
  - Datos de clientes y zonas

---

## 🎨 Customización de Estilos

El proyecto utiliza **TailwindCSS** para los estilos. Puedes customizar la configuración en `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Aquí añade tus colores personalizados
      },
    },
  },
}
```

---

## 📊 Características Destacadas

### Dashboard Estadístico
- Visualización de métricas por rol
- Gráficos interactivos con Recharts
- Análisis de ventas vs devoluciones
- Resúmenes de acumulados

### Geolocalización
- Visualización de zonas en mapa
- Asignación de territorios a colaboradores
- Herramientas de dibujo de polígonos

### Gestión de Inventario
- Registro de ingresos de stock
- Historial de movimientos
- Control de niveles de inventario

### Sistema de Preventas
- Creación de preventas por cliente
- Seguimiento del estado
- Confirmación y conversión a venta

---

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm run build
# Los archivos en dist/ estarán listos para desplegar
```

La aplicación está configurada para desplegar automáticamente en **Vercel** desde el repositorio.

**URL en Vivo**: https://frontend-tatsoft.vercel.app/

### Azure Static Web Apps
El proyecto incluye `staticwebapp.config.json` para compatibilidad con Azure Static Web Apps.

---

## 🤝 Contribución

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/mi-feature`)
3. Commit tus cambios (`git commit -m 'Añade mi feature'`)
4. Push a la rama (`git push origin feature/mi-feature`)
5. Abre un Pull Request

---

## 📝 Guía de Componentes

Se incluye un archivo `src/Uso.tx` con ejemplos de uso de los componentes disponibles, incluyendo:

- **Átomos**: Botones, Inputs, Paleta Cromática
- **Moléculas**: Formularios, Navegación, Búsqueda
- **Organismos**: Tablas, Cards, Modales

---

## 🐛 Reportar Problemas

Si encuentras bugs o issues, por favor:

1. Abre un [GitHub Issue](https://github.com/JhoamSebastianMunoz/frontend_tatsoft/issues)
2. Describe el problema detalladamente
3. Incluye pasos para reproducirlo

---

## 📄 Licencia

Este proyecto está disponible bajo la licencia MIT.

---

## 👨‍💻 Autor

- Autor: Jhoam Sebastián Muñoz Betancourt
- GitHub: https://github.com/JhoamSebastianMunoz
- Email: jhoamsebastian68@gmail.com

---

## 📞 Soporte

Para soporte técnico o consultas:
- Abre un Issue en el repositorio
- Revisa la documentación en `src/Uso.tx`

---

**Última actualización**: Febrero 2025
```
