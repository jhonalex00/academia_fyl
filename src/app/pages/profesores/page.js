"use client";

import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Check } from 'lucide-react';

const ProfesoresPage = () => {
  // Estado inicial con localStorage: si hay datos guardados, los usa; si no, usa 3 profesores vacíos
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

  const [editandoId, setEditandoId] = useState(null); // ID del profesor que se está editando
  const [busqueda, setBusqueda] = useState(''); // Texto del input de búsqueda

  // Cada vez que cambia la lista de profesores, se guarda en localStorage
  useEffect(() => {
    localStorage.setItem('profesores', JSON.stringify(profesores));
  }, [profesores]);

  // Función para actualizar cualquier campo de un profesor
  const actualizarCampo = (id, campo, valor) => {
    setProfesores((prev) =>
      prev.map((prof) => (prof.id === id ? { ...prof, [campo]: valor } : prof))
    );
  };

  const guardarCambios = () => {
    setEditandoId(null); // Salir del modo edición
  };

  // Elimina un profesor y cierra la edición si se estaba editando ese campo
  const eliminarProfesor = (id) => {
    setProfesores(profesores.filter((p) => p.id !== id));
    if (editandoId === id) setEditandoId(null);
  };

  // Filtro de profesores basado en la búsqueda por nombre
  const profesoresFiltrados = profesores.filter((prof) =>
    prof.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Gestión de Profesores</h1>
      <p className="text-gray-600 mb-6">Administra los contactos de los profesores</p>

      {/* Input de búsqueda y botón para crear nuevo profesor */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar profesor..."
          className="border px-3 py-2 rounded w-1/3"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          onClick={() => {
            // Crea nuevo profesor con ID incremental
            const nuevoId = profesores.length ? Math.max(...profesores.map((p) => p.id)) + 1 : 1;
            const nuevo = {
              id: nuevoId,
              nombre: '',
              email: '',
              telefono: '',
              asignaturas: [''],
            };
            setProfesores([...profesores, nuevo]);
            setEditandoId(nuevoId); // Inicia edición directa del nuevo
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
           Nuevo Profesor
        </button>
      </div>

      {/* Tabla de profesores */}
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
              {/* Campo nombre editable */}
              <td className="px-4 py-2">
                {editandoId === profesor.id ? (
                  <input
                    className="border px-2 py-1 w-full"
                    value={profesor.nombre}
                    onChange={(e) => actualizarCampo(profesor.id, 'nombre', e.target.value)}
                  />
                ) : (
                  profesor.nombre
                )}
              </td>

              {/* Campo email editable */}
              <td className="px-4 py-2">
                {editandoId === profesor.id ? (
                  <input
                    className="border px-2 py-1 w-full"
                    value={profesor.email}
                    onChange={(e) => actualizarCampo(profesor.id, 'email', e.target.value)}
                  />
                ) : (
                  profesor.email
                )}
              </td>

              {/* Campo teléfono editable */}
              <td className="px-4 py-2">
                {editandoId === profesor.id ? (
                  <input
                    className="border px-2 py-1 w-full"
                    value={profesor.telefono}
                    onChange={(e) => actualizarCampo(profesor.id, 'telefono', e.target.value)}
                  />
                ) : (
                  profesor.telefono
                )}
              </td>

              {/* Campo asignaturas editable, separadas por coma */}
              <td className="px-4 py-2">
                {editandoId === profesor.id ? (
                  <input
                    className="border px-2 py-1 w-full"
                    value={profesor.asignaturas.join(', ')}
                    onChange={(e) =>
                      actualizarCampo(
                        profesor.id,
                        'asignaturas',
                        e.target.value.split(',').map((a) => a.trim())
                      )
                    }
                  />
                ) : (
                  profesor.asignaturas.join(', ')
                )}
              </td>

              {/* Botones de acción: editar, guardar, eliminar */}
              <td className="px-4 py-2 flex space-x-2">
                {editandoId === profesor.id ? (
                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={guardarCambios}
                  >
                    <Check size={18} />
                  </button>
                ) : (
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => setEditandoId(profesor.id)}
                  >
                    <Pencil size={18} />
                  </button>
                )}
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => eliminarProfesor(profesor.id)}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación (estática por ahora) */}
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
    </div>
  );
};

export default ProfesoresPage;
