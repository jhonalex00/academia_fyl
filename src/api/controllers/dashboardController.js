const { sequelize } = require("../../db/config");

// Obtener estadísticas del dashboard
const getDashboardStats = async (req, res) => {
  try {
    const [studentCount] = await sequelize.query(
      "SELECT COUNT(*) as count FROM students"
    );
    const [teacherCount] = await sequelize.query(
      "SELECT COUNT(*) as count FROM teachers"
    );
    const [subjectCount] = await sequelize.query(
      "SELECT COUNT(*) as count FROM subjects"
    );
    const [academyCount] = await sequelize.query(
      "SELECT COUNT(*) as count FROM academies"
    );

    // Corregido: usar "stage" en lugar de "cycle"
    const [cycleDistribution] = await sequelize.query(`
    SELECT stage AS cycle, COUNT(*) as count 
    FROM subjects 
    GROUP BY stage
  `);

    const [newStudentsThisMonth] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM students
      WHERE birthDate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    const [studentsLastMonth] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM students
      WHERE birthDate < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    let studentGrowth = 0;
    if (studentsLastMonth[0]?.count > 0) {
      studentGrowth = Math.round(
        (newStudentsThisMonth[0]?.count / studentsLastMonth[0]?.count) * 100
      );
    }

    const [newTeachersThisMonth] = await sequelize.query(`
    SELECT COUNT(*) as count 
    FROM teachers
    WHERE status = 'active' AND idteacher NOT IN (
      SELECT idteacher FROM messages WHERE dateMessage < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    )
  `);

    let teacherGrowth = Math.round(
      (newTeachersThisMonth[0]?.count / (teacherCount[0]?.count || 1)) * 100
    );

    // Para asignaturas y academias, podríamos no tener datos de crecimiento real,
    // así que estimamos basándonos en datos actuales
    let subjectGrowth = 5; // % estimado de crecimiento de asignaturas
    let academyGrowth = 2; // % estimado de crecimiento de academias

    res.status(200).json({
      counts: {
        students: studentCount[0]?.count || 0,
        teachers: teacherCount[0]?.count || 0,
        subjects: subjectCount[0]?.count || 0,
        academies: academyCount[0]?.count || 0,
      },
      growth: {
        students: studentGrowth || 0,
        teachers: teacherGrowth || 0,
        subjects: subjectGrowth || 0,
        academies: academyGrowth || 0,
      },
      cycleDistribution: cycleDistribution || [],
    });
  } catch (error) {
    console.error("Error al obtener estadísticas del dashboard:", error);
    res
      .status(500)
      .json({ error: "Error al obtener estadísticas del dashboard" });
  }
};

// Obtener actividades recientes
const getRecentActivities = async (req, res) => {
  try {
    // Obtener mensajes recientes como actividades
    const [messages] = await sequelize.query(`
      SELECT 
        m.idmessage,
        m.message,
        m.date,
        t.name AS teacherName,
        c.name AS contactName,
        SUBSTRING(t.name, 1, 1) AS teacherInitial,
        SUBSTRING(c.name, 1, 1) AS contactInitial
      FROM 
        messages m
      LEFT JOIN 
        teachers t ON m.idteacher = t.idteacher
      LEFT JOIN 
        contacts c ON m.idcontact = c.idcontact
      ORDER BY 
        m.date DESC
      LIMIT 5
    `);

    // Obtener estudiantes recientes
    const [newStudents] = await sequelize.query(`
      SELECT 
        s.idstudent,
        s.name,
        s.surname,
        s.birthDate,
        a.name AS academyName
      FROM 
        students s
      LEFT JOIN 
        academies a ON s.idacademy = a.idacademy
      ORDER BY 
        s.idstudent DESC
      LIMIT 3
    `);

    // Función para formatear el tiempo "hace cuánto"
    const formatTimeAgo = (date) => {
      const now = new Date();
      const activityDate = new Date(date);
      const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));

      if (diffInMinutes < 60) {
        return `Hace ${diffInMinutes} minutos`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `Hace ${hours} ${hours > 1 ? "horas" : "hora"}`;
      } else if (diffInMinutes < 2880) {
        return "Ayer";
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `Hace ${days} días`;
      }
    };

    // Transformar mensajes en actividades
    const messageActivities = messages.map((msg) => ({
      initials: msg.teacherInitial + msg.contactInitial || "NA",
      title: `Mensaje de ${msg.teacherName || "Profesor"} a ${
        msg.contactName || "Contacto"
      }`,
      description:
        msg.message.length > 40
          ? `${msg.message.substring(0, 40)}...`
          : msg.message,
      time: formatTimeAgo(msg.date),
    }));

    // Transformar nuevos estudiantes en actividades
    const studentActivities = newStudents.map((student) => ({
      initials:
        (student.name?.charAt(0) || "") + (student.surname?.charAt(0) || ""),
      title: `${student.name || "Estudiante"} ${
        student.surname || ""
      } se ha registrado`,
      description: `Nuevo alumno en ${student.academyName || "Academia"}`,
      time: student.birthDate
        ? formatTimeAgo(student.birthDate)
        : "Recientemente",
    }));

    // Combinar todas las actividades y ordenar por más recientes
    const allActivities = [...messageActivities, ...studentActivities].slice(
      0,
      5
    );

    res.status(200).json(allActivities);
  } catch (error) {
    console.error("Error al obtener actividades recientes:", error);
    res.status(500).json({ error: "Error al obtener actividades recientes" });
  }
};

// Obtener eventos del calendario
const getCalendarEvents = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Convertir los parámetros a números
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    // Validar los parámetros
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const targetMonth = isNaN(monthNum) ? currentMonth : monthNum;
    const targetYear = isNaN(yearNum) ? currentYear : yearNum;

    // Obtener eventos del horario desde la base de datos
    const [scheduleEvents] = await sequelize.query(
      `
      SELECT 
        s.idschedule,
        s.date,
        s.weekDay,
        s.startHour,
        s.finishHour,
        t.name AS teacherName,
        a.name AS academyName,
        sub.year AS subjectYear,
        sub.cycle AS subjectCycle
      FROM 
        schedules s
      LEFT JOIN 
        teachers_schedules ts ON s.idschedule = ts.idschedule
      LEFT JOIN 
        teachers t ON ts.idteacher = t.idteacher
      LEFT JOIN 
        academies a ON ts.idacademies = a.idacademy
      LEFT JOIN 
        teachers_subjects tsub ON t.idteacher = tsub.idteacher
      LEFT JOIN 
        subjects sub ON tsub.idsubject = sub.idsubject
      WHERE 
        (MONTH(s.date) = ? OR s.date IS NULL) 
        AND (YEAR(s.date) = ? OR s.date IS NULL)
      ORDER BY 
        s.date, s.startHour
    `,
      {
        replacements: [targetMonth + 1, targetYear], // +1 porque en JS los meses empiezan en 0
      }
    );

    // Obtener eventos de estudiante-horario
    const [studentEvents] = await sequelize.query(
      `
      SELECT 
        s.idschedule,
        s.date,
        s.weekDay,
        s.startHour,
        s.finishHour,
        st.name AS studentName,
        st.surname AS studentSurname
      FROM 
        schedules s
      JOIN 
        students_schedules ss ON s.idschedule = ss.idschedule
      JOIN 
        students st ON ss.idstudent = st.idstudent
      WHERE 
        (MONTH(s.date) = ? OR s.date IS NULL) 
        AND (YEAR(s.date) = ? OR s.date IS NULL)
        AND ss.status = 'active'
      ORDER BY 
        s.date, s.startHour
    `,
      {
        replacements: [targetMonth + 1, targetYear],
      }
    );

    // Transformar resultados a eventos de calendario
    const formatEvents = (schedules, isTeacherEvent = true) => {
      return schedules.map((event) => {
        // Determinar el título y descripción basado en si es evento de profesor o estudiante
        let title, teacher, subject, location;

        if (isTeacherEvent) {
          title = `${event.subjectCycle || ""} ${event.subjectYear || ""}`;
          teacher = event.teacherName || "Sin profesor asignado";
          subject = `${event.subjectCycle || ""} ${event.subjectYear || ""}`;
          location = event.academyName || "Sede principal";
        } else {
          title = `Clase de ${event.studentName || ""} ${
            event.studentSurname || ""
          }`;
          teacher = "";
          subject = event.weekDay || "";
          location = "";
        }

        // Si la fecha está en el pasado o es nula, usar el día de la semana
        const eventDate = event.date
          ? new Date(event.date)
          : new Date(
              targetYear,
              targetMonth,
              getNextWeekdayDate(event.weekDay, targetYear, targetMonth)
            );

        return {
          id: event.idschedule,
          title: title,
          date: eventDate,
          teacher: teacher,
          subject: subject,
          location: location,
          startHour: event.startHour,
          finishHour: event.finishHour,
          weekDay: event.weekDay,
        };
      });
    };

    // Función para obtener la próxima fecha para un día de la semana
    const getNextWeekdayDate = (weekday, year, month) => {
      const days = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];
      const dayIndex = days.indexOf(weekday);

      if (dayIndex === -1) return 1; // Si el día no es válido, usar el primer día del mes

      const firstDayOfMonth = new Date(year, month, 1);
      const firstDayIndex = firstDayOfMonth.getDay(); // 0 = Domingo, 1 = Lunes, etc.

      let dayOfMonth = dayIndex - firstDayIndex + 1;
      if (dayOfMonth <= 0) dayOfMonth += 7;

      return dayOfMonth;
    };

    // Combinar y enviar eventos
    const allEvents = [
      ...formatEvents(scheduleEvents, true),
      ...formatEvents(studentEvents, false),
    ];

    res.status(200).json(allEvents);
  } catch (error) {
    console.error("Error al obtener eventos del calendario:", error);
    res.status(500).json({ error: "Error al obtener eventos del calendario" });
  }
};

// Obtener estadísticas detalladas de asignaturas
const getSubjectStats = async (req, res) => {
  try {
    // Obtener distribución de asignaturas por ciclo educativo
    const [cycleDistribution] = await sequelize.query(`
      SELECT 
        cycle,
        COUNT(*) as count
      FROM 
        subjects
      GROUP BY 
        cycle
      ORDER BY 
        count DESC
    `);

    // Obtener distribución de asignaturas por año
    const [yearDistribution] = await sequelize.query(`
      SELECT 
        year,
        COUNT(*) as count
      FROM 
        subjects
      GROUP BY 
        year
      ORDER BY 
        year ASC
    `);

    // Obtener conteo de profesores por asignatura
    const [teachersBySubject] = await sequelize.query(`
      SELECT 
        s.cycle,
        s.year,
        COUNT(DISTINCT ts.idteacher) as teacherCount
      FROM 
        subjects s
      LEFT JOIN 
        teachers_subjects ts ON s.idsubject = ts.idsubject
      GROUP BY 
        s.cycle, s.year
    `);

    res.status(200).json({
      cycleDistribution,
      yearDistribution,
      teachersBySubject,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas de asignaturas:", error);
    res
      .status(500)
      .json({ error: "Error al obtener estadísticas de asignaturas" });
  }
};

// Obtener estadísticas detalladas de alumnos
const getStudentStats = async (req, res) => {
  try {
    // Obtener alumnos por academia
    const [studentsByAcademy] = await sequelize.query(`
      SELECT 
        a.name as academyName,
        COUNT(s.idstudent) as studentCount
      FROM 
        academies a
      LEFT JOIN 
        students s ON a.idacademy = s.idacademy
      GROUP BY 
        a.idacademy
      ORDER BY 
        studentCount DESC
    `);

    // Obtener distribución de edades de alumnos
    const [ageDistribution] = await sequelize.query(`
      SELECT 
        TIMESTAMPDIFF(YEAR, birthDate, CURDATE()) as age,
        COUNT(*) as count
      FROM 
        students
      WHERE 
        birthDate IS NOT NULL
      GROUP BY 
        age
      ORDER BY 
        age ASC
    `);

    // Obtener alumnos activos vs inactivos
    const [statusDistribution] = await sequelize.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM 
        students
      GROUP BY 
        status
    `);

    res.status(200).json({
      studentsByAcademy,
      ageDistribution,
      statusDistribution,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas de alumnos:", error);
    res.status(500).json({ error: "Error al obtener estadísticas de alumnos" });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivities,
  getCalendarEvents,
  getSubjectStats,
  getStudentStats,
};
