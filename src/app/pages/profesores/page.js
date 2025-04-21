'use client';

import React, { useState, useEffect } from 'react';
import { Button, Dialog } from "@headlessui/react";

const ProfesoresPage = () => {
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

  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asignaturas: ['']
  });

  useEffect(() => {
    localStorage.setItem('profesores', JSON.stringify(profesores));
  }, [profesores]);

  const actualizarCampo = (id, campo, valor) => {
    setProfesores((prev) =>
      prev.map((prof) => (prof.id === id ? { ...prof, [campo]: valor } : prof))
    );
  };

  const actualizarAsignatura = (id, index, valor) => {
    setProfesores((prev) =>
      prev.map((prof) => {
        if (prof.id === id) {
          const nuevasAsignaturas = [...prof.asignaturas];
          nuevasAsignaturas[index] = valor;
          return { ...prof, asignaturas: nuevasAsignaturas };
        }
        return prof;
      })
    );
  };

  const agregarAsignatura = (id) => {
    setProfesores((prev) =>
      prev.map((prof) =>
        prof.id === id
          ? { ...prof, asignaturas: [...prof.asignaturas, ''] }
          : prof
      )
    );
  };

  const eliminarAsignatura = (id, index) => {
    setProfesores((prev) =>
      prev.map((prof) => {
        if (prof.id === id) {
          const nuevasAsignaturas = prof.asignaturas.filter((_, i) => i !== index);
          return { ...prof, asignaturas: nuevasAsignaturas };
        }
        return prof;
      })
    );
  };

  const guardarCambios = () => {
    setEditandoId(null);
  };

  const eliminarProfesor = (id) => {
    setProfesores(profesores.filter((p) => p.id !== id));
    if (editandoId === id) setEditandoId(null);
  };

  const profesoresFiltrados = profesores.filter((prof) =>
    prof.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoProfesor = {
      id: profesores.length ? Math.max(...profesores.map((p) => p.id)) + 1 : 1,
      ...formData,
    };
    setProfesores([...profesores, nuevoProfesor]);
    setIsOpen(false);
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      asignaturas: [''],
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Gestión de Profesores</h1>
      <p className="text-gray-600 mb-6">Administra los contactos de los profesores</p>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar profesor..."
          className="border px-3 py-2 rounded w-1/3"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setIsOpen(true)}
        >
          Nuevo Profesor
        </Button>
      </div>

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
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => setEditandoId(profesor.id)}
                >
                  Editar
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => eliminarProfesor(profesor.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-sm text-gray-500">
        Mostrando {profesoresFiltrados.length} contacto(s)
      </div>

      {/* Modal para Añadir Profesor */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6">
            <Dialog.Title className="text-lg font-medium mb-4">Nuevo Profesor</Dialog.Title>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Asignaturas</label>
                  <input
                    type="text"
                    name="asignaturas"
                    value={formData.asignaturas[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        asignaturas: [e.target.value]
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Guardar
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ProfesoresPage;
