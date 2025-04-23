'use client';

import React from 'react';
import { useForm } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const NuevoAlumnoPage = () => {
    const form = useForm()

    const onSubmit = (data) => {
    console.log("Datos del alumno:", data)
    }

    return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Matrícula nuevo alumno</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduce el nombre del alumno" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <Button type="submit">Guardar alumno</Button>
            </form>
        </Form>
    </div>
    )
}


export default NuevoAlumnoPage
