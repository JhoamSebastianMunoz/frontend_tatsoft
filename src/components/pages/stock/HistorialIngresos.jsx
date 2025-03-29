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

  // Estados para la búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaDesde, setFechaDesde] = useState("12/03/2025");
  const [fechaHasta, setFechaHasta] = useState("12/03/2025");
  const [usuarioResponsable, setUsuarioResponsable] = useState("");

  // Estado para el detalle expandido
  const [expandedRow, setExpandedRow] = useState(null);

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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar - móvil: posición absoluta o fixed para que no desplace el contenido */}
      <div className="absolute md:relative md:block z-10">
        <Sidebar />
      </div>
  
      {/* Contenido principal - sin padding left en móvil */}
      <div className="flex-1 w-full md:ml-16">
        <div className="text-black pt-6 mb-1 pl-12 sm:pl-10 md:pl-8">
          <Tipografia
            variant="h1"
            size="2xl"
            className="text-black font-medium text-center md:text-left"
          >
            Historial Ingresos
          </Tipografia>
        </div>
  
        {/* Contenido del historial */}
        <div className="pt-4 md:p-6 pl-16 md:pl-8">
          <div className="bg-white rounded-lg shadow-md p-3 md:p-6">
            {/* Buscador y filtros */}
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Buscador
                    type="text"
                    placeholder="Buscar Producto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-4 pr-10 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                  />
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Tipografia size="sm" className="mb-1">
                    Desde:
                  </Tipografia>
                  <div className="relative">
                    <input
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      className="w-full p-2 border rounded pr-8 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <Tipografia size="sm" className="mb-1">
                    Hasta:
                  </Tipografia>
                  <div className="relative">
                    <input
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      className="w-full p-2 border rounded pr-8 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <Tipografia size="sm" className="mb-1">
                    Usuario responsable:
                  </Tipografia>
                  <select
                    value={usuarioResponsable}
                    onChange={(e) => setUsuarioResponsable(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                  >
                    <option value="">Seleccionar usuario</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario} value={usuario}>
                        {usuario}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
  
            {/* Tabla de ingresos */}
            <div>
              <Tipografia
                variant="h2"
                size="lg"
                className="mb-3 text-orange-500"
              >
                Detalles del ingreso
              </Tipografia>
  
              {/* Contenedor con scroll horizontal para tablas en móvil */}
              <div className="overflow-x-auto pb-2 -mx-3 md:mx-0 pr-2">
                <div className="min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-orange-50">
                        <tr className="text-left">
                          <th className="py-2 px-4 font-medium text-orange-800 whitespace-nowrap">
                            Fecha
                          </th>
                          <th className="py-2 px-4 font-medium text-orange-800 whitespace-nowrap">
                            Producto
                          </th>
                          <th className="py-2 px-4 font-medium text-orange-800 whitespace-nowrap">
                            Cantidad
                          </th>
                          <th className="py-2 px-4 font-medium text-orange-800 whitespace-nowrap">
                            Usuario responsable
                          </th>
                          <th className="py-2 px-4 font-medium text-orange-800 whitespace-nowrap">
                            Ver más detalle
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {historialIngresos.map((ingreso) => (
                          <React.Fragment key={ingreso.id}>
                            <tr
                              className={`border-b ${
                                expandedRow === ingreso.id
                                  ? "bg-orange-50"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <td className="py-3 px-4 whitespace-nowrap">{ingreso.fecha}</td>
                              <td className="py-3 px-4 whitespace-nowrap">{ingreso.producto}</td>
                              <td className="py-3 px-4 whitespace-nowrap">{ingreso.cantidad}</td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                {ingreso.usuarioResponsable}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <button
                                  onClick={() => toggleDetalles(ingreso.id)}
                                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-3 py-1 flex items-center justify-center transition-colors duration-200"
                                >
                                 <Icono 
                                    name={expandedRow === ingreso.id ? "eliminarAlert" : "despliegue"} 
                                    size={18} 
                                    className="mr-1"
                                    customColor="white"
                                  />
                                  <Tipografia size="sm" className="text-white hidden md:inline">
                                    {expandedRow === ingreso.id ? "Cerrar" : "Ver"}
                                  </Tipografia>
                                </button>
                              </td>
                            </tr>
  
                            {expandedRow === ingreso.id && (
                              <tr className="bg-orange-50">
                                <td colSpan="5" className="p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="mb-2 md:mb-0">
                                      <p className="font-medium text-orange-800">
                                        Código de ingreso: {ingreso.codigoIngreso}
                                      </p>
                                      <p className="font-medium text-orange-800">
                                        Código factura proveedor:{" "}
                                        {ingreso.codigoFacturaProveedor}
                                      </p>
                                      <p className="font-medium text-orange-800">
                                        Fecha de vencimiento:{" "}
                                        {ingreso.fechaVencimiento}
                                      </p>
                                    </div>
                                    <div className="mb-2 md:mb-0">
                                      <p className="font-medium text-orange-800">
                                        Stock: {ingreso.stock}
                                      </p>
                                      <p className="font-medium text-orange-800">
                                        Costo total: {ingreso.costoTotal}
                                      </p>
                                      <p className="font-medium text-orange-800">
                                        Costo unitario: {ingreso.costoUnitario}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-orange-800">
                                        Porcentaje venta: {ingreso.porcentajeVenta}
                                      </p>
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
              </div>
            </div>
  
            {/* Botón para nuevo ingreso */}
            <div className="flex justify-center md:justify-end mt-6">
              <Botones
                label="Nuevo Ingreso"
                tipo="primario"
                onClick={navigateToIngresoStock}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialIngresos;
