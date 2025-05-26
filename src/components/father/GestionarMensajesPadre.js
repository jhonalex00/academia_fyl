'use client';

import React, { useState } from 'react';

export const GestionarMensajesPadre = ({ isOpen, onClose, onMensajeAdded, profesores }) => {
  const [formData, setFormData] = useState({
    idProfesor: '',
    asunto: '',
    mensaje: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.idProfesor && formData.asunto && formData.mensaje) {
      onMensajeAdded(formData);
      setFormData({ idProfesor: '', asunto: '', mensaje: '' });
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Nuevo Mensaje</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profesor
            </label>
            <select
              name="idProfesor"
              value={formData.idProfesor}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Seleccionar profesor</option>
              {profesores.map(profesor => (
                <option key={profesor.id || profesor.idteacher} value={profesor.id || profesor.idteacher}>
                  {profesor.name || profesor.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asunto
            </label>
            <input
              type="text"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Asunto del mensaje"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje
            </label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Escriba su mensaje aquí..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Enviar Mensaje
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 