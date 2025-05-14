'use client';
import { FaEdit } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers = {
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const requestOptions = {
      ...options,
      headers
    };

    console.log('Enviando petición:', {
      url,
      method: options.method || 'GET',
      body: options.body ? JSON.parse(options.body) : undefined
    });

    const response = await fetch(url, requestOptions);
    
    // Obtener el texto de la respuesta primero
    const responseText = await response.text();
    
    // Intentar parsear como JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      // Si no es JSON, usar el texto directamente
      responseData = responseText;
    }

    if (!response.ok) {
      // Construir un mensaje de error más detallado
      const errorMessage = typeof responseData === 'object' && responseData.error 
        ? responseData.error 
        : `Error del servidor (${response.status}): ${responseText || response.statusText}`;
      
      console.error('Error en la respuesta:', {
        status: response.status,
        statusText: response.statusText,
        responseData,
        url,
        method: options.method
      });
      
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error('Error en fetchWithAuth:', {
      message: error.message,
      stack: error.stack,
      url,
      method: options.method
    });
    throw error;
  }
};

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
  
  const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([]);

useEffect(() => {
  const cargarAsignaturas = async () => {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/asignaturas`);
      if (Array.isArray(data)) {
        setAsignaturasDisponibles(data);
      }
    } catch (error) {
      console.error("Error al cargar asignaturas:", error);
    }
  };

  cargarAsignaturas();
}, []);

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
        <Button onClick={handleAddClick}>
          Añadir Profesor
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {profesorToEdit ? 'Editar Profesor' : 'Nuevo Profesor'}
            </DialogTitle>
            <DialogDescription>
              {profesorToEdit ? 'Modifica los datos del profesor' : 'Ingresa los datos del nuevo profesor'}
            </DialogDescription>
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
                <Select
                  value={formData.asignaturas[0]}
                  onValueChange={(value) => setFormData({...formData, asignaturas: [value]})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una asignatura" />
                  </SelectTrigger>
                  <SelectContent>
                    {asignaturasDisponibles.map((asignatura) => (
                      <SelectItem 
                        key={asignatura.id} 
                        value={asignatura.name}
                      >
                        {asignatura.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
      const data = await fetchWithAuth(`${API_BASE_URL}/profesores`);
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
    // Validación de campos
    if (!nuevoProfesor.nombre || !nuevoProfesor.email || !nuevoProfesor.telefono) {
      throw new Error('Todos los campos son obligatorios');
    }

    // Preparar datos
    const profesorData = {
      name: nuevoProfesor.nombre.trim(),
      email: nuevoProfesor.email.trim(),
      phone: nuevoProfesor.telefono.trim(),
      subjects: Array.isArray(nuevoProfesor.asignaturas) && nuevoProfesor.asignaturas.length > 0
        ? nuevoProfesor.asignaturas.filter(Boolean).map(s => s.trim())
        : [],
      status: 'activo'
    };

    console.log('Intentando crear profesor:', profesorData);

    const url = `${API_BASE_URL}/profesores`;
    const response = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(profesorData)
    });

    console.log('Profesor creado exitosamente:', response);
    
    // Solo recargar si la creación fue exitosa
    await cargarProfesores();
    setError(null);
    
    return response;

  } catch (error) {
    console.error('Error detallado al crear profesor:', error);
    setError(error.message || 'Error al crear el profesor');
    throw error;
  }
};

  const handleProfesorEdited = async (profesorEditado) => {
    if (!profesorEditado) {
      setProfesorToEdit(null);
      return;
    }

    try {
      await fetchWithAuth(`${API_BASE_URL}/profesores/${profesorEditado.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: profesorEditado.nombre,
          email: profesorEditado.email,
          phone: profesorEditado.telefono,
          subjects: profesorEditado.asignaturas
        })
      });

      cargarProfesores(); // Recargar la lista de profesores
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteProfesor = async (id) => {
    if (!confirm('¿Está seguro de que desea eliminar este profesor?')) {
      return;
    }

    try {
      await fetchWithAuth(`${API_BASE_URL}/profesores/${id}`, {
        method: 'DELETE'
      });

      cargarProfesores(); // Recargar la lista de profesores
    } catch (error) {
      console.error('Error al eliminar profesor:', error);
      setError(error.message);
    }
  };

  const profesoresFiltrados = profesores.filter(profesor => 
    profesor.name?.toLowerCase().includes(busqueda.toLowerCase())
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
      
      {error && (
        <div className="text-red-500 p-4 mb-4">
          {error}
        </div>
      )}

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
                        id: profesor.idteacher,
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