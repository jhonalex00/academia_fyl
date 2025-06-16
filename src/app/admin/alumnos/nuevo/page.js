'use client'

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";



const NuevoAlumnoPage = () => {
const form = useForm()
// const [fechaNacimiento, setFechaNacimiento] = React.useState(null)
const [haRepetido, setHaRepetido] = React.useState(null);
const [conHermanos, setConHermanos] = React.useState(null);
const [consienteFotos, setConsienteFotos] = React.useState(null);


const onSubmit = (data) => {

}

return (
<div className="px-4 py-6 w-full max-w-6xl mx-auto overflow-y-auto">
    <h1 className="text-3xl font-bold mb-6">Nueva matrícula</h1>
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* DATOS PERSONALES */}
        <h2 className="text-lg font-bold mb-2">Datos personales</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
            <div className="mb-2">
                <FormField control={form.control} name="nombre"
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                            <Input className="w-[300px]" placeholder="Introduce el nombre del alumno" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <div className="mb-3">
                <FormField control={form.control} name="apellidos" 
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Apellidos</FormLabel>
                        <FormControl>
                            <Input className="w-[300px]" placeholder="Introduce los apellidos del alumno" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <div className="flex justify-start align-middle mb-2">
            <FormField control={form.control} name="fechaNacimiento"
            rules={{ required: "*Campo obligatorio" }}
            render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fecha de nacimiento</FormLabel>
                        <FormControl>
                        <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <div className="mb-3"></div>
            <div className="mb-3">
                <FormField control={form.control} name="telefonoAlumno" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Número de teléfono</FormLabel>
                        <FormControl>
                            <Input className="w-[300px]" placeholder="Ej: 612345678" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <div className="mb-3">
                <FormField control={form.control} name="emailAlumno" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input className="w-[300px]" placeholder="ejemplo@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
        </div>


        {/* DATOS ACADÉMICOS */}
        <h2 className="text-lg font-bold mb-2 mt-10">Datos académicos</h2>
        <div className="flex gap-2">
            <FormField control={form.control} name="curso"
            rules={{ required: "*Campo obligatorio" }}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Curso</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Ej: 1" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="ciclo"
            rules={{ required: "*Campo obligatorio" }}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Ciclo</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: ESO" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="centro"
            rules={{ required: "*Campo obligatorio" }}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>CEIP/IES/Universidad</FormLabel>
                    <FormControl>
                        <Input className="w-[300px]" placeholder="Introduce el nombre del centro" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
        </div>


        {/* RADIO MODALIDAD */}
        <FormField control={form.control} name="modalidad"
        rules={{ required: "*Campo obligatorio" }}
        render={({ field }) => (
            <FormItem >
            <FormLabel className="mt-4">Modalidad</FormLabel>
            <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
            <div className="flex gap-6">

                <FormItem className="flex items-center">
                    <FormControl>
                    <RadioGroupItem value="presencial" />
                    </FormControl>
                    <FormLabel className="font-normal">Presencial</FormLabel>
                </FormItem>

                <FormItem className="flex items-center">
                    <FormControl>
                    <RadioGroupItem value="online" />
                    </FormControl>
                    <FormLabel className="font-normal">Online</FormLabel>
                </FormItem>

                <FormItem className="flex items-center">
                    <FormControl>
                    <RadioGroupItem value="mixto" />
                    </FormControl>
                    <FormLabel className="font-normal">Mixto</FormLabel>
                </FormItem>
            </div>
            </RadioGroup>
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>


        {/* RADIO TIPO DE CLASES */}
        <FormField control={form.control} name="tipo"
        rules={{ required: "*Campo obligatorio" }}
        render={({ field }) => (
            <FormItem >
            <FormLabel className="mt-4">Tipo (respecto a las clases en la academia)</FormLabel>
            <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
            
            <div className="flex gap-6">
                <FormItem className="flex items-center">
                    <FormControl>
                    <RadioGroupItem value="grupo" />
                    </FormControl>
                    <FormLabel className="font-normal">Grupo</FormLabel>
                </FormItem>

                <FormItem className="flex items-center">
                    <FormControl>
                    <RadioGroupItem value="particular"/>
                    </FormControl>
                    <FormLabel className="font-normal">Particular</FormLabel>
                </FormItem>

                <FormItem className="flex items-center">
                    <FormControl>
                    <RadioGroupItem value="personalizado" />
                    </FormControl>
                    <FormLabel className="font-normal">Personalizado(2/3)</FormLabel>
                </FormItem>

                <FormItem className="flex items-center">
                    <FormControl>
                    <RadioGroupItem value="mixto" />
                    </FormControl>
                    <FormLabel className="font-normal">Mixto</FormLabel>
                </FormItem>
            </div>
            </RadioGroup>
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>

        {/* RADIO REPETIDOR */}
        <FormField control={form.control} name="repetidor"
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
            <FormItem>
            <FormLabel className="mt-4">¿Ha repetido curso?</FormLabel>
            <FormControl>
                <RadioGroup onValueChange={(value) => {field.onChange(value) 
                setHaRepetido(value)}} defaultValue={field.value} className="flex flex-col space-y-1">

                <div className="flex gap-6">
                    <FormItem className="flex items-center">
                    <FormControl>
                        <RadioGroupItem value="si" />
                    </FormControl>
                    <FormLabel className="font-normal">Sí</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center">
                    <FormControl>
                        <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                </div>
                </RadioGroup>
            </FormControl>

            {haRepetido === "si" && (
                <FormField
                control={form.control}
                name="cursoRepetido"
                render={({ field }) => (
                    <FormItem className="mt-4">
                    <FormLabel>¿Cuál?</FormLabel>
                    <FormControl>
                        <Input className="w-[300px]" placeholder="Por ejemplo: 2º de ESO" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}
            <FormMessage/>
            </FormItem>
        )}/>

        {/* ENFOQUE */}
        <FormField control={form.control} name="enfoque"
        rules={{ required: "*Campo obligatorio" }}
        render={({ field }) => (
            <FormItem >
            <FormLabel className="mt-4">¿Cómo prefieren que se enfoquen las clases de su hijo/a?</FormLabel>
            <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
            
            <div className="flex gap-6">
                <FormItem className="flex items-center">
                    <FormControl>
                    <RadioGroupItem value="duda" />
                    </FormControl>
                    <FormLabel className="font-normal">Resolver dudas</FormLabel>
                </FormItem>

                <FormItem className="flex items-center">
                    <FormControl>
                    <RadioGroupItem value="habito"/>
                    </FormControl>
                    <FormLabel className="font-normal">Hacer deberes y crear hábito de estudio</FormLabel>
                </FormItem>

                <FormItem className="flex items-center">
                    <FormControl>
                    <RadioGroupItem value="ambos"/>
                    </FormControl>
                    <FormLabel className="font-normal">Ambos</FormLabel>
                </FormItem>
            </div>
            </RadioGroup>
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>


        <h2 className="text-lg font-bold mb-2 mt-14">Datos de contacto</h2>

        {/* RADIO TUTORES */}
        <FormField control={form.control} name="tutoresSeparados"
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
            <FormItem >
            <FormLabel>¿Tutores separados?</FormLabel>
            <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
            <div className="flex gap-6">
                    <FormItem className="flex items-center">
                    <FormControl>
                        <RadioGroupItem value="si" />
                    </FormControl>
                    <FormLabel className="font-normal">Sí</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center">
                    <FormControl>
                        <RadioGroupItem value="no"/>
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                </div>
            </RadioGroup>
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>

        {/* RADIO COMUNICACIONES */}
        <FormField control={form.control} name="comunicaciones"
        rules={{ required: "*Campo obligatorio" }}
        render={({ field }) => (
            <FormItem >
            <FormLabel>Recepción de comunicaciones</FormLabel>
            <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
            <div className="flex gap-6">
                <FormItem className="flex items-center">
                <FormControl>
                    <RadioGroupItem value="tutor1" />
                </FormControl>
                <FormLabel className="font-normal">Solo tutor 1</FormLabel>
                </FormItem>

                <FormItem className="flex items-center">
                <FormControl>
                    <RadioGroupItem value="ambos"/>
                </FormControl>
                <FormLabel className="font-normal">Ambos tutores</FormLabel>
                </FormItem>
            </div>
            </RadioGroup>
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>


        {/* NOMBRE, TELEFONO, EMAIL DE LOS TUTORES */}
        <div className="grid grid-cols-2 grid-rows-4 w-[700px] gap-x-2 gap-y-4">

            {/* TUTOR 1 */}
            <div className="mt-4">
            <FormField control={form.control} name="tutor1"
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Nombre tutor 1</FormLabel>
                    <FormControl>
                        <Input className="w-[300px]" placeholder="Introduce el nombre del tutor 1" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            </div>

            <div></div>

            <div>
                <FormField control={form.control} name="telefono1"
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Teléfono 1</FormLabel>
                        <FormControl>
                            <Input className="w-[300px]" placeholder="Introduce el teléfono del tutor 1" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <div>
                <FormField control={form.control} name="email1"
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email 1</FormLabel>
                        <FormControl>
                            <Input className="w-[300px]" placeholder="Introduce el email del tutor 1" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            {/* TUTOR 2 */}
            <div className="mt-4">
                <FormField control={form.control} name="tutor2" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nombre tutor 2</FormLabel>
                        <FormControl>
                            <Input className="w-[300px]" placeholder="Introduce el nombre del tutor 2" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <div></div>

            <div>
                <FormField control={form.control} name="telefono2" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Teléfono 2</FormLabel>
                        <FormControl>
                            <Input className="w-[300px]" placeholder="Introduce el teléfono del tutor 2" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <div>
                <FormField control={form.control} name="email2" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email 2</FormLabel>
                        <FormControl>
                            <Input className="w-[300px]" placeholder="Introduce el email del tutor 2" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
        </div>
        

        {/* DATOS ADICIONALES */}
        <h2 className="text-lg font-bold mb-2 mt-10">Datos adicionales</h2>

        {/* TRASTORNOS DE APRENDIZAJE */}
        <FormField control={form.control} name="trastornos"
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
            <FormItem>
            <FormLabel className="mt-4">¿Tiene trastornos o dificultades relacionadas con el aprendizaje?</FormLabel>
            <FormControl>
                <Textarea {...field} className="w-[600px]" placeholder="Escribe aquí" rows={4} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>
        

        {/* ALERGIAS O PROBLEMAS DE MOVILIDAD */}
        <FormField control={form.control} name="alergias"
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
            <FormItem>
            <FormLabel className="mt-4">¿Tiene alergias o problemas de movilidad?</FormLabel>
            <FormControl>
                <Textarea {...field} className="w-[600px]" placeholder="Escribe aquí" rows={4} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>


        {/* BULLYING */}
        <FormField control={form.control} name="bullying" render={({ field }) => (
            <FormItem>
            <FormLabel className="mt-4">¿Su hijo/a sufre o ha sufrido aislamiento, bullying o  algún tipo de trato que le influya negativamente en el estudio/aprendizaje? *Opcional</FormLabel>
            <FormControl>
                <Textarea {...field} className="w-[600px]" placeholder="Escribe aquí" rows={4} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>

        {/* OBSERVACIONES */}
        <FormField control={form.control} name="observaciones" render={({ field }) => (
            <FormItem>
            <FormLabel className="mt-4">Observaciones</FormLabel>
            <FormControl>
                <Textarea {...field} className="w-[600px]" placeholder="Escribe aquí" rows={4} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>


        {/* RADIO VIENE CON HERMANOS */}
        <FormField control={form.control} name="hermanos"
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
            <FormItem>
            <FormLabel className="mt-4">¿Viene con hermanos?</FormLabel>
            <FormControl>
                <RadioGroup onValueChange={(value) => {field.onChange(value) 
                setConHermanos(value)}} defaultValue={field.value} className="flex flex-col space-y-1">

                <div className="flex gap-6">
                    <FormItem className="flex items-center">
                    <FormControl>
                        <RadioGroupItem value="si" />
                    </FormControl>
                    <FormLabel className="font-normal">Sí</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center">
                    <FormControl>
                        <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                </div>
                </RadioGroup>
            </FormControl>

            {conHermanos === "si" && (
                <FormField
                control={form.control}
                name="quien"
                render={({ field }) => (
                    <FormItem className="mt-4">
                    <FormLabel>¿Quién?</FormLabel>
                    <FormControl>
                        <Input className="w-[300px]" placeholder="Introduce el nombre del hermano" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}
            <FormMessage />
            </FormItem>
        )}/>

        {/* RADIO VA SOLO A CLASE */}
        <FormField control={form.control} name="viajaSolo"
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
            <FormItem >
            <FormLabel className="mt-4">¿Consienten que vaya y venga solo a clase?</FormLabel>
            <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
            <div className="flex gap-6">
                    <FormItem className="flex items-center">
                    <FormControl>
                        <RadioGroupItem value="si" />
                    </FormControl>
                    <FormLabel className="font-normal">Sí</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center">
                    <FormControl>
                        <RadioGroupItem value="no"/>
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                </div>
            </RadioGroup>
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>

        {/* RADIO REQUISAR MOVIL */}
        <FormField control={form.control} name="requisar"
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
            <FormItem >
            <FormLabel className="mt-4">¿Autorizan que, de forma excepcional, le requisemos el móvil/tablet durante el horario de clase?</FormLabel>
            <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
            <div className="flex gap-6">
                    <FormItem className="flex items-center">
                    <FormControl>
                        <RadioGroupItem value="si" />
                    </FormControl>
                    <FormLabel className="font-normal">Sí</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center">
                    <FormControl>
                        <RadioGroupItem value="no"/>
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                </div>
            </RadioGroup>
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>



        {/* RADIO CONSENTIMIENTO DE FOTOS */}
        <FormField control={form.control} name="fotos"
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
            <FormItem>
            <FormLabel className="mt-4">En caso de realizar fotografías con fines educativos/publicitarios, ¿consiente que su hijo/a aparezca en ellas?</FormLabel>
            <FormControl>
                <RadioGroup onValueChange={(value) => {field.onChange(value) 
                setConsienteFotos(value)}} defaultValue={field.value} className="flex flex-col space-y-1">

                <div className="flex gap-6">
                    <FormItem className="flex items-center">
                    <FormControl>
                        <RadioGroupItem value="si" />
                    </FormControl>
                    <FormLabel className="font-normal">Sí</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center">
                    <FormControl>
                        <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                </div>
                </RadioGroup>
            </FormControl>

            {consienteFotos === "si" && (
                <FormField control={form.control} name="rrss"
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
                    <FormItem >
                    <FormLabel className="mt-4">¿Consiente que dichas fotos fueran subidas a Redes sociales?</FormLabel>
                    <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                    <div className="flex gap-6">
                            <FormItem className="flex items-center">
                            <FormControl>
                                <RadioGroupItem value="si" />
                            </FormControl>
                            <FormLabel className="font-normal">Sí</FormLabel>
                            </FormItem>
        
                            <FormItem className="flex items-center">
                            <FormControl>
                                <RadioGroupItem value="no"/>
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                        </div>
                    </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}/>
            )}
            <FormMessage />
            </FormItem>
        )}/>


        {/* CÓMO NOS HAS CONOCIDO */}
        <FormField control={form.control} name="knowUs"
                rules={{ required: "*Campo obligatorio" }}
                render={({ field }) => (
            <FormItem >
                <FormLabel className="mt-6">¿Cómo nos has conocido?</FormLabel>
                <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                            
                            <FormItem className="flex items-center">
                                <FormControl>
                                    <RadioGroupItem value="rrss" />
                                </FormControl>
                                <FormLabel className="font-normal">RRSS</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center">
                                <FormControl>
                                    <RadioGroupItem value="web"/>
                                </FormControl>
                                <FormLabel className="font-normal">Web</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center">
                                <FormControl>
                                    <RadioGroupItem value="maps"/>
                                </FormControl>
                                <FormLabel className="font-normal">Google Maps</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center">
                                <FormControl>
                                    <RadioGroupItem value="anuncio"/>
                                </FormControl>
                                <FormLabel className="font-normal">Anuncio</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center">
                                <FormControl>
                                    <RadioGroupItem value="recomendacion"/>
                                </FormControl>
                                <FormLabel className="font-normal">Recomendación</FormLabel>
                            </FormItem>
                            
                            <FormItem className="flex items-center">
                                <FormControl>
                                    <RadioGroupItem value="porDelante"/>
                                </FormControl>
                                <FormLabel className="font-normal">Pasé por delante de la academia</FormLabel>
                            </FormItem>
                    </RadioGroup>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}/>

        <FormField control={form.control} name="terminos"
        rules={{ required: "*Debes aceptar los términos y condiciones" }}
        render={({ field }) => (
        <FormItem className="flex items-start space-x-2 mt-16 mb-10 max-w-[1200px]">
        <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
        </FormControl>
        <div className="text-sm leading-snug">
            <FormLabel className="inline">
            Al marcar esta casilla acepta haber leído y comprendido los{" "}
            <Dialog>
                <DialogTrigger asChild>
                <span className="underline text-blue-600 hover:text-blue-800 cursor-pointer">
                    términos y condiciones generales
                </span>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>CONDICIONES DE CONTRATO</DialogTitle>
                </DialogHeader>
                <div className="text-sm max-h-[400px] overflow-y-auto">
                    <div className="mb-3">
                        1. Academia F&L es un centro de formación no reglada que no expide títulos oficiales.
                    </div>
                    <div className="mb-3">
                        2. La responsabilidad de Academia F&L recae sobre Academia F&L S.L. Con CIF B21693593, con licencia municipal de academiacon expediente 10754/2011/CT concedida por el Ayuntamiento de Granada y con sede fiscal Avenida de Dílar 45, Bj. 18007, Granada, España.
                    </div>
                    <div className="mb-3">
                        3. El/la alumno/a se compromete a asistir de manera presencial, on-line o mixta según se haya acordado en el apartado de modalidad de la página anterior del presente contrato.
                    </div>
                    <div className="mb-3">
                        4. El/la alumno/a contrata clases particulares, en grupo reducido, mixto o curso intensivo, según se haya acordado en la página anterior del presente contrato.
                    </div>
                    <div className="mb-3">
                        5. El/la nuevo/a alumno/a deberá abonar la mensualidad ordinaria más una fianza equivalente a una mensualidad, que se devolverá al final del curso, para que se le pueda asignar un horario y pueda iniciar las clases. Quedan excluidos de esta cláusula los alumnos pertenecientes a Primaria, Secundaria, Bachillerato o selectividad.
                    </div>
                    <div className="mb-3">
                        6. Todos/as los/las nuevos/as alumnos/as de Primaria, Secundaria, Bachillerato o Selectividad deberán abonar la primera mensualidad el mismo día de la matriculación o, en su defecto, el día del comienzo de las clases.
                    </div>
                    <div className="mb-3">
                        7. El número de alumnos presenciales por aula en Academia F&L será de un máximo de 6-7. Excepto en intensivos.
                    </div>
                    <div className="mb-3">
                        8. Academia F&L prestará los servicios de apoyo y refuerzo escolar, seguimiento, explicaciones de temario, realización de ejercicios y tareas diarias, resolución de dudas y control académico del alumno/alumna que figura en dicho contrato.
                    </div>
                    <div className="mb-3">
                        9. La mensualidad corresponde a__________ €/mes.
                    </div>
                    <div className="mb-3">
                        10. El pago se realizará en efectivo o transferencia bancaria al número de cuenta de CaixaBank ES89 2100 6241 8602 0027 8614 a nombre de Academia FYL S.L. indicando claramente como concepto, el nombre y apellido del alumno y el mes correspondiente.
                    </div>
                    <div className="mb-3">
                        11. El pago se realizará del 1 al 5 de cada mes. El retraso en el pago supondrá la pérdida de la plaza y del horario acordado. Así mismo todo el dinero pagado hasta la fecha no será devuelto si es el alumno/a el que quiere dejar las clases.
                    </div>
                    <div className="mb-3">
                        12. A la primera clase se podrá asistir sin compromiso abonando el precio correspondiente, pudiéndose abonar la mensualidad en la siguiente clase si decide continuar adelante con el curso, descontándose lo pagado por esa clase.
                    </div>
                    <div className="mb-3">
                        13. Para que la baja sea efectiva, el alumno o la alumna debe notificarlo con al menos 10 días hábiles de antelación antes del final del mes en que se solicita la baja. De no hacerlo, la baja no se procesará hasta el mes siguiente.
                    </div>
                    <div className="mb-3">
                        14. Academia F&L se reserva el derecho de admisión de sus alumnos/as. Todos/as aquellos/as que cometieran faltas graves de comportamiento o llevasen a cabo actos violentos o irrespetuosos con profesores o compañeros podrán ser amonestados y expulsados de la academia
                    </div>
                    <div className="mb-3">
                        15. Todos/as aquellos/as alumnos/as que hayan dejado de asistir a clase sin previo aviso y acumulen más de un mes de impagos serán eliminados del listado de alumnos sin posibilidad de reincorporarse en cualquier otro momento del curso. Es por ello que se requiere aviso previo en caso de que los alumnos vayan a interrumpir su asistencia de manera temporal.
                    </div>
                    <div className="mb-3">
                        16. Los/as alumnos/as que no pudieran asistir a una clase, por motivo justificado*, tendrán la oportunidad de asistir a otra clase de las
                        mismas características siempre y cuando se avise con hasta 5 horas antes del inicio de la clase, no suponga un exceso en el
                        número de alumnos ya matriculados en dicha clase y siempre bajo disponibilidad.
                    </div>
                    <div className="mb-3">
                        17. Siempre y cuando se avise con antelación, se ofrecerá alternativa de clase online a alumnos/as que no puedan asistir.
                    </div>
                    <div className="mb-3">
                        18. En caso de que el/la alumno/a no pueda o no quiera asistir a las clases de recuperación propuestas, esa clase se perdería y no
                        existiría el derecho de devolución del importe proporcional.
                    </div>
                    <div className="mb-3">
                        19. No se recuperarán clases grupales por motivos de: festivos, faltas injustificadas, faltas justificadas sin aviso previo de un máximo
                        de 5 horas antes de la clase, fenómenos naturales con recomendación de cese de actividad por las autoridades locales como
                        terremotos, incendios, apagones, danas, tormentas, volcanes, confinamientos, lutos o oficiales o similares que no dependan de la
                        academia.
                    </div>
                    <div className="mb-3">
                        20. No se recuperarán clases grupales por motivos de: festivos, faltas injustificadas, faltas justificadas sin aviso previo de un máximo
                        de 5 horas antes de la clase, fenómenos naturales con recomendación de cese de actividad por las autoridades locales como
                        terremotos, incendios, apagones, danas, tormentas, volcanes, confinamientos, lutos o oficiales o similares que no dependan de la
                        academia.
                    </div>
                    <div className="mb-3">
                        21. En caso de que una clase deba ser anulada por parte del profesor, se propondrá una fecha y hora alternativa a la que puedan
                        asistir todos los alumnos, se recuperarán en horarios de iguales características, o, si esto no fuera posible, se descontará de la
                        mensualidad posterior o en su caso se devolvería el importe pagado.
                    </div>
                    <div className="mb-3">
                        22. Academia F&L no se hace responsable de aprobados o suspensos en los centros oficiales de sus alumnos/as. Son los/as
                        alumnos/as los que se responsabilizan de esforzarse por mejorar su rendimiento académico, siempre con la ayuda de Academia
                        F&L.
                    </div>
                    <div className="mb-3">
                        23. El/La alumno/a es responsable de traer todo el material necesario para desarrollar con normalidad las clases, pudiendo Academia
                        F&L proporcionarle material adicional si así se estimara oportuno.
                    </div>
                    <div className="mb-3">
                        24. Academia F&L no realiza labores de copia, fotocopia o impresión del material de sus alumnos/as, siendo estos los que deben asistir
                        a clase con el material ya impreso previamente.
                    </div>
                    <div className="mb-3">
                        25. Los/las alumnos/as que por cualquier motivo decidiesen asistir a una clase de manera on-line deberán avisar con, al menos, una
                        hora de antelación al profesor correspondiente para que este instale los medios necesarios para llevar a cabo la docencia on-line.
                    </div>
                    <div className="mb-3">
                        26. Las clases on-line no serán grabadas ni por el profesor ni por el/la alumno/a, salvo comunicación expresa y siempre en conformidad
                        con la política de protección de datos.
                    </div>
                    <div className="mb-3">
                        *Se entienden como motivos justificados: enfermedad debidamente justificada, viaje de estudios o familiar, causa de fuerza mayor
                        justificada, participación en evento deportivo, musical o cultural de importante categoría. Como motivos no jutificados se entienden:
                        malestar, retrasos, comidas o eventos familiares o de amigos, cansancio, estudiar para un examen o falta de transporte.
                    </div>
                    <div>
                        Reclamaciones:
                        <div>
                        1 - El centro tiene a disposición de los alumnos Hojas de Reclamaciones conforme al modelo oficial.
                        </div>
                        2 - Para cualquier controversia que se derive de la interpretación o cumplimiento del presente contrato,
                        el empresario expresamente se somete al sistema arbitral de consumo, a través de la Junta Arbitral de Consumo
                        que corresponda al Centro que imparte la enseñanza. De conformidad con lo establecido en el Art. 5 de la Ley Orgánica
                        15/1999 de diciembre de Protección de Datos de Carácter Personal, por el que se regula el derecho de información en la recogida de datos le
                        informamos de los siguientes extremos: Los datos de carácter personal que nos ha suministrado en esta y otras comunicaciones mantenidas con usted
                        serán objeto de tratamiento en los ficheros responsabilidad de Academia F&L S.L.. La finalidad del tratamiento es la de gestionar de forma adecuada la
                        prestación del servicio que nos ha requerido. Así mismo estos datos no serán cedidos a terceros, salvo las cesiones legalmente permitidas. Los datos
                        solicitados a través de esta y otras comunicaciones son de suministro obligatorio para la prestación del servicio. Estos son adecuados, pertinentes y no
                        excesivos. Su negativa a suministrar los datos solicitados implica la imposibilidad prestarle el servicio. Asimismo, le informamos de la posibilidad de
                        ejercitar los correspondientes derechos de acceso, rectificación, cancelación y oposición de conformidad con lo establecido en la Ley 15/1999 ante
                        Academia F&L S.L. como responsables del fichero. Los derechos mencionados los puede ejercitar a través de los siguientes medios:
                        fylapoyo@gmail.com, Academia F&L, Avd Dilar 45, Bj. 18007, Granada. 858999353.
                    </div>
                </div>
                </DialogContent>
            </Dialog>{" "}
            al igual que la política de RGPD. Se compromete que los datos introducidos son veraces y que acepta este documento como vinculante.
            </FormLabel>
            <FormMessage />
        </div>
        </FormItem>
    )}
    />


            <Button variant="secondary" type="submit">Guardar alumno</Button>
        </form>
    </Form>
</div>
)}

export default NuevoAlumnoPage
