import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
let csrfToken = null;

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

client.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase();
  if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(method)) {
    config.headers['x-csrf-token'] = csrfToken;
  }
  return config;
});

client.interceptors.response.use(
  (response) => {
    const nextToken = response.headers?.['x-csrf-token'];
    if (nextToken) {
      csrfToken = nextToken;
    }
    return response;
  },
  async (error) => {
    const config = error.config || {};
    const nextToken = error.response?.headers?.['x-csrf-token'];
    if (nextToken) {
      csrfToken = nextToken;
    }
    const shouldRetry = !error.response || error.response.status >= 500;

    if (shouldRetry) {
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount < 2) {
        config.__retryCount += 1;
        await new Promise((resolve) => setTimeout(resolve, 300 * config.__retryCount));
        return client(config);
      }
    }

    if (error.response?.status === 401 && window.location.pathname.startsWith('/agent') && window.location.pathname !== '/agent/login') {
      localStorage.removeItem('pnb_agent');
      window.location.href = '/agent/login';
    }

    return Promise.reject(error);
  }
);

export default client;
