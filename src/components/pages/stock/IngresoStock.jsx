import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import CampoTexto from "../../atoms/CamposTexto";
import Buscador from "../../molecules/Buscador";
import Alerta from "../../molecules/Alertas";
import Sidebar from "../../organisms/Sidebar";
import { useAuth } from "../../../context/AuthContext";

const IngresoStock = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estado para el control de la barra de navegación
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : true;
  });

  // Guardar estado del sidebar en localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);
  
  // Estados para el producto seleccionado
  const [productoSeleccionado, setProductoSeleccionado] = useState({
    nombre: "Leche colanta",
    codigo: "1",
    precio: 3600,
    categoria: "Lácteos",
    stock: 50,
    imagen: "/path/to/leche-colanta.png"
  });
  
  // Estados para la búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Lácteos");
  
  // Estados para el formulario de ingreso
  const [formData, setFormData] = useState({
    cantidad: "",
    fechaVencimiento: "",
    codigoFactura: "",
    costoTotal: "",
    costoUnitario: "",
    porcentajeVenta: ""
  });
  
  // Estados para alertas
  const [showRegistroExitosoAlerta, setShowRegistroExitosoAlerta] = useState(false);
  const [showCancelarAlerta, setShowCancelarAlerta] = useState(false);
  
  // Lista de categorías
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
  
  // Efecto para calcular costo unitario cuando cambia la cantidad o costo total
  useEffect(() => {
    if (formData.cantidad && formData.costoTotal) {
      const costoUnitario = parseFloat(formData.costoTotal) / parseFloat(formData.cantidad);
      setFormData({
        ...formData,
        costoUnitario: costoUnitario.toFixed(2)
      });
    }
  }, [formData.cantidad, formData.costoTotal]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSearch = () => {
    console.log("Buscando producto:", searchTerm);
    // Aquí iría la lógica para buscar productos
  };
  
  const handleCancelar = () => {
    setShowCancelarAlerta(true);
  };
  
  const confirmarCancelacion = () => {
    setShowCancelarAlerta(false);
    navigate("/inventario"); // Redirigir al inventario
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del ingreso:", {
      producto: productoSeleccionado,
      ingreso: formData
    });
    
    // Mostrar alerta de registro exitoso
    setShowRegistroExitosoAlerta(true);
    
    // Automáticamente ocultar después de 3 segundos
    setTimeout(() => {
      setShowRegistroExitosoAlerta(false);
      navigate("/inventario"); // Redirigir al inventario
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Tipografia>
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${
        !collapsed ? "md:ml-70" : "md:ml-16"
      }`}>
        <div className="p-2 sm:p-3 md:p-4 lg:p-6">
          <div className="text-black mb-3 sm:mb-4 md:mb-6">
            <Tipografia 
              variant="h1" 
              size="xl sm:text-2xl md:text-3xl" 
              className="text-black font-medium"
            >
              Ingreso Stock
            </Tipografia>
          </div>

          {/* Contenido del formulario */}
          <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 md:p-4 lg:p-6">
            <form onSubmit={handleSubmit}>
              {/* Buscador de productos */}
              <div className="mb-3 sm:mb-4 md:mb-6 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Buscar Producto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-4 pr-10 border rounded text-sm sm:text-base"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Icono name="buscar" size={18} />
                  </div>
                </div>
                <Botones
                  label="Buscar"
                  tipo="primario"
                  size="small"
                  onClick={handleSearch}
                  className="w-full sm:w-auto"
                />
              </div>
              
              {/* Filtros */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <Tipografia variant="h2" size="lg" className="mb-2 sm:mb-3">Filtros</Tipografia>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <Tipografia size="base" className="whitespace-nowrap">Categoría:</Tipografia>
                  <select
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    className="w-full sm:w-auto p-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                  >
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Detalles del producto */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <Tipografia variant="h2" size="lg" className="mb-2 sm:mb-3 text-orange-500">Detalles del Producto</Tipografia>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="w-full sm:w-32 h-32 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    <img 
                      src={productoSeleccionado.imagen || "https://via.placeholder.com/100"} 
                      alt={productoSeleccionado.nombre}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <Tipografia variant="h3" size="base" className="font-bold mb-2 sm:mb-3">{productoSeleccionado.nombre}</Tipografia>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <Tipografia size="sm" className="text-gray-600">Código:</Tipografia>
                        <Tipografia size="base" className="font-medium">{productoSeleccionado.codigo}</Tipografia>
                      </div>
                      <div>
                        <Tipografia size="sm" className="text-gray-600">Precio:</Tipografia>
                        <Tipografia size="base" className="font-medium text-orange-500">${productoSeleccionado.precio}</Tipografia>
                      </div>
                      <div>
                        <Tipografia size="sm" className="text-gray-600">Categoría:</Tipografia>
                        <Tipografia size="base" className="font-medium">{productoSeleccionado.categoria}</Tipografia>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-start sm:items-end w-full sm:w-auto">
                    <Tipografia size="sm" className="text-gray-600 mb-1">Stock Actual:</Tipografia>
                    <div className="border rounded p-1 sm:p-3 w-full sm:w-48 flex items-center justify-center bg-slate-50">
                      <Tipografia size="xl" className="font-bold text-balck">{productoSeleccionado.stock}</Tipografia>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Detalle del Ingreso */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <Tipografia variant="h2" size="lg" className="mb-2 sm:mb-3 text-orange-500">Detalle del Ingreso</Tipografia>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  <div>
                    <Tipografia size="sm" className="text-gray-600 mb-1">Cantidad a ingresar:</Tipografia>
                    <input
                      type="number"
                      name="cantidad"
                      value={formData.cantidad}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                      placeholder="Ingrese la cantidad"
                      required
                    />
                  </div>
                  <div>
                    <Tipografia size="sm" className="text-gray-600 mb-1">Fecha de vencimiento:</Tipografia>
                    <input
                      type="date"
                      name="fechaVencimiento"
                      value={formData.fechaVencimiento}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <Tipografia size="sm" className="text-gray-600 mb-1">Código factura proveedor:</Tipografia>
                    <input
                      type="text"
                      name="codigoFactura"
                      value={formData.codigoFactura}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                      placeholder="Ingrese código de factura"
                    />
                  </div>
                  <div>
                    <Tipografia size="sm" className="text-gray-600 mb-1">Costo total:</Tipografia>
                    <input
                      type="number"
                      name="costoTotal"
                      value={formData.costoTotal}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                      placeholder="Ingrese costo total"
                      required
                    />
                  </div>
                  <div>
                    <Tipografia size="sm" className="text-gray-600 mb-1">Costo Unitario:</Tipografia>
                    <input
                      type="number"
                      name="costoUnitario"
                      value={formData.costoUnitario}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded bg-gray-50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                      placeholder="Costo unitario calculado"
                      disabled
                    />
                  </div>
                  <div>
                    <Tipografia size="sm" className="text-gray-600 mb-1">Porcentaje de venta:</Tipografia>
                    <input
                      type="number"
                      name="porcentajeVenta"
                      value={formData.porcentajeVenta}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                      placeholder="Ingrese el porcentaje"
                    />
                  </div>
                </div>
              </div>
              
              {/* Botones */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8">
                <Botones
                  label="Cancelar"
                  tipo="secundario"
                  onClick={handleCancelar}
                  className="w-full sm:w-auto"
                />
                <Botones
                  label="Registrar"
                  tipo="primario"
                  type="submit"
                  className="w-full sm:w-auto"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Alerta de cancelar */}
      {showCancelarAlerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-sm w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-4">
                <Icono name="eliminarAlert" size={70} className="text-red-500" />
              </div>
              <Tipografia variant="h3" size="lg" className="mb-2">¿Desea cancelar el ingreso?</Tipografia>
              <Tipografia size="base" className="text-gray-600 mb-6">
                Esta acción no se puede deshacer
              </Tipografia>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                <Botones
                  label="Cancelar"
                  tipo="secundario"
                  onClick={() => setShowCancelarAlerta(false)}
                  
                />
                <Botones
                  label="Aceptar"
                  tipo="primario"
                  onClick={confirmarCancelacion}
                  
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de registro exitoso */}
      {showRegistroExitosoAlerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-sm w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Icono name="check" size={24} className="text-green-500" />
              </div>
              <Tipografia variant="h1" size="xl" className="mb-2">Ingreso registrado</Tipografia>
              <Tipografia size="base" className="text-gray-600 mb-6">
                El ingreso se ha registrado correctamente
              </Tipografia>
              <div className="flex justify-center w-full">
                <Botones
                  label="Aceptar"
                  tipo="primario"
                  onClick={() => setShowRegistroExitosoAlerta(false)}
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      </Tipografia>
    </div>
  );
};

export default IngresoStock;