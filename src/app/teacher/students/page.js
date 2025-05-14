'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import TeacherStudentsTable from '@/components/teacher/TeacherStudentsTable';
import ClientOnly from '@/components/ClientOnly';
// Importar estilos si son necesarios, ej: import styles from './students.module.css';

const TeacherStudentsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [students, setStudents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && user && user.id) {
      const fetchStudents = async () => {
        setLoadingData(true);
        setError(null);
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token no encontrado");

          // 1. Obtener IDs de los horarios del profesor
          const scheduleRes = await fetch(`/api/profesores/${user.id}/horarios`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
           if (!scheduleRes.ok) {
               const errorData = await scheduleRes.text();
               throw new Error(`Error fetching schedule IDs: ${scheduleRes.status} ${scheduleRes.statusText} - ${errorData}`);
           }
          const teacherSchedules = await scheduleRes.json();
          const teacherScheduleIds = teacherSchedules.map(s => s.idschedule);

          if (teacherScheduleIds.length > 0) {
            // 2. Obtener relaciones estudiante-horario
            const studentSchedulesRes = await fetch(`/api/estudiantesHorarios`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!studentSchedulesRes.ok) {
               const errorData = await studentSchedulesRes.text();
               throw new Error(`Error fetching student schedules: ${studentSchedulesRes.status} ${studentSchedulesRes.statusText} - ${errorData}`);
            }
            const allStudentSchedules = await studentSchedulesRes.json();

            // 3. Filtrar relaciones para obtener IDs de estudiantes de este profesor
            const relevantStudentSchedules = allStudentSchedules.filter(ss => 
                teacherScheduleIds.includes(ss.idschedule)
            );
            const studentIds = [...new Set(relevantStudentSchedules.map(ss => ss.idstudent))];

            if (studentIds.length > 0) {
                // 4. Obtener detalles de todos los estudiantes
                const studentsRes = await fetch(`/api/estudiantes`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!studentsRes.ok) {
                   const errorData = await studentsRes.text();
                   throw new Error(`Error fetching students: ${studentsRes.status} ${studentsRes.statusText} - ${errorData}`);
                }
                const allStudents = await studentsRes.json();

                // 5. Filtrar la lista de estudiantes
                const teacherStudents = allStudents.filter(student => studentIds.includes(student.idstudent));
                setStudents(teacherStudents);
            } else {
                setStudents([]); // No hay estudiantes para los horarios encontrados
            }
          } else {
            setStudents([]); // Profesor no tiene horarios asignados
          }

        } catch (error) {
          console.error("Error fetching teacher students:", error);
          setError(error.message);
        } finally {
          setLoadingData(false);
        }
      };
      fetchStudents();
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
    return <div className="p-8 text-red-600">Error al cargar los alumnos: {error}</div>;
  }

  if (!user && !loadingData) {
     return <div className="p-8">No autorizado o sesión expirada. Por favor, <a href="/login" className="text-blue-600 hover:underline">inicia sesión</a>.</div>;
  }

  return (
    <ClientOnly>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Mis Alumnos</h1>
          {user && <p className="text-gray-600">Alumnos asignados a {user.name || 'Profesor'}</p>}
        </div>
        <TeacherStudentsTable students={students} />
      </div>
    </ClientOnly>
  );
};

export default TeacherStudentsPage; 