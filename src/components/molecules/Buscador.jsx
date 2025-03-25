import React, { useState } from "react";
import Icono from "../atoms/Iconos";
import Tipografia from "../atoms/Tipografia";

const Buscador = ({ placeholder = "Buscar productos, marcas y más...", iconName = "buscar" }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <Tipografia>
      <form className="w-full sm:max-w-md mx-auto px-2">
        <div className="relative flex items-center">
          <input
            type="search"
            id="default-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="block w-full py-2 pl-4 pr-10 text-sm text-gray-600 border border-orange-200 rounded-xl  outline-none placeholder:font-semibold placeholder:text-gray-400 sm:py-2 sm:pl-5 sm:pr-12"
            placeholder={placeholder}
            required
          />
          <div className="absolute inset-y-0 right-3 flex items-center sm:right-4">
            <Icono name={iconName} className="w-5 h-5 sm:w-6 sm:h-6 text-gray-200" />
          </div>
        </div>
      </form>
    </Tipografia>
  );
};

export default Buscador;
