'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './horarios.module.css';
import { apiGet, apiPost, apiPut, apiDelete, fetchWithAuth, API_BASE_URL } from '@/lib/fetchClient';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

export default function HorariosPage() {
  const router = useRouter();
  const calendarRef = useRef(null);
  const [profesores, setProfesores] = useState([]);
  const [academias, setAcademias] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState('');
  const [profesorNombre, setProfesorNombre] = useState('');
  const [eventos, setEventos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [formularioHorario, setFormularioHorario] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    diaSemana: '',
    idacademies: '',
    idsubject: '',
    repetirSemanal: false,
    semanas: 4 // Por defecto repetir por 4 semanas
  });

  // Función para formatear fechas
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const f = new Date(fecha);
    return `${f.getDate().toString().padStart(2, '0')}/${(f.getMonth() + 1).toString().padStart(2, '0')}/${f.getFullYear()}`;
  };  // Cargar profesores desde la API
  const cargarProfesores = async () => {
    try {
      setCargando(true);
      const data = await apiGet('/profesores');
      setProfesores(data);
    } catch (error) {
      setError('Error al cargar profesores: ' + error.message);
      console.error('Error al cargar profesores:', error);
    } finally {
      setCargando(false);
    }
  };  // Cargar academias desde la API
  const cargarAcademias = async () => {
    try {
      const data = await apiGet('/academias');
      setAcademias(data);
    } catch (error) {
      setError('Error al cargar academias: ' + error.message);
      console.error('Error al cargar academias:', error);
    }
  };
  // Cargar asignaturas desde la API
  const cargarAsignaturas = async () => {
    try {
      // Obtener el token del localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch('http://localhost:3001/api/asignaturas', {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Si hay un error de autenticación, redirigir al login
          router.push('/login');
          throw new Error('Sesión expirada. Por favor, inicia sesión de nuevo.');
        }
        throw new Error('Error al cargar asignaturas');
      }
      
      const data = await response.json();
      setAsignaturas(data);
    } catch (error) {
      setError('Error al cargar asignaturas: ' + error.message);
      console.error('Error al cargar asignaturas:', error);
    }
  };

  // Cargar asignaturas del profesor seleccionado
  const cargarAsignaturasProfesor = async (idProfesor) => {
    if (!idProfesor) return;
    
    try {
      const data = await apiGet(`/profesores/${idProfesor}/asignaturas`);
      
      if (Array.isArray(data) && data.length > 0) {
        setAsignaturas(data);
      } else {
        setAsignaturas([]);
        setError('Este profesor no tiene asignaturas asignadas. Debe asignar asignaturas al profesor en la sección de Profesores.');
      }
    } catch (error) {
      setError('Error al cargar asignaturas del profesor: ' + error.message);
      console.error('Error al cargar asignaturas del profesor:', error);
      setAsignaturas([]);
    }
  };

  // Cargar horarios del profesor seleccionado
  const cargarHorarioProfesor = async (idProfesor) => {
    if (!idProfesor) return;
    
    try {
      setCargando(true);
      const data = await apiGet(`/profesores/${idProfesor}/horarios`);
      
      // Transformar los datos para FullCalendar
      const eventosCalendario = data.map(horario => {
        const fechaBase = horario.date ? new Date(horario.date) : obtenerFechaPorDiaSemana(horario.weekDay);
        const horaInicio = horario.startHour || '09:00:00';
        const horaFin = horario.finishHour || '10:00:00';
        
        // Crear fecha completa combinando fecha base con hora
        const fechaInicio = new Date(fechaBase);
        fechaInicio.setHours(
          parseInt(horaInicio.split(':')[0]),
          parseInt(horaInicio.split(':')[1]),
          0
        );
        
        const fechaFin = new Date(fechaBase);
        fechaFin.setHours(
          parseInt(horaFin.split(':')[0]),
          parseInt(horaFin.split(':')[1]),
          0
        );
        
        // Buscar el nombre de la academia
        const academia = academias.find(a => a.idacademy === horario.idacademies);
        const nombreAcademia = academia ? academia.name : 'Academia';
        
        // Buscar la información de la asignatura si está disponible
        const asignatura = asignaturas.find(a => a.idsubject === horario.idsubject);
        const nombreAsignatura = asignatura ? 
          `${asignatura.year}º ${asignatura.cycle}` : 
          '';
        
        const titulo = nombreAsignatura ? 
          `${nombreAsignatura} - ${nombreAcademia}` : 
          `Clase en ${nombreAcademia}`;
          
        return {
          id: horario.idschedule,
          title: titulo,
          start: fechaInicio,
          end: fechaFin,
          extendedProps: {
            idschedule: horario.idschedule,
            idacademies: horario.idacademies,
            idsubject: horario.idsubject || '',
            weekDay: horario.weekDay,
            rawStartHour: horaInicio,
            rawEndHour: horaFin
          },
          backgroundColor: getRandomColor(horario.idacademies),
          borderColor: 'transparent'
        };
      });
      
      setEventos(eventosCalendario);
      
      // Buscar el nombre del profesor seleccionado
      const profesor = profesores.find(p => p.idteacher == idProfesor);
      if (profesor) {
        setProfesorNombre(profesor.name);
      }
      
    } catch (error) {
      setError('Error al cargar horarios: ' + error.message);
      console.error('Error al cargar horarios:', error);
    } finally {
      setCargando(false);
    }
  };

  // Función auxiliar para obtener una fecha basada en el día de la semana
  const obtenerFechaPorDiaSemana = (diaSemana) => {
    const diasMapping = {
      'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6, 'Domingo': 0
    };
    
    const hoy = new Date();
    const diaActual = hoy.getDay(); // 0 (Domingo) a 6 (Sábado)
    const diaBuscado = diasMapping[diaSemana];
    
    if (diaBuscado === undefined) return hoy;
    
    const diferenciaDias = diaBuscado - diaActual;
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + diferenciaDias + (diferenciaDias < 0 ? 7 : 0));
    
    return fecha;
  };

  // Generar un color aleatorio basado en ID
  const getRandomColor = (id) => {
    const colors = [
      '#4f46e5', '#0891b2', '#0d9488', '#059669', '#65a30d', 
      '#ca8a04', '#ea580c', '#dc2626', '#e11d48', '#be185d',
      '#7e22ce', '#6d28d9', '#3b82f6', '#9333ea', '#ec4899',
      '#f97316', '#fbbf24', '#facc15', '#84cc16', '#22c55e',
    ];
    
    if (!id) return colors[0];
    return colors[id % colors.length];
  };

  // Ir a la fecha actual en el calendario
  const irAHoy = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
    }
  };

  // Ir a la semana anterior
  const semanaAnterior = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
    }
  };

  // Ir a la semana siguiente
  const semanaSiguiente = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
    }
  };

  // Obtener la fecha actual del calendario
  const obtenerFechaActual = () => {
    if (!calendarRef.current) return '';
    
    const calendarApi = calendarRef.current.getApi();
    const view = calendarApi.view;
    const start = view.activeStart;
    const end = new Date(view.activeEnd);
    end.setDate(end.getDate() - 1);
    
    return `${formatearFecha(start)} - ${formatearFecha(end)}`;
  };
  // Crear un nuevo horario
  const crearHorario = async () => {
    if (!profesorSeleccionado || 
        !formularioHorario.fecha || 
        !formularioHorario.horaInicio || 
        !formularioHorario.horaFin || 
        !formularioHorario.diaSemana || 
        !formularioHorario.idacademies) {
      setError('Por favor, complete todos los campos obligatorios');
      return;
    }

    // Validar que se ha seleccionado una asignatura
    if (!formularioHorario.idsubject) {
      setError('Por favor, seleccione una asignatura');
      return;
    }

    setCargando(true);
    try {
      // Si está activada la repetición semanal, creamos múltiples horarios
      if (formularioHorario.repetirSemanal && formularioHorario.semanas > 1) {
        const fechaBase = new Date(formularioHorario.fecha);
        const horariosCreados = [];
        
        // Crear horarios para cada semana
        for (let i = 0; i < formularioHorario.semanas; i++) {
          const fechaActual = new Date(fechaBase);
          fechaActual.setDate(fechaActual.getDate() + (i * 7)); // Añadir 7 días por cada semana
          
          const fechaFormateada = fechaActual.toISOString().split('T')[0]; // Formato YYYY-MM-DD
          
          console.log(`Creando horario para la semana ${i+1}:`, {
            fecha: fechaFormateada,
            diaSemana: formularioHorario.diaSemana,
            horaInicio: formularioHorario.horaInicio,
            horaFin: formularioHorario.horaFin
          });
          
          // Crear el horario para esta semana
          const horarioCreado = await apiPost('/horarios', {
            date: fechaFormateada,
            weekDay: formularioHorario.diaSemana,
            startHour: formularioHorario.horaInicio,
            finishHour: formularioHorario.horaFin
          });
          
          // Comprobar que el horario tiene un ID válido
          if (!horarioCreado || !horarioCreado.id) {
            throw new Error(`El servidor no devolvió un ID válido para el horario de la semana ${i+1}`);
          }
          
          // Asociar el horario con el profesor y la academia
          await apiPost('/profesores/horarios', {
            idteacher: profesorSeleccionado,
            idschedule: horarioCreado.id,
            idacademies: formularioHorario.idacademies,
            idsubject: formularioHorario.idsubject
          });
          
          horariosCreados.push(horarioCreado.id);
        }
        
        console.log(`Se crearon ${horariosCreados.length} horarios recurrentes:`, horariosCreados);
      } else {
        // Crear un solo horario (comportamiento original)
        const horarioCreado = await apiPost('/horarios', {
          date: formularioHorario.fecha,
          weekDay: formularioHorario.diaSemana,
          startHour: formularioHorario.horaInicio,
          finishHour: formularioHorario.horaFin
        });

        // Comprobar que el horario tiene un ID válido
        if (!horarioCreado || !horarioCreado.id) {
          throw new Error('El servidor no devolvió un ID de horario válido');
        }

        // Asociar el horario con el profesor y la academia
        await apiPost('/profesores/horarios', {
          idteacher: profesorSeleccionado,
          idschedule: horarioCreado.id,
          idacademies: formularioHorario.idacademies,
          idsubject: formularioHorario.idsubject
        });
      }
      
      // Recargar horarios y cerrar modal
      await cargarHorarioProfesor(profesorSeleccionado);
      cerrarModal();
    } catch (error) {
      setError('Error al crear horario: ' + error.message);
      console.error('Error al crear horario:', error);
    } finally {
      setCargando(false);
    }
  };

  // Actualizar un horario existente
  const actualizarHorario = async () => {
    if (!eventoSeleccionado || 
        !formularioHorario.fecha || 
        !formularioHorario.horaInicio || 
        !formularioHorario.horaFin || 
        !formularioHorario.diaSemana || 
        !formularioHorario.idacademies) {
      setError('Por favor, complete todos los campos obligatorios');
      return;
    }

    // Validar que se ha seleccionado una asignatura
    if (!formularioHorario.idsubject) {
      setError('Por favor, seleccione una asignatura');
      return;
    }

    try {
      // Actualizar el horario
      await apiPut(`/horarios/${eventoSeleccionado.extendedProps.idschedule}`, {
        date: formularioHorario.fecha,
        weekDay: formularioHorario.diaSemana,
        startHour: formularioHorario.horaInicio,
        finishHour: formularioHorario.horaFin
      });

      // Actualizar la relación con la academia y asignatura
      // Primero eliminar la relación actual
      await apiDelete(`/profesores/${profesorSeleccionado}/horarios/${eventoSeleccionado.extendedProps.idschedule}`);

      // Luego crear la nueva relación
      await apiPost('/profesores/horarios', {
        idteacher: profesorSeleccionado,
        idschedule: eventoSeleccionado.extendedProps.idschedule,
        idacademies: formularioHorario.idacademies,
        idsubject: formularioHorario.idsubject
      });

      // Recargar horarios y cerrar modal
      await cargarHorarioProfesor(profesorSeleccionado);
      cerrarModal();
    } catch (error) {
      setError('Error al actualizar horario: ' + error.message);
      console.error('Error al actualizar horario:', error);
    }
  };

  // Eliminar un horario
  const eliminarHorario = async () => {
    if (!eventoSeleccionado) return;
    
    if (!confirm('¿Está seguro de que desea eliminar este horario?')) {
      return;
    }

    try {
      // Eliminar la relación profesor-horario
      await apiDelete(`/profesores/${profesorSeleccionado}/horarios/${eventoSeleccionado.extendedProps.idschedule}`);

      // Eliminar el horario
      await apiDelete(`/horarios/${eventoSeleccionado.extendedProps.idschedule}`);

      // Recargar horarios y cerrar modal
      await cargarHorarioProfesor(profesorSeleccionado);
      cerrarModal();
    } catch (error) {
      setError('Error al eliminar horario: ' + error.message);
      console.error('Error al eliminar horario:', error);
    }
  };

  // Abrir modal para crear un nuevo horario
  const abrirModalCreacion = () => {
    if (!profesorSeleccionado) {
      alert('Por favor, seleccione un profesor primero');
      return;
    }
    
    setModoEdicion(false);
    setEventoSeleccionado(null);
    
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    
    setFormularioHorario({
      fecha: fechaActual.toISOString().split('T')[0],
      horaInicio: '09:00',
      horaFin: '10:00',
      diaSemana: obtenerNombreDia(fechaActual.getDay()),
      idacademies: academias.length > 0 ? academias[0].idacademy : '',
      idsubject: asignaturas.length > 0 ? asignaturas[0].idsubject : '',
      repetirSemanal: false,
      semanas: 4
    });
    
    setModalAbierto(true);
  };

  // Abrir modal para editar un horario existente
  const abrirModalEdicion = (evento) => {
    setModoEdicion(true);
    setEventoSeleccionado(evento);
    
    // Convertir las fechas del evento a formato adecuado para el formulario
    const fechaEvento = evento.start;
    
    setFormularioHorario({
      fecha: fechaEvento.toISOString().split('T')[0],
      horaInicio: evento.extendedProps.rawStartHour.substring(0, 5),
      horaFin: evento.extendedProps.rawEndHour.substring(0, 5),
      diaSemana: evento.extendedProps.weekDay || obtenerNombreDia(fechaEvento.getDay()),
      idacademies: evento.extendedProps.idacademies || '',
      idsubject: evento.extendedProps.idsubject || '',
      repetirSemanal: false,
      semanas: 4
    });
    
    setModalAbierto(true);
  };
  // Cerrar modal
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

  // Función auxiliar para obtener el nombre del día de la semana
  const obtenerNombreDia = (numeroDia) => {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[numeroDia];
  };

  // Manejar el redimensionamiento de eventos (cambio de duración)
  const manejarRedimensionamiento = async (info) => {
    try {
      setCargando(true);
      
      const evento = info.event;
      const idschedule = evento.extendedProps.idschedule;
      const nuevaFecha = evento.start.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      const nuevaHoraInicio = `${evento.start.getHours().toString().padStart(2, '0')}:${evento.start.getMinutes().toString().padStart(2, '0')}:00`;
      const nuevaHoraFin = `${evento.end.getHours().toString().padStart(2, '0')}:${evento.end.getMinutes().toString().padStart(2, '0')}:00`;
      const nuevoDiaSemana = obtenerNombreDia(evento.start.getDay());
      
      console.log('Actualizando duración del horario:', {
        idschedule,
        fecha: nuevaFecha,
        horaInicio: nuevaHoraInicio,
        horaFin: nuevaHoraFin,
        diaSemana: nuevoDiaSemana
      });
      
      // Actualizar el horario en la base de datos
      await apiPut(`/horarios/${idschedule}`, {
        date: nuevaFecha,
        weekDay: nuevoDiaSemana,
        startHour: nuevaHoraInicio,
        finishHour: nuevaHoraFin
      });
      
      setError('');
      await cargarHorarioProfesor(profesorSeleccionado);
    } catch (error) {
      info.revert(); // Revertir el cambio en la interfaz
      setError('Error al cambiar la duración del horario: ' + error.message);
      console.error('Error al cambiar la duración del horario:', error);
    } finally {
      setCargando(false);
    }
  };

  // Manejar el arrastre de eventos en el calendario
  const manejarArrastreEvento = async (info) => {
    try {
      setCargando(true);
      
      const evento = info.event;
      const idschedule = evento.extendedProps.idschedule;
      const nuevaFecha = evento.start.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      const nuevaHoraInicio = `${evento.start.getHours().toString().padStart(2, '0')}:${evento.start.getMinutes().toString().padStart(2, '0')}:00`;
      const nuevaHoraFin = `${evento.end.getHours().toString().padStart(2, '0')}:${evento.end.getMinutes().toString().padStart(2, '0')}:00`;
      const nuevoDiaSemana = obtenerNombreDia(evento.start.getDay());
      
      console.log('Actualizando horario por drag & drop:', {
        idschedule,
        fecha: nuevaFecha,
        horaInicio: nuevaHoraInicio,
        horaFin: nuevaHoraFin,
        diaSemana: nuevoDiaSemana
      });
      
      // Actualizar el horario en la base de datos
      await apiPut(`/horarios/${idschedule}`, {
        date: nuevaFecha,
        weekDay: nuevoDiaSemana,
        startHour: nuevaHoraInicio,
        finishHour: nuevaHoraFin
      });
      
      setError('');
      await cargarHorarioProfesor(profesorSeleccionado);
    } catch (error) {
      info.revert(); // Revertir el cambio en la interfaz
      setError('Error al mover el horario: ' + error.message);
      console.error('Error al mover el horario:', error);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar profesores por búsqueda
  const profesoresFiltrados = profesores.filter(profesor => 
    profesor.name?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cargar datos iniciales
  useEffect(() => {
    cargarProfesores();
    cargarAcademias();
    cargarAsignaturas();
  }, []);

  // Cargar horarios cuando se selecciona un profesor
  useEffect(() => {
    if (profesorSeleccionado) {
      cargarHorarioProfesor(profesorSeleccionado);
      cargarAsignaturasProfesor(profesorSeleccionado);
    } else {
      setEventos([]);
    }
  }, [profesorSeleccionado]);

  // Función que maneja el cambio de profesor seleccionado
  const cambiarProfesorSeleccionado = (e) => {
    const idProfesor = e.target.value;
    setProfesorSeleccionado(idProfesor);
    if (idProfesor) {
      // Recargar los horarios y asignaturas cuando se selecciona un profesor
      cargarHorarioProfesor(idProfesor);
      cargarAsignaturasProfesor(idProfesor);
    } else {
      setEventos([]);
      setAsignaturas([]);
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
         <input
          type="text"
          placeholder="Buscar profesor..."
          className={styles.search}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <ul className={styles.profesorList}>          {profesoresFiltrados.map((profesor) => (
            <li
              key={profesor.idteacher}
              className={profesorSeleccionado == profesor.idteacher ? styles.selected : ''}
              onClick={() => {
                setProfesorSeleccionado(profesor.idteacher);
                cargarHorarioProfesor(profesor.idteacher);
                cargarAsignaturasProfesor(profesor.idteacher);
              }}
            >
              {profesor.name}
            </li>
          ))}
        </ul>
      </aside>
      
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>{profesorSeleccionado ? `Horario: ${profesorNombre}` : 'Seleccione un profesor'}</h1>
          <button 
            className={styles.newClassButton}
            onClick={abrirModalCreacion}
            disabled={!profesorSeleccionado}
          >
            Nueva Clase
          </button>
        </header>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        {profesorSeleccionado && (
          <div className={styles.controls}>
            <div className={styles.periodNavigator}>
              <button onClick={semanaAnterior} className={styles.navButton}>
                &larr; Anterior
              </button>
              <button onClick={irAHoy} className={styles.todayButton}>
                Hoy
              </button>
              <button onClick={semanaSiguiente} className={styles.navButton}>
                Siguiente &rarr;
              </button>
              <div className={styles.currentPeriod}>
                {calendarRef.current ? obtenerFechaActual() : ''}
              </div>
            </div>
          </div>
        )}
        
        <div className={styles.calendarContainer}>
          {cargando ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <p>Cargando horarios...</p>
            </div>
          ) : (            <FullCalendar
              ref={calendarRef}
              plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={false}
              events={eventos}
              locale={esLocale}
              height="parent"
              allDaySlot={false}
              slotMinTime="08:00:00"
              slotMaxTime="22:00:00"
              expandRows={true}
              slotDuration="01:00:00"              editable={true}
              droppable={true}
              eventDrop={manejarArrastreEvento}
              eventResize={manejarRedimensionamiento}
              eventResizableFromStart={true}
              eventClick={(info) => abrirModalEdicion(info.event)}
              dateClick={(info) => {
                if (profesorSeleccionado) {
                  // Inicializar formulario con la fecha/hora seleccionada
                  const fechaSeleccionada = new Date(info.date);
                  setFormularioHorario({
                    fecha: info.date.toISOString().split('T')[0],
                    horaInicio: `${fechaSeleccionada.getHours().toString().padStart(2, '0')}:00`,
                    horaFin: `${(fechaSeleccionada.getHours() + 1).toString().padStart(2, '0')}:00`,
                    diaSemana: obtenerNombreDia(fechaSeleccionada.getDay()),
                    idacademies: academias.length > 0 ? academias[0].idacademy : '',
                    idsubject: asignaturas.length > 0 ? asignaturas[0].idsubject : '',
                    repetirSemanal: false,
                    semanas: 4
                  });
                  setModoEdicion(false);
                  setEventoSeleccionado(null);
                  setModalAbierto(true);
                }
              }}
            />
          )}
        </div>
      </main>
      
      {/* Modal para crear/editar horario */}
      {modalAbierto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{modoEdicion ? 'Editar Horario' : 'Nuevo Horario'}</h2>
              <button onClick={cerrarModal} className={styles.closeButton}>
                &times;
              </button>
            </div>
            
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            <div className={styles.formGroup}>
              <label htmlFor="fecha">Fecha</label>
              <input
                type="date"
                id="fecha"
                className={styles.formControl}
                value={formularioHorario.fecha}
                onChange={(e) => setFormularioHorario({...formularioHorario, fecha: e.target.value})}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="diaSemana">Día de la semana</label>
              <select
                id="diaSemana"
                className={styles.formControl}
                value={formularioHorario.diaSemana}
                onChange={(e) => setFormularioHorario({...formularioHorario, diaSemana: e.target.value})}
              >
                <option value="">Seleccione un día</option>
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(dia => (
                  <option key={dia} value={dia}>{dia}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="horaInicio">Hora de inicio</label>
              <input
                type="time"
                id="horaInicio"
                className={styles.formControl}
                value={formularioHorario.horaInicio}
                onChange={(e) => setFormularioHorario({...formularioHorario, horaInicio: e.target.value})}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="horaFin">Hora de fin</label>
              <input
                type="time"
                id="horaFin"
                className={styles.formControl}
                value={formularioHorario.horaFin}
                onChange={(e) => setFormularioHorario({...formularioHorario, horaFin: e.target.value})}
              />
            </div>
              <div className={styles.formGroup}>
              <label htmlFor="academia">Academia</label>
              <select
                id="academia"
                className={styles.formControl}
                value={formularioHorario.idacademies}
                onChange={(e) => setFormularioHorario({...formularioHorario, idacademies: e.target.value})}
              >
                <option value="">Seleccione una academia</option>
                {academias.map(academia => (
                  <option key={academia.idacademy} value={academia.idacademy}>
                    {academia.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="asignatura">Asignatura</label>
              <select
                id="asignatura"
                className={styles.formControl}
                value={formularioHorario.idsubject}
                onChange={(e) => setFormularioHorario({...formularioHorario, idsubject: e.target.value})}
              >
                <option value="">Seleccione una asignatura</option>
                {asignaturas.map(asignatura => (
                  <option key={asignatura.idsubject} value={asignatura.idsubject}>
                    {asignatura.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Opción para repetir semanalmente */}
            {!modoEdicion && (
              <>
                <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="repetirSemanal"
                    checked={formularioHorario.repetirSemanal}
                    onChange={(e) => setFormularioHorario({...formularioHorario, repetirSemanal: e.target.checked})}
                    style={{ width: 'auto' }}
                  />
                  <label htmlFor="repetirSemanal" style={{ margin: 0 }}>Repetir semanalmente</label>
                </div>
                
                {formularioHorario.repetirSemanal && (
                  <div className={styles.formGroup}>
                    <label htmlFor="semanas">Repetir por</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="number"
                        id="semanas"
                        min="1"
                        max="52"
                        className={styles.formControl}
                        value={formularioHorario.semanas}
                        onChange={(e) => setFormularioHorario({...formularioHorario, semanas: parseInt(e.target.value) || 1})}
                        style={{ width: '80px' }}
                      />
                      <span>semanas</span>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div className={styles.modalActions}>
              <button onClick={cerrarModal} className={styles.cancelButton}>
                Cancelar
              </button>
              
              {modoEdicion && (
                <button onClick={eliminarHorario} className={styles.cancelButton} style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                  Eliminar
                </button>
              )}
              
              <button 
                onClick={modoEdicion ? actualizarHorario : crearHorario} 
                className={styles.saveButton}
              >
                {modoEdicion ? 'Guardar Cambios' : 'Crear Horario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
