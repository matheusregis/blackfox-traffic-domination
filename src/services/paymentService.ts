// src/services/paymentService.ts

// Axios central do front
import axios, { AxiosError } from "axios";

export const API_URL = import.meta.env.VITE_API_URL as string;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// >>> Interceptor: injeta o Bearer token em todas as requisições <<<
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return config;
});

export function normAxiosError(e: unknown): Error {
  const ax = e as AxiosError<any>;
  const msg =
    ax?.response?.data?.message ||
    ax?.response?.data?.error ||
    ax?.message ||
    "Erro de rede";
  return new Error(msg);
}

export const payments = {
  // tokenização é feita no browser
  charge: (p: {
    amount: number;
    card_token: string;
    installments?: number;
    customer: { name: string; email: string }; // (mantido p/ não quebrar)
    billingAddress?: any;
    metadata?: Record<string, any>;
    description?: string;
  }) => api.post("/payments/charge", p),

  pix: (p: {
    amount: number;
    description?: string;
    metadata?: Record<string, any>;
    code?: string;
    customer: { name: string; document: string };
  }) => api.post("/payments/pix", p),

  // polling de status (retorna data direto)
  status: async (orderId: string) => {
    const r = await api.get<{
      order_id: string;
      order_status: string;
      charge_status?: string;
      last_update?: string;
    }>(`/payments/status/${orderId}`);
    return r.data;
  },

  // URL do SSE
  sseUrl: (orderId: string) => `${API_URL}/payments/stream/${orderId}`,
} as const;
