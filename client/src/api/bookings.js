import client from './client';

export const getBookings = async (status, params = {}) => {
  const mergedParams = status ? { ...params, status } : params;
  const response = await client.get('/bookings', { params: mergedParams });
  return response.data.items || [];
};

export const createBooking = async (data) => {
  const response = await client.post('/bookings', data);
  return response.data;
};

export const updateBooking = async (id, status) => {
  const response = await client.put(`/bookings/${id}`, { status });
  return response.data;
};

export default { getBookings, createBooking, updateBooking };
