import React from "react";
import { FiEdit } from "react-icons/fi";

const CampoTextoProfile = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
  onEdit,
  disabled = false
}) => (
  <div className="mb-3 w-full max-w-xs sm:max-w-sm md:max-w-md">
    {label && (
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
    )}
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`bg-purple-50 border border-purple-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 block w-full p-1.5 pr-10 ${
          disabled ? "opacity-70 cursor-not-allowed" : ""
        } ${className}`}
        aria-label={placeholder}
      />
      {onEdit && (
        <FiEdit 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 cursor-pointer transition-colors" 
          size={15}
          onClick={onEdit}
          aria-label="Editar campo"
        />
      )}
    </div>
  </div>
);

export default CampoTextoProfile;