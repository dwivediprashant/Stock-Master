import apiClient, { setAuthToken } from "../../lib/apiClient";

export const getProducts = async (params = {}) => {
  setAuthToken(localStorage.getItem("stockmaster_token"));
  const { data } = await apiClient.get("/products", { params });
  return data;
};

export const getProduct = async (id) => {
  setAuthToken(localStorage.getItem("stockmaster_token"));
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
};

export const createProduct = async (productData) => {
  setAuthToken(localStorage.getItem("stockmaster_token"));
  const { data } = await apiClient.post("/products", productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  setAuthToken(localStorage.getItem("stockmaster_token"));
  const { data } = await apiClient.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  setAuthToken(localStorage.getItem("stockmaster_token"));
  await apiClient.delete(`/products/${id}`);
};

export const getProductCategories = async () => {
  setAuthToken(localStorage.getItem("stockmaster_token"));
  const { data } = await apiClient.get("/products/categories");
  return data;
};

export const getProductUnits = async () => {
  setAuthToken(localStorage.getItem("stockmaster_token"));
  const { data } = await apiClient.get("/products/units");
  return data;
};
