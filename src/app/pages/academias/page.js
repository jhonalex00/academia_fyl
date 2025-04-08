'use client';
import React, { useState } from 'react';
import { Button, Dialog } from "@headlessui/react";

export function AñadirAcademia() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    numAlumnos: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAcademiaAdded(formData);
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

// ...resto del código existente...

const AcademiasPage = () => {
  const [academias, setAcademias] = useState([]);

  const handleAcademiaAdded = (nuevaAcademia) => {
    setAcademias([...academias, nuevaAcademia]);
  };

  return (
    <>
      <AñadirAcademia onAcademiaAdded={handleAcademiaAdded} />
      <div style={{ display: 'flex', gap: '18%', marginTop: "3%", marginLeft: "3%" }}>
        <h1>Academia</h1>
        <h1>Dirección</h1>
        <h1>Teléfono</h1>
        <h1>Nº Alumnos</h1>
      </div>
      
      {/* Lista de academias */}
      <div className="mt-4 mx-4">
        {academias.map((academia, index) => (
          <div 
            key={index} 
            className="grid grid-cols-4 gap-[18%] py-2 px-3 hover:bg-gray-100 rounded-lg"
            style={{ marginLeft: "3%" }}
          >
            <span>{academia.nombre}</span>
            <span>{academia.direccion}</span>
            <span>{academia.telefono}</span>
            <span>{academia.numAlumnos}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default AcademiasPage;