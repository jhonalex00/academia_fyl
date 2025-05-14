'use client';
import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { IoTrashBin } from 'react-icons/io5';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  const [contactos, setContactos] = useState([]); // ✅ inicializado como array
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
      if (Array.isArray(data)) {
        setContactos(data);
      } else {
        console.warn("Respuesta inesperada en contactos:", data);
        setContactos([]);
      }
    } catch (err) {
      console.error('Error al cargar contactos:', err);
      setContactos([]);
    }
  };

  const cargarProfesores = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/profesores');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProfesores(data);
      } else {
        console.warn("Respuesta inesperada en profesores:", data);
        setProfesores([]);
      }
    } catch (err) {
      console.error('Error al cargar profesores:', err);
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
      await fetch('http://localhost:3001/api/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo),
      });
      cargarMensajes();
    } catch (err) {
      setError('Error al crear el mensaje');
    }
  };

  const handleMensajeEdited = async (editado) => {
    if (!editado) {
      setMensajeToEdit(null);
      return;
    }

    try {
      await fetch(`http://localhost:3001/api/mensajes/${editado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editado),
      });
      setMensajeToEdit(null);
      cargarMensajes();
    } catch (err) {
      setError('Error al actualizar el mensaje');
    }
  };

  const handleDeleteMensaje = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/mensajes/${id}`, {
        method: 'DELETE',
      });
      cargarMensajes();
    } catch (err) {
      setError('Error al eliminar el mensaje');
    }
  };

  const mensajesFiltrados = mensajes.filter((m) =>
    m.remitente?.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.asunto?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mt-2">
        <Input
          type="text"
          placeholder="Buscar mensaje..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="max-w-xs"
        />
        <GestionarMensajes
          onMensajeAdded={handleMensajeAdded}
          mensajeToEdit={mensajeToEdit}
          onMensajeEdited={handleMensajeEdited}
          contactos={Array.isArray(contactos) ? contactos : []} // ✅ protección adicional
          profesores={Array.isArray(profesores) ? profesores : []}
        />
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      <div className="flex justify-center mt-10">
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
                  <div className="flex justify-center space-x-4">
                    <button
                      title="Editar"
                      onClick={() =>
                        setMensajeToEdit({
                          id: mensaje.id,
                          idcontact: mensaje.idcontact,
                          idteacher: mensaje.idteacher,
                          message: mensaje.mensaje,
                          date: mensaje.fecha.split('T')[0],
                        })
                      }
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      title="Eliminar"
                      onClick={() => handleDeleteMensaje(mensaje.id)}
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
    </>
  );
};

export default MensajesPage;
