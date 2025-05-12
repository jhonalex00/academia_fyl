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

// Constantes para la API
const API_BASE_URL = 'http://localhost:3001/api';

// Funciones de utilidad para llamadas a la API
const fetchWithAuth = async (url, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = {
    'Authorization': `Bearer ${token || ''}`,
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    // Si hay un error de autenticación, redirigir al login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Sesión expirada. Por favor, inicia sesión de nuevo.');
  }

  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.statusText}`);
  }

  return response.json();
};

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
      await fetchWithAuth(`${API_BASE_URL}/academias`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      onAcademyAdded(formData);
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
      const data = await fetchWithAuth(`${API_BASE_URL}/academias`);
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
      await fetchWithAuth(`${API_BASE_URL}/academias`, {
        method: 'POST',
        body: JSON.stringify({
          name: newAcademy.name,
          adress: newAcademy.adress,
          phone: newAcademy.phone,
        })
      });

      await readAcademies();
    } catch (error) {
      setError(error.message);
    }
  };

  // Maneja la eliminación de academias
  const handleDeleteAcademy = async (id) => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/academias/${id}`, {
        method: 'DELETE'
      });

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
      await fetchWithAuth(`${API_BASE_URL}/academias/${academyEdited.idacademy}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: academyEdited.nombre,
          adress: academyEdited.direccion,
          phone: academyEdited.telefono,
        })
      });

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