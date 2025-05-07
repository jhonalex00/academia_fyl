'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !loading) {
      // Si no hay usuario autenticado y no estamos en la página de login, redirigir al login
      if (!user && pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [user, loading, router, pathname, isClient]);

  if (loading || !isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-primary"></div>
          <p className="text-xl font-medium text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario y no estamos en la página de login, no renderizar nada mientras se redirige
  if (!user && pathname !== '/login') {
    return null;
  }

  // En la página de login o con usuario autenticado, renderizar el contenido
  return children;
}
