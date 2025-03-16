import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Iconos from "../atoms/Iconos";
import Tipografia from "../atoms/Tipografia";

const NavegacionAdministrador = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [openMenu, setOpenMenu] = useState(null);
  const [activeRoutes, setActiveRoutes] = useState({});

  // Detectar la ruta actual para marcar menús activos
  useEffect(() => {
    const path = window.location.pathname;
    const routes = {
      "gest-usuarios": path.includes("/gestion/usuarios") || path.includes("/ver/usuario") || path.includes("/editar/usuario") || path.includes("/registrar/usuario"),
      "gest-clientes": path.includes("/gestion/clientes") || path.includes("/ver/cliente") || path.includes("/editar/cliente") || path.includes("/registro/cliente"),
      "gest-productos": path.includes("/productos") || path.includes("/registrar-producto") || path.includes("/editar-producto") || path.includes("/gestion-productos"),
      "inventario": path.includes("/inventario"),
      "gest-zonas": path.includes("/zonas") || path.includes("/gestion-zonas") || path.includes("/editar-zona") || path.includes("/registrar-zona"),
      "gest-acumulados": path.includes("/acumulados"),
      "preventa": path.includes("/preventa"),
      "catalogo": path.includes("/catalogo"),
    };
    
    setActiveRoutes(routes);
    
    // Abrir automáticamente el menú activo
    for (const [key, value] of Object.entries(routes)) {
      if (value) {
        setOpenMenu(key);
        break;
      }
    }
  }, []);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navigateTo = (route) => {
    navigate(route);
  };

  const menuItems = [
    {
      name: "gest-usuarios",
      label: "Gestión de Usuarios",
      isActive: activeRoutes["gest-usuarios"],
      subItems: [
        { label: "Lista de Usuarios", route: "/gestion/usuarios" },
        { label: "Crear Usuario", route: "/registrar/usuario" }
      ],
    },
    {
      name: "gest-clientes",
      label: "Gestión de Clientes",
      isActive: activeRoutes["gest-clientes"],
      subItems: [
        { label: "Lista de Clientes", route: "/gestion/clientes" },
        { label: "Nuevo Cliente", route: "/registro/cliente" }
      ],
    },
    {
      name: "gest-productos",
      label: "Gestión de Productos",
      isActive: activeRoutes["gest-productos"],
      subItems: [
        { label: "Lista de Productos", route: "/gestion-productos" },
        { label: "Agregar Producto", route: "/registrar-producto" },
        { label: "Catálogo", route: "/productos" }
      ],
    },
    {
      name: "inventario",
      label: "Gestión de Inventario",
      isActive: activeRoutes["inventario"],
      subItems: [
        { label: "Ver Inventario", route: "/inventario" },
        { label: "Ingreso de Stock", route: "/register-stock" },
        { label: "Historial de ingreso", route: "/historial-stock" }
      ],
    },
    {
      name: "gest-zonas",
      label: "Gestión de Zonas",
      isActive: activeRoutes["gest-zonas"],
      subItems: [
        { label: "Ver Zonas", route: "/gestion-zonas" },
        { label: "Añadir Zona", route: "/registrar-zona" }
      ],
    },
    {
      name: "gest-acumulados",
      label: "Acumulados",
      isActive: activeRoutes["gest-acumulados"],
      subItems: [{ label: "Reporte Acumulado", route: "/acumulados" }],
    },
    {
      name: "preventa",
      label: "Gestión de Preventa",
      isActive: activeRoutes["preventa"],
      subItems: [
        { label: "Nueva Preventa", route: "/preventa/nueva" },
        { label: "Historial de Preventas", route: "/preventa/historial" },
        { label: "Historial de Ventas", route: "/ventas/historial" }
      ],
    },
    {
      name: "catalogo",
      label: "Gestión de Catálogo",
      isActive: activeRoutes["catalogo"],
      subItems: [
        { label: "Ver Catálogo", route: "/productos" },
        { label: "Añadir Producto", route: "/registrar-producto" }
      ],
    },
  ];

  return (
    <div className="fixed left-1 top-0 z-10 w-64 h-full bg-white border-r shadow-lg border-gray-100 flex flex-col">
      {user && (
        <div className="py-4 px-6 bg-gradient-to-r from-purple-800 to-indigo-700 text-white border-b border-gray-200">
          <Tipografia className="font-semibold">
            {user.nombreCompleto || "Administrador"}
          </Tipografia>
          <Tipografia className="text-sm opacity-90">
            {user.rol}
          </Tipografia>
        </div>
      )}
      
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
                    item.isActive
                      ? "text-purple-700 font-semibold"
                      : "text-gray-700 hover:text-purple-700"
                  }`}
                  onClick={() => toggleMenu(item.name)}
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
                  <Iconos
                    name="despliegue"
                    className={`ml-3 transform transition-transform duration-300 flex-shrink-0 ${
                      openMenu === item.name ? "rotate-180 text-purple-700" : "rotate-0 text-gray-500"
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openMenu === item.name
                      ? "max-h-60 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-10 mt-1 space-y-2 pb-2 pt-1">
                    {item.subItems.map((subItem, index) => (
                      <button
                        key={index}
                        className="flex items-center justify-start w-full text-gray-600 hover:text-purple-600 text-sm py-2 px-2 rounded-md hover:bg-purple-50 transition-colors duration-200 text-left"
                        onClick={() => navigateTo(subItem.route)}
                      >
                        <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-left">
                          {subItem.label}
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
  );
};

export default NavegacionAdministrador;