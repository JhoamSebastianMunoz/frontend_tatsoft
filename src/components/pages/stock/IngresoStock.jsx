import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tipografia from "../../atoms/Tipografia";
import Botones from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import Sidebar from "../../organisms/Sidebar";
import { useAuth } from "../../../context/AuthContext";
import { productService, stockService } from "../../../context/services/ApiService";
import { imageService } from "../../../context/services/ImageService";
import Loading from "../../Loading/Loading";

const IngresoStock = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ===== STATE MANAGEMENT =====
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return JSON.parse(localStorage.getItem("sidebarCollapsed") || "true");
  });

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [productImages, setProductImages] = useState({});

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductList, setShowProductList] = useState(false);

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
    type: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });

  // ===== EFFECTS =====
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Cargar productos al montar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productService.getAllProducts();
        
        // Verificar que la respuesta tenga datos válidos
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Formato de respuesta inválido");
        }

        // Cargar imágenes para los productos
        const imagePromises = response.data.map(async (producto) => {
          if (producto.id_imagen) {
            try {
              const imageUrl = await imageService.getImageUrl(producto.id_imagen);
              if (imageUrl) {
                return { id: producto.id_producto, url: imageUrl };
              }
            } catch (error) {
              console.error('Error cargando imagen para producto', producto.id_producto, error);
            }
          }
          return { id: producto.id_producto, url: null };
        });
        
        const productImagesResults = await Promise.all(imagePromises);
        const imagesMap = {};
        productImagesResults.forEach(({ id, url }) => {
          imagesMap[id] = url;
        });
        
        setProductImages(imagesMap);
        setProductos(response.data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setError("Error al cargar los productos. Por favor, intente nuevamente.");
        setAlert({
          show: true,
          type: "warning",
          message: "Error al cargar los productos. Por favor, intente nuevamente.",
          onConfirm: () => setAlert({ ...alert, show: false }),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowProductList(true);
  };

  const handleProductSelect = (producto) => {
    setProductoSeleccionado(producto);
    setSearchTerm(producto.nombre_producto);
    setShowProductList(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productoSeleccionado) {
      setAlert({
        show: true,
        type: "warning",
        message: "Debe seleccionar un producto antes de registrar el ingreso.",
        onConfirm: () => setAlert({ ...alert, show: false }),
      });
      return;
    }

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

    try {
      setLoading(true);
      const stockData = {
        productoId: productoSeleccionado.id_producto,
        cantidad: parseInt(ingreso.cantidad),
        fechaVencimiento: ingreso.fechaVencimiento || null,
        codigoFactura: ingreso.codigoFactura || "",
        costoTotal: parseFloat(ingreso.costoTotal),
        costoUnitario: parseFloat(ingreso.costoUnitario),
        porcentajeVenta: parseFloat(ingreso.porcentajeVenta) || 0
      };

      console.log('Datos a enviar al servidor:', stockData);
      const response = await stockService.createStockEntry(stockData);
      
      if (response) {
        setSuccess(true);
        setAlert({
          show: true,
          type: "success",
          message: "El ingreso se ha registrado correctamente.",
          onConfirm: () => {
            setAlert({ ...alert, show: false });
            navigate("/inventario");
          },
        });
      }
    } catch (error) {
      console.error("Error al registrar el ingreso:", error);
      let mensajeError = "";
      
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
        switch (error.response.status) {
          case 401:
            mensajeError = "Su sesión ha expirado. Por favor, inicie sesión nuevamente.";
            break;
          case 403:
            mensajeError = "No tiene permisos para realizar esta acción.";
            break;
          case 422:
            const validationError = error.response.data.errors?.[0];
            mensajeError = validationError ? 
              `Error de validación: ${validationError.msg}` : 
              "Error de validación en los datos enviados.";
            break;
          case 500:
            mensajeError = error.response.data.message || "Error interno del servidor. Por favor, intente más tarde.";
            break;
          default:
            mensajeError = error.response.data?.message || 
                          "Error al procesar la solicitud. Por favor, intente nuevamente.";
        }
      } else if (error.message?.includes('Network Error')) {
        mensajeError = "Error de conexión con el servidor. Verifique su conexión a internet.";
      } else {
        mensajeError = "Error inesperado. Por favor, intente nuevamente más tarde.";
      }
      
      setError(mensajeError);
      setAlert({
        show: true,
        type: "warning",
        message: mensajeError,
        onConfirm: () => setAlert({ ...alert, show: false }),
      });
    } finally {
      setLoading(false);
    }
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

  const filteredProductos = productos.filter(producto => {
    if (!producto || !searchTerm) return false;
    
    const nombre = producto.nombre_producto || "";
    const codigo = producto.codigo || "";
    
    return nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           codigo.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading && !productoSeleccionado) {
    return <Loading message="Cargando productos..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Icono name="alert-triangle" size={40} className="text-red-500 mx-auto mb-4" />
          <Tipografia size="base" className="text-gray-600">
            {error}
          </Tipografia>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 transition-all duration-300 pl-2">
        <div className="pl-4 ml-10 md:ml-[8rem] max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mx-1 pt-4">
            <div className="w-auto">
              <Tipografia className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                Ingreso de stock
              </Tipografia>
            </div>
            <div className="w-full sm:w-auto md">
              <Botones
                label="Ver Historial"
                tipo="primario"
                type="submit"
                onClick={() => navigate("/inventario")}
                className="w-full sm:w-auto bg-[#F78220] hover:bg-[#F78220]/90 text-white px-4 py-2 rounded-lg"
                icon="arrow-left"
              />
            </div>
          </div>

          {/* Filtro de Productos */}
          <div className="bg-white rounded-lg shadow-md p-5 my-6">
            <Tipografia variant="h2" size="lg" className="mb-4 text-orange-500 pb-2 border-b border-gray-100">
              Seleccionar Producto
            </Tipografia>
            
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowProductList(true)}
                placeholder="Buscar producto por nombre o código..."
                className="w-full pl-3 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
              />
              
              {showProductList && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredProductos.length > 0 ? (
                    filteredProductos.map((producto) => (
                      <div
                        key={producto.id_producto}
                        onClick={() => handleProductSelect(producto)}
                        className="p-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <Tipografia size="base" className="font-medium">
                              {producto.nombre_producto}
                            </Tipografia>
                            <Tipografia size="sm" className="text-gray-600">
                              Código: {producto.codigo}
                            </Tipografia>
                          </div>
                          <div className="text-right">
                            <Tipografia size="base" className="font-medium text-orange-600">
                              ${producto.precio.toLocaleString()}
                            </Tipografia>
                            <Tipografia size="sm" className="text-gray-600">
                              Stock: {producto.cantidad_ingreso || 0}
                            </Tipografia>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500 text-center">
                      No se encontraron productos
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
            {/* Columna de Producto */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-5 h-full">
                <Tipografia variant="h2" size="lg" className="mb-4 text-orange-500 pb-2 border-b border-gray-100">
                  Detalles del Producto
                </Tipografia>
                
                {productoSeleccionado ? (
                  <>
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden mb-3">
                        {productImages[productoSeleccionado.id_producto] ? (
                          <img
                            src={productImages[productoSeleccionado.id_producto]}
                            alt={productoSeleccionado.nombre_producto}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <Icono name="gest-productos" size={48} />
                          </div>
                        )}
                      </div>
                      
                      <Tipografia variant="h3" size="lg" className="font-bold text-center">
                        {productoSeleccionado.nombre_producto}
                      </Tipografia>
                      
                      <div className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
                        {productoSeleccionado.categoria}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-5">
                      <div>
                        <Tipografia size="xs" className="uppercase text-gray-600 font-medium tracking-wide">
                          Código:  
                        </Tipografia>
                        <Tipografia size="base" className="font-semibold text-orange-600">
                          {productoSeleccionado.codigo}
                        </Tipografia>
                      </div>
                      
                      <div>
                        <Tipografia size="xs" className="uppercase text-gray-600 font-medium tracking-wide">
                          Precio actual
                        </Tipografia>
                        <Tipografia size="base" className="font-semibold text-orange-600">
                          ${productoSeleccionado.precio.toLocaleString()}
                        </Tipografia>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-slate-100 rounded-lg">
                      <div className="flex justify-between items-center">
                        <Tipografia size="sm" className="text-slate-600 font-medium">
                          Stock Actual
                        </Tipografia>
                        <div className="text-2xl font-bold text-slate-700">
                          {productoSeleccionado.cantidad_ingreso || 0}
                        </div>
                      </div>
                      
                      {ingreso.cantidad && (
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-100">
                          <Tipografia size="sm" className="text-blue-800 font-medium">
                            Stock Actualizado
                          </Tipografia>
                          <div className="text-2xl font-bold text-green-600">
                            {(productoSeleccionado.cantidad_ingreso || 0) + parseInt(ingreso.cantidad)}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Icono name="search" size={40} className="mx-auto mb-4" />
                    <Tipografia size="base">
                      Seleccione un producto para ver sus detalles
                    </Tipografia>
                  </div>
                )}
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
                          disabled={!productoSeleccionado || loading}
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
                          disabled={!productoSeleccionado || loading}
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
                          disabled={!productoSeleccionado || loading}
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
                          disabled={!productoSeleccionado || loading}
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
                            disabled={!productoSeleccionado || loading}
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
                      disabled={loading}
                    />
                    <Botones
                      label="Registrar Ingreso"
                      tipo="primario"
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={!productoSeleccionado || loading}
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