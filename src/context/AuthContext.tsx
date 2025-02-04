import React, { createContext, useContext, useState } from 'react';
import { AuthContextType } from '../types'; // Make sure this path is correct

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('https://localhost:44341/api/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), 
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setError('');
        return true; 
      } else if (response.status === 401) {
        setError('Invalid credentials');
      } else {
        setError('An error occurred');
        console.error('API Error:', response.status, await response.text());
      }
      return false;
    } catch (error) {
      setError('An error occurred');
      console.error('Fetch Error:', error);
      return false; 
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error }}> {/* Include error in context */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
