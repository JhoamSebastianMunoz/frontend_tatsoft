import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Tipografia from "../atoms/Tipografia";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : true;
  });
  
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (user && user.rol) {
      setUserRole(user.rol);
    } else {
      setUserRole("ADMINISTRADOR");
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !collapsed && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target)
      ) {
        setCollapsed(true);
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [collapsed]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    if (!collapsed) {
      setOpenMenu(null);
    }
  };

  const toggleMenu = (menuName) => {
    if (collapsed) {
      return;
    } 
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isMenuActive = (menuPath, subPaths) => {
    const currentPath = location.pathname;

    if (currentPath === menuPath) {
      return true;
    }

    if (
      subPaths &&
      subPaths.some(
        (subPath) =>
          currentPath.startsWith(subPath) || currentPath.includes(subPath)
      )
    ) {
      return true;
    }

    return false;
  };

  const adminMenuItems = [
    {
      name: "perfil",
      label: "Mi Perfil",
      path: "/perfil",
      icon: "profile",
      subItems: ["Editar Perfil"],
      subPaths: ["/editar/usuario/:id"],
    },
    {
      name: "gest-usuarios",
      label: "Gestión de Usuarios",
      path: "/gestion/usuarios",
      icon: "users",
      subItems: ["Lista de Usuarios", "Crear Usuario"],
      subPaths: ["/gestion/usuarios", "/registrar/usuario"],
    },
    {
      name: "gest-clientes",
      label: "Gestión de Clientes",
      path: "/gestion/clientes",
      icon: "clients",
      subItems: [ "Lista de Clientes", "Nuevo Cliente", "Solicitudes"],
      subPaths: ["/gestion/clientes", "/registro/cliente", "/solicitudes"],
    },
    {
      name: "gest-productos",
      label: "Gestión de Productos",
      path: "/gestion-productos",
      icon: "products",
      subItems: ["Lista de Productos", "Agregar Producto", "Categoría"],
      subPaths: ["/gestion-productos", "/registrar-producto", "/gestionar-categorias"],
    },
    {
      name: "inventario",
      label: "Gestión de Inventario",
      path: "/inventario",
      icon: "inventory",
      subItems: ["Ingreso de Stock", "Historial de ingreso"],
      subPaths: ["/ingreso-stock", "/historial-ingresos"],
    },
    {
      name: "gest-zonas",
      label: "Gestión de Zonas",
      path: "/gestion-zonas",
      icon: "zones",
      subItems: [ "Lista de Zonas", "Registrar Zona"],
      subPaths: ["/gestion-zonas", "/registrar-zona"],
    },
    {
      name: "gest-acumulados",
      label: "Acumulados",
      path: "/acumulados",
      icon: "accumulated",
      subItems: ["Historial de ventas", "Historial de devoluciones"],
      subPaths: ["/ventas/historial", "/devoluciones/historial"],
    },
    {
      name: "preventa",
      label: "Historial de Preventa",
      path: "/preventa/historial",
      icon: "presale",
      subItems: ["Detalles de preventa"],
      subPaths: ["/preventa/detalles/:id"],
    },
   
  ];

  const collaboratorMenuItems = [
    {
      name: "perfil",
      label: "Mi Perfil",
      path: "/perfil",
      icon: "profile",
      subItems: ["Ver Perfil"],
      subPaths: ["/perfil"],
    },
    {
      name: "gest-clientes",
      label: "Gestión de Clientes",
      path: "/gestion/clientes",
      icon: "clients",
      subItems: ["Lista de Clientes", "Solicitud de creación"],
      subPaths: ["/gestion/clientes", "/registro/cliente"],
    },
    {
      name: "gest-acumulados",
      label: "Acumulados",
      path: "/acumulados",
      icon: "accumulated",
      subItems: ["Reporte Acumulado"],
      subPaths: ["/reporte-acumulado"],
    },
    {
      name: "preventa",
      label: "Gestión de Preventa",
      path: "/preventa/historial",
      icon: "presale",
      subItems: ["Nueva Preventa", "Historial de Preventas"],
      subPaths: ["/preventa/nueva", "/preventa/historial"],
    },
    {
      name: "catalogo",
      label: "Catálogo",
      path: "/productos",
      icon: "catalog",
      subPaths: ["/productos"],
    },
    {
      name: "gest-zonas",
      label: "Mis Zonas",
      path: "/gestion-zonas",
      icon: "zones",
      subPaths: ["/gestion-zonas", "/registrar-zona"],
    }
  ];

  const renderIcon = (iconName, className = "") => {
    const iconSize = "w-5 h-5";
    const combinedClasses = `${iconSize} ${className}`;

    switch (iconName) {
      case "profile":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={combinedClasses}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        );
      case "users":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={combinedClasses}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
        );
      case "clients":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={combinedClasses}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
        );
      case "products":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={combinedClasses}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
        );
      case "inventory":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={combinedClasses}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
            />
          </svg>
        );
      case "zones":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={combinedClasses}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
            />
          </svg>
        );
      case "accumulated":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={combinedClasses}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
        );
      case "presale":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={combinedClasses}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
            />
          </svg>
        );
      case "catalog":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={combinedClasses}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
        );
      case "chevron-down":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={combinedClasses}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        );
      case "logout":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={combinedClasses}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        );
      case "collapse":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={combinedClasses}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        );
      case "expand":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={4}
            stroke="currentColor"
            className={combinedClasses}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const menuItems =
    userRole === "ADMINISTRADOR" ? adminMenuItems : collaboratorMenuItems;

  return (
    <div
      ref={sidebarRef}
      className={`bg-white transition-all duration-300 ease-in-out h-screen ${
        collapsed ? "w-16" : "w-70"
      } fixed left-0 top-0 z-50 shadow-md`}
    >
      <div className="flex items-center justify-between h-14 px-4 ">
        {!collapsed ? (
          <Tipografia className="text-xl font-semibold text-gray-700">Menu</Tipografia>
        ) : (
          <div className="w-full flex justify-center"></div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md focus:outline-none text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? renderIcon("expand", "") : renderIcon("collapse", "")}
        </button>
      </div>

      <div className="py-4 flex flex-col h-[calc(100%-6.5rem)]">
        <nav className="px-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {menuItems.map((item) => {
            const isActive = isMenuActive(item.path, item.subPaths);
            return (
              <div key={item.name} className="mb-2.5">
                <button
                  onClick={() => {
                    if (collapsed) {
                      navigate(item.path);
                      return;
                    }
                    toggleMenu(item.name);
                    if (!item.subItems) {
                      navigate(item.path);
                      setCollapsed(true);
                    }
                  }}
                  className={`
                    w-full
                    ${
                      isActive
                        ? "bg-orange-400 text-white"
                        : "text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                    } 
                    group flex items-center py-2.5 px-3 text-sm font-medium rounded-md transition-colors duration-200
                    ${collapsed ? "justify-center" : "justify-between"}
                  `}
                  aria-label={item.label}
                  title={collapsed ? item.label : ""}
                >
                  <div
                    className={`flex items-center ${
                      collapsed ? "" : "space-x-3 flex-1"
                    }`}
                  >
                    {renderIcon(
                      item.icon,
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-gray-700 flex-shrink-0"
                    )}
                    {!collapsed && (
                      <Tipografia className="text-base truncate">
                        {item.label}
                      </Tipografia>
                    )}
                  </div>

                  {!collapsed && item.subItems && (
                    <div
                      className={`transform transition-transform duration-200 ${
                        openMenu === item.name ? "rotate-180" : ""
                      } ml-2 flex-shrink-0`}
                    >
                      {renderIcon("chevron-down", "w-4 h-4 text-gray-400")}
                    </div>
                  )}
                </button>

                {!collapsed && (
                  <div
                    className={`
                      overflow-hidden transition-all duration-200 ease-in-out
                      ${
                        openMenu === item.name
                          ? "max-h-60 opacity-100"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <div className="pl-7 pr-2 py-1.5 space-y-2">
                      {item.subItems &&
                        item.subItems.map((subItem, index) => (
                          <Link
                            key={index}
                            to={item.subPaths[index]}
                            onClick={() => {
                              setCollapsed(true);
                              setOpenMenu(null);
                            }}
                            className={`
                            flex items-center py-1.5 px-2.5 text-sm rounded-md transition-colors duration-200
                            ${
                              location.pathname === item.subPaths[index]
                                ? "bg-gray-400 text-gray-800 font-medium"
                                : "text-black hover:bg-gray-100 hover:text-gray-800"
                            }
                          `}
                          >
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2.5 flex-shrink-0"></div>
                            <Tipografia className="truncate">
                              {subItem}
                            </Tipografia>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      <div
        className={`px-2 ${
          collapsed ? "flex justify-center" : "px-8"
        } border-t border-gray-200 bg-white`}
      >
        <button
          onClick={handleLogout}
          className={`
      ${
        collapsed
          ? "w-10 h-10 p-0 justify-center"
          : "w-full justify-start space-x-3"
      } 
      flex items-center py-2.5 px-5 text-sm font-medium rounded-md 
      bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-orange-700 focus:ring-offset-1 focus:ring-offset-white
    `}
          aria-label="Cerrar sesión"
          title={collapsed ? "Cerrar sesión" : ""}
        >
          {renderIcon("logout", "text-white flex-shrink-0")}
          {!collapsed && <Tipografia>Cerrar sesión</Tipografia>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;