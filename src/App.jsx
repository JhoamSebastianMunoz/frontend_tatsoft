import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";


// página de perfil
import EditarPerfil from "./components/pages/collaborator/editarPerfil";

// Páginas de autenticación
import Login from "./components/pages/loginPage/Login";
import RecuperarPassword from "./components/pages/loginPage/RecuperarPassword";
import CodigoVerificacion from "./components/pages/loginPage/CodigoVerification";
import Restablecer from "./components/pages/loginPage/Restablecer";

// Páginas de administrador
import VerUsuarioAdm from "./components/pages/administrator/VerUsuarioAdm";
import EditarUsuario from "./components/pages/administrator/EditarUsuario";
import RegistroUsuario from "./components/pages/administrator/RegistroUsuario";
import GestionUsuarios from "./components/pages/administrator/GestionUsuarios";
import ListaSolicitudes from "./components/pages/administrator/ListaSolicitudes";
import DetalleSolicitud from "./components/pages/administrator/DetalleSolicitud";

// Páginas de zonas
import Zonas from "./components/pages/gestionZonas/Zonas";
import GestionZonas from "./components/pages/gestionZonas/GestionZonas";
import EditarZona from "./components/pages/gestionZonas/EditarZona";
import RegistrarZona from "./components/pages/gestionZonas/RegistraZona";
import ColaboradoresZona from "./components/pages/gestionZonas/ColaboradoresZona";
import EditarColaboradorZona from "./components/pages/gestionZonas/EditarColaboradorZona";
import AsignacionZonas from "./components/pages/gestionZonas/AsiganacionZonas";

// Páginas de clientes
import EditarCliente from "./components/pages/customers/EditarCliente";
import GestionClientes from "./components/pages/customers/GestionClientes";
import RegistroCliente from "./components/pages/customers/RegistroCliente";
import VerCliente from "./components/pages/customers/VerCliente";

// Páginas de productos
import RegistrarProducto from "./components/pages/gestionProductos/RegistrarProducto";
import ProductList from "./components/pages/gestionProductos/ProductList";
import GestionProductos from "./components/pages/gestionProductos/GestionProductos";
import EditarProducto from "./components/pages/gestionProductos/EditarProducto";
import GestionCategorias from "./components/pages/gestionProductos/GestionCategorias";

// Páginas de inventario
import IngresoStock from "./components/pages/stock/IngresoStock";
import HistorialIngresos from "./components/pages/stock/HistorialIngresos";

// Páginas de preventa
import NuevaPreventa from "./components/pages/preventa/NuevaPreventa";
import HistorialPreventas from "./components/pages/preventa/HistorialPreventas";
import DetallesPreventa from "./components/pages/preventa/DetallesPreventa";
import ConfirmarPreventa from "./components/pages/preventa/ConfirmarPreventa";
import Preventa from "./components/pages/preventa/preventas";

// Páginas de ventas
import HistorialVentas from "./components/pages/ventas/HistorialVentas";
import DetallesVenta from "./components/pages/ventas/DetallesVenta";

// Páginas de devoluciones
import HistorialDevoluciones from "./components/pages/devoluciones/HistorialDevoluciones";
import DetallesDevolucion from "./components/pages/devoluciones/detalleDevoluciones";
import ComparativaVentasDevoluciones from "./components/pages/devoluciones/ComparativaVentasDevoluciones";
import ResumenDevoluciones from "./components/pages/devoluciones/ResumenDevoluciones";

// Páginas de acumulados
import Acumulados from "./components/pages/Acumulado/Acumulados";

// Páginas de colaborador
import Profile from "./components/pages/collaborator/profile";

// Componente para rutas no autorizadas y errores
import Unauthorized from "./components/pages/Unauthorized/Unauthorized";
import Loading from "./components/Loading/Loading";
import Pagina404 from "./components/pages/alert/page404";

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

      <Route
      path="editar/perfil"
      element={
        <ProtectedRoute
        element={<EditarPerfil />}
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
        path="/gestion/usuarios"
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
            element={<VerUsuarioAdm />}
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
      
      {/* Rutas de solicitudes */}
      <Route
        path="/solicitudes"
        element={
          <ProtectedRoute
            element={<ListaSolicitudes />}
            allowedRoles={["ADMINISTRADOR"]}
          />
        }
      />
      <Route
        path="/solicitudes/detalle/:id"
        element={
          <ProtectedRoute
            element={<DetalleSolicitud />}
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
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
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
            allowedRoles={["COLABORADOR"]}
          />
        }
      />
      <Route
        path="/gestion-productos"
        element={
          <ProtectedRoute
            element={<GestionProductos />}
            allowedRoles={["ADMINISTRADOR","COLABORADOR"]}
          />
        }
      />
      <Route
        path="/registrar-producto"
        element={
          <ProtectedRoute
            element={<RegistrarProducto />}
            allowedRoles={["ADMINISTRADOR"]}
          />
        }
      />
      <Route
        path="/editar-producto/:id"
        element={
          <ProtectedRoute
            element={<EditarProducto />}
            allowedRoles={["ADMINISTRADOR"]}
          />
        }
      />

      <Route
        path="/gestionar-categorias"
        element={
          <ProtectedRoute
            element={<GestionCategorias />}
            allowedRoles={["ADMINISTRADOR"]}
          />
        }
      />

      {/* Rutas de Inventario */}
      <Route
        path="/inventario"
        element={
          <ProtectedRoute
            element={<HistorialIngresos />}
            allowedRoles={["ADMINISTRADOR"]}
          />
        }
      />
      <Route
        path="/ingreso-stock"
        element={
          <ProtectedRoute
            element={<IngresoStock />}
            allowedRoles={["ADMINISTRADOR"]}
          />
        }
      />
      <Route
        path="/historial-ingresos"
        element={
          <ProtectedRoute
            element={<HistorialIngresos />}
            allowedRoles={["ADMINISTRADOR"]}
          />
        }
      />
      {/* Rutas de clientes */}
      <Route
        path="/ver/cliente/:id"
        element={
          <ProtectedRoute
            element={<VerCliente />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />
      <Route
        path="/editar-cliente/:id"
        element={
          <ProtectedRoute
            element={<EditarCliente />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />
      <Route
        path="/gestion/clientes"
        element={
          <ProtectedRoute
            element={<GestionClientes />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />
      <Route
        path="/registro/cliente"
        element={
          <ProtectedRoute
            element={<RegistroCliente />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />

      {/* Rutas de preventas */}
      <Route
        path="/preventa"
        element={
          <ProtectedRoute
            element={<Preventa />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />
      <Route
        path="/preventa/nueva"
        element={
          <ProtectedRoute
            element={<NuevaPreventa />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />
      <Route
        path="/preventa/historial"
        element={
          <ProtectedRoute
            element={<HistorialPreventas />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />
      <Route
        path="/preventa/detalles/:id"
        element={
          <ProtectedRoute
            element={<DetallesPreventa />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />
      <Route
        path="/preventa/confirmar/:id"
        element={
          <ProtectedRoute
            element={<ConfirmarPreventa />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />
      <Route
        path="/preventa/cliente/:id"
        element={
          <ProtectedRoute
            element={<NuevaPreventa />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />

      {/* Rutas de ventas */}
      <Route
        path="/ventas/historial"
        element={
          <ProtectedRoute
            element={<HistorialVentas />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />
      <Route
        path="/ventas/detalles/:id"
        element={
          <ProtectedRoute
            element={<DetallesVenta />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />

      {/* Rutas de devoluciones */}
      <Route
        path="/devoluciones/historial"
        element={
          <ProtectedRoute
            element={<HistorialDevoluciones />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />
      <Route
        path="/devoluciones/detalles/:id"
        element={
          <ProtectedRoute
            element={<DetallesDevolucion />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />
      <Route
        path="/devoluciones/resumen"
        element={
          <ProtectedRoute
            element={<ResumenDevoluciones />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />
      <Route
        path="/ventas/devoluciones"
        element={
          <ProtectedRoute
            element={<ComparativaVentasDevoluciones />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />
      {/* Rutas de acumulados */} 
      <Route
        path="/acumulados"
        element={
          <ProtectedRoute
            element={<Acumulados />}
            allowedRoles={["ADMINISTRADOR", "COLABORADOR"]}
          />
        }
      />
      



      {/* Ruta por defecto - Redirige a página de error 404 */}
      <Route path="*" element={<Pagina404 />} />
    </Routes>
  );
};

export default App;
