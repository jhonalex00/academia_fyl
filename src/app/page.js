'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir según el tipo de usuario autenticado
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        
        // Redirigir según el rol del usuario
        switch (user.role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'teacher':
            router.push('/teacher/schedule');
            break;
          case 'parent':
          case 'contact':
            router.push('/father/horarios');
            break;
          default:
            // Si no tiene rol definido o es desconocido, ir a login
            router.push('/login');
        }
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        // Si hay error al parsear, limpiar localStorage y ir a login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

