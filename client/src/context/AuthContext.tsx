import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, AuthState } from '@/types';
import api from '@services/api';

interface SavedAccount {
  token: string;
  email: string;
  name: string;
  avatar?: string;
}

interface GoogleSignUpData {
  credential: string;
  role?: 'user' | 'trainer';
  bio?: string;
  specialties?: string[];
  experience?: number;
  phone?: string;
  certificates?: string[];
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, remember?: boolean) => Promise<User>;
  register: (name: string, email: string, password: string, role?: 'user' | 'trainer', profile?: { bio?: string; specialties?: string[]; experience?: number; phone?: string; certificates?: string[] }) => Promise<User>;
  googleLogin: (data: GoogleSignUpData) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
  savedAccounts: SavedAccount[];
  switchAccount: (token: string) => Promise<void>;
  removeSavedAccount: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadSavedAccounts(): SavedAccount[] {
  try {
    return JSON.parse(localStorage.getItem('saved_accounts') || '[]');
  } catch {
    return [];
  }
}

function saveAccountToStorage(account: SavedAccount) {
  const accounts = loadSavedAccounts().filter((a) => a.email !== account.email);
  accounts.unshift(account);
  localStorage.setItem('saved_accounts', JSON.stringify(accounts.slice(0, 5)));
}

function removeAccountFromStorage(email: string) {
  const accounts = loadSavedAccounts().filter((a) => a.email !== email);
  localStorage.setItem('saved_accounts', JSON.stringify(accounts));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
  });
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(loadSavedAccounts);

  const refreshSavedAccounts = useCallback(() => {
    setSavedAccounts(loadSavedAccounts());
  }, []);

  const setAuth = useCallback((user: User | null, token: string | null) => {
    setState({
      user,
      token,
      isAuthenticated: !!user,
      isLoading: false,
    });
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  const loadUserByToken = useCallback(async (token: string): Promise<User> => {
    const res = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUserByToken(token)
        .then((user) => setAuth(user, token))
        .catch(() => {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [setAuth, loadUserByToken]);

  const login = async (email: string, password: string, remember?: boolean) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: loggedInUser, token: newToken } = res.data.data;
    setAuth(loggedInUser, newToken);
    if (remember) {
      saveAccountToStorage({ token: newToken, email: loggedInUser.email, name: loggedInUser.name, avatar: loggedInUser.avatar });
      refreshSavedAccounts();
    }
    return loggedInUser;
  };

  const register = async (name: string, email: string, password: string, role?: 'user' | 'trainer', profile?: { bio?: string; specialties?: string[]; experience?: number; phone?: string; certificates?: string[] }) => {
    const res = await api.post('/auth/register', { name, email, password, role, ...profile });
    const { user: newUser, token: newToken } = res.data.data;
    if (newToken) {
      setAuth(newUser, newToken);
      saveAccountToStorage({ token: newToken, email: newUser.email, name: newUser.name, avatar: newUser.avatar });
      refreshSavedAccounts();
    }
    return newUser;
  };

  const googleLogin = useCallback(async (data: GoogleSignUpData) => {
    const res = await api.post('/auth/google', data);
    const { user: googleUser, token: googleToken } = res.data.data;
    if (googleToken) {
      setAuth(googleUser, googleToken);
      saveAccountToStorage({ token: googleToken, email: googleUser.email, name: googleUser.name, avatar: googleUser.avatar });
      refreshSavedAccounts();
    }
    return googleUser;
  }, []);

  const logout = () => {
    setAuth(null, null);
  };

  const switchAccount = async (token: string) => {
    try {
      const accountUser = await loadUserByToken(token);
      setAuth(accountUser, token);
    } catch {
      const accounts = loadSavedAccounts();
      const failed = accounts.find((a) => a.token === token);
      if (failed) {
        console.warn(`Saved account "${failed.email}" has an expired or invalid token — removing from saved list.`);
        removeSavedAccount(failed.email);
      }
    }
  };

  const removeSavedAccount = (email: string) => {
    removeAccountFromStorage(email);
    refreshSavedAccounts();
  };

  const updateUser = (user: User) => {
    setState((prev) => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, googleLogin, logout, updateUser, savedAccounts, switchAccount, removeSavedAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
