import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { areaService } from "../../../context/services/ApiService";
import Icono from "../../../components/atoms/Iconos";
import Tipografia from "../../../components/atoms/Tipografia";
import Boton from "../../../components/atoms/Botones";
import Sidebar from "../../organisms/Sidebar";
import CamposTexto from "../../../components/atoms/CamposTexto";

const RegistrarZona = () => {
  const navigate = useNavigate();
  const [zona, setZona] = useState({
    nombre_zona_trabajo: "",
    descripcion: "",
    ubicacion: { lat: 23.6345, lng: -102.5528 },
  });
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setZona({ ...zona, [e.target.name]: e.target.value });
  };

  const handleMapClick = (event) => {
    // Simulación de clic en mapa, en una implementación real usaríamos el API de Google Maps
    const randomLat = 23.6345 + (Math.random() - 0.5) * 0.01;
    const randomLng = -102.5528 + (Math.random() - 0.5) * 0.01;

    setZona({
      ...zona,
      ubicacion: { lat: randomLat, lng: randomLng },
    });
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
        // Agregar coordenadas si se necesitan
        latitud: zona.ubicacion.lat,
        longitud: zona.ubicacion.lng,
      };

      await areaService.createArea(zonaData);

      setGuardado(true);
      setTimeout(() => navigate("/gestion-zonas"), 2000);
    } catch (error) {
      console.error("Error al registrar zona:", error);
      setError(
        "Error al registrar la zona. Por favor, intenta de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      <div className="bg-slate-50 flex-1 pl-4 sm:pl-8 md:pl-20 w-full px-3 sm:px-4 md:px-6 lg:px-8 ml-0 sm:ml-6 md:ml-10">
        <Tipografia>
          <div className="mt-4 mb-5">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Registrar Zona
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-3xl mx-auto">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 rounded">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}

            <form
              onSubmit={handleGuardarClick}
              className="space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la zona
                  </label>
                  <CamposTexto
                    type="text"
                    name="nombre_zona_trabajo"
                    value={zona.nombre_zona_trabajo}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese el nombre de la zona"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción:
                  </label>
                  <textarea
                    name="descripcion"
                    value={zona.descripcion}
                    onChange={handleChange}
                    className="w-full p-2 border border-purple-200 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 rounded-lg"
                    required
                    rows="4"
                    placeholder="Descripción de la zona y detalles relevantes"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación:
                </label>
                <div className="text-sm mb-2 text-gray-600">
                  Coordenadas: {zona.ubicacion.lat.toFixed(4)},{" "}
                  {zona.ubicacion.lng.toFixed(4)}
                </div>

                {/* Simulación de mapa */}
                <div
                  className="w-full h-40 sm:h-48 md:h-56 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={handleMapClick}
                >
                  <div className="text-center text-gray-600 p-3 sm:p-4">
                    <div className="text-2xl sm:text-3xl mb-2">📍</div>
                    <div className="text-xs sm:text-sm md:text-base">
                      Haz clic para simular selección de ubicación
                    </div>
                    <div className="text-[10px] sm:text-xs mt-1 text-gray-500">
                      (Se requiere API key de Google Maps para mostrar el mapa
                      real)
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 pt-4">
                <Boton
                  type="button"
                  label="Cancelar"
                  onClick={() => navigate("/gestion-zonas")}
                  tipo="secundario"
                  className="w-full sm:w-auto"
                />
                <Boton
                  type="submit"
                  label={loading ? "Guardando..." : "Guardar"}
                  disabled={loading}
                  tipo="primario"
                />
              </div>
            </form>
          </div>
        </Tipografia>
      </div>

      {/* Alerta de Confirmación */}
      {mostrarAlerta && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg text-center max-w-xs sm:max-w-sm md:max-w-md w-full mx-auto">
            <Icono
              name="pregunta"
              size={50}
              className="mx-auto mb-4 text-purple-600"
            />
            <Tipografia className="text-lg font-semibold mb-2">
              ¿Desea registrar esta zona?
            </Tipografia>
            <Tipografia className="text-sm text-gray-500 mb-4">
              Confirme para guardar la información de la zona.
            </Tipografia>
            <div className="flex justify-center mt-4 gap-2">
              <Boton
                onClick={() => setMostrarAlerta(false)}
                label="Cancelar"
                tipo="cancelar"
              />
              <Boton
                onClick={handleConfirmarGuardar}
                label="Confirmar"
                tipo="primario"
              />
            </div>
          </div>
        </div>
      )}

      {/* Alerta de Registro Exitoso */}
      {guardado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg text-center max-w-xs sm:max-w-sm md:max-w-md w-full mx-auto">
            <Icono
              name="confirmar"
              size={50}
              className="mx-auto mb-4 text-green-500"
            />
            <Tipografia className="text-lg font-semibold">
              Zona registrada con éxito
            </Tipografia>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarZona;
