import React, { useState } from "react";
import { Link } from "react-router-dom";
import Tipografia from "../../atoms/Tipografia";
import NavegacionAdministrador from "../../organisms/NavegacionAdm";
import Icono from "../../atoms/Iconos";

const GestionProductos = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);
    const [showNavegacion, setShowNavegacion] = useState(true);
    
    // Lista de productos
    const productos = [
      { id: 1, nombre: "Leche Colanta Uht Deslactosada 1000 ML", precio: 5200 },
      { id: 2, nombre: "Leche Colanta Uht Deslactosada 1000 ML", precio: 5200 },
      { id: 3, nombre: "Leche Colanta Uht Deslactosada 1000 ML", precio: 5200 },
      { id: 4, nombre: "Leche Colanta Uht Deslactosada 1000 ML", precio: 5200 },
      { id: 5, nombre: "Leche Colanta Uht Deslactosada 1000 ML", precio: 5200 },
      { id: 6, nombre: "Leche Colanta Uht Deslactosada 1000 ML", precio: 5200 },
      { id: 7, nombre: "Leche Colanta Uht Deslactosada 1000 ML", precio: 5200 },
      { id: 8, nombre: "Leche Colanta Uht Deslactosada 1000 ML", precio: 5200 },
    ];
  
    const toggleNavegacion = () => {
      setShowNavegacion(!showNavegacion);
    };
  
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };
  
    const handleVerProducto = (id) => {
      console.log(`Ver detalles del producto con ID: ${id}`);
      setOpenMenuId(null);
    };
  
    const handleEliminarProducto = (id) => {
      console.log(`Eliminar producto con ID: ${id}`);
      setOpenMenuId(null);
    };
  
    const toggleMenu = (id, e) => {
      e.stopPropagation();
      setOpenMenuId(openMenuId === id ? null : id);
    };
  
    const handleOutsideClick = () => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };
  
    const getProductosEnFilas = () => {
      const filas = [];
      for (let i = 0; i < productos.length; i += 4) {
        filas.push(productos.slice(i, i + 4));
      }
      return filas;
    };
  
    return (
      <div className="flex h-screen">
        {/* Navegación lateral */}
        {showNavegacion && (
          <div className="w-64 h-full">
            <NavegacionAdministrador />
          </div>
        )}
        
        {/* Contenido principal */}
        <div className="flex-1 flex flex-col bg-white overflow-auto" onClick={handleOutsideClick}>
          {/* Header */}
          <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
            <button 
              onClick={toggleNavegacion} 
              className="text-white flex items-center justify-center rounded-full bg-white bg-opacity-30 h-10 w-10"
            >
              <span className="text-xl">☰</span>
            </button>
            <Tipografia variant="h1" size="xl" className="text-white font-medium">
              Gestión de productos
            </Tipografia>
            <div className="w-10"></div> {/* Espacio para equilibrar el header */}
          </div>
        
        {/* Barra de búsqueda */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos, marcas"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-2 pl-4 pr-10 border rounded-full text-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Filtros y botón Registrar */}
        <div className="px-6 py-2 flex justify-between items-center">
          <button className="bg-purple-500 text-white py-1.5 px-4 rounded-md text-sm flex items-center">
            <span className="mr-2">≡</span>
            Filtros
          </button>
          
          {/* Usando Link para navegación directa sin JavaScript */}
          <Link 
            to="/registrar-producto"
            className="bg-purple-500 text-white py-1.5 px-4 rounded-md text-sm flex items-center no-underline"
          >
            Registrar Producto
            <span className="ml-2">📝</span>
          </Link>
        </div>
        
        {/* Lista de productos */}
        <div className="p-4 flex-grow">
          {getProductosEnFilas().map((fila, filaIndex) => (
            <div key={filaIndex} className="flex mb-6 space-x-4">
              {fila.map((producto) => (
                <div key={producto.id} className="flex-1 relative">
                  <div className="absolute top-0 right-0 z-10">
                    <div className="relative">
                      <button 
                        className="bg-purple-100 p-1 rounded-full"
                        onClick={(e) => toggleMenu(producto.id, e)}
                      >
                        <svg className="w-5 h-5 text-purple-800" viewBox="0 0 16 16" fill="currentColor">
                          <circle cx="8" cy="4" r="1.5" />
                          <circle cx="8" cy="8" r="1.5" />
                          <circle cx="8" cy="12" r="1.5" />
                        </svg>
                      </button>
                      
                      {openMenuId === producto.id && (
                        <div className="absolute right-0 mt-1 w-28 bg-white border shadow-lg rounded-md z-20">
                          <div 
                            className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleVerProducto(producto.id)}
                          >
                            Ver
                          </div>
                          <div 
                            className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleEliminarProducto(producto.id)}
                          >
                            Eliminar
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-4 pt-8 flex flex-col items-center">
                    <img 
                      src={producto.imagen || "https://via.placeholder.com/100"} 
                      alt={producto.nombre}
                      className="w-20 h-20 object-contain mb-2"
                    />
                    
                    <Tipografia size="sm" className="text-center mb-1 h-12 overflow-hidden">
                      {producto.nombre}
                    </Tipografia>
                    
                    <Tipografia size="base" className="font-bold text-center mb-2">
                      ${producto.precio.toLocaleString()}
                    </Tipografia>
                    
                    {/* Usando Link para navegación directa sin JavaScript */}
                    <Link
                      to={`/editar-producto/${producto.id}`}
                      className="w-full bg-purple-500 text-white py-1 px-3 rounded-md text-sm text-center no-underline block"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              ))}
              
              {/* Rellenar espacios vacíos en la última fila */}
              {filaIndex === getProductosEnFilas().length - 1 && fila.length < 4 && 
                Array(4 - fila.length).fill().map((_, index) => (
                  <div key={`empty-${index}`} className="flex-1"></div>
                ))
              }
            </div>
          ))}
        </div>
      </div>
      </div>
    );
  };
  
  export default GestionProductos;