import React from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/common/Header';
import HomePage from './pages/HomePage';
import ModelsPage from './pages/ModelsPage';
import OrganizationsPage from './pages/OrganizationsPage';
import TrendingPage from './pages/TrendingPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import { useAppContext } from './context/AppContext';
import './styles/globals.css';
import './styles/components.css';

const AppContent = () => {
  const { currentPage } = useAppContext();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginForm />;
      case 'register':
        return <RegisterForm />;
      case 'models':
        return <ModelsPage />;
      case 'organizations':
        return <OrganizationsPage />;
      case 'trending':
        return <TrendingPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>{renderCurrentPage()}</main>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
