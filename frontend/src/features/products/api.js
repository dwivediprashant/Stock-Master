import apiClient from "../../lib/apiClient";

export const getProducts = async (params = {}) => {
  const { data } = await apiClient.get("/products", { params });
  return data;
};

export const getProduct = async (id) => {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await apiClient.post("/products", productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await apiClient.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  await apiClient.delete(`/products/${id}`);
};

export const getProductCategories = async () => {
  const { data } = await apiClient.get("/products/categories");
  return data;
};

export const getProductUnits = async () => {
  const { data } = await apiClient.get("/products/units");
  return data;
};
