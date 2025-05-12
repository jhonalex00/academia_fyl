import { NextResponse } from 'next/server';
const { getCurrentUser } = require('@/api/controllers/authController');
const { authenticate } = require('@/middleware/auth');

// Función para manejar las solicitudes a la API
export async function GET(request) {
  try {
    // Crear un objeto req y res simulado compatible con Express
    const req = {
      headers: {
        authorization: request.headers.get('authorization')
      },
      user: null // Será establecido por el middleware authenticate
    };
    
    // Objeto para capturar la respuesta
    let statusCode = 200;
    let responseBody = {};
    
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        responseBody = data;
        return res;
      }
    };
    
    // Secuencia de middleware
    const next = (error) => {
      if (error) {
        res.status(401).json({ error: 'No autorizado' });
        return;
      }
      // Si no hay error, continuamos con el controlador
      getCurrentUser(req, res);
    };
    
    // Ejecutar middleware de autenticación
    authenticate(req, res, next);
    
    // Devolver respuesta en formato NextResponse
    return NextResponse.json(responseBody, { status: statusCode });
  } catch (error) {
    console.error('Error en la ruta de usuario actual:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
