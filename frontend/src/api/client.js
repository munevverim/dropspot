// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

// Her isteğe otomatik token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dropspot_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
