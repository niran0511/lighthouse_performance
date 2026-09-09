import axios from 'axios';

const TOKEN_KEY = 'lighthouse-monitor-token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const api = axios.create({ baseURL: '/api', timeout: 30_000 });
api.interceptors.request.use((request) => {
  const token = tokenStore.get();
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

export function readApiError(error, fallback = 'Something went wrong. Please try again.') {
  return error.response?.data?.message || error.message || fallback;
}

