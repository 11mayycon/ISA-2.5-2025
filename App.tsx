
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterRequest from './pages/RegisterRequest';
import WaitingRoom from './pages/WaitingRoom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import WhatsAppBot from './pages/WhatsAppBot';
import Conversations from './pages/Conversations';
import Requests from './pages/Requests';
import AdminNotices from './pages/AdminNotices';
import Profile from './pages/Profile';
import SettingsPage from './pages/SettingsPage';
import Support from './pages/Support';
import Reports from './pages/Reports';
import AiMemory from './pages/AiMemory';
import WhatsAppManager from './pages/WhatsAppManager';
import ChatWhatsApp from './pages/ChatWhatsApp';
import IaConfig from './pages/IaConfig';
import FinancialDashboard from './pages/FinancialDashboard';
import { User, UserRole } from './types';
import { NotificationProvider } from './context/NotificationContext';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('isa_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('isa_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('isa_user');
  };

  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/solicitar-acesso" element={<RegisterRequest />} />
          <Route path="/sala-de-espera" element={<WaitingRoom />} />
          
          {/* Protected Dashboard Routes */}
          <Route element={user ? <DashboardLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
            <Route path="/dashboard" element={<Dashboard user={user!} />} />
            <Route path="/ai-memory" element={<AiMemory user={user!} />} />
            <Route path="/whatsapp-manager" element={<WhatsAppManager user={user!} />} />
            <Route path="/whatsapp-chat" element={<ChatWhatsApp user={user!} />} />
            <Route path="/ia-config" element={<IaConfig user={user!} />} />
            <Route path="/financial" element={<FinancialDashboard />} />
            <Route path="/whatsapp-bot" element={<WhatsAppBot />} />
            <Route path="/conversations" element={<Conversations />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/admin-notices" element={<AdminNotices />} />
            <Route path="/profile" element={<Profile user={user!} />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/support" element={<Support user={user!} />} />
            <Route path="/reports" element={<Reports />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
};

export default App;
