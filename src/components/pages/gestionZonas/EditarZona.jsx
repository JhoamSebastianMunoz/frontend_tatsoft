import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { areaService } from "../../../context/services/ApiService";
import Tipografia from "../../../components/atoms/Tipografia";
import Icono from "../../../components/atoms/Iconos";
import Boton from "../../../components/atoms/Botones";
import Sidebar from "../../organisms/Sidebar";

const EditarZona = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [zona, setZona] = useState({
    nombre_zona_trabajo: "",
    descripcion: "",
  });

  const [zonaOriginal, setZonaOriginal] = useState(null);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mostrarAlertaCancelar, setMostrarAlertaCancelar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar datos de la zona al iniciar
  useEffect(() => {
    const fetchZona = async () => {
      try {
        setLoading(true);
        const response = await areaService.getAreaById(id);

        if (response && response.data) {
          const zonaData = Array.isArray(response.data)
            ? response.data[0]
            : response.data;

          if (zonaData && zonaData.nombre_zona_trabajo) {
            const datosZona = {
              nombre_zona_trabajo: zonaData.nombre_zona_trabajo || "",
              descripcion: zonaData.descripcion || "",
            };

            setZona(datosZona);
            setZonaOriginal(datosZona); // Guardamos los datos originales
          } else {
            setError(
              "Los datos de la zona están incompletos o en un formato incorrecto"
            );
          }
        } else {
          setError("No se encontraron datos de la zona");
        }
      } catch (error) {
        console.error("Error al cargar datos de la zona:", error);
        setError(
          "Error al cargar los datos de la zona. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchZona();
    } else {
      setError("No se proporcionó ID de zona");
    }
  }, [id]);

  // Función para verificar si hay cambios sin guardar
  const hayCambiosSinGuardar = () => {
    if (!zonaOriginal) return false;
    return (
      zona.nombre_zona_trabajo !== zonaOriginal.nombre_zona_trabajo ||
      zona.descripcion !== zonaOriginal.descripcion
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setZona((prevZona) => ({
      ...prevZona,
      [name]: value,
    }));
  };

  const handleGuardarClick = (e) => {
    e.preventDefault();

    // Validar campos requeridos
    if (!zona.nombre_zona_trabajo || !zona.descripcion) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    setMostrarAlerta(true);
  };

  const handleConfirmarGuardar = async () => {
    setMostrarAlerta(false);
    setLoading(true);
    setError("");

    try {
      // Preparar datos para la API
      const zonaData = {
        nombre_zona_trabajo: zona.nombre_zona_trabajo,
        descripcion: zona.descripcion,
      };

      await areaService.updateArea(id, zonaData);

      // Actualizar el estado original con los nuevos datos guardados
      setZonaOriginal({ ...zona });
      setGuardado(true);

      setTimeout(() => {
        setGuardado(false);
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar zona:", error);
      setError(
        "Error al actualizar la zona. Por favor, intenta de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    if (hayCambiosSinGuardar()) {
      setMostrarAlertaCancelar(true);
    } else {
      navigate("/gestion-zonas");
    }
  };

  const handleConfirmarCancelar = () => {
    setMostrarAlertaCancelar(false);
    navigate("/gestion-zonas");
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-auto md:fixed md:top-0 md:left-0 md:h-full z-10">
        <div className="block md:hidden">
          <Sidebar />
        </div>
        <div className="hidden md:block">
          <Sidebar />
        </div>
      </div>
      <div className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 pl-2 pr-10 ml-10">
        <Tipografia>
          <div className="mt-4 mb-5 relative">
            {/* Agregamos el icono de volver a la izquierda con posicionamiento absoluto */}
            <div
              className="cursor-pointer hover:opacity-80 transition-opacity ml-8 md:ml-48"
              onClick={handleCancelar}
            >
              <Icono name="volver" size={45} color="#F78220" />
            </div>
          </div>
          {error && (
            <div className="flex mb-4 p-4 bg-red-50 border border-red-200 rounded-lg ml-4">
              <Icono className="mr-2" name="eliminarAlert" size={20} />
              <p className="text-red-600">{error}</p>
            </div>
          )}
          <div className="max-w-4xl mx-auto pl-6 pr-3">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
              <div className="mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#F78220] rounded-full"></div>
                  <Tipografia size="xl" className="font-semibold text-gray-800">
                    Editando Zona
                  </Tipografia>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <p className="font-bold text-orange-800 mt-6">
                      Información de la Zona
                    </p>
                    <label className="text-sm font-medium text-black block">
                      Nombre de la zona
                    </label>
                    <input
                      type="text"
                      name="nombre_zona_trabajo"
                      value={zona.nombre_zona_trabajo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150 ease-in-out"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={zona.descripcion}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150 ease-in-out h-32"
                    />
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
                  label="Guardar cambios"
                  tipo="primario"
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </Tipografia>
      </div>

      {/* Modal de confirmación de guardar */}
      {mostrarAlerta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-5">
              <div className="text-center">
                <Tipografia>
                  <Icono name="confirmar" size="50" />
                  <h3 className="text-xl font-medium text-black mb-2">
                    ¿Desea guardar los cambios?
                  </h3>
                  <p className="text-base text-black">
                    Esta acción actualizará la información de la zona. ¿Estás
                    seguro de continuar?
                  </p>
                </Tipografia>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <Boton
                onClick={handleConfirmarGuardar}
                label="Confirmar"
                tipo="primario"
                className="w-full"
              />
              <Boton
                onClick={() => setMostrarAlerta(false)}
                label="Cancelar"
                tipo="secundario"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación exitosa */}
      {guardado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-5">
              <div className="text-center">
                <Tipografia>
                  <Icono name="confirmar" size="50" />
                  <h3 className="text-lg font-medium text-black mb-3">
                    ¡Cambios guardados con éxito!
                  </h3>
                </Tipografia>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de cancelar */}
      {mostrarAlertaCancelar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-5">
              <div className="text-center">
                <Tipografia>
                  <Icono name="alerta" size={24} customColor="#F59E0B"  />
                  <h3 className="text-lg font-medium text-black mb-3">
                    ¿Desea salir sin guardar?
                  </h3>
                  <p className="text-sm text-black mb-4">
                    Hay cambios sin guardar. Si sales ahora, perderás los
                    cambios realizados.
                  </p>
                </Tipografia>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-col gap-3">
              <Boton
                onClick={() => setMostrarAlertaCancelar(false)}
                label="Continuar editando"
                tipo="secundario"
                className="w-full"
              />
              <Boton
                onClick={handleConfirmarCancelar}
                label="Sí, Cancelar"
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

export default EditarZona;
