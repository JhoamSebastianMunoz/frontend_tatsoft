import React from "react";
import Avatar from '../../assets/Avatar/avatarTatsoft.jpg';


<<<<<<< HEAD
const UsuarioAvatar = ({ src = Avatar, alt = "Avatar", size = 90 }) => {
=======
const UsuarioAvatar = ({ src = Avatar, alt = "Avatar", size = 60 }) => {
>>>>>>> test-2
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover`} 
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};

export default UsuarioAvatar;
