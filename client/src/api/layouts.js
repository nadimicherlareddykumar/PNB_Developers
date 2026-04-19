import client from './client';

export const getLayouts = async (params = {}) => {
  const response = await client.get('/layouts', { params });
  return response.data.items || [];
};

export const getLayout = async (id, params = {}) => {
  const response = await client.get(`/layouts/${id}`, { params });
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
