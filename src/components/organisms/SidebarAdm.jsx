import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tipografia from "../atoms/Tipografia";
import Iconos from "../atoms/Iconos";

const Sidebar = ({ activeMenuItem = null }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  // Configura inicialmente el menú activo
  useEffect(() => {
    if (activeMenuItem) {
      setOpenMenu(activeMenuItem);
    }
  }, [activeMenuItem]);

  // Detectar el tamaño de la pantalla para modo responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMobileView(true);
        setSidebarOpen(false);
      } else {
        setMobileView(false);
        setSidebarOpen(true);
      }
    };

    handleResize(); // Verificar tamaño inicial
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    {
      name: "gest-usuarios",
      label: "Gestión de Usuarios",
      subItems: ["Crear Usuario", "Modificar Usuario", "Eliminar Usuario"],
    },
    {
      name: "gest-clientes",
      label: "Gestión de Clientes",
      subItems: ["Lista de Clientes", "Nuevo Cliente"],
    },
    {
      name: "gest-productos",
      label: "Gestión de Productos",
      subItems: ["Agregar Producto", "Categoría"],
    },
    {
      name: "inventario",
      label: "Gestión de Inventario",
      subItems: ["Ver Inventario", "Ingreso de Stock", "Historial de ingreso"],
    },
    {
      name: "gest-zonas",
      label: "Gestión de Zonas",
      subItems: ["Zonas Activas", "Añadir Zona"],
    },
    {
      name: "gest-acumulados",
      label: "Acumulados",
      subItems: ["Reporte Acumulado"],
    },
    {
      name: "preventa",
      label: "Gestión de Preventa",
      subItems: ["Nueva Preventa", "Historial de Preventas"],
    },
    {
      name: "catalogo",
      label: "Gestión de Catálogo",
      subItems: ["Ver Catálogo", "Añadir Producto"],
    },
  ];

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        className="fixed top-3 left-4 z-30 p-2 bg-purple-900 text-white rounded-md shadow-md"
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

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-20 w-64 h-full bg-white border-r shadow-lg border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-purple-800 font-bold text-xl">Menu</h2>
          {mobileView && (
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-purple-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="flex-grow overflow-y-auto py-2">
          <Tipografia>
            <div className="flex flex-col items-start space-y-2 font-medium">
              {menuItems.map((item) => (
                <div key={item.name} className="w-full">
                  <button
                    type="button"
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                      openMenu === item.name ? "bg-gray-100" : "bg-transparent"
                    } ${
                      item.name === activeMenuItem
                        ? "text-purple-700 font-semibold"
                        : "text-gray-700"
                    }`}
                    onClick={() => toggleMenu(item.name)}
                  >
                    <div className="flex items-center space-x-3">
                      <Iconos name={item.name} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.subItems && (
                      <Iconos
                        name="despliegue"
                        className={`ml-3 transform transition-transform ${
                          openMenu === item.name ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    )}
                  </button>

                  {openMenu === item.name && (
                    <div className="ml-8 mt-1 space-y-2">
                      {item.subItems.map((subItem, index) => (
                        <button
                          key={index}
                          className="flex items-center text-gray-600 hover:text-purple-600 text-sm py-1"
                        >
                          <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                          {subItem}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Tipografia>
        </div>
        <div className="p-4 flex-shrink-0">
          <button
            className="flex items-center justify-between w-full px-5 py-4 bg-gradient-to-r from-purple-500 to-purple-900 hover:from-purple-600 hover:to-purple-900 text-white rounded-lg"
            onClick={handleLogout}
          >
            <div className="flex items-center space-x-6">
              <Iconos name="cerrar-sesion" className="text-white" />
              <span className="text-base">
                <Tipografia>Cerrar sesión</Tipografia>
              </span>
            </div>
          </button>
        </div>
      </div>
      {sidebarOpen && mobileView && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;