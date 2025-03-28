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
  disabled = false,
  readOnly = false
}) => {
  // Aseguramos que value siempre sea una cadena (cuando se usa onChange)
  const safeValue = value === undefined ? "" : value;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={safeValue || ''}
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full px-4 py-1.5 rounded-lg border 
            ${readOnly 
              ? 'bg-gray-50 text-gray-700 border-gray-200' 
              : 'border-gray-300 focus:ring-2 focus:ring-[#F78220] focus:border-transparent'
            } 
            transition duration-150 ease-in-out
            ${className}`
          }
        />
      </div>
    </div>
  );
};

export default CampoTextoProfile;
