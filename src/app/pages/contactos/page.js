'use client';
import React, { useState } from 'react';
import { Button, Dialog } from "@headlessui/react";

export function AñadirContacto({ onContactoAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    ciclo: '',
    contacto1: '',
    contacto2: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onContactoAdded(formData);
    setIsOpen(false);
    setFormData({
      nombre: '',
      apellidos: '',
      ciclo: '',
      contacto1: '',
      contacto2: ''
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
          Añadir Contacto
        </Button>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6">
            <Dialog.Title className="text-lg font-medium mb-4">Nuevo Contacto</Dialog.Title>
            
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
                  <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Ciclo</label>
                  <input
                    type="text"
                    name="ciclo"
                    value={formData.ciclo}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contacto 1</label>
                  <input
                    type="tel"
                    name="contacto1"
                    value={formData.contacto1}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contacto 2</label>
                  <input
                    type="tel"
                    name="contacto2"
                    value={formData.contacto2}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
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

const ContactosPage = () => {
  const [contactos, setContactos] = useState([]);

  const handleContactoAdded = (nuevoContacto) => {
    setContactos([...contactos, nuevoContacto]);
  };

  return (
    <>
      <AñadirContacto onContactoAdded={handleContactoAdded} />
      <div className="container mx-auto px-4">
        <div className="border-b-2 border-gray-800 bg-gray-200">
          <div className="grid grid-cols-5 gap-8 mt-8 px-6 py-2">
            <h1 className="text-lg font-bold pl-2">Nombre</h1>
            <h1 className="text-lg font-bold">Apellidos</h1>
            <h1 className="text-lg font-bold">Ciclo</h1>
            <h1 className="text-lg font-bold">Contacto 1</h1>
            <h1 className="text-lg font-bold">Contacto 2</h1>
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          {contactos.map((contacto, index) => (
            <div 
              key={index} 
              className="grid grid-cols-5 gap-8 py-2 px-6 hover:bg-gray-100 rounded-lg"
            >
              <span className="truncate pl-2">{contacto.nombre}</span>
              <span className="truncate">{contacto.apellidos}</span>
              <span className="truncate">{contacto.ciclo}</span>
              <span className="truncate">{contacto.contacto1}</span>
              <span className="truncate">{contacto.contacto2}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ContactosPage;