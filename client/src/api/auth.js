import client from './client';

export const login = async (email, password) => {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
};

export const signup = async (payload) => {
  const response = await client.post('/auth/signup', payload);
  return response.data;
};

export const me = async () => {
  const response = await client.get('/auth/me');
  return response.data;
};

export const logout = async () => {
  await client.post('/auth/logout');
};

export default { login, signup, me, logout };
