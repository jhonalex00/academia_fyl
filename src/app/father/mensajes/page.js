'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { IoTrashBin } from 'react-icons/io5';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { GestionarMensajesPadre } from '@/components/father/GestionarMensajesPadre';

const MensajesPadrePage = () => {
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [mensajeToEdit, setMensajeToEdit] = useState(null);
  const [profesores, setProfesores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState(null);

  const cargarMensajes = async () => {
    // Datos de ejemplo para mensajes
    const mensajesEjemplo = [
      {
        id: 1,
        profesor: 'Prof. García',
        asunto: 'Progreso en Matemáticas',
        mensaje: 'Su hijo está mostrando excelente progreso en matemáticas.',
        fecha: new Date().toISOString()
      },
      {
        id: 2,
        profesor: 'Prof. Martínez',
        asunto: 'Tarea pendiente',
        mensaje: 'Recordatorio sobre la tarea de lengua para mañana.',
        fecha: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    setMensajes(mensajesEjemplo);
  };

  const cargarProfesores = async () => {
    // Datos de ejemplo para profesores
    const profesoresEjemplo = [
      { id: 1, name: 'Prof. García' },
      { id: 2, name: 'Prof. Martínez' },
      { id: 3, name: 'Prof. Smith' },
      { id: 4, name: 'Prof. López' }
    ];
    setProfesores(profesoresEjemplo);
  };

  useEffect(() => {
    if (user && user.id) {
      cargarMensajes();
      cargarProfesores();
    }
  }, [user]);

  const handleMensajeAdded = async (nuevo) => {
    // Simular agregar mensaje
    const profesorSeleccionado = profesores.find(p => p.id == nuevo.idProfesor);
    const nuevoMensaje = {
      id: Date.now(),
      profesor: profesorSeleccionado?.name || 'Profesor',
      asunto: nuevo.asunto,
      mensaje: nuevo.mensaje,
      fecha: new Date().toISOString()
    };
    
    setMensajes(prev => [nuevoMensaje, ...prev]);
  };

  const handleDeleteMensaje = async (id) => {
    // Simular eliminar mensaje
    setMensajes(prev => prev.filter(m => m.id !== id));
  };

  const mensajesFiltrados = mensajes.filter((m) =>
    m.asunto?.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.mensaje?.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (!user) {
    return <div className="p-4">Por favor, inicie sesión para ver sus mensajes.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Mis Mensajes</h1>
      
      <div className="flex justify-between items-center mt-4">
        <Input
          type="text"
          placeholder="Buscar mensaje..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="max-w-xs"
        />
        <button
          onClick={() => setMensajeToEdit({})}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nuevo Mensaje
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      <div className="mt-10">
        <Table className="text-center">
          <TableHeader className="bg-neutral-100">
            <TableRow>
              <TableHead>Profesor</TableHead>
              <TableHead>Asunto</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mensajesFiltrados.map((mensaje) => (
              <TableRow key={mensaje.id}>
                <TableCell>{mensaje.profesor}</TableCell>
                <TableCell>{mensaje.asunto}</TableCell>
                <TableCell>{mensaje.mensaje}</TableCell>
                <TableCell>{new Date(mensaje.fecha).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <button
                      title="Eliminar"
                      onClick={() => handleDeleteMensaje(mensaje.id ?? mensaje.idmessage)}
                      className="cursor-pointer hover:text-red-500"
                    >
                      <IoTrashBin size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <GestionarMensajesPadre
        isOpen={!!mensajeToEdit}
        onClose={() => setMensajeToEdit(null)}
        onMensajeAdded={handleMensajeAdded}
        profesores={profesores}
      />
    </div>
  );
};

export default MensajesPadrePage;