'use client';
import React, { useState, useEffect } from 'react';
import { FaSchoolFlag } from "react-icons/fa6";
import { GiTeacher } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { IoBook } from "react-icons/io5";
import StatCard from '@/components/dashboard/StatCard';
import ChartCard from '@/components/dashboard/ChartCard';
import DataTable from '@/components/dashboard/DataTable';
import RecentActivity from '@/components/dashboard/RecentActivity';
import BarChart from '@/components/dashboard/BarChart';
import DonutChart from '@/components/dashboard/DonutChart';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import MiniCalendar from '@/components/dashboard/MiniCalendar';
import { getStudents, getAcademies, getTeachers, getSubjects, getSchedules, getDashboardStats, getRecentActivities, getCalendarEvents } from '@/lib/api';
import { formatStudents, formatTeachers, formatSubjects, calculateStats } from '@/lib/dashboard';
import styles from './dashboard.module.css';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    subjects: 0,
    academies: 0
  });
  
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
          // Obtener datos de las APIs incluyendo las nuevas del dashboard
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const [studentsRaw, teachersRaw, subjectsRaw, academies, schedules, dashboardStats, activities, calendarEventsData] = await Promise.all([
          getStudents(),
          getTeachers(),
          getSubjects(),
          getAcademies(),
          getSchedules(),
          getDashboardStats().catch(() => null), // Si falla, continuamos con null
          getRecentActivities().catch(() => []),  // Si falla, continuamos con array vacío
          getCalendarEvents(currentMonth, currentYear).catch(() => []) // Si falla, continuamos con array vacío
        ]);
          // Formatear los datos
        const students = formatStudents(studentsRaw);
        const teachers = formatTeachers(teachersRaw);
        const subjects = formatSubjects(subjectsRaw);
        
        // Usar estadísticas del backend si están disponibles, o calcularlas localmente
        const statsToUse = dashboardStats?.counts || 
          calculateStats({
            students,
            teachers,
            subjects,
            academies
          }).counts;
          
        // Obtener datos de crecimiento desde el backend o usar valores por defecto
        const growthRates = dashboardStats?.growth || {
          students: 12,
          teachers: 5,
          subjects: 8,
          academies: 3
        };
        
        // Actualizar estadísticas
        setStats(statsToUse);
        
        // Obtener los 5 estudiantes más recientes
        const sortedStudents = [...students].sort((a, b) => 
          new Date(b.birthDate || 0) - new Date(a.birthDate || 0)
        ).slice(0, 5);
        
        setRecentStudents(sortedStudents);
        
        // Usar actividades recientes del backend si están disponibles
        if (activities && activities.length > 0) {
          setRecentActivities(activities);
        } else {
          // Actividades de respaldo si el endpoint falla
          setRecentActivities([
            {
              initials: 'MS',
              title: 'María Sánchez se ha registrado',
              description: 'Nueva alumna en Matemáticas de 2º de ESO',
              time: 'Hace 2 horas'
            },
            {
              initials: 'JR',
              title: 'Juan Rodríguez ha actualizado su perfil',
              description: 'Profesor de Física y Química',
              time: 'Hace 5 horas'
            },
            {
              initials: 'LP',
              title: 'Luis Pérez ha cancelado una clase',
              description: 'Historia - 17:00 - 18:30',
              time: 'Ayer'
            },
            {
              initials: 'AL',
              title: 'Academia Las Lomas añadida',
              description: 'Nueva sede registrada en el sistema',
              time: 'Hace 2 días'
            }
          ]);
        }
        
        // Generar eventos próximos para la demostración
        // En un caso real, estos vendrían de la API de horarios
        setUpcomingEvents([
          {
            title: 'Clase de Matemáticas',
            subject: '2º de ESO',
            time: 'Hoy, 16:00 - 17:30',
            teacher: 'Carlos Martínez',
            teacherInitials: 'CM'
          },
          {
            title: 'Clase de Inglés',
            subject: '1º de Bachillerato',
            time: 'Hoy, 18:00 - 19:30',
            teacher: 'Ana López',
            teacherInitials: 'AL'
          },          {
            title: 'Clase de Física',
            subject: '2º de Bachillerato',
            time: 'Mañana, 15:00 - 16:30',
            teacher: 'Roberto García',
            teacherInitials: 'RG'
          }
        ]);
          // Usar eventos de calendario de la API si están disponibles, o generar eventos de respaldo
        if (calendarEventsData && calendarEventsData.length > 0) {
          // Asegurarse de que las fechas son objetos Date
          setCalendarEvents(calendarEventsData.map(event => ({
            ...event,
            date: new Date(event.date)
          })));
        } else {
          // Eventos de respaldo si el endpoint falla
          const today = new Date();
          setCalendarEvents([
            {
              title: 'Clase de Matemáticas',
              date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
              teacher: 'Carlos Martínez'
            },
            {
              title: 'Examen de Inglés',
              date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
              teacher: 'Ana López'
            },
            {
              title: 'Tutoría',
              date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
              teacher: 'Roberto García'
            },
            {
              title: 'Reunión de profesores',
              date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
              teacher: 'Dirección'
            }
          ]);
        }
        
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Datos para las gráficas
  const subjectDistributionData = [
    { label: 'Mat', value: 45, color: 'bg-indigo-500' },
    { label: 'Len', value: 30, color: 'bg-blue-500' },
    { label: 'Ing', value: 25, color: 'bg-green-500' },
    { label: 'Fis', value: 15, color: 'bg-yellow-500' },
    { label: 'Bio', value: 20, color: 'bg-red-500' }
  ];
  
  const studentsByCycleData = [
    { label: 'Primaria', value: 35, color: '#4f46e5' },
    { label: 'ESO', value: 45, color: '#0ea5e9' },
    { label: 'Bachillerato', value: 20, color: '#10b981' },
  ];
    // Columnas para la tabla de estudiantes recientes
  const studentColumns = [
    { header: 'Nombre', accessor: 'name' },
    { header: 'DNI', accessor: 'dni' },
    { 
      header: 'Fecha', 
      accessor: 'birthDate',
      cell: (row) => {
        const date = row.birthDate || row.fechaNacimiento;
        return date ? new Date(date).toLocaleDateString() : 'No disponible';
      }
    },
    { 
      header: 'Email', 
      accessor: 'email',
      cell: (row) => row.email || 'No disponible'
    },
    { 
      header: 'Estado', 
      cell: (row) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          row.status === 'Inactivo' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {row.status || 'Activo'}
        </span>
      )
    }
  ];
  
  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-screen">
        <div className={styles['loading-spinner']}></div>
      </div>
    );
  }

  return (
    <div className={`p-8 ${styles['dashboard-container']}`}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al panel de administración</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">        <StatCard 
          title="Total Alumnos" 
          value={stats.students} 
          icon={<PiStudentFill size={24} />}
          increment={growthRates.students}
          color="indigo"
        />
        <StatCard 
          title="Total Profesores" 
          value={stats.teachers} 
          icon={<GiTeacher size={24} />}
          increment={growthRates.teachers}
          color="green"
        />
        <StatCard 
          title="Total Asignaturas" 
          value={stats.subjects} 
          icon={<IoBook size={24} />}
          increment={growthRates.subjects}
          color="orange"
        />
        <StatCard 
          title="Total Academias" 
          value={stats.academies} 
          icon={<FaSchoolFlag size={24} />}
          increment={growthRates.academies}
          color="blue"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ChartCard 
          title="Distribución por Asignaturas" 
          className="lg:col-span-2"
        >
          <BarChart data={subjectDistributionData} className="h-full" />
        </ChartCard>
        
        <ChartCard title="Alumnos por Ciclo">
          <DonutChart data={studentsByCycleData} />
        </ChartCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <DataTable 
          title="Alumnos recientes"
          data={recentStudents}
          columns={studentColumns}
          className="lg:col-span-2"
        />
        
        <RecentActivity 
          title="Actividad reciente"
          activities={recentActivities}
        />
      </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UpcomingEvents
          title="Próximas clases"
          events={upcomingEvents}
          className="lg:col-span-2"
        />
        <MiniCalendar
          title="Calendario"
          events={calendarEvents}
        />
      </div>
    </div>
  );
};

export default DashboardPage;