// src/api/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// ── Attach access token to every request ──────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auto-refresh on 401 ───────────────────────────────────────────────────────
let refreshing = false;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry && !refreshing) {
      original._retry = true;
      refreshing = true;

      try {
        const refresh_token = localStorage.getItem("refresh_token");
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1"}/auth/refresh`,
          { refresh_token }
        );
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original);
      } catch {
        // Refresh failed → log user out
        localStorage.clear();
        window.location.href = "/login";
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(error);
  }
);