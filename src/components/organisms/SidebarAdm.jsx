import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Tipografia from "../atoms/Tipografia";
import Iconos from "../atoms/Iconos";

const SidebarAdm = ({ activeMenuItem = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [userRole, setUserRole] = useState("");

  // Detectar el tamaño de la pantalla para modo responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMobileView(true);
        setSidebarOpen(false); 
      } else {
        setMobileView(false);
        setSidebarOpen(false);
      }
    };

    handleResize(); // Verificar tamaño inicial
    window.addEventListener("resize", handleResize);
   
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Establecer el rol del usuario
  useEffect(() => {
    if (user && user.rol) {
      setUserRole(user.rol);
    }
  }, [user]);

  // Determinar qué menús mostrar según el rol del usuario
  const getMenuItems = () => {
    // Menú para administradores
    const adminMenuItems = [
      {
        name: "gest-usuarios",
        label: "Gestión de Usuarios",
        path: "/gestion/usuarios",
        subItems: ["Crear Usuario", "Modificar Usuario", "Eliminar Usuario"],
        subPaths: ["/registrar/usuario", "/editar/usuario", "/ver/usuario"]
      },
      {
        name: "gest-clientes",
        label: "Gestión de Clientes",
        path: "/gestion/clientes",
        subItems: ["Lista de Clientes", "Nuevo Cliente"],
        subPaths: ["/gestion/clientes", "/registro/cliente"]
      },
      {
        name: "gest-productos",
        label: "Gestión de Productos",
        path: "/gestion-productos",
        subItems: ["Agregar Producto", "Categoría"],
        subPaths: ["/registrar-producto", "/gestionar-categorias"]
      },
      {
        name: "inventario",
        label: "Gestión de Inventario",
        path: "/inventario",
        subItems: ["Ver Inventario", "Ingreso de Stock", "Historial de ingreso"],
        subPaths: ["/inventario", "/ingreso-stock", "/historial-stock"]
      },
      {
        name: "gest-zonas",
        label: "Gestión de Zonas",
        path: "/gestion-zonas",
        subItems: ["Zonas Activas", "Añadir Zona"],
        subPaths: ["/gestion-zonas", "/registrar-zona"]
      },
      {
        name: "gest-acumulados",
        label: "Acumulados",
        path: "/acumulados",
        subItems: ["Reporte Acumulado"],
        subPaths: ["/reporte-acumulado"]
      },
      {
        name: "preventa",
        label: "Gestión de Preventa",
        path: "/preventa/historial",
        subItems: ["Nueva Preventa", "Historial de Preventas"],
        subPaths: ["/preventa/nueva", "/preventa/historial"]
      },
      {
        name: "catalogo",
        label: "Gestión de Catálogo",
        path: "/productos",
        subItems: ["Ver Catálogo", "Añadir Producto"],
        subPaths: ["/productos", "/registrar-producto"]
      }
    ];

    // Menú para colaboradores (más limitado)
    const collaboratorMenuItems = [
      {
        name: "gest-clientes",
        label: "Gestión de Clientes",
        path: "/gestion/clientes",
        subItems: ["Lista de Clientes", "Solicitud de creación"],
        subPaths: ["/gestion/clientes", "/registro/cliente"]
      },
      {
        name: "gest-acumulados",
        label: "Acumulados",
        path: "/acumulados",
        subItems: ["Reporte Acumulado"],
        subPaths: ["/reporte-acumulado"]
      },
      {
        name: "preventa",
        label: "Gestión de Preventa",
        path: "/preventa/historial",
        subItems: ["Nueva Preventa", "Historial de Preventas"],
        subPaths: ["/preventa/nueva", "/preventa/historial"]
      },
      {
        name: "catalogo",
        label: "Gestión de Catálogo",
        path: "/productos",
        subItems: ["Ver Catálogo"],
        subPaths: ["/productos"]
      }
    ];

    // Devolver el menú según el rol
    return userRole === "ADMINISTRADOR" ? adminMenuItems : collaboratorMenuItems;
  };

  const menuItems = getMenuItems();

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Determinar si un menú debe estar activo basado en la ruta actual
  const isMenuActive = (menuPath, subPaths) => {
    const currentPath = location.pathname;
    
    if (currentPath === menuPath) {
      return true;
    }
    
    // También verificar si coincide con alguna subruta
    if (subPaths && subPaths.some(subPath => 
      currentPath.startsWith(subPath) || 
      currentPath.includes(subPath)
    )) {
      return true;
    }
    
    return false;
  };

  const navigateToPath = (path) => {
    navigate(path);
    if (mobileView) {
      setSidebarOpen(false); // Cerrar sidebar en móvil después de navegar
    }
  };

  return (
    <>
      <button
        className="fixed top-3 left-4 z-30 p-2 bg-purple-900 text-white rounded-md hover:bg-purple-800 transition-colors duration-200"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              sidebarOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>
   
      {sidebarOpen && mobileView && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
     
      <div
        className={`fixed left-0 top-0 z-20 w-64 h-full bg-white border-r shadow-lg border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-center items-center">
          <Tipografia className="text-purple-900 font-bold text-xl">
            Menu
          </Tipografia>
        </div>
     
        <div className="flex-grow overflow-y-auto py-2">
          <Tipografia>
            <div className="flex flex-col items-start space-y-1 font-medium">
              {menuItems.map((item) => (
                <div key={item.name} className="w-full">
                  <button
                    type="button"
                    className={`flex items-start w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-purple-50 ${
                      openMenu === item.name ? "bg-purple-50" : "bg-transparent"
                    } ${
                      isMenuActive(item.path, item.subPaths)
                        ? "text-purple-700 font-semibold"
                        : "text-gray-700 hover:text-purple-700"
                    }`}
                    onClick={() => {
                      toggleMenu(item.name);
                      if (item.path) navigateToPath(item.path);
                    }}
                  >
                    <div className="flex items-center space-x-3 overflow-visible mr-auto">
                      <Iconos 
                        name={item.name} 
                        className={`${openMenu === item.name ? "text-purple-700" : "text-gray-500"} flex-shrink-0`} 
                      />
                      <span className="text-sm text-left" style={{whiteSpace: 'normal', textAlign: 'left'}}>
                        {item.label}
                      </span>
                    </div>
                    {item.subItems && (
                      <Iconos
                        name="despliegue"
                        className={`ml-3 transform transition-transform duration-300 flex-shrink-0 ${
                          openMenu === item.name ? "rotate-180 text-purple-700" : "rotate-0 text-gray-500"
                        }`}
                      />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openMenu === item.name
                        ? "max-h-60 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-10 mt-1 space-y-2 pb-2 pt-1">
                      {item.subItems && item.subItems.map((subItem, index) => (
                        <button
                          key={index}
                          className="flex items-center justify-start w-full text-gray-600 hover:text-purple-600 text-sm py-2 px-2 rounded-md hover:bg-purple-50 transition-colors duration-200 text-left"
                          onClick={() => navigateToPath(item.subPaths[index])}
                        >
                          <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 flex-shrink-0"></div>
                          <span className="text-left">
                            {subItem}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tipografia>
        </div>
        <div className="p-4 flex-shrink-0 border-t border-gray-200">
          <button
            className="flex items-center justify-between w-full px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={handleLogout}
          >
            <div className="flex items-center space-x-4">
              <Iconos name="cerrar-sesion" className="text-white" />
              <span className="text-base">
                <Tipografia>Cerrar sesión</Tipografia>
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarAdm;