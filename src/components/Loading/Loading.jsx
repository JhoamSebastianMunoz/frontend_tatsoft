import React from 'react';
import Tipografia from '../atoms/Tipografia';

const Loading = ({ message = "Cargando" }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600 mb-4"></div>
      <Tipografia size="lg" className="text-gray-700">
        {message}
      </Tipografia>
    </div>
  );
};

export default Loading;