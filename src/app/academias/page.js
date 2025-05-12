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


import { createAcademy } from '@/services/academias';


export function AddAcademy({ onAcademyAdded, academyToEdit, onAcademyEdited }) {
  // Para el control de apertura y cierre del modal
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    adress: '',
    phone: '',
  });

  // Para el control de la edicion de datos de academias existentes
  useEffect(() => {
    if (academyToEdit) {
      setFormData(academyToEdit);
      setIsOpen(true);
    }
  }, [academyToEdit]);

  // Para el control de la apertura del modal para añadir una nueva academia
  const handleAddClick = () => {
    onAcademyEdited(null);
    setFormData({
      name: '',
      adress: '',
      phone: '',
    });
    setIsOpen(true);
  };

  // Para el control del envio del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAcademy(formData);
      // Aquí va el toast :)
      setIsOpen(false);
      setFormData({
        name: '',
        adress: '',
        phone: '',
      });
    } catch (error) {
      console.error("Error al crear la academia:", error);
      // Aquí va el toast :(
    }
  };

  // Para el control de los cambios en los inputs del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Para el control del cierre del modal
  // y la limpieza de los datos del formulario
  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      name: '',
      adress: '',
      phone: '',
    });
    if (academyToEdit) {
      onAcademyEdited(null);
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
              {academyToEdit ? 'Editar Academia' : 'Nueva Academia'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="name" className="text-sm font-medium">Nombre</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="adress" className="text-sm font-medium">Dirección</label>
                <Input
                  id="adress"
                  name="adress"
                  value={formData.adress}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="phone" className="text-sm font-medium">Teléfono</label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.telefono}
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
                {academyToEdit ? 'Actualizar' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

const AcademiasPage = () => {
  const [academies, setAcademies] = useState([]);
  const [academyToEdit, setAcademyToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const readAcademies = async () => {
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
      setAcademies(academiasUnicas);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcademyAdded = async (newAcademy) => {
    try {
      const response = await fetch('http://localhost:3001/api/academias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newAcademy.name,
          adress: newAcademy.adress,
          phone: newAcademy.phone,
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la academia');
      }

      await readAcademies();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteAcademy = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/academias/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la academia');
      }

      readAcademies();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAcademyEdited = async (academyEdited) => {
    if (!academyEdited) {
      setAcademyToEdit(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/academias/${academyEdited.idacademy}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: academyEdited.nombre,
          adress: academyEdited.direccion,
          phone: academyEdited.telefono,

        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la academia');
      }

      await readAcademies();
      setAcademyToEdit(null);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    readAcademies();
  }, []);

  return (
    <>
      <AddAcademy 
        onAcademyAdded={handleAcademyAdded}
        academyToEdit={academyToEdit}
        onAcademyEdited={handleAcademyEdited}
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
            {academies.map((academy) => (
              <TableRow key={academy.idacademy}>
                <TableCell>{academy.name}</TableCell>
                <TableCell>{academy.adress}</TableCell>
                <TableCell>{academy.phone}</TableCell>
                <TableCell>{academy.numStudents}</TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-8">
                    <button 
                      className="cursor-pointer"
                      onClick={() => setAcademyToEdit({
                        idacademy: academy.idacademy,
                        name: academy.name,
                        adress: academy.adress,
                        phone: academy.phone,
                      })}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button 
                      className="cursor-pointer"
                      onClick={() => handleDeleteAcademy(academy.idacademy)}
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