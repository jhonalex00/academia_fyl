const { sequelize } = require('./src/db/config');

async function insertSampleData() {
  console.log('🌱 Insertando datos de ejemplo en la base de datos...');
  
  try {
    // Insertar academias de ejemplo
    console.log('Insertando academias...');
    await sequelize.query(`
      INSERT IGNORE INTO academies (idacademy, name, adress, phone) VALUES
      (1, 'Academia Central', 'Calle Mayor 123', '912345678'),
      (2, 'Academia Norte', 'Avenida del Norte 45', '913456789'),
      (3, 'Academia Sur', 'Plaza del Sur 12', '914567890')
    `);
    
    // Insertar asignaturas de ejemplo
    console.log('Insertando asignaturas...');
    await sequelize.query(`
      INSERT IGNORE INTO subjects (idsubject, year, cycle) VALUES
      (1, 1, 'ESO'),
      (2, 2, 'ESO'),
      (3, 3, 'ESO'),
      (4, 4, 'ESO'),
      (5, 1, 'Bachillerato'),
      (6, 2, 'Bachillerato'),
      (7, 1, 'Primaria'),
      (8, 2, 'Primaria'),
      (9, 3, 'Primaria'),
      (10, 1, 'FP')
    `);
    
    // Insertar profesores de ejemplo
    console.log('Insertando profesores...');
    await sequelize.query(`
      INSERT IGNORE INTO teachers (idteacher, name, email, phone, status, password) VALUES
      (1, 'María García', 'maria.garcia@academia.com', '611234567', 'active', 'password123'),
      (2, 'Juan Pérez', 'juan.perez@academia.com', '622345678', 'active', 'password123'),
      (3, 'Ana López', 'ana.lopez@academia.com', '633456789', 'active', 'password123'),
      (4, 'Carlos Ruiz', 'carlos.ruiz@academia.com', '644567890', 'active', 'password123'),
      (5, 'Elena Martín', 'elena.martin@academia.com', '655678901', 'active', 'password123')
    `);
    
    // Insertar contactos de ejemplo
    console.log('Insertando contactos...');
    await sequelize.query(`
      INSERT IGNORE INTO contacts (idcontact, phone, name, email, password) VALUES
      (1, '666111222', 'Laura Fernández', 'laura.fernandez@email.com', 'password123'),
      (2, '666222333', 'Miguel Santos', 'miguel.santos@email.com', 'password123'),
      (3, '666333444', 'Carmen Jiménez', 'carmen.jimenez@email.com', 'password123')
    `);
    
    // Insertar inscripciones de ejemplo
    console.log('Insertando inscripciones...');
    await sequelize.query(`
      INSERT IGNORE INTO enrolment (idenrolment, enrolmentDate, year, school, mode, type, siblings, alone, confiscateMobile, classesApproach, pictures, socialMedia) VALUES
      (1, '2024-09-01', 2024, 'IES Ejemplo', 'Presencial', 'Grupo', 'false', 'false', 'false', 'Ambos', 'true', 'false'),
      (2, '2024-09-05', 2024, 'Colegio San José', 'Online', 'Particular', 'true', 'true', 'true', 'Resolver dudas', 'false', 'true'),
      (3, '2024-09-10', 2024, 'Instituto Cervantes', 'Mixto', 'Personalizado(2/3)', 'false', 'false', 'false', 'Hacer deberes y crear habitos de estudio', 'true', 'false')
    `);
    
    // Insertar estudiantes de ejemplo
    console.log('Insertando estudiantes...');
    await sequelize.query(`
      INSERT IGNORE INTO students (idstudent, name, surname, dni, birthDate, status, phone, email, divorced, knowUs, repeat, idacademy, idenrolment) VALUES
      (1, 'Pedro', 'González', '12345678A', '2006-03-15', 'true', '677111222', 'pedro.gonzalez@email.com', 'false', 'Recomendación', 'false', 1, 1),
      (2, 'Sofía', 'Rodríguez', '87654321B', '2005-07-22', 'true', '688222333', 'sofia.rodriguez@email.com', 'false', 'RRSS', 'false', 1, 2),
      (3, 'Alejandro', 'Moreno', '11223344C', '2007-11-08', 'true', '699333444', 'alejandro.moreno@email.com', 'true', 'Google Maps', 'false', 2, 3),
      (4, 'Lucía', 'Sánchez', '44332211D', '2006-12-03', 'true', '600444555', 'lucia.sanchez@email.com', 'false', 'Web', 'true', 2, 1),
      (5, 'Diego', 'Herrera', '55667788E', '2005-04-18', 'false', '611555666', 'diego.herrera@email.com', 'false', 'Pasé por delante de la academia', 'false', 3, 2)
    `);
    
    // Insertar horarios de ejemplo
    console.log('Insertando horarios...');
    await sequelize.query(`
      INSERT IGNORE INTO schedules (idschedule, date, weekDay, startHour, finishHour) VALUES
      (1, '2025-06-05', 'Jueves', '09:00:00', '10:30:00'),
      (2, '2025-06-05', 'Jueves', '11:00:00', '12:30:00'),
      (3, '2025-06-06', 'Viernes', '10:00:00', '11:30:00'),
      (4, '2025-06-06', 'Viernes', '16:00:00', '17:30:00'),
      (5, '2025-06-07', 'Sábado', '09:30:00', '11:00:00')
    `);
    
    // Insertar mensajes de ejemplo
    console.log('Insertando mensajes...');
    await sequelize.query(`
      INSERT IGNORE INTO messages (idmessage, message, date, idteacher, idcontact) VALUES
      (1, 'Recordar traer el material para la próxima clase', '2025-06-04 10:30:00', 1, 1),
      (2, 'Examen programado para el viernes', '2025-06-04 14:15:00', 2, 2),
      (3, 'Felicitaciones por el progreso mostrado', '2025-06-04 16:45:00', 3, 3),
      (4, 'Consulta sobre horarios de recuperación', '2025-06-04 18:20:00', 1, 2),
      (5, 'Información sobre actividades extraescolares', '2025-06-04 20:10:00', 2, 1)
    `);
    
    // Insertar relaciones profesor-asignatura
    console.log('Insertando relaciones profesor-asignatura...');
    await sequelize.query(`
      INSERT IGNORE INTO teachers_subjects (idteacher, idsubject) VALUES
      (1, 1), (1, 2),
      (2, 3), (2, 4),
      (3, 5), (3, 6),
      (4, 7), (4, 8),
      (5, 9), (5, 10)
    `);
    
    // Insertar relaciones estudiante-horario
    console.log('Insertando relaciones estudiante-horario...');
    await sequelize.query(`
      INSERT IGNORE INTO students_schedules (idstudent, idschedule, status) VALUES
      (1, 1, 'active'),
      (2, 2, 'active'),
      (3, 3, 'active'),
      (4, 4, 'active'),
      (5, 5, 'active')
    `);
    
    // Insertar relaciones profesor-horario
    console.log('Insertando relaciones profesor-horario...');
    await sequelize.query(`
      INSERT IGNORE INTO teachers_schedules (idteacher, idschedule, idacademies) VALUES
      (1, 1, 1),
      (2, 2, 1),
      (3, 3, 2),
      (4, 4, 2),
      (5, 5, 3)
    `);
    
    // Verificar los datos insertados
    console.log('\n📊 Verificando datos insertados...');
    
    const [studentCount] = await sequelize.query('SELECT COUNT(*) as count FROM students');
    const [teacherCount] = await sequelize.query('SELECT COUNT(*) as count FROM teachers');
    const [subjectCount] = await sequelize.query('SELECT COUNT(*) as count FROM subjects');
    const [academyCount] = await sequelize.query('SELECT COUNT(*) as count FROM academies');
    const [scheduleCount] = await sequelize.query('SELECT COUNT(*) as count FROM schedules');
    const [messageCount] = await sequelize.query('SELECT COUNT(*) as count FROM messages');
    
    console.log(`✅ Estudiantes: ${studentCount[0]?.count || 0}`);
    console.log(`✅ Profesores: ${teacherCount[0]?.count || 0}`);
    console.log(`✅ Asignaturas: ${subjectCount[0]?.count || 0}`);
    console.log(`✅ Academias: ${academyCount[0]?.count || 0}`);
    console.log(`✅ Horarios: ${scheduleCount[0]?.count || 0}`);
    console.log(`✅ Mensajes: ${messageCount[0]?.count || 0}`);
    
    // Mostrar distribución de asignaturas por ciclo
    console.log('\n📚 Distribución de asignaturas por ciclo:');
    const [cycleDistribution] = await sequelize.query(`
      SELECT cycle, COUNT(*) as count 
      FROM subjects 
      GROUP BY cycle 
      ORDER BY count DESC
    `);
    
    cycleDistribution.forEach(item => {
      console.log(`  - ${item.cycle}: ${item.count} asignaturas`);
    });
    
    console.log('\n🎉 ¡Datos de ejemplo insertados exitosamente!');
    console.log('Ahora puedes probar el dashboard con datos reales.');
    
  } catch (error) {
    console.error('❌ Error al insertar datos de ejemplo:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Ejecutar la inserción de datos
insertSampleData();
