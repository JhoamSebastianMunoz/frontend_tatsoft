import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Iconos from "../atoms/Iconos";
import Tipografia from "../atoms/Tipografia";

const NavegacionUsuario = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [openMenu, setOpenMenu] = useState(null);
  const [activeRoutes, setActiveRoutes] = useState({});
  const [userZones, setUserZones] = useState([]);
  const [loading, setLoading] = useState(false);

  // Detectar la ruta actual para marcar menús activos
  useEffect(() => {
    const path = window.location.pathname;
    const routes = {
      "gest-clientes": path.includes("/gestion/clientes") || path.includes("/ver/cliente") || path.includes("/editar/cliente") || path.includes("/registro/cliente"),
      "gest-acumulados": path.includes("/acumulados"),
      "preventa": path.includes("/preventa"),
      "catalogo": path.includes("/catalogo") || path.includes("/productos"),
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

  // Cargar zonas asignadas al colaborador
  useEffect(() => {
    const fetchUserZones = async () => {
      if (user && user.rol === "COLABORADOR") {
        try {
          setLoading(true);
          const response = await fetch('/users-api/api/usuarios/mis-zonas', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUserZones(data.zonas || []);
          }
        } catch (error) {
          console.error("Error al cargar zonas del usuario:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserZones();
  }, [user]);

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
      name: "gest-clientes",
      label: "Gestión de Clientes",
      isActive: activeRoutes["gest-clientes"],
      subItems: [
        { label: "Lista de Clientes", route: "/gestion/clientes" },
        { label: "Solicitud de creación", route: "/registro/cliente" }
      ],
    },
    {
      name: "gest-acumulados",
      label: "Acumulados",
      isActive: activeRoutes["gest-acumulados"],
      subItems: [
        { label: "Reporte Acumulado", route: "/acumulados" }
      ],
    },
    {
      name: "preventa",
      label: "Gestión de Preventa",
      isActive: activeRoutes["preventa"],
      subItems: [
        { label: "Nueva Preventa", route: "/preventa/nueva" },
        { label: "Historial de Preventas", route: "/preventa/historial" }
      ],
    },
    {
      name: "catalogo",
      label: "Gestión de Catálogo",
      isActive: activeRoutes["catalogo"],
      subItems: [
        { label: "Ver Catálogo", route: "/productos" }
      ],
    },
  ];

  return (
    <div className="w-64 bg-white border-r shadow-md border-gray-100 flex flex-col justify-between h-full">
      {user && (
        <div className="py-4 px-6 bg-gradient-to-r from-purple-800 to-indigo-700 text-white border-b border-gray-200">
          <Tipografia className="font-semibold">
            {user.nombreCompleto || "Colaborador"}
          </Tipografia>
          <Tipografia className="text-sm opacity-90">
            {user.rol}
          </Tipografia>
        </div>
      )}
      
      <Tipografia>
        <div className="flex flex-col items-start py-4 space-y-2 font-medium overflow-y-auto flex-grow">
          {/* Sección para mostrar zonas asignadas */}
          <div className="w-full px-4 py-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Zonas Asignadas
            </h3>
            {loading ? (
              <p className="text-sm text-gray-500">Cargando zonas...</p>
            ) : userZones.length > 0 ? (
              <div className="space-y-1">
                {userZones.map((zona) => (
                  <div 
                    key={zona.id_zona_de_trabajo} 
                    className="text-sm py-1 px-2 text-purple-700 flex items-center"
                  >
                    <Iconos name="ubicacion" size={16} className="mr-2" />
                    <span>{zona.nombre_zona_trabajo}</span>
                  </div>
                ))}
                <button 
                  className="text-sm text-purple-600 hover:text-purple-800 underline py-1"
                  onClick={() => navigateTo('/zonas')}
                >
                  Ver todas las zonas
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No tienes zonas asignadas</p>
            )}
            <div className="border-t my-3"></div>
          </div>
          
          {/* Menú principal */}
          {menuItems.map((item) => (
            <div key={item.name} className="w-full">
              <button
                type="button"
                className={`flex items-center justify-between w-full px-3 py-3 rounded-lg transition-colors ${
                  openMenu === item.name ? "bg-gray-100" : "bg-transparent"
                } ${
                  item.isActive ? "text-purple-700 font-semibold" : "text-gray-700"
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
                <div className="ml-7 mt-2 space-y-2">
                  {item.subItems.map((subItem, index) => (
                    <button
                      key={index}
                      className="flex items-center text-gray-600 hover:text-purple-600 text-sm py-1"
                      onClick={() => navigateTo(subItem.route)}
                    >
                      <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Tipografia>
      <div className="p-4">
        <button
          className="flex items-center justify-between w-full px-5 py-4 bg-gradient-to-r from-purple-500 to-purple-900 hover:from-purple-600 hover:to-purple-900 text-white rounded-lg"
          onClick={handleLogout}
        >
          <div className="flex items-center space-x-5">
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

export default NavegacionUsuario;