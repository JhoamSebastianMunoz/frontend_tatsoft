import React from "react";
import Tipografia from "../../atoms/Tipografia";
import Sidebar from "../../organisms/Sidebar";
import { useNavigate } from "react-router-dom";

const VerCliente = () => {
  const navigate = useNavigate();
  const clienteData = {
    RazonSocial: "La Mejor de todas las tiendas",
    nombre: "Valentina",
    apellido: "Martinez",
    celular: "3116957990",
    cedula: "1097731655",
    direccion: "la fachada mz 30 casa 15",
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      
      <main className="w-full md:pl-[100px] pt-[40px] pl-[80px] md:pt-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado con título y razón social */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="text-center">
              <span className="text-orange-500 text-lg">
                {clienteData.RazonSocial}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Detalles del Cliente
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Información Básica */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-orange-600 text-lg font-medium mb-4">
                Información Básica
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="block text-sm text-gray-600 mb-1">Cédula</span>
                  <span className="block text-gray-900">{clienteData.cedula}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-600 mb-1">Razón Social</span>
                  <span className="block text-gray-900">{clienteData.RazonSocial}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-600 mb-1">Nombre</span>
                  <span className="block text-gray-900">{clienteData.nombre}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-600 mb-1">Apellido</span>
                  <span className="block text-gray-900">{clienteData.apellido}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-600 mb-1">RUT o NIT</span>
                  <span className="block text-gray-900">{clienteData.cedula}</span>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-orange-600 text-lg font-medium mb-4">
                Información de Contacto
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="block text-sm text-gray-600 mb-1">Dirección</span>
                  <span className="block text-gray-900">{clienteData.direccion}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-600 mb-1">Celular</span>
                  <span className="block text-gray-900">{clienteData.celular}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botón Editar */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/editar/cliente')}
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Editar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerCliente;