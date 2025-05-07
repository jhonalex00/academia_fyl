'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          // No hay token, redirigir a login si no estamos en la página de login
          if (pathname !== '/login') {
            router.push('/login');
          }
          setLoading(false);
          return;
        }

        // Verificar si el token es válido
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          
          // Si estamos en la página de login y tenemos un usuario válido, redirigir al dashboard
          if (pathname === '/login') {
            router.push('/dashboard');
          }
        } else {
          // Token inválido, limpiar localStorage y redirigir a login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          if (pathname !== '/login') {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        
        // En caso de error, eliminar token y redirigir a login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        if (pathname !== '/login') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);
  const login = (token, userData) => {
    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Establecer cookie para el middleware
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}`; // 24 horas
    
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Eliminar cookie
    document.cookie = 'token=; path=/; max-age=0';
    
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
