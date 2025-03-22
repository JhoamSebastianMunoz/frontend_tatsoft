import React, { useEffect } from 'react';
import Tipografia from '../../atoms/Tipografia';

const Pagina404 = () => {
  useEffect(() => {
    // Animación sutil para los elementos decorativos
    const decorElements = document.querySelectorAll('.decor-element');
    decorElements.forEach(element => {
      let randomDelay = Math.random() * 2;
      element.style.animation = `float 4s ease-in-out ${randomDelay}s infinite alternate`;
    });
  }, []);

  // Estilos con animaciones más sutiles y profesionales
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% { transform: translateY(0); }
        100% { transform: translateY(-10px); }
      }
      
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(1); opacity: 0.8; }
      }
      
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .error-number {
        background: linear-gradient(90deg, #F97316, #EA580C, #C2410C);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradientShift 3s ease infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-0 overflow-hidden">
      <div className="w-full md:w-1/2 relative h-[50vh] md:h-auto flex items-center justify-center p-4 md:p-8">
        {/* Fondo decorativo más sutil */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Elementos decorativos con geometría simple */}
          <div className="decor-element absolute w-48 md:w-64 h-48 md:h-64 border-4 border-orange-200 rounded-full top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 opacity-40"></div>
          
          <div className="decor-element absolute w-64 md:w-80 h-64 md:h-80 border-4 border-orange-100 rounded-full bottom-1/3 right-1/3 transform translate-x-1/4 translate-y-1/4 opacity-30"></div>
          
          <div className="decor-element absolute w-32 md:w-40 h-32 md:h-40 bg-orange-50 rounded-full top-1/2 right-1/2 transform translate-x-3/4 -translate-y-1/4 opacity-50"></div>
          
          {/* Puntos decorativos */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => {
              const size = Math.random() * 4 + 2;
              return (
                <div 
                  key={i}
                  className="decor-element absolute bg-orange-300 rounded-full"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `pulse ${2 + Math.random() * 2}s ease-in-out ${Math.random() * 3}s infinite`,
                    opacity: Math.random() * 0.5 + 0.1
                  }}
                ></div>
              );
            })}
          </div>
          
          {/* Número 404 más elegante */}
          <div className="error-number text-7xl sm:text-8xl md:text-[12rem] font-black text-center w-full select-none" style={{animation: "pulse 3s infinite ease-in-out"}}>
            404
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 text-center md:text-left md:pr-8 lg:pr-16 p-6 md:p-8 z-10 bg-white md:bg-transparent shadow-lg md:shadow-none rounded-lg md:rounded-none">
        <Tipografia>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 md:mb-6">
            Lo sentimos
          </h1>
          <div className="inline-block bg-orange-600 px-4 md:px-6 py-2 md:py-3 rounded-md mb-6 md:mb-8 shadow-md">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-white">Página no encontrada</h2>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Parece que te has aventurado demasiado lejos en el espacio digital. 
            Esta página no existe en nuestro universo.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
            <button 
              className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-600 hover:bg-orange-700 text-white text-sm sm:text-base font-medium rounded-md shadow-md transition-all duration-300 ease-in-out"
              onClick={() => window.location.href = '/'}
            >
              Volver al inicio
            </button>
            <button 
              className="px-4 sm:px-6 py-2 sm:py-3 bg-white hover:bg-gray-100 text-orange-600 text-sm sm:text-base font-medium rounded-md border border-orange-300 hover:border-orange-400 shadow-sm transition-all duration-300 ease-in-out"
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