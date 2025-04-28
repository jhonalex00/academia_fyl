'use client';
import React, { useState } from 'react';

const BarChart = ({ data, className = '' }) => {
  // Estado para el tooltip
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  // Encontrar el valor máximo para calcular las proporciones
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 flex items-end space-x-2 relative">
        {data.map((item, index) => {
          // Calcular la altura relativa (20% mínimo para visibilidad)
          const heightPercentage = 20 + ((item.value / maxValue) * 80);
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center flex-1"
              onMouseEnter={() => setActiveTooltip(index)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <div 
                className={`w-full ${item.color} rounded-t-md transition-all duration-300 hover:opacity-80 cursor-pointer`} 
                style={{ height: `${heightPercentage}%` }}
              ></div>
              
              {activeTooltip === index && (
                <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none">
                  <strong>{item.label}</strong>: {item.value}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-2 pt-3 border-t border-gray-200">
        {data.map((item, index) => (
          <div key={index} className="text-xs text-gray-500 flex-1 text-center">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
