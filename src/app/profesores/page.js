'use client';
import { FaEdit } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import React, { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/fetchClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const profesorVacio = () => ({
  id: null,
  nombre: '',
  email: '',
  telefono: '',
  asignaturas: ['']
});

export function AñadirProfesor({ onProfesorAdded, profesorToEdit, onProfesorEdited }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(profesorVacio());

  useEffect(() => {
    if (profesorToEdit) {
      setFormData(profesorToEdit);
      setIsOpen(true);
    }
  }, [profesorToEdit]);

  const handleAddClick = () => {
    onProfesorEdited(null);
    setFormData(profesorVacio());
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (profesorToEdit) {
      onProfesorEdited(formData);
    } else {
      onProfesorAdded(formData);
    }
    setIsOpen(false);
    setFormData(profesorVacio());
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData(profesorVacio());
    if (profesorToEdit) {
      onProfesorEdited(null);
    }
  };

  return (
    <>
      <div className="flex justify-end mr-4 mt-2">
        <Button onClick={() => setIsOpen(true)}>
          Añadir Profesor
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {profesorToEdit ? 'Editar Profesor' : 'Nuevo Profesor'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="nombre" className="text-sm font-medium">Nombre</label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="telefono" className="text-sm font-medium">Teléfono</label>
                <Input
                  id="telefono"
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="asignaturas" className="text-sm font-medium">Asignaturas</label>
                <Input
                  id="asignaturas"
                  name="asignaturas"
                  value={formData.asignaturas[0]}
                  onChange={(e) => setFormData({...formData, asignaturas: [e.target.value]})}
                  className="col-span-3"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} type="button">
                Cancelar
              </Button>
              <Button type="submit">
                {profesorToEdit ? 'Actualizar' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

const ProfesoresPage = () => {
  const [profesores, setProfesores] = useState([]);
  const [profesorToEdit, setProfesorToEdit] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState(null);
  // Cargar profesores de la base de datos  
  const cargarProfesores = async () => {
    try {
      const data = await apiGet('/profesores');
      if (Array.isArray(data)) {
        setProfesores(data);
      } else {
        console.warn("La respuesta de profesores no es un array:", data);
        setProfesores([]);
      }
    } catch (error) {
      console.error("Error al cargar profesores:", error);
      setError(error.message || "Error al cargar profesores");
      setProfesores([]);
    }
  };

  useEffect(() => {
    cargarProfesores();
  }, []);
  const handleProfesorAdded = async (nuevoProfesor) => {
  try {
    await apiPost('/profesores', {
    name: nuevoProfesor.nombre,
    email: nuevoProfesor.email,
    phone: nuevoProfesor.telefono,
    status: 'activo', // O el valor adecuado según tu estructura
  });


    cargarProfesores(); // Recargar la lista de profesores
  } catch (error) {
    setError(error.message);
  }
};

  const handleProfesorEdited = async (profesorEditado) => {
    if (!profesorEditado) {
      setProfesorToEdit(null);
      return;
    }

    try {
  await apiPut(`/profesores/${profesorEditado.id}`, {
    name: profesorEditado.nombre,
    email: profesorEditado.email,
    phone: profesorEditado.telefono,
    subjects: profesorEditado.asignaturas
  });

  cargarProfesores(); // Recargar la lista de profesores
} catch (error) {
  setError(error.message);
}
};

  const handleDeleteProfesor = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/profesores/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el profesor');
      }

      cargarProfesores(); // Recargar la lista de profesores
    } catch (error) {
      setError(error.message);
    }
  };

  const profesoresFiltrados = profesores.filter(prof =>
    prof.name?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mt-2">
        <Input
          type="text"
          placeholder="Buscar profesor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="max-w-xs"
        />
        <AñadirProfesor 
          onProfesorAdded={handleProfesorAdded}
          profesorToEdit={profesorToEdit}
          onProfesorEdited={handleProfesorEdited}
        />
      </div>
      
      <div className="flex justify-center mt-10">
        <Table className="text-center">
          <TableHeader className="bg-neutral-100">
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Asignaturas</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profesoresFiltrados.map((profesor) => (
              <TableRow key={profesor.idteacher}>
                <TableCell>{profesor.name}</TableCell>
                <TableCell>{profesor.email}</TableCell>
                <TableCell>{profesor.phone}</TableCell>
                <TableCell>{profesor.subjects?.join(', ')}</TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-8">
                    <button className="cursor-pointer"
                      onClick={() => setProfesorToEdit({
                      id: profesor.idteacher, // Esto está bien
                      nombre: profesor.name,
                      email: profesor.email,
                      telefono: profesor.phone,
                      asignaturas: profesor.subjects || []
                    })}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button className="cursor-pointer"
                      onClick={() => handleDeleteProfesor(profesor.idteacher)}
                    >
                      <IoTrashBin size={20} />
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

export default ProfesoresPage;