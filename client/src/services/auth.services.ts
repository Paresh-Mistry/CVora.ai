// src/api/auth.api.ts
import { api } from "./axios";

export interface RegisterPayload {
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserOut {
  id: string;
  email: string;
  full_name: string | null;
  plan: "free" | "premium";
  is_verified: boolean;
  created_at: string;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<TokenResponse> => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<TokenResponse> => {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },

  me: async (): Promise<UserOut> => {
    const { data } = await api.get("/auth/me");
    return data;
  },

  refresh: async (refresh_token: string): Promise<TokenResponse> => {
    const { data } = await api.post("/auth/refresh", { refresh_token });
    return data;
  },
};