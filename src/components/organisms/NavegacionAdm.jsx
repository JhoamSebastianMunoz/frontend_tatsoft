import React, { useState } from "react";
import Iconos from "../atoms/Iconos";
import { useNavigate } from "react-router-dom";
import Tipografia from "../atoms/Tipografia";


const NavegacionAdministrador = () => {
   const navigate = useNavigate(); 
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
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
  
  // Función para cerrar sesión y navegar al login
  const handleLogout = () => {
    // agregar cualquier lógica adicional para cerrar sesión
    // como limpiar localStorage, cookies, etc.
    // Navegación al login (ruta raíz)
    navigate("/");
  };

  return (
    <div className="fixed left-1 top-0 z-10 w-64 h-full bg-white border-r shadow-lg border-gray-100 flex flex-col">
      <div className="flex-grow overflow-y-auto py-2">
        <Tipografia>
          <div className="flex flex-col items-start space-y-2 font-medium">
            {menuItems.map((item) => (
              <div key={item.name} className="w-full">
                <button
                  type="button"
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                    openMenu === item.name ? "bg-gray-100" : "bg-transparent"
                  }`}
                  onClick={() => toggleMenu(item.name)}
                >
                  <div className="flex items-center space-x-3">
                    <Iconos name={item.name} />
                    <span className="text-sm text-gray-700">{item.label}</span>
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
        <button className="flex items-center justify-between w-full px-5 py-4 bg-gradient-to-r from-purple-500 to-purple-900 hover:from-purple-600 hover:to-purple-900 text-white rounded-lg"
         onClick={handleLogout} >
          <div className="flex items-center space-x-6">
            <Iconos name="cerrar-sesion" className="text-white" />
            <span className="text-base">
              <Tipografia
              >Cerrar sesión</Tipografia>
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default NavegacionAdministrador;
