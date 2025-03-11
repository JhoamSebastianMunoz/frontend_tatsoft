import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tipografia from "../../components/atoms/Tipografia";
import Logo from "../../components/atoms/Logo";
import CamposTexto from "../../components/atoms/CamposTexto";
import Botones from "../../components/atoms/Botones";
import image from "../../assets/pixelcut-export (1).jpg";
import { BallTriangle } from "react-loader-spinner";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/admi");
    }, 1500);
  };

  return (
    <Tipografia>
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#842AF3] via-[#DA33E1] to-[#52307C] ">
        <div className="w-full max-w-4xl bg-white md:rounded-3xl md:shadow-lg overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 relative">
            <img
              src={image}
              alt="Login Visual"
              className="w-full h-[53vh] md:h-full object-cover md:clip-path-[ellipse(100%_100%_at_0%_50%)]"
            />
          </div>
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center items-center">
            <Logo className="mb-4 md:mb-6" />
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-center">
              Bienvenidos a Tatsoft
            </h2>
            <div className="w-full max-w-sm">
              <CamposTexto label="Correo electrónico" type="email" />
              <CamposTexto label="Contraseña" type="password" />
              <div className="flex justify-end mt-3 md:mt-4">
                <p
                  className="text-purple-800 font-bold text-sm cursor-pointer"
                  onClick={() => navigate("/recuperar-password")}
                >
                  ¿Olvidaste la contraseña?
                </p>
              </div>
              <div className="mt-4 md:mt-5 flex justify-center">
                {loading ? (
                  <BallTriangle
                    height={50}
                    width={50}
                    radius={5}
                    color="#842AF3"
                    ariaLabel="ball-triangle-loading"
                    visible={true}
                  />
                ) : (
                  <Botones 
                    label="Iniciar sesión" 
                    tipo="secundario" 
                    onClick={handleLogin}
                  />
                )}
              </div>
              <footer className="text-center text-xs text-gray-500 mt-4">
                con ❤️ por Tatsoft - 2024
              </footer>
            </div>
          </div>
        </div>
      </div>
    </Tipografia>
  );
};

export default Login;