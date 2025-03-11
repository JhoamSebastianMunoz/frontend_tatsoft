import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importar useNavigate y useLocation
import Tipografia from "../atoms/Tipografia";
import Botones from "../atoms/Botones";

const Card = ({ nombre, celular, Rol }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [habilitado, setHabilitado] = useState(true);
  const navigate = useNavigate(); 
  const location = useLocation(); 
  
  const isGestionUsuarios = location.pathname === "/gestion/usuarios" || 
                            location.pathname === "/gestion" || 
                            location.pathname.includes("/gestion");
  
  const handleEditarUsuario = () => {
    const rutaOrigen = isGestionUsuarios ? '/gestion/usuarios' : '/ver/usuario';
    localStorage.setItem('rutaOrigenEdicion', rutaOrigen);
    console.log(`Ruta de origen guardada en localStorage: ${rutaOrigen}`);
    navigate(`/editar/usuario?origen=${isGestionUsuarios ? 'gestion' : 'ver'}`);
  };

  return (
    <Tipografia>
      <div className="m-1 w-full min-w-[280px] max-w-[380px] bg-white border border-gray-200 rounded-lg shadow-sm relative">
        <div className="bg-purple-100 rounded-t-lg p-3 flex justify-between items-center">
          <div
            className="w-14 h-3 rounded-md transition-colors duration-200"
            style={{ backgroundColor: habilitado ? "#4CAF50" : "#E53935" }}
          ></div>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-purple-600 hover:text-purple-900"
            >
              <svg className="w-6 h-2" fill="currentColor" viewBox="0 0 16 3">
                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
              </svg>
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <ul className="py-1 text-sm text-gray-600">
                  <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={()=>navigate("/ver/usuario")}
                  >
                    Ver
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setHabilitado(false);
                      setIsOpen(false);
                    }}
                  >
                    Inhabilitar
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-black font-bold">Nombre:</span>
            <span className="text-sm text-black">{nombre}</span>
            <span className="text-sm text-black font-bold">Celular:</span>
            <span className="text-sm text-black">{celular}</span>
            <span className="text-sm text-black font-bold">Rol:</span>
            <span className="text-sm text-black">{Rol}</span>
          </div>
          <div className="flex justify-end mt-3">
            <Botones
              label="Editar"
              tipo="secundario"
              onClick={handleEditarUsuario} 
            />
          </div>
        </div>
      </div>
    </Tipografia>
  );
};

export default Card;