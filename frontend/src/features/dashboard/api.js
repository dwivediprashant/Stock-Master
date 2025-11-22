import apiClient, { setAuthToken } from "../../lib/apiClient";

export const getDashboardStats = async () => {
  setAuthToken(localStorage.getItem("stockmaster_token"));
  const { data } = await apiClient.get("/dashboard");
  return data;
};
