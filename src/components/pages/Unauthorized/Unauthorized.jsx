import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Tipografia from '../../atoms/Tipografia';
import Botones from '../../atoms/Botones';
import Icono from '../../atoms/Iconos';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleBack = () => {
    // Si el usuario está autenticado, redirigir al perfil
    if (user) {
      navigate('/perfil');
    } else {
      // Si no está autenticado, redirigir al login
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <Icono name="cancelar" size={60} customColor="#F48783" className="mx-auto mb-4" />
        
        <Tipografia size="2xl" className="text-red-600 font-bold mb-2">
          Acceso No Autorizado
        </Tipografia>
        
        <Tipografia className="text-gray-600 mb-6">
          No tienes permisos para acceder a esta página. Si crees que es un error, contacta al administrador del sistema.
        </Tipografia>
        
        <div className="flex flex-col gap-3">
          <Botones
            label="Volver"
            tipo="primario"
            onClick={handleBack}
            className="w-full"
          />
          
          {user && (
            <Botones
              label="Cerrar Sesión"
              tipo="cancelar"
              onClick={logout}
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
