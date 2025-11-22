import apiClient, { setAuthToken } from "../../lib/apiClient";

export const getOperations = async (type) => {
  setAuthToken(localStorage.getItem("stockmaster_token"));
  const { data } = await apiClient.get("/operations", { params: { type } });
  return data;
};

export const getOperation = async (id) => {
  setAuthToken(localStorage.getItem("stockmaster_token"));
  const { data } = await apiClient.get(`/operations/${id}`);
  return data;
};

export const createOperation = async (operationData) => {
  setAuthToken(localStorage.getItem("stockmaster_token"));
  const { data } = await apiClient.post("/operations", operationData);
  return data;
};

export const updateOperation = async (id, operationData) => {
  setAuthToken(localStorage.getItem("stockmaster_token"));
  const { data } = await apiClient.put(`/operations/${id}`, operationData);
  return data;
};

export const validateOperation = async (id) => {
  setAuthToken(localStorage.getItem("stockmaster_token"));
  const { data } = await apiClient.post(`/operations/${id}/validate`);
  return data;
};
