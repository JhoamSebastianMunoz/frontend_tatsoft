import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { presaleService, userService } from "../../../context/services/ApiService";
import { useAuth } from "../../../context/AuthContext";

// Componentes
import Tipografia from "../../atoms/Tipografia";
import Boton from "../../atoms/Botones";
import Icono from "../../atoms/Iconos";
import Sidebar from "../../organisms/Sidebar";
import CampoTexto from "../../atoms/CamposTexto";
import Loading from "../../Loading/Loading";

const HistorialPreventas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [preventas, setPreventas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroColaborador, setFiltroColaborador] = useState("Todos");
  const [colaboradores, setColaboradores] = useState([]);
  const [imprimiendoPreventa, setImprimiendoPreventa] = useState(null);
  const [detalleParaImprimir, setDetalleParaImprimir] = useState(null);

  // Formatear fecha para mostrar
  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Fecha no disponible";
    const fecha = new Date(fechaString);
    return fecha.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Cargar colaboradores si el usuario es administrador
  useEffect(() => {
    const fetchColaboradores = async () => {
      if (user.rol === "ADMINISTRADOR") {
        try {
          const response = await userService.getAllUsers();
          const colaboradoresData = response.data.filter(u => u.rol === "COLABORADOR");
          setColaboradores(colaboradoresData);
        } catch (err) {
          console.error("Error al cargar colaboradores:", err);
        }
      }
    };

    fetchColaboradores();
  }, [user.rol]);

  useEffect(() => {
    const fetchPreventas = async () => {
      try {
        setLoading(true);
        setError("");
        console.log("Iniciando carga de preventas...");
        console.log("Rol del usuario:", user.rol);
        console.log("Datos completos del usuario:", user);
        
        // Validación más robusta del usuario
        if (!user) {
          throw new Error("No se encontró información del usuario");
        }

        if (!user.rol) {
          throw new Error("El usuario no tiene un rol definido");
        }

        let response;
        if (user.rol === "ADMINISTRADOR") {
          console.log("Intentando cargar todas las preventas...");
          response = await presaleService.getAllPresales();
        } else {
          // Para colaboradores, obtener el ID del usuario actual
          const userId = user.id || user.id_usuario;
          if (!userId) {
            throw new Error("No se pudo obtener el ID del usuario");
          }
          console.log("Intentando cargar preventas del colaborador:", userId);
          response = await presaleService.getAllPresales();
        }
        
        console.log("Respuesta completa del backend:", response);
        
        // Validación más robusta de la respuesta
        if (!response || !response.data) {
          throw new Error("La respuesta del servidor no tiene el formato esperado");
        }

        // Procesar los datos de manera más estructurada
        let data = [];
        const responseData = response.data;

        console.log("Estructura de responseData:", responseData);

        // Intentar obtener el array de datos de diferentes estructuras posibles
        if (Array.isArray(responseData)) {
          data = responseData;
        } else if (Array.isArray(responseData.message)) {
          data = responseData.message;
        } else if (Array.isArray(responseData.data)) {
          data = responseData.data;
        } else if (Array.isArray(responseData.preventas)) {
          data = responseData.preventas;
        } else if (Array.isArray(responseData.presales)) {
          data = responseData.presales;
        } else if (typeof responseData === 'object' && responseData !== null) {
          // Si es un objeto, intentar extraer el array de datos
          const possibleArrays = Object.values(responseData).filter(value => Array.isArray(value));
          if (possibleArrays.length > 0) {
            data = possibleArrays[0];
          } else {
            console.warn("Estructura de respuesta inesperada:", responseData);
            throw new Error("No se encontró un array de datos en la respuesta");
          }
        } else {
          console.warn("Estructura de respuesta inesperada:", responseData);
          throw new Error("El formato de la respuesta no es válido");
        }

        console.log("Datos extraídos:", data);

        // Si el usuario es colaborador, filtrar las preventas
        if (user.rol === "COLABORADOR") {
          const userId = user.id || user.id_usuario;
          console.log("Filtrando preventas para el colaborador:", userId);
          data = data.filter(preventa => {
            console.log("Preventa:", preventa);
            console.log("ID Usuario de la preventa:", preventa.id_usuario);
            console.log("ID Usuario actual:", userId);
            return preventa.id_colaborador === userId;
          });
        }

        // Validar que los datos tienen la estructura esperada
        if (!data.every(preventa => 
          typeof preventa.id_preventa !== 'undefined' && 
          typeof preventa.estado !== 'undefined'
        )) {
          console.warn("Datos de preventas incompletos:", data);
          throw new Error("Los datos de las preventas están incompletos");
        }

        // Ordenar las preventas por fecha de creación (más recientes primero)
        data.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

        console.log("Datos procesados finales:", data);
        setPreventas(data);
        
      } catch (err) {
        console.error("Error completo al cargar preventas:", err);
        console.error("Respuesta de error:", err.response);
        
        if (err.response) {
          console.error("Estado del error:", err.response.status);
          console.error("Datos del error:", err.response.data);
          
          switch (err.response.status) {
            case 401:
              setError("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
              break;
            case 403:
              setError("No tiene permisos para ver el historial de preventas.");
              break;
            case 404:
              setError("No se encontraron preventas para este usuario.");
              break;
            case 500:
              setError("Error interno del servidor. Por favor, intente nuevamente más tarde.");
              break;
            default:
              setError(err.response.data?.message || "Error al cargar el historial de preventas.");
          }
        } else if (err.request) {
          console.error("Error de red:", err.request);
          setError("Error de conexión. Por favor, verifique su conexión a internet.");
        } else {
          console.error("Error en la configuración de la petición:", err.message);
          setError(err.message || "Error al procesar la solicitud. Por favor, intente nuevamente.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPreventas();
  }, [user]);

  // Aplicar filtros
  const preventasFiltradas = preventas.filter(preventa => {
    // Filtro por estado
    const cumpleFiltroEstado = filtroEstado === "Todos" || 
      (preventa.estado && preventa.estado.toLowerCase() === filtroEstado.toLowerCase());
    
    // Filtro por búsqueda (incluye búsqueda por colaborador)
    const terminoBusqueda = filtroBusqueda.toLowerCase().trim();
    const fechaFormateada = formatearFecha(preventa.fecha_creacion).toLowerCase();
    
    const cumpleBusqueda = terminoBusqueda === "" || 
      (preventa.id_preventa && preventa.id_preventa.toString().includes(terminoBusqueda)) ||
      (preventa.fecha_creacion && fechaFormateada.includes(terminoBusqueda)) ||
      (preventa.total && preventa.total.toString().includes(terminoBusqueda)) ||
      (preventa.nombre_colaborador && preventa.nombre_colaborador.toLowerCase().includes(terminoBusqueda)) ||
      (preventa.estado && preventa.estado.toLowerCase().includes(terminoBusqueda));

    return cumpleFiltroEstado && cumpleBusqueda;
  });

  // Log para debugging de filtros
  useEffect(() => {
    console.log('Estado de los filtros:', {
      filtroEstado,
      filtroBusqueda,
      totalPreventas: preventas.length,
      totalFiltradas: preventasFiltradas.length
    });
  }, [filtroEstado, filtroBusqueda, preventas]);

  // Ver detalles de preventa
  const verDetallesPreventa = (id) => {
    navigate(`/preventa/detalles/${id}`);
  };

  // Confirmar preventa (solo para administradores)
  const confirmarPreventa = (id) => {
    navigate(`/preventa/confirmar/${id}`);
  };

  // Cancelar preventa
  const handleCancelarPreventa = async (id) => {
    if (window.confirm("¿Está seguro que desea cancelar esta preventa?")) {
      try {
        setLoading(true);
        await presaleService.cancelPresale(id);
        
        // Actualizar la lista de preventas
        const response = await presaleService.getAllPresales();
        const data = Array.isArray(response.data) ? response.data : response.data?.message || [];
        setPreventas(data);
        
      } catch (err) {
        console.error("Error al cancelar preventa:", err);
        if (err.response) {
          switch (err.response.status) {
            case 401:
              setError("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
              break;
            case 403:
              setError("No tiene permisos para cancelar preventas.");
              break;
            case 404:
              setError("La preventa no fue encontrada.");
              break;
            case 500:
              setError("Error interno del servidor. Por favor, intente nuevamente más tarde.");
              break;
            default:
              setError(err.response.data?.message || "Error al cancelar la preventa.");
          }
        } else {
          setError("Error de conexión. Por favor, verifique su conexión a internet.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Nueva función para manejar la impresión
  const handleImprimir = async (id) => {
    try {
      setImprimiendoPreventa(id);
      console.log("Preparando impresión para preventa:", id);
      
      // Obtener los detalles de la preventa
      const response = await presaleService.getPresaleDetails(id);
      
      if (!response || !response.data) {
        throw new Error("No se pudieron obtener los detalles para imprimir");
      }
      
      const detalle = response.data;
      setDetalleParaImprimir(detalle);
      
      // Dar tiempo al estado para actualizarse
      setTimeout(() => {
        imprimirDetalle(detalle);
      }, 300);
      
    } catch (error) {
      console.error("Error al preparar la impresión:", error);
      alert("No se pudo generar la impresión. Intente nuevamente.");
    } finally {
      setImprimiendoPreventa(null);
    }
  };
  
  // Función para generar e imprimir el documento
  const imprimirDetalle = (detalle) => {
    // Crear una nueva ventana para la impresión
    const ventanaImpresion = window.open('', '_blank', 'height=600,width=800');
    
    // Formatear la fecha
    const fechaFormateada = formatearFecha(detalle.fecha_creacion);
    
    // Construir el HTML para la impresión
    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Factura Preventa #${detalle.id_preventa}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .factura {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
          }
          .encabezado {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #ED6C02;
            padding-bottom: 10px;
          }
          .info-empresa {
            margin-bottom: 20px;
          }
          .info-cliente {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #eee;
            background-color: #f9f9f9;
          }
          .detalles {
            margin-bottom: 20px;
          }
          .detalles-titulo {
            font-weight: bold;
            margin-bottom: 10px;
            color: #ED6C02;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
          }
          .total {
            text-align: right;
            font-weight: bold;
            font-size: 16px;
            margin-top: 20px;
          }
          .total span {
            color: #ED6C02;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="factura">
          <div class="encabezado">
            <h1>FACTURA DE PREVENTA</h1>
            <h2>#${detalle.id_preventa}</h2>
          </div>
          
          <div class="info-empresa">
            <h3>INFORMACIÓN DE LA EMPRESA</h3>
            <p>TAT-SOFT</p>
            <p>Sistema de Gestión para Ventas</p>
          </div>
          
          <div class="info-cliente">
            <h3>INFORMACIÓN DEL CLIENTE</h3>
            <p><strong>Cliente:</strong> ${detalle.cliente?.razon_social || detalle.cliente?.nombre || "No especificado"}</p>
            <p><strong>Dirección:</strong> ${detalle.cliente?.direccion || "No especificado"}</p>
            <p><strong>Teléfono:</strong> ${detalle.cliente?.telefono || "No especificado"}</p>
          </div>
          
          <div class="detalles">
            <div class="detalles-titulo">DETALLES DE LA PREVENTA</div>
            <p><strong>Fecha de Emisión:</strong> ${fechaFormateada}</p>
            <p><strong>Estado:</strong> ${detalle.estado}</p>
            <p><strong>Colaborador:</strong> ${detalle.colaborador?.nombre || "No especificado"}</p>
          </div>
          
          <div class="productos">
            <div class="detalles-titulo">PRODUCTOS</div>
            <table>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${detalle.productos && detalle.productos.map(producto => `
                  <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${Number(producto.precio).toLocaleString('es-CO')}</td>
                    <td>$${Number(producto.subtotal).toLocaleString('es-CO')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total">
              TOTAL: <span>$${Number(detalle.total).toLocaleString('es-CO')}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Esta factura es un documento informativo para la preventa.</p>
            <p>Fecha de impresión: ${new Date().toLocaleString()}</p>
          </div>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background-color: #ED6C02; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Imprimir Factura
          </button>
          <button onclick="window.close();" style="padding: 10px 20px; background-color: #ccc; color: black; border: none; border-radius: 4px; margin-left: 10px; cursor: pointer;">
            Cerrar
          </button>
        </div>
      </body>
      </html>
    `);
    
    ventanaImpresion.document.close();
    
    // Esperar a que se cargue el contenido antes de mostrar la ventana de impresión
    ventanaImpresion.onload = function() {
      // Para navegadores modernos
      if (ventanaImpresion.window.matchMedia) {
        let mediaQueryList = ventanaImpresion.window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
          if (!mql.matches) {
            // Se ha terminado la impresión o se ha cancelado
            console.log("Impresión finalizada o cancelada");
          }
        });
      }
      
      // Dar tiempo para que se carguen los estilos
      setTimeout(() => {
        ventanaImpresion.focus(); // Enfocar la ventana para preparar la impresión
      }, 500);
    };
  };

  if (loading && preventas.length === 0) {
    return <Loading message="Cargando historial de preventas" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 ml-10 pl-6">
      <Tipografia>
      <Sidebar/>
      <div className="container mx-auto px-2 sm:px-4 py-2 w-full">
        <div className="w-full bg-white shadow-sm mb-4">
          <div className="px-2 sm:px-4 lg:px-8 py-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Historial de Preventas</h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 sm:p-3 mb-2 rounded">
            <div className="flex items-center">
              <Icono name="eliminarAlert" size={20} />
              <span className="ml-2 text-sm sm:text-base">{error}</span>
            </div>
          </div>
        )}

        {/* Filtros y búsqueda */}
        <div className="bg-slate-50 rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center">
            <div className="w-full sm:w-1/2">
              <CampoTexto 
                placeholder="Buscar por ID, fecha, total, estado o colaborador..." 
                value={filtroBusqueda}
                onChange={(e) => setFiltroBusqueda(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Tipografia className="whitespace-nowrap text-sm sm:text-base">Estado:</Tipografia>
              <select 
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-auto text-sm sm:text-base"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
              </div>
              
              {user.rol === "COLABORADOR" && (
              <Boton 
                tipo="primario" 
                label="Nueva Preventa" 
                onClick={() => navigate("/preventa/nueva")}
                  className="w-full sm:w-auto"
              />
              )}
            </div>
          </div>
        </div>

        {/* Lista de preventas */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <Tipografia variant="h2" size="lg" className="text-orange-700 font-bold mb-4 sm:mb-6 text-lg sm:text-xl">
            Preventas Registradas
          </Tipografia>

          {preventasFiltradas.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <div className="min-w-full divide-y divide-gray-200">
                {/* Encabezados de tabla */}
                <div className="hidden md:grid md:grid-cols-6 bg-gray-50 px-4 sm:px-6 py-3">
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Creación
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                  </div>
                  {user.rol === "ADMINISTRADOR" && (
                    <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Colaborador
                    </div>
                  )}
                </div>

                {/* Lista de preventas */}
                <div className="divide-y divide-gray-200">
                  {preventasFiltradas.map((preventa) => (
                    <div key={preventa.id_preventa} className="hover:bg-gray-50">
                 
                      <div className="md:hidden p-3 sm:p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                          #{preventa.id_preventa}
                            </span>
                            <div className="text-xs sm:text-sm text-gray-500">
                          {formatearFecha(preventa.fecha_creacion)}
                        </div>
                            {user.rol === "ADMINISTRADOR" && (
                              <div className="text-sm text-gray-500">
                                Colaborador: {preventa.nombre_colaborador}
                              </div>
                            )}
                          </div>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${preventa.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                            preventa.estado === 'Confirmada' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {preventa.estado}
                        </span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 mb-3 ">
                          Total: ${Number(preventa.total).toLocaleString('es-CO')}
                        </div>
                        <div className="flex justify-end space-x-2 ">
                          <Boton
                          label="Ver"
                          tipo="primario"
                            onClick={() => verDetallesPreventa(preventa.id_preventa)}
                            className="text-orange-600 hover:text-orange-900 text-xs sm:text-sm"
                          />
                          <Boton
                          label={imprimiendoPreventa === preventa.id_preventa ? "Cargando..." : "Imprimir"}
                          tipo="secundario"
                          onClick={() => handleImprimir(preventa.id_preventa)}
                          disabled={imprimiendoPreventa === preventa.id_preventa}
                          className="text-xs sm:text-sm"
                        />
                          
                          {preventa.estado === 'Pendiente' && user.rol === 'COLABORADOR' && (
                            <>
                              <button
                                onClick={() => confirmarPreventa(preventa.id_preventa)}
                                className="text-green-600 hover:text-green-900 text-xs sm:text-sm"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => handleCancelarPreventa(preventa.id_preventa)}
                                className="text-red-600 hover:text-red-900 text-xs sm:text-sm"
                              >
                                Cancelar
                              </button>
                            </>
                          )}
                        </div>
                      </div>

               
                      <div className="hidden md:grid md:grid-cols-6 px-4 sm:px-6 py-3 sm:py-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{preventa.id_preventa}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatearFecha(preventa.fecha_creacion)}
                        </div>
                        <div>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${preventa.estado === 'Pendiente' ? 'bg-slate-100 text-slate-800' : 
                              preventa.estado === 'Confirmada' ? 'bg-orange-100 text-orange-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {preventa.estado}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          ${Number(preventa.total).toLocaleString('es-CO')}
                        </div>
                        {user.rol === "ADMINISTRADOR" && (
                          <div className="text-sm text-gray-500">
                            {preventa.nombre_colaborador}
                          </div>
                        )}
                        <div className="text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Boton
                            label="Ver"
                            tipo="primario"
                            size="medium"
                            onClick={() => verDetallesPreventa(preventa.id_preventa)}
                            className="text-gray-600 hover:text-gray-900"
                            />
                            <Boton
                            label={imprimiendoPreventa === preventa.id_preventa ? "Cargando..." : "Imprimir"}
                            tipo="secundario"
                            size="small"
                            onClick={() => handleImprimir(preventa.id_preventa)}
                            disabled={imprimiendoPreventa === preventa.id_preventa}
                          />
                            
                            
                            {preventa.estado === 'Pendiente' && user.rol === 'COLABORADOR' && (
                              <>
                                <button
                                  onClick={() => confirmarPreventa(preventa.id_preventa)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Confirmar
                                </button>
                                <button
                                  onClick={() => handleCancelarPreventa(preventa.id_preventa)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-10 text-gray-500 text-sm sm:text-base">
              No se encontraron preventas con los criterios de búsqueda actuales
            </div>
          )}
        </div>
      </div>
      </Tipografia>
    </div>
  );
};

export default HistorialPreventas;
