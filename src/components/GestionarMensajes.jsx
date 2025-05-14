'use client';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mensajeVacio = () => ({
  id: null,
  idcontact: '',
  idteacher: '',
  message: '',
  date: ''
});

export function GestionarMensajes({ onMensajeAdded, mensajeToEdit, onMensajeEdited, contactos, profesores }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(mensajeVacio());

  useEffect(() => {
    if (mensajeToEdit) {
      // Cargar datos del mensaje a editar
      setFormData({
        id: mensajeToEdit.id ?? mensajeToEdit.idmessage, // asegura que el ID esté
        idcontact: mensajeToEdit.idcontact,
        idteacher: mensajeToEdit.idteacher,
        message: mensajeToEdit.message,
        date: mensajeToEdit.date,
      });
      setIsOpen(true);
    }
  }, [mensajeToEdit]);

  const handleOpen = () => {
    onMensajeEdited(null);
    setFormData(mensajeVacio());
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.idcontact || !formData.idteacher || !formData.message.trim() || !formData.date) {
      alert('Por favor completa todos los campos antes de guardar.');
      return;
    }

    // Si hay un id, es edición
    if (formData.id) {
      onMensajeEdited(formData); // Actualiza
    } else {
      onMensajeAdded(formData); // Crea nuevo
    }

    // Limpia y cierra modal
    setIsOpen(false);
    setFormData(mensajeVacio());
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData(mensajeVacio());
    onMensajeEdited(null);
  };

  return (
    <>
        {/* Esto desactiva temporalmente ese fragmento del DOM
      <div className="flex justify-end mr-4 mt-2">
        <Button onClick={handleOpen}>
          Nuevo Mensaje
        </Button>
      </div>
      */}


      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Editar mensaje' : 'Nuevo mensaje'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            {/* Select de alumno */}
            <div>
              <label className="text-sm font-medium">Alumno (remitente)</label>
              <select
                className="p-2 border rounded w-full"
                name="idcontact"
                value={formData.idcontact}
                onChange={(e) => setFormData({ ...formData, idcontact: e.target.value })}
                required
              >
                <option value="">Selecciona alumno</option>
                {Array.isArray(contactos) && contactos.map((contacto) => (
                  <option key={contacto.idcontact} value={contacto.idcontact}>
                    {contacto.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Select de profesor */}
            <div>
              <label className="text-sm font-medium">Profesor</label>
              <select
                className="p-2 border rounded w-full"
                name="idteacher"
                value={formData.idteacher}
                onChange={(e) => setFormData({ ...formData, idteacher: e.target.value })}
                required
              >
                <option value="">Selecciona profesor</option>
                {Array.isArray(profesores) && profesores.map((profesor) => (
                  <option key={profesor.idteacher} value={profesor.idteacher}>
                    {profesor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo mensaje */}
            <div>
              <label className="text-sm font-medium">Mensaje</label>
              <Input
                name="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            {/* Campo fecha */}
            <div>
              <label className="text-sm font-medium">Fecha</label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} type="button">
                Cancelar
              </Button>
              <Button type="submit">
                {formData.id ? 'Actualizar' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
