'use client';
import React, { useState } from 'react';
import styles from '@/app/admin/dashboard/dashboard.module.css';

const MiniCalendar = ({ events, title, className = '' }) => {
  // Estado para el mes actual
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Configuración del calendario
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  // Función para obtener todos los días del mes actual
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    
    // Ajuste para que el primer día de la semana sea lunes (0) en vez de domingo (0)
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek < 0) firstDayOfWeek = 6; // Si es domingo (0), convertirlo a 6
    
    const daysArray = [];
    
    // Añadir días del mes anterior para completar la primera semana
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      daysArray.push({
        day: i,
        month: 'prev',
        date: new Date(year, month - 1, i)
      });
    }
    
    // Añadir días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      daysArray.push({
        day: i,
        month: 'current',
        date,
        events: events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getDate() === i && 
                 eventDate.getMonth() === month && 
                 eventDate.getFullYear() === year;
        })
      });
    }
    
    // Calcular cuántos días necesitamos del mes siguiente
    const totalCells = Math.ceil(daysArray.length / 7) * 7;
    const daysFromNextMonth = totalCells - daysArray.length;
    
    // Añadir días del mes siguiente
    for (let i = 1; i <= daysFromNextMonth; i++) {
      daysArray.push({
        day: i,
        month: 'next',
        date: new Date(year, month + 1, i)
      });
    }
    
    return daysArray;
  };
  
  // Obtener todos los días para mostrar
  const days = getDaysInMonth();
  
  // Función para ir al mes anterior
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Función para ir al mes siguiente
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Comprobar si un día es hoy
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-700 mb-4">{title}</h3>
      
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousMonth}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <h4 className="text-sm font-medium text-gray-700">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        
        <button 
          onClick={goToNextMonth}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-xs text-center text-gray-500 font-medium">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = day.month === 'current';
          return (
            <div 
              key={index}
              className={`text-xs p-1 text-center rounded-full h-7 w-7 flex items-center justify-center ${
                isToday(day.date) && isCurrentMonth ? 'bg-indigo-100 text-indigo-700 font-bold' : ''
              } ${
                !isCurrentMonth ? 'text-gray-400' : 'text-gray-700'
              } ${
                day.events && day.events.length > 0 && isCurrentMonth ? 'font-medium border-2 border-indigo-500' : ''
              } cursor-pointer hover:bg-gray-100`}
              title={day.events && day.events.length > 0 ? `${day.events.length} eventos` : ''}
            >
              {day.day}
              {day.events && day.events.length > 0 && isCurrentMonth && (
                <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 h-1 w-1 bg-indigo-500 rounded-full"></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
