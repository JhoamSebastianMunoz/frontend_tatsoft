import React from 'react';
import Tipografia from './Tipografia';

const Boton = ({
  label,
  onClick,
  tipo = "primario",
  size = "medium",
  iconName,
  iconPosition = "left",
  disabled = false,
  fullWidth = false,
  loading = false,
  className = ""
}) => {
 
  const tipos = {
    primario: "bg-orange-400 hover:bg-orange-600 text-white",
    secundario: "bg-transparent border border-orange-300 text-orange-600 hover:bg-orange-200",
    alerta: "bg-[#5DEA6D] hover:bg-green-300 text-white",
    cancelar: "bg-[#FE5F5A] hover:bg-red-400 text-white",
    outline: "bg-transparent border border-[#B06AFF] text-[#B06AFF] hover:bg-purple-50",
    ghost: "bg-transparent text-[#B06AFF] hover:bg-purple-50",
    link: "bg-transparent text-[#B06AFF] hover:underline p-0 h-auto",
  };

  // Tamaños predefinidos
  const tamaños = {
    small: "px-3 py-1.5 text-xs",
    medium: "px-10 py-1.5 text-sm",
    large: "px-28 py-1.5 text-base",
  };

  const icons = {
    add: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    edit: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    delete: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    search: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    location: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    update: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    "map-pin": (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    "user-plus": (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    "trash-2": (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
  };


  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // Determinar clases CSS en base a las propiedades
  const buttonClasses = `
    font-medium
    rounded-lg
    transition-all
    duration-200
    flex
    items-center
    justify-center
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${fullWidth ? 'w-full' : ''}
    ${tipo !== 'link' ? tamaños[size] : ''}
    ${tipos[tipo]}
    ${className}
  `;

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <LoadingSpinner />}
      
      {iconName && iconPosition === 'left' && !loading && (
        <span className={`${label ? 'mr-2' : ''}`}>
          {icons[iconName]}
        </span>
      )}
      
      {label && (
        <Tipografia className={`inherit`}>
          {label}
        </Tipografia>
      )}
      
      {iconName && iconPosition === 'right' && !loading && (
        <span className={`${label ? 'ml-2' : ''}`}>
          {icons[iconName]}
        </span>
      )}
    </button>
  );
};

const Botones = ({
  label,
  onClick,
  tipo = "primario",
  size = "medium",
  iconName,
  iconPosition = "left",
  disabled = false,
  fullWidth = false,
  loading = false,
  className = ""
}) => {
  // Si se utiliza como componente individual, devuelve un botón con los props proporcionados
  if (onClick !== undefined || label !== undefined) {
    return (
      <Boton
        label={label}
        onClick={onClick}
        tipo={tipo}
        size={size}
        iconName={iconName}
        iconPosition={iconPosition}
        disabled={disabled}
        fullWidth={fullWidth}
        loading={loading}
        className={className}
      />
    );
  }

  // De lo contrario, muestra ejemplos de botones
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <Tipografia variant="title" className="mb-6">Ejemplos de Botones</Tipografia>
      
      <div className="mb-8">
        <Tipografia variant="subtitle" className="mb-3">Tipos de botones</Tipografia>
        <div className="flex flex-wrap gap-3">
          <Boton label="Primario" tipo="primario" />
          <Boton label="Secundario" tipo="secundario" />
          <Boton label="Alerta" tipo="alerta" />
          <Boton label="Cancelar" tipo="cancelar" />
          <Boton label="Outline" tipo="outline" />
          <Boton label="Ghost" tipo="ghost" />
          <Boton label="Link" tipo="link" />
        </div>
      </div>
      
      <div className="mb-8">
        <Tipografia variant="subtitle" className="mb-3">Tamaños</Tipografia>
        <div className="flex flex-wrap items-center gap-3">
          <Boton label="Small" tipo="primario" size="small" />
          <Boton label="Medium" tipo="primario" size="medium" />
          <Boton label="Large" tipo="primario" size="large" />
          <Boton label="XLarge" tipo="primario" size="xlarge" />
        </div>
      </div>
      
      <div className="mb-8">
        <Tipografia variant="subtitle" className="mb-3">Con iconos</Tipografia>
        <div className="flex flex-wrap gap-3">
          <Boton label="Agregar" tipo="primario" iconName="add" iconPosition="left" />
          <Boton label="Editar" tipo="secundario" iconName="edit" iconPosition="left" />
          <Boton label="Eliminar" tipo="cancelar" iconName="delete" iconPosition="left" />
          <Boton label="Buscar" tipo="outline" iconName="search" iconPosition="right" />
          <Boton tipo="primario" iconName="location" />
        </div>
      </div>
      
      <div className="mb-8">
        <Tipografia variant="subtitle" className="mb-3">Estados</Tipografia>
        <div className="flex flex-wrap gap-3">
          <Boton label="Deshabilitado" tipo="primario" disabled />
          <Boton label="Cargando..." tipo="primario" loading />
          <Boton label="Ancho completo" tipo="secundario" fullWidth />
        </div>
      </div>
      
      <div className="mb-8">
        <Tipografia variant="subtitle" className="mb-3">Combinaciones</Tipografia>
        <div className="flex flex-wrap gap-3">
          <Boton 
            label="Guardar cambios" 
            tipo="primario" 
            iconName="edit" 
            size="large" 
          />
          <Boton 
            label="Eliminar" 
            tipo="cancelar" 
            iconName="delete" 
            iconPosition="right"
            size="medium" 
          />
          <Boton 
            label="Cargando..." 
            tipo="outline" 
            loading 
            size="medium" 
          />
        </div>
      </div>
    </div>
  );
};

export default Botones;