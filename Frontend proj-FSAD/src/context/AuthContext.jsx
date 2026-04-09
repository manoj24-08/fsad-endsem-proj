import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('cms_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    try {
      const res = await api.login(email, password);
      const data = res.data;
      const safeUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role.toLowerCase(),
        avatar: data.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        bio: '',
        joinDate: new Date().toISOString().split('T')[0],
      };

      localStorage.setItem('cms_token', data.token);
      localStorage.setItem('cms_user', JSON.stringify(safeUser));
      setUser(safeUser);
      return { success: true, user: safeUser };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid email or password.' };
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      const res = await api.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role.toUpperCase(),
      });
      const userData = res.data;
      const safeUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role.toLowerCase(),
        avatar: userData.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        bio: '',
        joinDate: new Date().toISOString().split('T')[0],
      };

      // Auto-login after registration
      const loginRes = await api.login(data.email, data.password);
      localStorage.setItem('cms_token', loginRes.data.token);
      localStorage.setItem('cms_user', JSON.stringify(safeUser));
      setUser(safeUser);
      return { success: true, user: safeUser };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('cms_user');
    localStorage.removeItem('cms_token');
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      const res = await api.updateProfile(updates);
      const data = res.data;
      setUser((prev) => {
        const updated = {
          ...prev,
          name: data.name || prev.name,
          email: data.email || prev.email,
          ...updates,
        };
        localStorage.setItem('cms_user', JSON.stringify(updated));
        return updated;
      });
    } catch {
      // Fallback: update locally even if API fails
      setUser((prev) => {
        const updated = { ...prev, ...updates };
        localStorage.setItem('cms_user', JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
