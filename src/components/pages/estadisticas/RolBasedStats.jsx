import React from "react";
import { useAuth } from "../../../context/AuthContext";
import EstadisticasVentas from "./EstadisticasVentas";
import EstadisticasColaborador from "./EstadisticasColaborador";

const RolBasedStats = () => {
  const { user } = useAuth();
  
  // Verificar el rol del usuario y mostrar el componente correspondiente
  if (user && user.rol === "ADMINISTRADOR") {
    return <EstadisticasVentas />;
  } else {
    return <EstadisticasColaborador />;
  }
};

export default RolBasedStats;