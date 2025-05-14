'use client';
import React, { useState } from 'react';
import styles from '@/app/admin/dashboard/dashboard.module.css';

const ChartCard = ({ title, children, className = '' }) => {
  const [showOptions, setShowOptions] = useState(false);
  
  const handleDownload = () => {
    // Esta función simularía la descarga del gráfico
    alert('Función de descarga: En un entorno real, esta acción descargaría el gráfico como imagen o PDF.');
  };
  
  const handleRefresh = () => {
    // Esta función simularía la actualización de los datos del gráfico
    alert('Función de actualización: En un entorno real, esta acción actualizaría los datos del gráfico.');
  };
  
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${styles['chart-card']} ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        
        <div className="relative">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
          
          {showOptions && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border"
              onMouseLeave={() => setShowOptions(false)}
            >
              <div className="py-1">
                <button 
                  onClick={handleRefresh}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Actualizar datos
                </button>
                <button 
                  onClick={handleDownload}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Descargar gráfico
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className={`h-full ${styles['chart-container']}`}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
