'use client';
import React, { useState, useEffect } from 'react';
import { Button, Dialog } from "@headlessui/react";

export function AñadirContacto({ onContactoAdded, contactoToEdit, onContactoEdited }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_name: '',
    student_surname: '',
    subject_name: '',
    contact_name: '',
    contact_phone: ''
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
      student_name: '',
      student_surname: '',
      subject_name: '',
      contact_name: '',
      contact_phone: ''
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
            <Dialog.Title className="text-lg font-medium mb-4">
              {contactoToEdit ? 'Editar Contacto' : 'Nuevo Contacto'}
            </Dialog.Title>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre Alumno</label>
                  <input
                    type="text"
                    name="student_name"
                    value={formData.student_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Apellidos Alumno</label>
                  <input
                    type="text"
                    name="student_surname"
                    value={formData.student_surname}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Asignatura</label>
                  <input
                    type="text"
                    name="subject_name"
                    value={formData.subject_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre Contacto</label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono Contacto</label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
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
                  {contactoToEdit ? 'Actualizar' : 'Guardar'}
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
  const [contactoToEdit, setContactoToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const cargarContactos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/contacts/full-info', {
        cache: 'no-store'
      });
      if (!response.ok) {
        throw new Error('Error al cargar los contactos');
      }
      const data = await response.json();
      setContactos(data);
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactoAdded = async (nuevoContacto) => {
    try {
      // Primero creamos el contacto
      const contactResponse = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact1: nuevoContacto.contacto1,
          contact2: nuevoContacto.contacto2
        })
      });
  
      if (!contactResponse.ok) {
        throw new Error('Error al crear el contacto');
      }
  
      const contactData = await contactResponse.json();
  
      // Luego creamos el estudiante
      const studentResponse = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nuevoContacto.nombre,
          surname: nuevoContacto.apellidos,
          cycle: nuevoContacto.ciclo
        })
      });
  
      if (!studentResponse.ok) {
        throw new Error('Error al crear el estudiante');
      }
  
      const studentData = await studentResponse.json();
  
      // Finalmente, creamos la relación en la tabla intermedia
      const relationResponse = await fetch('/api/students_contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idstudent: studentData.idstudent,
          idcontact: contactData.idcontact
        })
      });
  
      if (!relationResponse.ok) {
        throw new Error('Error al vincular estudiante y contacto');
      }
  
      await cargarContactos();
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    }
  };

  const handleDeleteContacto = async (id) => {
    try {
      // Primero eliminamos la relación en la tabla intermedia
      const response = await fetch(`/api/students_contacts/relation/${id}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar la relación');
      }
  
      await cargarContactos();
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    }
  };

  const handleEditContacto = (contacto, index) => {
    setContactoToEdit({ ...contacto, index });
  };

  const handleContactoEdited = async (contactoEditado) => {
    try {
      const studentResponse = await fetch(`/api/students/${contactoEditado.idstudent}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactoEditado.student_name,
          surname: contactoEditado.student_surname,
          idsubject: contactoEditado.idsubject
        })
      });
  
      if (!studentResponse.ok) {
        throw new Error('Error al actualizar el estudiante');
      }
  
      const contactResponse = await fetch(`/api/contacts/${contactoEditado.idcontact}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactoEditado.contact_name,
          phone: contactoEditado.contact_phone
        })
      });
  
      if (!contactResponse.ok) {
        throw new Error('Error al actualizar el contacto');
      }
  
      await cargarContactos();
      setContactoToEdit(null);
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    cargarContactos();
  }, []);

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
          <h1 className="text-lg font-bold text-center">Nombre Alumno</h1>
          <h1 className="text-lg font-bold text-center">Apellidos Alumno</h1>
          <h1 className="text-lg font-bold text-center">Asignatura</h1>
          <h1 className="text-lg font-bold text-center">Nombre Contacto</h1>
          <h1 className="text-lg font-bold text-center">Teléfono Contacto</h1>
          <h1 className="text-lg font-bold text-center">Acciones</h1>
        </div>
        </div>
        
        <div className="space-y-2 mt-4">
        {contactos.map((contacto) => (
          <div 
            key={contacto.idstudent} 
            className="grid grid-cols-6 gap-8 py-2 px-6 hover:bg-gray-100 rounded-lg"
          >
            <span className="text-center">{contacto.student_name}</span>
            <span className="text-center">{contacto.student_surname}</span>
            <span className="text-center">{contacto.subject_name}</span>
            <span className="text-center">{contacto.contact_phone}</span>
            <span className="text-center">{contacto.contact_name}</span>
            <div className="flex justify-center space-x-2">
              <button 
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                onClick={() => handleEditContacto(contacto)}
              >
                Editar
              </button>
              <button 
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                onClick={() => handleDeleteContacto(contacto.idstudent)}
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