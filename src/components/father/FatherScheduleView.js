'use client';

import React from 'react';

const FatherScheduleView = ({ schedule }) => {
  // Días de la semana
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  // Horas del día (ejemplo de 8:00 a 20:00)
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  // Si no hay horario, mostrar mensaje
  if (!schedule || schedule.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Horario de Clases</h3>
          <p className="text-sm text-gray-500">Horario semanal de su hijo/a</p>
        </div>
        <div className="p-6 pt-0">
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No hay horarios disponibles</p>
            <p className="text-gray-400 text-sm mt-2">
              Contacte con la academia para más información
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold">Horario de Clases</h3>
        <p className="text-sm text-gray-500">Horario semanal de su hijo/a</p>
      </div>
      <div className="p-6 pt-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2 text-left font-medium">Hora</th>
                {daysOfWeek.map(day => (
                  <th key={day} className="border border-gray-300 p-2 text-center font-medium">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-medium bg-gray-50">
                    {time}
                  </td>
                  {daysOfWeek.map(day => {
                    // Buscar si hay una clase en este día y hora
                    const classInfo = schedule.find(item => 
                      item.day === day && item.time === time
                    );
                    
                    return (
                      <td key={`${day}-${time}`} className="border border-gray-300 p-2 text-center">
                        {classInfo ? (
                          <div className="bg-blue-100 text-blue-800 p-2 rounded text-sm">
                            <div className="font-medium">{classInfo.subject}</div>
                            {classInfo.teacher && (
                              <div className="text-xs text-blue-600">{classInfo.teacher}</div>
                            )}
                            {classInfo.room && (
                              <div className="text-xs text-blue-600">Aula: {classInfo.room}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Información Importante</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Las clases pueden estar sujetas a cambios</li>
            <li>• En caso de ausencia del profesor, se notificará con antelación</li>
            <li>• Para consultas, contacte con la academia</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FatherScheduleView; 