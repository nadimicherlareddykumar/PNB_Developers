import axios from 'axios';

const client = axios.create({
  baseURL: '/api'
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('pnd_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pnd_token');
      localStorage.removeItem('pnd_agent');
      if (window.location.pathname.startsWith('/agent')) {
        window.location.href = '/agent/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
