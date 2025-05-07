'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { Toaster } from 'sonner';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const token = localStorage.getItem('token');
    
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await fetch('/api/auth/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          
          const data = await response.json();
          
          if (response.ok && data.valid) {
            // Token válido, redirigir al dashboard
            router.push('/dashboard');
          } else {
            // Token inválido, limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error al verificar token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      };
      
      verifyToken();
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Academia FyL</h1>
        <p className="text-gray-500 text-center">Sistema de gestión académica</p>
      </div>
      <LoginForm />
      <Toaster position="top-center" />
    </div>
  );
}
