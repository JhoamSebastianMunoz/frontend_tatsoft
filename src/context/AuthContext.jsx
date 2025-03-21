import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService, userService } from './services/ApiService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!token;

  // Verificar token al iniciar la aplicación
  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          const response = await userService.getUserProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Error validando token:', error);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    checkToken();
  }, [token]);

  const login = async (cedula, password) => {
    try {
      console.log('Intentando login con cedula:', cedula);
      const response = await authService.login(cedula, password);
      
      console.log('Respuesta de login:', response);
      
      if (response.data && response.data.token) {
        const { token } = response.data;
        
        // Guardar token en localStorage
        localStorage.setItem('token', token);
        setToken(token);
        
        // Obtener datos del usuario
        try {
          const userResponse = await userService.getUserProfile();
          setUser(userResponse.data);
          return true;
        } catch (userError) {
          console.error('Error obteniendo perfil de usuario:', userError);
          return false;
        }
      } else {
        console.error('Formato de respuesta inesperado:', response.data);
        return false;
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      
      // Mostrar detalles específicos del error
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
        console.error('Código de estado:', error.response.status);
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor');
      } else {
        console.error('Error configurando la solicitud:', error.message);
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const requestPasswordReset = async (email) => {
    try {
      await authService.requestPasswordReset(email);
      return true;
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      return false;
    }
  };

  const validateResetCode = async (email, code) => {
    try {
      await authService.validateResetCode(email, code);
      return true;
    } catch (error) {
      console.error('Error validando código:', error);
      return false;
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
      await authService.resetPassword(email, newPassword);
      return true;
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      return false;
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
    requestPasswordReset,
    validateResetCode,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};