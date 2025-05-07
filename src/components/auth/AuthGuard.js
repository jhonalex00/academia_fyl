'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // No hacer nada mientras se está cargando la autenticación
    if (loading) return;
      // Si el usuario no está autenticado y no estamos en la página de login, redirigir al login
    if (!user && pathname !== '/login') {
      toast.error("Acceso restringido", {
        description: "Debes iniciar sesión para acceder a esta página",
      });
      router.push('/login');
    }
  }, [user, loading, router, pathname, toast]);

  // Si estamos cargando, mostrar un spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no hay usuario y no estamos en la página de login, no renderizar nada hasta que se redireccione
  if (!user && pathname !== '/login') {
    return null;
  }

  // Si hay usuario o estamos en la página de login, renderizar el contenido
  return children;
}
