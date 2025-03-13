import React, { useState } from "react";
import UsuarioAvatar from "../atoms/AvatarUsuario";
import Tipografia from "../atoms/Tipografia";
<<<<<<< HEAD
import { FiEdit, FiCamera } from "react-icons/fi";
=======

>>>>>>> test-2

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

  const badgeSizeMap = {
    small: "w-2 h-2",
    medium: "w-3 h-3",
    large: "w-3.5 h-3.5",
    xlarge: "w-4 h-4",
    xxlarge: "w-5 h-5"
  };
  
  const borderClass = avatarBorderColor ? `${borderSizeMap[size]} ${avatarBorderColor}` : "";
  
  return (
<<<<<<< HEAD
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Contenedor del avatar con efectos de hover */}
      <div 
        className={`relative ${sizeClasses[size]} mb-4`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
=======
    <div className={`relative flex flex-col items-center gap-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <UsuarioAvatar />
      </div>
      <Tipografia 
        size={textSizeMap[size]} 
        className={`font-medium ${textColor}`}
>>>>>>> test-2
      >
        {/* Avatar con o sin borde y sombra */}
        <div className={`rounded-full overflow-hidden ${borderClass} shadow-md`}>
          <UsuarioAvatar />
        </div>
        
        {/* Overlay al hacer hover */}
        {showEditButton && onEditClick && isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center transition-opacity duration-300 z-10">
            <button
              className="text-white hover:text-purple-300 focus:outline-none transition-colors duration-200"
              onClick={onEditClick}
              aria-label="Editar avatar"
            >
              <FiCamera className={iconSizeClasses[size]} />
            </button>
          </div>
        )}
        
        {/* Botón de edición (visible siempre) */}
        {showEditButton && onEditClick && !isHovered && (
          <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 z-20">
            <button
              className={`
                flex items-center justify-center bg-white rounded-full shadow-md
                hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400
                transition-all duration-300 ease-in-out p-1
              `}
              onClick={onEditClick}
              aria-label="Editar avatar"
            >
              <FiEdit className={`text-purple-600 ${iconSizeClasses[size]}`} />
            </button>
          </div>
        )}
        
      
        {badge && (
          <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full px-2 py-0.5 border border-white z-10">
            {badge}
          </div>
        )}
      </div>
      
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