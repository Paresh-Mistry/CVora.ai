import { api } from "./axios";

export interface RegisterPayload {
  email: string;
  password: string;
  full_name?: string;
  image?: File | null | string;
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
  image: File | null | string;
  plan: "free" | "premium";
  is_verified: boolean;
  created_at: string;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<TokenResponse> => {
    const formData = new FormData();
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    if (payload.full_name) {
      formData.append("full_name", payload.full_name);
    }
    if (payload.image) {
      formData.append("image", payload.image);
    }

    const { data } = await api.post("/auth/register", formData, {
      headers: { "Content-Type": undefined },
    });
    console.log("Register response:", data);
    return data;
  },

  login: async (payload: LoginPayload): Promise<TokenResponse> => {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
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
