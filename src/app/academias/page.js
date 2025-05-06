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

export function AñadirAcademia({ onAcademiaAdded, academiaToEdit, onAcademiaEdited }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    numAlumnos: ''
  });

  useEffect(() => {
    if (academiaToEdit) {
      setFormData(academiaToEdit);
      setIsOpen(true);
    }
  }, [academiaToEdit]);

  const handleAddClick = () => {
    onAcademiaEdited(null);
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      numAlumnos: ''
    });
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (academiaToEdit) {
      onAcademiaEdited(formData);
    } else {
      onAcademiaAdded(formData);
    }
    setIsOpen(false);
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      numAlumnos: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      numAlumnos: ''
    });
    if (academiaToEdit) {
      onAcademiaEdited(null);
    }
  };

  return (
    <>
      <div className="flex justify-end mr-4 mt-4">
        <Button onClick={handleAddClick}>
          Añadir Academia
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {academiaToEdit ? 'Editar Academia' : 'Nueva Academia'}
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
                <label htmlFor="direccion" className="text-sm font-medium">Dirección</label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
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
                <label htmlFor="numAlumnos" className="text-sm font-medium">Número de Alumnos</label>
                <Input
                  id="numAlumnos"
                  type="number"
                  name="numAlumnos"
                  value={formData.numAlumnos}
                  onChange={handleChange}
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
                {academiaToEdit ? 'Actualizar' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

const AcademiasPage = () => {
  const [academias, setAcademias] = useState([]);
  const [academiaToEdit, setAcademiaToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const cargarAcademias = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/academias', {
        cache: 'no-store'
      });
      if (!response.ok) {
        throw new Error('Error al cargar las academias');
      }
      const data = await response.json();
      const academiasUnicas = Array.from(new Map(data.map(item => [item.idacademy, item])).values());
      setAcademias(academiasUnicas);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcademiaAdded = async (nuevaAcademia) => {
    try {
      const response = await fetch('http://localhost:3001/api/academias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nuevaAcademia.nombre,
          adress: nuevaAcademia.direccion,
          phone: nuevaAcademia.telefono,
          numStudents: nuevaAcademia.numAlumnos
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la academia');
      }

      await cargarAcademias();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteAcademia = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/academias/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la academia');
      }

      cargarAcademias();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAcademiaEdited = async (academiaEditada) => {
    if (!academiaEditada) {
      setAcademiaToEdit(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/academias/${academiaEditada.idacademy}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: academiaEditada.nombre,
          adress: academiaEditada.direccion,
          phone: academiaEditada.telefono,
          numStudents: academiaEditada.numAlumnos
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la academia');
      }

      await cargarAcademias();
      setAcademiaToEdit(null);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    cargarAcademias();
  }, []);

  return (
    <>
      <AñadirAcademia 
        onAcademiaAdded={handleAcademiaAdded}
        academiaToEdit={academiaToEdit}
        onAcademiaEdited={handleAcademiaEdited}
      />
      
      <div className="mt-10 flex justify-center">
        <Table className="text-center">
          <TableHeader className="bg-neutral-100">
            <TableRow>
              <TableHead>Academia</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Nº Alumnos</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {academias.map((academia) => (
              <TableRow key={academia.idacademy}>
                <TableCell>{academia.name}</TableCell>
                <TableCell>{academia.adress}</TableCell>
                <TableCell>{academia.phone}</TableCell>
                <TableCell>{academia.numStudents}</TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-8">
                    <button 
                      className="cursor-pointer"
                      onClick={() => setAcademiaToEdit({
                        idacademy: academia.idacademy,
                        nombre: academia.name,
                        direccion: academia.adress,
                        telefono: academia.phone,
                        numAlumnos: academia.numStudents
                      })}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button 
                      className="cursor-pointer"
                      onClick={() => handleDeleteAcademia(academia.idacademy)}
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

export default AcademiasPage;