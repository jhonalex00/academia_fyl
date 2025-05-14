import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // Para interacciones futuras
import esLocale from '@fullcalendar/core/locales/es';

// Función auxiliar para generar colores consistentes basados en ID
const getRandomColor = (id) => {
  const colors = [
    '#4f46e5', '#0891b2', '#0d9488', '#059669', '#65a30d', 
    '#ca8a04', '#ea580c', '#dc2626', '#e11d48', '#be185d',
    '#7e22ce', '#6d28d9', '#3b82f6', '#9333ea', '#ec4899',
    '#f97316', '#fbbf24', '#facc15', '#84cc16', '#22c55e',
  ];
  if (!id) return colors[0];
  // Asegúrate de que el ID sea numérico para el módulo
  const numericId = typeof id === 'string' ? parseInt(id, 10) || 0 : id || 0;
  return colors[numericId % colors.length];
};

// Función auxiliar para obtener una fecha basada en el día de la semana
// Necesaria si los horarios no tienen fecha específica y solo día de semana
const obtenerFechaBasePorDiaSemana = (diaSemana) => {
  const diasMapping = {
    'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6, 'Domingo': 0
  };
  const hoy = new Date();
  const diaActual = hoy.getDay(); // 0 (Domingo) a 6 (Sábado)
  const diaBuscado = diasMapping[diaSemana];
  if (diaBuscado === undefined) return hoy; // Devolver hoy si no se mapea
  const diferenciaDias = diaBuscado - diaActual;
  const fecha = new Date(hoy);
  // Establece la fecha al día correcto de la semana actual o la siguiente
  fecha.setDate(hoy.getDate() + diferenciaDias);
  return fecha;
};

const TeacherScheduleView = ({ schedule }) => {
  if (!schedule) {
    return <div className="bg-white p-4 rounded shadow text-gray-500">Cargando horario...</div>;
  }

  if (schedule.length === 0) {
    return <div className="bg-white p-4 rounded shadow text-gray-500">No tienes clases programadas.</div>;
  }

  // Transformar los datos del schedule al formato de eventos de FullCalendar
  const events = schedule.map(item => {
    // Determinar la fecha base: usar item.date si existe, si no, calcularla a partir de weekDay
    const fechaBase = item.date ? new Date(item.date) : obtenerFechaBasePorDiaSemana(item.weekDay);
    
    // Manejar horas nulas o inválidas, asignando un valor por defecto si es necesario
    const horaInicio = item.startHour || '09:00:00'; 
    const horaFin = item.finishHour || '10:00:00';

    // Crear objetos Date completos para inicio y fin
    const fechaInicio = new Date(fechaBase);
    try {
      const [startH, startM] = horaInicio.split(':');
      fechaInicio.setHours(parseInt(startH), parseInt(startM), 0, 0);
    } catch { /* Mantener fechaBase si la hora es inválida */ }

    const fechaFin = new Date(fechaBase);
    try {
        const [endH, endM] = horaFin.split(':');
        fechaFin.setHours(parseInt(endH), parseInt(endM), 0, 0);
    } catch { 
        // Si la hora fin es inválida, poner una hora después del inicio
        fechaFin.setTime(fechaInicio.getTime() + 60 * 60 * 1000);
    }
    
    // Validar que la fecha de fin no sea anterior a la de inicio
    if (fechaFin <= fechaInicio) {
       fechaFin.setTime(fechaInicio.getTime() + 60 * 60 * 1000); // Añadir 1 hora por defecto
    }

    // Construir título del evento
    const tituloAsignatura = item.subjectName || 'Asignatura';
    const ciclo = item.subjectCycle || '';
    const anio = item.subjectYear || '';
    const nombreAcademia = item.academyName || 'Sede';
    const titulo = `${tituloAsignatura} (${ciclo} ${anio}) - ${nombreAcademia}`.replace(/\s+/g, ' ').trim(); // Limpiar espacios extra

    return {
      id: item.idschedule, // ID único del evento
      title: titulo, 
      start: fechaInicio, 
      end: fechaFin, 
      backgroundColor: getRandomColor(item.idsubject || item.idschedule), // Color basado en asignatura o horario
      borderColor: 'transparent',
      extendedProps: {
        // Puedes añadir más datos aquí si necesitas mostrarlos en tooltips o modales
        ...item
      }
    };
  });

  return (
    <div className="bg-white p-4 rounded shadow fullcalendar-container">
       {/* Aplicar estilos globales o específicos si es necesario */}
       <style jsx global>{`
        .fc .fc-toolbar.fc-header-toolbar {
          margin-bottom: 1.5em;
          flex-wrap: wrap; /* Permitir que los elementos del toolbar se envuelvan */
        }
        .fc .fc-toolbar-title {
          font-size: 1.5em; /* Ajustar tamaño del título */
          margin: 0.5em 0; /* Espacio alrededor del título */
        }
        .fc-direction-ltr .fc-button-group > .fc-button:not(:first-child) {
            margin-left: -1px; /* Solapamiento de botones */
        }
        .fc-direction-ltr .fc-toolbar > * > :not(:first-child) {
            margin-left: .75em; /* Espacio entre grupos de botones */
        }
         .fc-event {
            cursor: pointer; /* Indicar que los eventos son clickables */
            padding: 4px 6px;
            font-size: 0.85em;
        }
        .fc-timegrid-event .fc-event-time {
            font-weight: bold;
        }
        /* Ajustes para responsividad si son necesarios */
        @media (max-width: 600px) {
          .fc .fc-toolbar.fc-header-toolbar {
            flex-direction: column;
            align-items: center;
          }
        }
       `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek" // Vista semanal por defecto
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay' // Opciones de vista
        }}
        events={events}
        locale={esLocale} // Establecer idioma español
        nowIndicator={true} // Muestra la hora actual
        slotMinTime="08:00:00" // Hora de inicio visible
        slotMaxTime="22:00:00" // Hora de fin visible
        allDaySlot={false} // No mostrar la fila "todo el día"
        height="auto" // Ajustar altura automáticamente
        // eventClick={(clickInfo) => {
        //   // Aquí puedes manejar el click en un evento (ej. mostrar detalles)
        //   console.log('Evento clickeado:', clickInfo.event);
        //   // abrirModalEdicion(clickInfo.event); // Si tuvieras un modal
        // }}
        // dateClick={(arg) => {
        //   // Aquí puedes manejar el click en una fecha/hora (ej. crear nuevo evento)
        //   console.log('Fecha clickeada:', arg.dateStr);
        //   // abrirModalCreacion(arg.dateStr); // Si tuvieras un modal
        // }}
      />
    </div>
  );
};

export default TeacherScheduleView; 