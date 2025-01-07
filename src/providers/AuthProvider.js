// src/contexts/AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../configs/authConfig';
import { useMsal } from "@azure/msal-react";
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
  };
  
export function AuthProvider ({ children }) {
    const [user, setUser] = useState(null);
    const { instance, accounts } = useMsal();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);
    
    // useEffect(() => {
    //   const account = accounts[0];
    //   if (account) {
    //     setUser(account);
    //     // Store user information in local storage
    //     localStorage.setItem('user', JSON.stringify(account));
    //   }
    // }, [accounts]);
  
    const login= (userData) => {
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData)); // Store user data in local storage
        }

    const logout = () => {
      instance.logout();
      setUser(null);
      localStorage.removeItem('user');
    };
  
    return (
      <AuthContext.Provider value={{setUser, user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };