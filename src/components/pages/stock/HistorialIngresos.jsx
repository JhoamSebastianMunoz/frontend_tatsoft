import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tipografia from "../../atoms/Tipografia";
import Icono from "../../atoms/Iconos";
import Botones from "../../atoms/Botones";
import Buscador from "../../molecules/Buscador";
import SidebarAdm from "../../organisms/SidebarAdm";
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
      fechaVencimiento: "2025/12/31"
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
      fechaVencimiento: "2025/12/31"
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
      fechaVencimiento: "2025/12/31"
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
      fechaVencimiento: "2025/12/31"
    }
  ];
  
  // Lista de usuarios responsables
  const usuarios = [
    "Estefania Nieto",
    "Carlos Gómez",
    "Luis Pérez",
    "María Rodríguez"
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar usando el componente del organism */}
      <SidebarAdm activeMenuItem="inventario" />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-purple-600 text-white p-4 flex items-center justify-between">
          <Tipografia variant="h1" size="xl" className="font-medium">
            Historial de Ingresos
          </Tipografia>
        </header>

        {/* Contenido del historial */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-md p-6 mx-auto max-w-5xl">
            {/* Buscador y filtros */}
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
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
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Tipografia size="sm" className="mb-1">Desde:</Tipografia>
                  <div className="relative">
                    <input
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      className="w-full p-2 border rounded pr-8 bg-purple-50 border-purple-300"
                    />
                  </div>
                </div>
                <div>
                  <Tipografia size="sm" className="mb-1">Hasta:</Tipografia>
                  <div className="relative">
                    <input
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      className="w-full p-2 border rounded pr-8 bg-purple-50 border-purple-300"
                    />
                  </div>
                </div>
                <div>
                  <Tipografia size="sm" className="mb-1">Usuario responsable:</Tipografia>
                  <select
                    value={usuarioResponsable}
                    onChange={(e) => setUsuarioResponsable(e.target.value)}
                    className="w-full p-2 border rounded bg-purple-50 border-purple-300"
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
              <Tipografia variant="h2" size="lg" className="mb-3 text-purple-800">Detalles del ingreso</Tipografia>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-purple-100">
                    <tr className="text-left">
                      <th className="py-2 px-4 font-medium text-purple-800">Fecha</th>
                      <th className="py-2 px-4 font-medium text-purple-800">Producto</th>
                      <th className="py-2 px-4 font-medium text-purple-800">Cantidad</th>
                      <th className="py-2 px-4 font-medium text-purple-800">Usuario responsable</th>
                      <th className="py-2 px-4 font-medium text-purple-800">Ver más detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialIngresos.map((ingreso) => (
                      <React.Fragment key={ingreso.id}>
                        <tr className={`border-b ${expandedRow === ingreso.id ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                          <td className="py-3 px-4">{ingreso.fecha}</td>
                          <td className="py-3 px-4">{ingreso.producto}</td>
                          <td className="py-3 px-4">{ingreso.cantidad}</td>
                          <td className="py-3 px-4">{ingreso.usuarioResponsable}</td>
                          <td className="py-3 px-4">
                            <button 
                              onClick={() => toggleDetalles(ingreso.id)}
                              className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
                            >
                              <span className="text-xl">{expandedRow === ingreso.id ? '−' : '>'}</span>
                            </button>
                          </td>
                        </tr>
                        
                        {expandedRow === ingreso.id && (
                          <tr className="bg-purple-50">
                            <td colSpan="5" className="p-4">
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="font-medium text-purple-800">Código de ingreso: {ingreso.codigoIngreso}</p>
                                  <p className="font-medium text-purple-800">Código factura proveedor: {ingreso.codigoFacturaProveedor}</p>
                                  <p className="font-medium text-purple-800">Fecha de vencimiento: {ingreso.fechaVencimiento}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-purple-800">Stock: {ingreso.stock}</p>
                                  <p className="font-medium text-purple-800">Costo total: {ingreso.costoTotal}</p>
                                  <p className="font-medium text-purple-800">Costo unitario: {ingreso.costoUnitario}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-purple-800">Porcentaje venta: {ingreso.porcentajeVenta}</p>
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
            
            {/* Botón para nuevo ingreso */}
            <div className="flex justify-end mt-6">
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