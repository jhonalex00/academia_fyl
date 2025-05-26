'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import TeacherScheduleView from '@/components/teacher/TeacherScheduleView';
import ClientOnly from '@/components/ClientOnly';
// Importar estilos si son necesarios, ej: import styles from './schedule.module.css';

const API_BASE_URL = 'http://localhost:3001/api';

const TeacherSchedulePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [academias, setAcademias] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar los horarios del profesor
  const cargarHorarios = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingData(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token no encontrado");

      const scheduleRes = await fetch(`${API_BASE_URL}/profesores/${user.id}/horarios`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!scheduleRes.ok) {
        const errorData = await scheduleRes.text();
        throw new Error(`Error al cargar horarios: ${scheduleRes.status} ${scheduleRes.statusText} - ${errorData}`);
      }
      
      const teacherSchedules = await scheduleRes.json();
      setSchedule(teacherSchedules);
    } catch (error) {
      console.error("Error al cargar horarios:", error);
      setError(error.message);
      setSchedule([]);
    } finally {
      setLoadingData(false);
    }
  };

  // Función para cargar las academias
  const cargarAcademias = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token no encontrado");

      const academiasRes = await fetch(`${API_BASE_URL}/academias`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!academiasRes.ok) {
        throw new Error(`Error al cargar academias: ${academiasRes.status}`);
      }
      
      const academiasData = await academiasRes.json();
      setAcademias(academiasData);
    } catch (error) {
      console.error("Error al cargar academias:", error);
      setError(error.message);
    }
  };

  // Función para cargar las asignaturas del profesor
  const cargarAsignaturas = async () => {
    if (!user?.id) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token no encontrado");

      const asignaturasRes = await fetch(`${API_BASE_URL}/profesores/${user.id}/asignaturas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!asignaturasRes.ok) {
        throw new Error(`Error al cargar asignaturas: ${asignaturasRes.status}`);
      }
      
      const asignaturasData = await asignaturasRes.json();
      setAsignaturas(asignaturasData);
    } catch (error) {
      console.error("Error al cargar asignaturas:", error);
      setError(error.message);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (!authLoading && user?.id) {
      cargarHorarios();
      cargarAcademias();
      cargarAsignaturas();
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
    return <div className="p-8 text-red-600">Error: {error}</div>;
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
        <TeacherScheduleView 
          schedule={schedule} 
          academias={academias}
          asignaturas={asignaturas}
          onScheduleUpdate={cargarHorarios}
        />
      </div>
    </ClientOnly>
  );
};

export default TeacherSchedulePage; 