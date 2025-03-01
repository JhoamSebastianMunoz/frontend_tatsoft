import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../src/index.css";
import Profile from "./pages/collaborator/profile";
import Zonas from './pages/GestionZonas/Zonas'
import GestionZonas from './pages/GestionZonas/GestionZonas';
import EditarZona from './pages/GestionZonas/EditarZona'
import RegistrarZona from './pages/GestionZonas/RegistraZona'
import AsignacionZonas from './pages/GestionZonas/AsiganacionZonas'
import ColaboradoresZona from './pages/GestionZonas/ColaboradoresZona'
import EditarColaboradorZona from "./pages/GestionZonas/EditarColaboradorZona";
import RegisterProductForm from './pages/RegisterProductForm/RegisterProductForm';
import ProductList from './pages/ProductList/ProductList';
import Login from "./pages/LoginPage/Login";
import RecuperarPassword from "./pages/LoginPage/RecuperarPassword";
import CodigoVerificacion from "./pages/LoginPage/CodigoVerification";
import Restablecer from "./pages/LoginPage/Restablecer";
import AlertaRestablecer from "./pages/LoginPage/AlertaRestablecer";
import NavegacionAdministrador from "./components/organisms/NavegacionAdm";
import NavegacionUsuario from "./components/organisms/NavegacionUsuario";
import VerUsuario from "./pages/administrator/VerUsuarioAdm";
import EditarUsuario from "./pages/administrator/EditarUsuario";
import AlertaInhabilitar from "./pages/administrator/AlertaInhabilitar";
import AlertaEdicion from "./pages/administrator/AlertaEdicion";
import RegistroUsuario from "./pages/administrator/RegistroUsuario";

const App = () => {
  const [view, setView] = useState("register"); // 'register' o 'list'

  return (
<Router>
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
    </Router>
  );
};

export default App;