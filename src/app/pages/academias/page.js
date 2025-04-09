'use client';
import React, { useState } from 'react';
import { Button, Dialog } from "@headlessui/react";

export function AñadirAcademia({ onAcademiaAdded }) { // OnAcademiaAdded es para actualizar la lista cuando añadamos una nueva academia
  const [isOpen, setIsOpen] = useState(false); // IsOpen controla si el modal está abierto. Empieza en false, osea que el modal está cerrado
                                              // SetIsOpne es la función que se usa para cambiar de estado el modal
  const [formData, setFormData] = useState({ // FormData es un objeto para almacenar los campos
                                            // y SetFormData se usa para actualizar los campos
    nombre: '',
    direccion: '',
    telefono: '',
    numAlumnos: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAcademiaAdded(formData); // FormData almacena los datos del modal
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

  const handleAcademiaAdded = (nuevaAcademia) => {
    setAcademias([...academias, nuevaAcademia]);
  };

  return (
    <>
      <AñadirAcademia onAcademiaAdded={handleAcademiaAdded} />
      <div className="container mx-auto px-4">
        {/* Contenedor de encabezados con borde inferior */}
        <div className="border-b-2 border-gray-800 pb-4 bg-gray-200">
          <div className="grid grid-cols-4 gap-4 mt-8">
            <h1 className="text-lg font-bold">Academia</h1>
            <h1 className="text-lg font-bold">Dirección</h1>
            <h1 className="text-lg font-bold">Teléfono</h1>
            <h1 className="text-lg font-bold">Nº Alumnos</h1>
          </div>
        </div>
        
        {/* Lista de academias con margen superior */}
        <div className="space-y-2 mt-4">
          {academias.map((academia, index) => (
            <div 
              key={index} 
              className="grid grid-cols-4 gap-4 py-2 hover:bg-gray-100 rounded-lg"
            >
              <span className="truncate">{academia.nombre}</span>
              <span className="truncate">{academia.direccion}</span>
              <span className="truncate">{academia.telefono}</span>
              <span className="truncate">{academia.numAlumnos}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AcademiasPage;