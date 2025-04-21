"use client";

import React, { useState, useEffect } from 'react';


const ProfesoresPage = () => {
  // Estado inicial: carga desde localStorage o crea 3 profesores vacíos
  const [profesores, setProfesores] = useState(() => {
    const datosGuardados = localStorage.getItem('profesores');
    return datosGuardados
      ? JSON.parse(datosGuardados)
      : [
          { id: 1, nombre: '', email: '', telefono: '', asignaturas: [''] },
          { id: 2, nombre: '', email: '', telefono: '', asignaturas: [''] },
          { id: 3, nombre: '', email: '', telefono: '', asignaturas: [''] },
        ];
  });

  // Estados para manejar búsqueda, edición y modal
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [profesorTemporal, setProfesorTemporal] = useState({ id: null, nombre: '', email: '', telefono: '', asignaturas: [''] });

  // Guarda automáticamente en localStorage cuando cambia la lista
  useEffect(() => {
    localStorage.setItem('profesores', JSON.stringify(profesores));
  }, [profesores]);

  // Abre el modal para crear un nuevo profesor
  const abrirModalNuevo = () => {
    const nuevoId = profesores.length ? Math.max(...profesores.map((p) => p.id)) + 1 : 1;
    setProfesorTemporal({ id: nuevoId, nombre: '', email: '', telefono: '', asignaturas: [''] });
    setModalAbierto(true);
  };

  // Abre el modal para editar un profesor existente
  const abrirModalEditar = (profesor) => {
    setProfesorTemporal({ ...profesor });
    setModalAbierto(true);
  };

  // Cierra el modal y limpia el estado temporal
  const cerrarModal = () => {
    setModalAbierto(false);
    setProfesorTemporal({ id: null, nombre: '', email: '', telefono: '', asignaturas: [''] });
  };

  // Guarda el nuevo profesor o actualiza uno existente
  const guardarProfesor = () => {
    setProfesores((prev) => {
      const existe = prev.find((p) => p.id === profesorTemporal.id);
      if (existe) {
        return prev.map((p) => (p.id === profesorTemporal.id ? profesorTemporal : p));
      } else {
        return [...prev, profesorTemporal];
      }
    });
    cerrarModal();
  };

  // Elimina un profesor de la lista
  const eliminarProfesor = (id) => {
    setProfesores(profesores.filter((p) => p.id !== id));
  };

  // Filtra los profesores por el nombre ingresado en la búsqueda
  const profesoresFiltrados = profesores.filter((prof) =>
    prof.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Gestión de Profesores</h1>
      <p className="text-gray-600 mb-6">Administra los contactos de los profesores</p>

      {/* Input de búsqueda y botón de nuevo */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar profesor..."
          className="border px-3 py-2 rounded w-1/3"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          onClick={abrirModalNuevo}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo Profesor
        </button>
      </div>

      {/* Tabla con los profesores filtrados */}
      <table className="w-full border shadow-sm rounded overflow-hidden text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Nombre</th>
            <th className="text-left px-4 py-2">Email</th>
            <th className="text-left px-4 py-2">Teléfono</th>
            <th className="text-left px-4 py-2">Asignaturas</th>
            <th className="text-left px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesoresFiltrados.map((profesor) => (
            <tr key={profesor.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{profesor.nombre}</td>
              <td className="px-4 py-2">{profesor.email}</td>
              <td className="px-4 py-2">{profesor.telefono}</td>
              <td className="px-4 py-2">{profesor.asignaturas.join(', ')}</td>
              <td className="px-4 py-2 flex space-x-2">
                {/* Botón para editar */}
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => abrirModalEditar(profesor)}
                >
                </button>
                {/* Botón para eliminar */}
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => eliminarProfesor(profesor.id)}
                >
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación estática */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Mostrando {profesoresFiltrados.length} contacto(s)
        </p>
        <div className="space-x-1">
          <button className="px-2 py-1 border rounded bg-white hover:bg-gray-100">Anterior</button>
          <button className="px-3 py-1 border rounded bg-blue-600 text-white">1</button>
          <button className="px-2 py-1 border rounded bg-white hover:bg-gray-100">2</button>
          <button className="px-2 py-1 border rounded bg-white hover:bg-gray-100">Siguiente</button>
        </div>
      </div>

      {/* Modal para agregar/editar profesor */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">
              {profesorTemporal.id && profesores.find((p) => p.id === profesorTemporal.id)
                ? 'Editar Profesor'
                : 'Nuevo Profesor'}
            </h2>

            {/* Formulario dentro del modal */}
            <div className="space-y-4">
              <input
                className="border px-3 py-2 rounded w-full"
                placeholder="Nombre"
                value={profesorTemporal.nombre}
                onChange={(e) => setProfesorTemporal({ ...profesorTemporal, nombre: e.target.value })}
              />
              <input
                className="border px-3 py-2 rounded w-full"
                placeholder="Email"
                value={profesorTemporal.email}
                onChange={(e) => setProfesorTemporal({ ...profesorTemporal, email: e.target.value })}
              />
              <input
                className="border px-3 py-2 rounded w-full"
                placeholder="Teléfono"
                value={profesorTemporal.telefono}
                onChange={(e) => setProfesorTemporal({ ...profesorTemporal, telefono: e.target.value })}
              />
              <input
                className="border px-3 py-2 rounded w-full"
                placeholder="Asignaturas (separadas por coma)"
                value={profesorTemporal.asignaturas.join(', ')}
                onChange={(e) =>
                  setProfesorTemporal({
                    ...profesorTemporal,
                    asignaturas: e.target.value.split(',').map((a) => a.trim()),
                  })
                }
              />
            </div>

            {/* Botones del modal */}
            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={cerrarModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={guardarProfesor}
              >
                Guardar
              </button>
            </div>

            {/* Botón para cerrar modal en la esquina */}
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={cerrarModal}
            >
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfesoresPage;