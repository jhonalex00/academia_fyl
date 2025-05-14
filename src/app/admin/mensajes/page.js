'use client';
import React, { useState, useEffect } from 'react';
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

import { GestionarMensajes } from '@/components/GestionarMensajes';

const MensajesPage = () => {
  const [mensajes, setMensajes] = useState([]);
  const [mensajeToEdit, setMensajeToEdit] = useState(null);
  const [contactos, setContactos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState(null);

  const cargarMensajes = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/mensajes');
      const data = await res.json();
      setMensajes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar los mensajes');
    }
  };

  const cargarContactos = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/contactos');
      const data = await res.json();
      setContactos(Array.isArray(data) ? data : []);
    } catch (err) {
      setContactos([]);
    }
  };

  const cargarProfesores = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/profesores');
      const data = await res.json();
      setProfesores(Array.isArray(data) ? data : []);
    } catch (err) {
      setProfesores([]);
    }
  };

  useEffect(() => {
    cargarMensajes();
    cargarContactos();
    cargarProfesores();
  }, []);

  const handleMensajeAdded = async (nuevo) => {
    try {
      const res = await fetch('http://localhost:3001/api/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo),
      });

      if (!res.ok) {
        throw new Error('No se pudo guardar el mensaje');
      }

      cargarMensajes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMensajeEdited = async (editado) => {
    if (!editado) {
      setMensajeToEdit(null);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/mensajes/${editado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editado),
      });

      if (!res.ok) {
        throw new Error('No se pudo actualizar el mensaje');
      }

      setMensajeToEdit(null);
      cargarMensajes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteMensaje = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/mensajes/${id}`, {
        method: 'DELETE',
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
    m.remitente?.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.asunto?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mt-4">
        <Input
          type="text"
          placeholder="Buscar mensaje..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      <div className="mt-10">
        <Table className="text-center">
          <TableHeader className="bg-neutral-100">
            <TableRow>
              <TableHead>Alumno</TableHead>
              <TableHead>Profesor</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mensajesFiltrados.map((mensaje) => (
              <TableRow key={mensaje.id}>
                <TableCell>{mensaje.remitente}</TableCell>
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

      {/* Modal sigue funcionando solo para editar si se invoca desde código */}
      <GestionarMensajes
        onMensajeAdded={handleMensajeAdded}
        mensajeToEdit={mensajeToEdit}
        onMensajeEdited={handleMensajeEdited}
        contactos={contactos}
        profesores={profesores}
      />
    </>
  );
};

export default MensajesPage;
