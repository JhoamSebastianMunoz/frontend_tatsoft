import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Páginas de autenticación
import Login from "./components/pages/loginPage/Login";
import RecuperarPassword from "./components/pages/loginPage/RecuperarPassword";
import CodigoVerificacion from "./components/pages/loginPage/CodigoVerification";
import Restablecer from "./components/pages/loginPage/Restablecer";

// Páginas de administrador
import VerUsuario from "./components/pages/administrator/VerUsuarioAdm";
import EditarUsuario from "./components/pages/administrator/EditarUsuario";
import RegistroUsuario from "./components/pages/administrator/RegistroUsuario";
import GestionUsuarios from "./components/pages/administrator/GestionUsuarios";

// Páginas de zonas
import Zonas from "./components/pages/gestionZonas/Zonas";
import GestionZonas from "./components/pages/gestionZonas/GestionZonas";
import EditarZona from "./components/pages/gestionZonas/EditarZona";
import RegistrarZona from "./components/pages/gestionZonas/RegistraZona";
import ColaboradoresZona from "./components/pages/gestionZonas/ColaboradoresZona";
import EditarColaboradorZona from "./components/pages/gestionZonas/EditarColaboradorZona";
import AsignacionZonas from "./components/pages/gestionZonas/AsiganacionZonas";

// Páginas de productos
import RegistrarProducto from "./components/pages/gestionProductos/RegistrarProducto";
import ProductList from "./components/pages/gestionProductos/ProductList";
import GestionProductos from "./components/pages/gestionProductos/GestionProductos";
import EditarProducto from "./components/pages/gestionProductos/EditarProducto"

// Páginas de colaborador
import Profile from "./components/pages/collaborator/profile";

// Componente para rutas no autorizadas
import Unauthorized from "./components/pages/Unauthorized/Unauthorized";
import Loading from "./components/Loading/Loading";

// Componente de rutas protegidas
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Verificando credenciales..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return element;
};

const App = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />
      <Route path="/codigo-verificacion" element={<CodigoVerificacion />} />
      <Route path="/restablecer" element={<Restablecer />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Rutas de perfil */}
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute 
            element={<Profile />} 
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]} 
          />
        } 
      />
      
      {/* Rutas de administrador - Gestión de usuarios */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute 
            element={<GestionUsuarios />} 
            allowedRoles={["ADMINISTRADOR"]} 
          />
        } 
      />
      <Route 
        path="/ver/usuario/:id" 
        element={
          <ProtectedRoute 
            element={<VerUsuario />} 
            allowedRoles={["ADMINISTRADOR"]} 
          />
        } 
      />
      <Route 
        path="/editar/usuario/:id" 
        element={
          <ProtectedRoute 
            element={<EditarUsuario />} 
            allowedRoles={["ADMINISTRADOR"]} 
          />
        } 
      />
      <Route 
        path="/registrar/usuario" 
        element={
          <ProtectedRoute 
            element={<RegistroUsuario />} 
            allowedRoles={["ADMINISTRADOR"]} 
          />
        } 
      />
      
      {/* Rutas de gestión de zonas */}
      <Route 
        path="/zonas" 
        element={
          <ProtectedRoute 
            element={<Zonas />} 
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]} 
          />
        } 
      />
      <Route 
        path="/gestion-zonas" 
        element={
          <ProtectedRoute 
            element={<GestionZonas />} 
            allowedRoles={["ADMINISTRADOR"]} 
          />
        } 
      />
      <Route 
        path="/registrar-zona" 
        element={
          <ProtectedRoute 
            element={<RegistrarZona />} 
            allowedRoles={["ADMINISTRADOR"]} 
          />
        } 
      />
      <Route 
        path="/editar-zona/:id" 
        element={
          <ProtectedRoute 
            element={<EditarZona />} 
            allowedRoles={["ADMINISTRADOR"]} 
          />
        } 
      />
      
      {/* Nuevas rutas de gestión de zonas y colaboradores */}
      <Route 
        path="/gestion-zonas/colaboradores/:id" 
        element={
          <ProtectedRoute 
            element={<ColaboradoresZona />} 
            allowedRoles={["ADMINISTRADOR"]} 
          />
        } 
      />
      <Route 
        path="/gestion-zonas/editar-colaboradores/:id" 
        element={
          <ProtectedRoute 
            element={<EditarColaboradorZona />} 
            allowedRoles={["ADMINISTRADOR"]} 
          />
        } 
      />
      <Route 
        path="/gestion-zonas/asignar/:id" 
        element={
          <ProtectedRoute 
            element={<AsignacionZonas />} 
            allowedRoles={["ADMINISTRADOR"]} 
          />
        } 
      />
      
      {/* Rutas de productos */}
      <Route 
        path="/productos" 
        element={
          <ProtectedRoute 
            element={<ProductList />} 
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]} 
          />
        } 
      />
      
      <Route path="/gestion-productos" element={<GestionProductos />} />
      <Route path="/gestion-productos/registrar" element={<RegistrarProducto />} />
      <Route path="/editar-producto/:id" element={<EditarProducto />} />
      
      {/* Ruta por defecto - Redirige al login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;


// import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import "../src/index.css";
// import Profile from "./pages/collaborator/profile";
// import Zonas from './pages/GestionZonas/Zonas'
// import GestionZonas from './pages/GestionZonas/GestionZonas';
// import EditarZona from './pages/GestionZonas/EditarZona'
// import RegistrarZona from './pages/GestionZonas/RegistraZona'
// import AsignacionZonas from './pages/GestionZonas/AsiganacionZonas'
// import ColaboradoresZona from './pages/GestionZonas/ColaboradoresZona'
// import EditarColaboradorZona from "./pages/GestionZonas/EditarColaboradorZona";
// import RegisterProductForm from './pages/RegisterProductForm/RegisterProductForm';
// import ProductList from './pages/ProductList/ProductList';
// import Login from "./pages/LoginPage/Login";
// import RecuperarPassword from "./pages/LoginPage/RecuperarPassword";
// import CodigoVerificacion from "./pages/LoginPage/CodigoVerification";
// import Restablecer from "./pages/LoginPage/Restablecer";
// import AlertaRestablecer from "./pages/LoginPage/AlertaRestablecer";
// import NavegacionAdministrador from "./components/organisms/NavegacionAdm";
// import NavegacionUsuario from "./components/organisms/NavegacionUsuario";
// import VerUsuario from "./pages/administrator/VerUsuarioAdm";
// import EditarUsuario from "./pages/administrator/EditarUsuario";
// import AlertaInhabilitar from "./pages/administrator/AlertaInhabilitar";
// import AlertaEdicion from "./pages/administrator/AlertaEdicion";
// import RegistroUsuario from "./pages/administrator/RegistroUsuario";

{/* <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />
      <Route path="/codigo-verificacion" element={< CodigoVerificacion/>} />
      <Route path="/restablecer" element={<Restablecer/>}/>
      <Route path="/restablecer" element={<Restablecer />} />
      <Route path="/alerta-restablecer" element={<AlertaRestablecer />} /> 
      <Route path="/perfil-colaborador" element={<Profile />} />
      <Route path="/ver/usuario" element={<VerUsuario />} />
      <Route path="/editar/usuario" element={<EditarUsuario />} />
      <Route path="/inhabilitar-usuario" element={<AlertaInhabilitar/>}/>
      <Route path="/guardar-cambios" element={<AlertaEdicion/>}/>
      <Route path="/zonas" element={<Zonas />} />
      <Route path="/gestion-zonas" element={<GestionZonas />} />
      <Route path="/registrar-zona" element={<RegistrarZona />} />
      <Route path="/editar-zona" element={<EditarZona />} />
      <Route path="/gestion-zonas/asignar" element={<AsignacionZonas />} />
      <Route path="/gestion-zonas/colaboradores" element={<ColaboradoresZona />} />
      <Route path="/gestion-zonas/editar-colaboradores" element={<EditarColaboradorZona />} />
    </Routes>
    </Router> */}