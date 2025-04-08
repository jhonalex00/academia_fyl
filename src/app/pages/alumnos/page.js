'use client';

import React from 'react';

const AlumnosPage = () => {
  const handleClick = () => {
    alert('¡Botón clickeado en la página de Alumnos!');
  };

  return (
    <div>
      <h1>Alumnos</h1>
      <p>Gestión de alumnos.</p>
      <button onClick={handleClick}>Haz clic aquí</button>
    </div>
  );
};

export default AlumnosPage;
