
import React from "react";
import { IoSearch, IoArrowBackCircleSharp } from "react-icons/io5";
import { IoIosNotifications, IoIosLock, IoIosWarning } from "react-icons/io";
import { FaUserEdit, FaAirFreshener, FaClipboardList, FaUser, FaArrowUp } from "react-icons/fa";
import { FaMapLocationDot, FaTriangleExclamation } from "react-icons/fa6";
import { FaChartColumn, FaChevronDown, FaChartLine, FaChartBar } from "react-icons/fa6";
import { LuClipboardList } from "react-icons/lu";
import { MdLogout, MdOutlineFileUpload, MdCancel } from "react-icons/md";
import { RiUserAddFill } from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";
import { GrMoney } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import { BsFillCheckCircleFill, BsCurrencyDollar, BsGraphUp, BsExclamationTriangle } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineStorefront } from "react-icons/md";

const iconos = {
  buscar: IoSearch,
  notificaciones: IoIosNotifications,
  "gest-usuarios": FaUserEdit,
  "gest-clientes": MdOutlineStorefront,
  "gest-productos": FaAirFreshener,
  "gest-zonas": FaMapLocationDot,
  "gest-acumulados": FaChartColumn,
  catalogo: LuClipboardList,
  inventario: FaClipboardList,
  "cerrar-sesion": MdLogout,
  "registrar-usuario": RiUserAddFill,
  opciones: SlOptionsVertical,
  "subir-archivo": MdOutlineFileUpload,
  cancelar: MdCancel,
  volver: IoArrowBackCircleSharp,
  preventa: GrMoney,
  despliegue: FaChevronDown,
  eliminar: AiFillDelete,
  confirmar: BsFillCheckCircleFill,
  eliminarAlert: TiDelete,
  ubicacion: FaMapLocationDot,
  correo: HiOutlineMail,
  candado: IoIosLock,
  // Iconos adicionales para EstadisticasVentas
  money: BsCurrencyDollar,
  chart: FaChartLine,
  arrowUp: FaArrowUp,
  user: FaUser,
  barChart: FaChartBar,
  graphUp: BsGraphUp,
  alerta: FaTriangleExclamation
};

const Icono = ({ name, size = 25, color = "#c2c2c2", className = "", customColor, onClick, style }) => {
  const finalColor = customColor ?? (() => {
    switch (name) {
      case "cerrar-sesion":
        return "white";
      case "eliminar":
        return "#F48783";
      case "volver":
        return "#F78220";
      case "confirmar":
        return "#A5F6A5";
      case "eliminarAlert":
        return "#F80C04";
      case "alerta":
        return "#F59E0B";
      default:
        return color;
    }
  })();

  const finalSize = name === "cerrar-sesion" ? size * 1.1 : size;

  const IconComponent = iconos[name];

  if (!IconComponent) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <p>Icono no encontrado</p>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center cursor-pointer ${className}`} onClick={onClick}>
      <IconComponent style={{ fontSize: finalSize, color: finalColor, ...style }} />
    </div>
  );
};

export default Icono