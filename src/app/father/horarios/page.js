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
      const fetchSchedule = async () => {
        setLoadingData(true);
        setError(null);
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token no encontrado");

          // Cambio en la URL del endpoint para obtener horarios de los hijos
          const scheduleRes = await fetch(`/api/padres/${user.id}/horarios-hijos`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (!scheduleRes.ok) {
            const errorData = await scheduleRes.text();
            throw new Error(`Error obteniendo horarios: ${scheduleRes.status} ${scheduleRes.statusText} - ${errorData}`);
          }
          
          const studentSchedules = await scheduleRes.json();
          setSchedule(studentSchedules);

        } catch (error) {
          console.error("Error al obtener horarios de los hijos:", error);
          setError(error.message);
          setSchedule([]);
        } finally {
          setLoadingData(false);
        }
      };
      fetchSchedule();
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
          <h1 className="text-2xl font-bold text-gray-800">Horario</h1>
          {user && <p className="text-gray-600">Horario {user.lastName || 'del alumno'}</p>}
        </div>
        <FatherScheduleView schedule={schedule} />
      </div>
    </ClientOnly>
  );
};

export default FatherSchedulePage;