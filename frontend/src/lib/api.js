import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para tratar erros
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || error.message || 'Erro desconhecido';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;
