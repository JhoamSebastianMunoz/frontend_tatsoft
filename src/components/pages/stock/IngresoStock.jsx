import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import Sidebar from "../../organisms/Sidebar";
import { useAuth } from "../../../context/AuthContext";

const IngresoStock = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ===== STATE MANAGEMENT =====
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return JSON.parse(localStorage.getItem("sidebarCollapsed") || "true");
  });

  const [producto] = useState({
    nombre: "Leche colanta",
    codigo: "1",
    precio: 3600,
    categoria: "Lácteos",
    stock: 50,
    imagen: "/path/to/leche-colanta.png",
  });

  const [ingreso, setIngreso] = useState({
    cantidad: "",
    fechaVencimiento: "",
    codigoFactura: "",
    costoTotal: "",
    costoUnitario: "",
    porcentajeVenta: "",
    precioVenta: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    type: "", // "success" o "warning"
    message: "",
    onConfirm: null,
    onCancel: null,
  });

  // ===== EFFECTS =====
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Calcular costo unitario automáticamente
  useEffect(() => {
    if (ingreso.cantidad && ingreso.costoTotal) {
      const costoUnitario = parseFloat(ingreso.costoTotal) / parseFloat(ingreso.cantidad);
      setIngreso(prev => ({
        ...prev,
        costoUnitario: costoUnitario.toFixed(2),
      }));
    }
  }, [ingreso.cantidad, ingreso.costoTotal]);

  // Calcular precio de venta basado en porcentaje
  useEffect(() => {
    if (ingreso.costoUnitario && ingreso.porcentajeVenta) {
      const costoUnitario = parseFloat(ingreso.costoUnitario);
      const porcentaje = parseFloat(ingreso.porcentajeVenta) / 100;
      const precioVenta = costoUnitario * (1 + porcentaje);
      
      setIngreso(prev => ({
        ...prev,
        precioVenta: precioVenta.toFixed(2),
      }));
    }
  }, [ingreso.costoUnitario, ingreso.porcentajeVenta]);

  // ===== EVENT HANDLERS =====
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIngreso(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelar = () => {
    setAlert({
      show: true,
      type: "warning",
      message: "¿Desea cancelar el ingreso? Esta acción no se puede deshacer.",
      onConfirm: () => {
        navigate("/inventario");
      },
      onCancel: () => setAlert({ ...alert, show: false }),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación simple
    if (!ingreso.cantidad || !ingreso.costoTotal) {
      setAlert({
        show: true,
        type: "warning",
        message: "Debe completar todos los campos obligatorios.",
        onConfirm: () => setAlert({ ...alert, show: false }),
      });
      return;
    }

    console.log("Datos del ingreso:", {
      producto,
      ingreso,
    });

    // Mostrar mensaje de éxito
    setAlert({
      show: true,
      type: "success",
      message: "El ingreso se ha registrado correctamente.",
      onConfirm: () => {
        setAlert({ ...alert, show: false });
        navigate("/inventario");
      },
    });
  };

  // ===== RENDER FUNCTIONS =====
  const renderAlert = () => {
    if (!alert.show) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 transform transition-all animate-fade-in-up">
          <div className="flex flex-col items-center text-center">
            {alert.type === "success" ? (
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Icono name="check" size={30} className="text-green-500" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Icono name="alert-triangle" size={30} className="text-amber-500" />
              </div>
            )}
            
            <Tipografia variant="h3" size="lg" className="mb-2">
              {alert.type === "success" ? "¡Operación exitosa!" : "Atención"}
            </Tipografia>
            
            <Tipografia size="base" className="text-gray-600 mb-6">
              {alert.message}
            </Tipografia>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {alert.onCancel && (
                <Botones
                  label="Cancelar"
                  tipo="secundario"
                  onClick={alert.onCancel}
                  className="flex-1"
                />
              )}
              <Botones
                label="Aceptar"
                tipo="primario"
                onClick={alert.onConfirm}
                className={`flex-1 ${alert.type === "warning" && !alert.onCancel ? "bg-amber-500 hover:bg-amber-600" : ""}`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className={`flex-1 transition-all duration-300 ${
        !sidebarCollapsed ? "md:ml-20" : "md:ml-16"
      }`}>
        <div className="p-4 md:p-3 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
          <div className="mt-2 mb-1">
            <Tipografia className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">Ingreso de stock</Tipografia>
          </div>
            <Botones
              label="Volver al Inventario"
              tipo="terciario"
              onClick={() => navigate("/inventario")}
              className="flex items-center"
              icon="arrow-left"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna de Producto */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-5 h-full">
                <Tipografia variant="h2" size="lg" className="mb-4 text-orange-500 pb-2 border-b border-gray-100">
                  Detalles del Producto
                </Tipografia>
                
                <div className="flex flex-col items-center mb-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={producto.imagen || "https://via.placeholder.com/150"}
                      alt={producto.nombre}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  
                  <Tipografia variant="h3" size="lg" className="font-bold text-center">
                    {producto.nombre}
                  </Tipografia>
                  
                  <div className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
                    {producto.categoria}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-5">
                  <div>
                    <Tipografia size="xs" className="uppercase text-gray-600 font-medium tracking-wide">
                      Código:  
                    </Tipografia>
                    <Tipografia size="base" className="font-semibold text-orange-600">
                      {producto.codigo}
                    </Tipografia>
                  </div>
                  
                  <div>
                    <Tipografia size="xs" className="uppercase text-gray-600 font-medium tracking-wide">
                      Precio actual
                    </Tipografia>
                    <Tipografia size="base" className="font-semibold text-orange-600">
                      ${producto.precio.toLocaleString()}
                    </Tipografia>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-slate-100 rounded-lg">
                  <div className="flex justify-between items-center">
                    <Tipografia size="sm" className="text-slate-600 font-medium">
                      Stock Actual
                    </Tipografia>
                    <div className="text-2xl font-bold text-slate-700">
                      {producto.stock}
                    </div>
                  </div>
                  
                  {ingreso.cantidad && (
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-100">
                      <Tipografia size="sm" className="text-blue-800 font-medium">
                        Stock Actualizado
                      </Tipografia>
                      <div className="text-2xl font-bold text-green-600">
                        {producto.stock + parseInt(ingreso.cantidad)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Columna de Formulario */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-5">
                <Tipografia variant="h2" size="lg" className="mb-4 text-orange-500 pb-2 border-b border-gray-100">
                  Detalle del Ingreso
                </Tipografia>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Tipografia size="sm" className="text-gray-800 mb-1">
                        Cantidad a ingresar <span className="text-red-500">*</span>
                      </Tipografia>
                      <div className="relative">
                        <input
                          type="number"
                          name="cantidad"
                          value={ingreso.cantidad}
                          onChange={handleInputChange}
                          className="w-full pl-3 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                          placeholder="Cantidad"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Tipografia size="sm" className="text-gray-800 mb-1">
                        Fecha de vencimiento
                      </Tipografia>
                      <div className="relative">
                        <input
                          type="date"
                          name="fechaVencimiento"
                          value={ingreso.fechaVencimiento}
                          onChange={handleInputChange}
                          className="w-full pl-3 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Tipografia size="sm" className="text-gray-800 mb-1">
                        Código factura proveedor
                      </Tipografia>
                      <div className="relative">
                        <input
                          type="text"
                          name="codigoFactura"
                          value={ingreso.codigoFactura}
                          onChange={handleInputChange}
                          className="w-full pl-3 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                          placeholder="Código factura"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Tipografia size="sm" className="text-gray-800 mb-1">
                        Costo total <span className="text-red-500">*</span>
                      </Tipografia>
                      <div className="relative">
                        <input
                          type="number"
                          name="costoTotal"
                          value={ingreso.costoTotal}
                          onChange={handleInputChange}
                          className="w-full pl-3 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                          placeholder="Costo total"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <Tipografia variant="h3" size="base" className="font-semibold mb-3">
                      Cálculos Automáticos
                    </Tipografia>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Tipografia size="sm" className="text-gray-800 mb-1">
                          Costo Unitario
                        </Tipografia>
                        <div className="bg-white p-3 border rounded-lg text-sm flex items-center">
                          <span className="font-medium">
                            ${ingreso.costoUnitario || "0.00"}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <Tipografia size="sm" className="text-gray-800 mb-1">
                          % de Venta
                        </Tipografia>
                        <div className="relative">
                          <input
                            type="number"
                            name="porcentajeVenta"
                            value={ingreso.porcentajeVenta}
                            onChange={handleInputChange}
                            className="w-full pl-3 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                            placeholder="% de ganancia"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Tipografia size="sm" className="text-gray-800 mb-1">
                          Precio de Venta Sugerido
                        </Tipografia>
                        <div className="bg-white p-3 border rounded-lg text-sm flex items-center">
                          <span className="font-medium text-orange-500">
                            ${ingreso.precioVenta || "0.00"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-100 p-4 rounded-lg mb-6">
                    <div className="flex">
                      <Tipografia size="sm" className="text-slate-800">
                        Los campos marcados con <span className="text-orange-500"> * </span> son obligatorios.
                        El costo unitario se calcula automáticamente dividiendo el costo total entre la cantidad ingresada.
                      </Tipografia>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                    <Botones
                      label="Cancelar"
                      tipo="secundario"
                      onClick={handleCancelar}
                      className="w-full sm:w-auto"
                    />
                    <Botones
                      label="Registrar Ingreso"
                      tipo="primario"
                      type="submit"
                      className="w-full sm:w-auto"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderAlert()}
    </div>
  );
};

export default IngresoStock;