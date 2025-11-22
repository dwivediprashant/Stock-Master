import apiClient, { setAuthToken } from "../../lib/apiClient";

export const getStockMoves = async () => {
  setAuthToken(localStorage.getItem("stockmaster_token"));
  const { data } = await apiClient.get("/moves");
  return data;
};
