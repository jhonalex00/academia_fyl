'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import FatherScheduleView from '@/components/father/FatherScheduleView';
import ClientOnly from '@/components/ClientOnly';

const FatherSchedulePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && user && user.id) {
      // Por ahora, usar datos de ejemplo hasta que se implemente el endpoint real
      const loadExampleSchedule = () => {
        setLoadingData(true);
        setError(null);
        
        // Simular una pequeña carga
        setTimeout(() => {
          // Datos de ejemplo para mostrar el horario
          const exampleSchedule = [
            { day: 'Lunes', time: '09:00', subject: 'Matemáticas', teacher: 'Prof. García', room: 'Aula 101' },
            { day: 'Lunes', time: '10:00', subject: 'Lengua', teacher: 'Prof. Martínez', room: 'Aula 102' },
            { day: 'Martes', time: '09:00', subject: 'Inglés', teacher: 'Prof. Smith', room: 'Aula 103' },
            { day: 'Martes', time: '11:00', subject: 'Ciencias', teacher: 'Prof. López', room: 'Lab 1' },
            { day: 'Miércoles', time: '10:00', subject: 'Historia', teacher: 'Prof. Ruiz', room: 'Aula 104' },
            { day: 'Jueves', time: '09:00', subject: 'Matemáticas', teacher: 'Prof. García', room: 'Aula 101' },
            { day: 'Viernes', time: '11:00', subject: 'Educación Física', teacher: 'Prof. Sánchez', room: 'Gimnasio' }
          ];
          
          setSchedule(exampleSchedule);
          setLoadingData(false);
        }, 1000);
      };
      
      loadExampleSchedule();
    } else if (!authLoading) {
      setLoadingData(false);
      if (!user) setError("Usuario no autenticado.");
      else if (!user.id) setError("ID de usuario no disponible.");
    }
  }, [user, authLoading]);

  if (authLoading || loadingData) {
    return (
      <div className="p-8 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error && !loadingData) {
    return <div className="p-8 text-red-600">Error al cargar los horarios: {error}</div>;
  }

  if (!user && !loadingData) {
    return <div className="p-8">No autorizado o sesión expirada. Por favor, <a href="/login" className="text-blue-600 hover:underline">inicia sesión</a>.</div>;
  }

  return (
    <ClientOnly>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Horario de Clases</h1>
          {user && <p className="text-gray-600">Bienvenido/a {user.name} - Horario de su hijo/a</p>}
        </div>
        <FatherScheduleView schedule={schedule} />
      </div>
    </ClientOnly>
  );
};

export default FatherSchedulePage;