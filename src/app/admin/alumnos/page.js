'use client';
import { useRouter } from "next/navigation"
import React from 'react';
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

// import { useForm } from "react-hook-form"
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
// } from "@/components/ui/form"

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
  const router = useRouter()

  const handleNuevoAlumno = () => {
    router.push("alumnos/nuevo")
  }

  return (
    <div >
      <div className="flex justify-between mr-4 mt-4">
        <Input className="max-w-60" type="text" placeholder="Buscar alumno..." />
            <Button variant="default" onClick={handleNuevoAlumno}>Nuevo alumno</Button>
      </div>
      <div className="mt-10 flex justify-center">
        <Table className="text-center">
          <TableHeader className="bg-neutral-100">
            <TableRow >
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
            <TableRow>
              <TableCell className="flex justify-center"> 
                <Avatar>
                  <AvatarImage src="https://www.aurubis.com/.resources/aurubis-light-module/webresources/assets/img/image-avatar-avatar-fallback.svg" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>Manolito</TableCell>
              <TableCell>1º</TableCell>
              <TableCell>ESO</TableCell>
              <TableCell>4</TableCell>
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
                        Aquí iría la información de contacto como teléfono o email.
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
                      Aquí puedes ver información adicional como dirección, notas o historial académico.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AlumnosPage;

