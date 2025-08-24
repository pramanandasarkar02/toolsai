import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Context implementation will go here

  const value = {
    user,
    isAuthenticated,
    currentPage,
    setCurrentPage,
    loading,
    setLoading,
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
