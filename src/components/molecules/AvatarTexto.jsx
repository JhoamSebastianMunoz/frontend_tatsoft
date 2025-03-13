import React from "react";
import UsuarioAvatar from "../atoms/AvatarUsuario";
import Tipografia from "../atoms/Tipografia";


const AvatarTexto = ({ 
  nombre = "Usuario", 
  size = "large", 
  className = "",
  onEditClick,
  textColor = "text-white"
}) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
    xlarge: "w-24 h-24",
    xxlarge: "w-32 h-32"
  };
  
  const iconSizeClasses = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
    xlarge: "w-7 h-7",
    xxlarge: "w-8 h-8"
  };
  
  const textSizeMap = {
    small: "sm",
    medium: "base",
    large: "lg",
    xlarge: "xl",
    xxlarge: "2xl"
  };
  
  return (
    <div className={`relative flex flex-col items-center gap-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <UsuarioAvatar />
      </div>
      <Tipografia 
        size={textSizeMap[size]} 
        className={`font-medium ${textColor}`}
      >
        {nombre}
      </Tipografia>
    </div>
  );
};

export default AvatarTexto;