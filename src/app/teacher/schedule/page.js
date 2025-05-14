'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import TeacherScheduleView from '@/components/teacher/TeacherScheduleView';
import ClientOnly from '@/components/ClientOnly';
// Importar estilos si son necesarios, ej: import styles from './schedule.module.css';

const TeacherSchedulePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [schedule, setSchedule] = useState(null); // Inicializar como null para diferenciar de array vacío
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

          const scheduleRes = await fetch(`/api/profesores/${user.id}/horarios`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!scheduleRes.ok) {
              const errorData = await scheduleRes.text(); // Intentar obtener más detalles del error
              throw new Error(`Error fetching schedule: ${scheduleRes.status} ${scheduleRes.statusText} - ${errorData}`);
          }
          const teacherSchedules = await scheduleRes.json();
          setSchedule(teacherSchedules);

        } catch (error) {
          console.error("Error fetching teacher schedule:", error);
          setError(error.message);
          setSchedule([]); // Poner array vacío en caso de error para que el componente muestre el mensaje
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
        {/* Reemplazar con un spinner/loading real si existe */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Mostrar error si existe y no estamos cargando
  if (error && !loadingData) {
    return <div className="p-8 text-red-600">Error al cargar el horario: {error}</div>;
  }

  // Asegurarse de que user existe antes de intentar renderizar el nombre
  if (!user && !loadingData) {
     return <div className="p-8">No autorizado o sesión expirada. Por favor, <a href="/login" className="text-blue-600 hover:underline">inicia sesión</a>.</div>;
  }

  return (
    <ClientOnly>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Mi Horario</h1>
          {user && <p className="text-gray-600">Horario para {user.name || 'Profesor'}</p>}
        </div>
        <TeacherScheduleView schedule={schedule} />
      </div>
    </ClientOnly>
  );
};

export default TeacherSchedulePage; 