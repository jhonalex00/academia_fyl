'use client';
import React, { useState } from 'react';

const DonutChart = ({ data, className = '' }) => {
  // Estado para el segmento activo (hover)
  const [activeSegment, setActiveSegment] = useState(null);
  
  // Calcular el total
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calcular posiciones para cada segmento
  let cumulativePercentage = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startPercentage = cumulativePercentage;
    cumulativePercentage += percentage;
    
    return {
      ...item,
      percentage,
      startPercentage,
      endPercentage: cumulativePercentage
    };
  });
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Círculo base (gris) */}
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="transparent" 
            stroke="#f3f4f6" 
            strokeWidth="20"
          />
          
          {/* Segmentos dinámicos */}
          {segments.map((segment, index) => {
            // Calcular valores para el path de arco
            const startAngle = (segment.startPercentage / 100) * 360;
            const endAngle = (segment.endPercentage / 100) * 360;
            
            // Convertir ángulos a coordenadas para el arco SVG
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);
            
            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);
            
            // Determinar si el arco es mayor a 180 grados (flag de arco largo)
            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
            
            // Crear el path para el arco
            const path = `
              M 50 50
              L ${x1} ${y1}
              A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
              Z
            `;
            
            // Calcular la posición del tooltip para este segmento
            const midAngle = (startAngle + endAngle) / 2;
            const midRad = (midAngle - 90) * (Math.PI / 180);
            const tooltipX = 50 + 30 * Math.cos(midRad);
            const tooltipY = 50 + 30 * Math.sin(midRad);
            
            return (
              <g key={index}>
                <path
                  d={path}
                  fill={segment.color}
                  className="transition-opacity duration-300"
                  style={{ 
                    opacity: activeSegment === index ? 0.8 : 1,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setActiveSegment(index)}
                  onMouseLeave={() => setActiveSegment(null)}
                />
                
                {activeSegment === index && (
                  <g>
                    <circle cx={tooltipX} cy={tooltipY} r="15" fill="white" />
                    <text 
                      x={tooltipX} 
                      y={tooltipY} 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      className="text-xs font-bold"
                      fill="#333"
                    >
                      {Math.round(segment.percentage)}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          
          {/* Círculo interior (para crear efecto donut) */}
          <circle 
            cx="50" 
            cy="50" 
            r="25" 
            fill="white"
          />
          
          {/* Texto central con el total */}
          <text 
            x="50" 
            y="50" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className="text-sm font-bold"
            fill="#333"
          >
            {total}
          </text>
        </svg>
      </div>
      
      <div className="mt-6 w-full">
        {segments.map((segment, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between mb-2 p-1 rounded transition-colors duration-200"
            style={{ backgroundColor: activeSegment === index ? `${segment.color}20` : 'transparent' }}
            onMouseEnter={() => setActiveSegment(index)}
            onMouseLeave={() => setActiveSegment(null)}
          >
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="text-sm text-gray-600">{segment.label}</span>
            </div>
            <span className="text-sm font-medium">{Math.round(segment.percentage)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
