// Importar todos los modelos
const Academia = require('./Academia');
const Contacto = require('./Contacto');
const Estudiante = require('./Estudiante');
const Horario = require('./Horario');
const HorarioEstudiante = require('./HorarioEstudiante');
const Asignatura = require('./Curso');
const Mensaje = require('./Mensaje');
const Profesor = require('./Profesor');
const Usuario = require('./Usuario');

// Definir las asociaciones
// Estudiante - Contacto (uno a muchos)
Estudiante.hasMany(Contacto, { foreignKey: 'idstudent' });
Contacto.belongsTo(Estudiante, { foreignKey: 'idstudent' });

// Contacto - Mensaje (uno a muchos)
Contacto.hasMany(Mensaje, { foreignKey: 'idcontact' });
Mensaje.belongsTo(Contacto, { foreignKey: 'idcontact' });

// Profesor - Mensaje (uno a muchos)
Profesor.hasMany(Mensaje, { foreignKey: 'idteacher' });
Mensaje.belongsTo(Profesor, { foreignKey: 'idteacher' });

// Estudiante - Horario - Asignatura (muchos a muchos)
HorarioEstudiante.belongsTo(Estudiante, { foreignKey: 'idstudent' });
HorarioEstudiante.belongsTo(Horario, { foreignKey: 'idschedule' });
HorarioEstudiante.belongsTo(Asignatura, { foreignKey: 'idsubject' });

Estudiante.hasMany(HorarioEstudiante, { foreignKey: 'idstudent' });
Horario.hasMany(HorarioEstudiante, { foreignKey: 'idschedule' });
Asignatura.hasMany(HorarioEstudiante, { foreignKey: 'idsubject' });

module.exports = {
  Academia,
  Contacto,
  Estudiante,
  Horario,
  HorarioEstudiante,
  Asignatura,
  Mensaje,
  Profesor,
  Usuario
};