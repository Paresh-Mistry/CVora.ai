// src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi, LoginPayload, RegisterPayload } from "../services/auth.services";
import { queryKeys } from "../lib/queryKeys";

// ── Current user ──────────────────────────────────────────────────────────────

export function useUser() {
  return useQuery({
    queryKey: queryKeys.user(),
    queryFn:  authApi.me,
    // Only fetch if a token exists
    enabled:  !!localStorage.getItem("access_token"),
    staleTime: 5 * 60 * 1000,   // 5 min — user data rarely changes
    retry: false,                // don't retry on 401 (interceptor handles it)
  });
}

// ── Register ──────────────────────────────────────────────────────────────────

export function useRegister() {
  const queryClient = useQueryClient();
  const navigate    = useNavigate();
  

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),

    onSuccess: (tokens) => {
      localStorage.setItem("access_token",  tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
      queryClient.invalidateQueries({ queryKey: queryKeys.user() });
      navigate("/");
    },

    onError: (err: any) => {
      console.error("Register failed:", err.response?.data?.detail ?? err.message);
    },
  });
}

// ── Login ─────────────────────────────────────────────────────────────────────

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate    = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),

    onSuccess: (tokens) => {
      localStorage.setItem("access_token",  tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
      queryClient.invalidateQueries({ queryKey: queryKeys.user() });
      navigate("/builder");
    },

    onError: (err: any) => {
      console.error("Login failed:", err.response?.data?.detail ?? err.message);
    },
  });
}

// ── Logout ────────────────────────────────────────────────────────────────────

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate    = useNavigate();

  return () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    queryClient.clear();         // wipe all cached data
    navigate("/login");
  };
}