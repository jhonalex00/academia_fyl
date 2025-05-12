// services/profesores.js
import axios from 'axios';

export const crearProfesor = async (datos) => {
  try {
    const response = await axios.post('/api/profesores', datos);
    return response.data;
  } catch (error) {
    console.error('Error al crear profesor:', error);
    throw error;
  }
};
