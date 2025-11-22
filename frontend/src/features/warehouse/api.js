import apiClient from "../../lib/apiClient";

export const getWarehouses = async () => {
  const { data } = await apiClient.get("/warehouses");
  return data;
};

export const getWarehouse = async (id) => {
  const { data } = await apiClient.get(`/warehouses/${id}`);
  return data;
};

export const createWarehouse = async (payload) => {
  const { data } = await apiClient.post("/warehouses", payload);
  return data;
};

export const updateWarehouse = async (id, payload) => {
  const { data } = await apiClient.put(`/warehouses/${id}`, payload);
  return data;
};

export const deleteWarehouse = async (id) => {
  const { data } = await apiClient.delete(`/warehouses/${id}`);
  return data;
};
