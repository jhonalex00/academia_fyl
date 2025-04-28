'use client';
import { useState, useEffect } from 'react';

// Componente que solo renderiza su contenido en el cliente
export default function ClientOnly({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Retornamos un placeholder similar en estructura pero vacío para evitar cambios en el layout
    return <div style={{ visibility: 'hidden' }}></div>;
  }

  return <>{children}</>;
}
