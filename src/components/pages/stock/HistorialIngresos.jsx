import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tipografia from "../../atoms/Tipografia";
import Icono from "../../atoms/Iconos";
import Botones from "../../atoms/Botones";
import Buscador from "../../molecules/Buscador";
import Sidebar from "../../organisms/Sidebar";
import { useAuth } from "../../../context/AuthContext";

const HistorialIngresos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estado para el sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return JSON.parse(localStorage.getItem("sidebarCollapsed") || "true");
  });

  // Estados para la búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaDesde, setFechaDesde] = useState("12/03/2025");
  const [fechaHasta, setFechaHasta] = useState("12/03/2025");
  const [usuarioResponsable, setUsuarioResponsable] = useState("");

  // Estado para el detalle expandido
  const [expandedRow, setExpandedRow] = useState(null);

  // Guardar estado del sidebar en localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Datos de ejemplo para el historial de ingresos
  const historialIngresos = [
    {
      id: 1,
      fecha: "12/03/2025",
      producto: "Chorizo Santarrosano",
      cantidad: 20,
      usuarioResponsable: "Estefania Nieto",
      codigoIngreso: 1,
      stock: 120,
      porcentajeVenta: "10%",
      codigoFacturaProveedor: "FM00056",
      costoTotal: "$230,000",
      costoUnitario: "$3,600",
      fechaVencimiento: "2025/12/31",
    },
    {
      id: 2,
      fecha: "12/03/2025",
      producto: "Chorizo Santarrosano",
      cantidad: 20,
      usuarioResponsable: "Estefania Nieto",
      codigoIngreso: 2,
      stock: 120,
      porcentajeVenta: "10%",
      codigoFacturaProveedor: "FM00056",
      costoTotal: "$230,000",
      costoUnitario: "$3,600",
      fechaVencimiento: "2025/12/31",
    },
    {
      id: 3,
      fecha: "12/03/2025",
      producto: "Chorizo Santarrosano",
      cantidad: 20,
      usuarioResponsable: "Estefania Nieto",
      codigoIngreso: 3,
      stock: 120,
      porcentajeVenta: "10%",
      codigoFacturaProveedor: "FM00056",
      costoTotal: "$230,000",
      costoUnitario: "$3,600",
      fechaVencimiento: "2025/12/31",
    },
    {
      id: 4,
      fecha: "12/03/2025",
      producto: "Chorizo Santarrosano",
      cantidad: 20,
      usuarioResponsable: "Estefania Nieto",
      codigoIngreso: 4,
      stock: 120,
      porcentajeVenta: "10%",
      codigoFacturaProveedor: "FM00056",
      costoTotal: "$230,000",
      costoUnitario: "$3,600",
      fechaVencimiento: "2025/12/31",
    },
  ];

  // Lista de usuarios responsables
  const usuarios = [
    "Estefania Nieto",
    "Carlos Gómez",
    "Luis Pérez",
    "María Rodríguez",
  ];

  const handleSearch = () => {
    console.log("Buscando producto:", searchTerm);
    console.log("Filtros:", { fechaDesde, fechaHasta, usuarioResponsable });
    // Aquí iría la lógica para buscar ingresos con los filtros aplicados
  };

  const toggleDetalles = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  const navigateToIngresoStock = () => {
    navigate("/ingreso-stock");
  };

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-auto md:fixed md:top-0 md:left-0 md:h-full z-10">
        <div className="block md:hidden">
          <Sidebar />
        </div>
        <div className="hidden md:block">
          <Sidebar />
        </div>
      </div>
      
      <div className="bg-slate-50 flex-1 pl-8 md:pl-20 w-full lg:pl-[60px] px-3 sm:px-4 md:px-6 lg:px-8 ml-6 pl-4">
        <Tipografia>
          <div className="mt-4 mb-5">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 ml-5">Historial Ingresos</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-md border-l-2 border-orange-600 mb-4 ml-3">
            <div className="p-3 flex flex-col sm:flex-row justify-between items-center">
              <div>
                <div className="flex items-center mt-1">
                  <span className="bg-orange-200 text-orange-800 text-xs font-medium px-3 py-0.5 rounded-full mr-3">
                    {historialIngresos.length} Registros
                  </span>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 flex w-full sm:w-auto justify-center sm:justify-end">
                <Botones
                  tipo="primario"
                  label="Nuevo Ingreso"
                  onClick={navigateToIngresoStock}
                  className="mr-2 w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producto
                </label>
                <Buscador
                  placeholder="Buscar por nombre"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario Responsable
                </label>
                <select
                  value={usuarioResponsable}
                  onChange={(e) => setUsuarioResponsable(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="">Todos</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario} value={usuario}>
                      {usuario}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-1 flex items-end">
                <Botones
                  label="Aplicar Filtros"
                  tipo="secundario"
                  onClick={handleSearch}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="border-b pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h3 className="font-medium text-orange-600 mb-2 sm:mb-0">
                Detalles del ingreso
                <span className="ml-2 text-sm font-normal text-gray-700">
                  Mostrando {historialIngresos.length} registros
                </span>
              </h3>
            </div>
            
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detalle
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historialIngresos.map((ingreso) => (
                      <React.Fragment key={ingreso.id}>
                        <tr className={`hover:bg-gray-50 ${expandedRow === ingreso.id ? "bg-orange-50" : ""}`}>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                            {ingreso.fecha}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-[120px] sm:max-w-xs">
                            {ingreso.producto}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                            {ingreso.cantidad}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-[120px] sm:max-w-xs">
                            {ingreso.usuarioResponsable}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            <button
                              onClick={() => toggleDetalles(ingreso.id)}
                              className="bg-orange-500 hover:bg-orange-600 text-white rounded px-3 py-1 text-xs inline-flex items-center justify-center"
                            >
                              <Icono
                                name={expandedRow === ingreso.id ? "eliminarAlert" : "despliegue"}
                                size={14}
                                className="mr-1"
                                customColor="white"
                              />
                              {expandedRow === ingreso.id ? "Ocultar" : "Ver"}
                            </button>
                          </td>
                        </tr>
                        {expandedRow === ingreso.id && (
                          <tr className="bg-orange-50">
                            <td colSpan="5" className="px-3 sm:px-6 py-4">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-white p-3 rounded shadow-sm">
                                  <div className="font-bold text-orange-600 mb-2">Datos de ingreso</div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-gray-600">Código:</div>
                                    <div className="font-medium">{ingreso.codigoIngreso}</div>
                                    <div className="text-gray-600">Factura:</div>
                                    <div className="font-medium">{ingreso.codigoFacturaProveedor}</div>
                                    <div className="text-gray-600">Vencimiento:</div>
                                    <div className="font-medium">{ingreso.fechaVencimiento}</div>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded shadow-sm">
                                  <div className="font-bold text-orange-600 mb-2">Datos de costo</div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-gray-600">Stock:</div>
                                    <div className="font-medium">{ingreso.stock}</div>
                                    <div className="text-gray-600">Total:</div>
                                    <div className="font-medium">{ingreso.costoTotal}</div>
                                    <div className="text-gray-600">Unitario:</div>
                                    <div className="font-medium">{ingreso.costoUnitario}</div>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded shadow-sm">
                                  <div className="font-bold text-orange-600 mb-2">Datos de venta</div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-gray-600">% Venta:</div>
                                    <div className="font-medium">{ingreso.porcentajeVenta}</div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between mt-4">
              <div className="text-sm text-gray-700 mb-2 sm:mb-0 text-center sm:text-left">
                <p>
                  Mostrando <span className="font-medium">1</span> a{" "}
                  <span className="font-medium">
                    {historialIngresos.length}
                  </span>{" "}
                  de{" "}
                  <span className="font-medium">
                    {historialIngresos.length}
                  </span>{" "}
                  resultados
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Siguiente
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </Tipografia>
      </div>
      
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
};

export default HistorialIngresos;