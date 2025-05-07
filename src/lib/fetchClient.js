'use client';

// URL base de la API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Cliente HTTP centralizado para realizar peticiones a la API
 */
export const fetchWithAuth = async (url, options = {}) => {
  // Obtener token del localStorage (solo en cliente)
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  // Opciones por defecto para fetch
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  };

  // Combinar opciones proporcionadas con las predeterminadas
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  };

  try {
    const response = await fetch(url, fetchOptions);
    
    // Si es un error de autorización y estamos en el cliente, redirigir al login
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Sesión expirada o no válida. Por favor, inicia sesión de nuevo.');
    }
    
    return response;
  } catch (error) {
    console.error('Error en la petición:', error);
    throw error;
  }
};

/**
 * Petición GET con autenticación
 */
export const apiGet = async (endpoint) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      console.error(`Error en la petición GET a ${endpoint}`, response.status);
      throw new Error(`Error en la petición GET a ${endpoint} (${response.status})`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error al obtener ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Petición POST con autenticación
 */
export const apiPost = async (endpoint, data) => {
  const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(`Error en la petición POST a ${endpoint}`);
  }
  return response.json();
};

/**
 * Petición PUT con autenticación
 */
export const apiPut = async (endpoint, data) => {
  const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(`Error en la petición PUT a ${endpoint}`);
  }
  return response.json();
};

/**
 * Petición DELETE con autenticación
 */
export const apiDelete = async (endpoint) => {
  const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(`Error en la petición DELETE a ${endpoint}`);
  }
  return response.json();
};
