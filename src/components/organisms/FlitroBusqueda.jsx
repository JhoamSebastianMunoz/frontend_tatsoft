import React, { useState, useEffect } from "react";
import Tipografia from "../atoms/Tipografia";
import Buscador from "../molecules/Buscador";
import Icono from "../atoms/Iconos";

/**
 * Componente para filtrar búsquedas con categorías seleccionables
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.initialFilters - Filtros iniciales seleccionados (opcional)
 * @param {Array} props.availableFilters - Lista de todos los filtros disponibles (opcional)
 * @param {Function} props.onChange - Función a llamar cuando cambian los filtros seleccionados (opcional)
 */
const FiltroBusqueda = ({ 
  initialFilters = ["Galletas", "Integrales", "Avena"],
  availableFilters = ["Galletas", "Integrales", "Avena", "Lácteos", "Sin azúcar", "Gaseosa"],
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(availableFilters);

  // Cuando cambia el término de búsqueda, filtrar las opciones disponibles
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOptions(availableFilters);
    } else {
      const filtered = availableFilters.filter(filter => 
        filter.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, availableFilters]);

  // Cuando cambian los filtros seleccionados, llamar a la función onChange
  useEffect(() => {
    if (onChange) {
      onChange(selectedFilters);
    }
  }, [selectedFilters, onChange]);

  /**
   * Alternar selección de un filtro
   * @param {string} filter - Filtro a alternar
   */
  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  /**
   * Manejar cambio en el campo de búsqueda
   * @param {Object} e - Evento de cambio
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Tipografia>
      <div className="relative w-full max-w-md">
        <div className="flex gap-4 flex-wrap items-center mb-1 border border-gray-200 rounded-lg p-1">
          {selectedFilters.slice(0, 4).map((filter, index) => (
            <span
              key={index}
              className="px-4 py-1 bg-purple-400 text-white rounded-lg text-sm"
            >
              {filter}
            </span>
          ))}
          {selectedFilters.length > 4 && (
            <span className="px-py-1 bg-gray-300 rounded-full text-sm">
              ...
            </span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-2 py-1 bg-purple-400 text-white rounded-full text-sm flex items-center"
            aria-label={isOpen ? "Cerrar filtros" : "Abrir filtros"}
          >
            {selectedFilters.length}
            <Icono name="despliegue" color="white" size={15} className="m-0.5" />
          </button>
        </div>
        
        {isOpen && (
          <div className="absolute w-full bg-white shadow-md rounded-lg p-3 z-10">
            <Buscador 
              placeholder="Buscar filtros..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="m-4 grid grid-cols-2 gap-3">
              {filteredOptions.map((filter, index) => (
                <div key={index} className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFilter(filter)}
                    className={`m-1 w-7 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedFilters.includes(filter)
                        ? "bg-purple-400"
                        : "border-gray-400"
                    }`}
                    aria-label={`${selectedFilters.includes(filter) ? 'Deseleccionar' : 'Seleccionar'} ${filter}`}
                  >
                    {selectedFilters.includes(filter) && (
                      <span className="text-white">✔</span>
                    )}
                  </button>
                  <span className="text-gray-700">{filter}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Tipografia>
  );
};

export default FiltroBusqueda;