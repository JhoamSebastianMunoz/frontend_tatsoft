import React, { useState } from "react";
import { FiCamera, FiEdit } from "react-icons/fi";
import UsuarioAvatar from "../atoms/AvatarUsuario";
import Tipografia from "../atoms/Tipografia";

const AvatarTexto = ({
  nombre = "Usuario",
  size = "large",
  className = "",
  onEditClick,
  textColor = "text-white",
  showEditButton = true,
  avatarBorderColor = "", 
  badge = null,
  isOnline = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
    xlarge: "w-24 h-24",
    xxlarge: "w-32 h-32"
  };
  
  const iconSizeClasses = {
    small: "w-3 h-3",
    medium: "w-4 h-4",
    large: "w-5 h-5",
    xlarge: "w-6 h-6",
    xxlarge: "w-7 h-7"
  };
  
  const textSizeMap = {
    small: "xs",
    medium: "sm",
    large: "base",
    xlarge: "lg",
    xxlarge: "xl"
  };
  
  const borderSizeMap = {
    small: "border-2",
    medium: "border-2",
    large: "border-3",
    xlarge: "border-4",
    xxlarge: "border-4"
  };

  
  const borderClass = avatarBorderColor ? `${borderSizeMap[size]} ${avatarBorderColor}` : "";

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div 
        className={`relative ${sizeClasses[size]}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`rounded-full overflow-hidden ${borderClass} shadow-md`}>
          <UsuarioAvatar />
        </div>
        
  
        
        {/* Badge (si se provee) */}
        {badge && (
          <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full px-2 py-0.5 border border-white z-10">
            {badge}
          </div>
        )}
      </div>
      
      {/* Nombre del usuario */}
      <div className="text-center space-y-1">
        <Tipografia
          size={textSizeMap[size]}
          className={`font-medium ${textColor} transition-colors duration-300`}
        >
          {nombre}
        </Tipografia>
      </div>
    </div>
  );
};

export default AvatarTexto;
