import React, { useEffect } from 'react';
import Tipografia from '../../atoms/Tipografia';

const Pagina404 = () => {
  useEffect(() => {
    const planets = document.querySelectorAll('.planet');
    planets.forEach(planet => {
      let randomDelay = Math.random() * 2;
      planet.style.animation = `float 3s ease-in-out ${randomDelay}s infinite alternate`;
    });
  }, []);

  // Animaciones completamente rediseñadas
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Animación de ondulación con efecto de onda líquida */
      @keyframes liquidWave {
        0% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
        50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
        100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
      }
      
      /* Animación de desplazamiento lateral */
      @keyframes sideDrift {
        0% { transform: translateX(0); }
        50% { transform: translateX(20px); }
        100% { transform: translateX(0); }
      }
      
      /* Animación de desplazamiento vertical */
      @keyframes verticalDrift {
        0% { transform: translateY(0); }
        50% { transform: translateY(20px); }
        100% { transform: translateY(0); }
      }
      
      /* Animación de estrellas fugaces */
      @keyframes shootingStar {
        0% { 
          transform: translateX(0) translateY(0) scale(1);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% { 
          transform: translateX(300px) translateY(300px) scale(0.2);
          opacity: 0;
        }
      }
      
      /* Animación de latido */
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      
      /* Animación tipo "aurora boreal" para fondos */
      @keyframes auroraEffect {
        0% { 
          opacity: 0.5;
          filter: hue-rotate(0deg) blur(10px);
        }
        50% { 
          opacity: 0.7;
          filter: hue-rotate(30deg) blur(15px);
        }
        100% { 
          opacity: 0.5;
          filter: hue-rotate(0deg) blur(10px);
        }
      }
      
      /* Animación para números parpadeantes al estilo "error" */
    //   @keyframes glitchEffect {
    //     0% { 
    //       text-shadow: 0.05em 0 0 rgba(100, 2, 129, 0.75), -0.05em -0.025em 0 rgba(206, 25, 230, 0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75);
    //     }
    //     14% { 
    //       text-shadow: 0.05em 0 0 rgba(195, 0, 255, 0.99), -0.05em -0.025em 0 rgba(101, 166, 252, 0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75);
    //     }
    //     15% { 
    //       text-shadow: -0.05em -0.025em 0 rgba(225, 0, 255, 0.75), 0.025em 0.025em 0 rgba(0, 255, 170, 0.75), -0.05em -0.05em 0 rgba(84, 47, 143, 0.75);
    //     }
    //     49% { 
    //       text-shadow: -0.05em -0.025em 0 rgba(183, 0, 255, 0.93), 0.025em 0.025em 0 rgba(92, 5, 253, 0.77), -0.05em -0.05em 0 rgba(108, 16, 168, 0.9);
    //     }
    //     50% { 
    //       text-shadow: 0.025em 0.05em 0 rgba(195, 0, 255, 0.75), 0.05em 0 0 rgba(10, 78, 204, 0.75), 0 -0.05em 0 rgba(212, 0, 255, 0.75);
    //     }
    //     99% { 
    //       text-shadow: 0.025em 0.05em 0 rgba(0, 225, 255, 0.75), 0.05em 0 0 rgba(255, 0, 200, 0.75), 0 -0.05em 0 rgba(0,0,255,0.75);
    //     }
    //     100% { 
    //       text-shadow: -0.025em 0 0 rgba(255,0,0,0.75), -0.025em -0.025em 0 rgba(255, 0, 128, 0.75), -0.025em -0.05em 0 rgba(40, 4, 70, 0.75);
    //     }
    //   }
    // `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-purple-800 to-purple-500 p-0 overflow-hidden">
      {/* Ilustración - Aumentada de tamaño */}
      <div className="w-full md:w-1/2 mb-10 md:mb-0 relative h-screen md:h-screen flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Elementos rediseñados con nuevas animaciones */}
          
          {/* Formas orgánicas en movimiento */}
          <div className="absolute w-72 h-72 bg-gradient-to-br from-purple-700 via-purple-500 to-purple-300 top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 opacity-70"
               style={{borderRadius: "60% 40% 30% 60%/60% 30% 70% 40%", animation: "liquidWave 8s ease-in-out infinite, sideDrift 15s ease-in-out infinite"}}>
          </div>
          
          <div className="absolute w-56 h-56 bg-gradient-to-br from-indigo-600 via-violet-500 to-fuchsia-400 bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2 opacity-60"
               style={{borderRadius: "40% 60% 70% 30%/40% 50% 60% 50%", animation: "liquidWave 8s ease-in-out infinite alternate, verticalDrift 13s ease-in-out infinite"}}>
          </div>
          
          {/* Efecto de aurora boreal */}
          <div className="absolute w-full h-full opacity-30">
            <div className="absolute w-full h-96 bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-800 top-0 opacity-70 blur-3xl"
                 style={{animation: "auroraEffect 15s ease-in-out infinite"}}></div>
          </div>
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => {
              const size = Math.random() * 3 + 1;
              return (
                <div 
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `pulse ${1 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
                    opacity: Math.random() * 0.7 + 0.3
                  }}
                ></div>
              );
            })}
          </div>
          
          <div className="absolute text-9xl md:text-[15rem] font-black text-white  text-center w-full select-none"
               style={{animation: "glitchEffect 2.5s infinite"}}>
            404
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 text-center md:text-left md:pl-16 p-8 md:p-0">
        <Tipografia>
          <h1 className="text-7xl md:text-8xl font-bold text-purple-100 mb-6 drop-shadow-lg">
            Oops!
          </h1>
          <div className="inline-block bg-purple-500 px-6 py-3 rounded-lg mb-8 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Página no encontrada</h2>
          </div>
          <p className="text-xl md:text-2xl text-white mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Parece que te has aventurado demasiado lejos en el espacio digital. 
            Esta página no existe en nuestro universo.
          </p>
          <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6 justify-center md:justify-start">
            <button 
              className="px-8 py-4 bg-white hover:bg-purple-300 text-purple-800 text-lg font-medium rounded-lg shadow-lg transition-transform transform hover:scale-105"
              onClick={() => window.location.href = '/'}
            >
              Volver a casa
            </button>
            <button 
              className="px-8 py-4 bg-white hover:bg-purple-800 text-purple-800 hover:text-white text-lg font-medium rounded-lg border-2 border-purple-500 hover:border-transparent shadow-lg transition-transform transform hover:scale-105"
              onClick={() => window.history.back()}
            >
              Página anterior
            </button>
          </div>
        </Tipografia>
      </div>
    </div>
  );
};

export default Pagina404;