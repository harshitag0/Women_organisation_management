import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const interceptorRef = useRef(null);

  const logout = () => {
    sessionStorage.removeItem('userInfo');
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  useEffect(() => {
    // Clear any old localStorage session data
    localStorage.removeItem('userInfo');

    const storedUser = sessionStorage.getItem('userInfo');
    if (storedUser) {
      try {
        setUserInfo(JSON.parse(storedUser));
      } catch {
        sessionStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Global axios interceptor: automatically logout on any 401 response
    // This handles stale tokens (e.g. after DB re-seed) gracefully
    interceptorRef.current = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const requestUrl = error.config?.url || '';
        // Do NOT intercept 401s from the auth endpoints themselves
        // (login failure, register blocked, etc.) — let the caller handle them
        const isAuthEndpoint = requestUrl.includes('/api/auth/login') || requestUrl.includes('/api/auth/register');
        if (error.response?.status === 401 && !isAuthEndpoint) {
          sessionStorage.removeItem('userInfo');
          localStorage.removeItem('userInfo');
          setUserInfo(null);
          // Redirect to login only if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Cleanup interceptor on unmount
      if (interceptorRef.current !== null) {
        axios.interceptors.response.eject(interceptorRef.current);
      }
    };
  }, []);

  const login = async (identifier, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      // Send as 'identifier' so backend can match by username OR email
      const { data } = await axios.post('/api/auth/login', { identifier, password }, config);
      setUserInfo(data);
      sessionStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };

  return (
    <AuthContext.Provider value={{ userInfo, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
