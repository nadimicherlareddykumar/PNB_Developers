import client from './client';

export const getLayouts = async () => {
  const response = await client.get('/layouts');
  return response.data;
};

export const getLayout = async (id) => {
  const response = await client.get(`/layouts/${id}`);
  return response.data;
};

export const createLayout = async (data) => {
  const response = await client.post('/layouts', data);
  return response.data;
};

export const updateLayout = async (id, data) => {
  const response = await client.put(`/layouts/${id}`, data);
  return response.data;
};

export const deleteLayout = async (id) => {
  const response = await client.delete(`/layouts/${id}`);
  return response.data;
};

export default { getLayouts, getLayout, createLayout, updateLayout, deleteLayout };
