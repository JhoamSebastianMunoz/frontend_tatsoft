import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tipografia from "../../components/atoms/Tipografia";
import Boton from "../../components/atoms/Botones";
import Encabezado from "../../components/molecules/Encabezado";
import Iconos from "../../components/atoms/Iconos";

const Zonas = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedZona, setSelectedZona] = useState("Zona A");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
      subItems: ["Agregar Producto", "Actualizar Stock"],
    },
    {
      name: "inventario",
      label: "Gestión de Inventario",
      subItems: ["Ver Inventario"],
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

  const zonas = [
    "Norte Armenia",
    "Sur Armenia",
    "Calarca",
    "Montenegro",
    "Quimbaya",
  ];

  const clientes = [
    {
      cc: "12097731666",
      nombre: "María Camila Uribe",
      nit: "111111-4",
      razonSocial: "CamilaR",
      telefono: "(606 111 22 33)",
    },
    {
      cc: "98765432100",
      nombre: "Juan Carlos Rodríguez",
      nit: "222222-5",
      razonSocial: "JC Distribuciones",
      telefono: "(606 222 33 44)",
    },
    {
      cc: "45678912345",
      nombre: "Ana María López",
      nit: "333333-6",
      razonSocial: "Tienda Ana",
      telefono: "(606 333 44 55)",
    },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  const handleZonaSelect = (zona) => {
    setSelectedZona(zona);
  };

  const handleNuevoCliente = () => {
    // Save current page in sessionStorage before navigating
    sessionStorage.setItem("returnPath", "/zonas");
    navigate("/registro/cliente");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-b from-purple-50 to-white">
      <button
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-purple-600 text-white rounded-md shadow-md"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              mobileMenuOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>
      <div
        className={`fixed left-0 top-0 z-20 w-64 h-full bg-white border-r shadow-lg border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b flex justify-center items-center">
          <h2 className="text-purple-800 font-bold text-xl">Menu</h2>
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
                      item.name === "gest-zonas"
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

      <div className="w-full md:ml-64 flex-1 flex flex-col transition-all duration-300">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <Encabezado mensaje="Zonas" className="p-4" />
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tipografia>
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-md mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">
                    Seleccionar Zona
                  </h3>
                </div>
                <div className="p-4 flex items-center gap-3 flex-wrap">
                  {zonas.map((zona, index) => (
                    <button
                      key={index}
                      onClick={() => handleZonaSelect(zona)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedZona === zona
                          ? "bg-purple-100 text-purple-700 font-medium border border-purple-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {zona}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Clientes en {selectedZona}
                  </h3>
                  <span className="ml-3 bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                    {clientes.length} Clientes
                  </span>
                </div>
                <Boton
                  tipo="secundario"
                  label="Nuevo Cliente"
                  onClick={handleNuevoCliente}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientes.map((cliente, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="h-2 bg-green-500"></div>
                    <div className="p-4">
                      <h4 className="font-medium text-lg text-gray-900 mb-2">
                        {cliente.razonSocial}
                      </h4>
                      <div className="space-y-1 text-gray-600 mb-4">
                        <p className="flex justify-between">
                          <span className="text-black">CC:</span>
                          <span>{cliente.cc}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-black">Nombre:</span>
                          <span>{cliente.nombre}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-black">NIT:</span>
                          <span>{cliente.nit}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-black">Teléfono:</span>
                          <span>{cliente.telefono}</span>
                        </p>
                      </div>
                    </div>
                    <div className="py-1 bg-gray-50 border-t border-gray-100 ">
                      <div className="card-buttons-container flex justify-center items-center px-2">
                        <Boton
                          label="Realizar Preventa"
                          tipo="secundario"
                          size="medium"
                          onClick={() => {}}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tipografia>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Zonas;