import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { areaService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Icono from "../../../components/atoms/Iconos";
import Boton from "../../../components/atoms/Botones";
import Sidebar from "../../organisms/Sidebar";

const RegistrarZona = () => {
  const navigate = useNavigate();
  const [zona, setZona] = useState({
    nombre_zona_trabajo: "",
    descripcion: ""
  });
  
  // Estado para errores específicos de cada campo
  const [errores, setErrores] = useState({
    nombre_zona_trabajo: "",
    descripcion: ""
  });
  
  // Estado para control del formulario
  const [formaTocada, setFormaTocada] = useState({
    nombre_zona_trabajo: false,
    descripcion: false
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [error, setError] = useState("");
  
  // Función para manejar los cambios en los inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setZona(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Marcar el campo como tocado
    setFormaTocada(prev => ({
      ...prev,
      [name]: true
    }));
  };

  // Función para validar un campo específico
  const validarCampo = (nombre, valor) => {
    let mensajeError = "";
    
    switch (nombre) {
      case "nombre_zona_trabajo":
        if (!valor.trim()) {
          mensajeError = "El nombre de la zona es obligatorio";
        } else if (valor.trim().length < 3) {
          mensajeError = "El nombre debe tener al menos 3 caracteres";
        } else if (valor.trim().length > 50) {
          mensajeError = "El nombre no puede exceder los 50 caracteres";
        } else if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_]+$/.test(valor)) {
          mensajeError = "El nombre solo puede contener letras, números, espacios, guiones y guiones bajos";
        }
        break;
        
      case "descripcion":
        if (!valor.trim()) {
          mensajeError = "La descripción es obligatoria";
        } else if (valor.trim().length < 10) {
          mensajeError = "La descripción debe tener al menos 10 caracteres";
        } else if (valor.trim().length > 500) {
          mensajeError = "La descripción no puede exceder los 500 caracteres";
        }
        break;
        
      default:
        break;
    }
    
    return mensajeError;
  };
  
  // Efecto para validar campos cuando cambian
  useEffect(() => {
    const nuevosErrores = {...errores};
    
    // Solo validar campos que han sido tocados o si el formulario fue enviado
    Object.keys(zona).forEach(campo => {
      if (formaTocada[campo] || formSubmitted) {
        nuevosErrores[campo] = validarCampo(campo, zona[campo]);
      }
    });
    
    setErrores(nuevosErrores);
  }, [zona, formaTocada, formSubmitted]);
  
  // Verificar si el formulario es válido
  const esFormularioValido = () => {
    // Validar todos los campos sin modificar el estado
    let formularioValido = true;
    
    Object.keys(zona).forEach(campo => {
      const error = validarCampo(campo, zona[campo]);
      if (error) {
        formularioValido = false;
      }
    });
    
    return formularioValido;
  };
  
  const handleGuardarClick = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Verificar si los campos necesarios están completos y válidos
    if (!esFormularioValido()) {
      setError("Por favor corrige los errores en el formulario");
      return;
    }
    
    setError("");
    setMostrarAlerta(true);
  };

  const handleConfirmarGuardar = async () => {
    setMostrarAlerta(false);
    
    try {
      const zonaData = {
        nombre_zona_trabajo: zona.nombre_zona_trabajo.trim(),
        descripcion: zona.descripcion.trim()
      };
      
      const respuesta = await areaService.createArea(zonaData);
      navigate("/gestion-zonas");
    } catch (error) {
      console.error("Error al crear zona:", error);
      
      // Manejo de errores específicos de la API
      if (error.response && error.response.data && error.response.data.message) {
        setError(`Error: ${error.response.data.message}`);
      } else {
        setError("Error al crear la zona. Por favor, intenta de nuevo más tarde.");
      }
    }
  };

  const handleCancelar = () => {
    // Confirmar si hay cambios antes de salir
    if (zona.nombre_zona_trabajo || zona.descripcion) {
      if (window.confirm("¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.")) {
        navigate("/gestion-zonas");
      }
    } else {
      navigate("/gestion-zonas");
    }
  };

  // Función para mostrar errores
  const mostrarError = (campo) => {
    return (formaTocada[campo] || formSubmitted) && errores[campo] ? (
      <p className="text-red-500 text-sm mt-1">{errores[campo]}</p>
    ) : null;
  };

  // Calcular el estado de los campos para estilizado dinámico
  const getEstadoCampo = (campo) => {
    if ((formaTocada[campo] || formSubmitted) && errores[campo]) {
      return "error";
    }
    if (formaTocada[campo] && !errores[campo] && zona[campo]) {
      return "valido";
    }
    return "normal";
  };

  // Función para aplicar clases según el estado del campo
  const getClasesCampo = (campo) => {
    const estado = getEstadoCampo(campo);
    const clases = "w-full px-4 py-3 rounded-lg border transition duration-150 ";
    
    switch (estado) {
      case "error":
        return `${clases} border-red-500 focus:ring-2 focus:ring-red-300 focus:border-transparent`;
      case "valido":
        return `${clases} border-green-500 focus:ring-2 focus:ring-green-300 focus:border-transparent`;
      default:
        return `${clases} border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Sidebar para móvil */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200">
        <Sidebar />
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden md:block fixed top-0 left-0 h-full z-20">
        <Sidebar />
      </div>

      {/* Contenido principal */}
      <main className="w-full mx-4 p-4">
        <div className="px-4 md:px-6 lg:px-8">
          <Tipografia>
            <div className="py-3 px-8 md:px-44">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Registrar Zona</h1>
            </div>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            <div className="max-w-4xl ml-6 md:mx-auto">
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8 mb-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Información de la Zona
                  </h2>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black block">
                        Nombre de la zona <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="nombre_zona_trabajo"
                          value={zona.nombre_zona_trabajo}
                          onChange={handleChange}
                          placeholder="Ingrese el nombre de la zona"
                          className={getClasesCampo("nombre_zona_trabajo")}
                          onBlur={() => setFormaTocada(prev => ({ ...prev, nombre_zona_trabajo: true }))}
                        />
                        {getEstadoCampo("nombre_zona_trabajo") === "valido" && (
                          <span className="absolute right-3 top-3 text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      {mostrarError("nombre_zona_trabajo")}
                      {!errores.nombre_zona_trabajo && (
                        <p className="text-gray-500 text-xs">El nombre debe tener entre 3 y 50 caracteres</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">
                        Descripción <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="descripcion"
                        value={zona.descripcion}
                        onChange={handleChange}
                        placeholder="Descripción de la zona y detalles relevantes"
                        className={getClasesCampo("descripcion")}
                        onBlur={() => setFormaTocada(prev => ({ ...prev, descripcion: true }))}
                        rows="4"
                      />
                      {mostrarError("descripcion")}
                      <div className="flex justify-between">
                        <p className="text-gray-500 text-xs">La descripción debe tener entre 10 y 500 caracteres</p>
                        <p className="text-gray-500 text-xs">
                          {zona.descripcion.length}/500
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end pt-6 border-t border-gray-100">
                  <Boton
                    onClick={handleCancelar}
                    label="Cancelar"
                    tipo="secundario"
                    className="w-full sm:w-auto"
                  />
                  <Boton
                    onClick={handleGuardarClick}
                    label="Guardar"
                    tipo="primario"
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>
            </div>
          </Tipografia>
        </div>
      </main>

      {/* Modal de confirmación */}
      {mostrarAlerta && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 transition-opacity p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-5">
              <div className="text-center">
                <Tipografia>
                  <Icono name="confirmar" size="50" />
                  <h3 className="text-lg font-medium text-black mb-3">
                    ¿Desea guardar la zona?
                  </h3>
                  <p className="text-sm text-black mb-4">
                    Esta acción registrará una nueva zona. ¿Estás seguro de continuar?
                  </p>
                </Tipografia>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-col gap-3">
              <Boton
                onClick={handleConfirmarGuardar}
                label="Confirmar"
                tipo="secundario"
                className="w-full"
              />
              <Boton
                onClick={() => setMostrarAlerta(false)}
                label="Cancelar"
                tipo="cancelar"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarZona;