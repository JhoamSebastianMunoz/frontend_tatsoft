import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Tipografia from "../../atoms/Tipografia";
import UsuarioAvatar from "../../atoms/AvatarUsuario";
import Icono from "../../atoms/Iconos";
import Boton from "../../atoms/Botones";

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
    descripcion: ""
  });
  
  const [showNavegacion, setShowNavegacion] = useState(true);
  const [showCategorias, setShowCategorias] = useState(false);
  const [showNuevaCategoriaModal, setShowNuevaCategoriaModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  
  // Estado para controlar qué menús están abiertos
  const [menuOpen, setMenuOpen] = useState({
    notificaciones: false,
    gestionUsuarios: false,
    gestionClientes: false,
    gestionProductos: true, // Este comienza abierto
    gestionZonas: false,
    gestionAcumulados: false,
    catalogo: false,
    inventario: false
  });

  // Simular la carga de datos del producto basado en el ID
  useEffect(() => {
    // En una aplicación real, aquí harías una petición API para obtener los datos del producto
    // Datos de ejemplo para mostrar cómo funcionaría
    const mockProductData = {
      nombre: "Leche Colanta Uht Deslactosada 1000 ML",
      categoria: "Lácteos",
      precio: "5200",
      stock: "100",
      descripcion: "Leche deslactosada de alta calidad, ideal para personas con intolerancia a la lactosa."
    };
    
    setFormData(mockProductData);
  }, [id]);

  const toggleNavegacion = () => {
    setShowNavegacion(!showNavegacion);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Actualizando producto:", formData);
    // Aquí iría la lógica para actualizar el producto
    // Después de actualizar, redirigir a la lista de productos
    navigate("/gestion-productos");
  };

  const handleCancelar = () => {
    navigate("/gestion-productos");
  };

  const handleCambiarImagen = () => {
    console.log("Cambiar imagen del producto");
    // Aquí iría la lógica para cambiar la imagen
  };

  const toggleMenu = (menuName) => {
    setMenuOpen({
      ...menuOpen,
      [menuName]: !menuOpen[menuName]
    });
  };

  const toggleCategorias = () => {
    setShowCategorias(!showCategorias);
  };

  const agregarNuevaCategoria = () => {
    if (nuevaCategoria.trim() !== "") {
      categorias.push(nuevaCategoria);
      setFormData({...formData, categoria: nuevaCategoria});
      setNuevaCategoria("");
      setShowNuevaCategoriaModal(false);
      setShowCategorias(false);
    }
  };

  // Categorías disponibles según el mockup
  const categorias = [
    "Lácteos",
    "Aseo",
    "Hogar y Decoración",
    "Productos Mascotas",
    "Granos y Cereales",
    "Panadería y Repostería",
    "Frutas y Verduras",
    "Carnes Frescas y Embutidos",
    "Congelados",
    "Bebidas",
    "Otros"
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navegación lateral */}
      {showNavegacion && (
        <div className="w-44 bg-white shadow-md h-screen flex flex-col">
          {/* Header con avatar */}
          <div className="bg-purple-600 p-3 flex items-center">
            <UsuarioAvatar size={35} />
            <Tipografia className="ml-2 text-white">Gisela rivera</Tipografia>
          </div>

          {/* Opciones de menú */}
          <div className="flex flex-col">
            <MenuItem 
              label="Notificaciones" 
              iconName="notificaciones" 
              isOpen={menuOpen.notificaciones}
              onClick={() => toggleMenu('notificaciones')}
            />
            <MenuItem 
              label="Gestión usuarios" 
              iconName="gest-usuarios" 
              isOpen={menuOpen.gestionUsuarios}
              onClick={() => toggleMenu('gestionUsuarios')}
            />
            <MenuItem 
              label="Gestión clientes" 
              iconName="gest-clientes" 
              isOpen={menuOpen.gestionClientes}
              onClick={() => toggleMenu('gestionClientes')}
            />
            <MenuItem 
              label="Gestión productos" 
              iconName="gest-productos" 
              isOpen={menuOpen.gestionProductos}
              onClick={() => toggleMenu('gestionProductos')}
            />
            <MenuItem 
              label="Gestión zonas" 
              iconName="gest-zonas" 
              isOpen={menuOpen.gestionZonas}
              onClick={() => toggleMenu('gestionZonas')}
            />
            <MenuItem 
              label="Gestión acumulados" 
              iconName="gest-acumulados" 
              isOpen={menuOpen.gestionAcumulados}
              onClick={() => toggleMenu('gestionAcumulados')}
            />
            <MenuItem 
              label="Catálogo" 
              iconName="catalogo" 
              isOpen={menuOpen.catalogo}
              onClick={() => toggleMenu('catalogo')}
            />
            <MenuItem 
              label="Inventario" 
              iconName="inventario" 
              isOpen={menuOpen.inventario}
              onClick={() => toggleMenu('inventario')}
            />
          </div>

          {/* Botón cerrar sesión */}
          <div className="mt-auto">
            <button 
              className="w-full flex items-center p-3 bg-purple-600 text-white"
            >
              <Icono name="cerrar-sesion" />
              <span className="ml-2">Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
          <button 
            onClick={toggleNavegacion} 
            className="text-white flex items-center justify-center h-10 w-10"
          >
            <span className="text-xl">☰</span>
          </button>
          <Tipografia variant="h1" size="xl" className="text-white font-medium">
            Editar Producto
          </Tipografia>
          <div className="w-10"></div> {/* Espacio para equilibrar el header */}
        </div>

        {/* Formulario */}
        <div className="flex-1 p-6 flex justify-center">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <div className="relative">
                  <div 
                    className="w-full p-2 border rounded flex justify-between items-center cursor-pointer"
                    onClick={toggleCategorias}
                  >
                    <span className="text-gray-700">{formData.categoria || "Seleccione una categoría"}</span>
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  {showCategorias && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {categorias.map((categoria, index) => (
                        <div 
                          key={index} 
                          className="p-2 hover:bg-purple-100 cursor-pointer"
                          onClick={() => {
                            setFormData({...formData, categoria});
                            setShowCategorias(false);
                          }}
                        >
                          {categoria}
                        </div>
                      ))}
                      <div 
                        className="p-2 bg-purple-200 text-center hover:bg-purple-300 cursor-pointer"
                        onClick={() => {
                          setShowNuevaCategoriaModal(true);
                          setShowCategorias(false);
                        }}
                      >
                        + Agregar otra categoría
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex mb-4 space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">Precio</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 h-20"
                ></textarea>
              </div>

              <div className="flex justify-center mt-6 mb-2">
                <button
                  type="button"
                  className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md"
                  onClick={handleCambiarImagen}
                >
                  <Icono name="subir-archivo" customColor="white" size={20} />
                  <span className="ml-2">Cambiar imagen</span>
                </button>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="px-8 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  className="px-8 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal para agregar nueva categoría */}
      {showNuevaCategoriaModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Agregar nueva categoría</h3>
            <input
              type="text"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nombre de la categoría"
            />
            <div className="flex justify-end space-x-2">
              <Boton 
                label="Cancelar" 
                tipo="cancelar" 
                onClick={() => setShowNuevaCategoriaModal(false)} 
              />
              <Boton 
                label="Agregar" 
                tipo="primario" 
                onClick={agregarNuevaCategoria} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para los ítems del menú lateral
const MenuItem = ({ label, iconName, isOpen, onClick }) => {
  return (
    <button 
      className="flex items-center justify-between p-3 w-full hover:bg-purple-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center">
        <Icono name={iconName} size={20} />
        <span className="ml-2 text-sm">{label}</span>
      </div>
      <svg 
        className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  );
};

export default EditarProducto;