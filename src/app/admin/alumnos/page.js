'use client';
import { useRouter } from "next/navigation";
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
  const [search, setSearch] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoEditando, setAlumnoEditando] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("matriculas")) || [];
    setAlumnos(data);
  }, []);

  const alumnosFiltrados = alumnos.filter((alumno) =>
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

  const handleGuardarCambios = () => {
    const nuevosAlumnos = [...alumnos];
    nuevosAlumnos[alumnoEditando.index] = { ...alumnoEditando };
    setAlumnos(nuevosAlumnos);
    localStorage.setItem("matriculas", JSON.stringify(nuevosAlumnos));
    setModalAbierto(false);
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
              <TableRow key={index}>
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
                    className="text-blue-500 hover:text-blue-700 font-bold"
                  >
                    📝
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleEliminarAlumno(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    🗑️
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal para editar alumno */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Alumno</DialogTitle>
            <DialogDescription>
              <Input
                value={alumnoEditando?.nombre || ""}
                onChange={(e) => setAlumnoEditando({ ...alumnoEditando, nombre: e.target.value })}
                placeholder="Nombre"
                className="mb-2"
              />
              <Input
                value={alumnoEditando?.curso || ""}
                onChange={(e) => setAlumnoEditando({ ...alumnoEditando, curso: e.target.value })}
                placeholder="Curso"
                className="mb-2"
              />
              <Input
                value={alumnoEditando?.ciclo || ""}
                onChange={(e) => setAlumnoEditando({ ...alumnoEditando, ciclo: e.target.value })}
                placeholder="Ciclo"
                className="mb-2"
              />
              <Input
                value={alumnoEditando?.telefonoAlumno || ""}
                onChange={(e) => setAlumnoEditando({ ...alumnoEditando, telefonoAlumno: e.target.value })}
                placeholder="Teléfono"
                className="mb-2"
              />
              <Input
                value={alumnoEditando?.emailAlumno || ""}
                onChange={(e) => setAlumnoEditando({ ...alumnoEditando, emailAlumno: e.target.value })}
                placeholder="Email"
              />
              <div className="mt-4 text-right">
                <Button onClick={handleGuardarCambios}>Guardar</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlumnosPage;
