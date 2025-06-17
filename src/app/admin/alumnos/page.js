'use client';
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from 'react';
import { FaInfoCircle } from "react-icons/fa";
import { MdContactPhone, MdDelete, MdEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const AlumnosPage = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoEditando, setAlumnoEditando] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("matriculas")) || [];
    setAlumnos(data);
  }, []);

  const alumnosFiltrados = alumnos.filter(alumno =>
    (alumno.nombre || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleNuevoAlumno = () => {
    router.push("alumnos/nuevo");
  };

  const handleEliminarAlumno = (index) => {
    const nuevosAlumnos = [...alumnos];
    nuevosAlumnos.splice(index, 1);
    setAlumnos(nuevosAlumnos);
    localStorage.setItem("matriculas", JSON.stringify(nuevosAlumnos));
  };

  const handleEditarAlumno = (alumno, index) => {
    setAlumnoEditando({ ...alumno, index });
    setModalAbierto(true);
  };

  return (
    <div>
      <div className="flex justify-between mr-4 mt-4">
        <Input
          className="max-w-60"
          type="text"
          placeholder="Buscar alumno..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="default" onClick={handleNuevoAlumno}>
          Nuevo alumno
        </Button>
      </div>

      <div className="mt-10 flex justify-center">
        <Table className="text-center">
          <TableHeader className="bg-neutral-100">
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Ciclo</TableHead>
              <TableHead>Horas</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Detalles</TableHead>
              <TableHead>Editar</TableHead>
              <TableHead>Eliminar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alumnosFiltrados.map((alumno, index) => (
              <TableRow key={alumno.id || index}>
                <TableCell className="flex justify-center">
                  <Avatar>
                    <AvatarImage
                      src="https://www.aurubis.com/.resources/aurubis-light-module/webresources/assets/img/image-avatar-avatar-fallback.svg"
                      alt={alumno.nombre}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{alumno.nombre}</TableCell>
                <TableCell>{alumno.curso}</TableCell>
                <TableCell>{alumno.ciclo}</TableCell>
                <TableCell>—</TableCell>

                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="cursor-pointer">
                        <MdContactPhone size={20} />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contacto del alumno</DialogTitle>
                        <DialogDescription>
                          <p><strong>Teléfono:</strong> {alumno.telefonoAlumno}</p>
                          <p><strong>Email:</strong> {alumno.emailAlumno}</p>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </TableCell>

                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="cursor-pointer">
                        <FaInfoCircle size={20} />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Detalles del alumno</DialogTitle>
                        <DialogDescription>
                          <p><strong>Fecha de nacimiento:</strong> {alumno.fechaNacimiento}</p>
                          <p><strong>Dirección:</strong> {alumno.direccion}</p>
                          <p><strong>¿Ha repetido?:</strong> {alumno.haRepetido ? "Sí" : "No"}</p>
                          <p><strong>¿Tiene hermanos?:</strong> {alumno.conHermanos ? "Sí" : "No"}</p>
                          <p><strong>Consentimiento fotos:</strong> {alumno.consienteFotos ? "Sí" : "No"}</p>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </TableCell>

                <TableCell>
                  <button
                    onClick={() => handleEditarAlumno(alumno, index)}
                    title="Editar alumno"
                    className="text-blue-500 hover:text-blue-700 hover:scale-110 transition-transform duration-200 cursor-pointer"
                  >
                    <MdEdit size={20} />
                  </button>
                </TableCell>

                <TableCell>
                  <button
                    onClick={() => handleEliminarAlumno(index)}
                    title="Eliminar alumno"
                    className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform duration-200 cursor-pointer"
                  >
                    <MdDelete size={20} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de edición temporal */}
      {modalAbierto && alumnoEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">Editar alumno (demo)</h2>
            <p><strong>Nombre:</strong> {alumnoEditando.nombre}</p>
            <p><strong>Curso:</strong> {alumnoEditando.curso}</p>
            <p><strong>Ciclo:</strong> {alumnoEditando.ciclo}</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setModalAbierto(false)}>Cancelar</Button>
              <Button onClick={() => alert("Función de edición pendiente")}>Guardar cambios</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumnosPage;
