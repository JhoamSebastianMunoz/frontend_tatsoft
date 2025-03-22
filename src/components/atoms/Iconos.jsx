import React from "react";
import { IoSearch, IoArrowBackCircleSharp } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { FaUserEdit, FaAirFreshener, FaClipboardList } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaChartColumn, FaChevronDown } from "react-icons/fa6";
import { LuClipboardList } from "react-icons/lu";
import { MdLogout, MdOutlineFileUpload, MdCancel } from "react-icons/md";
import { RiUserAddFill } from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";
import { GrMoney } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import { HiOutlineMail } from "react-icons/hi";
import { IoIosLock } from "react-icons/io";
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
  correo:HiOutlineMail,
  candado:IoIosLock
};

const Icono = ({ name, size = 25, color = "#c2c2c2", className = "", customColor, onClick }) => {
  const finalColor = customColor ?? (() => {
    switch (name) {
      case "cerrar-sesion":
        return "white";
      case "eliminar":
        return "#F48783";
      case "volver":
        return "white";
      case "confirmar":
        return "#A5F6A5";
      case "eliminarAlert":
        return "#F80C04";
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
      <IconComponent style={{ fontSize: finalSize, color: finalColor }} />
    </div>
  );
};

export default Icono;