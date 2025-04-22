'use client';
import React, { useState, useEffect } from 'react';
import { Button, Dialog } from "@headlessui/react";

export function AñadirContacto({ onContactoAdded, contactoToEdit, onContactoEdited }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    ciclo: '',
    contacto1: '',
    contacto2: ''
  });

  useEffect(() => {
    if (contactoToEdit) {
      setFormData(contactoToEdit);
      setIsOpen(true);
    }
  }, [contactoToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contactoToEdit) {
      onContactoEdited(formData);
    } else {
      onContactoAdded(formData);
    }
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
                  <label className="block text-sm font-medium text-gray-700">Nombre alumno</label>
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
                  <label className="block text-sm font-medium text-gray-700">Apellidos alumno</label>
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
  const [contactos, setContactos] = useState(() => {
    const savedContactos = localStorage.getItem('contactos');
    return savedContactos ? JSON.parse(savedContactos) : [];
  });
  const [contactoToEdit, setContactoToEdit] = useState(null);

  useEffect(() => {
    localStorage.setItem('contactos', JSON.stringify(contactos));
  }, [contactos]);

  const handleContactoAdded = (nuevoContacto) => {
    setContactos([...contactos, nuevoContacto]);
  };

  const handleDeleteContacto = (index) => {
    const nuevosContactos = contactos.filter((_, i) => i !== index);
    setContactos(nuevosContactos);
  };

  const handleEditContacto = (contacto, index) => {
    setContactoToEdit({ ...contacto, index });
  };

  const handleContactoEdited = (contactoEditado) => {
    const nuevosContactos = contactos.map((contacto, index) => 
      index === contactoToEdit.index ? contactoEditado : contacto
    );
    setContactos(nuevosContactos);
    setContactoToEdit(null);
  };

  return (
    <>
      <AñadirContacto 
        onContactoAdded={handleContactoAdded}
        contactoToEdit={contactoToEdit}
        onContactoEdited={handleContactoEdited}
      />
      <div className="container mx-auto px-4">
        <div className="border-b-2 border-gray-800 bg-gray-200">
          <div className="grid grid-cols-6 gap-8 mt-8 px-6 py-2">
            <h1 className="text-lg font-bold text-center">Nombre alumno</h1>
            <h1 className="text-lg font-bold text-center">Apellidos alumno</h1>
            <h1 className="text-lg font-bold text-center">Ciclo</h1>
            <h1 className="text-lg font-bold text-center">Contacto 1</h1>
            <h1 className="text-lg font-bold text-center">Contacto 2</h1>
            <h1 className="text-lg font-bold text-center">Acciones</h1>
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          {contactos.map((contacto, index) => (
            <div 
              key={index} 
              className="grid grid-cols-6 gap-8 py-2 px-6 hover:bg-gray-100 rounded-lg"
            >
              <span className="text-center">{contacto.nombre}</span>
              <span className="text-center">{contacto.apellidos}</span>
              <span className="text-center">{contacto.ciclo}</span>
              <span className="text-center">{contacto.contacto1}</span>
              <span className="text-center">{contacto.contacto2}</span>
              <div className="flex justify-center space-x-2">
                <button 
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                  onClick={() => handleEditContacto(contacto, index)}
                >
                  Editar
                </button>
                <button 
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                  onClick={() => handleDeleteContacto(index)}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ContactosPage;