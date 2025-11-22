import apiClient from "../../lib/apiClient";

export const login = async (credentials) => {
  const { data } = await apiClient.post("/auth/login", credentials);
  return data;
};

export const signup = async (userData) => {
  const { data } = await apiClient.post("/auth/signup", userData);
  return data;
};

export const getMe = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await apiClient.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (payload) => {
  const { data } = await apiClient.post("/auth/reset-password", payload);
  return data;
};
