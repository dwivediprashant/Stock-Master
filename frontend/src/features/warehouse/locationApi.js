import axios from 'axios';

export const getLocations = async () => {
  const { data } = await axios.get('/api/locations');
  return data;
};

export const getLocation = async (id) => {
  const { data } = await axios.get(`/api/locations/${id}`);
  return data;
};

export const createLocation = async (payload) => {
  const { data } = await axios.post('/api/locations', payload);
  return data;
};

export const updateLocation = async (id, payload) => {
  const { data } = await axios.put(`/api/locations/${id}`, payload);
  return data;
};

export const deleteLocation = async (id) => {
  const { data } = await axios.delete(`/api/locations/${id}`);
  return data;
};
