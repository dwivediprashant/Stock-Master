import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../features/auth/api";
import apiClient, { setAuthToken } from "../lib/apiClient";

const AuthContext = createContext(null);

const STORAGE_KEY = "stockmaster_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(STORAGE_KEY);
    if (!storedToken) {
      setInitializing(false);
      return;
    }

    setAuthToken(storedToken);

    authApi
      .getMe()
      .then((res) => {
        setUser(res.data.user);
        setToken(storedToken);
      })
      .catch(() => {
        window.localStorage.removeItem(STORAGE_KEY);
        setAuthToken(null);
      })
      .finally(() => {
        setInitializing(false);
      });
  }, []);

  const handleAuthSuccess = (payload) => {
    const { user: nextUser, token: nextToken } = payload;
    setUser(nextUser);
    setToken(nextToken);
    window.localStorage.setItem(STORAGE_KEY, nextToken);
    setAuthToken(nextToken);
  };

  const signup = async (name, email, password) => {
    const response = await authApi.signup({ name, email, password });
    handleAuthSuccess(response.data);
  };

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    handleAuthSuccess(response.data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
  };

  const requestPasswordReset = (email) =>
    authApi.requestPasswordReset({ email }).then((res) => res.data);

  const resetPassword = (email, otp, newPassword) =>
    authApi.resetPassword({ email, otp, newPassword }).then((res) => res.data);

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
      requestPasswordReset,
      resetPassword,
      apiClient,
    }),
    [user, token, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
