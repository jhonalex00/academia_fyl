'use client';
import { FaEdit } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import React, { useState, useEffect } from 'react';
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

  return (
    <>
      <div className="flex justify-end mr-4">
        <Button onClick={() => setIsOpen(true)}>
          Añadir Profesor
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <Button variant="outline" onClick={() => setIsOpen(false)} type="button">
                Cancelar
              </Button>
              <Button type="submit">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

const ProfesoresPage = () => {
  const [profesores, setProfesores] = useState(() => {
    const datosGuardados = localStorage.getItem('profesores');
    return datosGuardados ? JSON.parse(datosGuardados) : [];
  });
  const [profesorToEdit, setProfesorToEdit] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    localStorage.setItem('profesores', JSON.stringify(profesores));
  }, [profesores]);

  const handleProfesorAdded = (nuevoProfesor) => {
    const profesorConId = {
      ...nuevoProfesor,
      id: profesores.length ? Math.max(...profesores.map(p => p.id)) + 1 : 1
    };
    setProfesores([...profesores, profesorConId]);
  };

  const handleProfesorEdited = (profesorEditado) => {
    setProfesores(profesores.map(prof => 
      prof.id === profesorEditado.id ? profesorEditado : prof
    ));
  };

  const handleDeleteProfesor = (id) => {
    setProfesores(profesores.filter(prof => prof.id !== id));
  };

  const profesoresFiltrados = profesores.filter(prof =>
    prof.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mx-4 mb-4">
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
      
      <div className="mt-4 flex justify-center">
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
              <TableRow key={profesor.id}>
                <TableCell>{profesor.nombre}</TableCell>
                <TableCell>{profesor.email}</TableCell>
                <TableCell>{profesor.telefono}</TableCell>
                <TableCell>{profesor.asignaturas.join(', ')}</TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-8">
                    <button className="cursor-pointer"
                      onClick={() => setProfesorToEdit(profesor)}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button className="cursor-pointer"
                      onClick={() => handleDeleteProfesor(profesor.id)}
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