'use client';

import React from 'react';

const AlumnosPage = () => {
  const handleClick = () => {
    alert('¡Botón clickeado en la página de Alumnos!');
  };

  return (
    <div>
      <Button size="md" onClick={handleClick}>Añadir</Button>
    </div>
  );
};

export default AlumnosPage;
