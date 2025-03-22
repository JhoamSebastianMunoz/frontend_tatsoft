import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../../context/services/ApiService";
import { imageService } from "../../../context/services/ImageService";
import { useAuth } from "../../../context/AuthContext";
import Tipografia from "../../../components/atoms/Tipografia";
import Icono from "../../../components/atoms/Iconos";
import Boton from "../../../components/atoms/Botones";
import Loading from "../../../components/Loading/Loading";
import Sidebar from "../../organisms/Sidebar";

const RegistrarProducto = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados para manejo del formulario
  const [formData, setFormData] = useState({
    nombre_producto: "",
    categoria: "",
    precio: "",
    cantidad_ingreso: "",
    descripcion: "",
    id_categoria: ""
  });

  // Estados para manejo de UI
  const [showCategorias, setShowCategorias] = useState(false);
  const [showNuevaCategoriaModal, setShowNuevaCategoriaModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Estados para alertas
  const [showCancelarAlerta, setShowCancelarAlerta] = useState(false);
  const [showRegistroExitosoAlerta, setShowRegistroExitosoAlerta] = useState(false);
  const [showSeleccionadoAlerta, setShowSeleccionadoAlerta] = useState(false);
  const [showCancelarCategoriaAlerta, setShowCancelarCategoriaAlerta] = useState(false);
  const [showCategoriaCreadaAlerta, setShowCategoriaCreadaAlerta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoriaError, setCategoriaError] = useState("");

  // Estado para el control de la barra de navegación
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : true;
  });

  // Guardar estado del sidebar en localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  // Cargar categorías y verificar permisos al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await productService.getAllCategories();
        if (response.data && Array.isArray(response.data)) {
          setCategorias(response.data);
        }
      } catch (error) {
        console.error("Error cargando categorías:", error);
        setError("No se pudieron cargar las categorías. Por favor, intenta de nuevo más tarde.");
      }
    };
    
    // Verificar si el usuario es administrador
    if (user && user.rol !== "ADMINISTRADOR") {
      navigate("/unauthorized");
      return;
    }
    
    fetchCategorias();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCategoriaChange = (categoria) => {
    setFormData({
      ...formData,
      categoria: categoria.nombre_categoria,
      id_categoria: categoria.id_categoria
    });
    setShowCategorias(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
   
    // Verificar el tamaño del archivo (máximo 6MB según la API)
    if (file.size > 6 * 1024 * 1024) {
      setError("La imagen no puede superar los 6MB de tamaño.");
      return;
    }
   
    // Verificar el tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError("El archivo seleccionado no es una imagen válida.");
      return;
    }
   
    setImageFile(file);
   
    // Crear vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
   
    // Mostrar alerta de selección exitosa
    setShowSeleccionadoAlerta(true);
    setTimeout(() => {
      setShowSeleccionadoAlerta(false);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
   
    try {
      // Validar campos requeridos
      if (!formData.nombre_producto || !formData.precio || !formData.id_categoria) {
        setError("Por favor completa todos los campos requeridos: nombre, precio y categoría.");
        setLoading(false);
        return;
      }
      // Primero subir la imagen si existe
      let imageId = null;
      if (imageFile) {
        setIsUploading(true);
        try {
          const uploadResponse = await imageService.uploadImage(imageFile);
          if (uploadResponse && uploadResponse.url) {
            // Extraer el ID de la imagen de la URL o respuesta
            imageId = uploadResponse.fileName || uploadResponse.url.split('/').pop();
          }
        } catch (imageError) {
          console.error("Error subiendo imagen:", imageError);
          setError("No se pudo subir la imagen. El producto se registrará sin imagen.");
        } finally {
          setIsUploading(false);
        }
      }

      // Preparar los datos del producto
      const productData = {
        nombre_producto: formData.nombre_producto,
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion,
        cantidad_ingreso: parseInt(formData.cantidad_ingreso) || 0,
        id_imagen: imageId,
        id_categoria: formData.id_categoria
      };
      // Registrar el producto
      const response = await productService.createProduct(productData);
     
      // Mostrar alerta de éxito
      setShowRegistroExitosoAlerta(true);
      setTimeout(() => {
        setShowRegistroExitosoAlerta(false);
        navigate("/gestion-productos");
      }, 2000);
     
    } catch (error) {
      console.error("Error registrando producto:", error);
      setError(
        error.response?.data?.error ||
        "Ocurrió un error al registrar el producto. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setShowCancelarAlerta(true);
  };

  const confirmarCancelacion = () => {
    setShowCancelarAlerta(false);
    navigate("/gestion-productos");
  };

  const cancelarCancelacion = () => {
    setShowCancelarAlerta(false);
  };

  const abrirModalNuevaCategoria = () => {
    setNuevaCategoria("");
    setCategoriaError("");
    setShowNuevaCategoriaModal(true);
    setShowCategorias(false);
  };

  const cerrarModalNuevaCategoria = () => {
    if (nuevaCategoria.trim() !== "") {
      // Si hay datos, mostrar alerta de confirmación
      setShowCancelarCategoriaAlerta(true);
    } else {
      // Si no hay datos, cerrar directamente
      setShowNuevaCategoriaModal(false);
    }
  };

  const confirmarCancelarCategoria = () => {
    setShowCancelarCategoriaAlerta(false);
    setShowNuevaCategoriaModal(false);
    setNuevaCategoria("");
  };

  const cancelarCancelarCategoria = () => {
    setShowCancelarCategoriaAlerta(false);
  };

  const agregarNuevaCategoria = async () => {
    // Validar que haya un nombre de categoría
    if (nuevaCategoria.trim() === "") {
      setCategoriaError("El nombre de la categoría es obligatorio");
      return;
    }
   
    try {
      setLoading(true);
      const response = await productService.createCategory({
        nombre_categoria: nuevaCategoria,
        descripcion: `Categoría para productos` // Descripción genérica predeterminada
      });
     
      // Actualizar lista de categorías
      const categoriasResponse = await productService.getAllCategories();
      setCategorias(categoriasResponse.data);
     
      // Seleccionar la nueva categoría
      const nuevaCategoriaObj = categoriasResponse.data.find(
        c => c.nombre_categoria === nuevaCategoria
      );
     
      if (nuevaCategoriaObj) {
        handleCategoriaChange(nuevaCategoriaObj);
      }
     
      // Cerrar el modal y mostrar alerta de éxito
      setShowNuevaCategoriaModal(false);
      setShowCategoriaCreadaAlerta(true);
      setTimeout(() => {
        setShowCategoriaCreadaAlerta(false);
      }, 2000);
     
    } catch (error) {
      console.error("Error creando categoría:", error);
      setCategoriaError("No se pudo crear la categoría. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showNuevaCategoriaModal && !showCancelarCategoriaAlerta) {
    return <Loading message="Procesando operación..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">  
      {/* Sidebar */}
      <Sidebar />
      
      <div className={`flex-1 transition-all duration-300 ${
        !collapsed ? "md:ml-70" : "md:ml-16"
      }`}>
      {/* Header */}
      <div className="text-black p-4 mb-4 ">
          <Tipografia 
            variant="h1" 
            size="2xl" 
            className="text-black font-medium pl-2 md:pl-4"
          >
            Agregar producto
          </Tipografia>
        </div>
        
        {/* Contenido principal */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-md p-6 w-full">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Columna izquierda con datos principales */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-1 mb-4">
                    <h2 className="text-lg font-medium text-orange-500">Información del producto</h2>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Producto*
                    </label>
                    <input
                      type="text"
                      name="nombre_producto"
                      value={formData.nombre_producto}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 rounded-lg"
                      required
                      placeholder="Ingrese el nombre del producto"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio* (USD)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          type="number"
                          name="precio"
                          value={formData.precio}
                          onChange={handleInputChange}
                          className="w-full pl-7 p-2 border border-gray-300 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 rounded-lg"
                          required
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Inicial
                      </label>
                      <input
                        type="number"
                        name="cantidad_ingreso"
                        value={formData.cantidad_ingreso}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 rounded-lg"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 rounded-lg"
                      rows="6"
                      placeholder="Describa las características del producto"
                    ></textarea>
                  </div>
                </div>
                
                {/* Columna derecha con categoría e imagen */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-1 mb-4">
                    <h2 className="text-lg font-medium text-orange-500">Categoría e imagen</h2>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría*
                    </label>
                    <div className="relative">
                      <div
                        className="w-full p-2 border border-gray-300 rounded-lg flex justify-between items-center cursor-pointer hover:border-orange-300"
                        onClick={() => setShowCategorias(!showCategorias)}
                      >
                        <span className={formData.categoria ? "text-gray-800" : "text-gray-400"}>
                          {formData.categoria || "Seleccione una categoría"}
                        </span>
                        <Icono name="despliegue" size={16} />
                      </div>
                      
                      {showCategorias && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                          {categorias.map((categoria) => (
                            <div
                              key={categoria.id_categoria}
                              className="p-2 hover:bg-orange-100 cursor-pointer"
                              onClick={() => handleCategoriaChange(categoria)}
                            >
                              {categoria.nombre_categoria}
                            </div>
                          ))}
                          <div
                            className="p-2 bg-orange-100 text-center hover:bg-orange-200 cursor-pointer text-orange-700 font-medium"
                            onClick={abrirModalNuevaCategoria}
                          >
                            + Agregar nueva categoría
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Sección de imagen */}
                  <div className="mt-6 bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Imagen del Producto
                    </label>
                    
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-48 h-48 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Vista previa"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-center">
                            <Icono name="gest-productos" size={40} className="text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">Vista previa</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center w-full">
                        <input
                          type="file"
                          id="imageInput"
                          onChange={handleImageChange}
                          className="hidden"
                          accept="image/*"
                        />
                        <label
                          htmlFor="imageInput"
                          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer hover:bg-orange-600 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                          </svg>
                          <span>Seleccionar imagen</span>
                        </label>
                        
                        <p className="text-xs text-gray-500 mt-2">
                          Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 6MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mt-10 pt-6 border-t border-gray-100">
                <Boton
                  tipo="cancelar"
                  label="Cancelar"
                  onClick={handleCancelar}
                />
                
                <Boton
                  tipo="primario"
                  label={loading ? "Registrando..." : "Registrar"}
                  type="submit"
                  disabled={loading || isUploading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Modal para agregar nueva categoría (Simplificado) */}
      {showNuevaCategoriaModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              Agregar nueva categoría
            </h3>
            
            {categoriaError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded text-sm">
                <p>{categoriaError}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la categoría*
              </label>
              <input
                type="text"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
                className="w-full p-2 border border-gray-300 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 rounded-lg"
                placeholder="Ingrese el nombre de la categoría"
              />
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Boton
                label="Cancelar"
                tipo="cancelar"
                onClick={cerrarModalNuevaCategoria}
              />
              
              <Boton
                label={loading ? "Agregando..." : "Agregar"}
                tipo="primario"
                onClick={agregarNuevaCategoria}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Alerta de cancelar registro */}
      {showCancelarAlerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <div className="flex justify-center mb-4">
              <Icono name="eliminarAlert" size={65} />
            </div>
            <p className="text-center mb-4">
              ¿Desea cancelar el registro?
            </p>
            <p className="text-center text-gray-500 text-sm mb-4">
              Los cambios no guardados se perderán.
            </p>
            <div className="flex justify-center space-x-2">
              <Boton
                tipo="cancelar"
                label="No"
                onClick={cancelarCancelacion}
              />
              <Boton
                tipo="primario"
                label="Sí, cancelar"
                onClick={confirmarCancelacion}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Alerta de cancelar creación de categoría */}
      {showCancelarCategoriaAlerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <div className="flex justify-center mb-4">
              <Icono name="eliminarAlert" size={65} />
            </div>
            <p className="text-center mb-4">
              ¿Desea cancelar la creación de la categoría?
            </p>
            <p className="text-center text-gray-500 text-sm mb-4">
              Los datos ingresados se perderán.
            </p>
            <div className="flex justify-center space-x-2">
              <Boton
                tipo="cancelar"
                label="No"
                onClick={cancelarCancelarCategoria}
              />
              <Boton
                tipo="primario"
                label="Sí, cancelar"
                onClick={confirmarCancelarCategoria}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Alerta de registro exitoso */}
      {showRegistroExitosoAlerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <div className="flex justify-center mb-4">
              <Icono name="confirmar" size={65} />
            </div>
            <p className="text-center mb-4">
              Producto registrado exitosamente
            </p>
          </div>
        </div>
      )}
      
      {/* Alerta de categoría creada exitosamente */}
      {showCategoriaCreadaAlerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <div className="flex justify-center mb-4">
              <Icono name="confirmar" size={65} />
            </div>
            <p className="text-center mb-4">
              Categoría creada exitosamente
            </p>
          </div>
        </div>
      )}
      
      {/* Alerta de imagen seleccionada */}
      {showSeleccionadoAlerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <div className="flex justify-center mb-4">
              <Icono name="confirmar" size={60} />
            </div>
            <p className="text-center mb-4">
              Imagen seleccionada correctamente
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarProducto;