import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../../../context/services/ApiService";
import { imageService } from "../../../context/services/ImageService";
import { useAuth } from "../../../context/AuthContext";
import Tipografia from "../../../components/atoms/Tipografia";
import Icono from "../../../components/atoms/Iconos";
import Boton from "../../../components/atoms/Botones";
import Loading from "../../../components/Loading/Loading";
import NavegacionAdministrador from "../../organisms/NavegacionAdm";
import NavegacionUsuario from "../../organisms/NavegacionUsuario";

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados para manejo del formulario
  const [formData, setFormData] = useState({
    nombre_producto: "",
    categoria: "",
    precio: "",
    cantidad_ingreso: "",
    descripcion: "",
    id_categoria: "",
    id_imagen: ""
  });

  // Estados para manejo de UI
  const [showCategorias, setShowCategorias] = useState(false);
  const [showNuevaCategoriaModal, setShowNuevaCategoriaModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Estados para alertas
  const [showCancelarAlerta, setShowCancelarAlerta] = useState(false);
  const [showExitosoAlerta, setShowExitosoAlerta] = useState(false);
  const [showSeleccionadoAlerta, setShowSeleccionadoAlerta] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Estado para el control de la barra de navegación
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  // Detectar el tamaño de la pantalla para modo responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMobileView(true);
        setSidebarOpen(false);
      } else {
        setMobileView(false);
        setSidebarOpen(true); // En escritorio, mantener abierto por defecto
      }
    };
    handleResize(); // Verificar tamaño inicial
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Cargar datos del producto y categorías
  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        setLoading(true);
       
        // Obtener categorías
        const categoriasResponse = await productService.getAllCategories();
        if (categoriasResponse.data && Array.isArray(categoriasResponse.data)) {
          setCategorias(categoriasResponse.data);
        }
       
        // Obtener datos del producto
        const productResponse = await productService.getProductById(id);
        if (productResponse.data) {
          const producto = productResponse.data;
         
          // Encontrar el nombre de la categoría
          let nombreCategoria = "";
          if (producto.id_categoria && categoriasResponse.data) {
            const categoriaEncontrada = categoriasResponse.data.find(
              cat => cat.id_categoria === producto.id_categoria
            );
            nombreCategoria = categoriaEncontrada ? categoriaEncontrada.nombre_categoria : "";
          }
         
          setFormData({
            nombre_producto: producto.nombre_producto || "",
            precio: producto.precio || "",
            cantidad_ingreso: producto.cantidad_ingreso || "",
            descripcion: producto.descripcion || "",
            id_categoria: producto.id_categoria || "",
            categoria: nombreCategoria,
            id_imagen: producto.id_imagen || ""
          });
         
          // Cargar la imagen actual si existe
          if (producto.id_imagen) {
            const imageUrl = await imageService.getImageUrl(producto.id_imagen);
            setCurrentImageUrl(imageUrl);
          }
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("No se pudieron cargar los datos del producto. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndCategories();
  }, [id]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
      // Subir nueva imagen si se seleccionó una
      let imageId = formData.id_imagen;
      if (imageFile) {
        setIsUploading(true);
        try {
          // Si hay una imagen anterior, intentar eliminarla
          if (formData.id_imagen) {
            await imageService.deleteImage(formData.id_imagen);
          }
         
          // Subir la nueva imagen
          const uploadResponse = await imageService.uploadImage(imageFile);
          if (uploadResponse && uploadResponse.url) {
            // Extraer el ID de la imagen de la URL o respuesta
            imageId = uploadResponse.fileName || uploadResponse.url.split('/').pop();
          }
        } catch (imageError) {
          console.error("Error procesando imagen:", imageError);
          setError("Hubo un problema con la imagen. El producto se actualizará sin cambiar la imagen.");
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
      // Actualizar el producto
      await productService.updateProduct(id, productData);
     
      // Mostrar alerta de éxito
      setShowExitosoAlerta(true);
      setTimeout(() => {
        setShowExitosoAlerta(false);
        navigate("/gestion-productos");
      }, 2000);
     
    } catch (error) {
      console.error("Error actualizando producto:", error);
      setError(
        error.response?.data?.error ||
        "Ocurrió un error al actualizar el producto. Por favor, intenta de nuevo."
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

  const agregarNuevaCategoria = async () => {
    if (nuevaCategoria.trim() === "") return;
   
    try {
      setLoading(true);
      const response = await productService.createCategory({
        nombre_categoria: nuevaCategoria,
        descripcion: `Categoría ${nuevaCategoria} para productos`
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
     
      setNuevaCategoria("");
      setShowNuevaCategoriaModal(false);
     
    } catch (error) {
      console.error("Error creando categoría:", error);
      setError("No se pudo crear la categoría. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.nombre_producto) {
    return <Loading message="Cargando datos del producto..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Botón para abrir/cerrar sidebar */}
      <button
        className="fixed top-3 left-4 z-30 p-2 bg-purple-900 text-white rounded-md hover:bg-purple-800 transition-colors duration-200"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              sidebarOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>
      
      {/* Overlay para el fondo cuando el sidebar está abierto en móvil */}
      {sidebarOpen && mobileView && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar con navegación condicional según rol */}
      <div
        className={`fixed left-0 top-0 z-20 h-full bg-white border-r shadow-lg border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {user && user.rol === "ADMINISTRADOR" ? (
          <NavegacionAdministrador />
        ) : (
          <NavegacionUsuario />
        )}
      </div>
     
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? "md:ml-64" : "ml-0"
      }`}>
        {/* Header */}
        <div className="bg-purple-600 text-white p-4 shadow-md">
          <Tipografia variant="h1" size="xl" className="text-white font-medium pl-10 md:pl-0">
            Editar Producto
          </Tipografia>
        </div>
       
        {/* Contenido principal */}
        <div className="flex-1 p-6 flex justify-center">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}
           
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Nombre del Producto*</label>
                  <input
                    type="text"
                    name="nombre_producto"
                    value={formData.nombre_producto}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
               
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría*</label>
                  <div className="relative">
                    <div
                      className="w-full p-2 border rounded flex justify-between items-center cursor-pointer"
                      onClick={() => setShowCategorias(!showCategorias)}
                    >
                      <span className="text-gray-700">
                        {formData.categoria || "Seleccione una categoría"}
                      </span>
                      <Icono name="despliegue" size={16} />
                    </div>
                   
                    {showCategorias && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                        {categorias.map((categoria) => (
                          <div
                            key={categoria.id_categoria}
                            className="p-2 hover:bg-purple-100 cursor-pointer"
                            onClick={() => handleCategoriaChange(categoria)}
                          >
                            {categoria.nombre_categoria}
                          </div>
                        ))}
                        <div
                          className="p-2 bg-purple-200 text-center hover:bg-purple-300 cursor-pointer"
                          onClick={() => {
                            setShowNuevaCategoriaModal(true);
                            setShowCategorias(false);
                          }}
                        >
                          + Agregar otra categoría
                        </div>
                      </div>
                    )}
                  </div>
                </div>
               
                <div>
                  <label className="block text-sm font-medium mb-1">Precio*</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
               
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    name="cantidad_ingreso"
                    value={formData.cantidad_ingreso}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                  />
                </div>
               
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 h-20"
                  ></textarea>
                </div>
              </div>
             
              {/* Sección de imagen */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Imagen del Producto</label>
               
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-32 bg-gray-100 border rounded flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="w-full h-full object-contain"
                      />
                    ) : currentImageUrl ? (
                      <img
                        src={currentImageUrl}
                        alt="Imagen actual"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Icono name="gest-productos" size={40} className="text-gray-400" />
                    )}
                  </div>
                 
                  <div className="flex-1">
                    <input
                      type="file"
                      id="imageInput"
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <label
                      htmlFor="imageInput"
                      className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md cursor-pointer hover:bg-purple-600 transition-colors"
                    >
                      <Icono name="subir-archivo" customColor="white" size={20} />
                      <span className="ml-2">Cambiar imagen</span>
                    </label>
                   
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.id_imagen && !imageFile ? (
                        "El producto ya tiene una imagen. Selecciona una nueva para reemplazarla."
                      ) : (
                        "Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 6MB"
                      )}
                    </p>
                  </div>
                </div>
              </div>
             
              <div className="flex justify-center space-x-4 mt-6">
                <Boton
                  tipo="cancelar"
                  label="Cancelar"
                  onClick={handleCancelar}
                />
               
                <Boton
                  tipo="primario"
                  label={loading ? "Guardando..." : "Guardar Cambios"}
                  type="submit"
                  disabled={loading || isUploading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
     
      {/* Modal para agregar nueva categoría */}
      {showNuevaCategoriaModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Agregar nueva categoría</h3>
           
            <input
              type="text"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nombre de la categoría"
            />
           
            <div className="flex justify-end space-x-2">
              <Boton
                label="Cancelar"
                tipo="cancelar"
                onClick={() => setShowNuevaCategoriaModal(false)}
              />
             
              <Boton
                label="Agregar"
                tipo="primario"
                onClick={agregarNuevaCategoria}
              />
            </div>
          </div>
        </div>
      )}
     
      {/* Alerta de cancelar edición */}
      {showCancelarAlerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <div className="flex justify-center mb-4">
              <Icono name="eliminarAlert" size={65} />
            </div>
            <p className="text-center mb-4">¿Desea cancelar la edición?</p>
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
     
      {/* Alerta de actualización exitosa */}
      {showExitosoAlerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <div className="flex justify-center mb-4">
              <Icono name="confirmar" size={65} />
            </div>
            <p className="text-center mb-4">Producto actualizado exitosamente</p>
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
            <p className="text-center mb-4">Imagen seleccionada correctamente</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarProducto;