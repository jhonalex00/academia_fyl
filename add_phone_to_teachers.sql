-- Agregar el campo phone a la tabla teachers
ALTER TABLE teachers ADD COLUMN phone VARCHAR(20) AFTER email;

-- Verificar la estructura de la tabla
DESCRIBE teachers; 