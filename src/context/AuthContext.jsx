import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/authAPI.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        setToken(storedToken);
        
        try {
          // Validate token by fetching current user
          const response = await authAPI.getCurrentUser();
          setUser(response.data.user);
        } catch (error) {
          console.error('Token validation error:', error);
          
          // Only remove token on 401 Unauthorized (invalid/expired token)
          // Keep token for other errors (network issues, server down, etc.)
          if (error.response?.status === 401 || error.status === 401) {
            console.log('Token is invalid or expired, removing...');
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          } else {
            // For other errors, keep the token but log the issue
            console.warn('Token validation failed but keeping token. Error:', error.message);
            // Don't set user data, but keep token for future requests
          }
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data) => {
    try {
      const response = await authAPI.signup(data);
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // Method to refresh user data (useful for profile updates)
  const refreshUser = async () => {
    if (!token) return;
    
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // Don't logout on refresh failure unless it's a 401
      if (error.response?.status === 401 || error.status === 401) {
        logout();
      }
      throw error;
    }
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    refreshUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};