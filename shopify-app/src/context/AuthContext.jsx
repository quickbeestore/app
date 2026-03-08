'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { customerLogin, customerRegister, customerLogout, getCustomer } from '@/lib/shopify';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load customer from cookie token on mount
  useEffect(() => {
    const token = Cookies.get('shopify_customer_token');
    if (token) {
      getCustomer(token)
        .then((c) => setCustomer(c))
        .catch(() => Cookies.remove('shopify_customer_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await customerLogin(email, password);
      if (result.customerUserErrors?.length > 0) {
        setError(result.customerUserErrors[0].message);
        return false;
      }
      const { accessToken, expiresAt } = result.customerAccessToken;
      const expires = new Date(expiresAt);
      Cookies.set('shopify_customer_token', accessToken, { expires });
      const c = await getCustomer(accessToken);
      setCustomer(c);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (firstName, lastName, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await customerRegister(firstName, lastName, email, password);
      if (result.customerUserErrors?.length > 0) {
        setError(result.customerUserErrors[0].message);
        return false;
      }
      // Auto-login after register
      return login(email, password);
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [login]);

  const logout = useCallback(async () => {
    const token = Cookies.get('shopify_customer_token');
    if (token) {
      await customerLogout(token).catch(() => {});
      Cookies.remove('shopify_customer_token');
    }
    setCustomer(null);
  }, []);

  return (
    <AuthContext.Provider value={{ customer, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
