import axios from 'axios';

export const getWarehouses = async () => {
  const { data } = await axios.get('/api/warehouses');
  return data;
};

export const getWarehouse = async (id) => {
  const { data } = await axios.get(`/api/warehouses/${id}`);
  return data;
};

export const createWarehouse = async (payload) => {
  const { data } = await axios.post('/api/warehouses', payload);
  return data;
};

export const updateWarehouse = async (id, payload) => {
  const { data } = await axios.put(`/api/warehouses/${id}`, payload);
  return data;
};

export const deleteWarehouse = async (id) => {
  const { data } = await axios.delete(`/api/warehouses/${id}`);
  return data;
};
