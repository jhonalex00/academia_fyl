import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // Para interacciones futuras
import esLocale from '@fullcalendar/core/locales/es';

// Constantes para la API
const API_BASE_URL = 'http://localhost:3001/api';

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

// Función auxiliar para obtener el nombre del día de la semana
const obtenerNombreDia = (numeroDia) => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[numeroDia];
};

const TeacherScheduleView = ({ schedule, academias, asignaturas, onScheduleUpdate }) => {
  const calendarRef = useRef(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [formularioHorario, setFormularioHorario] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    diaSemana: '',
    idacademies: '',
    idsubject: '',
    repetirSemanal: false,
    semanas: 4
  });

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

  // Funciones de navegación del calendario
  const irAHoy = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
    }
  };

  const semanaAnterior = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
    }
  };

  const semanaSiguiente = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
    }
  };

  // Funciones para manejar eventos del calendario
  const manejarArrastreEvento = async (info) => {
    try {
      setCargando(true);
      const evento = info.event;
      const idschedule = evento.extendedProps.idschedule;
      const nuevaFecha = evento.start.toISOString().split('T')[0];
      const nuevaHoraInicio = `${evento.start.getHours().toString().padStart(2, '0')}:${evento.start.getMinutes().toString().padStart(2, '0')}:00`;
      const nuevaHoraFin = `${evento.end.getHours().toString().padStart(2, '0')}:${evento.end.getMinutes().toString().padStart(2, '0')}:00`;
      const nuevoDiaSemana = obtenerNombreDia(evento.start.getDay());

      await fetch(`${API_BASE_URL}/horarios/${idschedule}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: nuevaFecha,
          weekDay: nuevoDiaSemana,
          startHour: nuevaHoraInicio,
          finishHour: nuevaHoraFin
        })
      });

      if (onScheduleUpdate) {
        onScheduleUpdate();
      }
    } catch (error) {
      info.revert();
      setError('Error al mover el horario: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  const manejarRedimensionamiento = async (info) => {
    try {
      setCargando(true);
      const evento = info.event;
      const idschedule = evento.extendedProps.idschedule;
      const nuevaFecha = evento.start.toISOString().split('T')[0];
      const nuevaHoraInicio = `${evento.start.getHours().toString().padStart(2, '0')}:${evento.start.getMinutes().toString().padStart(2, '0')}:00`;
      const nuevaHoraFin = `${evento.end.getHours().toString().padStart(2, '0')}:${evento.end.getMinutes().toString().padStart(2, '0')}:00`;
      const nuevoDiaSemana = obtenerNombreDia(evento.start.getDay());

      await fetch(`${API_BASE_URL}/horarios/${idschedule}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: nuevaFecha,
          weekDay: nuevoDiaSemana,
          startHour: nuevaHoraInicio,
          finishHour: nuevaHoraFin
        })
      });

      if (onScheduleUpdate) {
        onScheduleUpdate();
      }
    } catch (error) {
      info.revert();
      setError('Error al cambiar la duración del horario: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  // Funciones para el modal
  const abrirModalEdicion = (evento) => {
    setModoEdicion(true);
    setEventoSeleccionado(evento);
    setFormularioHorario({
      fecha: evento.start.toISOString().split('T')[0],
      horaInicio: evento.extendedProps.rawStartHour?.substring(0, 5) || '09:00',
      horaFin: evento.extendedProps.rawEndHour?.substring(0, 5) || '10:00',
      diaSemana: evento.extendedProps.weekDay || obtenerNombreDia(evento.start.getDay()),
      idacademies: evento.extendedProps.idacademies || '',
      idsubject: evento.extendedProps.idsubject || '',
      repetirSemanal: false,
      semanas: 4
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setModoEdicion(false);
    setEventoSeleccionado(null);
    setError('');
    setFormularioHorario({
      fecha: '',
      horaInicio: '',
      horaFin: '',
      diaSemana: '',
      idacademies: '',
      idsubject: '',
      repetirSemanal: false,
      semanas: 4
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={semanaAnterior}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            &larr; Anterior
          </button>
          <button
            onClick={irAHoy}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
          >
            Hoy
          </button>
          <button
            onClick={semanaSiguiente}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Siguiente &rarr;
          </button>
        </div>
      </div>

      <div className="fullcalendar-container">
        <FullCalendar
          ref={calendarRef}
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
          editable={true}
          droppable={true}
          eventDrop={manejarArrastreEvento}
          eventResize={manejarRedimensionamiento}
          eventResizableFromStart={true}
          eventClick={abrirModalEdicion}
        />
      </div>

      {/* Modal para editar horario */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {modoEdicion ? 'Editar Horario' : 'Nuevo Horario'}
              </h2>
              <button
                onClick={cerrarModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formularioHorario.fecha}
                  onChange={(e) => setFormularioHorario({...formularioHorario, fecha: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Día de la semana</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formularioHorario.diaSemana}
                  onChange={(e) => setFormularioHorario({...formularioHorario, diaSemana: e.target.value})}
                >
                  <option value="">Seleccione un día</option>
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(dia => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hora de inicio</label>
                <input
                  type="time"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formularioHorario.horaInicio}
                  onChange={(e) => setFormularioHorario({...formularioHorario, horaInicio: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hora de fin</label>
                <input
                  type="time"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formularioHorario.horaFin}
                  onChange={(e) => setFormularioHorario({...formularioHorario, horaFin: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={cerrarModal}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Aquí iría la lógica para guardar los cambios
                    cerrarModal();
                  }}
                  className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
                >
                  {modoEdicion ? 'Guardar Cambios' : 'Crear Horario'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherScheduleView; 