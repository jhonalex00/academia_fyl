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
      
      console.error('Error detallado en la respuesta:', {
        status: response.status,
        statusText: response.statusText,
        responseData: responseData,
        responseText: responseText,
        url,
        method: options.method,
        requestBody: options.body ? JSON.parse(options.body) : undefined
      });

      // Mostrar información adicional si está disponible
      if (responseData && typeof responseData === 'object') {
        console.error('Detalles adicionales del error:', {
          error: responseData.error,
          details: responseData.details,
          sqlError: responseData.sqlError
        });
      }
      
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
  password: '',
  asignaturas: []
});

export function AñadirProfesor({ onProfesorAdded, profesorToEdit, onProfesorEdited }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(profesorVacio());
  const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([]);
  const [asignaturasSeleccionadas, setAsignaturasSeleccionadas] = useState([]);

  useEffect(() => {
    const cargarAsignaturas = async () => {
      try {
        const data = await fetchWithAuth(`${API_BASE_URL}/asignaturas`);
        console.log('Estructura completa de asignaturas:', JSON.stringify(data, null, 2));
        if (Array.isArray(data)) {
          // Asegurarnos de que cada asignatura tenga un identificador único y usar 'cycle' como nombre
          const asignaturasConId = data.map((asignatura, index) => ({
            ...asignatura,
            id: asignatura.idsubject,
            name: asignatura.cycle, // Usar 'cycle' como nombre de la asignatura
            _id: asignatura.idsubject || `asignatura-${index}`
          }));
          console.log('Asignaturas procesadas:', asignaturasConId);
          setAsignaturasDisponibles(asignaturasConId);
        }
      } catch (error) {
        console.error("Error al cargar asignaturas:", error);
      }
    };

    cargarAsignaturas();
  }, []);

  useEffect(() => {
    if (profesorToEdit) {
      setFormData({
        ...profesorToEdit,
        // Asegurar que todos los campos tengan valores string válidos
        nombre: profesorToEdit.nombre || '',
        email: profesorToEdit.email || '',
        telefono: profesorToEdit.telefono || '',
        password: profesorToEdit.password || ''
      });
      setAsignaturasSeleccionadas(profesorToEdit.asignaturas || []);
      setIsOpen(true);
    }
  }, [profesorToEdit]);

  const handleAddClick = () => {
    onProfesorEdited(null);
    setFormData(profesorVacio());
    setAsignaturasSeleccionadas([]);
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const profesorData = {
      ...formData,
      asignaturas: asignaturasSeleccionadas
    };
    
    console.log('Enviando datos del profesor:', JSON.stringify(profesorData, null, 2));
    
    if (profesorToEdit) {
      onProfesorEdited(profesorData);
    } else {
      onProfesorAdded(profesorData);
    }
    setIsOpen(false);
    setFormData(profesorVacio());
    setAsignaturasSeleccionadas([]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData(profesorVacio());
    setAsignaturasSeleccionadas([]);
    if (profesorToEdit) {
      onProfesorEdited(null);
    }
  };

  const toggleAsignatura = (asignaturaNombre) => {
    setAsignaturasSeleccionadas(prev => {
      if (prev.includes(asignaturaNombre)) {
        return prev.filter(a => a !== asignaturaNombre);
      } else {
        return [...prev, asignaturaNombre];
      }
    });
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
                  onChange={(e) => setFormData({
                    ...formData,
                    [e.target.name]: e.target.value
                  })}
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
                  onChange={(e) => setFormData({
                    ...formData,
                    [e.target.name]: e.target.value
                  })}
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
                  onChange={(e) => setFormData({
                    ...formData,
                    [e.target.name]: e.target.value
                  })}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({
                    ...formData,
                    [e.target.name]: e.target.value
                  })}
                  className="col-span-3"
                  // required
                  placeholder={profesorToEdit ? "Dejar vacío para mantener la actual" : "Ingresa una contraseña"}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="asignaturas" className="text-sm font-medium">Asignaturas</label>
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                  {asignaturasDisponibles && asignaturasDisponibles.length > 0 ? (
                    asignaturasDisponibles.map((asignatura) => (
                      <div key={asignatura.id} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          id={`asignatura-${asignatura.id}`}
                          checked={asignaturasSeleccionadas.includes(asignatura.name)}
                          onChange={() => toggleAsignatura(asignatura.name)}
                          className="rounded"
                        />
                        <label 
                          htmlFor={`asignatura-${asignatura.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {asignatura.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No hay asignaturas disponibles</p>
                  )}
                </div>
                {asignaturasSeleccionadas.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Seleccionadas:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {asignaturasSeleccionadas.map((asignatura) => (
                        <span 
                          key={asignatura}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {asignatura}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
      console.log('Profesores cargados desde la base de datos:', JSON.stringify(data, null, 2));
      console.log('IDs de profesores disponibles:', data.map(p => p.idteacher));
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
      if (!nuevoProfesor.nombre || !nuevoProfesor.email || !nuevoProfesor.telefono || !nuevoProfesor.password) {
        throw new Error('Todos los campos son obligatorios');
      }

      // Preparar datos exactamente como los espera el servidor
      const profesorData = {
        name: (nuevoProfesor.nombre || '').trim(),
        email: (nuevoProfesor.email || '').trim(),
        phone: (nuevoProfesor.telefono || '').trim(),
        password: (nuevoProfesor.password || '').trim(),
        subjects: Array.isArray(nuevoProfesor.asignaturas) ? nuevoProfesor.asignaturas.filter(Boolean) : [],
        status: 'active'
      };

      // Validación adicional después de trim
      if (!profesorData.name || !profesorData.email || !profesorData.phone || !profesorData.password) {
        throw new Error('Todos los campos son obligatorios y no pueden estar vacíos');
      }

      console.log('Datos originales del profesor:', JSON.stringify(nuevoProfesor, null, 2));
      console.log('Datos procesados para enviar:', JSON.stringify(profesorData, null, 2));

      const url = `${API_BASE_URL}/profesores`;
      const response = await fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(profesorData)
      });

      console.log('Respuesta exitosa del servidor:', response);
      
      await cargarProfesores();
      setError(null);
      
      return response;

    } catch (error) {
      console.error('Error completo al crear profesor:', {
        message: error.message,
        stack: error.stack,
        profesorData: nuevoProfesor
      });
      setError(`Error al crear el profesor: ${error.message}`);
      throw error;
    }
  };

  const handleProfesorEdited = async (profesorEditado) => {
    if (!profesorEditado) {
      setProfesorToEdit(null);
      return;
    }

    try {
      console.log('Editando profesor con datos:', JSON.stringify(profesorEditado, null, 2));
      
      const profesorData = {
        name: profesorEditado.nombre,
        email: profesorEditado.email,
        phone: profesorEditado.telefono,
        status: 'active',
        subjects: Array.isArray(profesorEditado.asignaturas) ? profesorEditado.asignaturas.filter(Boolean) : []
      };

      // Solo incluir password si se proporcionó una nueva
      if (profesorEditado.password && profesorEditado.password.trim() !== '') {
        profesorData.password = profesorEditado.password.trim();
      }
      
      console.log('Datos procesados para actualización:', JSON.stringify(profesorData, null, 2));
      
      await fetchWithAuth(`${API_BASE_URL}/profesores/${profesorEditado.id}`, {
        method: 'PUT',
        body: JSON.stringify(profesorData)
      });

      console.log('Profesor actualizado exitosamente');
      cargarProfesores(); // Recargar la lista de profesores
      setProfesorToEdit(null); // Limpiar el estado de edición
    } catch (error) {
      console.error('Error al editar profesor:', error);
      setError(error.message);
    }
  };

  const handleDeleteProfesor = async (id) => {
    const confirmMessage = `¿Está seguro de que desea eliminar este profesor?

ADVERTENCIA: Esta acción también eliminará:
- Todos los mensajes del profesor
- Sus asignaturas asignadas  
- Sus horarios programados

Esta acción NO se puede deshacer.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      console.log('Intentando eliminar profesor con ID:', id);
      
      await fetchWithAuth(`${API_BASE_URL}/profesores/${id}`, {
        method: 'DELETE'
      });

      console.log('Profesor eliminado exitosamente');
      cargarProfesores(); // Recargar la lista de profesores
      setError(null); // Limpiar errores previos
    } catch (error) {
      console.error('Error al eliminar profesor:', error);
      setError(`Error al eliminar el profesor: ${error.message}`);
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
                      onClick={() => {
                        const profesorData = {
                          id: profesor.idteacher,
                          nombre: profesor.name,
                          email: profesor.email,
                          telefono: profesor.phone,
                          password: '', // No mostrar la contraseña actual por seguridad
                          asignaturas: profesor.subjects || []
                        };
                        console.log('Intentando editar profesor:', profesorData);
                        console.log('Profesor original de la base de datos:', profesor);
                        setProfesorToEdit(profesorData);
                      }}
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