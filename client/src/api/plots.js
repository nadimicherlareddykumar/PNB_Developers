import client from './client';

export const createPlot = async (data) => {
  const response = await client.post('/plots', data);
  return response.data;
};

export const updatePlot = async (id, data) => {
  const response = await client.put(`/plots/${id}`, data);
  return response.data;
};

export const deletePlot = async (id) => {
  const response = await client.delete(`/plots/${id}`);
  return response.data;
};

export default { createPlot, updatePlot, deletePlot };
