import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  presaleService,
  productService,
  clientService,
  userService,
} from "../../../context/services/ApiService";
import { imageService } from "../../../context/services/ImageService";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

// Componentes
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";
import CampoTexto from "../../../components/atoms/CamposTexto";
import Icono from "../../../components/atoms/Iconos";
import SidebarAdm from "../../../components/organisms/Sidebar";
import Loading from "../../../components/Loading/Loading";

const NuevaPreventa = () => {
  const navigate = useNavigate();
  const { id: clientId } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [clienteInfo, setClienteInfo] = useState(null);
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [productImages, setProductImages] = useState({});
  const [clientes, setClientes] = useState([]);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [zonasAsignadas, setZonasAsignadas] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");

  // Definir funciones auxiliares fuera de useEffect
  const fetchZonasAsignadas = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserOwnZonas();
      setZonasAsignadas(response.data.zonas || []);
    } catch (err) {
      console.error("Error al cargar zonas:", err);
      setError("No se pudieron cargar las zonas asignadas.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProductos(response.data);

      // Cargar imágenes para los productos
      const imagePromises = response.data.map(async (producto) => {
        if (producto.id_imagen) {
          try {
            const imageUrl = await imageService.getImageUrl(producto.id_imagen);
            if (imageUrl) {
              return { id: producto.id_producto, url: imageUrl };
            }
          } catch (error) {
            console.error(
              "Error cargando imagen para producto",
              producto.id_producto,
              error
            );
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
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("No se pudieron cargar los productos disponibles.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar zonas al inicio
  useEffect(() => {
    if (user.rol === "COLABORADOR") {
      fetchZonasAsignadas();
    }
  }, [user.rol]);

  // Cargar productos al inicio
  useEffect(() => {
    fetchProductos();
  }, []);

  // Cargar clientes según el rol del usuario
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        setClientes([]); // Resetear clientes al cambiar de zona
        let response;

        if (user.rol === "ADMINISTRADOR") {
          response = await clientService.getAllClients();
        } else if (zonaSeleccionada) {
          console.log(
            "Obteniendo clientes para zona:",
            zonaSeleccionada.id_zona_de_trabajo
          );
          response = await userService.getClientesZona(
            zonaSeleccionada.id_zona_de_trabajo
          );

          // Según la documentación, la respuesta incluye los clientes en response.data.clientes
          if (response.data?.clientes) {
            setClientes(response.data.clientes);
            return; // Salir temprano si encontramos los clientes
          }
        }

        // Para el caso del administrador o respuestas diferentes
        if (response?.data) {
          setClientes(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Error al cargar clientes:", err);
        let errorMessage = "No se pudieron cargar los clientes.";

        // Manejar errores específicos según la documentación
        if (err.response) {
          switch (err.response.status) {
            case 400:
              errorMessage = "La zona especificada no existe.";
              break;
            case 401:
              errorMessage =
                "Sesión expirada. Por favor, inicie sesión nuevamente.";
              break;
            case 403:
              errorMessage =
                "No tiene permisos para acceder a esta información.";
              break;
            case 500:
              errorMessage =
                "Error interno del servidor. Por favor, intente más tarde.";
              break;
          }
        }

        setError(errorMessage);
        setClientes([]);
      } finally {
        setLoading(false);
      }
    };

    if (user.rol === "ADMINISTRADOR" || zonaSeleccionada) {
      fetchClientes();
    }
  }, [user.rol, zonaSeleccionada]);

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

  // Filtrar clientes según la búsqueda
  const clientesFiltrados = React.useMemo(() => {
    if (!Array.isArray(clientes)) return [];

    return busquedaCliente.trim() === ""
      ? clientes
      : clientes.filter(
          (cliente) =>
            cliente?.razon_social
              ?.toLowerCase()
              .includes(busquedaCliente.toLowerCase()) ||
            cliente?.nombre_completo_cliente
              ?.toLowerCase()
              .includes(busquedaCliente.toLowerCase()) ||
            cliente?.telefono?.includes(busquedaCliente)
        );
  }, [clientes, busquedaCliente]);

  useEffect(() => {
    // Obtener las categorías del backend
    const fetchCategorias = async () => {
      try {
        const categoriasResponse = await productService.getAllCategories();
        setCategorias(categoriasResponse.data);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    let resultado = [...productos];

    // Filtrar por término de búsqueda
    if (busquedaProducto.trim() !== "") {
      resultado = resultado.filter((p) =>
        p.nombre_producto
          ?.toLowerCase()
          .includes(busquedaProducto.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (categoriaSeleccionada !== "Todas") {
      resultado = resultado.filter(
        (p) => p.id_categoria === parseInt(categoriaSeleccionada)
      );
    }

    setProductosFiltrados(resultado);

    // Log para depuración
    console.log("Filtrado aplicado:", {
      total: productos.length,
      filtrados: resultado.length,
      busqueda: busquedaProducto,
      categoria: categoriaSeleccionada,
    });
  }, [busquedaProducto, categoriaSeleccionada, productos]);

  // Añadir producto a la lista de seleccionados
  const handleAddProduct = (producto) => {
    const productoExistente = productosSeleccionados.find(
      (p) => p.id_producto === producto.id_producto
    );

    if (productoExistente) {
      // Verificar stock disponible
      const nuevaCantidad = productoExistente.cantidad + 1;
      if (nuevaCantidad > (producto.cantidad_ingreso || 0)) {
        setError(
          `No hay suficiente stock disponible para ${
            producto.nombre_producto
          }. Stock actual: ${producto.cantidad_ingreso || 0}`
        );
        return;
      }

      // Si ya existe, solo actualizar la cantidad
      setProductosSeleccionados(
        productosSeleccionados.map((p) =>
          p.id_producto === producto.id_producto
            ? { ...p, cantidad: nuevaCantidad }
            : p
        )
      );
    } else {
      // Verificar stock disponible para nuevo producto
      if (1 > (producto.cantidad_ingreso || 0)) {
        setError(
          `No hay suficiente stock disponible para ${
            producto.nombre_producto
          }. Stock actual: ${producto.cantidad_ingreso || 0}`
        );
        return;
      }

      // Si no existe, añadirlo con cantidad 1
      setProductosSeleccionados([
        ...productosSeleccionados,
        { ...producto, cantidad: 1 },
      ]);
    }
  };

  // Actualizar cantidad de producto
  const handleUpdateCantidad = (id, operacion) => {
    setProductosSeleccionados(
      productosSeleccionados.map((p) => {
        if (p.id_producto === id) {
          const nuevaCantidad =
            operacion === "aumentar" ? p.cantidad + 1 : p.cantidad - 1;

          // Verificar stock disponible
          const producto = productos.find((prod) => prod.id_producto === id);
          if (nuevaCantidad > (producto?.cantidad_ingreso || 0)) {
            setError(
              `No hay suficiente stock disponible para ${
                producto?.nombre_producto
              }. Stock actual: ${producto?.cantidad_ingreso || 0}`
            );
            return p;
          }

          return { ...p, cantidad: Math.max(nuevaCantidad, 1) }; // No permitir cantidades menores a 1
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
      (total, p) => total + (parseFloat(p.precio) || 0) * p.cantidad,
      0
    );
  };

  // Función para manejar el reinicio del componente
  const handleReset = () => {
    setClienteInfo(null);
    setProductosSeleccionados([]);
    setBusquedaProducto("");
    setBusquedaCliente("");
    setError("");
    setSuccess(false);
    setZonaSeleccionada(null);

    // Llamamos a las funciones para recargar datos
    if (user.rol === "COLABORADOR") {
      fetchZonasAsignadas();
    }
    fetchProductos();
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

    // Preparar mensaje de confirmación
    const total = calcularSubtotal();
    const productosInfo = productosSeleccionados
      .map(
        (p) =>
          `- ${p.nombre_producto} (${p.cantidad} unidades) - $${(
            p.precio * p.cantidad
          ).toLocaleString("es-CO")}`
      )
      .join("\n");

    const mensajeConfirmacion =
      `Cliente: ${
        clienteInfo.razon_social || clienteInfo.nombre_completo_cliente
      }\n` +
      `Productos:\n${productosInfo}\n\n` +
      `Total: $${total.toLocaleString("es-CO")}`;

    // En lugar de window.confirm, establecemos el mensaje y mostramos el modal
    setConfirmMessage(mensajeConfirmacion);
    setShowConfirmModal(true);
  };

  // 3. Crea una función que se ejecute cuando el usuario confirme
  const handleConfirmPreventa = async () => {
    setShowConfirmModal(false);

    try {
      setLoading(true);
      setError("");

      // Preparar datos para la API
      const preventaData = {
        id_cliente: String(clienteInfo.id_cliente),
        detalles: productosSeleccionados.map((p) => ({
          id_producto: Number(p.id_producto),
          cantidad: Number(p.cantidad),
        })),
      };

      // Enviar datos al servicio
      const response = await presaleService.createPresale(preventaData);

      // Solo si la respuesta es exitosa
      if (response && response.status === 201) {
        setSuccess(true);

        // Limpiar estados directamente en lugar de llamar a handleReset
        setClienteInfo(null);
        setProductosSeleccionados([]);
        setBusquedaProducto("");
        setBusquedaCliente("");
        setError("");
        setZonaSeleccionada(null);
      }
    } catch (err) {
      console.error("Error completo:", err);
      if (err.response && err.response.data) {
        console.log(
          "Respuesta del servidor:",
          JSON.stringify(err.response.data, null, 2)
        );
      }
      let mensajeError = "";

      if (err.response) {
        switch (err.response.status) {
          case 401:
            mensajeError =
              "Su sesión ha expirado. Por favor, inicie sesión nuevamente.";
            break;
          case 403:
            mensajeError = "No tiene permisos para realizar esta acción.";
            break;
          case 422:
            const validationError = err.response.data.errors?.[0];
            mensajeError = validationError
              ? `Error de validación: ${validationError.msg}`
              : "Error de validación en los datos enviados.";
            break;
          case 500:
            mensajeError =
              "Error interno del servidor. Por favor, intente más tarde.";
            break;
          default:
            mensajeError =
              err.response.data?.message ||
              "Error al procesar la solicitud. Por favor, intente nuevamente.";
        }
      } else if (err.message?.includes("Network Error")) {
        mensajeError =
          "Error de conexión con el servidor. Verifique su conexión a internet.";
      } else {
        mensajeError =
          "Error inesperado. Por favor, intente nuevamente más tarde.";
      }

      setError(mensajeError);
      alert(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar cliente
  const handleSeleccionarCliente = (cliente) => {
    setClienteInfo(cliente);
    setBusquedaCliente("");
  };

  // Deseleccionar cliente
  const handleDeseleccionarCliente = () => {
    setClienteInfo(null);
    setProductosSeleccionados([]);
  };

  const handleSeleccionarZona = (zona) => {
    setZonaSeleccionada(zona);
    setClienteInfo(null);
  };

  if (loading && !productos.length) {
    return <Loading message="Cargando datos..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 ml-10 pl-6">
      <Tipografia>
        <div className="w-full bg-white mb-4">
          <div className="px-2 sm:px-4 lg:px-8 py-2">
            <Tipografia>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Nueva Preventa
              </h1>
            </Tipografia>
          </div>
        </div>

        <SidebarAdm />
        <div className="container mx-auto px-2 sm:px-4 py-2">
          {/* Alertas */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <div className="flex items-center">
                <Icono name="eliminarAlert" size={20} />
                <Tipografia>
                  <span className="ml-2">{error}</span>
                </Tipografia>
              </div>
            </div>
          )}

          {/* Alerta de Éxito */}
          {success && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Icono name="confirmar" size="50" />
                  </div>
                  <Tipografia size="lg" className="font-bold mb-2">
                    ¡Operación exitosa!
                  </Tipografia>
                  <Tipografia className="text-gray-600 mb-4">
                    Preventa creada exitosamente
                  </Tipografia>
                  <Boton
                    tipo="primario"
                    label="Aceptar"
                    onClick={() => {
                      setSuccess(false);
                      navigate("/preventa/historial");
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Zonas Asignadas */}
          {user.rol === "COLABORADOR" && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <Tipografia
                  variant="h2"
                  className="text-orange-700 font-bold text-lg"
                >
                  Zonas Asignadas
                </Tipografia>
                <div className="text-sm text-gray-600">
                  <Tipografia>
                    {zonasAsignadas.length} zonas disponibles
                  </Tipografia>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <Loading message="Cargando zonas..." />
                </div>
              ) : zonasAsignadas.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {zonasAsignadas.map((zona) => (
                    <div
                      key={zona.id_zona_de_trabajo}
                      onClick={() => handleSeleccionarZona(zona)}
                      className={`
                      border rounded-lg p-4 cursor-pointer transition-all duration-200
                      ${
                        zonaSeleccionada?.id_zona_de_trabajo ===
                        zona.id_zona_de_trabajo
                          ? "bg-orange-50 border-orange-500 shadow-md"
                          : "hover:shadow-md hover:border-orange-300"
                      }
                    `}
                    >
                      {/* Encabezado de la zona */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-grow">
                          <Tipografia className="font-medium text-lg mb-1">
                            {zona.nombre_zona_trabajo}
                          </Tipografia>
                          {zona.ciudad && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Icono
                                name="ubicacion"
                                size={16}
                                className="mr-1"
                              />
                              <Tipografia>
                                <span>{zona.ciudad}</span>
                              </Tipografia>
                            </div>
                          )}
                        </div>
                        {zonaSeleccionada?.id_zona_de_trabajo ===
                          zona.id_zona_de_trabajo && (
                          <div className="text-orange-500">
                            <Icono name="confirmar" size={24} />
                          </div>
                        )}
                      </div>

                      {/* Detalles de la zona */}
                      <div className="space-y-2 border-t border-gray-100 pt-3">
                        {/* Descripción */}
                        {zona.descripcion && (
                          <div className="text-sm">
                            <Tipografia className="text-gray-600 line-clamp-2">
                              {zona.descripcion}
                            </Tipografia>
                          </div>
                        )}

                        {/* Información adicional */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {zona.departamento && (
                            <div>
                              <Tipografia className="text-gray-500 text-xs">
                                Departamento
                              </Tipografia>
                              <Tipografia className="text-gray-700">
                                {zona.departamento}
                              </Tipografia>
                            </div>
                          )}

                          {zona.municipio && (
                            <div>
                              <Tipografia className="text-gray-500 text-xs">
                                Municipio
                              </Tipografia>
                              <Tipografia className="text-gray-700">
                                {zona.municipio}
                              </Tipografia>
                            </div>
                          )}
                        </div>

                        {/* Coordenadas */}
                        {(zona.latitud || zona.longitud) && (
                          <div className="text-xs text-gray-500 flex items-center mt-2">
                            <Icono
                              name="ubicacion"
                              size={14}
                              className="mr-1"
                            />
                            <Tipografia>
                              <span>
                                Lat: {zona.latitud}, Long: {zona.longitud}
                              </span>
                            </Tipografia>
                          </div>
                        )}

                        {/* Estado de la zona */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                          {zona.estado && (
                            <div
                              className={`text-xs px-2 py-1 rounded-full ${
                                zona.estado === "Activa"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <Tipografia>{zona.estado}</Tipografia>
                            </div>
                          )}

                          {zona.cantidad_clientes !== undefined && (
                            <div className="text-xs text-gray-600">
                              <Tipografia>
                                {zona.cantidad_clientes} clientes
                              </Tipografia>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Tipografia className="text-gray-500">
                    No hay zonas asignadas disponibles
                  </Tipografia>
                </div>
              )}
            </div>
          )}

          {/* Información del cliente */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <Tipografia
                variant="h2"
                className="text-orange-700 font-bold text-lg"
              >
                Información del Cliente
              </Tipografia>
              {clienteInfo && (
                <Boton
                  tipo="secundario"
                  label="Cambiar Cliente"
                  onClick={handleDeseleccionarCliente}
                  size="small"
                />
              )}
            </div>
            {clienteInfo ? (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-10">
                <div className="mb-2 sm:mb-0">
                  <Tipografia className="text-gray-600 text-sm mr-2">
                    Nombre / Razón Social:
                  </Tipografia>
                  <Tipografia className="font-medium break-words">
                    {clienteInfo.razon_social ||
                      clienteInfo.nombre_completo_cliente}
                  </Tipografia>
                </div>
                <div className="mb-2 sm:mb-0">
                  <Tipografia className="text-gray-600 text-sm mr-2">
                    Teléfono:
                  </Tipografia>
                  <Tipografia className="font-medium break-words">
                    {clienteInfo.telefono}
                  </Tipografia>
                </div>
                <div>
                  <Tipografia className="text-gray-600 text-sm mr-2">
                    Dirección:
                  </Tipografia>
                  <Tipografia className="font-medium break-words">
                    {clienteInfo.direccion}
                  </Tipografia>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4 w-auto md:w-96">
                  <CampoTexto
                    placeholder="Buscar cliente por nombre, razón social o teléfono..."
                    value={busquedaCliente}
                    onChange={(e) => setBusquedaCliente(e.target.value)}
                  />
                </div>
                {!loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.isArray(clientesFiltrados) &&
                    clientesFiltrados.length > 0 ? (
                      clientesFiltrados.map((cliente) => (
                        <div
                          key={cliente.id_cliente}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white hover:bg-gray-50"
                          onClick={() => handleSeleccionarCliente(cliente)}
                        >
                          <div className="space-y-2">
                            <Tipografia className="font-medium break-words">
                              {cliente.razon_social ||
                                cliente.nombre_completo_cliente}
                            </Tipografia>
                            <br />
                            <Tipografia className="text-sm text-gray-600 break-words">
                              {cliente.telefono}
                            </Tipografia>
                            <Tipografia className="text-sm text-gray-600 break-words line-clamp-2">
                              {cliente.direccion}
                            </Tipografia>
                          </div>
                        </div>
                      ))
                    ) : (
                      <Tipografia>
                        <div className="col-span-full text-center py-1 text-gray-500">
                          {!zonaSeleccionada && user.rol === "COLABORADOR"
                            ? "Seleccione una zona para ver sus clientes"
                            : "No se encontraron clientes en esta zona"}
                        </div>
                      </Tipografia>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Loading message="Cargando clientes..." />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* filtro de productos */}
          <div className="bg-white rounded-lg shadow-md p-4 my-4">
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Tipografia
                variant="h2"
                className="text-orange-700 font-bold text-lg mb-4"
              >
                Productos Disponibles
              </Tipografia>
              {categoriaSeleccionada !== "Todas" && (
                <div className="inline-flex items-center bg-orange-100 text-orange-800 text-xs rounded-full px-3 py-1">
                  <span>
                    Categoría:{" "}
                    {categorias.find(
                      (c) => c.id_categoria === parseInt(categoriaSeleccionada)
                    )?.nombre_categoria || categoriaSeleccionada}
                  </span>
                </div>
              )}

              <div className="ml-auto text-xs text-gray-500">
                Mostrando {productosFiltrados.length} de {productos.length}{" "}
                productos
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              {/* Selector de categorías (a la izquierda) */}
              <div className="w-full md:w-96">
                <Tipografia className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </Tipografia>
                <Tipografia>
                  <select
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  >
                    <option value="Todas">Todas las categorías</option>
                    {categorias.map((cat) => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre_categoria}
                      </option>
                    ))}
                  </select>
                </Tipografia>
              </div>

              {/* Buscador de productos (a la derecha) */}
              <div className="w-full md:w-96">
                <Tipografia className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </Tipografia>
                <div className="relative">
                  <CampoTexto
                    placeholder="Buscar productos..."
                    value={busquedaProducto}
                    onChange={(e) => setBusquedaProducto(e.target.value)}
                  />
                  {busquedaProducto && (
                    <button
                      onClick={() => setBusquedaProducto("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Botón para limpiar filtros (solo visible cuando hay filtros activos) */}
            {(busquedaProducto || categoriaSeleccionada !== "Todas") && (
              <div className="flex justify-end mt-2 mb-4">
                <button
                  onClick={() => {
                    setBusquedaProducto("");
                    setCategoriaSeleccionada("Todas");
                  }}
                  className="text-sm text-orange-600 hover:text-orange-800 flex items-center transition-colors duration-150"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Limpiar filtros
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((producto) => (
                  <div
                    key={producto.id_producto}
                    className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-white hover:bg-gray-50"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex-grow">
                        {/* Imagen del producto */}
                        <div className="relative h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                          {productImages[producto.id_producto] ? (
                            <img
                              src={productImages[producto.id_producto]}
                              alt={producto.nombre_producto}
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                e.target.onerror = null;
                                const imgMap = { ...productImages };
                                imgMap[producto.id_producto] = null;
                                setProductImages(imgMap);
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <Icono name="gest-productos" size={48} />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Tipografia className="font-medium break-words line-clamp-2">
                            {producto.nombre_producto}
                          </Tipografia>
                          <div className="flex justify-between items-center w-full">
                            <Tipografia className="text-orange-700 font-bold">
                              $
                              {parseFloat(producto.precio || 0).toLocaleString(
                                "es-CO"
                              )}
                            </Tipografia>
                            <Tipografia
                              className={`text-sm inline-flex items-center px-2.5 py-0.5 rounded-full md:text-sm ${
                                (producto.cantidad_ingreso || 0) <= 10
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              Stock: {producto.cantidad_ingreso || 0}
                            </Tipografia>
                          </div>
                        </div>
                      </div>
                      <Boton
                        tipo="primario"
                        label="Agregar"
                        size="small"
                        onClick={() => handleAddProduct(producto)}
                        className="mt-4 w-full"
                        disabled={!clienteInfo}
                      />
                      {!clienteInfo && (
                        <Tipografia className="text-xs text-red-500 mt-1 text-center">
                          Seleccione un cliente primero
                        </Tipografia>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-4 text-gray-500">
                  <Tipografia>
                    No se encontraron productos con ese criterio de búsqueda
                  </Tipografia>
                </div>
              )}
            </div>
          </div>

          {/* Productos seleccionados */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <Tipografia
              variant="h2"
              className="text-orange-700 font-bold text-lg mb-4"
            >
              Productos Seleccionados
            </Tipografia>
            {productosSeleccionados.length > 0 ? (
              <div className="space-y-4">
                {productosSeleccionados.map((producto) => (
                  <div
                    key={producto.id_producto}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      {/* Imagen del producto seleccionado */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {productImages[producto.id_producto] ? (
                          <img
                            src={productImages[producto.id_producto]}
                            alt={producto.nombre_producto}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <Icono name="gest-productos" size={24} />
                          </div>
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <Tipografia className="font-medium break-words mr-2">
                          {producto.nombre_producto}
                        </Tipografia>
                        <Tipografia className="text-orange-600">
                          $
                          {parseFloat(producto.precio || 0).toLocaleString(
                            "es-CO"
                          )}
                        </Tipografia>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                      <button
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        onClick={() =>
                          handleUpdateCantidad(
                            producto.id_producto,
                            "disminuir"
                          )
                        }
                      >
                        <Tipografia>-</Tipografia>
                      </button>
                      <Tipografia className="font-medium">
                        {producto.cantidad}
                      </Tipografia>
                      <button
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        onClick={() =>
                          handleUpdateCantidad(producto.id_producto, "aumentar")
                        }
                      >
                        <Tipografia>+</Tipografia>
                      </button>
                    </div>

                    <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                      <Tipografia className="font-bold">
                        $
                        {(
                          (parseFloat(producto.precio) || 0) * producto.cantidad
                        ).toLocaleString("es-CO")}
                      </Tipografia>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() =>
                          handleRemoveProduct(producto.id_producto)
                        }
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
                      ${calcularSubtotal().toLocaleString("es-CO")}
                    </Tipografia>
                  </div>
                </div>
                {/* Botones de acción */}
                <div className="flex justify-end space-x-4 mt-6">
                  <Boton
                    tipo="secundario"
                    label="Cancelar"
                    onClick={() => {
                      handleReset(); // Reiniciar el componente
                      window.scrollTo(0, 0); // Volver al inicio de la página
                    }}
                  />
                  <Boton
                    tipo="primario"
                    label={loading ? "Enviando..." : "Crear Preventa"}
                    onClick={handleSubmitPreventa}
                    disabled={
                      loading ||
                      !clienteInfo ||
                      productosSeleccionados.length === 0
                    }
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
        {/* Modal de confirmación personalizado */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="mb-4">
                <div className="flex justify-center mb-4">
                  <Icono name="alerta" size={24} customColor="#F59E0B" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  ¿Está seguro que desea crear la siguiente preventa?
                </h3>
              </div>
              <div className="mb-4 whitespace-pre-line text-gray-700">
                {confirmMessage}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmPreventa}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </Tipografia>
    </div>
  );
};

export default NuevaPreventa;
