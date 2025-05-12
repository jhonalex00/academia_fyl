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

// Función para crear una academia
const createAcademy = async (data) => {
  try {
    const response = await fetch('http://localhost:3001/api/academias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la academia');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createAcademy:', error.message);
    throw error;
  }
};

// Componente para añadir o editar academias
export function AddAcademy({ onAcademyAdded, academyToEdit, onAcademyEdited }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    adress: '',
    phone: '',
  });

  // Maneja la edición de academias existentes
  useEffect(() => {
    if (academyToEdit) {
      setFormData(academyToEdit);
      setIsOpen(true);
    }
  }, [academyToEdit]);

  // Abre el modal para añadir una nueva academia
  const handleAddClick = () => {
    onAcademyEdited(null);
    setFormData({
      name: '',
      adress: '',
      phone: '',
    });
    setIsOpen(true);
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newAcademy = await createAcademy(formData); // Llama a createAcademy
      if (onAcademyAdded) {
        onAcademyAdded(newAcademy);
      }
      setIsOpen(false);
      setFormData({
        name: '',
        adress: '',
        phone: '',
      });
    } catch (error) {
      console.error("Error al crear la academia:", error);
    }
  };

  // Maneja los cambios en los inputs del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Cierra el modal y limpia los datos del formulario
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
                  value={formData.phone}
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

// Página principal de academias
const AcademiasPage = () => {
  const [academies, setAcademies] = useState([]);
  const [academyToEdit, setAcademyToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Lee las academias desde el backend
  const readAcademies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/academias', {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error('Error al cargar las academias');
      }
      const data = await response.json();
      setAcademies(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Maneja la creación de academias
  const handleAcademyAdded = async () => {
    await readAcademies();
  };

  // Maneja la eliminación de academias
  const handleDeleteAcademy = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/academias/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la academia');
      }

      readAcademies();
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
        onAcademyEdited={setAcademyToEdit}
      />

      <div className="mt-10 flex justify-center">
        <Table className="text-center">
          <TableHeader className="bg-neutral-100">
            <TableRow>
              <TableHead>Academia</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {academies.map((academy) => (
              <TableRow key={academy.idacademy}>
                <TableCell>{academy.name}</TableCell>
                <TableCell>{academy.adress}</TableCell>
                <TableCell>{academy.phone}</TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-8">
                    <button
                      className="cursor-pointer"
                      onClick={() => setAcademyToEdit(academy)}
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