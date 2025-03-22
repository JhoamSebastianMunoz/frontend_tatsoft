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
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className={`flex-1 transition-all duration-300 ${
        !collapsed ? "md:ml-70" : "md:ml-16"
      }`}>
        {/* Header */}
        <div className="text-black p-4 shadow-md">
          <Tipografia variant="h1" size="xl" className="text-black font-medium pl-8">
            Ingreso de Stock
          </Tipografia>
        </div>

        {/* Contenido del formulario */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              {/* Buscador de productos */}
              <div className="mb-6 flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Buscar Producto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-4 pr-10 border rounded text-sm"
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
                />
              </div>
              
              {/* Filtros */}
              <div className="mb-4">
                <Tipografia>Filtros</Tipografia>
                <div className="flex items-center mt-1">
                  <Tipografia className="mr-2">Categoría:</Tipografia>
                  <select
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    className="p-1.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
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
              <div className="mb-6">
                <Tipografia variant="h2" size="lg" className="mb-3 text-orange-500">Detalles del Producto</Tipografia>
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    <img 
                      src={productoSeleccionado.imagen || "https://via.placeholder.com/100"} 
                      alt={productoSeleccionado.nombre}
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <Tipografia variant="h3" size="base" className="font-bold">{productoSeleccionado.nombre}</Tipografia>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <Tipografia size="sm">Código: {productoSeleccionado.codigo}</Tipografia>
                      </div>
                      <div>
                        <Tipografia size="sm">Precio: <span className="text-orange-500 font-medium">${productoSeleccionado.precio}</span></Tipografia>
                      </div>
                      <div>
                        <Tipografia size="sm">Categoría: {productoSeleccionado.categoria}</Tipografia>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-end">
                    <Tipografia size="sm">Stock Actual:</Tipografia>
                    <div className="border rounded p-2 w-48 flex items-center justify-center">
                      <Tipografia size="xl" className="font-bold">{productoSeleccionado.stock}</Tipografia>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Detalle del Ingreso */}
              <div className="mb-6">
                <Tipografia variant="h2" size="lg" className="mb-3 text-orange-500">Detalle del Ingreso</Tipografia>
                <div className="grid grid-cols-3 gap-4">
                  <CampoTexto
                    label="Cantidad a ingresar:"
                    id="cantidad"
                    type="number"
                    placeholder="Ingrese la cantidad"
                    value={formData.cantidad}
                    onChange={handleInputChange}
                    required
                  />
                  <div>
                    <Tipografia size="sm" className="mb-1">Fecha de vencimiento:</Tipografia>
                    <div className="relative">
                      <input
                        type="date"
                        name="fechaVencimiento"
                        value={formData.fechaVencimiento}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded pr-8 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <CampoTexto
                    label="Código factura proveedor:"
                    id="codigoFactura"
                    type="text"
                    placeholder="Ingrese código de factura"
                    value={formData.codigoFactura}
                    onChange={handleInputChange}
                  />
                  <CampoTexto
                    label="Costo total:"
                    id="costoTotal"
                    type="number"
                    placeholder="Ingrese costo total"
                    value={formData.costoTotal}
                    onChange={handleInputChange}
                    required
                  />
                  <CampoTexto
                    label="Costo Unitario"
                    id="costoUnitario"
                    type="number"
                    placeholder="Costo unitario calculado"
                    value={formData.costoUnitario}
                    onChange={handleInputChange}
                    disabled
                  />
                  <CampoTexto
                    label="Porcentaje de venta:"
                    id="porcentajeVenta"
                    type="number"
                    placeholder="Ingrese el porcentaje"
                    value={formData.porcentajeVenta}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              {/* Botones */}
              <div className="flex justify-end space-x-4 mt-8">
                <Botones
                  label="Cancelar"
                  tipo="cancelar"
                  onClick={handleCancelar}
                />
                <Botones
                  label="Registrar"
                  tipo="primario"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Alerta de cancelar */}
      {showCancelarAlerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <Alerta
            tipo="eliminacion"
            mensaje="¿Desea cancelar el ingreso?"
            onAceptar={confirmarCancelacion}
            onCancelar={() => setShowCancelarAlerta(false)}
          />
        </div>
      )}

      {/* Alerta de registro exitoso */}
      {showRegistroExitosoAlerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <Alerta
            tipo="confirmacion"
            mensaje="Ingreso registrado"
            onAceptar={() => setShowRegistroExitosoAlerta(false)}
          />
        </div>
      )}
    </div>
  );
};

export default IngresoStock;