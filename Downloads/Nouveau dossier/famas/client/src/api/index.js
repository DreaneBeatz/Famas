import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: API_URL });

// Injecter le token JWT pour les requêtes admin
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('famas_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Vehicles
export const getVehicles = (params) => api.get('/vehicles', { params });
export const getRecentVehicles = () => api.get('/vehicles/recent');
export const getVehicle = (id) => api.get(`/vehicles/${id}`);
export const getBrands = () => api.get('/vehicles/brands');
export const createVehicle = (data) => api.post('/vehicles', data);
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);

// Appointments
export const createAppointment = (data) => api.post('/appointments', data);
export const getAppointments = () => api.get('/appointments');
export const updateAppointmentStatus = (id, status) => api.patch(`/appointments/${id}/status`, { status });
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const setupAdmin = (data) => api.post('/auth/setup', data);
