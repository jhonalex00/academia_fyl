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
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token');

      const res = await fetch(`http://localhost:3001/api/padres/${user.id}/mensajes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setMensajes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar los mensajes');
    }
  };

  const cargarProfesores = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token');

      const res = await fetch('http://localhost:3001/api/profesores', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setProfesores(Array.isArray(data) ? data : []);
    } catch (err) {
      setProfesores([]);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      cargarMensajes();
      cargarProfesores();
    }
  }, [user]);

  const handleMensajeAdded = async (nuevo) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token');

      const mensajeConPadre = {
        ...nuevo,
        idPadre: user.id,
        remitente: `${user.name} ${user.lastName}`
      };

      const res = await fetch('http://localhost:3001/api/mensajes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(mensajeConPadre),
      });

      if (!res.ok) {
        throw new Error('No se pudo enviar el mensaje');
      }

      cargarMensajes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteMensaje = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token');

      const res = await fetch(`http://localhost:3001/api/mensajes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('No se pudo eliminar el mensaje');
      }

      cargarMensajes();
    } catch (err) {
      setError(err.message);
    }
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