import api from './api';

const TOKEN_KEY = 'authToken';
const REFRESH_KEY = 'refreshToken';
const USER_KEY = 'authUser';

export const authService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setSession: ({ accessToken, refreshToken, user }) => {
    if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
  login: async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data?.accessToken) {
      authService.setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user });
    }
    return data;
  },
  me: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  refresh: async () => {
    const rt = authService.getRefresh();
    if (!rt) throw new Error('No refresh token');
    const { data } = await api.post('/auth/refresh', { refreshToken: rt });
    if (data?.accessToken) {
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      if (data.refreshToken) localStorage.setItem(REFRESH_KEY, data.refreshToken);
      if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data;
  },
  logout: async () => {
    // Clear session immediately to force ProtectedRoute to redirect
    authService.clearSession();
    // Try to notify backend, but don't block navigation if it fails or is slow
    try { await api.post('/auth/logout'); } catch (_) {}
  }
};

export default authService;
