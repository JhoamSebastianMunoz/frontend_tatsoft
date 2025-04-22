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
    id_categoria: "",
  });

  // Estado para errores de validación
  const [errores, setErrores] = useState({
    nombre_producto: "",
    precio: "",
    cantidad_ingreso: "",
    descripcion: "",
    id_categoria: "",
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
  const [showRegistroExitosoAlerta, setShowRegistroExitosoAlerta] =
    useState(false);
  const [showSeleccionadoAlerta, setShowSeleccionadoAlerta] = useState(false);
  const [showCancelarCategoriaAlerta, setShowCancelarCategoriaAlerta] =
    useState(false);
  const [showCategoriaCreadaAlerta, setShowCategoriaCreadaAlerta] =
    useState(false);
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
        setLoading(true);
        const response = await productService.getAllCategories();
        if (response.data && Array.isArray(response.data)) {
          setCategorias(response.data);
        }
      } catch (error) {
        console.error("Error cargando categorías:", error);
        setError(
          "No se pudieron cargar las categorías. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
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
      [name]: value,
    });

    // Limpiar error si el usuario está modificando el campo
    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: "",
      });
    }
  };

  const handleCategoriaChange = (categoria) => {
    setFormData({
      ...formData,
      categoria: categoria.nombre_categoria,
      id_categoria: categoria.id_categoria,
    });
    setShowCategorias(false);
    // Limpiar error de categoría
    setErrores({
      ...errores,
      id_categoria: "",
    });
  };

  // Modificación en la función handleImageChange
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Comprobar tamaño y tipo de archivo
      const maxSize = 5 * 1024 * 1024; // 5MB
      const acceptedTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (file.size > maxSize) {
        setError(
          `El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(
            2
          )}MB). Máximo 5MB.`
        );
        return;
      }

      if (!acceptedTypes.includes(file.type)) {
        setError(`Tipo de archivo no permitido. Solo se permiten: JPG, PNG.`);
        return;
      }

      console.log("Archivo seleccionado:", file.name, file.type, file.size);

      // Limpiar error previo si existe
      setError("");

      // Guardar el archivo para enviarlo al servidor posteriormente
      setImageFile(file);

      // Crear la vista previa
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        console.log(
          "Vista previa generada:",
          reader.result.substring(0, 50) + "..."
        );
      };
      reader.onerror = () => {
        console.error("Error al leer el archivo");
        setError("Error al procesar la imagen. Intente con otra imagen.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Función de validación del formulario
  const validarFormulario = () => {
    let erroresTemp = {};
    let esValido = true;

    // Validar nombre del producto (solo letras, números y espacios, mínimo 3 caracteres)
    if (!formData.nombre_producto.trim()) {
      erroresTemp.nombre_producto = "El nombre del producto es obligatorio";
      esValido = false;
    } else if (formData.nombre_producto.trim().length < 3) {
      erroresTemp.nombre_producto =
        "El nombre debe tener al menos 3 caracteres";
      esValido = false;
    } else if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ0-9\s]+$/.test(formData.nombre_producto)) {
      erroresTemp.nombre_producto =
        "El nombre solo debe contener letras, números y espacios";
      esValido = false;
    }

    // Validar precio (debe ser un número positivo)
    if (!formData.precio) {
      erroresTemp.precio = "El precio es obligatorio";
      esValido = false;
    } else if (isNaN(Number(formData.precio)) || Number(formData.precio) <= 0) {
      erroresTemp.precio = "El precio debe ser un número mayor a 0";
      esValido = false;
    }

    // Validar cantidad (debe ser un número entero positivo)
    if (!formData.cantidad_ingreso) {
      erroresTemp.cantidad_ingreso = "La cantidad es obligatoria";
      esValido = false;
    } else if (
      isNaN(Number(formData.cantidad_ingreso)) ||
      Number(formData.cantidad_ingreso) <= 0 ||
      !Number.isInteger(Number(formData.cantidad_ingreso))
    ) {
      erroresTemp.cantidad_ingreso =
        "La cantidad debe ser un número entero mayor a 0";
      esValido = false;
    }

    // Validar descripción (mínimo 10 caracteres)
    if (!formData.descripcion.trim()) {
      erroresTemp.descripcion = "La descripción es obligatoria";
      esValido = false;
    } else if (formData.descripcion.trim().length < 10) {
      erroresTemp.descripcion =
        "La descripción debe tener al menos 10 caracteres";
      esValido = false;
    }

    // Validar categoría seleccionada
    if (!formData.id_categoria) {
      erroresTemp.id_categoria = "Debe seleccionar una categoría";
      esValido = false;
    }

    setErrores(erroresTemp);
    return esValido;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el formulario antes de enviar
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imageId = null;

      // Subir imagen si existe
      if (imageFile) {
        setIsUploading(true);
        // Crear un objeto FormData correctamente para la subida
        const imageFormData = new FormData();
        // Es importante que el nombre del campo sea exactamente 'image', como espera el backend
        imageFormData.append("image", imageFile);

        try {
          console.log("Enviando imagen:", imageFile);
          // Verificamos que el FormData contiene la imagen
          for (let [key, value] of imageFormData.entries()) {
            console.log(
              `${key}: ${value instanceof File ? value.name : value}`
            );
          }

          const imageResponse = await imageService.uploadImage(imageFormData);
          console.log("Respuesta de subida de imagen:", imageResponse);

          // Inspeccionar la estructura completa de la respuesta para entender dónde está el ID
          console.log(
            "Estructura completa de la respuesta:",
            JSON.stringify(imageResponse.data, null, 2)
          );

          // Intentar las diferentes posibles ubicaciones del ID
          imageId =
            imageResponse.data.id ||
            imageResponse.data.fileName ||
            imageResponse.data.imageId;

          // Si tenemos una URL pero no un ID, usamos el nombre del archivo de la URL
          if (!imageId && imageResponse.data.url) {
            const urlParts = imageResponse.data.url.split("/");
            imageId = urlParts[urlParts.length - 1];
          }

          // Si todavía no tenemos ID, usamos el nombre del archivo original
          if (!imageId && imageFile) {
            imageId = imageFile.name;
          }

          console.log("ID de imagen obtenido:", imageId);
        } catch (imageError) {
          console.error("Error al subir la imagen:", imageError);
          setError("Error al subir la imagen. Por favor, intenta de nuevo.");
          setLoading(false);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      // Crear producto
      const productoData = {
        nombre_producto: formData.nombre_producto.trim(),
        precio: parseFloat(formData.precio),
        cantidad_ingreso: parseInt(formData.cantidad_ingreso),
        descripcion: formData.descripcion.trim() || "Sin descripción",
        id_categoria: parseInt(formData.id_categoria),
        estado: "Activo",
        // El campo id_imagen es obligatorio según el backend
        id_imagen: imageId || "default_image", // Proporcionamos un valor por defecto si no hay imagen
      };

      console.log("Enviando datos del producto:", productoData);

      try {
        const response = await productService.createProduct(productoData);
        console.log("Respuesta de creación de producto:", response);

        if (response && response.data) {
          setShowRegistroExitosoAlerta(true);

          // Limpiar formulario
          setFormData({
            nombre_producto: "",
            categoria: "",
            precio: "",
            cantidad_ingreso: "",
            descripcion: "",
            id_categoria: "",
          });
          setImageFile(null);
          setImagePreview(null);

          setTimeout(() => {
            navigate("/gestion-productos");
          }, 2000);
        } else {
          throw new Error("No se recibió respuesta del servidor");
        }
      } catch (error) {
        console.error("Error al crear el producto:", error);
        if (error.response && error.response.data) {
          console.log("Detalles del error:", error.response.data);
          setError(
            `Error al crear el producto: ${
              error.response.data.message || "Intente nuevamente"
            }`
          );
        } else {
          setError("Error al crear el producto. Por favor, intenta de nuevo.");
        }
      }
    } catch (error) {
      console.error("Error al registrar producto:", error);
      setError(
        "Ocurrió un error al registrar el producto. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    if (
      formData.nombre_producto ||
      formData.precio ||
      formData.cantidad_ingreso ||
      formData.categoria ||
      formData.descripcion
    ) {
      setShowCancelarAlerta(true);
    } else {
      navigate("/gestion-productos");
    }
  };

  const confirmarCancelar = () => {
    navigate("/gestion-productos");
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

  const validarNuevaCategoria = () => {
    if (!nuevaCategoria.trim()) {
      setCategoriaError("El nombre de la categoría es obligatorio");
      return false;
    } else if (nuevaCategoria.trim().length < 3) {
      setCategoriaError("El nombre debe tener al menos 3 caracteres");
      return false;
    } else if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(nuevaCategoria.trim())) {
      setCategoriaError("El nombre solo debe contener letras y espacios");
      return false;
    }
    return true;
  };

  const agregarNuevaCategoria = async () => {
    // Validar que haya un nombre de categoría
    if (!validarNuevaCategoria()) {
      return;
    }

    try {
      setLoading(true);
      const response = await productService.createCategory({
        nombre_categoria: nuevaCategoria.trim(),
        descripcion: `Categoría para productos`, // Descripción genérica predeterminada
      });

      // Actualizar lista de categorías
      const categoriasResponse = await productService.getAllCategories();
      setCategorias(categoriasResponse.data);

      // Seleccionar la nueva categoría
      const nuevaCategoriaObj = categoriasResponse.data.find(
        (c) => c.nombre_categoria === nuevaCategoria.trim()
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
      setCategoriaError(
        "No se pudo crear la categoría. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showNuevaCategoriaModal && !showCancelarCategoriaAlerta) {
    return <Loading message="Registrando producto..." />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col md:flex-row bg-slate-50 pl-5">
      <div className="w-full md:w-64 md:fixed md:top-0 md:left-0 md:h-full z-10">
        <div className="block md:hidden">
          <Sidebar />
        </div>
        <div className="hidden md:block">
          <Sidebar />
        </div>
      </div>
      <div className="flex-1 pl-3 md:pl-20 w-full lg:pl-[60px] px-3 sm:px-4 md:px-6 lg:px-8 ml-5">
        <div className="mt-4 mb-5">
          <Tipografia>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 ml-5">
              Registrar Producto
            </h1>
          </Tipografia>
        </div>
        <Tipografia>
          {error && (
            <div className="flex bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <Icono className="mr-2" name="eliminarAlert" size={20} />
              <p>{error}</p>
            </div>
          )}
        </Tipografia>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Tipografia>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen del producto (opcional)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Tamaño máximo: 5MB. Formatos aceptados: JPG, PNG.
                  </p>

                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-orange-500 transition-colors">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Vista previa"
                            className="mx-auto h-48 w-auto object-contain"
                            onError={(e) => {
                              console.error("Error al cargar la imagen");
                              setError(
                                "Error al mostrar la vista previa. La imagen podría estar corrupta."
                              );
                              e.target.style.display = "none";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <Icono
                            name="gest-productos"
                            size={40}
                            className="mx-auto text-gray-400"
                          />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                            >
                              <span>Subir imagen</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                            <p className="pl-1">o arrastra y suelta</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Tipografia>
              <div>
                <Tipografia>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del producto *
                  </label>
                  <input
                    type="text"
                    name="nombre_producto"
                    value={formData.nombre_producto}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errores.nombre_producto
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    required
                  />
                  {errores.nombre_producto && (
                    <p className="mt-1 text-xs text-red-600">
                      {errores.nombre_producto}
                    </p>
                  )}
                </Tipografia>
              </div>
              <div>
                <Tipografia>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      className={`w-full pl-7 pr-3 py-2 border ${
                        errores.precio ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {errores.precio && (
                    <p className="mt-1 text-xs text-red-600">
                      {errores.precio}
                    </p>
                  )}
                </Tipografia>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <Tipografia>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <div className="relative">
                    <select
                      name="id_categoria"
                      value={formData.id_categoria}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errores.id_categoria
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none`}
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat.id_categoria} value={cat.id_categoria}>
                          {cat.nombre_categoria}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  {errores.id_categoria && (
                    <p className="mt-1 text-xs text-red-600">
                      {errores.id_categoria}
                    </p>
                  )}
                </Tipografia>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={abrirModalNuevaCategoria}
                    className="text-sm text-orange-600 hover:text-orange-800"
                  >
                    + Crear nueva categoría
                  </button>
                </div>
              </div>
              <div>
                <Tipografia>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    name="cantidad_ingreso"
                    value={formData.cantidad_ingreso}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errores.cantidad_ingreso
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    required
                    min="0"
                  />
                  {errores.cantidad_ingreso && (
                    <p className="mt-1 text-xs text-red-600">
                      {errores.cantidad_ingreso}
                    </p>
                  )}
                </Tipografia>
              </div>
              <div>
                <Tipografia>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-3 py-2 border ${
                      errores.descripcion ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="Describe el producto"
                    required
                  />
                  {errores.descripcion && (
                    <p className="mt-1 text-xs text-red-600">
                      {errores.descripcion}
                    </p>
                  )}
                </Tipografia>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-8">
            <Boton
              tipo="secundario"
              label="Cancelar"
              onClick={handleCancelar}
              className="order-2 sm:order-1"
            />
            <Boton
              tipo="primario"
              label="Registrar Producto"
              size="small"
              type="submit"
              disabled={loading || isUploading}
              className="order-1 sm:order-2"
            />
          </div>
        </form>
        {/* Modales */}
        {showCancelarAlerta && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
              <div className="flex justify-center mb-4">
                <Icono name="alerta" size={24} customColor="#F59E0B" />
              </div>
              <Tipografia variant="h2" size="xl" className="text-center mb-4">
                ¿Desea cancelar la operación?
              </Tipografia>
              <Tipografia
                size="base"
                className="text-center text-gray-600 ml-10"
              >
                Si cancela, perderá todos los datos que ha ingresado. ¿Está
                seguro que desea salir?
              </Tipografia>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-3">
                <Boton
                  tipo="secundario"
                  label="No, Continuar"
                  size="small"
                  onClick={() => setShowCancelarAlerta(false)}
                  className="w-full sm:w-[200px] h-[45px] order-1"
                />
                <Boton
                  tipo="cancelar"
                  label="Sí, Cancelar"
                  size="small"
                  onClick={confirmarCancelar}
                  className="w-full sm:w-[200px] h-[45px] order-2"
                />
              </div>
            </div>
          </div>
        )}

        {showRegistroExitosoAlerta && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <Icono name="confirmar" size="50" />
              </div>
              <Tipografia variant="h2" size="xl" className="text-center mb-4">
                ¡Producto registrado exitosamente!
              </Tipografia>
            </div>
          </div>
        )}

        {/* Modal para crear nueva categoría */}
        {showNuevaCategoriaModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <Tipografia variant="h2" size="lg" className="font-semibold">
                  Crear nueva categoría
                </Tipografia>
                <button
                  onClick={cerrarModalNuevaCategoria}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la categoría *
                </label>
                <input
                  type="text"
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  className={`w-full px-3 py-2 border ${
                    categoriaError ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Ejemplo: Lácteos, Cárnicos, etc."
                />
                {categoriaError && (
                  <p className="mt-1 text-sm text-red-600">{categoriaError}</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Boton
                  tipo="secundario"
                  label="Cancelar"
                  onClick={cerrarModalNuevaCategoria}
                />
                <Boton
                  tipo="primario"
                  label="Crear Categoría"
                  onClick={agregarNuevaCategoria}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        )}

        {showCancelarCategoriaAlerta && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
              <div className="flex justify-center mb-4">
                <Icono name="eliminarAlert" size={65} />
              </div>
              <Tipografia variant="h2" size="xl" className="text-center mb-4">
                ¿Estás seguro de que deseas cancelar?
              </Tipografia>
              <Tipografia size="base" className="text-center text-gray-600">
                Se perderán los cambios realizados en la nueva categoría.
              </Tipografia>
              <div className="flex justify-center space-x-3 mt-6">
                <Boton
                  tipo="secundario"
                  label="Continuar editando"
                  size="small"
                  onClick={cancelarCancelarCategoria}
                />
                <Boton
                  tipo="primario"
                  label="Sí, cancelar"
                  size="small"
                  onClick={confirmarCancelarCategoria}
                />
              </div>
            </div>
          </div>
        )}

        {showCategoriaCreadaAlerta && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
              <div className="flex justify-center mb-4 text-green-500">
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <Tipografia variant="h2" size="xl" className="text-center mb-4">
                ¡Categoría creada exitosamente!
              </Tipografia>
              <Tipografia size="sm" className="text-center text-gray-500 mb-4">
                La categoría ha sido seleccionada para el producto.
              </Tipografia>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrarProducto;
