'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Días de la semana y horas para mostrar en el horario
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const horasDisponibles = [
  '09:00', '10:00', '11:00', '12:00', '13:00', 
  '16:00', '17:00', '18:00', '19:00', '20:00'
];

export default function HorariosPage() {
  const router = useRouter();
  const [profesores, setProfesores] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState('');
  const [academias, setAcademias] = useState([]);
  const [academiaSeleccionada, setAcademiaSeleccionada] = useState('');
  const [semanaActual, setSemanaActual] = useState('');
  const [fechaInicio, setFechaInicio] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoHorario, setNuevoHorario] = useState({
    dia: '',
    horaInicio: '',
    horaFin: '',
    idacademies: ''
  });
  const [editandoHorario, setEditandoHorario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Función para obtener la fecha de inicio de la semana actual
  const obtenerFechaInicioSemana = (fecha = new Date()) => {
    const diaSemana = fecha.getDay();
    const diff = fecha.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
    return new Date(fecha.setDate(diff));
  };

  // Función para formatear fechas
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const f = new Date(fecha);
    return `${f.getDate().toString().padStart(2, '0')}/${(f.getMonth() + 1).toString().padStart(2, '0')}/${f.getFullYear()}`;
  };

  // Cambiar a la semana anterior
  const semanaAnterior = () => {
    if (fechaInicio) {
      const nuevaFecha = new Date(fechaInicio);
      nuevaFecha.setDate(nuevaFecha.getDate() - 7);
      setFechaInicio(nuevaFecha);
      cargarHorariosSemana(nuevaFecha);
    }
  };

  // Cambiar a la semana siguiente
  const semanaSiguiente = () => {
    if (fechaInicio) {
      const nuevaFecha = new Date(fechaInicio);
      nuevaFecha.setDate(nuevaFecha.getDate() + 7);
      setFechaInicio(nuevaFecha);
      cargarHorariosSemana(nuevaFecha);
    }
  };

  // Calcular el rango de fechas para la semana actual
  const calcularRangoSemana = (fecha) => {
    if (!fecha) return '';
    const inicio = new Date(fecha);
    const fin = new Date(fecha);
    fin.setDate(fin.getDate() + 6);
    return `${formatearFecha(inicio)} - ${formatearFecha(fin)}`;
  };

  // Cargar profesores desde la API
  const cargarProfesores = async () => {
    try {
      const response = await fetch('/api/profesores');
      if (!response.ok) {
        throw new Error('Error al cargar profesores');
      }
      const data = await response.json();
      setProfesores(data);
    } catch (error) {
      setError('Error al cargar profesores: ' + error.message);
      console.error('Error al cargar profesores:', error);
    }
  };

  // Cargar academias desde la API
  const cargarAcademias = async () => {
    try {
      const response = await fetch('/api/academias');
      if (!response.ok) {
        throw new Error('Error al cargar academias');
      }
      const data = await response.json();
      setAcademias(data);
    } catch (error) {
      setError('Error al cargar academias: ' + error.message);
      console.error('Error al cargar academias:', error);
    }
  };

  // Cargar horarios del profesor seleccionado para la semana actual
  const cargarHorariosSemana = async (fecha) => {
    if (!profesorSeleccionado) return;
    
    try {
      setCargando(true);
      // Formato de fecha para la API: yyyy-mm-dd
      const fechaFormateada = fecha.toISOString().split('T')[0];
      
      const response = await fetch(`/api/profesores/${profesorSeleccionado}/horarios?fecha=${fechaFormateada}`);
      if (!response.ok) {
        throw new Error('Error al cargar horarios');
      }
      const data = await response.json();
      setHorarios(data);
      setSemanaActual(calcularRangoSemana(fecha));
    } catch (error) {
      setError('Error al cargar horarios: ' + error.message);
      console.error('Error al cargar horarios:', error);
    } finally {
      setCargando(false);
    }
  };

  // Crear un nuevo horario
  const crearHorario = async () => {
    if (!profesorSeleccionado || !nuevoHorario.dia || !nuevoHorario.horaInicio || !nuevoHorario.horaFin || !nuevoHorario.idacademies) {
      setError('Por favor, complete todos los campos');
      return;
    }

    try {
      // Primero crear el horario
      const responseHorario = await fetch('/api/horarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: fechaInicio ? new Date(fechaInicio).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          weekDay: nuevoHorario.dia,
          startHour: nuevoHorario.horaInicio,
          finishHour: nuevoHorario.horaFin
        }),
      });

      if (!responseHorario.ok) {
        throw new Error('Error al crear horario');
      }

      const horarioCreado = await responseHorario.json();

      // Luego asociar el horario con el profesor y la academia
      const responseAsociacion = await fetch('/api/profesores/horarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idteacher: profesorSeleccionado,
          idschedule: horarioCreado.id,
          idacademies: nuevoHorario.idacademies
        }),
      });

      if (!responseAsociacion.ok) {
        throw new Error('Error al asociar horario con profesor');
      }

      // Recargar horarios y cerrar modal
      cargarHorariosSemana(fechaInicio || obtenerFechaInicioSemana());
      setModalAbierto(false);
      setNuevoHorario({
        dia: '',
        horaInicio: '',
        horaFin: '',
        idacademies: ''
      });
    } catch (error) {
      setError('Error al crear horario: ' + error.message);
      console.error('Error al crear horario:', error);
    }
  };

  // Actualizar un horario existente
  const actualizarHorario = async () => {
    if (!editandoHorario || !nuevoHorario.dia || !nuevoHorario.horaInicio || !nuevoHorario.horaFin || !nuevoHorario.idacademies) {
      setError('Por favor, complete todos los campos');
      return;
    }

    try {
      // Actualizar el horario
      const responseHorario = await fetch(`/api/horarios/${editandoHorario.idschedule}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: editandoHorario.date,
          weekDay: nuevoHorario.dia,
          startHour: nuevoHorario.horaInicio,
          finishHour: nuevoHorario.horaFin
        }),
      });

      if (!responseHorario.ok) {
        throw new Error('Error al actualizar horario');
      }

      // Actualizar la relación con la academia
      // Primero eliminar la relación actual
      await fetch(`/api/profesores/${profesorSeleccionado}/horarios/${editandoHorario.idschedule}`, {
        method: 'DELETE',
      });

      // Luego crear la nueva relación
      await fetch('/api/profesores/horarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idteacher: profesorSeleccionado,
          idschedule: editandoHorario.idschedule,
          idacademies: nuevoHorario.idacademies
        }),
      });

      // Recargar horarios y cerrar modal
      cargarHorariosSemana(fechaInicio || obtenerFechaInicioSemana());
      setModalAbierto(false);
      setEditandoHorario(null);
      setNuevoHorario({
        dia: '',
        horaInicio: '',
        horaFin: '',
        idacademies: ''
      });
    } catch (error) {
      setError('Error al actualizar horario: ' + error.message);
      console.error('Error al actualizar horario:', error);
    }
  };

  // Eliminar un horario
  const eliminarHorario = async (idschedule) => {
    if (!confirm('¿Está seguro de que desea eliminar este horario?')) {
      return;
    }

    try {
      // Primero eliminar la relación profesor-horario
      await fetch(`/api/profesores/${profesorSeleccionado}/horarios/${idschedule}`, {
        method: 'DELETE',
      });

      // Luego eliminar el horario
      await fetch(`/api/horarios/${idschedule}`, {
        method: 'DELETE',
      });

      // Recargar horarios
      cargarHorariosSemana(fechaInicio || obtenerFechaInicioSemana());
    } catch (error) {
      setError('Error al eliminar horario: ' + error.message);
      console.error('Error al eliminar horario:', error);
    }
  };

  // Abrir modal para editar un horario existente
  const abrirModalEdicion = (horario) => {
    setEditandoHorario(horario);
    setNuevoHorario({
      dia: horario.weekDay,
      horaInicio: horario.startHour.slice(0, 5), // Formato HH:MM
      horaFin: horario.finishHour.slice(0, 5), // Formato HH:MM
      idacademies: horario.idacademies
    });
    setModalAbierto(true);
  };

  // Abrir modal para crear un nuevo horario
  const abrirModalCreacion = () => {
    setEditandoHorario(null);
    setNuevoHorario({
      dia: '',
      horaInicio: '',
      horaFin: '',
      idacademies: ''
    });
    setModalAbierto(true);
  };

  // Cargar profesores y academias al montar el componente
  useEffect(() => {
    cargarProfesores();
    cargarAcademias();
    
    // Inicializar la fecha de inicio de semana
    const fechaInicio = obtenerFechaInicioSemana();
    setFechaInicio(fechaInicio);
    setSemanaActual(calcularRangoSemana(fechaInicio));
  }, []);

  // Cargar horarios cuando se selecciona un profesor
  useEffect(() => {
    if (profesorSeleccionado) {
      cargarHorariosSemana(fechaInicio || obtenerFechaInicioSemana());
    }
  }, [profesorSeleccionado]);

  // Renderizar la tabla de horarios
  const renderizarTablaHorarios = () => {
    if (!profesorSeleccionado) {
      return (
        <div className="text-center p-8">
          <p className="text-lg">Seleccione un profesor para ver su horario</p>
        </div>
      );
    }

    if (cargando) {
      return (
        <div className="text-center p-8">
          <p className="text-lg">Cargando horarios...</p>
        </div>
      );
    }

    // Crear matriz para representar el horario
    const matrizHorario = {};
    horasDisponibles.forEach(hora => {
      matrizHorario[hora] = {};
      diasSemana.forEach(dia => {
        matrizHorario[hora][dia] = null;
      });
    });

    // Llenar la matriz con los horarios del profesor
    horarios.forEach(horario => {
      const horaInicio = horario.startHour.slice(0, 5); // Formato HH:MM
      if (horasDisponibles.includes(horaInicio) && diasSemana.includes(horario.weekDay)) {
        matrizHorario[horaInicio][horario.weekDay] = horario;
      }
    });

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Hora</th>
              {diasSemana.map(dia => (
                <th key={dia} className="border p-2">{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horasDisponibles.map(hora => (
              <tr key={hora}>
                <td className="border p-2 font-medium">{hora}</td>
                {diasSemana.map(dia => {
                  const horario = matrizHorario[hora][dia];
                  return (
                    <td key={dia} className="border p-2 min-h-16 h-16">
                      {horario ? (
                        <div className="bg-blue-100 p-2 rounded h-full flex flex-col justify-between">
                          <div>
                            <p className="font-bold">{`${horario.startHour.slice(0, 5)} - ${horario.finishHour.slice(0, 5)}`}</p>
                            <p className="text-sm">{academias.find(a => a.idacademy === horario.idacademies)?.name || 'Academia sin nombre'}</p>
                          </div>
                          <div className="flex justify-end mt-1">
                            <button
                              onClick={() => abrirModalEdicion(horario)}
                              className="text-blue-600 hover:text-blue-800 mr-2"
                            >
                              <span>✏️</span>
                            </button>
                            <button
                              onClick={() => eliminarHorario(horario.idschedule)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <span>🗑️</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setNuevoHorario({
                              ...nuevoHorario,
                              dia,
                              horaInicio: hora,
                              horaFin: `${parseInt(hora.split(':')[0]) + 1}:${hora.split(':')[1]}`
                            });
                            abrirModalCreacion();
                          }}
                          className="text-gray-400 hover:text-gray-800 h-full w-full flex items-center justify-center"
                        >
                          <span>➕</span>
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Modal para crear o editar un horario
  const renderizarModal = () => {
    if (!modalAbierto) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">
            {editandoHorario ? 'Editar Horario' : 'Crear Nuevo Horario'}
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Día de la semana</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={nuevoHorario.dia}
              onChange={(e) => setNuevoHorario({...nuevoHorario, dia: e.target.value})}
            >
              <option value="">Seleccione un día</option>
              {diasSemana.map(dia => (
                <option key={dia} value={dia}>{dia}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Hora de inicio</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={nuevoHorario.horaInicio}
              onChange={(e) => setNuevoHorario({...nuevoHorario, horaInicio: e.target.value})}
            >
              <option value="">Seleccione una hora</option>
              {horasDisponibles.map(hora => (
                <option key={hora} value={hora}>{hora}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Hora de fin</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={nuevoHorario.horaFin}
              onChange={(e) => setNuevoHorario({...nuevoHorario, horaFin: e.target.value})}
            >
              <option value="">Seleccione una hora</option>
              {horasDisponibles.map(hora => (
                <option key={hora} value={hora}>{hora}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Academia</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={nuevoHorario.idacademies}
              onChange={(e) => setNuevoHorario({...nuevoHorario, idacademies: e.target.value})}
            >
              <option value="">Seleccione una academia</option>
              {academias.map(academia => (
                <option key={academia.idacademy} value={academia.idacademy}>
                  {academia.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                setModalAbierto(false);
                setError('');
              }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={editandoHorario ? actualizarHorario : crearHorario}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editandoHorario ? 'Guardar Cambios' : 'Crear Horario'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Horarios de Profesores</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Seleccione un profesor:</label>
        <select
          value={profesorSeleccionado}
          onChange={(e) => setProfesorSeleccionado(e.target.value)}
          className="w-full md:w-1/2 border rounded px-3 py-2"
        >
          <option value="">-- Seleccionar Profesor --</option>
          {profesores.map((profesor) => (
            <option key={profesor.idteacher} value={profesor.idteacher}>
              {profesor.name}
            </option>
          ))}
        </select>
      </div>

      {profesorSeleccionado && (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Semana: {semanaActual}</h2>
          </div>
          <div className="flex mt-4 md:mt-0">
            <button
              onClick={semanaAnterior}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-l"
            >
              ◀ Anterior
            </button>
            <button
              onClick={() => {
                const hoy = obtenerFechaInicioSemana();
                setFechaInicio(hoy);
                cargarHorariosSemana(hoy);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
            >
              Hoy
            </button>
            <button
              onClick={semanaSiguiente}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r"
            >
              Siguiente ▶
            </button>
          </div>
        </div>
      )}

      {renderizarTablaHorarios()}
      {renderizarModal()}

      {profesorSeleccionado && (
        <div className="mt-6">
          <button
            onClick={abrirModalCreacion}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Añadir Nuevo Horario
          </button>
        </div>
      )}
    </div>
  );
}
