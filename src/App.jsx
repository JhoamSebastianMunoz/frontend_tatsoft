//test 
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../src/index.css";
import Profile from "./pages/collaborator/profile";
import Zonas from "./pages/GestionZonas/Zonas";
import GestionZonas from "./pages/GestionZonas/GestionZonas";
import EditarZona from "./pages/GestionZonas/EditarZona";
import RegistrarZona from "./pages/GestionZonas/RegistraZona";
import RegisterProductForm from "./pages/RegisterProductForm/RegisterProductForm";
import ProductList from "./pages/ProductList/ProductList";
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
import GestionUsuarios from "./pages/administrator/GestionUsuarios";
import GestionClientes from "./pages/customers/GestionClientes";
import VerCliente from "./pages/customers/VerCliente";
import Pagina404 from "./pages/alert/page404";
import EditarCliente from "./pages/customers/EditarCliente";
import RegistroCliente from "./pages/customers/RegistroCliente";
import SidebarAdm from "./components/molecules/SidebarAdm";

const App = () => {
  const [view, setView] = useState("register"); // 'register' o 'list'

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/codigo-verificacion" element={<CodigoVerificacion />} />
        <Route path="/restablecer" element={<Restablecer />} />
        <Route path="/alerta/restablecer" element={<AlertaRestablecer />} />
        <Route path="/perfil/colaborador" element={<Profile />} />
        <Route path="/ver/usuario" element={<VerUsuario />} />
        <Route path="/editar/usuario" element={<EditarUsuario />} />
        <Route path="/inhabilitar" element={<AlertaInhabilitar />} />
        <Route path="/registro/usuario" element={<RegistroUsuario/>}/>
        <Route path="/guardar/cambios" element={<AlertaEdicion />} />
        <Route path="/zonas" element={<Zonas />} />
        <Route path="/gestion/usuarios" element={<GestionUsuarios/>}/>
        <Route path="/gestion/zonas" element={<GestionZonas />} />
        <Route path="/registrar-zona" element={<RegistrarZona />} />
        <Route path="/editar/zona" element={<EditarZona />} />
        <Route path="/gestion/clientes" element={<GestionClientes/>}/>
        <Route path="/ver/cliente" element={<VerCliente/>}/>
        <Route path="/editar/cliente" element={<EditarCliente/>}/>
        <Route path="registro/cliente" element={<RegistroCliente/>}/>
        <Route path="admi" element={<SidebarAdm/>}/>
        <Route path="*" element={<Pagina404/>}/>
      </Routes>
    </Router>
  );
};

export default App;
