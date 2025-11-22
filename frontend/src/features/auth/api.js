import apiClient from "../../lib/apiClient";

export const authApi = {
  signup(data) {
    return apiClient.post("/auth/signup", data);
  },
  login(data) {
    return apiClient.post("/auth/login", data);
  },
  getMe() {
    return apiClient.get("/auth/me");
  },
  requestPasswordReset(data) {
    return apiClient.post("/auth/request-reset", data);
  },
  resetPassword(data) {
    return apiClient.post("/auth/reset-password", data);
  },
};
