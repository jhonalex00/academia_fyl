'use client';
import React, { useState, useEffect } from 'react';
import { Button, Dialog } from "@headlessui/react";

export function AñadirAcademia({ onAcademiaAdded, academiaToEdit, onAcademiaEdited }) { // OnAcademiaAdded es para actualizar la lista cuando añadamos una nueva academia
  const [isOpen, setIsOpen] = useState(false); // IsOpen controla si el modal está abierto. Empieza en false, osea que el modal está cerrado
                                              // SetIsOpne es la función que se usa para cambiar de estado el modal
  const [formData, setFormData] = useState({ // FormData es un objeto para almacenar los campos
                                            // y SetFormData se usa para actualizar los campos
    nombre: '',
    direccion: '',
    telefono: '',
    numAlumnos: ''
  });

  // Actualiza el formulario cuando se va a editar una academia
  useEffect(() => {
    if (academiaToEdit) {
      setFormData(academiaToEdit);
      setIsOpen(true);
    }
  }, [academiaToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (academiaToEdit) {
      onAcademiaEdited(formData);
    } else {
      onAcademiaAdded(formData);
    }
    setIsOpen(false);
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      numAlumnos: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <div className="flex justify-end mr-4">
        <Button
          className="px-4 py-2 bg-green-400 text-black rounded-lg border-2 hover:bg-green-600"
          onClick={() => setIsOpen(true)}
        >
          Añadir Academia
        </Button>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6">
            <Dialog.Title className="text-lg font-medium mb-4">Nueva Academia</Dialog.Title>
            
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
                  <label className="block text-sm font-medium text-gray-700">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
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
                  <label className="block text-sm font-medium text-gray-700">Número de Alumnos</label>
                  <input
                    type="number"
                    name="numAlumnos"
                    value={formData.numAlumnos}
                    onChange={handleChange}
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
    </>
  );
}


const AcademiasPage = () => {
  const [academias, setAcademias] = useState([]);
  const [academiaToEdit, setAcademiaToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const cargarAcademias = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/academias', {
        cache: 'no-store'
      });
      if (!response.ok) {
        throw new Error('Error al cargar las academias');
      }
      const data = await response.json();
      const academiasUnicas = Array.from(new Map(data.map(item => [item.idacademy, item])).values());
      setAcademias(academiasUnicas);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcademiaAdded = async (nuevaAcademia) => {
    try {
      const response = await fetch('/api/academias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nuevaAcademia.nombre,
          adress: nuevaAcademia.direccion,
          phone: nuevaAcademia.telefono,
          numStudents: nuevaAcademia.numAlumnos
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la academia');
      }

      await cargarAcademias(); // Recargar las academias después de añadir
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleDeleteAcademia = async (id) => {
    try {
      const response = await fetch(`/api/academias/${id}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar la academia');
      }
  
      cargarAcademias(); // Recargar las academias
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleAcademiaEdited = async (academiaEditada) => {
    try {
      const response = await fetch(`/api/academias/${academiaEditada.idacademy}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: academiaEditada.nombre,
          adress: academiaEditada.direccion,
          phone: academiaEditada.telefono
        })
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar la academia');
      }
  
      cargarAcademias(); // Recargar las academias
      setAcademiaToEdit(null);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    cargarAcademias();
  }, []);


  return (
    <>
      <AñadirAcademia 
      onAcademiaAdded={handleAcademiaAdded}
      academiaToEdit={academiaToEdit}
      onAcademiaEdited={handleAcademiaEdited}
    />
              <div className="border-b-2 border-gray-800 bg-gray-200">
          <div className="grid grid-cols-5 gap-8 mt-8 px-6 py-2">
            <h1 className="text-lg font-bold text-center">Academia</h1>
            <h1 className="text-lg font-bold text-center">Dirección</h1>
            <h1 className="text-lg font-bold text-center">Teléfono</h1>
            <h1 className="text-lg font-bold text-center">Nº Alumnos</h1>
            <h1 className="text-lg font-bold text-center">Acciones</h1>
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
        {academias.map((academia) => (
  <div 
    key={academia.idacademy} 
    className="grid grid-cols-5 gap-8 py-2 px-6 hover:bg-gray-100 rounded-lg items-center"
  >
    <span className="text-center">{academia.name}</span>
    <span className="text-center">{academia.adress}</span>
    <span className="text-center">{academia.phone}</span>
    <span className="text-center">{academia.numStudents}</span>
    <div className="flex justify-center space-x-2">
      <button 
        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
        onClick={() => handleEditAcademia(academia)}
      >
        Editar
      </button>
      <button 
        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
        onClick={() => handleDeleteAcademia(academia.idacademy)}
      >
        Borrar
      </button>
    </div>
  </div>
))}
        </div>
    </>
  );
};

export default AcademiasPage;