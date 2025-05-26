-- Crear la tabla teacher_subjects para relacionar profesores con asignaturas
CREATE TABLE IF NOT EXISTS `teacher_subjects` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `teacher_id` INT(10) NOT NULL,
  `subject_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `teacher_id` (`teacher_id`),
  CONSTRAINT `fk_teacher_subjects_teacher` 
    FOREIGN KEY (`teacher_id`) 
    REFERENCES `teachers` (`idteacher`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) 
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB;

-- Verificar que la tabla se creó correctamente
DESCRIBE teacher_subjects; 