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
import ClientOnly from '@/components/ClientOnly';
import { getStudents, getAcademies, getTeachers, getSubjects, getSchedules, getDashboardStats, getRecentActivities, getCalendarEvents, getSubjectStats, getStudentStats } from '@/lib/api';
import { formatStudents, formatTeachers, formatSubjects, calculateStats } from '@/lib/dashboard';
import styles from './dashboard.module.css';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    subjects: 0,
    academies: 0
  });
  
  const [growthRates, setGrowthRates] = useState({
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
          const [
          studentsRaw, 
          teachersRaw, 
          subjectsRaw, 
          academies, 
          schedules, 
          dashboardStats, 
          activities, 
          calendarEventsData,
          subjectStatsData,
          studentStatsData
        ] = await Promise.all([
          getStudents(),
          getTeachers(),
          getSubjects(),
          getAcademies(),
          getSchedules(),
          getDashboardStats().catch(() => null), // Si falla, continuamos con null
          getRecentActivities().catch(() => []),  // Si falla, continuamos con array vacío
          getCalendarEvents(currentMonth, currentYear).catch(() => []), // Si falla, continuamos con array vacío
          getSubjectStats().catch(() => null), // Estadísticas detalladas de asignaturas
          getStudentStats().catch(() => null) // Estadísticas detalladas de estudiantes
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
        const growthRatesData = dashboardStats?.growth || {
          students: 12,
          teachers: 5,
          subjects: 8,
          academies: 3
        };
        
        // Actualizar el estado de growthRates
        setGrowthRates(growthRatesData);
          // Actualizar estadísticas
        setStats(statsToUse);
          // Actualizar datos de distribución por ciclo
        if (subjectStatsData?.cycleDistribution) {
          // Mapeo de ciclos a colores
          const cycleColors = {
            'Primaria': '#4f46e5',
            'ESO': '#0ea5e9',
            'Bachillerato': '#10b981',
            'FP': '#f59e0b',
            'Universidad': '#ef4444'
          };
          
          const cycleData = subjectStatsData.cycleDistribution.map(item => ({
            label: item.cycle || 'Sin ciclo',
            value: parseInt(item.count) || 0,
            color: cycleColors[item.cycle] || '#6b7280'
          }));
          
          if (cycleData.length > 0) {
            setStudentsByCycleData(cycleData);
          } else if (dashboardStats?.cycleDistribution) {
            // Usar los datos del dashboard general si no hay datos específicos
            const fallbackCycleData = dashboardStats.cycleDistribution.map(item => ({
              label: item.cycle || 'Sin ciclo',
              value: parseInt(item.count) || 0,
              color: cycleColors[item.cycle] || '#6b7280'
            }));
            
            setStudentsByCycleData(fallbackCycleData);
          }
        }
          // Actualizar distribución de asignaturas
        try {
          // Si tenemos datos específicos de asignaturas, usarlos primero
          if (subjectStatsData?.yearDistribution && subjectStatsData.yearDistribution.length > 0) {
            // Mapeo de asignaturas a colores
            const yearColors = {
              1: 'bg-indigo-500',
              2: 'bg-blue-500',
              3: 'bg-green-500',
              4: 'bg-yellow-500',
              5: 'bg-red-500',
              6: 'bg-purple-500'
            };
            
            // Convertir a formato para gráficos
            const yearData = subjectStatsData.yearDistribution.map(item => ({
              label: `${item.year}º`,
              fullLabel: `${item.year}º Año`,
              value: parseInt(item.count) || 0,
              color: yearColors[item.year] || 'bg-gray-500'
            })).slice(0, 5); // Limitar a 5 años para el gráfico
            
            if (yearData.length > 0) {
              setSubjectDistributionData(yearData);
              // Salimos de la función si ya tenemos datos
              return;
            }
          }
          
          // Plan B: Usar los datos de subjects si no hay estadísticas específicas
          const subjectMap = {};
          
          subjects.forEach(subject => {
            const mainSubject = subject.cycle?.split(' ')[0] || 'Otras';
            subjectMap[mainSubject] = (subjectMap[mainSubject] || 0) + 1;
          });
          
          // Mapeo de asignaturas a colores
          const subjectColors = {
            'Matemáticas': 'bg-indigo-500',
            'Lengua': 'bg-blue-500',
            'Inglés': 'bg-green-500',
            'Física': 'bg-yellow-500',
            'Química': 'bg-red-500',
            'Historia': 'bg-purple-500',
            'Biología': 'bg-pink-500',
            'Otras': 'bg-gray-500'
          };
          
          // Convertir a formato para gráficos
          const subjectData = Object.entries(subjectMap)
            .map(([label, value]) => ({
              label: label.substring(0, 3),  // Abreviatura de 3 letras
              fullLabel: label,
              value,
              color: subjectColors[label] || 'bg-gray-500'
            }))
            .slice(0, 5); // Limitar a 5 asignaturas para el gráfico
            
          if (subjectData.length > 0) {
            setSubjectDistributionData(subjectData);
          }
        } catch (error) {
          console.error('Error al procesar distribución de asignaturas:', error);
        }
        
        // Obtener los 5 estudiantes más recientes
        const sortedStudents = [...students].sort((a, b) => 
          new Date(b.birthDate || 0) - new Date(a.birthDate || 0)
        ).slice(0, 5);
        
        setRecentStudents(sortedStudents);
          // Usar actividades recientes del backend
        try {
          if (activities && activities.length > 0) {
            setRecentActivities(activities);
          } else {
            setRecentActivities([]);
            console.log('No hay actividades recientes disponibles');
          }
        } catch (error) {
          console.error('Error al procesar actividades recientes:', error);
          setRecentActivities([]);
        }
          // Generar eventos próximos basados en los datos de horarios
        try {
          // Filtrar los horarios de los próximos días
          const today = new Date();
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          
          // Usar los datos de schedules para generar eventos próximos
          if (schedules && schedules.length > 0) {
            // Formatear los horarios como eventos próximos
            const formattedEvents = schedules
              .filter(schedule => {
                if (!schedule.date) return false;
                const scheduleDate = new Date(schedule.date);
                return scheduleDate >= today && scheduleDate <= nextWeek;
              })
              .map(schedule => {
                // Extraer iniciales del profesor (si existe)
                const teacherName = schedule.teacherName || 'Sin profesor';
                const teacherInitials = teacherName
                  .split(' ')
                  .map(name => name[0])
                  .join('')
                  .toUpperCase();
                  
                // Formatear la fecha y hora
                const scheduleDate = new Date(schedule.date);
                const isToday = scheduleDate.toDateString() === today.toDateString();
                const isTomorrow = 
                  scheduleDate.toDateString() === 
                  new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toDateString();
                
                let timeStr = '';
                if (isToday) {
                  timeStr = 'Hoy';
                } else if (isTomorrow) {
                  timeStr = 'Mañana';
                } else {
                  const options = { weekday: 'long' };
                  timeStr = new Intl.DateTimeFormat('es-ES', options).format(scheduleDate);
                  timeStr = timeStr.charAt(0).toUpperCase() + timeStr.slice(1); // Capitalizar
                }
                
                // Añadir horario si está disponible
                if (schedule.startHour && schedule.finishHour) {
                  const startTime = schedule.startHour.substring(0, 5); // HH:MM
                  const endTime = schedule.finishHour.substring(0, 5); // HH:MM
                  timeStr += `, ${startTime} - ${endTime}`;
                }
                
                return {
                  title: schedule.title || `Clase de ${schedule.subjectCycle || 'Materia'}`,
                  subject: `${schedule.subjectYear || ''} ${schedule.subjectCycle || ''}`.trim() || 'Sin curso asignado',
                  time: timeStr,
                  teacher: teacherName,
                  teacherInitials: teacherInitials || 'SP',
                  location: schedule.academyName || 'Sede principal'
                };
              })
              .slice(0, 3); // Tomar solo los primeros 3 eventos
              
            setUpcomingEvents(formattedEvents);
          } else {
            console.log('No hay horarios disponibles para generar eventos próximos');
            setUpcomingEvents([]);
          }
        } catch (error) {
          console.error('Error al procesar eventos próximos:', error);
          setUpcomingEvents([]);
        }// Usar eventos de calendario de la API
        try {
          if (calendarEventsData && calendarEventsData.length > 0) {
            // Asegurarse de que las fechas son objetos Date
            const formattedEvents = calendarEventsData.map(event => ({
              ...event,
              date: new Date(event.date)
            }));
            setCalendarEvents(formattedEvents);
          } else {
            setCalendarEvents([]);
            console.log('No hay eventos de calendario disponibles');
          }
        } catch (error) {
          console.error('Error al procesar eventos del calendario:', error);
          setCalendarEvents([]);
        }
        
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
    // Estado para los datos de las gráficas
  const [subjectDistributionData, setSubjectDistributionData] = useState([
    { label: 'Mat', value: 0, color: 'bg-indigo-500' },
    { label: 'Len', value: 0, color: 'bg-blue-500' },
    { label: 'Ing', value: 0, color: 'bg-green-500' },
    { label: 'Fis', value: 0, color: 'bg-yellow-500' },
    { label: 'Bio', value: 0, color: 'bg-red-500' }
  ]);
  
  const [studentsByCycleData, setStudentsByCycleData] = useState([
    { label: 'Primaria', value: 0, color: '#4f46e5' },
    { label: 'ESO', value: 0, color: '#0ea5e9' },
    { label: 'Bachillerato', value: 0, color: '#10b981' },
  ]);
    // Columnas para la tabla de estudiantes recientes
  const studentColumns = [
    { header: 'Nombre', accessor: 'name' },
    { header: 'DNI', accessor: 'dni' },
    {      header: 'Fecha', 
      accessor: 'birthDate',
      cell: (row) => {
        const date = row.birthDate || row.fechaNacimiento;
        if (!date) return 'No disponible';
        
        // Usar formato específico para evitar problemas de hidratación
        try {
          const dateObj = new Date(date);
          const day = dateObj.getDate().toString().padStart(2, '0');
          const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
          const year = dateObj.getFullYear();
          return `${day}/${month}/${year}`;
        } catch (e) {
          return 'Formato inválido';
        }
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
    <ClientOnly>
      <div className={`p-8 ${styles['dashboard-container']}`}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Bienvenido al panel de administración</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
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
    </ClientOnly>
  );
};

export default DashboardPage;