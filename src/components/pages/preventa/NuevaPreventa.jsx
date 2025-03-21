import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { presaleService, productService, clientService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Encabezado from "../../molecules/Encabezado";
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import CampoTexto from "../../atoms/CamposTexto";
import Icono from "../../atoms/Iconos";
import SidebarAdm from "../../organisms/SidebarAdm";
import Loading from "../../Loading/Loading";

const NuevaPreventa = () => {
  const navigate = useNavigate();
  const { id: clientId } = useParams();
  const { user } = useAuth();

  // Estados
  const [loading, setLoading] = useState(false);
  const [clienteInfo, setClienteInfo] = useState(null);
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [zonas, setZonas] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [clientes, setClientes] = useState([]);
  const [isModalClienteOpen, setIsModalClienteOpen] = useState(false);

  // Cargar información del cliente si se proporciona el ID
  useEffect(() => {
    const fetchClienteInfo = async () => {
      if (!clientId) return;
     
      try {
        setLoading(true);
        const response = await clientService.getClientById(clientId);
        setClienteInfo(response.data);
      } catch (err) {
        console.error("Error al cargar datos del cliente:", err);
        setError("No se pudo cargar la información del cliente.");
      } finally {
        setLoading(false);
      }
    };

    fetchClienteInfo();
  }, [clientId]);

  // Cargar productos disponibles
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts();
        setProductos(response.data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos disponibles.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Cargar zonas (solo para usuarios administradores)
  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const response = await areaService.getAllAreas();
        setZonas(response.data);
      } catch (err) {
        console.error("Error al cargar zonas:", err);
      }
    };

    if (user && user.rol === "ADMINISTRADOR") {
      fetchZonas();
    } else if (user && user.rol === "COLABORADOR") {
      // Para colaboradores, cargar sus zonas asignadas
      const fetchZonasColaborador = async () => {
        try {
          const response = await userService.getUserOwnZonas();
          if (response.data && response.data.zonas) {
            setZonas(response.data.zonas);
            if (response.data.zonas.length > 0) {
              setZonaSeleccionada(response.data.zonas[0].id_zona_de_trabajo);
            }
          }
        } catch (err) {
          console.error("Error al cargar zonas del colaborador:", err);
        }
      };
      
      fetchZonasColaborador();
    }
  }, [user]);

  // Cargar clientes cuando cambia la zona seleccionada
  useEffect(() => {
    const fetchClientes = async () => {
      if (!zonaSeleccionada) return;
      
      try {
        setLoading(true);
        const response = await userService.getClientesZona(zonaSeleccionada);
        if (response.data && response.data.clientes) {
          setClientes(response.data.clientes);
        }
      } catch (err) {
        console.error("Error al cargar clientes de la zona:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [zonaSeleccionada]);

  // Filtrar clientes según búsqueda
  useEffect(() => {
    if (clientes.length > 0 && busquedaCliente.trim() !== "") {
      const filtrados = clientes.filter(cliente => 
        cliente.nombre_completo_cliente.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
        (cliente.razon_social && cliente.razon_social.toLowerCase().includes(busquedaCliente.toLowerCase()))
      );
      setClientesFiltrados(filtrados);
    } else {
      setClientesFiltrados(clientes);
    }
  }, [clientes, busquedaCliente]);

  // Filtrar productos según la búsqueda
  const productosFiltrados = busquedaProducto.trim() === ""
    ? productos
    : productos.filter(p => 
        p.nombre_producto?.toLowerCase().includes(busquedaProducto.toLowerCase())
      );

  // Añadir producto a la lista de seleccionados
  const handleAddProduct = (producto) => {
    // Verificar si hay stock disponible
    if (producto.cantidad_ingreso <= 0) {
      setError(`No hay stock disponible para ${producto.nombre_producto}`);
      return;
    }
    
    const productoExistente = productosSeleccionados.find(
      (p) => p.id_producto === producto.id_producto
    );

    if (productoExistente) {
      // Verificar que no exceda el stock disponible
      if (productoExistente.cantidad + 1 > producto.cantidad_ingreso) {
        setError(`No hay suficiente stock de ${producto.nombre_producto}`);
        return;
      }
      
      // Si ya existe, solo actualizar la cantidad
      setProductosSeleccionados(
        productosSeleccionados.map((p) =>
          p.id_producto === producto.id_producto
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        )
      );
    } else {
      // Si no existe, añadirlo con cantidad 1
      setProductosSeleccionados([
        ...productosSeleccionados,
        { ...producto, cantidad: 1 }
      ]);
    }
    
    // Limpiar errores previos
    setError("");
  };

  // Actualizar cantidad de producto
  const handleUpdateCantidad = (id, operacion) => {
    const producto = productos.find(p => p.id_producto === id);
    
    setProductosSeleccionados(
      productosSeleccionados.map((p) => {
        if (p.id_producto === id) {
          let nuevaCantidad = operacion === "aumentar" ? p.cantidad + 1 : p.cantidad - 1;
          
          // Verificar límites: no menor a 1 y no mayor al stock disponible
          if (nuevaCantidad < 1) {
            nuevaCantidad = 1;
          } else if (operacion === "aumentar" && producto && nuevaCantidad > producto.cantidad_ingreso) {
            setError(`No hay suficiente stock de ${p.nombre_producto}`);
            nuevaCantidad = p.cantidad;
          }
          
          return { ...p, cantidad: nuevaCantidad };
        }
        return p;
      })
    );
  };

  // Eliminar producto de la lista de seleccionados
  const handleRemoveProduct = (id) => {
    setProductosSeleccionados(
      productosSeleccionados.filter((p) => p.id_producto !== id)
    );
  };

  // Calcular totales
  const calcularSubtotal = () => {
    return productosSeleccionados.reduce(
      (total, p) => total + p.precio * p.cantidad,
      0
    );
  };

  // Seleccionar cliente
  const handleSeleccionarCliente = (cliente) => {
    setClienteInfo(cliente);
    setIsModalClienteOpen(false);
  };

  // Enviar preventa al servidor
  const handleSubmitPreventa = async () => {
    if (!clienteInfo) {
      setError("Debe seleccionar un cliente para realizar la preventa.");
      return;
    }

    if (productosSeleccionados.length === 0) {
      setError("Debe seleccionar al menos un producto para la preventa.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const preventaData = {
        id_cliente: clienteInfo.id_cliente,
        detalles: productosSeleccionados.map(p => ({
          id_producto: p.id_producto,
          cantidad: p.cantidad
        }))
      };

      const response = await presaleService.createPresale(preventaData);
     
      setSuccess(true);
      setTimeout(() => {
        navigate("/preventa/historial");
      }, 2000);
    } catch (err) {
      console.error("Error al crear preventa:", err);
      setError("Ocurrió un error al registrar la preventa. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Modal para seleccionar cliente
  const ClientesModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-hidden flex flex-col">
          <div className="p-4 border-b flex justify-between items-center bg-purple-700 text-white">
            <h2 className="text-xl font-semibold">Seleccionar Cliente</h2>
            <button 
              onClick={() => setIsModalClienteOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 border-b">
            <CampoTexto
              placeholder="Buscar cliente por nombre o razón social..."
              value={busquedaCliente}
              onChange={(e) => setBusquedaCliente(e.target.value)}
            />
            
            {zonas.length > 1 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Zona:
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={zonaSeleccionada}
                  onChange={(e) => setZonaSeleccionada(e.target.value)}
                >
                  {zonas.map((zona) => (
                    <option key={zona.id_zona_de_trabajo} value={zona.id_zona_de_trabajo}>
                      {zona.nombre_zona_trabajo}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="overflow-y-auto flex-grow p-4">
            {clientesFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientesFiltrados.map((cliente) => (
                  <div 
                    key={cliente.id_cliente} 
                    className="border rounded-lg p-4 hover:bg-purple-50 cursor-pointer transition-colors"
                    onClick={() => handleSeleccionarCliente(cliente)}
                  >
                    <h3 className="font-semibold text-lg text-purple-800">
                      {cliente.razon_social || cliente.nombre_completo_cliente}
                    </h3>
                    <p className="text-gray-600 text-sm">{cliente.direccion}</p>
                    <p className="text-gray-600 text-sm">{cliente.telefono}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No se encontraron clientes que coincidan con los criterios de búsqueda
              </div>
            )}
          </div>
          
          <div className="p-4 border-t flex justify-end">
            <Boton
              tipo="cancelar"
              label="Cancelar"
              onClick={() => setIsModalClienteOpen(false)}
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading && !productos.length) {
    return <Loading message="Cargando datos..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Encabezado
        mensaje="Nueva Preventa"
        onClick={() => navigate("/perfil")}
      />
      <SidebarAdm/>
      
      <div className="container mx-auto px-4 py-6 md:ml-64">
        {/* Alertas */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <div className="flex items-center">
              <Icono name="eliminarAlert" size={20} />
              <span className="ml-2">{error}</span>
            </div>
          </div>
        )}
       
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
            <div className="flex items-center">
              <Icono name="confirmar" size={20} />
              <span className="ml-2">Preventa registrada con éxito. Redirigiendo...</span>
            </div>
          </div>
        )}
        
        {/* Información del cliente */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold">
              Información del Cliente
            </Tipografia>
           
            {!clienteInfo && (
              <Boton
                tipo="secundario"
                label="Seleccionar Cliente"
                onClick={() => setIsModalClienteOpen(true)}
              />
            )}
          </div>

          {clienteInfo ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Tipografia className="text-gray-600 text-sm">Nombre / Razón Social</Tipografia>
                <Tipografia className="font-medium">
                  {clienteInfo.razon_social || clienteInfo.nombre_completo_cliente}
                </Tipografia>
              </div>
              
              <div>
                <Tipografia className="text-gray-600 text-sm">Teléfono</Tipografia>
                <Tipografia className="font-medium">{clienteInfo.telefono}</Tipografia>
              </div>
              
              <div className="sm:col-span-2">
                <Tipografia className="text-gray-600 text-sm">Dirección</Tipografia>
                <Tipografia className="font-medium">{clienteInfo.direccion}</Tipografia>
              </div>
              
              {clienteInfo && (
                <div className="sm:col-span-2 flex justify-end">
                  <Boton
                    tipo="cancelar"
                    label="Cambiar Cliente"
                    size="small"
                    onClick={() => setIsModalClienteOpen(true)}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Seleccione un cliente para registrar la preventa
            </div>
          )}
        </div>

        {/* Búsqueda de productos */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold mb-4">
            Productos Disponibles
          </Tipografia>
         
          <div className="mb-4">
            <CampoTexto
              placeholder="Buscar productos..."
              value={busquedaProducto}
              onChange={(e) => setBusquedaProducto(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <div
                  key={producto.id_producto}
                  className={`border rounded-lg p-3 hover:shadow-md transition-shadow ${
                    producto.cantidad_ingreso <= 0 ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <Tipografia className="font-medium truncate">
                        {producto.nombre_producto}
                      </Tipografia>
                      <Tipografia className="text-purple-600 font-bold mt-1">
                        ${producto.precio?.toLocaleString('es-CO')}
                      </Tipografia>
                      <Tipografia className={`text-sm ${producto.cantidad_ingreso <= 0 ? 'text-red-500' : 'text-gray-500'} mt-1`}>
                        Stock: {producto.cantidad_ingreso || 0}
                      </Tipografia>
                    </div>
                    
                    <Boton
                      tipo="primario"
                      label="Agregar"
                      size="small"
                      onClick={() => handleAddProduct(producto)}
                      className="mt-2"
                      disabled={producto.cantidad_ingreso <= 0}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-4 text-gray-500">
                No se encontraron productos con ese criterio de búsqueda
              </div>
            )}
          </div>
        </div>

        {/* Productos seleccionados */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <Tipografia variant="h2" size="lg" className="text-purple-700 font-bold mb-4">
            Productos Seleccionados
          </Tipografia>
          
          {productosSeleccionados.length > 0 ? (
            <div className="space-y-4">
              {productosSeleccionados.map((producto) => (
                <div key={producto.id_producto} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <Tipografia className="font-medium">{producto.nombre_producto}</Tipografia>
                    <Tipografia className="text-purple-600">
                      ${producto.precio?.toLocaleString('es-CO')}
                    </Tipografia>
                  </div>
                 
                  <div className="flex items-center space-x-3">
                    <button
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      onClick={() => handleUpdateCantidad(producto.id_producto, "disminuir")}
                    >
                      -
                    </button>
                    <span className="font-medium">{producto.cantidad}</span>
                    <button
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      onClick={() => handleUpdateCantidad(producto.id_producto, "aumentar")}
                    >
                      +
                    </button>
                  </div>
                 
                  <div className="ml-4 flex items-center space-x-4">
                    <Tipografia className="font-bold">
                      ${(producto.precio * producto.cantidad).toLocaleString('es-CO')}
                    </Tipografia>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveProduct(producto.id_producto)}
                    >
                      <Icono name="eliminar" size={20} />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Totales */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <Tipografia className="font-semibold">Subtotal</Tipografia>
                  <Tipografia className="font-bold">
                    ${calcularSubtotal().toLocaleString('es-CO')}
                  </Tipografia>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex justify-end space-x-4 mt-6">
                <Boton
                  tipo="cancelar"
                  label="Cancelar"
                  onClick={() => navigate("/preventa/historial")}
                />
                <Boton
                  tipo="primario"
                  label={loading ? "Enviando..." : "Crear Preventa"}
                  onClick={handleSubmitPreventa}
                  disabled={loading || !clienteInfo || productosSeleccionados.length === 0}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay productos seleccionados para la preventa
            </div>
          )}
        </div>
      </div>
      
      {/* Modal para selección de cliente */}
      {isModalClienteOpen && <ClientesModal />}
    </div>
  );
};

export default NuevaPreventa;