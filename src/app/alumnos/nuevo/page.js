'use client'

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { DatePickerDemo } from "@/components/ui/datePickerDemo";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea";



const NuevoAlumnoPage = () => {
const form = useForm()
// const [fechaNacimiento, setFechaNacimiento] = React.useState(null)
const [haRepetido, setHaRepetido] = React.useState(null);
const [conHermanos, setConHermanos] = React.useState(null);
const [consienteFotos, setConsienteFotos] = React.useState(null);


const onSubmit = (data) => {

}

return (
<div className="p-x-2">
    <h1 className="text-3xl font-bold mb-6">Nueva matrícula</h1>
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* DATOS PERSONALES */}
        <h2 className="text-lg font-bold mb-2">Datos personales</h2>
        <div className="grid grid-cols-2 grid-rows-3 gap-2">
            <div className="mb-2">
                <FormField control={form.control} name="nombre" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduce el nombre del alumno" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <div>
                <FormField control={form.control} name="apellidos" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Apellidos</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduce los apellidos del alumno" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <div className="flex justify-start align-middle mb-2">
            <FormField control={form.control} name="fechaNacimiento" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fecha de nacimiento</FormLabel>
                        <FormControl>
                        <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <div></div>
            <div>
                <FormField control={form.control} name="telefonoAlumno" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Numero de teléfono</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: 612345678" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <div>
                <FormField control={form.control} name="emailAlumno" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="ejemplo@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
        </div>


        {/* DATOS ACADÉMICOS */}
        <h2 className="text-lg font-bold mb-2 mt-10">Datos académicos</h2>
        <div className="flex gap-2">
            <FormField control={form.control} name="curso" render={({ field }) => (
                <FormItem>
                    <FormLabel>Curso</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Ej: 1" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="ciclo" render={({ field }) => (
                <FormItem>
                    <FormLabel>Ciclo</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: ESO" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="centro" render={({ field }) => (
                <FormItem>
                    <FormLabel>CEIP/IES/Universidad</FormLabel>
                    <FormControl>
                        <Input placeholder="Introduce el nombre del centro" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
        </div>


        {/* RADIO MODALIDAD */}
        <FormField control={form.control} name="modalidad" render={({ field }) => (
            <FormItem >
            <FormLabel>Modalidad</FormLabel>
            <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
            <div className="flex gap-6">

                <FormItem className="flex items-center">
                    <FormControl>
                    <RadioGroupItem value="presencial" />
                    </FormControl>
                    <FormLabel className="font-normal">Presencial</FormLabel>
                </FormItem>

                <FormItem className="flex items-center space-x-0">
                    <FormControl>
                    <RadioGroupItem value="online" />
                    </FormControl>
                    <FormLabel className="font-normal">Online</FormLabel>
                </FormItem>

                <FormItem className="flex items-center space-x-0">
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
        <FormField control={form.control} name="tipo" render={({ field }) => (
            <FormItem >
            <FormLabel>Tipo (respecto a las clases en la academia)</FormLabel>
            <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
            
            <div className="flex gap-6">
                <FormItem className="flex items-center">
                    <FormControl>
                    <RadioGroupItem value="grupo" />
                    </FormControl>
                    <FormLabel className="font-normal">Grupo</FormLabel>
                </FormItem>

                <FormItem className="flex items-center space-x-0">
                    <FormControl>
                    <RadioGroupItem value="particular"/>
                    </FormControl>
                    <FormLabel className="font-normal">Particular</FormLabel>
                </FormItem>

                <FormItem className="flex items-center space-x-0">
                    <FormControl>
                    <RadioGroupItem value="personalizado" />
                    </FormControl>
                    <FormLabel className="font-normal">Personalizado(2/3)</FormLabel>
                </FormItem>

                <FormItem className="flex items-center space-x-0">
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
        <FormField control={form.control} name="repetidor" render={({ field }) => (
            <FormItem>
            <FormLabel>¿Ha repetido curso?</FormLabel>
            <FormControl>
                <RadioGroup onValueChange={(value) => {field.onChange(value) 
                setHaRepetido(value)}} defaultValue={field.value} className="flex flex-col space-y-1">

                <div className="flex gap-6">
                    <FormItem className="flex items-center space-x-2">
                    <FormControl>
                        <RadioGroupItem value="si" />
                    </FormControl>
                    <FormLabel className="font-normal">Sí</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-2">
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
                        <Input placeholder="Por ejemplo: 2º de ESO" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}
            <FormMessage />
            </FormItem>
        )}/>

        {/* ENFOQUE */}
        <FormField control={form.control} name="enfoque" render={({ field }) => (
            <FormItem >
            <FormLabel>¿Cómo prefieren que se enfoquen las clases de su hijo/a?</FormLabel>
            <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
            
            <div className="flex gap-6">
                <FormItem className="flex items-center">
                    <FormControl>
                    <RadioGroupItem value="duda" />
                    </FormControl>
                    <FormLabel className="font-normal">Resolver dudas</FormLabel>
                </FormItem>

                <FormItem className="flex items-center space-x-0">
                    <FormControl>
                    <RadioGroupItem value="habito"/>
                    </FormControl>
                    <FormLabel className="font-normal">Hacer deberes y crear hábito de estudio</FormLabel>
                </FormItem>

                <FormItem className="flex items-center space-x-0">
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


        <h2 className="text-lg font-bold mb-2 mt-10">Datos de contacto</h2>

        {/* RADIO TUTORES */}
        <FormField control={form.control} name="tutoresSeparados" render={({ field }) => (
            <FormItem >
            <FormLabel>¿Tutores separados?</FormLabel>
            <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
            <div className="flex gap-6">
                    <FormItem className="flex items-center space-x-2">
                    <FormControl>
                        <RadioGroupItem value="si" />
                    </FormControl>
                    <FormLabel className="font-normal">Sí</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-2">
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
        <FormField control={form.control} name="comunicaciones" render={({ field }) => (
            <FormItem >
            <FormLabel>Recepción de comunicaciones</FormLabel>
            <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
            <div className="flex gap-6">
                <FormItem className="flex items-center space-x-2">
                <FormControl>
                    <RadioGroupItem value="tutor1" />
                </FormControl>
                <FormLabel className="font-normal">Solo tutor 1</FormLabel>
                </FormItem>

                <FormItem className="flex items-center space-x-2">
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
        <div className="grid grid-cols-2 grid-rows-4 gap-4">

            {/* TUTOR 1 */}
            <div className="mb-2">
            <FormField control={form.control} name="tutor1" render={({ field }) => (
                <FormItem>
                    <FormLabel>Nombre tutor 1</FormLabel>
                    <FormControl>
                        <Input placeholder="Introduce el nombre del tutor" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            </div>

            <div className="mb-2"></div>

            <div className="mb-2">
                <FormField control={form.control} name="telefono1" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Telefono 1</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduce el teléfono del tutor 1" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <div className="mb-2">
                <FormField control={form.control} name="email1" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email 1</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduce el email del tutor 1" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            {/* TUTOR 2 */}
            <div className="mb-2">
                <FormField control={form.control} name="tutor2" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nombre tutor 2</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduce el nombre del tutor" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <div className="mb-2"></div>

            <div className="mb-2">
                <FormField control={form.control} name="telefono2" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Telefono 2</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduce el teléfono del tutor 2" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <div className="mb-2">
                <FormField control={form.control} name="email2" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email 2</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduce el email del tutor 2" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
        </div>
        

        {/* DATOS ADICIONALES */}
        <h2 className="text-lg font-bold mb-2 mt-10">Datos de adicionales</h2>

        {/* TRASTORNOS DE APRENDIZAJE */}
        <FormField control={form.control} name="trastornos" render={({ field }) => (
            <FormItem>
            <FormLabel>¿Tiene trastornos o dificultades relacionadas con el aprendizaje?</FormLabel>
            <FormControl>
                <Textarea {...field} placeholder="Escribe aquí" rows={4} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>
        

        {/* ALERGIAS O PROBLEMAS DE MOVILIDAD */}
        <FormField control={form.control} name="alergias" render={({ field }) => (
            <FormItem>
            <FormLabel>¿Tiene alergias o problemas de movilidad?</FormLabel>
            <FormControl>
                <Textarea {...field} placeholder="Escribe aquí" rows={4} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>


        {/* BULLYING */}
        <FormField control={form.control} name="bullying" render={({ field }) => (
            <FormItem>
            <FormLabel>¿Su hijo/a sufre o ha sufrido aislamiento, bullying o  algún tipo de trato que le influya egativamente en el estudio/aprendizaje? *Opcional</FormLabel>
            <FormControl>
                <Textarea {...field} placeholder="Escribe aquí" rows={4} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>

        {/* OBSERVACIONES */}
        <FormField control={form.control} name="observaciones" render={({ field }) => (
            <FormItem>
            <FormLabel>Observaciones</FormLabel>
            <FormControl>
                <Textarea {...field} placeholder="Escribe aquí" rows={4} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}/>


        {/* RADIO VIENE CON HERMANOS */}
        <FormField control={form.control} name="hermanos" render={({ field }) => (
            <FormItem>
            <FormLabel>¿Viene con hermanos?</FormLabel>
            <FormControl>
                <RadioGroup onValueChange={(value) => {field.onChange(value) 
                setConHermanos(value)}} defaultValue={field.value} className="flex flex-col space-y-1">

                <div className="flex gap-6">
                    <FormItem className="flex items-center space-x-2">
                    <FormControl>
                        <RadioGroupItem value="si" />
                    </FormControl>
                    <FormLabel className="font-normal">Sí</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-2">
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
                        <Input placeholder="Introduce el nombre del hermano" {...field} />
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
        <FormField control={form.control} name="vieneSolo" render={({ field }) => (
            <FormItem >
            <FormLabel>¿Consienten que vaya y venga solo a clase?</FormLabel>
            <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
            <div className="flex gap-6">
                    <FormItem className="flex items-center space-x-2">
                    <FormControl>
                        <RadioGroupItem value="si" />
                    </FormControl>
                    <FormLabel className="font-normal">Sí</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-2">
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
        <FormField control={form.control} name="requisar" render={({ field }) => (
            <FormItem >
            <FormLabel>¿Autorizan que, de forma excepcional, le requisemos el móvil/tablet durante el horario de clase?</FormLabel>
            <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
            <div className="flex gap-6">
                    <FormItem className="flex items-center space-x-2">
                    <FormControl>
                        <RadioGroupItem value="si" />
                    </FormControl>
                    <FormLabel className="font-normal">Sí</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-2">
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
        <FormField control={form.control} name="fotos" render={({ field }) => (
            <FormItem>
            <FormLabel>En caso de realizar fotografías con fines educativos/publicitarios, ¿consiente que su hijo/a aparezca en ellas?</FormLabel>
            <FormControl>
                <RadioGroup onValueChange={(value) => {field.onChange(value) 
                setConsienteFotos(value)}} defaultValue={field.value} className="flex flex-col space-y-1">

                <div className="flex gap-6">
                    <FormItem className="flex items-center space-x-2">
                    <FormControl>
                        <RadioGroupItem value="si" />
                    </FormControl>
                    <FormLabel className="font-normal">Sí</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-2">
                    <FormControl>
                        <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                </div>
                </RadioGroup>
            </FormControl>

            {consienteFotos === "si" && (
                <FormField control={form.control} name="rrss" render={({ field }) => (
                    <FormItem >
                    <FormLabel>¿Consiente que dichas fotos fueran subidas a Redes sociales?</FormLabel>
                    <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                    <div className="flex gap-6">
                            <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <RadioGroupItem value="si" />
                            </FormControl>
                            <FormLabel className="font-normal">Sí</FormLabel>
                            </FormItem>
        
                            <FormItem className="flex items-center space-x-2">
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
        <FormField control={form.control} name="knowUs" render={({ field }) => (
            <FormItem >
                <FormLabel>¿Cómo nos has conocido?</FormLabel>
                <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                            
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <RadioGroupItem value="rrss" />
                                </FormControl>
                                <FormLabel className="font-normal">RRSS</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <RadioGroupItem value="web"/>
                                </FormControl>
                                <FormLabel className="font-normal">Web</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <RadioGroupItem value="maps"/>
                                </FormControl>
                                <FormLabel className="font-normal">Google Maps</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <RadioGroupItem value="anuncio"/>
                                </FormControl>
                                <FormLabel className="font-normal">Anuncio</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <RadioGroupItem value="recomendacion"/>
                                </FormControl>
                                <FormLabel className="font-normal">Recomendacion</FormLabel>
                            </FormItem>
                            
                            <FormItem className="flex items-center space-x-2">
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

            <Button variant="secondary" type="submit">Guardar alumno</Button>
        </form>
    </Form>
</div>
)}

export default NuevoAlumnoPage
