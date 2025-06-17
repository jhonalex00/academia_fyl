'use client';
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from 'react';
import { FaInfoCircle } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";
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

  // Estado para el buscador
  const [search, setSearch] = useState("");

  // Datos de ejemplo (pueden venir de props, API, etc.)
    const [alumnos, setAlumnos] = useState([]);// esto es agregado por jhon

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("matriculas")) || [];
    setAlumnos(data);
  }, []);


  // Filtrado por nombre
  const alumnosFiltrados = alumnos.filter(alumno =>
    (alumno.nombre || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleNuevoAlumno = () => {
    router.push("alumnos/nuevo");
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {alumnosFiltrados.map((alumno) => (
              <TableRow key={alumno.id}>
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
              <TableCell>—</TableCell> {/* Aquí puedes poner otra cosa si quieres horas */}

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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AlumnosPage;
