'use client';
import React from 'react';
import { Button } from "@headlessui/react";

export function AñadirAcademia() {
  const handleClick = () => {
    alert("Hola");
  };

  return (
    <div className="flex gap-4 items-center">
      <Button
      className="px-4 py-2 bg-green-400 text-black rounded-lg border-2 border-blue-600"
      size="md" onClick={handleClick}>BOTON</Button>
    </div>
  );
}

const AcademiasPage = () => {
  return (
    <>
      <AñadirAcademia />  {/* Añadido aquí */}
      <div style={{ display: 'flex', gap: '18%', marginTop: "10%", marginLeft: "3%" }}>
        <h1>Academia</h1>
        <h1>Dirección</h1>
        <h1>Teléfono</h1>
        <h1>Nº Alumnos</h1>
      </div>
    </>
  );
};

export default AcademiasPage;