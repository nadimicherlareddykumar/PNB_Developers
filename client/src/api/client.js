import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config || {};
    const shouldRetry = !error.response || error.response.status >= 500;

    if (shouldRetry) {
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount < 2) {
        config.__retryCount += 1;
        await new Promise((resolve) => setTimeout(resolve, 300 * config.__retryCount));
        return client(config);
      }
    }

    if (error.response?.status === 401 && window.location.pathname.startsWith('/agent')) {
      localStorage.removeItem('pnd_agent');
      window.location.href = '/agent/login';
    }

    return Promise.reject(error);
  }
);

export default client;
