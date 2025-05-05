'use client';
import { FaEdit } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MensajesPage = () => {
  const [mensajes, setMensajes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const cargarMensajes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/mensajes', {
        cache: 'no-store'
      });
      if (!response.ok) {
        throw new Error('Error al cargar los mensajes');
      }
      const data = await response.json();
      setMensajes(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarMensajes();
  }, []);

  const mensajesFiltrados = mensajes.filter(mensaje =>
    mensaje.remitente?.toLowerCase().includes(busqueda.toLowerCase()) ||
    mensaje.asunto?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {/* Añadimos el input de búsqueda */}
      <div className="flex justify-between items-center mx-4 mb-4">
        <Input
          type="text"
          placeholder="Buscar mensaje..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      <div className="mt-4">
        <Table className="text-center">
          <TableHeader className="bg-neutral-100">
            <TableRow>
              <TableHead>Alumno</TableHead>
              <TableHead>Profesor</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mensajesFiltrados.map((mensaje) => (
              <TableRow key={mensaje.id}>
                <TableCell>{mensaje.remitente}</TableCell>
                <TableCell>{mensaje.asunto}</TableCell>
                <TableCell>{new Date(mensaje.fecha).toLocaleDateString()}</TableCell>
                <TableCell>{mensaje.estado}</TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-8">
                    <button className="cursor-pointer">
                      <FaEdit size={20} />
                    </button>
                    <button className="cursor-pointer">
                      <IoTrashBin size={20} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MensajesPage;